const lodash = require('lodash');
const path = require('path');
const fs = require('fs');
const { TransformationError } = require('@rudderstack/integrations-lib');
const logger = require('../../../logger');
const Message = require('../message');
const { CommonUtils } = require('../../../util/common');
const { excludedFieldList } = require('./config');
const { extractCustomFields, generateUUID } = require('../../util');
const { convertToISODate } = require('./utils');

// ref : https://help.adjust.com/en/article/global-callbacks#general-recommended-placeholders
// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mapping.json'), 'utf-8'));

const formatProperties = (input) => {
  const { query_parameters: qParams } = input;
  logger.debug(`[Adjust] Input event: query_params: ${JSON.stringify(qParams)}`);
  if (!qParams) {
    throw new TransformationError('Query_parameters is missing');
  }
  const formattedOutput = {};
  Object.entries(qParams).forEach(([key, [value]]) => {
    formattedOutput[key] = value;
  });
  return formattedOutput;
};

const processEvent = (inputEvent) => {
  const message = new Message(`Adjust`);
  const event = lodash.cloneDeep(inputEvent);
  const formattedPayload = formatProperties(event);
  // event type is always track
  const eventType = 'track';
  message.setEventType(eventType);
  message.setPropertiesV2(formattedPayload, mapping);
  let customProperties = {};
  customProperties = extractCustomFields(
    formattedPayload,
    customProperties,
    'root',
    excludedFieldList,
  );
  message.properties = { ...message.properties, ...customProperties };

  if (formattedPayload.created_at) {
    const ts = convertToISODate(formattedPayload.created_at);
    message.setProperty('originalTimestamp', ts);
    message.setProperty('timestamp', ts);
  }
  // adjust does not has the concept of user but we need to set some random anonymousId in order to make the server accept the message
  message.anonymousId = generateUUID();
  return message;
};

// This fucntion just converts the incoming payload to array of already not and sends it to processEvent
const process = (events) => {
  const eventsArray = CommonUtils.toArray(events);
  return eventsArray.map(processEvent);
};

module.exports = { process };
