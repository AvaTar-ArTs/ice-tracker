/**
 * Google Analytics 4 (GA4) helpers.
 * Set NEXT_PUBLIC_GA_ID (e.g. G-XXXXXXXXXX) to enable.
 */

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

export function isAnalyticsEnabled(): boolean {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  return typeof id === "string" && id.length > 0;
}

/** Send a custom event to GA4. Safe to call when GA is not loaded. */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
): void {
  if (typeof window === "undefined" || !window.gtag || !isAnalyticsEnabled()) return;
  window.gtag("event", eventName, params as Record<string, unknown>);
}

/** Event names used across the app (for GA4 reports). */
export const ANALYTICS_EVENTS = {
  /** User changed state filter. */
  FILTER_STATE: "filter_state",
  /** User changed source filter. */
  FILTER_SOURCE: "filter_source",
  /** User submitted a community report. */
  COMMUNITY_REPORT: "community_report_submit",
  /** User clicked a news item (outbound to ICE.gov). */
  NEWS_CLICK: "news_click",
  /** User clicked manual refresh. */
  REFRESH_CLICK: "refresh_click",
  /** User opened/closed FAQ. */
  FAQ_TOGGLE: "faq_toggle",
  /** User opened/closed "Ways to get live updates". */
  LIVE_TIPS_TOGGLE: "live_tips_toggle",
  /** User opened report form. */
  REPORT_FORM_OPEN: "report_form_open",
  /** Map marker/popup interaction (generic). */
  MAP_INTERACTION: "map_interaction",
} as const;
