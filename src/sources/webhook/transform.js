const { flattenQueryParams: flattenMapWithArrayValues } = require('@rudderstack/integrations-lib');
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
    response.context = {
      method: request.method,
      url: request.url,
      proto: request.proto,
      headers: request.headers && flattenMapWithArrayValues(request.headers),
      query_parameters:
        request.query_parameters && flattenMapWithArrayValues(request.query_parameters),
    };
  }

  return response;
}

function process(payload) {
  const response = processEvent(payload);
  return removeUndefinedAndNullValues(response);
}

exports.process = process;
