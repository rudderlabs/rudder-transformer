const tags = require("../tags");
const { BaseError } = require("./base");

class OAuthSecretError extends BaseError {
  constructor(message) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.PLATFORM,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.OAUTH_SECRET
    };

    super(message, 500, finalStatTags);
  }
}

module.exports = OAuthSecretError;
