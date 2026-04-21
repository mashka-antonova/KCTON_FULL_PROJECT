export function validateYearRange(startYear, endYear) {
  if (!startYear || !endYear) return { valid: false, message: "Выберите период" };
  if (startYear > endYear) return { valid: false, message: "Год начала не может быть позже года конца" };
  return { valid: true, message: null };
}

export function validateMonitoringFilters({ startYear, endYear }) {
  return validateYearRange(startYear, endYear);
}

export function validateForecastFilters({ moId, horizon, model }) {
  if (!moId && moId !== 0) return { valid: false, message: "Выберите муниципальное образование" };
  if (!horizon || horizon < 1) return { valid: false, message: "Укажите горизонт прогноза" };
  if (!model) return { valid: false, message: "Выберите модель прогноза" };
  return { valid: true, message: null };
}

export function validateReportFilters({ regionId, horizon }) {
  if (!regionId) return { valid: false, message: "Выберите субъект РФ" };
  if (!horizon || horizon < 1) return { valid: false, message: "Укажите горизонт прогноза" };
  return { valid: true, message: null };
}

export function formatNumber(value, options = {}) {
  if (value === null || value === undefined) return "н/д";
  const { decimals = 0, suffix = "" } = options;
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: decimals }).format(value) + suffix;
}

export function formatPercent(value) {
  if (value === null || value === undefined) return "н/д";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
