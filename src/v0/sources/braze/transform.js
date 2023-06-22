const set = require('set-value');
const get = require('get-value');
const path = require('path');
const fs = require('fs');
const { formatTimeStamp, removeUndefinedAndNullValues } = require('../../util');
const Message = require('../message');
const { TransformationError } = require('../../util/errorTypes');

// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mapping.json'), 'utf-8'));

// if we need to map braze event name to something else. blank as of now
const eventNameMap = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './eventMapping.json'), 'utf-8'),
);

// ignored properties
// to be deleted from the field `event.properties` as already mapped
// using mapping.json
const ignoredProperties = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './ignore.json'), 'utf-8'),
);

const processEvent = (event) => {
  const messageType = 'track';

  if (event.event_type) {
    const eventType = event.event_type;
    const message = new Message(`Braze`);

    // since only email status events are supported, event type is always track
    message.setEventType(messageType);

    // set event name
    const eventName = eventNameMap[eventType] || eventType;
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

const process = (events) => {
  const responses = [];

  // Ref: Custom Currents Connector Partner Dev Documentation.pdf
  const eventList = Array.isArray(events) && events.length > 0 ? events[0].events : events.events;
  eventList.forEach((event) => {
    try {
      const resp = processEvent(event);
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
