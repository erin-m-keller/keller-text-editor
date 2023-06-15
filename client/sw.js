// initialize variables
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'; 
import { precacheAndRoute } from 'workbox-precaching'; 
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration'; 

// precache and route the assets
precacheAndRoute(self.__WB_MANIFEST);

// cache the HTML pages
const pageCache = new CacheFirst({
  cacheName: 'jate-page-cache', // specify the name of the cache
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200], // cache responses with status codes 0 and 200
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // set the maximum age of cached responses to 30 days
    }),
  ],
});

// warm the cache with specific URLs
registerRoute(
  ({ request }) => request.mode === 'navigate', // match requests with navigation mode (e.g., HTML pages)
  pageCache // use the pageCache strategy to handle matched requests
);

// register the route for scripts, styles, and fonts
registerRoute(
  ({ request }) =>
    request.destination === 'script' || // match requests with destination 'script'
    request.destination === 'style' || // match requests with destination 'style'
    request.destination === 'font', // match requests with destination 'font'
  pageCache // use the pageCache strategy to handle matched requests
);

// set up asset cache
registerRoute(
  ({ request }) =>
    ['style', 'script', 'worker'].includes(request.destination), // match requests with destination 'style', 'script', or 'worker'
  new StaleWhileRevalidate({
    cacheName: 'jate-asset-cache', // specify the name of the cache for assets
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // cache responses with status codes 0 and 200
      }),
    ],
  })
);