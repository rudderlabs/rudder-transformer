const tags = require('../tags');
const { BaseError } = require('./base');

class TransformationError extends BaseError {
  constructor(message, statusCode, destResponse, authErrorCategory) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.TRANSFORMATION,
    };

    super(message, statusCode || 400, finalStatTags, destResponse, authErrorCategory);
  }
}

module.exports = TransformationError;
