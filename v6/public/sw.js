/**
 * v6 Service Worker — cache static assets and optional API response for offline.
 */
const CACHE_NAME = "ice-tracker-v6-1";
const STATIC_URLS = [
  "/",
  "/index.html",
  "/styles.css",
  "/js/app.js",
  "/js/map.js",
  "/manifest.json",
  "/data/ero-offices.json",
  "/data/state-coords.json",
  "/data/hotlines.json",
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(STATIC_URLS).catch(function () {});
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === "/api/ice-news") {
    e.respondWith(
      fetch(e.request)
        .then(function (res) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(e.request, clone); });
          return res;
        })
        .catch(function () {
          return caches.match(e.request).then(function (cached) {
            return cached || new Response(JSON.stringify({ items: [], updated: new Date().toISOString(), error: "Offline" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          });
        })
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      return cached || fetch(e.request).then(function (res) {
        if (res.ok && (res.type === "basic" || res.type === "cors")) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(e.request, clone); });
        }
        return res;
      });
    })
  );
});
