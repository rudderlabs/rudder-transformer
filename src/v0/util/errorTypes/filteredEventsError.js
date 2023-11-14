const tags = require('../tags');
const { BaseError } = require('./base');
const { HTTP_STATUS_CODES } = require('../constant');

class FilteredEventsError extends BaseError {
  constructor(message, statusCode = HTTP_STATUS_CODES.FILTER_EVENTS) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.TRANSFORMATION,
    };
    super(message, statusCode, finalStatTags);
  }
}

module.exports = FilteredEventsError;
