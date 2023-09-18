const Message = require('../message');
const { refinePayload } = require('../../util');
const trackMapping = require('./data/trackMapping.json');

const buildTrackPayload = (event) => {
  const message = new Message(`SATISMETER`);
  message.setEventType('track');
  message.setPropertiesV2(event, trackMapping);
  message.event = `Survey ${event.event}`;
  return message;
};

const processEvent = (event) => {
  const message = buildTrackPayload(event);
  // making sure we are returning either userId or AnonymousId
  if (!message?.userId && !message?.anonymousId) {
    message.anonymousId = event?.response.id; // fallback to response.id as response.id is always present in payload
  }
  return message;
};

const process = (event) => {
  const response = processEvent(event);
  const refinedResponse = refinePayload(response);
  return refinedResponse;
};

exports.process = process;
