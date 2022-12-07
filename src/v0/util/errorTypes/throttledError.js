const tags = require("../tags");
const { BaseError } = require("./base");

class ThrottledError extends BaseError {
  constructor(message, destResponse) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.THROTTLED
    };

    super(message, 429, finalStatTags, destResponse);
  }
}

module.exports = ThrottledError;
