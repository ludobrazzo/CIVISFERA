const CACHE = 'civisfera-v1';
const ASSETS = [
  './','./index.html','./guide.html','./percorso.html','./generatori.html','./dashboard.html','./scadenze.html','./documenti.html','./studio.html','./lavoro.html','./salute.html','./servizi.html','./emergenze.html','./profilo.html',
  './assets/css/styles.css','./assets/js/data.js','./assets/js/app.js','./assets/js/chatbot.js','./assets/js/pages.js'
];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))); });
self.addEventListener('fetch', event => { event.respondWith(caches.match(event.request).then(res => res || fetch(event.request))); });
