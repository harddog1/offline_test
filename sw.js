// 서비스워커 sw.js

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "offline_test";
const offlineFiles = [
    "https://harddog1.github.io/offline_test/index.html",
    "https://harddog1.github.io/offline_test/a.html",
    "https://harddog1.github.io/offline_test/b.html",
    "https://harddog1.github.io/offline_test/index.css",
    "https://harddog1.github.io/offline_test/index.js",

];

// 서비스워커 즉시 활성화용
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// 설치 시 캐시
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(offlineFiles);
    })
  );
});

// 서비스워커 즉시 활성화 (기존 것 교체)
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// fetch 이벤트 모든 요청 처리
self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    try {
      // 네트워크 우선 시도
      const networkResp = await fetch(event.request);
      return networkResp;
    } catch (error) {
      // 실패 시 캐시된 파일 제공
      const cache = await caches.open(CACHE);
      const cachedResp = await cache.match(event.request);
      if (cachedResp) {
        return cachedResp;
      }

      // 그래도 없으면 index.html fallback 제공 (안전장치)
      return cache.match("/hello/index.html");
    }
  })());
});
