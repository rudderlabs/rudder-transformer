const { coalesce } = require("./helpers");

const rules = {
  direct: {
    messageId: "id",
    anonymousId: "anonymous_id",
    userId: "user_id",
    request_ip: "context_request_ip",
    "context.ip": "context_passed_ip",
    sentAt: "sent_at",
    timestamp: "timestamp",
    receivedAt: "received_at",
    originalTimestamp: "original_timestamp",
    channel: "channel"
  },

  custom: {
    context_ip: message => coalesce(message, ["context.ip", "request_ip"])
  }
};

module.exports = rules;
