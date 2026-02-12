/* Community reports — localStorage-backed */

const STORAGE_KEY = "ice-tracker-v10-reports";

export function getReports() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function saveReport({ state, city, description }) {
  const reports = getReports();
  const report = {
    id: `rpt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    state: state.toUpperCase().slice(0, 2),
    city,
    description,
    createdAt: new Date().toISOString(),
  };
  reports.unshift(report);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports.slice(0, 200)));
  return report;
}

export function deleteReport(id) {
  const reports = getReports().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function clearReports() {
  localStorage.removeItem(STORAGE_KEY);
}
