const { sourceCategoriesToUseRecordId, getCloudRecordID } = require('../util');

const rules = {
  id: (message, options) => {
    return message.type === 'track' &&
      sourceCategoriesToUseRecordId.includes(options.sourceCategory)
      ? getCloudRecordID(message, message.messageId)
      : message.messageId;
  },
};

module.exports = rules;
