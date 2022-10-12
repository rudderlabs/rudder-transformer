class RudderErrorBase extends Error {
  constructor(message, statusCode, statTags, destResponse, authErrorCategory) {
    super(message);
    this.err = new Error();
    this.message = message;
    this.status = statusCode;
    this.statTags = statTags;
    this.destinationResponse = destResponse;
    this.err.authErrorCategory = authErrorCategory;
    this.err.statTags = {
      destType: statTags.destType || statTags.destination,
      stage: statTags.stage,
      scope: statTags.scope,
      meta: statTags.meta
    };
  }
}

module.exports = { RudderErrorBase };
