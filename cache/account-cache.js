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

  static getTokenUrl(key) {
    const [workspaceId, accountId] = key.split("|");
    return `${CONFIG_BACKEND_URL}/dest/workspaces/${workspaceId}/accounts/${accountId}/token`;
  }

  async getToken(key) {
    const tokenUrl = this.getTokenUrl(key);
    const { data: account } = await axios.get(tokenUrl);
    return account;
  }

  async onExpired(k, v) {
    // The Account Secrets like accessToken, refreshToken, expirationDate etc., are being fetched
    const account = await this.getToken(k);
    this.set(k, account, account.secret.expiresIn * 0.3);
  }

  static async getTokenFromCache(workspaceId, accountId) {
    const key = this.formKeyForCache(workspaceId, accountId);
    if (!this.get(key)) {
      await this.onExpired(key, "");
    }
    return this.get(key);
  }
}

module.exports = AccountCache;
