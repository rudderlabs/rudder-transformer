const tags = require("../tags");
const { DefaultError } = require("./default");

class InstrumentationError extends DefaultError {
  constructor(message) {
    const finalStatTags = {
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.DATA_VALIDATION,
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.INSTRUMENTATION
    };

    super(message, 400, finalStatTags);
  }
}

module.exports = InstrumentationError;
