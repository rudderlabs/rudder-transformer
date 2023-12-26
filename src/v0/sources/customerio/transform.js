const path = require('path');
const fs = require('fs');
const moment = require('moment');
// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mapping.json'), 'utf-8'));
const { get } = require('lodash');
const Message = require('../message');

const { mappingConfig } = require('./config');
const { isDefinedAndNotNull } = require('../../util');

function process(event) {
  const message = new Message(`Customer.io`);

  // since customer, email, sms, push, slack, webhook
  // status events are supported, event type is always track
  const eventType = 'track';
  message.setEventType(eventType);

  const eventObjectType = event.object_type?.toLowerCase() || '';
  let eventName = get(mappingConfig, `${eventObjectType}.${event.metric}`);
  if (!eventName) {
    // throw new TransformationError("Metric not supported");
    eventName = 'Unknown Event';
  }
  message.setEventName(eventName);

  message.setProperties(event, mapping);

  const { timestamp } = event;
  if (isDefinedAndNotNull(timestamp) && moment(timestamp).isValid()) {
    const validTimestamp = new Date(timestamp * 1000).toISOString();
    message.setProperty('originalTimestamp', validTimestamp);
    message.setProperty('sentAt', validTimestamp);
  }

  // when customer.io does not pass an associated userId, set the email address as anonymousId
  if (
    (message.userId === null || message.userId === undefined) &&
    message.context &&
    message.context.traits &&
    message.context.traits.email
  ) {
    message.anonymousId = message.context.traits.email;
  }

  return message;
}

module.exports = { process };
