const tags = require("../tags");
const { BaseError } = require("./base");

class NetworkError extends BaseError {
  constructor(
    message,
    statusCode = 400,
    statTags = {},
    destResponse,
    authErrCategory
  ) {
    let finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK
    };

    if (typeof statTags === "object" && !Array.isArray(statTags)) {
      // TODO: Restrict the names of the incoming tags here
      finalStatTags = {
        ...statTags,
        finalStatTags
      };
    }

    super(message, statusCode, finalStatTags, destResponse, authErrCategory);
  }
}

module.exports = NetworkError;
