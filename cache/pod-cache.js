const { default: axios } = require("axios");
const {
  promisifiedEventEmitter,
  cacheEventEmitter
} = require("../util/cluster");
const { CONFIG_BACKEND_URL } = require("../util/customTransforrmationsStore");
const { CustomError } = require("../v0/util");
const { authCacheEventName } = require("../constants");
const { send } = require("../adapters/network");

/**
 * This is more like a centralised cache for a pod
 * Please use this, in case caching is needed at pod level
 */
class PodCache {
  constructor(key) {
    if (!key) {
      throw new CustomError("'key' property is required", 400);
    }
    this.cacheEvent = {
      key,
      type: "get"
    };
  }

  getTokenUrl() {
    const [rudderAccountId, workspaceId] = this.cacheEvent.key.split("|");
    return `/dest/workspaces/${workspaceId}/accounts/${rudderAccountId}/token`;
  }

  async getToken(workspaceToken) {
    const tokenUrl = this.getTokenUrl();
    const cpRequestOptions = {
      url: CONFIG_BACKEND_URL + tokenUrl,
      method: "POST",
      headers: {
        Authorization: `Basic ${workspaceToken}`
      }
    };
    const { success, response } = await send(cpRequestOptions);
    if (success) {
      const { data: secret } = response;
      return {
        accessToken: secret.accessToken,
        expirationDate: secret.expirationDate
      };
    }
    throw new CustomError(response, 400);
  }

  async getTokenFromCache(workspaceToken) {
    const promCacheEvEmitter = promisifiedEventEmitter(
      cacheEventEmitter,
      authCacheEventName,
      { ...this.cacheEvent }
    );
    let result = await promCacheEvEmitter;
    if (!result.value) {
      const tokenInfo = await this.getToken(workspaceToken);
      result = await this.setTokenInfoIntoCache(tokenInfo);
    }
    return result;
  }

  async setTokenInfoIntoCache(tokenInfo) {
    const updPromCacheEvEmitter = promisifiedEventEmitter(
      cacheEventEmitter,
      authCacheEventName,
      {
        ...this.cacheEvent,
        type: "update",
        value: tokenInfo
      }
    );
    return updPromCacheEvEmitter;
  }
}

module.exports = PodCache;
