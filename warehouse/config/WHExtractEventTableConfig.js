const { getRecordIDForExtract } = require("../util");

const rules = {
  id: message => getRecordIDForExtract(message),
  received_at: "receivedAt"
};

module.exports = rules;
