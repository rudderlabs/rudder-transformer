const tags = require("../tags");
const { DefaultError } = require("./default");

class PlatformError extends DefaultError {
  constructor(message, statTags = {}) {
    let finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.PLATFORM
    };

    if (typeof statTags === "object" && !Array.isArray(statTags)) {
      finalStatTags = {
        ...statTags,
        finalStatTags
      };
    }

    super(message, 400, finalStatTags);
  }
}

module.exports = PlatformError;
