const tags = require('../tags');
const { BaseError } = require('./base');

class RetryableError extends BaseError {
  constructor(message, statusCode, destResponse, authErrorCategory) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.RETRYABLE,
    };

    super(message, statusCode || 500, finalStatTags, destResponse, authErrorCategory);
  }
}

module.exports = RetryableError;
