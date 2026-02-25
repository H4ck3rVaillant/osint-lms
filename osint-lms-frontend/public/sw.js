// Service Worker pour PWA CyberOSINT Academy
// Version du cache - incrémenter pour forcer la mise à jour
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `cyberosint-${CACHE_VERSION}`;

// Fichiers essentiels à mettre en cache
const ESSENTIAL_FILES = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/logo.png',
  '/site.webmanifest',
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation en cours...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache ouvert, ajout des fichiers essentiels');
        return cache.addAll(ESSENTIAL_FILES);
      })
      .then(() => {
        console.log('[SW] Installation réussie !');
        return self.skipWaiting(); // Active immédiatement
      })
      .catch((error) => {
        console.error('[SW] Erreur installation:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation en cours...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        // Supprime les anciens caches
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('cyberosint-') && name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Suppression ancien cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation réussie !');
        return self.clients.claim(); // Prend le contrôle immédiatement
      })
  );
});

// Interception des requêtes (stratégie Cache First avec Network Fallback)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore les requêtes non-GET et les requêtes externes (API, CDN)
  if (request.method !== 'GET' || 
      url.origin !== location.origin ||
      url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW] Fichier servi depuis le cache:', url.pathname);
          return cachedResponse;
        }

        // Si pas en cache, fetch depuis le réseau
        return fetch(request)
          .then((networkResponse) => {
            // Met en cache les réponses valides
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  // Cache les assets (JS, CSS, images)
                  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff2?)$/)) {
                    cache.put(request, responseClone);
                  }
                });
            }
            
            return networkResponse;
          })
          .catch((error) => {
            console.error('[SW] Erreur fetch:', error);
            
            // Page hors-ligne de secours
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // Pour les autres ressources, retourne une erreur
            return new Response('Hors ligne', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Messages du Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

console.log('[SW] Service Worker chargé - Version:', CACHE_VERSION);
