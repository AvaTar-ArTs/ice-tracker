/**
 * Sync filter state with URL search params (v2) for shareable links.
 */

import type { FilterSource } from "@/app/types";

const PARAM_STATE = "state";
const PARAM_SOURCE = "source";

export function getFilterStateFromSearchParams(searchParams: URLSearchParams): {
  state: string | null;
  source: FilterSource;
} {
  const state = searchParams.get(PARAM_STATE)?.toUpperCase().trim() || null;
  const raw = searchParams.get(PARAM_SOURCE)?.toLowerCase();
  const source: FilterSource =
    raw === "enforcement" || raw === "breaking" || raw === "state" ? raw : "all";
  return { state, source };
}

export function buildFilterSearchParams(state: string | null, source: FilterSource): URLSearchParams {
  const params = new URLSearchParams();
  if (state) params.set(PARAM_STATE, state);
  if (source !== "all") params.set(PARAM_SOURCE, source);
  return params;
}

export function updateUrlFilters(state: string | null, source: FilterSource): void {
  if (typeof window === "undefined") return;
  const params = buildFilterSearchParams(state, source);
  const url = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  window.history.replaceState(null, "", url);
}
