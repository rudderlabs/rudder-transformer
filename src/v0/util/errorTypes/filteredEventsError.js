const { BaseError } = require('./base');
const { HTTP_STATUS_CODES } = require('../constant');

class FilteredEventsError extends BaseError {
  constructor(message, statusCode = HTTP_STATUS_CODES.FILTER_EVENTS) {
    super(message, statusCode);
  }
}

module.exports = FilteredEventsError;
