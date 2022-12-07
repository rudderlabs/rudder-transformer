const tags = require("../tags");
const { DefaultError } = require("./default");

class ThrottledError extends DefaultError {
  constructor(message, destResponse) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.THROTTLED
    };

    super(message, 429, finalStatTags, destResponse);
  }
}

module.exports = ThrottledError;
