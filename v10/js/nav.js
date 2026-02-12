/* Shared navigation renderer for all pages */

const NAV_ITEMS = [
  { label: "Dashboard", href: "/v10/index.html", id: "dashboard" },
  { label: "News", href: "/v10/pages/news.html", id: "news" },
  { label: "Map", href: "/v10/pages/map.html", id: "map" },
  { label: "AI Insights", href: "/v10/pages/analytics.html", id: "analytics" },
  { label: "Reports", href: "/v10/pages/reports.html", id: "reports" },
  { label: "Rights", href: "/v10/pages/rights.html", id: "rights" },
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
    <a href="/v10/index.html" class="brand"><span>ICE</span> Activity Tracker <small style="font-size:.65rem;color:var(--text-muted);margin-left:.35rem">v10</small></a>
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
