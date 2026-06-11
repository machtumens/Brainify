// Second Brain service worker (v1.1 Phase 4)
// Strategy: network-first for pages/API, cache-first for static assets.
// Keeps /review usable on flaky mobile connections.

const CACHE = 'sb-v1';
const STATIC_PATTERNS = [/\/_next\/static\//, /\/icon\.svg$/, /fonts\.(googleapis|gstatic)\.com/];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const isStatic = STATIC_PATTERNS.some((p) => p.test(request.url));

  if (isStatic) {
    // cache-first
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
            return res;
          })
      )
    );
    return;
  }

  // network-first with cache fallback (offline reads of last-seen pages)
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok && request.url.startsWith(self.location.origin)) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
        }
        return res;
      })
      .catch(() => caches.match(request))
  );
});
