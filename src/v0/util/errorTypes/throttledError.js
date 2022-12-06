const tags = require("../tags");
const { DefaultError } = require("./default");

class ThrottledError extends DefaultError {
  constructor(message, statTags = {}, destResponse) {
    let finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.THROTTLED
    };

    if (typeof statTags === "object" && !Array.isArray(statTags)) {
      finalStatTags = {
        ...statTags,
        finalStatTags
      };
    }

    super(message, 429, finalStatTags, destResponse);
  }
}

module.exports = ThrottledError;
