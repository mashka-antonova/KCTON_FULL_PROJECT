import { Play, Loader2 } from "lucide-react";
import { FilterSelect } from "./ui/FilterSelect";
import type { Region, Municipality, ModelOption } from "../../types";

interface ForecastingHeaderProps {
  regions: Region[];
  municipalities: Municipality[];
  selectedRegionId: number | null;
  selectedMoId: number | null;
  availableModels: ModelOption[];
  selectedModel: string;
  horizon: number;
  isLoadingFilters: boolean;
  isLoadingMunicipalities: boolean;
  isLoadingForecast: boolean;
  onRegionChange: (regionId: string) => void;
  onMoChange: (moId: string) => void;
  onModelChange: (model: string) => void;
  onHorizonChange: (horizon: number) => void;
  onCalculate: () => void;
}

const HORIZONS = Array.from({ length: 11 }, (_, i) => i + 5);

export function ForecastingHeader({
  regions,
  municipalities,
  selectedRegionId,
  selectedMoId,
  availableModels,
  selectedModel,
  horizon,
  isLoadingFilters,
  isLoadingMunicipalities,
  isLoadingForecast,
  onRegionChange,
  onMoChange,
  onModelChange,
  onHorizonChange,
  onCalculate,
}: ForecastingHeaderProps) {
  const regionOptions = regions.map((r) => ({ value: r.id, label: r.name }));
  const moOptions = municipalities.map((m) => ({ value: m.id, label: m.name }));
  const modelOptions = availableModels.map((m) => ({ value: m.id, label: m.name }));
  const horizonOptions = HORIZONS.map((y) => ({ value: y, label: `Горизонт: ${y} лет` }));

  return (
    <header className="border-b border-slate-200 dark:border-white/10 shrink-0 backdrop-blur-md bg-white/80 dark:bg-white/5 relative z-10">
      {/* Row 1: Title + Calculate button — always visible, no wrapping */}
      <div className="flex items-center justify-between px-8 h-16 gap-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white whitespace-nowrap">
          Демографическое прогнозирование
        </h1>

        <button
          onClick={onCalculate}
          disabled={isLoadingForecast || isLoadingFilters}
          className="relative group px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] border border-white/10 flex items-center gap-2 overflow-hidden whitespace-nowrap shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Рассчитать прогноз"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          {isLoadingForecast ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4 fill-white" />
          )}
          {isLoadingForecast ? "Расчёт..." : "Рассчитать прогноз"}
        </button>
      </div>

      {/* Row 2: Filters — separate row, no height conflict with title */}
      <div className="flex items-center gap-3 px-8 py-2.5 border-t border-slate-100 dark:border-white/5 flex-wrap">
        <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">Фильтры:</span>

        <FilterSelect
          value={selectedRegionId ?? ""}
          onChange={onRegionChange}
          options={regionOptions}
          placeholder="Субъект РФ"
          disabled={isLoadingFilters}
          ariaLabel="Субъект РФ"
        />

        <FilterSelect
          value={selectedMoId ?? ""}
          onChange={onMoChange}
          options={moOptions}
          placeholder="Муниципалитет"
          disabled={!selectedRegionId}
          isLoading={isLoadingMunicipalities}
          ariaLabel="Муниципалитет"
        />

        <div className="w-px h-5 bg-slate-200 dark:bg-white/10" />

        {availableModels.length > 0 && (
          <FilterSelect
            value={selectedModel}
            onChange={onModelChange}
            options={modelOptions}
            ariaLabel="Модель прогноза"
          />
        )}

        <FilterSelect
          value={horizon}
          onChange={(v) => onHorizonChange(Number(v))}
          options={horizonOptions}
          ariaLabel="Горизонт прогноза"
        />
      </div>

      <style dangerouslySetInnerHTML={{__html: `@keyframes shimmer { 100% { transform: translateX(100%); } }`}} />
    </header>
  );
}
