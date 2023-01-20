const tags = require('../tags');
const { BaseError } = require('./base');

class UnsupportedEventError extends BaseError {
  constructor(message) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.PLATFORM,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.UNSUPPORTED,
    };
    super(message, 400, finalStatTags);
  }
}

module.exports = UnsupportedEventError;
