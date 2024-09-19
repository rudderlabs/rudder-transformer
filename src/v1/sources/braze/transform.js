const set = require('set-value');
const get = require('get-value');
const path = require('path');
const fs = require('fs');
const { TransformationError } = require('@rudderstack/integrations-lib');
const {
  formatTimeStamp,
  removeUndefinedAndNullValues,
  getHashFromArray,
} = require('../../../v0/util');
const Message = require('../../../v0/sources/message');

// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mapping.json'), 'utf-8'));
// ignored properties
// to be deleted from the field `event.properties` as already mapped
// using mapping.json
const ignoredProperties = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './ignore.json'), 'utf-8'),
);

const processEvent = (event, eventMapping) => {
  const messageType = 'track';

  if (event.event_type) {
    const eventType = event.event_type;
    const message = new Message(`Braze`);

    // since only email status events are supported, event type is always track
    message.setEventType(messageType);

    // set event name
    const eventName = eventMapping[eventType] || eventType;
    message.setEventName(eventName);

    // map event properties based on mapping.json
    message.setProperties(event, mapping);

    // set timestamp for the event
    if (event.time) {
      // Braze is sending timestamp in seconds
      // Refer: https://www.braze.com/docs/user_guide/data_and_analytics/braze_currents/event_glossary/message_engagement_events
      const timestamp = parseInt(event.time, 10) * 1000;
      message.setProperty('timestamp', formatTimeStamp(timestamp, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'));
    }

    // set message properties from the event which are not ignored
    // ignored - already mapped using mapping.json
    if (event.properties) {
      Object.keys(event.properties).forEach((key) => {
        if (!ignoredProperties.includes(key)) {
          // the property is not ignored
          set(message, `properties.${key}`, get(event, `properties.${key}`));
        }
      });
    }

    // one of userId or anonymousId is required to process
    if (message.userId || message.anonymousId) {
      return message;
    }

    // wrong data
    return null;
  }
  throw new TransformationError('Unknown event type from Braze');
};

const process = (inputEvent) => {
  const { event, source } = inputEvent;
  const { customMapping } = source.Config;
  const eventMapping = getHashFromArray(customMapping, 'from', 'to', false);
  const responses = [];

  // Ref: Custom Currents Connector Partner Dev Documentation.pdf
  const eventList = Array.isArray(event) && event.length > 0 ? event[0].events : event.events;
  eventList.forEach((singleEvent) => {
    try {
      const resp = processEvent(singleEvent, eventMapping);
      if (resp) {
        responses.push(removeUndefinedAndNullValues(resp));
      }
    } catch (error) {
      // TODO: figure out a way to handle partial failures within batch
      // responses.push({
      //   statusCode: 400,
      //   error: error.message || "Unknwon error"
      // });
    }
  });
  if (responses.length === 0) {
    throw new TransformationError('All requests in the batch failed');
  } else {
    return responses;
  }
};

exports.process = process;
