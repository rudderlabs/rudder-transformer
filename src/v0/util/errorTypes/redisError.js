const tags = require('../tags');
const { BaseError } = require('./base');

class RedisError extends BaseError {
  constructor(message, statusCode) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.TRANSFORMATION,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.REDIS,
    };

    super(message, statusCode || 500, finalStatTags);
  }
}

module.exports = RedisError;
