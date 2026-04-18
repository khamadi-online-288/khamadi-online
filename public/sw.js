const CACHE_NAME = 'khamadi-english-v2'

const STATIC_ASSETS = [
  '/manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  // API calls — always network, never cache
  if (
    url.hostname.includes('supabase') ||
    url.hostname.includes('anthropic') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/ent/api/')
  ) {
    return
  }

  // HTML pages — network first, no caching
  if (event.request.destination === 'document') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/english')))
    return
  }

  // Static assets (js, css, images) — cache first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached
      return fetch(event.request).then((response) => {
        if (response.ok && response.type === 'basic') {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        }
        return response
      })
    })
  )
})
