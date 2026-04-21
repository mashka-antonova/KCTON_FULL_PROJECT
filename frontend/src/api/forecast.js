const BASE_URL = import.meta.env.VITE_API_URL;
 
async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}


export async function fetchForecastConfig() {
  const data = await apiFetch('/api/forecast/config');
  return {
    models: data.models.map((m) => ({ id: m.name, name: m.description || m.name })),
    horizon_limits: {
      min: Math.min(...data.horizons),
      max: Math.max(...data.horizons),
    },
  };
}

export async function fetchForecast({ moId, horizon = 10, model = 'prophet' } = {}) {
  if (!moId) throw new Error('Выберите муниципальное образование для построения прогноза');
  return apiFetch(`/api/forecast/calculate?mo_id=${moId}&horizon=${horizon}&model=${model}`);
}
