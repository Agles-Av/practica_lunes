// ===== A) CONFIGURACIÓN
const CACHE_NAME = 'cocktail-pwa-v2';

// App Shell (debe abrir offline sí o sí)
const APP_SHELL = [
  './',
  './index.html',
  './main.js',
  './manifest.json',
  './images/icons/tareas1.png',
  './images/icons/tareas2.png',
  'https://cdn.jsdelivr.net/npm/pouchdb@9.0.0/dist/pouchdb.min.js'
];


// ===== B) INSTALL: Precache del App Shell
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando y precacheando App Shell…');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()) // activa versión nueva sin esperar
  );
});

// ===== C) ACTIVATE: Limpieza de caches viejos (higiene)
self.addEventListener('activate', (event) => {
  console.log('[SW] Activado. Limpiando versiones antiguas…');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ===== D) FETCH: Estrategia ONLY CACHE =====
self.addEventListener('fetch', (event) => {
  // Solo responder si la petición es GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('[SW] Sirviendo desde caché:', event.request.url);
          return response;
        } else {
          console.warn('[SW] Recurso no encontrado en caché:', event.request.url);
          // Aquí podrías devolver una página offline personalizada si querés
          return caches.match('./index.html');
        }
      })
  );
});

