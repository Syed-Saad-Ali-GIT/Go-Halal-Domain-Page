/* eslint-disable no-restricted-globals */

// Cache names
const CACHE_NAME = 'go-halal-cache-v1';
const API_CACHE_NAME = 'go-halal-api-cache-v1';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/bundle.js',
  '/static/media/logo-minimal.png',
  '/manifest.json',
  '/pdf.worker.min.mjs',
  '/scan-beep.mp3',
  '/offline.html'
];

// Install event - precache critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME, API_CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper function to determine if a request is for an API
const isApiRequest = url => {
  return url.includes('/api/') || url.includes('192.168.6.135:3000');
};

// Helper function to determine if a request is for an image
const isImageRequest = url => {
  return url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i);
};

// Helper function to determine if a request is for a static asset
const isStaticAssetRequest = url => {
  return url.match(/\.(js|css|woff|woff2|ttf|eot)$/i);
};

// Fetch event - handle requests with appropriate strategies
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Don't cache Sentry or analytics requests
  if (url.hostname.includes('sentry.io') || url.hostname.includes('analytics')) {
    return;
  }
  
  // API requests - Network first with cache fallback and separate cache storage
  if (isApiRequest(url.href)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response before consuming it
          const responseToCache = response.clone();
          
          // Only cache successful responses
          if (response.status === 200) {
            caches.open(API_CACHE_NAME)
              .then(cache => {
                // Only cache GET requests
                if (event.request.method === 'GET') {
                  cache.put(event.request, responseToCache);
                }
              });
          }
          
          return response;
        })
        .catch(() => {
          // If network fails, try to return from cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Images - Cache first with network fallback and update cache
  if (isImageRequest(url.href)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // Return cached version immediately if available
          if (cachedResponse) {
            // Update cache in the background (stale-while-revalidate)
            fetch(event.request)
              .then(response => {
                if (response.status === 200) {
                  caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, response));
                }
              })
              .catch(() => {});
              
            return cachedResponse;
          }
          
          // If not in cache, get from network and cache
          return fetch(event.request)
            .then(response => {
              // Clone the response before consuming it
              const responseToCache = response.clone();
              
              if (response.status === 200) {
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, responseToCache));
              }
              
              return response;
            })
            .catch(() => {
              // If both cache and network fail, return a fallback image
              return caches.match('/static/media/logo-minimal.png');
            });
        })
    );
    return;
  }
  
  // Static assets - Cache first with network fallback
  if (isStaticAssetRequest(url.href)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then(response => {
              // Clone the response before consuming it
              const responseToCache = response.clone();
              
              if (response.status === 200) {
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, responseToCache));
              }
              
              return response;
            });
        })
    );
    return;
  }
  
  // HTML and other navigation requests - Network first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response before consuming it
        const responseToCache = response.clone();
        
        // Only cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then(cachedResponse => {
            // Return cached version if available
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // If it's a navigation request, return the offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            // Otherwise, just return a 404
            return new Response('Not found', { status: 404 });
          });
      })
  );
});

// Background sync for failed submissions
self.addEventListener('sync', event => {
  if (event.tag === 'submit-product') {
    event.waitUntil(
      // Get all queued submissions from IndexedDB and try to resubmit them
      self.indexedDB.open('goHalalOfflineDB')
        .then(db => {
          const tx = db.transaction('pendingSubmissions', 'readwrite');
          const store = tx.objectStore('pendingSubmissions');
          
          return store.getAll().then(submissions => {
            return Promise.all(
              submissions.map(submission => {
                return fetch(submission.url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(submission.data)
                })
                .then(response => {
                  if (response.ok) {
                    // If successful, remove from queue
                    return store.delete(submission.id);
                  }
                  throw new Error('Sync failed');
                });
              })
            );
          });
        })
    );
  }
});

// Push notifications
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/static/media/logo-minimal.png',
    badge: '/static/media/logo-minimal.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
}); 