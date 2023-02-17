const _ = require('lodash');
const { sourceCategoriesToUseRecordId, getCloudRecordID } = require('../util');

const rules = {
  record_id: (message, options) =>
    message.type === 'track' && sourceCategoriesToUseRecordId.includes(options.sourceCategory)
      ? _.toString(getCloudRecordID(message))
      : null,
};

module.exports = rules;
