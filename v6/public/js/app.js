/**
 * v6: Enhanced app — search, timeline view, export CSV, keyboard nav, SSE toast, focus mode, AI summary + key points.
 */
const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","PR"];
const STORAGE_REPORTS = "ice-tracker-v6-community-reports";
const MAX_AI_INPUT = 2000;

const KNOW_YOUR_RIGHTS = {
  intro: "This is general information only, not legal advice. If ICE or other enforcement agents contact you or your family, these points can help you stay safer. When in doubt, say you want to speak to a lawyer and stay calm.",
  sections: [
    { title: "You do not have to open the door", body: "ICE (or CBP) agents may come to your home. You do not have to open the door unless they show a warrant signed by a judge. Ask them to slip the warrant under the door or hold it to the window. A warrant from ICE alone (administrative warrant) is not enough to require you to open the door." },
    { title: "You have the right to remain silent", body: "You can say: \"I am exercising my right to remain silent.\" You do not have to answer questions about where you were born, your immigration status, or whether you are a citizen." },
    { title: "You have the right to speak to a lawyer", body: "Say: \"I want to speak to a lawyer.\" If you are detained, you have the right to call a lawyer. Do not sign any papers without talking to a lawyer first." },
    { title: "Do not consent to a search", body: "You can say: \"I do not consent to a search.\" Officers may still pat you down for weapons. Do not resist physically; clearly state that you do not consent." },
    { title: "Carry important documents safely", body: "Keep copies of your immigration papers, IDs, and emergency contact numbers in a safe place. Give a trusted person copies so they can help if you are detained." },
    { title: "Make a family preparedness plan", body: "Decide who will care for children or dependents if a parent or caregiver is detained. Write down important phone numbers (lawyer, consulate, family)." },
  ],
  disclaimer: "This is general information only, not legal advice. Consult an attorney for your situation.",
};

const FAQ = [
  { q: "What is ICE Activity Tracker v6?", a: "A live map and news feed for U.S. ICE activity with search, timeline view, export, Know Your Rights, hotlines, and in-browser AI. v6 adds PWA, SSE updates, and a frost theme." },
  { q: "Is the data real-time?", a: "The feed pulls from ICE.gov press releases and state RSS feeds. Use the refresh dropdown and optional SSE for quicker awareness of new items." },
  { q: "How does AI work?", a: "Summarization and key points run in your browser via Transformers.js; no API keys. First run may download a model." },
];

const LIVE_TIPS = [
  "This app — Use refresh interval and optional SSE. Open Know Your Rights and Hotlines above.",
  "Community report — Use \"+ Report\"; data stays in this browser.",
  "SMS — In Hotlines you'll find a national option to text REPORT for alerts.",
  "Official ICE — ICE.gov RSS and @ICEgov on X/Twitter.",
];

let state = {
  news: [],
  updated: null,
  loading: true,
  fetchError: null,
  filterState: "",
  filterSource: "all",
  searchQuery: "",
  viewMode: "list",
  selectedId: null,
  communityReports: [],
  refreshMs: 300000,
  newCount: 0,
  reportFormVisible: false,
  kyrVisible: false,
  hotlinesVisible: false,
  faqVisible: false,
  liveTipsVisible: false,
  aiLoading: false,
  aiText: null,
  aiError: null,
  focusMode: false,
};
let offices = [];
let stateCoords = {};
let hotlinesData = { national: [], byState: {} };
let refreshTimer = null;
let sseEventSource = null;

function getReports() {
  try {
    const raw = localStorage.getItem(STORAGE_REPORTS);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveReports(reports) {
  localStorage.setItem(STORAGE_REPORTS, JSON.stringify(reports.slice(0, 200)));
}
function addReport(r) {
  const reports = getReports();
  const newR = {
    id: "community-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9),
    state: r.state,
    city: r.city || "",
    description: r.description || "",
    createdAt: new Date().toISOString(),
  };
  reports.unshift(newR);
  saveReports(reports);
  return newR;
}
function clearReports() {
  localStorage.removeItem(STORAGE_REPORTS);
}

function getFilterFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const stateParam = params.get("state")?.toUpperCase().trim() || "";
  const sourceParam = params.get("source")?.toLowerCase() || "all";
  const source = ["enforcement", "breaking", "state"].includes(sourceParam) ? sourceParam : "all";
  return { state: stateParam, source };
}
function setUrlFromFilter(filterState, filterSource) {
  const params = new URLSearchParams();
  if (filterState) params.set("state", filterState);
  if (filterSource !== "all") params.set("source", filterSource);
  const qs = params.toString();
  const url = qs ? window.location.pathname + "?" + qs : window.location.pathname;
  window.history.replaceState(null, "", url);
}

function formatDate(s) {
  try {
    const d = new Date(s);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000) return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    if (diff < 172800000) return "Yesterday";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch { return ""; }
}
function formatDateFull(s) {
  try {
    return new Date(s).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  } catch { return ""; }
}

function filteredNews() {
  let list = state.news.filter(function (n) {
    if (state.filterState && n.state !== state.filterState) return false;
    if (state.filterSource !== "all" && n.source !== state.filterSource) return false;
    return true;
  });
  const q = (state.searchQuery || "").trim().toLowerCase();
  if (q) {
    list = list.filter(function (n) {
      const text = [n.title, n.description, n.state, n.city].filter(Boolean).join(" ").toLowerCase();
      return text.includes(q);
    });
  }
  return list;
}

function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(el._toastTimer);
  el._toastTimer = setTimeout(function () { el.hidden = true; }, 3000);
}

function fetchNews() {
  state.loading = true;
  state.fetchError = null;
  const errEl = document.getElementById("fetch-error");
  if (errEl) { errEl.hidden = true; errEl.innerHTML = ""; }
  fetch("/api/ice-news")
    .then(function (res) { return res.json(); })
    .then(function (data) {
      state.loading = false;
      if (data.error) {
        state.fetchError = data.error;
        state.news = [];
        if (errEl) {
          errEl.innerHTML = "<span>" + escapeHtml(data.error) + "</span><button type=\"button\">Retry</button>";
          errEl.hidden = false;
          errEl.querySelector("button").onclick = function () { fetchNews(); };
        }
        render();
        return;
      }
      if (data.items && data.items.length) {
        const prevIds = new Set(state.news.map(function (n) { return n.id; }));
        const added = data.items.filter(function (n) { return !prevIds.has(n.id); });
        if (added.length > 0) {
          state.newCount += added.length;
          showToast(added.length + " new item(s)");
        }
        state.news = data.items;
      }
      if (data.updated) state.updated = data.updated;
      render();
      if (window.MapController) {
        window.MapController.updateNews(filteredNews(), state.filterState || null);
        window.MapController.updateCommunityReports(state.communityReports);
      }
    })
    .catch(function () {
      state.loading = false;
      state.fetchError = "Network error";
      state.news = [];
      if (errEl) {
        errEl.innerHTML = "<span>Network error</span><button type=\"button\">Retry</button>";
        errEl.hidden = false;
        errEl.querySelector("button").onclick = function () { fetchNews(); };
      }
      render();
    });
}

function escapeHtml(str) {
  if (str == null) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderFeedList(items, listEl) {
  if (!listEl) return;
  listEl.innerHTML = items.slice(0, 80).map(function (item) {
    const selected = state.selectedId === item.id ? " selected" : "";
    return "<li><article class=\"feed-item" + selected + "\" data-id=\"" + escapeHtml(item.id) + "\">" +
      "<a href=\"" + escapeHtml(item.link) + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + escapeHtml(item.title) + "</a>" +
      "<div class=\"feed-meta\">" + (item.state ? "<span>" + escapeHtml(item.state) + "</span>" : "") +
      (item.city ? "<span>" + escapeHtml(item.city) + "</span>" : "") +
      "<span>" + formatDate(item.pubDate) + "</span>" +
      "<span class=\"feed-source\">" + escapeHtml(item.source) + "</span></div></article></li>";
  }).join("");
  listEl.querySelectorAll(".feed-item").forEach(function (el) {
    el.addEventListener("click", function (e) {
      if (e.target.tagName === "A") return;
      state.selectedId = el.getAttribute("data-id");
      listEl.querySelectorAll(".feed-item").forEach(function (x) { x.classList.remove("selected"); });
      el.classList.add("selected");
      render();
    });
  });
  listEl.querySelectorAll(".feed-item a").forEach(function (a) {
    a.addEventListener("click", function (e) { e.stopPropagation(); });
  });
}

function renderTimeline(items) {
  const byDate = {};
  items.forEach(function (n) {
    const d = (n.pubDate || "").slice(0, 10);
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(n);
  });
  const sortedDates = Object.keys(byDate).sort(function (a, b) { return b.localeCompare(a); });
  const timelineEl = document.getElementById("feed-timeline");
  if (!timelineEl) return;
  timelineEl.innerHTML = sortedDates.map(function (d) {
    const dayItems = byDate[d];
    const listId = "timeline-list-" + d;
    const frag = "<div class=\"timeline-day\"><div class=\"timeline-date\">" + escapeHtml(formatDateFull(d)) + "</div><ul id=\"" + listId + "\" class=\"feed-list\"></ul></div>";
    return frag;
  }).join("");
  sortedDates.forEach(function (d) {
    const listEl = document.getElementById("timeline-list-" + d);
    if (listEl) renderFeedList(byDate[d], listEl);
  });
}

function render() {
  const filtered = filteredNews();
  const listEl = document.getElementById("feed-list");
  const timelineEl = document.getElementById("feed-timeline");
  const loadingEl = document.getElementById("feed-loading");
  const emptyEl = document.getElementById("feed-empty");
  const countEl = document.getElementById("feed-count");
  const updatedEl = document.getElementById("updated-label");
  const btnNew = document.getElementById("btn-new");
  const btnSummary = document.getElementById("btn-ai-summary");
  const btnPoints = document.getElementById("btn-ai-points");

  if (countEl) countEl.textContent = filtered.length + " item" + (filtered.length !== 1 ? "s" : "");
  if (updatedEl && state.updated) updatedEl.textContent = "Updated " + new Date(state.updated).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  if (btnNew) {
    if (state.newCount > 0) {
      btnNew.textContent = state.newCount + " new";
      btnNew.hidden = false;
      btnNew.onclick = function () { state.newCount = 0; if (btnNew) btnNew.hidden = true; };
    } else btnNew.hidden = true;
  }
  if (btnSummary) btnSummary.disabled = state.aiLoading || filtered.length === 0;
  if (btnPoints) btnPoints.disabled = state.aiLoading || filtered.length === 0;

  if (state.loading && state.news.length === 0 && !state.fetchError) {
    if (loadingEl) loadingEl.hidden = false;
    if (listEl) listEl.hidden = true;
    if (timelineEl) timelineEl.hidden = true;
    if (emptyEl) emptyEl.hidden = true;
  } else if (filtered.length === 0) {
    if (loadingEl) loadingEl.hidden = true;
    if (listEl) listEl.hidden = true;
    if (timelineEl) timelineEl.hidden = true;
    if (emptyEl) emptyEl.hidden = false;
  } else {
    if (loadingEl) loadingEl.hidden = true;
    if (emptyEl) emptyEl.hidden = true;
    if (state.viewMode === "timeline") {
      if (listEl) listEl.hidden = true;
      if (timelineEl) {
        timelineEl.hidden = false;
        renderTimeline(filtered);
      }
    } else {
      if (timelineEl) timelineEl.hidden = true;
      if (listEl) {
        listEl.hidden = false;
        renderFeedList(filtered, listEl);
      }
    }
  }
}

function renderPanels() {
  const panelKyr = document.getElementById("panel-kyr");
  const panelHotlines = document.getElementById("panel-hotlines");
  const panelFaq = document.getElementById("panel-faq");
  const panelLiveTips = document.getElementById("panel-live-tips");
  if (panelKyr) {
    panelKyr.hidden = !state.kyrVisible;
    if (state.kyrVisible) {
      panelKyr.innerHTML = "<h3>Know Your Rights</h3><button type=\"button\" class=\"link-btn\" style=\"float:right\" aria-label=\"Close\">✕</button>" +
        "<p class=\"italic\">" + escapeHtml(KNOW_YOUR_RIGHTS.intro) + "</p>" +
        KNOW_YOUR_RIGHTS.sections.map(function (s) {
          return "<h4>" + escapeHtml(s.title) + "</h4><p>" + escapeHtml(s.body) + "</p>";
        }).join("") +
        "<p style=\"font-size:0.7rem;color:var(--frost-muted);border-top:1px solid var(--frost-border);padding-top:0.5rem;margin-top:0.5rem\">" + escapeHtml(KNOW_YOUR_RIGHTS.disclaimer) + "</p>";
      panelKyr.querySelector("button").onclick = function () { state.kyrVisible = false; renderPanels(); };
    }
  }
  if (panelHotlines && state.hotlinesVisible) {
    panelHotlines.hidden = false;
    const national = hotlinesData.national || [];
    const stateKey = (state.filterState || "").toUpperCase();
    const stateInfo = stateKey && hotlinesData.byState && hotlinesData.byState[stateKey];
    const stateHotlines = stateInfo ? stateInfo.hotlines : (hotlinesData.byState && hotlinesData.byState.default ? hotlinesData.byState.default.hotlines : []);
    let html = "<h3>Rapid response & hotlines</h3><button type=\"button\" class=\"link-btn\" style=\"float:right\" aria-label=\"Close\">✕</button>";
    html += "<p>Use the state filter to see hotlines for that state.</p>";
    if (stateInfo) html += "<h4>" + escapeHtml(stateInfo.stateName) + " (" + escapeHtml(stateKey) + ")</h4><ul>" + (stateHotlines.map(function (h) {
      return "<li><strong>" + escapeHtml(h.name) + "</strong>" + (h.phone ? " <a href=\"tel:" + (h.phone.replace(/\D/g, "")) + "\">" + escapeHtml(h.phone) + "</a>" : "") + " " + escapeHtml(h.description || "") + (h.url ? " <a href=\"" + escapeHtml(h.url) + "\" target=\"_blank\" rel=\"noopener\">More</a>" : "") + "</li>";
    }).join("")) + "</ul>";
    html += "<h4>National</h4><ul>" + national.map(function (h) {
      return "<li><strong>" + escapeHtml(h.name) + "</strong>" + (h.phone ? " <a href=\"tel:" + (h.phone.replace(/\D/g, "")) + "\">" + escapeHtml(h.phone) + "</a>" : "") + " " + escapeHtml(h.description || "") + (h.url ? " <a href=\"" + escapeHtml(h.url) + "\" target=\"_blank\" rel=\"noopener\">More</a>" : "") + "</li>";
    }).join("") + "</ul>";
    html += "<p style=\"font-size:0.7rem;color:var(--frost-muted)\">Numbers may change. This app does not operate these hotlines.</p>";
    panelHotlines.innerHTML = html;
    panelHotlines.querySelector("button").onclick = function () { state.hotlinesVisible = false; renderPanels(); };
  } else if (panelHotlines) panelHotlines.hidden = true;
  if (panelFaq) {
    panelFaq.hidden = !state.faqVisible;
    if (state.faqVisible) panelFaq.innerHTML = "<h3>FAQ</h3>" + FAQ.map(function (f) { return "<p><strong>" + escapeHtml(f.q) + "</strong></p><p>" + escapeHtml(f.a) + "</p>"; }).join("");
  }
  if (panelLiveTips) {
    panelLiveTips.hidden = !state.liveTipsVisible;
    if (state.liveTipsVisible) panelLiveTips.innerHTML = "<h3>Ways to get live updates</h3><ul>" + LIVE_TIPS.map(function (t) { return "<li>" + escapeHtml(t) + "</li>"; }).join("") + "</ul>";
  }
}

function runAiSummary(asKeyPoints) {
  const filtered = filteredNews();
  if (filtered.length === 0) return;
  state.aiLoading = true;
  state.aiError = null;
  state.aiText = null;
  document.getElementById("ai-error").hidden = true;
  document.getElementById("ai-result").hidden = true;
  render();
  const text = filtered.slice(0, 15).map(function (n) { return [n.title, n.description, n.state].filter(Boolean).join(" "); }).join(" ").slice(0, MAX_AI_INPUT).trim();
  if (!text) {
    state.aiLoading = false;
    state.aiError = "No text to summarize.";
    document.getElementById("ai-error").textContent = state.aiError;
    document.getElementById("ai-error").hidden = false;
    render();
    return;
  }
  import("https://esm.sh/@huggingface/transformers@3")
    .then(function (mod) { return mod.pipeline("summarization"); })
    .then(function (summarizer) { return summarizer(text, { max_length: asKeyPoints ? 120 : 150, min_length: 40, do_sample: false }); })
    .then(function (result) {
      const arr = Array.isArray(result) ? result : [result];
      const first = arr[0];
      let summary = (first && first.summary_text) ? String(first.summary_text) : "Could not generate.";
      if (asKeyPoints && summary) {
        summary = summary.split(/\.\s+/).filter(Boolean).map(function (s) { return "• " + (s.trim().replace(/\.$/, "") ? s.trim() : s); }).join("\n");
      }
      state.aiLoading = false;
      state.aiText = summary;
      document.getElementById("ai-text").textContent = summary;
      document.getElementById("ai-result").hidden = false;
      render();
    })
    .catch(function (err) {
      state.aiLoading = false;
      state.aiError = (err && err.message) ? err.message : "Summarization failed";
      document.getElementById("ai-error").textContent = state.aiError;
      document.getElementById("ai-error").hidden = false;
      render();
    });
}

function exportCsv() {
  const filtered = filteredNews();
  if (filtered.length === 0) {
    showToast("No items to export");
    return;
  }
  const headers = ["Title", "Link", "State", "City", "Source", "Date"];
  const rows = filtered.slice(0, 200).map(function (n) {
    return [n.title, n.link, n.state || "", n.city || "", n.source || "", n.pubDate || ""].map(function (cell) {
      const s = String(cell);
      return s.includes(",") || s.includes('"') || s.includes("\n") ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(",");
  });
  const csv = [headers.join(",")].concat(rows).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ice-tracker-v6-" + new Date().toISOString().slice(0, 10) + ".csv";
  a.click();
  URL.revokeObjectURL(a.href);
  showToast("Exported " + rows.length + " rows");
}

function setupSSE() {
  try {
    if (sseEventSource) sseEventSource.close();
    sseEventSource = new EventSource("/api/events");
    sseEventSource.addEventListener("refresh", function () {
      showToast("Feed updated");
      fetchNews();
    });
  } catch (_) {}
}

function bind() {
  const params = getFilterFromUrl();
  state.filterState = params.state;
  state.filterSource = params.source;

  const stateSelect = document.getElementById("filter-state");
  if (stateSelect) {
    US_STATES.forEach(function (s) {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      stateSelect.appendChild(opt);
    });
    stateSelect.value = state.filterState;
    stateSelect.addEventListener("change", function () {
      state.filterState = stateSelect.value || "";
      setUrlFromFilter(state.filterState, state.filterSource);
      render();
      if (window.MapController) window.MapController.updateNews(filteredNews(), state.filterState || null);
    });
  }
  const sourceSelect = document.getElementById("filter-source");
  if (sourceSelect) {
    sourceSelect.value = state.filterSource;
    sourceSelect.addEventListener("change", function () {
      state.filterSource = sourceSelect.value;
      setUrlFromFilter(state.filterState, state.filterSource);
      render();
      if (window.MapController) window.MapController.updateNews(filteredNews(), state.filterState || null);
    });
  }

  const searchEl = document.getElementById("search");
  if (searchEl) {
    searchEl.value = state.searchQuery;
    searchEl.addEventListener("input", function () {
      state.searchQuery = searchEl.value;
          render();
        });
  }

  const viewModeBtn = document.getElementById("btn-view-mode");
  if (viewModeBtn) {
    viewModeBtn.textContent = state.viewMode === "timeline" ? "List" : "Timeline";
    viewModeBtn.classList.toggle("active", state.viewMode === "timeline");
    viewModeBtn.addEventListener("click", function () {
      state.viewMode = state.viewMode === "timeline" ? "list" : "timeline";
      viewModeBtn.textContent = state.viewMode === "timeline" ? "List" : "Timeline";
      viewModeBtn.classList.toggle("active", state.viewMode === "timeline");
      render();
    });
  }

  document.getElementById("refresh-interval").addEventListener("change", function (e) {
    state.refreshMs = parseInt(e.target.value, 10);
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(fetchNews, state.refreshMs);
  });
  document.getElementById("btn-refresh").addEventListener("click", function () { fetchNews(); });
  document.getElementById("btn-focus").addEventListener("click", function () {
    state.focusMode = !state.focusMode;
    document.getElementById("app").classList.toggle("focus-mode", state.focusMode);
    showToast(state.focusMode ? "Focus mode on" : "Focus mode off");
  });
  document.getElementById("btn-export").addEventListener("click", exportCsv);
  document.getElementById("btn-report").addEventListener("click", function () {
    state.reportFormVisible = !state.reportFormVisible;
    document.getElementById("form-report").hidden = !state.reportFormVisible;
  });
  document.getElementById("btn-cancel-report").addEventListener("click", function () {
    state.reportFormVisible = false;
    document.getElementById("form-report").hidden = true;
  });
  document.getElementById("form-report").addEventListener("submit", function (e) {
    e.preventDefault();
    const st = document.getElementById("report-state").value.trim().toUpperCase().slice(0, 2);
    if (!st) return;
    addReport({
      state: st,
      city: document.getElementById("report-city").value.trim(),
      description: document.getElementById("report-desc").value.trim(),
    });
    state.communityReports = getReports();
    document.getElementById("report-state").value = "";
    document.getElementById("report-city").value = "";
    document.getElementById("report-desc").value = "";
    state.reportFormVisible = false;
    document.getElementById("form-report").hidden = true;
    render();
    renderPanels();
    if (window.MapController) window.MapController.updateCommunityReports(state.communityReports);
    const clearBtn = document.getElementById("btn-clear-reports");
    if (clearBtn) { clearBtn.textContent = "Clear reports (" + state.communityReports.length + ")"; clearBtn.hidden = false; }
  });
  document.getElementById("btn-kyr").addEventListener("click", function () {
    state.kyrVisible = !state.kyrVisible;
    if (state.kyrVisible) state.hotlinesVisible = false;
    renderPanels();
  });
  document.getElementById("btn-hotlines").addEventListener("click", function () {
    state.hotlinesVisible = !state.hotlinesVisible;
    if (state.hotlinesVisible) state.kyrVisible = false;
    renderPanels();
  });
  document.getElementById("btn-faq").addEventListener("click", function () { state.faqVisible = !state.faqVisible; renderPanels(); });
  document.getElementById("btn-live-tips").addEventListener("click", function () { state.liveTipsVisible = !state.liveTipsVisible; renderPanels(); });
  document.getElementById("btn-ai-summary").addEventListener("click", function () { runAiSummary(false); });
  document.getElementById("btn-ai-points").addEventListener("click", function () { runAiSummary(true); });

  const clearBtn = document.getElementById("btn-clear-reports");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (!confirm("Clear all your community reports?")) return;
      clearReports();
      state.communityReports = [];
      clearBtn.hidden = true;
      if (window.MapController) window.MapController.updateCommunityReports([]);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) return;
    if (e.key === "Escape") {
      state.kyrVisible = state.hotlinesVisible = state.faqVisible = state.liveTipsVisible = state.reportFormVisible = false;
      renderPanels();
      document.getElementById("form-report").hidden = true;
    }
  });
}

function init() {
  Promise.all([
    fetch("/data/ero-offices.json").then(function (r) { return r.json(); }),
    fetch("/data/state-coords.json").then(function (r) { return r.json(); }),
    fetch("/data/hotlines.json").then(function (r) { return r.json(); }),
  ]).then(function (results) {
    offices = results[0];
    stateCoords = results[1];
    hotlinesData = results[2];
    state.communityReports = getReports();
    if (window.MapController) {
      window.MapController.init("map", {
        offices: offices,
        stateCoords: stateCoords,
        onSelectNews: function (id) { state.selectedId = id; render(); },
        onSelectReport: function (id) { state.selectedId = id; render(); },
      });
      window.MapController.updateCommunityReports(state.communityReports);
    }
    document.getElementById("report-state").addEventListener("input", function (e) {
      e.target.value = e.target.value.toUpperCase().slice(0, 2);
    });
    bind();
    fetchNews();
    refreshTimer = setInterval(fetchNews, state.refreshMs);
    setupSSE();
    const clearBtn = document.getElementById("btn-clear-reports");
    if (clearBtn && state.communityReports.length > 0) {
      clearBtn.textContent = "Clear reports (" + state.communityReports.length + ")";
      clearBtn.hidden = false;
    }
    renderPanels();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(function () {});
    }
  }).catch(function (err) {
    console.error("Init error", err);
    document.getElementById("feed-loading").textContent = "Failed to load data.";
  });
}

init();
