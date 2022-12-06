class DefaultError extends Error {
  constructor(
    message = "",
    statusCode = 400,
    sTags = {},
    destResponse = "",
    authErrCategory = ""
  ) {
    super(message);
    this.status = statusCode;
    this.statTags = sTags;
    this.destinationResponse = destResponse;
    this.authErrorCategory = authErrCategory;
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

module.exports = { DefaultError };
