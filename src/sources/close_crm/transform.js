const moment = require('moment');
const {
  removeUndefinedAndNullValues,
  removeUndefinedAndNullRecurse,
  generateUUID,
  formatTimeStamp,
  getBodyFromV2SpecPayload,
} = require('../../v0/util');
const { excludedFieldList } = require('./config');
const Message = require('../message');

function processEvent(inputEvent) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { event, subscription_id } = inputEvent;

  const message = new Message('CloseCRM');

  // Set event type track
  message.setEventType('track');

  // Set event name
  const eventName = `${event.object_type} ${event.action}`;
  message.setEventName(eventName);

  // Set userId
  if (event.lead_id) {
    message.setProperty('userId', event.lead_id);
  } else {
    message.setProperty('anonymousId', generateUUID());
  }

  // Set messageId
  message.setProperty('messageId', event.id);

  // Set Timestamp
  const timestamp = moment.utc(event.date_updated);
  message.setProperty('originalTimestamp', formatTimeStamp(timestamp, 'yyyy-MM-ddTHH:mm:ss.SSSZ'));

  // Set properties
  removeUndefinedAndNullRecurse(event);
  message.setProperty('properties', event);
  message.setProperty('properties.subscription_id', subscription_id);

  // Remove excluding fields
  excludedFieldList.forEach((field) => {
    delete message.properties[field];
  });

  return message;
}

function process(payload) {
  const event = getBodyFromV2SpecPayload(payload);
  const response = processEvent(event);
  return removeUndefinedAndNullValues(response);
}

exports.process = process;
