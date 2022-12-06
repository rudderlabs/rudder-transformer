const tags = require("../tags");
const { DefaultError } = require("./default");

class UnhandledStatusCodeError extends DefaultError {
  constructor(message, statTags = {}, destResponse) {
    let finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.ABORTED,
      [tags.TAG_NAMES.META]: tags.METADATA.UNHANDLED_STATUS_CODE
    };

    if (typeof statTags === "object" && !Array.isArray(statTags)) {
      finalStatTags = {
        ...statTags,
        finalStatTags
      };
    }

    super(message, 400, finalStatTags, destResponse);
  }
}

module.exports = UnhandledStatusCodeError;
