const tags = require("../tags");
const { BaseError } = require("./base");

class PlatformError extends BaseError {
  constructor(message) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.PLATFORM
    };

    super(message, 400, finalStatTags);
  }
}

module.exports = PlatformError;
