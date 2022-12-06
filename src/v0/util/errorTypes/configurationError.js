const tags = require("../tags");
const { DefaultError } = require("./default");

class ConfigurationError extends DefaultError {
  constructor(message, statTags = {}) {
    let finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.DATA_VALIDATION,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.CONFIGURATION
    };

    if (typeof statTags === "object" && !Array.isArray(statTags)) {
      finalStatTags = {
        ...statTags,
        finalStatTags
      };
    }

    super(message, 500, finalStatTags);
  }
}

module.exports = ConfigurationError;
