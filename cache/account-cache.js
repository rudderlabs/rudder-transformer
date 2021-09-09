/* eslint-disable no-useless-constructor */
const { default: axios } = require("axios");
const moment = require("moment");
const { CONFIG_BACKEND_URL } = require("../util/customTransforrmationsStore");
const BaseCache = require("./base");
const logger = require("../logger");

class AccountCache extends BaseCache {
  constructor() {
    super();
  }

  static formCacheKey(accountId, workspaceId) {
    return `${accountId}|${workspaceId}`;
  }

  static getTokenUrl(key) {
    const [accountId, workspaceId] = key.split("|");
    return `${CONFIG_BACKEND_URL}/dest/workspaces/${workspaceId}/accounts/${accountId}/token`;
  }

  hasTokenExpired(key) {
    const tokenInfo = this.get(key);
    return (
      tokenInfo &&
      tokenInfo.expirationDate &&
      moment(tokenInfo.expirationDate).valueOf() < moment().valueOf()
    );
  }

  static getTtl(tokenInfo) {
    if (tokenInfo && tokenInfo.expirationDate) {
      return (
        Math.abs(
          moment().valueOf() - moment(tokenInfo.expirationDate).valueOf()
        ) / 1000
      );
    }
    return 0;
  }

  async getToken(key) {
    const tokenUrl = this.constructor.getTokenUrl(key);
    const { data: secret } = await axios.post(tokenUrl);
    return {
      accessToken: secret.accessToken,
      expirationDate: secret.expirationDate
    };
  }

  async onExpired(k, v) {
    try {
      // Only AccessToken is being fetched in this call
      const tokenInfo = await this.getToken(k);
      this.set(k, tokenInfo);
    } catch (error) {
      logger.error(error);
    }
  }

  async getTokenFromCache(workspaceId, accountId) {
    const key = this.constructor.formCacheKey(accountId, workspaceId);
    if (!this.get(key) || this.hasTokenExpired(key)) {
      await this.onExpired(key, "");
    }
    return this.get(key).accessToken;
  }

  /**
   * Sets the token information into cache
   *
   * Note: This function is intended to be used only during network layer handling
   * @param {Object} tokenInfo - Contains the info necessary for setting token in cache
   * @param {string} tokenInfo.accessToken - Access token to be used for destination authorization
   * @param {string} tokenInfo.workspaceId - Workspace linked to the destination
   * @param {string} tokenInfo.accountId - Account linked to the destination
   * @param {string} tokenInfo.expirationDate - Expiration date of the token
   */
  setToken(tokenInfo) {
    const { workspaceId, accountId, accessToken, expirationDate } = tokenInfo;
    this.set(this.constructor.formCacheKey(accountId, workspaceId), {
      accessToken,
      expirationDate: moment(expirationDate).toDate()
    });
  }
}

module.exports = AccountCache;
