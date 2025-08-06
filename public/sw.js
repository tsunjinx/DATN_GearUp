// Service Worker for GearUp Performance Optimization
const CACHE_NAME = 'gearup-v1'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Critical resources to cache immediately
const CRITICAL_ASSETS = [
  '/',
  '/src/main.js',
  '/src/assets/critical.css',
  '/src/assets/variables.css',
  '/vite.svg'
]

// Install event - cache critical assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching critical assets')
        return cache.addAll(CRITICAL_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if available
        if (cachedResponse) {
          // Check if cache is still fresh
          const cacheDate = new Date(cachedResponse.headers.get('sw-cache-date') || 0)
          const isExpired = Date.now() - cacheDate.getTime() > CACHE_DURATION
          
          if (!isExpired) {
            return cachedResponse
          }
        }

        // Fetch from network
        return fetch(event.request)
          .then(response => {
            // Only cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone()
              
              caches.open(CACHE_NAME)
                .then(cache => {
                  // Add cache date header
                  const headers = new Headers(responseClone.headers)
                  headers.set('sw-cache-date', new Date().toISOString())
                  
                  const responseWithDate = new Response(responseClone.body, {
                    status: responseClone.status,
                    statusText: responseClone.statusText,
                    headers: headers
                  })
                  
                  cache.put(event.request, responseWithDate)
                })
            }
            
            return response
          })
          .catch(() => {
            // Fallback to cache if network fails
            return cachedResponse || new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable'
            })
          })
      })
  )
})

// Message event - handle cache refresh requests
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CACHE_REFRESH') {
    caches.delete(CACHE_NAME)
      .then(() => {
        event.ports[0].postMessage({ success: true })
      })
  }
})
