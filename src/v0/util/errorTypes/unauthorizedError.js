const tags = require("../tags");
const { BaseError } = require("./base");

class UnauthorizedError extends BaseError {
  constructor(message, statusCode = 400, destResponse, authErrorCategory) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.ABORTED,
      [tags.TAG_NAMES.META]: tags.METADATA.UNAUTHORIZED
    };

    super(message, statusCode, finalStatTags, destResponse, authErrorCategory);
  }
}

module.exports = UnauthorizedError;
