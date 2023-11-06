const { camelCase } = require('lodash');
const moment = require('moment');
const { removeUndefinedAndNullValues, isDefinedAndNotNull } = require('../../util');
const Message = require('../message');

function process(event) {
  const message = new Message(`RevenueCat`);

  // we are setting event type as track always
  message.setEventType('track');

  const properties = {};
  // dump all event properties to message.properties after converting them to camelCase
  if (event.event) {
    Object.keys(event.event).forEach((key) => {
      properties[camelCase(key)] = event.event[key];
    });
    message.setProperty('properties', properties);
  }

  // setting up app_user_id to externalId : revenuecatAppUserId
  if (event?.event?.app_user_id) {
    message.context.externalId = [
      {
        type: 'revenuecatAppUserId',
        id: event?.event?.app_user_id,
      },
    ];
  }

  if (
    isDefinedAndNotNull(event?.event?.event_timestamp_ms) &&
    moment(event?.event?.event_timestamp_ms).isValid()
  ) {
    const validTimestamp = new Date(event.event.event_timestamp_ms).toISOString();
    message.setProperty('originalTimestamp', validTimestamp);
    message.setProperty('sentAt', validTimestamp);
  }
  message.event = event?.event?.type;
  message.messageId = event?.event?.id;

  // removing undefined and null values from message
  removeUndefinedAndNullValues(message);
  return message;
}

module.exports = { process };
