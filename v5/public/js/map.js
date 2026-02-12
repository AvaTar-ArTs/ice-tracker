/**
 * v5 map: Leaflet (global L). Exposes window.MapController.
 */
(function () {
  const TILE = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const CENTER = [39.5, -98.35];
  const ZOOM = 4;

  let map = null;
  let markers = { ero: [], news: [], community: [] };
  let offices = [];
  let stateCoords = {};

  function formatDate(s) {
    try {
      const d = new Date(s);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      if (diff < 86400000) return "Today";
      if (diff < 172800000) return "Yesterday";
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
    } catch { return ""; }
  }

  function clearLayer(arr) {
    arr.forEach(function (m) { if (m && m.remove) m.remove(); });
    arr.length = 0;
  }

  function init(containerId, options) {
    if (map) return;
    offices = options.offices || [];
    stateCoords = options.stateCoords || {};
    map = L.map(containerId, { zoomControl: false }).setView(CENTER, ZOOM);
    L.tileLayer(TILE, { attribution: "&copy; CARTO" }).addTo(map);
    L.control.zoom({ position: "topright" }).addTo(map);

    const eroIcon = L.divIcon({
      className: "ero-marker",
      html: '<span style="width:12px;height:12px;border-radius:50%;background:#3b82f6;border:2px solid #1e3a5f;display:block;box-sizing:border-box;"></span>',
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });

    offices.forEach(function (o) {
      const m = L.marker([o.lat, o.lng], { icon: eroIcon })
        .bindPopup(
          "<div class=\"min-w-[180px]\">" +
          "<div class=\"font-semibold\">" + escapeHtml(o.name) + "</div>" +
          "<div class=\"text-xs text-[#9ca3af] mt-1\">" + escapeHtml(o.city) + ", " + escapeHtml(o.state) + "</div>" +
          "<div class=\"text-xs text-[#6b7280] mt-0.5\">" + escapeHtml(o.area) + "</div></div>"
        )
        .addTo(map);
      markers.ero.push(m);
    });

    if (options.onSelectNews) window._mapOnSelectNews = options.onSelectNews;
    if (options.onSelectReport) window._mapOnSelectReport = options.onSelectReport;
  }

  function escapeHtml(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function updateNews(newsItems, selectedState) {
    clearLayer(markers.news);
    if (!map || !stateCoords) return;
    newsItems.forEach(function (n) {
      if (!n.state || !stateCoords[n.state]) return;
      const lat = stateCoords[n.state][0];
      const lng = stateCoords[n.state][1];
      const r = selectedState && n.state === selectedState ? 8 : 5;
      const m = L.circleMarker([lat, lng], {
        radius: r,
        fillColor: "#ef4444",
        color: "#7f1d1d",
        weight: 1,
        fillOpacity: 0.8,
      }).addTo(map);
      m.bindPopup(
        "<div class=\"min-w-[220px] max-w-[280px]\">" +
        "<a href=\"" + escapeHtml(n.link) + "\" target=\"_blank\" rel=\"noopener\" class=\"font-medium text-[#93c5fd]\">" + escapeHtml(n.title) + "</a>" +
        "<div class=\"text-xs text-[#9ca3af] mt-1\">" + [n.city, n.state].filter(Boolean).join(", ") + " · " + formatDate(n.pubDate) + "</div>" +
        "<p class=\"text-xs text-[#9ca3af] mt-1 line-clamp-3\">" + escapeHtml((n.description || "").slice(0, 200)) + "</p></div>"
      );
      m.on("click", function () { if (window._mapOnSelectNews) window._mapOnSelectNews(n.id); });
      markers.news.push(m);
    });
  }

  function updateCommunityReports(reports) {
    clearLayer(markers.community);
    if (!map || !stateCoords) return;
    reports.forEach(function (r) {
      if (!stateCoords[r.state]) return;
      const lat = stateCoords[r.state][0];
      const lng = stateCoords[r.state][1];
      const m = L.circleMarker([lat, lng], {
        radius: 6,
        fillColor: "#f59e0b",
        color: "#b45309",
        weight: 1,
        fillOpacity: 0.9,
      }).addTo(map);
      m.bindPopup(
        "<div class=\"min-w-[200px]\">" +
        "<div class=\"text-[10px] uppercase text-[#f59e0b]\">Community report (unverified)</div>" +
        "<div class=\"font-medium mt-1\">" + escapeHtml(r.city) + ", " + escapeHtml(r.state) + "</div>" +
        (r.description ? "<p class=\"text-xs mt-1\">" + escapeHtml(r.description.slice(0, 150)) + "</p>" : "") +
        "<div class=\"text-xs text-[#6b7280] mt-1\">" + formatDate(r.createdAt) + "</div></div>"
      );
      m.on("click", function () { if (window._mapOnSelectReport) window._mapOnSelectReport(r.id); });
      markers.community.push(m);
    });
  }

  window.MapController = {
    init: init,
    updateNews: updateNews,
    updateCommunityReports: updateCommunityReports,
  };
})();
