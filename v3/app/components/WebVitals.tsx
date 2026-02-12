"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (typeof window === "undefined" || !window.gtag) return;
    const id = process.env.NEXT_PUBLIC_GA_ID;
    if (!id) return;
    const value = metric.name === "CLS" ? Math.round(metric.value * 1000) : Math.round(metric.value);
    window.gtag("event", metric.name, { value, event_label: metric.id, non_interaction: true });
  });
  return null;
}
