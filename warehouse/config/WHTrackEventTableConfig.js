const get = require("get-value");
const { isBlank } = require("../util");

const getCloudRecordID = message => {
  if (get(message, "context.sources.version")) {
    const { recordId } = message;
    if (typeof recordId === "object" || isBlank(recordId)) {
      throw new Error("recordId cannot be empty for cloud sources events");
    }
    return recordId;
  }
  return message.messageId;
};

const rules = {
  id: (message, options) =>
    message.type === "track" && options.sourceCategory === "cloud"
      ? getCloudRecordID(message)
      : message.messageId
};

module.exports = rules;
