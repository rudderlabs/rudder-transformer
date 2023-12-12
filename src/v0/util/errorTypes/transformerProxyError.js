const tags = require('../tags');
const { BaseError } = require('./base');

const errorTypes = Object.values(tags.ERROR_TYPES);
const metaTypes = Object.values(tags.METADATA);
class TransformerProxyError extends BaseError {
  constructor(message, statusCode, statTags, destResponse, authErrorCategory, response) {
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
    super(message, statusCode, finalStatTags, destResponse, authErrorCategory);
    this.response = response;
  }
}

module.exports = TransformerProxyError;