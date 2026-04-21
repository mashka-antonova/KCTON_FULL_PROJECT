import { Loader2 } from "lucide-react";
import { FilterSelect } from "./ui/FilterSelect";
import type { Region, Municipality } from "../../types";

interface HeaderProps {
  regions: Region[];
  municipalities: Municipality[];
  availableYears: number[];
  selectedRegionId: number | null;
  selectedMoId: number | null;
  startYear: number;
  endYear: number;
  isLoadingFilters: boolean;
  isLoadingMunicipalities: boolean;
  isYearRangeValid: boolean;
  onRegionChange: (regionId: string) => void;
  onMoChange: (moId: string) => void;
  onStartYearChange: (year: number) => void;
  onEndYearChange: (year: number) => void;
  onShowClick: () => void;
  isLoadingData?: boolean;
}

export function Header({
  regions,
  municipalities,
  availableYears,
  selectedRegionId,
  selectedMoId,
  startYear,
  endYear,
  isLoadingFilters,
  isLoadingMunicipalities,
  isYearRangeValid,
  onRegionChange,
  onMoChange,
  onStartYearChange,
  onEndYearChange,
  onShowClick,
  isLoadingData,
}: HeaderProps) {
  const regionOptions = regions.map((r) => ({ value: r.id, label: r.name }));
  const moOptions = municipalities.map((m) => ({ value: m.id, label: m.name }));
  const startYearOptions = availableYears
    .filter((y) => y <= endYear)
    .map((y) => ({ value: y, label: String(y) }));
  const endYearOptions = availableYears
    .filter((y) => y >= startYear)
    .map((y) => ({ value: y, label: String(y) }));

  return (
    <header className="h-20 border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-8 shrink-0 backdrop-blur-md bg-white/80 dark:bg-white/5 relative z-10 gap-4 flex-wrap">
      <div className="flex items-center gap-4 flex-wrap">
        <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white mr-2 whitespace-nowrap">
          Мониторинг населения
        </h1>

        <div className="flex items-center gap-3 flex-wrap">
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

          <div className="w-px h-5 bg-white/10" />

          <FilterSelect
            value={startYear}
            onChange={(v) => onStartYearChange(Number(v))}
            options={startYearOptions}
            ariaLabel="Год начала"
          />

          <span className="text-slate-500 text-sm">—</span>

          <FilterSelect
            value={endYear}
            onChange={(v) => onEndYearChange(Number(v))}
            options={endYearOptions}
            ariaLabel="Год конца"
          />

          {!isYearRangeValid && (
            <span className="text-xs text-rose-400">{"Год начала > года конца"}</span>
          )}
        </div>
      </div>

      <button
        onClick={onShowClick}
        disabled={!isYearRangeValid || isLoadingData || isLoadingFilters}
        className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] border border-white/10 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        aria-label="Показать данные"
      >
        {isLoadingData && <Loader2 className="w-4 h-4 animate-spin" />}
        Показать
      </button>
    </header>
  );
}
