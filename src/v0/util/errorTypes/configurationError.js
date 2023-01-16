const tags = require("../tags");
const { BaseError } = require("./base");

class ConfigurationError extends BaseError {
  constructor(message) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.DATA_VALIDATION,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.CONFIGURATION
    };

    // TODO: Change this to a retryable error
    super(message, 400, finalStatTags);
  }
}

module.exports = ConfigurationError;
