const tags = require("../tags");
const { DefaultError } = require("./default");

class ConfigurationError extends DefaultError {
  constructor(message) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.DATA_VALIDATION,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.CONFIGURATION
    };

    super(message, 500, finalStatTags);
  }
}

module.exports = ConfigurationError;
