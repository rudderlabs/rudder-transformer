const tags = require("../tags");
const { DefaultError } = require("./default");

class OAuthSecretError extends DefaultError {
  constructor(message) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.PLATFORM,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.OAUTH_SECRET
    };

    super(message, 400, finalStatTags);
  }
}

module.exports = OAuthSecretError;
