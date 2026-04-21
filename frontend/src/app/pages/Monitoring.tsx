import { useState, useEffect, useCallback } from "react";
import { Header } from "../components/Header";
import { KPICard } from "../components/KPICard";
import { Heatmap } from "../components/Heatmap";
import { LeaderList } from "../components/LeaderList";
import { useFilters } from "../../hooks/useFilters";
import {
  fetchMonitoringSummary,
  fetchHeatmapData,
  fetchTopDynamics,
} from "../../api/monitoring";
import { getErrorMessage } from "../../utils/errorHandler";
import {
  buildRisingSparkline,
  buildDecliningSparkline,
  buildFlatSparkline,
  buildGentleRisingSparkline,
} from "../../utils/dataHelpers";
import type { MonitoringSummary, TopDynamics, GeoData } from "../../types";

// Sparklines are static – generated once per mount, not tied to API data
const sparklineBlue = buildRisingSparkline();
const sparklineGreen = buildGentleRisingSparkline();
const sparklineRed = buildDecliningSparkline();
const sparklineNeutral = buildFlatSparkline();

function Toast({ message, type }: { message: string; type: "error" | "info" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl border shadow-xl backdrop-blur-md text-sm font-medium max-w-sm ${
        type === "error"
          ? "bg-rose-900/80 border-rose-500/40 text-rose-200"
          : "bg-slate-800/90 border-white/10 text-slate-200"
      }`}
    >
      {message}
    </div>
  );
}

/** Formats a raw population number into a compact Russian-locale string. */
function formatValue(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}М`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}К`;
  return String(n);
}

// ─── Sub-components ────────────────────────────────────────────────────────────

interface KPISectionProps {
  summary: MonitoringSummary | null;
  isLoading: boolean;
}

/** Renders the row of 5 KPI metric cards. */
function KPISection({ summary, isLoading }: KPISectionProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 shrink-0">
      <KPICard
        title="Численность населения"
        value={summary ? formatValue(summary.population) : null}
        change={summary?.population_change_percent ?? null}
        data={sparklineBlue}
        color="neon-blue"
        isLoading={isLoading && !summary}
      />
      <KPICard
        title="% изменение (г/г)"
        value={
          summary
            ? `${summary.population_change_percent > 0 ? "+" : ""}${summary.population_change_percent.toFixed(2)}%`
            : null
        }
        change={summary?.population_change_percent ?? null}
        data={sparklineNeutral}
        color="neutral"
        isLoading={isLoading && !summary}
      />
      <KPICard
        title="Рождаемость (на 1000)"
        value={summary?.birth_rate ?? null}
        change={-1.2}
        data={sparklineRed}
        color="neon-coral"
        isLoading={isLoading && !summary}
      />
      <KPICard
        title="Смертность (на 1000)"
        value={summary?.death_rate ?? null}
        change={-5.4}
        data={sparklineGreen}
        color="neon-mint"
        isLoading={isLoading && !summary}
      />
      <KPICard
        title="Естественный прирост"
        value={summary?.natural_growth ?? null}
        change={summary?.natural_growth ?? null}
        data={sparklineBlue}
        color="neon-blue"
        isLoading={isLoading && !summary}
      />
    </div>
  );
}

interface MapSectionProps {
  geoData: GeoData | null;
  topDynamics: TopDynamics;
  isLoading: boolean;
}

/** Renders the Heatmap + LeaderList side-by-side layout. */
function MapSection({ geoData, topDynamics, isLoading }: MapSectionProps) {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
      <div className="lg:col-span-8 flex">
        <Heatmap geoData={geoData} isLoading={isLoading && !geoData} />
      </div>
      <div className="lg:col-span-4 flex flex-col gap-6">
        <LeaderList
          growthData={topDynamics.growth}
          declineData={topDynamics.decline}
          isLoading={isLoading && topDynamics.growth.length === 0}
        />
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export function Monitoring() {
  const filters = useFilters();

  const [summary, setSummary] = useState<MonitoringSummary | null>(null);
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [topDynamics, setTopDynamics] = useState<TopDynamics>({ growth: [], decline: [] });
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "error" | "info" } | null>(null);

  const showToast = useCallback((message: string, type: "error" | "info" = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  /**
   * Fetches summary, heatmap, and top-dynamics in parallel.
   * Called on initial load and whenever the user clicks "Показать".
   */
  const loadData = useCallback(
    async (params: {
      startYear: number;
      endYear: number;
      regionId: number | null;
      moId: number | null;
    }) => {
      setIsLoadingData(true);
      try {
        const [summaryData, heatmap, dynamics] = await Promise.all([
          fetchMonitoringSummary(params),
          fetchHeatmapData({ startYear: params.startYear, endYear: params.endYear, regionId: params.regionId }),
          fetchTopDynamics({ startYear: params.startYear, endYear: params.endYear, regionId: params.regionId }),
        ]);
        setSummary(summaryData);
        setGeoData(heatmap);
        setTopDynamics(dynamics);
      } catch (err: any) {
        showToast(getErrorMessage(err));
      } finally {
        setIsLoadingData(false);
      }
    },
    [showToast]
  );

  // Load default data once filters are ready
  useEffect(() => {
    if (!filters.isLoadingFilters && filters.availableYears.length > 0) {
      loadData({
        startYear: filters.startYear,
        endYear: filters.endYear,
        regionId: filters.selectedRegionId,
        moId: filters.selectedMoId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.isLoadingFilters]);

  /** Called when user clicks the "Показать" button. */
  const handleShowClick = () => {
    if (!filters.isYearRangeValid) return;
    loadData({
      startYear: filters.startYear,
      endYear: filters.endYear,
      regionId: filters.selectedRegionId,
      moId: filters.selectedMoId,
    });
  };

  return (
    <>
      <Header
        regions={filters.regions}
        municipalities={filters.municipalities}
        availableYears={filters.availableYears}
        selectedRegionId={filters.selectedRegionId}
        selectedMoId={filters.selectedMoId}
        startYear={filters.startYear}
        endYear={filters.endYear}
        isLoadingFilters={filters.isLoadingFilters}
        isLoadingMunicipalities={filters.isLoadingMunicipalities}
        isYearRangeValid={filters.isYearRangeValid}
        onRegionChange={filters.handleRegionChange}
        onMoChange={filters.handleMoChange}
        onStartYearChange={filters.setStartYear}
        onEndYearChange={filters.setEndYear}
        onShowClick={handleShowClick}
        isLoadingData={isLoadingData}
      />

      <main className="flex-1 overflow-auto p-6 md:p-8 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-6 h-full min-h-[900px]">
          <KPISection summary={summary} isLoading={isLoadingData} />
          <MapSection geoData={geoData} topDynamics={topDynamics} isLoading={isLoadingData} />
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
