const tags = require("../tags");
const { DefaultError } = require("./default");

class PlatformError extends DefaultError {
  constructor(message) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.PLATFORM
    };

    super(message, 400, finalStatTags);
  }
}

module.exports = PlatformError;
