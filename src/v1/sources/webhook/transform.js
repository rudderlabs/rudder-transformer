const { removeUndefinedAndNullValues, generateUUID } = require('../../../v0/util');

function processEvent(event) {
  const payload = {
    type: 'track',
    event: 'webhook_source_event',
    properties: event,
    anonymousId: generateUUID(),
  };
  return payload;
}

function process(inputEvent) {
  const { event } = inputEvent;
  console.log(JSON.stringify(event));
  const response = processEvent(event);
  return removeUndefinedAndNullValues(response);
}

exports.process = process;
