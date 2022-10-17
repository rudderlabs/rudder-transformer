const { isObject } = require("lodash");

class RudderErrorBase extends Error {
  constructor(message, statusCode, statTags, destResponse, authErrorCategory) {
    super(message);
    this.status = statusCode;
    this.destinationResponse = destResponse;
    this.authErrorCategory = authErrorCategory;
    this.statTags = {
      destType: statTags.destType || statTags.destination,
      stage: statTags.stage,
      scope: statTags.scope,
      meta: statTags.meta
    };
  }

  static getStatTags(statTags, defaults) {
    let finalStatTags = { ...defaults };
    if (isObject(statTags)) {
      finalStatTags = { ...finalStatTags, ...statTags };
    }
    return finalStatTags;
  }
}

module.exports = { RudderErrorBase };
