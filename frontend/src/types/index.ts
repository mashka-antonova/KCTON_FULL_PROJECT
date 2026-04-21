/** Shared TypeScript interfaces matching the API contract */

export interface Region {
  id: number;
  name: string;
}

export interface Municipality {
  id: number;
  region_id: number;
  name: string;
}

/** Monitoring */

export interface MonitoringSummary {
  population: number;
  population_change: number;
  population_change_percent: number;
  birth_rate: number;
  death_rate: number;
  natural_growth: number;
  migration: number;
}

export interface TopLeaderItem {
  mo_id: number;
  name: string;
  population: number;
  changePercent: number;
}

export interface TopDynamics {
  growth: TopLeaderItem[];
  decline: TopLeaderItem[];
}

export interface HeatmapFeatureProperties {
  name: string;
  density: number;
  population: number;
  region_id?: number;
  mo_id?: number;
}

export interface GeoData {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: HeatmapFeatureProperties;
    geometry: { type: string; coordinates: number[][][] };
  }>;
}

/** Forecasting */

export interface ForecastChartPoint {
  year: number;
  fact: number | null;
  forecast: number | null;
  low: number | null;
  high: number | null;
}

export interface ForecastMetrics {
  mape: number;
  rmse: number;
  mae: number;
}

export interface ModelOption {
  id: string;
  name: string;
}

export interface ForecastConfig {
  models: ModelOption[];
  horizon_limits: { min: number; max: number };
}

/** Reports */

export type ReportStatus = "idle" | "pending" | "processing" | "completed" | "error";

export interface GenerateReportParams {
  moId: number | null;
  horizon: number;
  regionName?: string;
  moName?: string;
}
