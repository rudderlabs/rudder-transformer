const NodeCache = require("node-cache");

class Cache {
  constructor(ttlSeconds) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false
    });
  }

  get(key, storeFunction) {
    const value = this.cache.get(key);
    if (value) {
      return Promise.resolve(value);
    }

    return storeFunction().then(result => {
      // store in cache if the value is valid, else skip
      if (result && typeof result === "object") {
        if (result.value && result.age) {
          return result.value;
        }
      }
      if (result) {
        this.cache.set(key, result);
      }
      return result;
    });
  }

  del(key) {
    this.cache.del(key);
  }
}

module.exports = Cache;
