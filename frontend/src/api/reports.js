const BASE_URL = import.meta.env.VITE_API_URL;
 
async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res;
}

export async function generateReport({ moId, horizon }) {
  const res = await apiFetch(`/api/reports/generate?mo_id=${moId}&horizon=${horizon}`, { method: 'POST' });
  return res.json();
}

// TODO: Заменить на GET /api/reports/status/{task_id}
export async function pollReportStatus(taskId) {
  const res = await apiFetch(`/api/reports/status/${taskId}`);
  return res.json();
}

// Returns a Blob (PDF or DOCX file)
export async function downloadReport(taskId, format = 'pdf') {
  const res = await apiFetch(`/api/reports/download/${taskId}?format=${format}`);
  return res.blob();
}

// Returns the HTML/text content of the completed report for preview
export async function fetchReportContent(taskId) {
  const res = await apiFetch(`/api/reports/status/${taskId}`);
  const data = await res.json();
  return data.content ?? null;
}
