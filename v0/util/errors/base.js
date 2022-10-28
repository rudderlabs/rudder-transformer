class RudderErrorBase extends Error {
  constructor(message, statusCode, statTags, destResponse, authErrorCategory) {
    super(message);
    this.status = statusCode;
    this.destinationResponse = destResponse;
    this.authErrorCategory = authErrorCategory;
    this.statTags = statTags;
  }

  static populateStatTags(statTags, defaults) {
    return {
      destType:
        statTags?.destType || statTags?.destination || defaults?.destType,
      stage: statTags?.stage || defaults?.stage,
      scope: statTags?.scope || defaults?.scope,
      meta: statTags?.meta || defaults?.meta
    };
  }
}

module.exports = { RudderErrorBase };
