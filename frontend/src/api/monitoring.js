const BASE_URL = import.meta.env.VITE_API_URL;

async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

// TODO: Заменить на GET /api/filters/regions
export async function fetchRegions() {
  return apiFetch('/api/filters/regions');
}

// TODO: Заменить на GET /api/filters/municipalities?region_id={region_id}
export async function fetchMunicipalities(regionId) {
  const qs = regionId ? `?region_id=${regionId}` : '';
  return apiFetch(`/api/filters/municipalities${qs}`);
}

// TODO: Заменить на GET /api/filters/years
export async function fetchAvailableYears() {
  return apiFetch('/api/filters/years');
}

// TODO: Заменить на GET /api/monitoring/summary?start_year=...&end_year=...&region_id=...&mo_id=...
export async function fetchMonitoringSummary({ startYear = 2020, endYear = 2024, regionId, moId } = {}) {
  let url = `/api/monitoring/summary?start_year=${startYear}&end_year=${endYear}`;
  if (moId) url += `&mo_id=${moId}`;
  else if (regionId) url += `&region_id=${regionId}`;
  const data = await apiFetch(url);
  return {
    population: data.population,
    population_change: Math.round(data.population * (data.change_percent / 100)),
    population_change_percent: data.change_percent,
    birth_rate: data.birth_rate,
    death_rate: data.death_rate,
    natural_growth: data.natural_growth,
    migration: data.migration,
  };
}

// TODO: Заменить на GET /api/monitoring/heatmap?start_year=...&end_year=...&region_id=...
export async function fetchHeatmapData({ startYear = 2020, endYear = 2024, regionId } = {}) {
  let url = `/api/monitoring/heatmap?start_year=${startYear}&end_year=${endYear}`;
  if (regionId) url += `&region_id=${regionId}`;
  return apiFetch(url);
}

export async function fetchTopDynamics({ startYear = 2020, endYear = 2024, regionId } = {}) {
  let url = `/api/monitoring/top-dynamics?start_year=${startYear}&end_year=${endYear}`;
  if (regionId) url += `&region_id=${regionId}`;
  const data = await apiFetch(url);
  const mapEntry = (r) => ({ mo_id: r.id, name: r.name, changePercent: r.change_percent });
  return {
    growth: (data.top_growth || []).map(mapEntry),
    decline: (data.top_decline || []).map(mapEntry),
  };
}
