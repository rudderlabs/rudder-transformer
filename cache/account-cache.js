/* eslint-disable no-useless-constructor */
const { default: axios } = require("axios");
const { CONFIG_BACKEND_URL } = require("../util/customTransforrmationsStore");
const BaseCache = require("./base");

class AccountCache extends BaseCache {
  constructor() {
    super({
      stdTTL: 10 * 60
    });
  }

  static formKeyForCache(workspaceId, accountId) {
    return `${workspaceId}|${accountId}`;
  }

  static getAccountUrl(key) {
    const [workspaceId, accountId] = key.split("|");
    return `${CONFIG_BACKEND_URL}/workspaces/${workspaceId}/dest/accounts/${accountId}`;
  }

  async insertNewValueIntoCache(key, value='') {
    const accountUrl = AccountCache.getAccountUrl(key);
    const { data: account } = await axios.get(accountUrl);
    this.set(key, account);
  }

  async onExpired(k, v) {
    await this.insertNewValueIntoCache(k, v);
  }

  async onDeleted(k, v) {
    await this.insertNewValueIntoCache(k, v);
  }

  async setValue(key) {
    if (!this.has(key)) {
      await this.insertNewValueIntoCache(key);
    }
  }
}

module.exports = AccountCache;
