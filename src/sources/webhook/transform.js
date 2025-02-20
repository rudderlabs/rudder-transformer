const {
  removeUndefinedAndNullValues,
  generateUUID,
  getBodyFromV2SpecPayload,
} = require('../../v0/util');

function processEvent(event) {
  const payload = {
    type: 'track',
    event: 'webhook_source_event',
    properties: event,
    anonymousId: generateUUID(),
  };
  return payload;
}

function process(payload) {
  const event = getBodyFromV2SpecPayload(payload);
  const response = processEvent(event);
  return removeUndefinedAndNullValues(response);
}

exports.process = process;
