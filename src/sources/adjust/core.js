const path = require('path');
const fs = require('fs');
const Message = require('../message');
const { excludedFieldList } = require('./config');
const { extractCustomFields, generateUUID } = require('../../v0/util');
const { convertToISODate } = require('./utils');

// ref : https://help.adjust.com/en/article/global-callbacks#general-recommended-placeholders
// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mapping.json'), 'utf-8'));

const processPayload = (payload) => {
  const message = new Message(`Adjust`);

  // event type is always track
  const eventType = 'track';
  message.setEventType(eventType);
  message.setPropertiesV2(payload, mapping);
  let customProperties = {};

  // to remove writeKey from custom properties we can add it to excludedFieldList
  excludedFieldList.push('writeKey');

  customProperties = extractCustomFields(payload, customProperties, 'root', excludedFieldList);

  message.properties = { ...message.properties, ...customProperties };

  if (payload.created_at) {
    const ts = convertToISODate(payload.created_at);
    message.setProperty('originalTimestamp', ts);
    message.setProperty('timestamp', ts);
  }
  // adjust does not has the concept of user but we need to set some random anonymousId in order to make the server accept the message
  message.anonymousId = generateUUID();
  return message;
};

module.exports = { processPayload };
