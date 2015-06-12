/**
 * [constructor cacheio entrypoint]
 * @param  {[library]}          cacheManager [description]
 * @param  {[library]}          collapsio    [description]
 * @param  {[cacheInstance]}    cache        [description]
 * @return {[cachioInstance]}                [description]
 */


// IMMENENT EXPIRY UPDATE - DONE
// UPSTREAM COALESSING - DONE
// GET AND PASSUP - DONE
// STAGGERED TTL - DONE
//

var constructor = function(cacheManager, collapsio, cache) {
    var self = {};

    self.get = function(options, key, action, callback) {
        if (!options) options = {};
        if (!options.cacheRefreshThreshold) options.cacheRefreshThreshold = -100;

        cache.getAndPassUp(key, function(err, result) {
            if (!result) return self.goUpstream(options, key, action, callback);
            if (result.ttl < options.cacheRefreshThreshold) {
                self.goUpstream(options, key, action, callback);
            }
            callback(err, result);
        });
    };

    self.goUpstream = function(options, key, action, callback) {
        collapsio.apply(options.cacheOptions, key, action, function() {
            self.set(key, options.setOptions);
            callback.apply(this, arguments);
        });
    };

    self.set = function(key, value, options, cb) {
        if (!options.staggeredTtlRange) options.staggeredTtlRange = 0;
        if (!options.ttl) options.ttl =  100;
        options.ttl + (Math.floor(Math.random() * options.staggeredTtlRange));
        cache.set.apply(this, arguments);
    };

    self.del = function(key, options, cb) {
        cache.del.apply(this, arguments);
    };


    self.constructor = constructor;
    return self;
};

module.exports = constructor.bind(null, require('cache-manager'), require('collapsio'));


