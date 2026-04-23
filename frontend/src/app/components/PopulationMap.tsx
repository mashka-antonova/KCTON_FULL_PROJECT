import { memo, useEffect, useRef, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import chroma from "chroma-js";
import "leaflet/dist/leaflet.css";
import { formatPopulation } from "../../utils/dataHelpers";

interface RegionProperties {
  region: string;
  population: number;
  area_km2: number;
  density: number;
}

interface GeoJSONData {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: RegionProperties;
    geometry: { type: string; coordinates: unknown };
  }>;
}

interface LegendStop {
  color: string;
  label: string;
}

function buildLegend(limits: number[], scale: chroma.Scale): LegendStop[] {
  return limits.slice(0, -1).map((lo, i) => {
    const hi = limits[i + 1];
    const midVal = (lo + hi) / 2;
    const fmt = (v: number) =>
      v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(Math.round(v));
    return { color: scale(midVal).hex(), label: `${fmt(lo)}–${fmt(hi)}` };
  });
}

/**
 * Standalone choropleth map.
 * Fetches regions_with_density.json (85 subjects of RF) from /public/data,
 * builds a quantile OrRd colour scale via chroma-js, and renders with Leaflet.
 */
export const PopulationMap = memo(function PopulationMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [legend, setLegend] = useState<LegendStop[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Load Leaflet and GeoJSON data in parallel
        const [L, res] = await Promise.all([
          import("leaflet"),
          fetch("/data/regions_with_density.json"),
        ]);

        if (cancelled) return;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const geo: GeoJSONData = await res.json();
        if (cancelled) return;

        // Ensure the DOM node exists and map hasn't been created yet
        if (!containerRef.current || mapRef.current) return;

        // Fix Leaflet default icon paths broken by bundlers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        // Build 9-class quantile colour scale from actual data.
        // Custom palette extends OrRd into very dark burgundy/near-black
        // so high-density regions (Moscow, SPb) stand out clearly.
        const densities = geo.features
          .map((f) => f.properties.density)
          .filter((d) => Number.isFinite(d) && d > 0);

        const limits = chroma.limits(densities, "q", 9);
        const scale = chroma
          .scale([
            "#FFF7EC", "#FEE8C8", "#FDD49E", "#FDBB84",
            "#FC8D59", "#E34A33", "#B30000", "#7F0000", "#3D0000",
          ])
          .classes(limits);
        setLegend(buildLegend(limits, scale));

        const getColor = (d: number) =>
          scale(Math.max(d, limits[0])).hex();

        // Create map
        const map = L.map(containerRef.current, {
          center: [64.0, 97.0],
          zoom: 3,
          minZoom: 2,
          zoomControl: true,
          attributionControl: false,
        });
        mapRef.current = map;

        // Light tile layer (CartoDB Positron)
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
          { attribution: "© CARTO © OpenStreetMap" }
        ).addTo(map);

        // GeoJSON choropleth layer
        const geoLayer = L.geoJSON(geo as any, {
          style: (feat) => ({
            fillColor: getColor(feat?.properties?.density ?? 0),
            fillOpacity: 0.75,
            color: "#ffffff",
            weight: 0.7,
          }),
          onEachFeature: (feat, layer) => {
            const p = feat.properties as RegionProperties;
            const col = getColor(p.density);

            layer.bindTooltip(
              `<div style="
                background:#fff;
                border:1px solid #e2e8f0;
                border-radius:10px;
                padding:10px 13px;
                color:#1e293b;
                font-family:Inter,system-ui,sans-serif;
                min-width:175px;
                box-shadow:0 4px 14px rgba(0,0,0,0.12);
                pointer-events:none;
              ">
                <div style="font-weight:700;font-size:13px;margin-bottom:7px;color:${chroma(col).darken(0.8).hex()}">
                  ${p.region}
                </div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
                  <span style="color:#64748b">Население</span>
                  <span style="font-weight:600">${formatPopulation(p.population)}</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:12px">
                  <span style="color:#64748b">Плотность</span>
                  <span style="font-weight:600">${p.density.toLocaleString("ru-RU", { maximumFractionDigits: 1 })} чел/км²</span>
                </div>
              </div>`,
              { sticky: true, opacity: 1, className: "pm-tt" }
            );

            layer.on("mouseover", (e: any) => {
              e.target.setStyle({ fillOpacity: 0.92, weight: 2, color: "#334155" });
              e.target.bringToFront();
            });
            layer.on("mouseout", (e: any) => {
              e.target.setStyle({ fillOpacity: 0.75, weight: 0.7, color: "#ffffff" });
            });
          },
        }).addTo(map);

        // Fit view to Russia
        try {
          map.fitBounds(geoLayer.getBounds(), { padding: [16, 16] });
        } catch (_) { /* ignore if no features */ }

        if (!cancelled) setStatus("ready");
      } catch (err) {
        if (!cancelled) setStatus("error");
        console.error("[PopulationMap]", err);
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-sm">
      {/* Leaflet overrides */}
      <style>{`
        .pm-tt { background:transparent!important; border:none!important; box-shadow:none!important; }
        .leaflet-container { background:#e8edf2!important; font-family:Inter,system-ui,sans-serif!important; }
        .leaflet-control-zoom { border:none!important; box-shadow:0 1px 5px rgba(0,0,0,.15)!important; border-radius:10px!important; overflow:hidden; }
        .leaflet-control-zoom a { background:#fff!important; color:#475569!important; border-color:#e2e8f0!important; }
        .leaflet-control-zoom a:hover { background:#f1f5f9!important; color:#0f172a!important; }
      `}</style>

      {/* Map DOM target — must be full-size */}
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />

      {/* Overlaid title (above the map via z-index) */}
      <div className="absolute top-4 left-4 z-[400] pointer-events-none bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-slate-200 dark:border-white/10 shadow-sm">
        <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
          Плотность населения
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          85 субъектов РФ · чел/км²
        </p>
      </div>

      {/* Loading state */}
      {status === "loading" && (
        <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center gap-3 bg-slate-50/90 dark:bg-slate-900/80 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Загрузка карты…
          </span>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center gap-2">
          <AlertCircle className="w-8 h-8 text-rose-500" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Не удалось загрузить данные карты
          </p>
        </div>
      )}

      {/* Legend */}
      {status === "ready" && legend.length > 0 && (
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-xl p-3 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
            Плотность (чел/км²)
          </p>
          <div className="flex flex-col gap-1.5">
            {legend.map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className="w-4 h-3 rounded-sm shrink-0"
                  style={{ background: color, outline: "1px solid rgba(0,0,0,0.08)" }}
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-none">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
