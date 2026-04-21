import { useState, useEffect, useCallback } from "react";
import { fetchForecast, fetchForecastConfig } from "../api/forecast";

/**
 * Manages forecast configuration and computed chart state.
 *
 * - Loads available models and horizon limits once on mount.
 * - `loadForecast` triggers a new calculation and stores chart data + metrics.
 *
 * @returns {object} Config, chart data, metrics, loading flags, and callbacks.
 */
export function useForecast() {
  const [config, setConfig] = useState({ models: [], horizon_limits: { min: 5, max: 15 } });
  const [selectedModel, setSelectedModel] = useState("prophet");
  const [horizon, setHorizon] = useState(10);
  const [chartData, setChartData] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);
  const [forecastError, setForecastError] = useState(null);

  // Load model config on mount; auto-select first model
  useEffect(() => {
    fetchForecastConfig()
      .then((cfg) => {
        setConfig(cfg);
        if (cfg.models.length > 0) setSelectedModel(cfg.models[0].id);
      })
      .catch((err) => setForecastError(err.message))
      .finally(() => setIsLoadingConfig(false));
  }, []);

  /**
   * Fetches forecast data for the given municipality.
   * Uses currently selected model and horizon from hook state.
   *
   * @param {{ moId: number | null }} params
   */
  const loadForecast = useCallback(
    async ({ moId } = {}) => {
      setIsLoadingForecast(true);
      setForecastError(null);
      try {
        const result = await fetchForecast({ moId, horizon, model: selectedModel });
        setChartData(result.chart_data);
        setMetrics(result.metrics);
      } catch (err) {
        setForecastError(err.message ?? "Ошибка при расчёте прогноза");
        setChartData([]);
        setMetrics(null);
      } finally {
        setIsLoadingForecast(false);
      }
    },
    [horizon, selectedModel]
  );

  return {
    config,
    selectedModel,
    horizon,
    chartData,
    metrics,
    isLoadingConfig,
    isLoadingForecast,
    forecastError,
    setSelectedModel,
    setHorizon,
    loadForecast,
  };
}
