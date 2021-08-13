const AccountCache = require('./account-cache');

class CacheFactory {
  static cache = {};

  // To not allow any developer to directly set the cache factory object
  static set cache(value) {
    throw new Error("Cannot set cache variable directly");
  }

  static createCache(cacheKey, key, options = {}) {
    if (!CacheFactory.cache[cacheKey]) {
      switch (key.toLowerCase()) {
        case 'account':
          CacheFactory.cache[cacheKey] = new AccountCache(options);
          break;
        case 'order':
          CacheFactory.cache[cacheKey] = new OrderCache(options);
          break;
        default:
          return null;
      }
    }
    return CacheFactory.cache[cacheKey];
  }
}

module.exports = CacheFactory;
