const { getFirstValidValue } = require("./helpers");

const rules = {
  id: "messageId",
  anonymous_id: "anonymousId",
  user_id: "userId",
  sent_at: "sentAt",
  timestamp: "timestamp",
  received_at: "receivedAt",
  original_timestamp: "originalTimestamp",
  channel: "channel",
  context_ip: message =>
    getFirstValidValue(message, ["context.ip", "request_ip"]),
  context_request_ip: "request_ip",
  context_passed_ip: "context.ip"
};

module.exports = rules;
