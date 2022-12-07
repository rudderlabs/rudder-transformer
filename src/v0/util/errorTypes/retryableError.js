const tags = require("../tags");
const { DefaultError } = require("./default");

class RetryableError extends DefaultError {
  constructor(message, statusCode = 500, destResponse, authErrCategory) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.RETRYABLE
    };

    super(message, statusCode, finalStatTags, destResponse, authErrCategory);
  }
}

module.exports = RetryableError;
