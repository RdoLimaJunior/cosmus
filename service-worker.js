const CACHE_NAME = 'cosmus-cache-v1';
// These are the essential files for the app shell.
// Other files will be cached on-the-fly upon first request.
const URLS_TO_CACHE = [
  '/',
  '/index.html'
];

let reminderTimeoutId = null;
let reminderData = null; 

function showReminder() {
  if (reminderData) {
    const { title, body } = reminderData;
    self.registration.showNotification(title, {
      body,
      icon: '/icon.svg',
      tag: 'cosmus-study-reminder'
    });
    // Re-schedule for the next occurrence
    scheduleNextNotification(reminderData);
  }
}

function scheduleNextNotification(data) {
  if (reminderTimeoutId) {
    clearTimeout(reminderTimeoutId);
  }

  const [hour, minute] = data.time.split(':').map(Number);
  const now = new Date();
  
  let nextNotificationTime = new Date();
  nextNotificationTime.setHours(hour, minute, 0, 0);

  // Determine the next valid time slot
  while (nextNotificationTime <= now) {
    if (data.frequency === 'daily') {
      nextNotificationTime.setDate(nextNotificationTime.getDate() + 1);
    } else { // weekly
      nextNotificationTime.setDate(nextNotificationTime.getDate() + 7);
    }
  }

  const delay = nextNotificationTime.getTime() - now.getTime();

  if (delay > 0) {
    reminderTimeoutId = setTimeout(showReminder, delay);
  }
}

self.addEventListener('message', (event) => {
  if (event.data.type === 'schedule-reminder') {
    reminderData = event.data.payload;
    scheduleNextNotification(reminderData);
  } else if (event.data.type === 'cancel-reminder') {
    if (reminderTimeoutId) {
      clearTimeout(reminderTimeoutId);
      reminderTimeoutId = null;
    }
    reminderData = null;
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});


// Install the service worker and cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Intercept network requests and serve from cache if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Clean up old caches on activation
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});