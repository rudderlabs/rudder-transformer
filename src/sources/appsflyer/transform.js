const path = require('path');
const fs = require('fs');
const { TransformationError } = require('@rudderstack/integrations-lib');
const Message = require('../message');
const {
  generateUUID,
  getBodyFromV2SpecPayload,
  removeUndefinedAndNullValues,
  isObject,
} = require('../../v0/util');
const { getAdvertisingId } = require('./utils');

const mappingJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mapping.json'), 'utf-8'));

const TRACK_MESSAGE_TYPE = 'track';

function createBaseMessage(eventName) {
  const message = new Message(`AF`);
  message.setEventType(TRACK_MESSAGE_TYPE);
  message.setEventName(eventName);
  return message;
}

function processEvent(event) {
  if (!event.event_name) {
    throw new TransformationError('Unknwon event type from Appsflyer');
  }

  const message = createBaseMessage(event.event_name);

  const properties = { ...event };
  message.setProperty('properties', properties);

  // set fields in payload from mapping json
  message.setProperties(event, mappingJson);

  const mappedPropertiesKeys = Object.keys(mappingJson);

  if (!isObject(message.context.device)) {
    message.context.device = {};
  }

  if (event.platform) {
    const advertisingId = getAdvertisingId(event);
    if (advertisingId) {
      message.context.device.advertisingId = advertisingId;
      message.context.device.adTrackingEnabled = true;
    }
    mappedPropertiesKeys.push('idfa', 'android_id');
  }

  if (event.appsflyer_id) {
    message.context.externalId = [
      {
        type: 'appsflyerExternalId',
        value: event.appsflyer_id,
      },
    ];
    mappedPropertiesKeys.push('appsflyer_id');
  }
  message.setProperty('anonymousId', generateUUID());

  // Remove the fields from properties that are already mapped to other fields.
  mappedPropertiesKeys.forEach((key) => {
    if (message.properties && message.properties[key] !== undefined) {
      delete message.properties[key];
    }
  });

  return message;
}

function process(payload) {
  const event = getBodyFromV2SpecPayload(payload);
  const response = processEvent(event);
  const returnValue = removeUndefinedAndNullValues(response);
  return returnValue;
}

exports.process = process;
