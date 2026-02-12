/* Shared navigation renderer for all pages */

/* Detect base path: works on any hosting root */
const SCRIPT_URL = import.meta.url;
const JS_DIR = SCRIPT_URL.substring(0, SCRIPT_URL.lastIndexOf("/"));   // …/js
const BASE = JS_DIR.substring(0, JS_DIR.lastIndexOf("/") + 1);         // …/

const NAV_ITEMS = [
  { label: "Dashboard", href: BASE + "index.html", id: "dashboard" },
  { label: "News", href: BASE + "pages/news.html", id: "news" },
  { label: "Map", href: BASE + "pages/map.html", id: "map" },
  { label: "AI Insights", href: BASE + "pages/analytics.html", id: "analytics" },
  { label: "Reports", href: BASE + "pages/reports.html", id: "reports" },
  { label: "Rights", href: BASE + "pages/rights.html", id: "rights" },
];

/**
 * Render the top navigation bar.
 * @param {string} activeId - The id of the current page.
 * @param {string[]} breadcrumb - Breadcrumb trail, e.g. ["Dashboard", "News Feed"]
 */
export function renderNav(activeId, breadcrumb = []) {
  const nav = document.getElementById("top-nav");
  if (!nav) return;

  const links = NAV_ITEMS.map(
    (item) =>
      `<a href="${item.href}" class="${item.id === activeId ? "active" : ""}">${item.label}</a>`
  ).join("");

  nav.innerHTML = `
    <a href="${BASE}index.html" class="brand"><span>ICE</span> Activity Tracker <small style="font-size:.65rem;color:var(--text-muted);margin-left:.35rem">v10</small></a>
    <div class="nav-links">${links}</div>
  `;

  // Breadcrumb
  const bc = document.getElementById("breadcrumb");
  if (bc && breadcrumb.length > 0) {
    const parts = breadcrumb.map((item, i) => {
      if (i === breadcrumb.length - 1) return `<span>${item}</span>`;
      const link = NAV_ITEMS.find((n) => n.label === item);
      return `<a href="${link ? link.href : "#"}">${item}</a>`;
    });
    bc.innerHTML = parts.join('<span class="sep">/</span>');
  }
}
