import { useState, useEffect } from "react";
import { AIReportHeader } from "../components/AIReportHeader";
import { useFilters } from "../../hooks/useFilters";
import { useReport } from "../../hooks/useReport";
import {
  FileSearch,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Cpu,
  BarChart3,
  MapPin,
  Lightbulb,
  FileDown,
  FileText,
  AlertCircle,
} from "lucide-react";

export function AIReport() {
  const filters = useFilters();
  const report = useReport();
  const [horizon, setHorizon] = useState("10");

  useEffect(() => {
    if (!filters.isLoadingFilters && filters.regions.length > 0 && !filters.selectedRegionId) {
      filters.handleRegionChange(String(filters.regions[0].id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.isLoadingFilters, filters.regions]);

  useEffect(() => {
    if (filters.municipalities.length > 0 && !filters.selectedMoId) {
      filters.handleMoChange(String(filters.municipalities[0].id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.municipalities]);

  const selectedRegion = filters.regions.find((r) => r.id === filters.selectedRegionId);
  const selectedMo = filters.municipalities.find((m) => m.id === filters.selectedMoId);

  const handleGenerate = () => {
    report.generate({
      moId: filters.selectedMoId,
      horizon: Number(horizon),
      regionName: selectedRegion?.name,
      moName: selectedMo?.name,
    });
  };

  const isGenerating = report.reportStatus === "pending" || report.reportStatus === "processing";
  const canGenerate = !!filters.selectedRegionId && !isGenerating;

  const generationSteps = [
    { id: 1, label: "Загрузка демографических данных...", icon: <BarChart3 className="w-4 h-4" /> },
    { id: 2, label: "Запуск модели Prophet (Meta)...", icon: <Cpu className="w-4 h-4" /> },
    { id: 3, label: "Анализ миграционных потоков...", icon: <MapPin className="w-4 h-4" /> },
    { id: 4, label: "Генерация ИИ-интерпретации...", icon: <Sparkles className="w-4 h-4" /> },
    { id: 5, label: "Формирование рекомендаций...", icon: <Lightbulb className="w-4 h-4" /> },
  ];

  const completedSteps = Math.round((report.progress / 100) * generationSteps.length);

  return (
    <>
      <style>{`
        @keyframes shimmer { 100% { transform: translateX(200%); } }

        /* Light prose */
        .ai-prose h1 { font-size:1.4rem; font-weight:700; color:#1c1917; margin-bottom:.5rem; }
        .ai-prose h2 { font-size:1.05rem; font-weight:600; color:#292524; margin-top:1.5rem; margin-bottom:.5rem;
          border-bottom:1px solid #e7e2da; padding-bottom:.25rem; }
        .ai-prose p  { margin-bottom:.75rem; color:#44403c; line-height:1.75; }
        .ai-prose ul { padding-left:1.5rem; }
        .ai-prose li { margin-bottom:.4rem; color:#57534e; }
        .ai-prose strong { color:#1c1917; }
        .ai-prose .meta { font-size:.8rem; color:#a8a29e; margin-bottom:1.5rem; }
        .ai-prose .disclaimer { font-size:.75rem; color:#a8a29e; margin-top:2rem; padding-top:1rem;
          border-top:1px solid #e7e2da; }

        /* Dark prose */
        .dark .ai-prose h1 { color:#f1f5f9; }
        .dark .ai-prose h2 { color:#e2e8f0; border-bottom-color:rgba(255,255,255,.08); }
        .dark .ai-prose p  { color:#cbd5e1; }
        .dark .ai-prose ul { }
        .dark .ai-prose li { color:#94a3b8; }
        .dark .ai-prose strong { color:#e2e8f0; }
        .dark .ai-prose .meta { color:#475569; }
        .dark .ai-prose .disclaimer { color:#475569; border-top-color:rgba(255,255,255,.07); }
      `}</style>

      <AIReportHeader
        regions={filters.regions}
        municipalities={filters.municipalities}
        selectedRegionId={filters.selectedRegionId}
        selectedMoId={filters.selectedMoId}
        horizon={horizon}
        isLoadingFilters={filters.isLoadingFilters}
        isLoadingMunicipalities={filters.isLoadingMunicipalities}
        onRegionChange={filters.handleRegionChange}
        onMoChange={filters.handleMoChange}
        onHorizonChange={setHorizon}
        onGenerate={handleGenerate}
        onExportPDF={() => report.handleDownload("pdf")}
        onExportWord={() => report.handleDownload("docx")}
        isGenerating={isGenerating}
        canGenerate={canGenerate}
        isReportReady={report.reportStatus === "completed"}
      />

      {/* Main — light: warm cream, dark: deep navy */}
      <main className="flex-1 overflow-auto custom-scrollbar relative bg-[#FAF9F6] dark:bg-[#0F172A]">
        {/* Subtle ambient blob */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px]
            bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
            from-amber-100/50 via-orange-50/20 to-transparent
            dark:from-violet-900/20 dark:via-indigo-900/10 dark:to-transparent
            blur-[120px]" />
        </div>

        <div className="relative z-10 flex items-start justify-center min-h-full py-10 px-6">

          {/* ── EMPTY STATE ── */}
          {report.reportStatus === "idle" && (
            <div className="flex flex-col items-center justify-center gap-6 mt-20 text-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-3xl
                  bg-stone-100 border border-stone-200 shadow-sm
                  dark:bg-white/5 dark:border-white/10 dark:shadow-[0_0_60px_rgba(99,102,241,0.1)]
                  flex items-center justify-center">
                  <FileSearch className="w-12 h-12 text-stone-400 dark:text-slate-600" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-amber-400/70 dark:text-indigo-400/60 animate-pulse" />
                <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-orange-400/50 dark:text-violet-400/50 animate-pulse" style={{ animationDelay: "0.5s" }} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-slate-200">
                  Отчёт не сформирован
                </h2>
                <p className="text-stone-500 dark:text-slate-500 max-w-sm leading-relaxed">
                  Выберите субъект РФ и муниципалитет, задайте горизонт прогнозирования и нажмите{" "}
                  <span className="text-violet-600 dark:text-indigo-400 font-medium">«Сформировать справку»</span>
                </p>
              </div>
              <div className="flex flex-col gap-2 items-start mt-2
                bg-stone-50 border border-stone-200
                dark:bg-white/5 dark:border-white/10
                rounded-2xl p-5 text-left max-w-xs w-full shadow-sm">
                <p className="text-xs text-stone-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                  Что будет в справке
                </p>
                {[
                  "Динамика численности населения",
                  "Тренды и факторы изменений",
                  "Оценка ИИ-прогноза",
                  "Стратегические рекомендации",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-stone-600 dark:text-slate-400">
                    <ChevronRight className="w-3.5 h-3.5 text-violet-500 dark:text-indigo-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ERROR STATE ── */}
          {report.reportStatus === "error" && (
            <div className="flex flex-col items-center justify-center gap-4 mt-20 text-center">
              <div className="w-20 h-20 rounded-2xl
                bg-rose-50 border border-rose-200
                dark:bg-rose-900/20 dark:border-rose-500/30
                flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-rose-500 dark:text-rose-400" />
              </div>
              <h2 className="text-xl font-semibold text-stone-800 dark:text-slate-200">Ошибка генерации</h2>
              <p className="text-stone-500 dark:text-slate-400 max-w-sm">{report.reportError}</p>
              <button
                onClick={handleGenerate}
                className="px-5 py-2.5 rounded-xl font-semibold text-white
                  bg-gradient-to-r from-violet-600 to-indigo-600
                  hover:from-violet-500 hover:to-indigo-500
                  transition-all border border-violet-300/30 dark:border-white/10 shadow-sm"
              >
                Попробовать снова
              </button>
            </div>
          )}

          {/* ── GENERATING STATE ── */}
          {isGenerating && (
            <div className="flex flex-col items-center gap-8 mt-16 w-full max-w-md">
              <div className="w-20 h-20 rounded-2xl
                bg-violet-50 border border-violet-200 shadow-sm
                dark:bg-indigo-900/30 dark:border-indigo-500/30
                flex items-center justify-center">
                <Sparkles className="w-9 h-9 text-violet-500 dark:text-indigo-400 animate-pulse" />
              </div>
              <div className="text-center space-y-1">
                <h2 className="text-xl font-semibold text-stone-800 dark:text-slate-200">
                  Формирование справки...
                </h2>
                <p className="text-sm text-stone-500 dark:text-slate-500">
                  {selectedMo?.name || selectedRegion?.name || "Регион"} · горизонт {horizon} лет
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-stone-200 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${report.progress}%` }}
                />
              </div>
              <span className="text-sm font-mono text-stone-400 dark:text-slate-400">
                {Math.round(report.progress)}%
              </span>

              {/* Steps */}
              <div className="w-full flex flex-col gap-2.5">
                {generationSteps.map((step, i) => {
                  const done = i < completedSteps;
                  const active = i === completedSteps;
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
                        done
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-500/30 dark:text-emerald-300"
                          : active
                          ? "bg-violet-50 border-violet-200 text-violet-700 dark:bg-indigo-900/20 dark:border-indigo-500/30 dark:text-indigo-300"
                          : "bg-stone-50 border-stone-200 text-stone-400 dark:bg-white/[0.03] dark:border-white/5 dark:text-slate-600"
                      }`}
                    >
                      {done
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                        : step.icon}
                      <span className="text-sm">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── REPORT READY ── */}
          {report.reportStatus === "completed" && report.reportHtml && (
            <div className="w-full max-w-4xl flex flex-col gap-6">
              <div className="bg-white dark:bg-white/[0.03] border border-stone-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg
                      bg-emerald-50 border border-emerald-200
                      dark:bg-emerald-500/20 dark:border-emerald-500/30
                      flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-800 dark:text-white">
                        Справка сформирована
                      </p>
                      <p className="text-xs text-stone-400 dark:text-slate-500">
                        {selectedMo?.name || selectedRegion?.name} · горизонт {horizon} лет
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => report.handleDownload("pdf")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        bg-stone-50 border border-stone-200 hover:bg-stone-100
                        dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10
                        text-stone-600 dark:text-slate-300 text-sm transition-colors"
                    >
                      <FileDown className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                      PDF
                    </button>
                    <button
                      onClick={() => report.handleDownload("docx")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        bg-stone-50 border border-stone-200 hover:bg-stone-100
                        dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10
                        text-stone-600 dark:text-slate-300 text-sm transition-colors"
                    >
                      <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      DOCX
                    </button>
                  </div>
                </div>

                {/* Report HTML */}
                <div
                  className="p-8 ai-prose text-sm max-w-none custom-scrollbar max-h-[70vh] overflow-y-auto"
                  style={{ lineHeight: "1.75" }}
                  dangerouslySetInnerHTML={{ __html: report.reportHtml }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
