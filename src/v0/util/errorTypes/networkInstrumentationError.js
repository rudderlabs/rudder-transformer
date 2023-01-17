const tags = require('../tags');
const { BaseError } = require('./base');

class NetworkInstrumentationError extends BaseError {
  constructor(message, destResponse) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.ABORTED,
      [tags.TAG_NAMES.META]: tags.METADATA.INSTRUMENTATION,
    };

    super(message, 400, finalStatTags, destResponse);
  }
}

module.exports = NetworkInstrumentationError;
