const { getRecordIDForExtract } = require("../util");

const rules = {
  id: message => getRecordIDForExtract(message),
  received_at: "receivedAt",
  event: "event"
};

module.exports = rules;
