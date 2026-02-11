// statics/sw.js
// NeuroBridge Technologies Ltd – Futuristic Quantum Portfolio Service Worker
// Version: 2026.1 – Simple Cache-First + Network Fallback for static assets
// Author: Joseph Ochelebe | Founder & CTO

const CACHE_NAME = 'neurobridge-quantum-portfolio-v1';
const STATIC_ASSETS = [
  '/',                          // root (redirects to index.html)
  '/templates/index.html',
  '/templates/projects-dashboard.html',
  '/statics/styles.css',
  '/statics/app.js',
  '/statics/manifest.json',
  // Icons – add your actual paths once created
  '/statics/icons/icon-192.png',
  '/statics/icons/icon-512.png',
  // Optional: any local images/screenshots used in manifest
  // '/statics/screenshots/screenshot1.png',
  // '/statics/screenshots/screenshot2.png',

  // CDN resources (cache them for offline resilience)
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&display=swap',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
  // Add more CDNs if you expand (e.g., particles.js if added later)
];

// Install event: Cache all core static assets on first install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching core assets');
      return cache.addAll(STATIC_ASSETS);
    }).catch((err) => {
      console.error('[Service Worker] Pre-caching failed:', err);
    })
  );
  // Skip waiting so new SW takes control immediately
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Take control of all open clients immediately
  self.clients.claim();
});

// Fetch event: Cache-First strategy for cached assets, Network-First fallback
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests and browser chrome (e.g., extension requests)
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Handle navigation requests (HTML pages) with network-first + fallback to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/templates/index.html'); // Fallback to landing page offline
      })
    );
    return;
  }

  // For all other requests: Cache-First (static assets), then Network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Clone the request because fetch consumes it
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((networkResponse) => {
        // Check if valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Clone response to cache it
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Offline fallback – could serve a custom offline page if desired
        console.log('[Service Worker] Fetch failed; offline mode');
      });
    })
  );
});

// Optional: Listen for push notifications or background sync if you expand later
// self.addEventListener('push', ...);
// self.addEventListener('sync', ...);
