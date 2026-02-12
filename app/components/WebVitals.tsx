"use client";

import { useReportWebVitals } from "next/web-vitals";

/** Sends Core Web Vitals to GA4 when NEXT_PUBLIC_GA_ID is set. */
export function WebVitals() {
  useReportWebVitals((metric) => {
    if (typeof window === "undefined" || !window.gtag) return;
    const id = process.env.NEXT_PUBLIC_GA_ID;
    if (!id) return;
    // GA4 expects integers; CLS is 0-1 so scale for readability
    const value =
      metric.name === "CLS" ? Math.round(metric.value * 1000) : Math.round(metric.value);
    window.gtag("event", metric.name, {
      value,
      event_label: metric.id,
      non_interaction: true,
    });
  });
  return null;
}
