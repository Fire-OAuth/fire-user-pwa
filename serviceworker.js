importScripts("/assets/js/localforage.js")
importScripts("/assets/js/pure.js")

const CACHE = "content-v4" // name of the current cache
const OFFLINE = "/offline.html" // URL to offline HTML document
const AVATARS = "avatars"
const CDNS = "cdns"
const DEFAULT_AVATAR = "/assets/logo512.png"
const AUTO_CACHE = [
    OFFLINE,
    "/",
    "/logo512.png",
    "/transparent.png",
    "/favicon.ico",
    "/qr",
    "/login",
    "/register",
    "/privacy",
    "/authorize",
    "/apple-touch-icon.png",
	"/site.webmanifest",
    
    "/assets/js/localforage.js",
    "/assets/js/pure.js",
    "/assets/js/qrCodeScanner.js",
    "/assets/js/authorize.js",
    "/assets/js/home.js",
    "/assets/js/login.js",
    "/assets/js/sitepointqr.js",
    "/assets/js/endpoints.js",
    "/assets/js/nprogress.js",

    "/assets/css/authorize.css",
    "/assets/css/home.css",
    "/assets/css/login.css",
    "/assets/css/qr.css",

    "/assets/images/done.gif",
    "/assets/images/loading.gif",
    "/assets/images/registrationsuccess.gif",
    "/assets/images/qr.png",
    "/assets/images/bluewave.png",
    "/assets/images/history.svg",


]

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(CACHE)
			.then((cache) => cache.addAll(AUTO_CACHE))
			.then(self.skipWaiting())
	)
})

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return cacheNames.filter((cacheName) => CACHE !== cacheName && AVATARS !== cacheName)
			})
			.then((unusedCaches) => {
				console.log("DESTROYING CACHE", unusedCaches.join(","))
				return Promise.all(
					unusedCaches.map((unusedCache) => {
						return caches.delete(unusedCache)
					})
				)
			})
			.then(() => self.clients.claim())
	)
})

function isCached(url) {
	let origin = self.location.origin
	if (url.includes("assets")) return true
	if (url == `${origin}/`) return true
	if (url.includes("logo.png") || url.includes("favicon.ico") || url.includes("site.webmanifest")) return true
	return false
}

self.addEventListener("fetch", (event) => {

	if (event.request.url.includes("avatars.dicebear.com")) {
		event.respondWith(
			caches.open(AVATARS).then((cache) => {
				return cache.match(event.request).then((response) => {
					if (response) return response
					return fetch(event.request).then((response) => {
						cache.put(event.request, response.clone())
						return response
					}).catch(() => {
						return caches.match(DEFAULT_AVATAR)
					})
				})
			})
		)
		return
	}

    if (event.request.url.includes("cdnjs.cloudflare.com")) {
        event.respondWith(
            caches.open(CDNS).then((cache) => {
                return cache.match(event.request).then((response) => {
                    if (response) return response
                    return fetch(event.request).then((response) => {
                        cache.put(event.request, response.clone())
                        return response
                    })
                })
            })
        )
        return
    }

	if (
		!event.request.url.startsWith(self.location.origin) ||
		event.request.method !== "GET"
	) {
		return void event.respondWith(fetch(event.request).catch((err) => console.log(err)))
	}

	if(!isCached(event.request.url)){
		event.respondWith(
			
			fetch(event.request)
			.then((response) => {
				caches.open(CACHE).then((cache) => {
					cache.put(event.request, response)
				})
				return response.clone()
			})
			.catch((_err) => {
				return caches.match(event.request).then((cachedResponse) => {
					if (cachedResponse) {
						return cachedResponse
					}

					return caches.open(CACHE).then((cache) => {
						const offlineRequest = new Request(OFFLINE)
						return cache.match(offlineRequest)
					})
				})
			})
			
		)
	} else {
		event.respondWith(
			caches.match(event.request).then((response) => {
				if (response) {
					return response
				}

				return fetch(event.request).then((response) => {
					caches.open(CACHE).then((cache) => {
						cache.put(event.request, response)
					})
					return response.clone()
				})
			})
		)
	}

})