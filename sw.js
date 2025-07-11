var cacheName = "offline_test"
var appShellFiles = [
    "https://harddog1.github.io/offline_test/index.html",
    "https://harddog1.github.io/offline_test/a.html",
    "https://harddog1.github.io/offline_test/b.html",
    "https://harddog1.github.io/offline_test/index.css",
    "https://harddog1.github.io/offline_test/index.js",
];

var contentToCache = appShellFiles;

self.addEventListener("install", function (e) {
  console.log("[Service Worker] Install");
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log("[Service Worker] Caching all: app shell and content");
      return cache.addAll(contentToCache);
    }),
  );
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (r) {
      console.log("[Service Worker] Fetching resource: " + e.request.url);
      return (
        r ||
        fetch(e.request).then(function (response) {
          return caches.open(cacheName).then(function (cache) {
            console.log(
              "[Service Worker] Caching new resource: " + e.request.url,
            );
            cache.put(e.request, response.clone());
            return response;
          });
        })
      );
    }),
  );
});
