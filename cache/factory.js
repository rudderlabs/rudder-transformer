const NodeCache = require('node-cache');

class CacheFactory {
  cache = {};

  // To not allow any developer to directly set the cache factory object
  static set cache(value) {
    throw new Error("Cannot set cache variable directly");
  }

  createCache(key, options = {}) {
    const lowerCaseKey = key.toLowerCase();
    if (!this.cache[lowerCaseKey]) {
      this.cache[lowerCaseKey] = new NodeCache(options);
    }
    return this.cache[lowerCaseKey];
  }
}

module.exports = CacheFactory;
