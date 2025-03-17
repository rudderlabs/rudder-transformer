const {
  removeUndefinedAndNullValues,
  generateUUID,
  getBodyFromV2SpecPayload,
} = require('../../v0/util');

function processEvent(payload) {
  const event = getBodyFromV2SpecPayload(payload);

  const putRequestDetailsInContext = Boolean(payload.source.Config?.putRequestDetailsInContext);

  const request = { ...payload.request };

  const response = {
    type: 'track',
    event: 'webhook_source_event',
    properties: event,
    anonymousId: generateUUID(),
  };

  if (putRequestDetailsInContext) {
    delete request.body;
    response.context = {
      ...response.context,
      ...request,
    };
  }

  return response;
}

function process(payload) {
  const response = processEvent(payload);
  return removeUndefinedAndNullValues(response);
}

exports.process = process;
