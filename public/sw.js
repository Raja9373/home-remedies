/* HomeRemediesWorld.com Auto-Updating Service Worker */
const CACHE_VERSION = 'hrw-v20261126';
const CORE_CACHE = 'hrw-core-' + CACHE_VERSION;

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CORE_CACHE).then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/favicon.svg',
        '/favicon-32x32.png',
        '/site-core.js'
      ]).catch(function () {});
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return key.indexOf('hrw-') === 0 && key !== CORE_CACHE;
        }).map(function (oldKey) {
          return caches.delete(oldKey);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;

  var url;
  try {
    url = new URL(req.url);
  } catch (e) {
    return;
  }

  // Never intercept third-party requests (AdSense, IP geo, translation API, fonts)
  if (url.origin !== self.location.origin) return;

  // Always bypass cache for version manifest
  if (url.pathname === '/version.json' || url.pathname === '/sw.js') {
    event.respondWith(fetch(req, { cache: 'no-store' }));
    return;
  }

  // Network-First for HTML & JS so site updates are always seen immediately
  if (
    req.mode === 'navigate' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname === '/'
  ) {
    event.respondWith(
      fetch(req)
        .then(function (networkRes) {
          if (networkRes && networkRes.status === 200) {
            var copy = networkRes.clone();
            caches.open(CORE_CACHE).then(function (cache) {
              cache.put(req, copy).catch(function () {});
            });
          }
          return networkRes;
        })
        .catch(function () {
          return caches.match(req);
        })
    );
    return;
  }

  // Stale-While-Revalidate for images, icons, CSS
  event.respondWith(
    caches.match(req).then(function (cached) {
      var networkFetch = fetch(req).then(function (networkRes) {
        if (networkRes && networkRes.status === 200) {
          var copy = networkRes.clone();
          caches.open(CORE_CACHE).then(function (cache) {
            cache.put(req, copy).catch(function () {});
          });
        }
        return networkRes;
      }).catch(function () {
        return cached;
      });
      return cached || networkFetch;
    })
  );
});
