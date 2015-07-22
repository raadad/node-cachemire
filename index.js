/**
 * [constructor cachemirecachemirecachemire entrypoint]
 * @param  {[library]}          cacheManager [description]
 * @param  {[library]}          collapse    [description]
 * @param  {[cacheInstance]}    cache        [description]
 * @return {[cachioInstance]}                [description]
 */


// IMMENENT EXPIRY UPDATE - DONE
// UPSTREAM COALESSING - DONE
// GET AND PASSUP - DONE
// STAGGERED TTL - DONE
//

var constructor = function(collapse, cache) {
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
        if (!options) options = {};
        if (!options.cacheOptions) options.cacheOptions = {};
        if (!options.setOptions) options.setOptions = {};

        collapse(options.cacheOptions, key, action, function(err, data) {
            if (!err) self.set(key, data, options.setOptions);
            callback.apply(this, arguments);
        });
    };

    self.set = function(key, value, options, cb) {
        if (!options) options = {};
        if (!options.staggeredTtlRange) options.staggeredTtlRange = 0;
        if (!options.ttl) options.ttl = 100;
        options = exports._extend({}, options);
        options.ttl = options.ttl + (Math.floor(Math.random() * options.staggeredTtlRange));
        cache.set(key, value, options, cb);
    };

    self.del = function(key, options, cb) {
        cache.del.apply(this, arguments);
    };


    self.constructor = constructor;
    return self;
};

module.exports = constructor.bind(null, require('collapsio'));

exports._extend = function(origin, add) {

    if (!add || typeof add !== 'object') return origin;

    var keys = Object.keys(add);
    var i = keys.length;
    while (i--) {
        origin[keys[i]] = add[keys[i]];
    }
    return origin;
};
