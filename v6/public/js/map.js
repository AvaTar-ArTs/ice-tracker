/**
 * v6 map: Leaflet + MarkerCluster. Exposes window.MapController.
 */
(function () {
  const TILE = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const CENTER = [39.5, -98.35];
  const ZOOM = 4;

  let map = null;
  let markers = { ero: [], news: [], community: [] };
  let clusterNews = null;
  let clusterCommunity = null;
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
      html: "<span style=\"width:12px;height:12px;border-radius:50%;background:#38bdf8;border:2px solid #0f172a;display:block;box-sizing:border-box;\"></span>",
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });

    offices.forEach(function (o) {
      const m = L.marker([o.lat, o.lng], { icon: eroIcon })
        .bindPopup(
          "<div class=\"min-w-[180px]\">" +
          "<div class=\"font-semibold\">" + escapeHtml(o.name) + "</div>" +
          "<div class=\"text-xs\" style=\"color:var(--frost-muted)\">" + escapeHtml(o.city) + ", " + escapeHtml(o.state) + "</div>" +
          "<div class=\"text-xs\" style=\"color:var(--frost-muted)\">" + escapeHtml(o.area) + "</div></div>"
        )
        .addTo(map);
      markers.ero.push(m);
    });

    clusterNews = L.markerClusterGroup({ maxClusterRadius: 45 });
    clusterCommunity = L.markerClusterGroup({ maxClusterRadius: 50 });
    map.addLayer(clusterNews);
    map.addLayer(clusterCommunity);

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
    if (clusterNews) clusterNews.clearLayers();
    if (!map || !stateCoords) return;
    newsItems.forEach(function (n) {
      if (!n.state || !stateCoords[n.state]) return;
      const lat = stateCoords[n.state][0];
      const lng = stateCoords[n.state][1];
      const r = selectedState && n.state === selectedState ? 8 : 5;
      const m = L.circleMarker([lat, lng], {
        radius: r,
        fillColor: "#f87171",
        color: "#7f1d1d",
        weight: 1,
        fillOpacity: 0.8,
      });
      m.bindPopup(
        "<div class=\"min-w-[220px] max-w-[280px]\">" +
        "<a href=\"" + escapeHtml(n.link) + "\" target=\"_blank\" rel=\"noopener\" style=\"font-weight:500;color:var(--frost-accent)\">" + escapeHtml(n.title) + "</a>" +
        "<div class=\"text-xs\" style=\"color:var(--frost-muted);margin-top:0.25rem\">" + [n.city, n.state].filter(Boolean).join(", ") + " · " + formatDate(n.pubDate) + "</div>" +
        "<p class=\"text-xs\" style=\"color:var(--frost-muted);margin-top:0.25rem;line-clamp:3\">" + escapeHtml((n.description || "").slice(0, 200)) + "</p></div>"
      );
      m.on("click", function () { if (window._mapOnSelectNews) window._mapOnSelectNews(n.id); });
      clusterNews.addLayer(m);
    });
  }

  function updateCommunityReports(reports) {
    if (clusterCommunity) clusterCommunity.clearLayers();
    if (!map || !stateCoords) return;
    reports.forEach(function (r) {
      if (!stateCoords[r.state]) return;
      const lat = stateCoords[r.state][0];
      const lng = stateCoords[r.state][1];
      const m = L.circleMarker([lat, lng], {
        radius: 6,
        fillColor: "#fbbf24",
        color: "#b45309",
        weight: 1,
        fillOpacity: 0.9,
      });
      m.bindPopup(
        "<div class=\"min-w-[200px]\">" +
        "<div class=\"text-[10px] uppercase\" style=\"color:#fbbf24\">Community report (unverified)</div>" +
        "<div class=\"font-medium mt-1\">" + escapeHtml(r.city) + ", " + escapeHtml(r.state) + "</div>" +
        (r.description ? "<p class=\"text-xs mt-1\">" + escapeHtml(r.description.slice(0, 150)) + "</p>" : "") +
        "<div class=\"text-xs\" style=\"color:var(--frost-muted);margin-top:0.25rem\">" + formatDate(r.createdAt) + "</div></div>"
      );
      m.on("click", function () { if (window._mapOnSelectReport) window._mapOnSelectReport(r.id); });
      clusterCommunity.addLayer(m);
    });
  }

  window.MapController = {
    init: init,
    updateNews: updateNews,
    updateCommunityReports: updateCommunityReports,
  };
})();
