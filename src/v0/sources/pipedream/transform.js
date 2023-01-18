const Message = require('../message');
const { generateUUID } = require('../../util');
const { callTypes } = require('./config');
const { findUserIdOrAnonymousId } = require('./util');

const buildTrackPayload = (event) => {
  const message = new Message(`PIPEDREAM`);
  message.setEventType('track');
  message.setEventName('pipedream_source_event');
  message.setProperty('properties', event);
  return message;
};

const process = (event) => {
  const id = findUserIdOrAnonymousId(event);
  if (event?.type && callTypes.includes(event.type.toLowerCase()) && id) {
    return event;
  }
  // default case
  const message = buildTrackPayload(event);
  message.anonymousId = id || generateUUID();

  return message;
};

exports.process = process;
