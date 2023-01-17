const NodeCache = require('node-cache');

class Cache {
  constructor(ttlSeconds) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  async get(key, storeFunction) {
    const value = this.cache.get(key);
    if (value) {
      return Promise.resolve(value);
    }

    const result = storeFunction ? await storeFunction() : undefined;
    // store in cache if the value is valid, else skip
    let retVal = result;
    if (result) {
      if (typeof result === 'object' && 'value' in result && 'age' in result) {
        this.cache.set(key, result.value, result.age);
        retVal = result.value;
      } else {
        this.cache.set(key, result);
      }
    }
    return retVal;
  }

  del(key) {
    this.cache.del(key);
  }
}

module.exports = Cache;
