import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute, Route } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

const CACHE_NAMES = {
  static: 'static-cache-v1',
  pages: 'pages-cache-v1',
  images: 'images-cache-v1',
  maps: 'maps-cache-v1'
};

precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

const navigationHandler = async ({ request }) => {
  const cache = await caches.open(CACHE_NAMES.pages);

  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
      return response;
    }
  } catch (error) {
    console.log('Offline mode, checking cache...');
  }

  try {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const indexResponse = await cache.match('/index.html');
    if (indexResponse) {
      return indexResponse;
    }
  } catch (error) {
    console.log('Cache retrieval failed:', error);
  }

  return new Response(
    `<!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>UrbanAID - Offline</title>
        <style>
            body {
                font-family: system-ui, -apple-system, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                padding: 20px;
                text-align: center;
                background-color: #f9fafb;
            }
            .container {
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                max-width: 400px;
            }
            h1 { color: #00899B; margin-bottom: 1rem; }
            p { color: #4b5563; line-height: 1.5; }
            button {
                background: #00899B;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                cursor: pointer;
                margin-top: 1rem;
            }
            button:hover { background: #007a8c; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>UrbanAID</h1>
            <p>Sepertinya Anda sedang offline. Mohon periksa koneksi internet Anda.</p>
            <button onclick="window.location.reload()">Coba Lagi</button>
        </div>
    </body>
    </html>`,
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    }
  );
};

registerRoute(
  new NavigationRoute(navigationHandler)
);

registerRoute(
  ({ request }) =>
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.url.includes('.js') ||
    request.url.includes('.css'),
  new StaleWhileRevalidate({
    cacheName: CACHE_NAMES.static,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
);

// Cache map tiles
registerRoute(
  ({ url }) => url.hostname.includes('tile.openstreetmap.org'),
  new CacheFirst({
    cacheName: 'map-tiles',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        purgeOnQuotaError: true
      }),
    ],
  })
);

// Cache Leaflet assets
registerRoute(
  ({ url }) => url.href.includes('leaflet'),
  new CacheFirst({
    cacheName: 'leaflet-assets',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache geocoding requests
registerRoute(
  ({ url }) => url.hostname.includes('nominatim.openstreetmap.org'),
  new NetworkFirst({
    cacheName: 'geocoding-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60  // 1 day
      })
    ]
  })
);

// Cache images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: CACHE_NAMES.images,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        purgeOnQuotaError: true
      })
    ]
  })
);

// Cache API requests
registerRoute(
  ({ url }) => url.origin === 'https://urbanaid-server.up.railway.app',
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 72 * 60 * 60 // 72 hours
      })
    ]
  })
);

// Install event
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    Promise.all([
      self.skipWaiting(),
      caches.open(CACHE_NAMES.pages).then((cache) => {
        return cache.add('/index.html')
          .catch((error) => {
            console.error('Failed to cache index.html:', error);
          });
      })
    ])
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => !Object.values(CACHE_NAMES).includes(cacheName))
            .map((cacheName) => {
              console.log('[ServiceWorker] Removing old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
    ])
  );
});