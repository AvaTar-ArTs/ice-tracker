"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import type { IceNewsItem } from "./api/ice-news/route";
import eroOffices from "@/data/ero-offices.json";
import stateCoordsJson from "@/data/state-coords.json";
import {
  getCommunityReports,
  saveCommunityReport,
  clearAllCommunityReports,
  type CommunityReport,
} from "@/app/lib/community-reports";
import { SEO_FAQS } from "@/app/lib/seo";
import { trackEvent, ANALYTICS_EVENTS } from "@/app/lib/analytics";
import { formatDateFeed } from "@/app/lib/format-date";

const MapView = dynamic(() => import("@/app/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#0c0e12] text-[#6b7280]">
      Loading map…
    </div>
  ),
});

const REFRESH_INTERVALS = [
  { label: "1 min", ms: 60 * 1000 },
  { label: "5 min", ms: 5 * 60 * 1000 },
  { label: "15 min", ms: 15 * 60 * 1000 },
];
const DEFAULT_REFRESH_MS = 5 * 60 * 1000;
const STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI",
  "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN",
  "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH",
  "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA",
  "WV", "WI", "WY", "PR",
];

export default function Home() {
  const [news, setNews] = useState<IceNewsItem[]>([]);
  const [updated, setUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterState, setFilterState] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<"all" | "enforcement" | "breaking" | "state">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>([]);
  const [refreshMs, setRefreshMs] = useState(DEFAULT_REFRESH_MS);
  const [newCount, setNewCount] = useState(0);
  const [showLiveTips, setShowLiveTips] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [reportForm, setReportForm] = useState({ state: "", city: "", description: "" });
  const offices = eroOffices as { id: string; name: string; city: string; state: string; lat: number; lng: number; area: string }[];
  const stateCoords = stateCoordsJson as unknown as Record<string, [number, number]>;

  const newsIdsRef = useRef<Set<string>>(new Set());
  const [fetchError, setFetchError] = useState(false);
  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch("/api/ice-news");
      if (!res.ok) {
        setFetchError(true);
        return;
      }
      const data = await res.json();
      setFetchError(false);
      if (data.items) {
        const prevIds = newsIdsRef.current;
        const added = data.items.filter((n: IceNewsItem) => !prevIds.has(n.id));
        if (added.length > 0) setNewCount((c) => c + added.length);
        newsIdsRef.current = new Set(data.items.map((n: IceNewsItem) => n.id));
        setNews(data.items);
      }
      if (data.updated) setUpdated(data.updated);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setCommunityReports(getCommunityReports());
  }, []);

  useEffect(() => {
    fetchNews();
    const t = setInterval(fetchNews, refreshMs);
    return () => clearInterval(t);
  }, [fetchNews, refreshMs]);

  const filtered = news.filter((n) => {
    if (filterState && n.state !== filterState) return false;
    if (filterSource !== "all" && n.source !== filterSource) return false;
    return true;
  });

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.state.trim()) return;
    const r = saveCommunityReport({
      state: reportForm.state.trim(),
      city: reportForm.city.trim(),
      description: reportForm.description.trim(),
    });
    trackEvent(ANALYTICS_EVENTS.COMMUNITY_REPORT, { state: r.state });
    setCommunityReports(getCommunityReports());
    setReportForm({ state: "", city: "", description: "" });
    setShowReportForm(false);
  };

  const handleClearReports = () => {
    if (typeof window !== "undefined" && confirm("Clear all your community reports?")) {
      clearAllCommunityReports();
      setCommunityReports([]);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="flex-shrink-0 border-b border-[#2a303c] bg-[#0c0e12]/95 backdrop-blur px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-[#e2e6ec] tracking-tight">
            ICE Activity Tracker
          </h1>
          <span className="text-xs text-[#6b7280] hidden sm:inline">
            U.S. Immigration and Customs Enforcement · Live feed
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
          <select
            value={refreshMs}
            onChange={(e) => setRefreshMs(Number(e.target.value))}
            className="bg-[#161a22] border border-[#2a303c] rounded px-2 py-1 text-[#e2e6ec]"
          >
            {REFRESH_INTERVALS.map(({ label, ms }) => (
              <option key={ms} value={ms}>{label}</option>
            ))}
          </select>
          {updated && (
            <span title={updated}>
              Updated {new Date(updated).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          {newCount > 0 && (
            <button
              type="button"
              onClick={() => setNewCount(0)}
              className="px-2 py-1 rounded bg-[#065f46] text-[#6ee7b7]"
            >
              {newCount} new
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchNews();
              trackEvent(ANALYTICS_EVENTS.REFRESH_CLICK);
            }}
            className="px-2 py-1 rounded bg-[#1f2430] hover:bg-[#2a303c] text-[#e2e6ec]"
          >
            Refresh
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        <aside className="w-full sm:w-[380px] flex-shrink-0 flex flex-col border-r border-[#2a303c] bg-[#0c0e12] overflow-hidden">
          <div className="p-3 border-b border-[#2a303c] space-y-2">
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterState ?? ""}
                onChange={(e) => {
                const v = e.target.value || null;
                setFilterState(v);
                trackEvent(ANALYTICS_EVENTS.FILTER_STATE, { state: v || "all" });
              }}
                className="bg-[#161a22] border border-[#2a303c] rounded px-2 py-1.5 text-sm text-[#e2e6ec]"
              >
                <option value="">All states</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={filterSource}
                onChange={(e) => {
                const v = e.target.value as "all" | "enforcement" | "breaking" | "state";
                setFilterSource(v);
                trackEvent(ANALYTICS_EVENTS.FILTER_SOURCE, { source: v });
              }}
                className="bg-[#161a22] border border-[#2a303c] rounded px-2 py-1.5 text-sm text-[#e2e6ec]"
              >
                <option value="all">All sources</option>
                <option value="enforcement">Enforcement & Removal</option>
                <option value="breaking">Breaking news</option>
                <option value="state">State feeds</option>
              </select>
              <button
                type="button"
                onClick={() => {
                setShowReportForm((v) => !v);
                trackEvent(ANALYTICS_EVENTS.REPORT_FORM_OPEN);
              }}
                className="px-2 py-1.5 rounded bg-[#1f2430] hover:bg-[#2a303c] text-[#e2e6ec] text-sm border border-[#2a303c]"
              >
                + Report
              </button>
            </div>
            {showReportForm && (
              <form onSubmit={handleSubmitReport} className="p-3 rounded-lg border border-[#2a303c] bg-[#161a22] space-y-2">
                <p className="text-xs text-[#9ca3af]">Add a community report (saved in this browser only). Unverified.</p>
                <input
                  placeholder="State (e.g. CA)"
                  value={reportForm.state}
                  onChange={(e) => setReportForm((f) => ({ ...f, state: e.target.value.toUpperCase().slice(0, 2) }))}
                  className="w-full bg-[#0c0e12] border border-[#2a303c] rounded px-2 py-1.5 text-sm text-[#e2e6ec]"
                />
                <input
                  placeholder="City (optional)"
                  value={reportForm.city}
                  onChange={(e) => setReportForm((f) => ({ ...f, city: e.target.value }))}
                  className="w-full bg-[#0c0e12] border border-[#2a303c] rounded px-2 py-1.5 text-sm text-[#e2e6ec]"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={reportForm.description}
                  onChange={(e) => setReportForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-[#0c0e12] border border-[#2a303c] rounded px-2 py-1.5 text-sm text-[#e2e6ec] resize-none"
                />
                <div className="flex gap-2">
                  <button type="submit" className="px-2 py-1 rounded bg-[#3b82f6] text-white text-sm">Save</button>
                  <button type="button" onClick={() => setShowReportForm(false)} className="px-2 py-1 rounded bg-[#2a303c] text-[#e2e6ec] text-sm">Cancel</button>
                </div>
              </form>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs text-[#6b7280]">
                {filtered.length} item{filtered.length !== 1 ? "s" : ""} · Blue = ERO · Red = news · Orange = your reports
              </p>
              {communityReports.length > 0 && (
                <button type="button" onClick={handleClearReports} className="text-xs text-[#f59e0b] hover:underline">
                  Clear my reports ({communityReports.length})
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setShowFaq((v) => !v);
                trackEvent(ANALYTICS_EVENTS.FAQ_TOGGLE);
              }}
              className="text-xs text-[#93c5fd] hover:underline"
            >
              {showFaq ? "Hide FAQ" : "FAQ"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLiveTips((v) => !v);
                trackEvent(ANALYTICS_EVENTS.LIVE_TIPS_TOGGLE);
              }}
              className="text-xs text-[#93c5fd] hover:underline"
            >
              {showLiveTips ? "Hide" : "Ways to get live updates"}
            </button>
            {showFaq && (
              <section className="p-3 rounded-lg border border-[#2a303c] bg-[#161a22] text-xs space-y-3" aria-label="Frequently asked questions">
                <h3 className="font-medium text-[#e2e6ec]">FAQ</h3>
                {SEO_FAQS.map(({ question, answer }, i) => (
                  <div key={i}>
                    <p className="font-medium text-[#e2e6ec]">{question}</p>
                    <p className="text-[#9ca3af] mt-0.5">{answer}</p>
                  </div>
                ))}
              </section>
            )}
            {showLiveTips && (
              <div className="p-3 rounded-lg border border-[#2a303c] bg-[#161a22] text-xs text-[#9ca3af] space-y-2">
                <p className="font-medium text-[#e2e6ec]">More live sources (outside this app):</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>ICE.gov RSS</strong> — This app pulls Enforcement, Breaking, and 10 state feeds; choose a faster refresh above.</li>
                  <li><strong>@ICEgov</strong> (X/Twitter) — Official ICE announcements and press releases.</li>
                  <li><strong>Local immigrant rights orgs</strong> — Many post alerts (e.g. RAICES, ACLU, local rapid-response networks).</li>
                  <li><strong>News alerts</strong> — Google News or news app alerts for “ICE” + your city/state.</li>
                  <li><strong>Community reports</strong> — Use “+ Report” above to log what you see; data stays in your browser only unless you add a backend.</li>
                </ul>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-2" role="feed" aria-label="Latest ICE enforcement and ERO news">
            <h2 id="feed-heading" className="text-xs font-medium text-[#9ca3af] px-1 mb-2">
              Latest ICE activity & enforcement news
            </h2>
            {fetchError && (
              <div className="text-center text-[#f59e0b] py-2 text-xs">Failed to fetch — showing last known data.</div>
            )}
            {loading && news.length === 0 ? (
              <div className="text-center text-[#6b7280] py-8">Loading ICE news…</div>
            ) : filtered.length === 0 ? (
              <div className="text-center text-[#6b7280] py-8">No items match filters.</div>
            ) : (
              <ul className="space-y-2">
                {filtered.slice(0, 80).map((item) => (
                  <li key={item.id}>
                    <article
                      className={`rounded-lg border p-3 cursor-pointer transition-colors ${
                        selectedId === item.id
                          ? "border-[#3b82f6] bg-[#1e3a5f]/30"
                          : "border-[#2a303c] bg-[#161a22] hover:bg-[#1f2430]"
                      }`}
                      onClick={() => setSelectedId(item.id)}
                    >
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-sm text-[#93c5fd] hover:underline line-clamp-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          trackEvent(ANALYTICS_EVENTS.NEWS_CLICK, {
                            link: item.link,
                            state: item.state ?? "",
                          });
                        }}
                      >
                        {item.title}
                      </a>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[#9ca3af]">
                        {item.state && <span>{item.state}</span>}
                        {item.city && <span>{item.city}</span>}
                        <span>{formatDateFeed(item.pubDate)}</span>
                        <span className="text-[#6b7280]">{item.source}</span>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <main className="flex-1 min-w-0 relative">
          <MapView
            offices={offices}
            stateCoords={stateCoords}
            news={filtered}
            communityReports={communityReports}
            selectedState={filterState}
            onSelectNews={setSelectedId}
            onSelectCommunityReport={setSelectedId}
          />
        </main>
      </div>

      <footer className="flex-shrink-0 border-t border-[#2a303c] px-4 py-2 text-xs text-[#6b7280] flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>Data: ICE.gov news RSS (Enforcement & Removal, Breaking News). Not real-time.</span>
        <a href="https://www.ice.gov/newsroom" target="_blank" rel="noopener noreferrer" className="text-[#93c5fd] hover:underline">ICE Newsroom</a>
        <a href="https://www.ice.gov/contact/field-offices" target="_blank" rel="noopener noreferrer" className="text-[#93c5fd] hover:underline">ERO field offices</a>
      </footer>
    </div>
  );
}
