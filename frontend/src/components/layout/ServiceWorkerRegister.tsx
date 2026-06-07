'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      // Register the service worker
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('[SW] Registered successfully:', reg.scope);

          // Check for updates
          reg.addEventListener('updatefound', () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('[SW] New version available — refresh to update');
                  } else {
                    console.log('[SW] Content cached for offline use');
                  }
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('[SW] Registration failed:', err);
        });

      // Reload page when a new service worker takes over
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  return null;
}
