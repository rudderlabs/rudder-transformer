const { camelCase } = require('lodash');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const { removeUndefinedAndNullValues, isDefinedAndNotNull } = require('../../util');
const Message = require('../message');

// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mapping.json'), 'utf-8'));

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

  message.setPropertiesV2(event, mapping);

  // setting up app_user_id to externalId : revenuecatAppUserId
  if (event?.event?.app_user_id) {
    message.context.externalId = [
      {
        type: 'revenuecatAppUserId',
        id: event?.event?.app_user_id,
      },
    ];
  }

  if (isDefinedAndNotNull(event?.event?.event_timestamp_ms) && moment(event?.event?.event_timestamp_ms).isValid()) {
    const validTimestamp = new Date(event.event.event_timestamp_ms).toISOString();
    message.setProperty('originalTimestamp', validTimestamp);
    message.setProperty('sentAt', validTimestamp);
  }

  // removing undefined and null values from message
  removeUndefinedAndNullValues(message);
  return message;
}

module.exports = { process };
