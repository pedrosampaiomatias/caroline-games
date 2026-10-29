/* ==========================================================================
   Caroline Games — Offline-Ready Service Worker (sw.js)
   Caches the Hub and all 6 games so the app works offline on iPhone & Android
   ========================================================================== */

const CACHE_NAME = "caroline-games-v1";

const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./suite-bridge.js",
  "./manifest.json",
  "./icon.svg",
  "./Sudoku/index.html",
  "./Sudoku/styles.css",
  "./Sudoku/game.js",
  "./Zip/index.html",
  "./Zip/styles.css",
  "./Zip/game.js",
  "./Tango/index.html",
  "./Tango/styles.css",
  "./Tango/game.js",
  "./Queens/index.html",
  "./Queens/styles.css",
  "./Queens/game.js",
  "./Patches/index.html",
  "./Patches/styles.css",
  "./Patches/game.js",
  "./Wend/index.html",
  "./Wend/styles.css",
  "./Wend/game.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_NAME)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Network-first with cache fallback so updates arrive automatically when online
// while remaining 100% playable offline.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
