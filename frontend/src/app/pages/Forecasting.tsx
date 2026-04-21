import { useEffect, useCallback } from "react";
import { ForecastingHeader } from "../components/ForecastingHeader";
import { ModelAccuracyCard } from "../components/ModelAccuracyCard";
import { ForecastingChart } from "../components/ForecastingChart";
import { Percent, ActivitySquare, Target } from "lucide-react";
import { useFilters } from "../../hooks/useFilters";
import { useForecast } from "../../hooks/useForecast";

export function Forecasting() {
  const filters = useFilters();
  const forecast = useForecast();

  // Auto-load forecast when MO selection changes
  useEffect(() => {
    if (filters.selectedMoId !== null) {
      forecast.loadForecast({ moId: filters.selectedMoId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.selectedMoId]);

  // Auto-select first region on mount
  useEffect(() => {
    if (!filters.isLoadingFilters && filters.regions.length > 0 && !filters.selectedRegionId) {
      filters.handleRegionChange(String(filters.regions[0].id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.isLoadingFilters, filters.regions]);

  // Auto-select first MO when municipalities load
  useEffect(() => {
    if (filters.municipalities.length > 0 && !filters.selectedMoId) {
      filters.handleMoChange(String(filters.municipalities[0].id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.municipalities]);

  const handleCalculate = useCallback(() => {
    forecast.loadForecast({ moId: filters.selectedMoId });
  }, [forecast, filters.selectedMoId]);

  return (
    <>
      <ForecastingHeader
        regions={filters.regions}
        municipalities={filters.municipalities}
        selectedRegionId={filters.selectedRegionId}
        selectedMoId={filters.selectedMoId}
        availableModels={forecast.config.models}
        selectedModel={forecast.selectedModel}
        horizon={forecast.horizon}
        isLoadingFilters={filters.isLoadingFilters}
        isLoadingMunicipalities={filters.isLoadingMunicipalities}
        isLoadingForecast={forecast.isLoadingForecast}
        onRegionChange={filters.handleRegionChange}
        onMoChange={filters.handleMoChange}
        onModelChange={forecast.setSelectedModel}
        onHorizonChange={forecast.setHorizon}
        onCalculate={handleCalculate}
      />

      <main className="flex-1 overflow-hidden p-4 md:p-6 custom-scrollbar relative">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-[#06B6D4]/5 blur-[120px] pointer-events-none rounded-full transform -translate-y-1/2" />
        <div className="max-w-[1600px] mx-auto flex flex-col gap-3 h-full relative z-10">

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <ModelAccuracyCard
              title="MAPE"
              value={forecast.metrics ? `${forecast.metrics.mape}%` : "—"}
              subtitle="Средняя абсолютная процентная ошибка"
              colorClass="text-[#10B981] shadow-[#10B981]/20 border-[#10B981]/30"
              icon={<Percent className="w-6 h-6" />}
            />
            <ModelAccuracyCard
              title="RMSE"
              value={
                forecast.metrics
                  ? new Intl.NumberFormat("ru-RU").format(forecast.metrics.rmse)
                  : "—"
              }
              subtitle="Среднеквадратическая ошибка"
              colorClass="text-[#38BDF8] shadow-[#38BDF8]/20 border-[#38BDF8]/30"
              icon={<ActivitySquare className="w-6 h-6" />}
            />
            <ModelAccuracyCard
              title="MAE"
              value={
                forecast.metrics
                  ? new Intl.NumberFormat("ru-RU").format(forecast.metrics.mae)
                  : "—"
              }
              subtitle="Средняя абсолютная ошибка"
              colorClass="text-[#8B5CF6] shadow-[#8B5CF6]/20 border-[#8B5CF6]/30"
              icon={<Target className="w-6 h-6" />}
            />
          </div>

          {/* Chart */}
          <div className="flex-1 flex flex-col min-h-0">
            <ForecastingChart
              data={forecast.chartData}
              isLoading={forecast.isLoadingForecast}
              error={forecast.forecastError}
            />
          </div>
        </div>
      </main>
    </>
  );
}
