const ONE_DAY_MS = 86_400_000;
const TWO_DAYS_MS = 172_800_000;

/** Format a date string for the news feed sidebar (includes time for today). */
export function formatDateFeed(s: string): string {
  try {
    const d = new Date(s);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < ONE_DAY_MS) return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    if (diff < TWO_DAYS_MS) return "Yesterday";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

/** Format a date string for map popups (day-level granularity). */
export function formatDateMap(s: string): string {
  try {
    const d = new Date(s);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < ONE_DAY_MS) return "Today";
    if (diff < TWO_DAYS_MS) return "Yesterday";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return "";
  }
}
