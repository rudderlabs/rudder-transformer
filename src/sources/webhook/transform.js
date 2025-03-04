const {
  removeUndefinedAndNullValues,
  generateUUID,
  getBodyFromV2SpecPayload,
} = require('../../v0/util');

function processEvent(payload) {
  const event = getBodyFromV2SpecPayload(payload);

  const request = { ...payload.request };
  delete request.body;

  const response = {
    type: 'track',
    event: 'webhook_source_event',
    properties: event,
    anonymousId: generateUUID(),
    context: {
      ...request,
    },
  };
  return response;
}

function process(payload) {
  const response = processEvent(payload);
  return removeUndefinedAndNullValues(response);
}

exports.process = process;
