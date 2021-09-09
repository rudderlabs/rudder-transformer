const AccountCache = require('./account-cache');

class CacheFactory {
  static cache = {};

  // To not allow any developer to directly set the cache factory object
  static set cache(value) {
    throw new Error("Cannot set cache variable directly");
  }

  static createCachePerTransformerWorker(cacheKey, key, options = {}) {
    if (!CacheFactory.cache[cacheKey]) {
      switch (key.toLowerCase()) {
        case 'account':
          CacheFactory.cache[cacheKey] = new AccountCache(options);
          break;
        default:
          return null;
      }
    }
    return CacheFactory.cache[cacheKey];
  }


  static createCache(key, options = {}) {
    const lowerCaseKey = key.toLowerCase();
    if (!CacheFactory.cache[lowerCaseKey]) {
      switch (key.toLowerCase()) {
        case 'account':
          CacheFactory.cache[lowerCaseKey] = new AccountCache(options);
          break;
        default:
          return null;
      }
    }
    return CacheFactory.cache[lowerCaseKey];
  }
}

module.exports = CacheFactory;
