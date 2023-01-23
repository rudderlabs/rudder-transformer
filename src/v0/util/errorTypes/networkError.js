const tags = require('../tags');
const { BaseError } = require('./base');

const errorTypes = Object.values(tags.ERROR_TYPES);
const metaTypes = Object.values(tags.METADATA);
// To throw error when error type (abort, retry or throttle) has to be dynamically deduced
class NetworkError extends BaseError {
  constructor(message, statusCode, statTags, destResponse, authErrorCategory) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.ABORTED,
    };

    // Allow specifying only error type and meta tags
    if (statTags && typeof statTags === 'object' && !Array.isArray(statTags)) {
      if (errorTypes.includes(statTags[tags.TAG_NAMES.ERROR_TYPE])) {
        finalStatTags[tags.TAG_NAMES.ERROR_TYPE] = statTags[tags.TAG_NAMES.ERROR_TYPE];
      }

      if (metaTypes.includes(statTags[tags.TAG_NAMES.META])) {
        finalStatTags[tags.TAG_NAMES.META] = statTags[tags.TAG_NAMES.META];
      }
    }

    super(message, statusCode || 400, finalStatTags, destResponse, authErrorCategory);
  }
}

module.exports = NetworkError;
