const tags = require('../tags');
const { BaseError } = require('./base');

class FilteredEventsError extends BaseError {
    constructor(message, action = null, statusCode=298) {
        const finalStatTags = {
            [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.TRANSFORMATION,
            [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.FILTERED,
        };
        super(message, statusCode, finalStatTags);
        this.action = action
    }
}

module.exports = FilteredEventsError;