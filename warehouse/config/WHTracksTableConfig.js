const get = require("get-value");
const _ = require("lodash");
const { isBlank } = require("../util");

const getCloudRecordID = message => {
  if (get(message, "context.sources.version")) {
    const { recordId } = message;
    if (typeof recordId === "object" || isBlank(recordId)) {
      throw new Error("recordId cannot be empty for cloud sources events");
    }
    return recordId;
  }
  return null;
};

const rules = {
  record_id: (message, options) =>
    message.type === "track" && options.sourceCategory === "cloud"
      ? _.toString(getCloudRecordID(message))
      : null
};

module.exports = rules;
