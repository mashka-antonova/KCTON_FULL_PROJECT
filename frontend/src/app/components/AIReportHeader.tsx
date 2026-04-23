import { FileDown, FileText, Sparkles, Loader2 } from "lucide-react";
import { FilterSelect } from "./ui/FilterSelect";
import type { Region, Municipality } from "../../types";

const HORIZONS = Array.from({ length: 6 }, (_, i) => i + 5); // 5..10

interface AIReportHeaderProps {
  regions: Region[];
  municipalities: Municipality[];
  selectedRegionId: number | null;
  selectedMoId: number | null;
  horizon: string;
  isLoadingFilters: boolean;
  isLoadingMunicipalities: boolean;
  onRegionChange: (v: string) => void;
  onMoChange: (v: string) => void;
  onHorizonChange: (v: string) => void;
  onGenerate: () => void;
  onExportPDF: () => void;
  onExportWord: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
  isReportReady: boolean;
}

export function AIReportHeader({
  regions,
  municipalities,
  selectedRegionId,
  selectedMoId,
  horizon,
  isLoadingFilters,
  isLoadingMunicipalities,
  onRegionChange,
  onMoChange,
  onHorizonChange,
  onGenerate,
  onExportPDF,
  onExportWord,
  isGenerating,
  canGenerate,
  isReportReady,
}: AIReportHeaderProps) {
  const regionOptions = regions.map((r) => ({ value: r.id, label: r.name }));
  const moOptions = municipalities.map((m) => ({ value: m.id, label: m.name }));
  const horizonOptions = HORIZONS.map((y) => ({
    value: y,
    label: `Горизонт: ${y} лет`,
  }));

  return (
    <header className="border-b border-slate-200 dark:border-white/10 shrink-0 backdrop-blur-md bg-white/80 dark:bg-white/5 relative z-10">
      {/* Row 1: Title + Export + Generate */}
      <div className="flex items-center justify-between px-8 py-3 border-b border-slate-100 dark:border-white/5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">ИИ-аналитическая справка</h1>
          <p className="text-xs text-slate-500 mt-0.5">Автоматическая генерация демографических отчётов</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportPDF}
            disabled={!isReportReady}
            className="flex items-center gap-2 px-3 py-2 rounded-xl
              bg-stone-100 border border-stone-200 hover:bg-stone-200 text-stone-600
              dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:text-slate-300
              transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Скачать PDF"
          >
            <FileDown className="w-4 h-4 text-rose-500 dark:text-rose-400" />
            PDF
          </button>
          <button
            onClick={onExportWord}
            disabled={!isReportReady}
            className="flex items-center gap-2 px-3 py-2 rounded-xl
              bg-stone-100 border border-stone-200 hover:bg-stone-200 text-stone-600
              dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:text-slate-300
              transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Скачать DOCX"
          >
            <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            DOCX
          </button>

          <div className="w-px h-5 bg-stone-200 dark:bg-white/10 mx-1" />

          <button
            onClick={onGenerate}
            disabled={!canGenerate || isLoadingFilters}
            className="relative group flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 transition-all shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] border border-white/10 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
            aria-label="Сформировать справку"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-[shimmer_1.8s_infinite]" />
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 fill-white/60" />
            )}
            {isGenerating ? "Формирование..." : "Сформировать справку"}
          </button>
        </div>
      </div>

      {/* Row 2: Filters */}
      <div className="flex items-center gap-3 px-8 py-3 flex-wrap">
        <span className="text-xs text-slate-500 uppercase tracking-wider shrink-0">Параметры:</span>

        <FilterSelect
          value={selectedRegionId ?? ""}
          onChange={(v) => { onRegionChange(v); onMoChange(""); }}
          options={regionOptions}
          placeholder="Субъект РФ"
          disabled={isLoadingFilters}
          ariaLabel="Субъект РФ"
          minWidth={200}
        />

        <FilterSelect
          value={selectedMoId ?? ""}
          onChange={onMoChange}
          options={moOptions}
          placeholder="Муниципалитет"
          disabled={!selectedRegionId}
          isLoading={isLoadingMunicipalities}
          ariaLabel="Муниципалитет"
          minWidth={180}
        />

        <div className="w-px h-5 bg-stone-200 dark:bg-white/10" />

        <FilterSelect
          value={horizon}
          onChange={onHorizonChange}
          options={horizonOptions}
          ariaLabel="Горизонт прогноза"
        />
      </div>

      <style dangerouslySetInnerHTML={{__html: `@keyframes shimmer { 100% { transform: translateX(200%); } }`}} />
    </header>
  );
}
