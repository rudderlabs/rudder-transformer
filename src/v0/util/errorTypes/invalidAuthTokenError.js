const tags = require("../tags");
const { DefaultError } = require("./default");

class InvalidAuthTokenError extends DefaultError {
  constructor(message, statusCode = 500, destResponse, authErrCategory) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.RETRYABLE,
      [tags.TAG_NAMES.META]: tags.METADATA.INVALID_AUTH_TOKEN
    };

    super(message, statusCode, finalStatTags, destResponse, authErrCategory);
  }
}

module.exports = InvalidAuthTokenError;
