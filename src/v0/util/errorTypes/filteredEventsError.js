const tags = require('../tags');
const { BaseError } = require('./base');

class FilteredEventsError extends BaseError {
    constructor(message, action=null) {
        const finalStatTags = {
            [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.TRANSFORMATION,
            [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.FILTERED,
        };
        super(message, 400, finalStatTags);
        this.action = action
    }
}

module.exports = FilteredEventsError;