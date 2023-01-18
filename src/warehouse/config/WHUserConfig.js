const { getFirstValidValue } = require('./helpers');

const rules = {
  context_ip: (message) => getFirstValidValue(message, ['context.ip', 'request_ip']),
  context_request_ip: 'request_ip',
  context_passed_ip: 'context.ip',
};

module.exports = rules;
