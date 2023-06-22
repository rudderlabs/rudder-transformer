const path = require('path');
const fs = require('fs');
const { generateUUID } = require('../../util');
const Message = require('../message');

const mappingJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mapping.json'), 'utf-8'));

const { removeUndefinedAndNullValues } = require('../../util');

const { TransformationError } = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');

const processNormalEvent = (event) => {
  const message = new Message(`APPCENTER`);
  message.setEventType('track');

  if (event.build_status && event.build_status === 'Succeeded') {
    message.setEventName('Build Succeeded');
  } else if (event.build_status && event.build_status === 'Broken') {
    message.setEventName('Build Failed');
  } else if (
    event.release_id &&
    event.release_id !== '' &&
    event.short_version &&
    event.short_version !== ''
  ) {
    message.setEventName(`Released Version ${event.short_version}`);
  } else if (event.id && event.id !== '' && event.reason && event.reason !== '') {
    message.setEventName('App Crashed');
  } else {
    throw new TransformationError(`Unknown event type from Appcenter`);
  }
  const properties = { ...event };
  message.setProperty('properties', properties);

  // set fields in payload from mapping json
  message.setPropertiesV2(event, mappingJson);

  // app center does not has the concept of user but we need to set some random anonymousId in order to make the server accept the message
  message.anonymousId = generateUUID();
  return message;
};

/**
 * Test if event is Test event or not
 * @param {*} event
 * @returns
 */
const isTestEvent = (event) => !!event?.text;

const processTestEvent = (event) => ({
  outputToSource: {
    body: Buffer.from(JSON.stringify(event)).toString('base64'),
    contentType: JSON_MIME_TYPE,
  },
  statusCode: 200,
});

const process = (event) => {
  const response = isTestEvent(event) ? processTestEvent(event) : processNormalEvent(event);
  // to bypass the unit testcases ( we may change this)
  // response.anonymousId = "7e32188a4dab669f";
  return removeUndefinedAndNullValues(response);
};

exports.process = process;
