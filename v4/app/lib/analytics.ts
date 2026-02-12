/**
 * Google Analytics 4 (GA4) helpers.
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

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
): void {
  if (typeof window === "undefined" || !window.gtag || !isAnalyticsEnabled()) return;
  window.gtag("event", eventName, params as Record<string, unknown>);
}

export const ANALYTICS_EVENTS = {
  FILTER_STATE: "filter_state",
  FILTER_SOURCE: "filter_source",
  COMMUNITY_REPORT: "community_report_submit",
  NEWS_CLICK: "news_click",
  REFRESH_CLICK: "refresh_click",
  FAQ_TOGGLE: "faq_toggle",
  LIVE_TIPS_TOGGLE: "live_tips_toggle",
  REPORT_FORM_OPEN: "report_form_open",
  MAP_INTERACTION: "map_interaction",
  KNOW_YOUR_RIGHTS_TOGGLE: "know_your_rights_toggle",
  RESOURCES_HOTLINES_TOGGLE: "resources_hotlines_toggle",
  AI_SUMMARY_REQUEST: "ai_summary_request",
  AI_SUMMARY_SUCCESS: "ai_summary_success",
  AI_SUMMARY_ERROR: "ai_summary_error",
} as const;
