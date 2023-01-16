const { removeUndefinedAndNullValues, generateUUID } = require('../../util');

function processEvent(event) {
  const payload = {
    type: 'track',
    event: 'webhook_source_event',
    properties: event,
    anonymousId: generateUUID(),
  };
  return payload;
}

function process(event) {
  const response = processEvent(event);
  return removeUndefinedAndNullValues(response);
}

exports.process = process;
