const { default: axios } = require("axios");
const {
  promisifiedEventEmitter,
  cacheEventEmitter
} = require("../util/cluster");
const { CONFIG_BACKEND_URL } = require("../util/customTransforrmationsStore");
const { CustomError } = require("../v0/util");
const { authCacheEventName } = require("../constants");

/**
 * This is more like a centralised cache for a pod
 * Please use this, in case pod level centralisation is needed
 */
class PodCache {
  constructor(key) {
    if (!key) {
      throw new CustomError("'key' property is required", 400);
    }
    this.event = {
      key,
      type: "get"
    };
  }

  getTokenUrl() {
    const [rudderAccountId, workspaceId] = this.event.key.split("|");
    return `${CONFIG_BACKEND_URL}/dest/workspaces/${workspaceId}/accounts/${rudderAccountId}/token`;
  }

  async getToken() {
    const tokenUrl = this.getTokenUrl();
    const { data: secret } = await axios.post(tokenUrl);
    return {
      accessToken: secret.accessToken,
      expirationDate: secret.expirationDate
    };
  }

  async getTokenFromCache() {
    const promCacheEvEmitter = promisifiedEventEmitter(
      cacheEventEmitter,
      authCacheEventName,
      { ...this.event }
    );
    let result = await promCacheEvEmitter;
    if (!result.value) {
      const tokenInfo = await this.getToken();
      result = await this.setTokenInfoIntoCache(tokenInfo);
    }
    return result;
  }

  async setTokenInfoIntoCache(tokenInfo) {
    const updPromCacheEvEmitter = promisifiedEventEmitter(
      cacheEventEmitter,
      authCacheEventName,
      {
        ...this.event,
        type: "update",
        value: tokenInfo
      }
    );
    return updPromCacheEvEmitter;
  }
}

module.exports = PodCache;
