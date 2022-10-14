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
    if (isObject(statTags)) {
      const finalStatTags = Object.keys(statTags)
        .filter(tagKey => ["scope", "meta", "destType"].includes(tagKey))
        .reduce((prevTags, tagKey) => {
          return {
            ...prevTags,
            [tagKey]: statTags[tagKey] || defaults[tagKey]
          };
        }, {});

      return finalStatTags;
    }
    return {
      ...defaults
    };
  }
}

module.exports = { RudderErrorBase };
