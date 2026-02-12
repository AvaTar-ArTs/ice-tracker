export interface CommunityReport {
  id: string;
  state: string;
  city: string;
  description: string;
  createdAt: string;
}

const STORAGE_KEY = "ice-tracker-community-reports";

export function getCommunityReports(): CommunityReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CommunityReport[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCommunityReport(report: Omit<CommunityReport, "id" | "createdAt">): CommunityReport {
  const reports = getCommunityReports();
  const newReport: CommunityReport = {
    ...report,
    id: `community-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  reports.unshift(newReport);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports.slice(0, 200)));
  return newReport;
}

export function deleteCommunityReport(id: string): void {
  const reports = getCommunityReports().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function clearAllCommunityReports(): void {
  localStorage.removeItem(STORAGE_KEY);
}
