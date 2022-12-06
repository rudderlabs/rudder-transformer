const tags = require("../tags");
const { DefaultError } = require("./default");

class InvalidAuthTokenError extends DefaultError {
  constructor(
    message,
    statusCode = 500,
    statTags = {},
    destResponse,
    authErrCategory
  ) {
    let finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.RETRYABLE,
      [tags.TAG_NAMES.META]: tags.METADATA.INVALID_AUTH_TOKEN
    };

    if (typeof statTags === "object" && !Array.isArray(statTags)) {
      finalStatTags = {
        ...statTags,
        finalStatTags
      };
    }

    super(message, statusCode, finalStatTags, destResponse, authErrCategory);
  }
}

module.exports = InvalidAuthTokenError;
