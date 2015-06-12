var Cachio = require('./index.js'),
    cacheManager = require('cache-manager'),
    memoryCache = cacheManager.caching({
        store: 'memory',
        max: 100,
        ttl: 10
    }),
    memoryCache2 = cacheManager.caching({
        store: 'memory',
        max: 100,
        ttl: 100
    }),
    backendCache = cacheManager.multiCaching([memoryCache, memoryCache2]),
    cachemire = Cachio(backendCache),
    request = require('request');

cachemire.get({}, 'google', request.get.bind('http://google.com'), function(req, res) {
    console.log("@@@@@@@@@@@@@@");
});
