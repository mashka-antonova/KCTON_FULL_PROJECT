import { memo, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import chroma from "chroma-js";
import "leaflet/dist/leaflet.css";
import { formatPopulation } from "../../utils/dataHelpers";

interface RegionProperties {
  region: string;
  population: number;
  area_km2: number;
  density: number;
}

interface RegionFeature {
  type: "Feature";
  properties: RegionProperties;
  geometry: { type: string; coordinates: unknown };
}

interface GeoJSONData {
  type: "FeatureCollection";
  features: RegionFeature[];
}

interface LegendStop {
  color: string;
  label: string;
}

function buildLegend(limits: number[], scale: chroma.Scale): LegendStop[] {
  return limits.slice(0, -1).map((lo, i) => {
    const hi = limits[i + 1];
    const mid = (lo + hi) / 2;
    const loLabel = lo >= 1000 ? `${(lo / 1000).toFixed(0)}K` : String(Math.round(lo));
    const hiLabel = hi >= 1000 ? `${(hi / 1000).toFixed(0)}K` : String(Math.round(hi));
    return {
      color: scale(mid).hex(),
      label: `${loLabel}–${hiLabel}`,
    };
  });
}

/**
 * Standalone choropleth map that fetches region-level population density
 * from the bundled GeoJSON file. Uses chroma-js quantile scale (OrRd) for
 * smooth colour gradients across Russia's 85 federal subjects.
 */
export const PopulationMap = memo(function PopulationMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [legend, setLegend] = useState<LegendStop[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    let cancelled = false;

    (async () => {
      try {
        const [geoRes, L] = await Promise.all([
          fetch("/data/regions_with_density.geojson"),
          import("leaflet"),
        ]);

        if (cancelled) return;

        const geoData: GeoJSONData = await geoRes.json();
        if (cancelled || !mapContainerRef.current || mapInstanceRef.current) return;

        // Build quantile colour scale from actual data
        const densities = geoData.features
          .map((f) => f.properties.density)
          .filter((d) => isFinite(d) && d > 0);

        const limits = chroma.limits(densities, "q", 7);
        const colorScale = chroma.scale("OrRd").classes(limits);

        setLegend(buildLegend(limits, colorScale));

        // Fix bundler-broken default icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        const map = L.map(mapContainerRef.current!, {
          center: [61.0, 60.0],
          zoom: 3,
          zoomControl: true,
          attributionControl: false,
          minZoom: 2,
        });

        // CartoDB Positron — clean light basemap, ideal for choropleth
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
          { attribution: "© CARTO © OpenStreetMap contributors" }
        ).addTo(map);

        mapInstanceRef.current = map;

        const getColor = (density: number): string =>
          colorScale(Math.max(density, limits[0])).hex();

        const geoLayer = L.geoJSON(geoData as any, {
          style: (feature) => ({
            fillColor: getColor(feature?.properties?.density ?? 0),
            fillOpacity: 0.72,
            color: "#ffffff",
            weight: 0.8,
          }),
          onEachFeature: (feature, layer) => {
            const { region, density, population } =
              feature.properties as RegionProperties;
            const fillColor = getColor(density);

            layer.bindTooltip(
              `<div style="
                background:white;
                border:1px solid #e2e8f0;
                border-radius:10px;
                padding:10px 13px;
                color:#1e293b;
                font-family:Inter,system-ui,sans-serif;
                min-width:170px;
                box-shadow:0 4px 12px rgba(0,0,0,0.12);
              ">
                <div style="font-weight:700;font-size:13px;margin-bottom:7px;color:${fillColor};filter:brightness(0.75)">
                  ${region}
                </div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
                  <span style="color:#64748b">Численность</span>
                  <span style="font-weight:600">${formatPopulation(population)}</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:12px">
                  <span style="color:#64748b">Плотность</span>
                  <span style="font-weight:600">${density.toLocaleString("ru-RU")} чел/км²</span>
                </div>
              </div>`,
              { sticky: true, opacity: 1, className: "pm-tooltip" }
            );

            layer.on("mouseover", (e: any) => {
              e.target.setStyle({
                fillOpacity: 0.9,
                weight: 2,
                color: "#334155",
              });
              e.target.bringToFront();
            });
            layer.on("mouseout", (e: any) => {
              e.target.setStyle({ fillOpacity: 0.72, weight: 0.8, color: "#ffffff" });
            });
          },
        }).addTo(map);

        if (geoData.features.length > 0) {
          try {
            map.fitBounds(geoLayer.getBounds(), { padding: [24, 24] });
          } catch {}
        }

        if (!cancelled) setIsLoading(false);
      } catch {
        if (!cancelled) {
          setError("Не удалось загрузить данные карты");
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 w-full h-full min-h-[420px] relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 shadow-sm">
      {/* Scoped Leaflet overrides */}
      <style>{`
        .pm-tooltip { background: transparent !important; border: none !important; box-shadow: none !important; }
        .leaflet-container { background: #f1f5f9 !important; }
        .leaflet-control-zoom { border: none !important; box-shadow: 0 1px 4px rgba(0,0,0,0.12) !important; border-radius: 10px !important; overflow: hidden; }
        .leaflet-control-zoom a { background: white !important; color: #475569 !important; border-color: #e2e8f0 !important; }
        .leaflet-control-zoom a:hover { background: #f8fafc !important; color: #1e293b !important; }
        .leaflet-control-zoom-in { border-radius: 10px 10px 0 0 !important; }
        .leaflet-control-zoom-out { border-radius: 0 0 10px 10px !important; }
      `}</style>

      {/* Map title */}
      <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
        <h2 className="text-base font-bold tracking-tight text-slate-800 dark:text-white leading-tight">
          Плотность населения по субъектам РФ
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          85 федеральных субъектов · чел/км²
        </p>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-7 h-7 text-orange-500 animate-spin" />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Загрузка карты…
            </span>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center">
          <p className="text-sm text-rose-500">{error}</p>
        </div>
      )}

      {/* Leaflet container */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 z-0"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Legend */}
      {!isLoading && legend.length > 0 && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-xl p-3 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
            Плотность населения
          </p>
          <div className="flex flex-col gap-1.5">
            {legend.map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className="w-4 h-3 rounded-sm shrink-0"
                  style={{ background: color, border: "1px solid rgba(0,0,0,0.08)" }}
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-300">
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
