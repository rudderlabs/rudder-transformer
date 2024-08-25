const { getFirstValidValue } = require('./helpers');

const rules = {
  anonymous_id: 'anonymousId',
  sent_at: 'sentAt',
  timestamp: 'timestamp',
  original_timestamp: 'originalTimestamp',
  channel: 'channel',
  context_ip: (message) => getFirstValidValue(message, ['context.ip', 'request_ip']),
  context_request_ip: 'request_ip',
  context_passed_ip: 'context.ip',
};

module.exports = rules;
