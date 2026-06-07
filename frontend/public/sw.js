const CACHE_NAME = 'momentum-ai-v1';
const STATIC_ASSETS = [
  '/',
  '/workspace/dashboard',
  '/workspace/projects',
  '/offline',
  '/manifest.json',
];

const ASSET_CACHE = 'momentum-assets-v1';
const API_CACHE = 'momentum-api-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(ASSET_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name.startsWith('momentum-') && name !== CACHE_NAME && name !== ASSET_CACHE && name !== API_CACHE;
          })
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - network first, cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome extensions
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // API calls - network only
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(API_CACHE).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || new Response(JSON.stringify({ offline: true }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' },
            });
          });
        })
    );
    return;
  }

  // Static assets - cache first
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    request.destination === 'image' ||
    url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(ASSET_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Navigation requests - network first, fallback to cache, then offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match('/offline');
        })
    );
    return;
  }

  // Default - network only
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tasks') {
    event.waitUntil(syncTasks());
  }
  if (event.tag === 'sync-comments') {
    event.waitUntil(syncComments());
  }
});

async function syncTasks() {
  const db = await openDB();
  const pendingTasks = await db.getAll('pending-tasks');
  for (const task of pendingTasks) {
    try {
      await fetch('/api/v1/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      await db.delete('pending-tasks', task.id);
    } catch (e) {
      console.error('Failed to sync task:', e);
    }
  }
}

async function syncComments() {
  const db = await openDB();
  const pendingComments = await db.getAll('pending-comments');
  for (const comment of pendingComments) {
    try {
      await fetch(`/api/v1/tasks/${comment.taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment.content }),
      });
      await db.delete('pending-comments', comment.id);
    } catch (e) {
      console.error('Failed to sync comment:', e);
    }
  }
}

// IndexedDB helper for offline storage
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MomentumAI', 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-tasks')) {
        db.createObjectStore('pending-tasks', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('pending-comments')) {
        db.createObjectStore('pending-comments', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Push notification handler
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {
    title: 'Momentum AI',
    body: 'Something happened in your workspace',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
  };

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/workspace/dashboard',
    },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        const url = event.notification.data?.url || '/workspace/dashboard';
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});
