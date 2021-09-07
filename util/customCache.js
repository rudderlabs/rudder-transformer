const NodeCache = require("node-cache");
const stdTTL = process.env.STDTTL ? parseInt(process.env.STDTTL, 10) : 0;
const shared = process.env.SHARED === 'true';

class CustomCache {
  constructor(ttlSeconds = stdTTL) {
    this.cache = shared ? new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
    })
    : {};
  }

  get(key) {
    return shared ? this.cache.get(key) : this.cache[key];
  }

  set(key, value, ttl = stdTTL) {
      return shared ? this.cache.set(key, value, ttl) : this.cache[key] = value;
  }
}

module.exports = CustomCache;
