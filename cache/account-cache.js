/* eslint-disable no-useless-constructor */
const { default: axios } = require("axios");
const moment = require("moment");
const { CONFIG_BACKEND_URL } = require("../util/customTransforrmationsStore");
const BaseCache = require("./base");

class AccountCache extends BaseCache {
  constructor() {
    super({
      stdTTL: 10 * 60
    });
  }

  static getTokenUrl(key) {
    const [accountId, workspaceId] = key.split("|");
    return `${CONFIG_BACKEND_URL}/dest/workspaces/${workspaceId}/accounts/${accountId}/token`;
  }

  async getToken(key) {
    const tokenUrl = this.constructor.getTokenUrl(key);
    const { data: account } = await axios.get(tokenUrl);
    return account;
  }

  async onExpired(k, v) {
    // The Account Secrets like accessToken, refreshToken, expirationDate etc., are being fetched
    const account = await this.getToken(k);
    const diffTimeMs = moment(account.secret.expirationDate).valueOf() - moment().valueOf();
    this.set(k, account, diffTimeMs / 1000);
  }

  async getTokenFromCache(workspaceId, accountId) {
    const key = `${accountId}|${workspaceId}`;
    if (!this.get(key)) {
      await this.onExpired(key, "");
    }
    return this.get(key);
  }
}

module.exports = AccountCache;
