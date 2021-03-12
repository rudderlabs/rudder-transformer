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
    console.log("cache " + JSON.stringify(this.cache));
    const value = this.cache.get(key);
    console.log("cache get: key: value: " + key + " | " + value);
    if (value) {
      return Promise.resolve(value);
    }

    return storeFunction().then(result => {
      // store in cache if the value is valid, else skip
      console.log("cache store: key: value: " + key + " | " + result);
      if (result) {
        this.cache.set(key, result);
      }
      return result;
    });
  }
}

module.exports = Cache;
