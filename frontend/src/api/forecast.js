// TODO: Заменить все функции на реальные вызовы REST API бэкенда

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// TODO: Заменить на GET /api/forecast/config
export async function fetchForecastConfig() {
  await delay(200);
  return {
    models: [
      { id: "prophet", name: "Prophet (Meta)" },
      { id: "sarima", name: "SARIMA" },
      { id: "lstm", name: "LSTM (Neural)" },
    ],
    horizon_limits: { min: 5, max: 15 },
  };
}

// TODO: Заменить на GET /api/forecast/calculate?mo_id={mo_id}&horizon={horizon}&model={model}
export async function fetchForecast({ moId, horizon = 10, model = "prophet" } = {}) {
  await delay(1200);

  // Simulate different baselines per municipality
  const base = moId ? 300000 + moId * 500 : 1100000;
  const growthRate = 0.005;

  const historicalYears = Array.from({ length: 15 }, (_, i) => 2010 + i);
  const forecastYears = Array.from({ length: horizon }, (_, i) => 2025 + i);

  const historical = historicalYears.map((year, i) => ({
    year,
    fact: Math.round(base * Math.pow(1 + growthRate, i)),
    forecast: null,
    low: null,
    high: null,
  }));

  // Junction point — last historical = first forecast
  const lastFact = historical[historical.length - 1].fact;
  const junctionYear = 2024;
  const junction = {
    year: junctionYear,
    fact: lastFact,
    forecast: lastFact,
    low: null,
    high: null,
  };

  const forecastPoints = forecastYears.map((year, i) => {
    const forecastValue = Math.round(lastFact * Math.pow(1 + growthRate, i + 1));
    const spread = Math.round(forecastValue * 0.015 * (i + 1));
    return {
      year,
      fact: null,
      forecast: forecastValue,
      low: forecastValue - spread,
      high: forecastValue + spread,
    };
  });

  return {
    chart_data: [...historical, junction, ...forecastPoints],
    metrics: {
      mape: parseFloat((1.5 + Math.random() * 1.5).toFixed(2)),
      rmse: Math.round(800 + Math.random() * 800),
      mae: Math.round(600 + Math.random() * 500),
    },
  };
}
