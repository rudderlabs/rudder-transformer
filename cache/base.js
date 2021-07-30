const NodeCache = require("node-cache");

class BaseCache extends NodeCache {
  // For more information on the options please check the documentation for node-cache
  // https://www.npmjs.com/package/node-cache
  constructor(cacheOptions) {
    super(cacheOptions);
    this.callbacks = {
      expired: this.onExpired,
      del: this.onDeleted
    };

    Object.keys(this.callbacks).forEach(k => {
      this.on(k, this.callbacks[k]);
    });
  }

  async onDeleted(_k, _v) {
    throw new Error("method not been implemented");
  }

  async onExpired(_k, _v) {
    throw new Error("method not been implemented");
  }
}

module.exports = BaseCache;
