const { removeUndefinedAndNullValues, generateUUID } = require('../../util');
const { processPixelEvent } = require('./transformPixelEvents');

function processEvent(inputEvent) {
  const { name, data, type, pixelEventLabel, query_parameters, context } = inputEvent;
  const payload = {
    type: 'track',
    event: query_parameters.topic[0],
    properties: inputEvent,
    anonymousId: generateUUID(),
  };
  return payload;
}

function process(inputEvent) {
  const { name, data, type, pixelEventLabel, query_parameters, context } = inputEvent;
  if (pixelEventLabel) {
    // this is a web pixel event fired from the browser
    const pixelEvent = processPixelEvent(inputEvent);
    return removeUndefinedAndNullValues(pixelEvent);
  }
  const response = processEvent(inputEvent);
  return removeUndefinedAndNullValues(response);
}

exports.process = process;
