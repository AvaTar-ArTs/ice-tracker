/**
 * In-app resources (v4): hotlines and rapid response by state.
 */

import hotlinesData from "@/data/hotlines.json";

export interface HotlineEntry {
  name: string;
  phone: string | null;
  description: string;
  action?: string;
  url?: string;
}

export interface StateHotlines {
  stateName: string;
  hotlines: HotlineEntry[];
}

const hotlines = hotlinesData as {
  national: HotlineEntry[];
  byState: Record<string, StateHotlines>;
};

export function getNationalHotlines(): HotlineEntry[] {
  return hotlines.national ?? [];
}

export function getHotlinesForState(stateCode: string | null): StateHotlines | null {
  if (!stateCode) return null;
  const upper = stateCode.toUpperCase().trim();
  return hotlines.byState[upper] ?? hotlines.byState["default"] ?? null;
}

export function getStateHotlinesList(stateCode: string | null): HotlineEntry[] {
  const state = getHotlinesForState(stateCode);
  if (!state) return getNationalHotlines();
  return state.hotlines;
}
