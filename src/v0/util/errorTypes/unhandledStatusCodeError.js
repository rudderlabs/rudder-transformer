const tags = require("../tags");
const { BaseError } = require("./base");

class UnhandledStatusCodeError extends BaseError {
  constructor(message, destResponse) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.ABORTED,
      [tags.TAG_NAMES.META]: tags.METADATA.UNHANDLED_STATUS_CODE
    };

    super(message, 400, finalStatTags, destResponse);
  }
}

module.exports = UnhandledStatusCodeError;
