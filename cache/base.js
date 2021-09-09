const NodeCache = require("node-cache");

class BaseCache extends NodeCache {
  // For more information on the options please check the documentation for node-cache
  // https://www.npmjs.com/package/node-cache
  // eslint-disable-next-line no-useless-constructor
  constructor(cacheOptions) {
    super(cacheOptions);
    this.callbacks = {
      // expired: this.onExpired,
      del: this.onDeleted
    };

    Object.keys(this.callbacks).forEach(k => {
      this.on(k, this.callbacks[k]);
    });
  }

  async onDeleted(_k, _v) {
    // a callback for del event fired in node-cache
  }

  // async onExpired(_k, _v) {
  //   // a callback for expired event fired in node-cache
  // }
}

module.exports = BaseCache;
