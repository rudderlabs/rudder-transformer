const path = require('path');
const fs = require('fs');
const md5 = require('md5');
const {
  TransformationError,
  isDefinedAndNotNullAndNotEmpty,
} = require('@rudderstack/integrations-lib');
const Message = require('../message');
const { getBodyFromV2SpecPayload, isDefinedAndNotNull } = require('../../v0/util');

// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mapping.json'), 'utf-8'));

const isNonEmptyString = (val) => typeof val === 'string' && isDefinedAndNotNullAndNotEmpty(val);

/**
 * Throws an error if required fields are not present.
 * Ref: https://support.iterable.com/hc/en-us/articles/208013936-System-Webhooks#system-webhook-request-body
 * @param {*} event
 */
function checkForRequiredFields(event) {
  if (
    (!isNonEmptyString(event.email) &&
      !isNonEmptyString(event.userId) &&
      !isNonEmptyString(event?.dataFields?.email)) ||
    !isNonEmptyString(event.eventName)
  ) {
    throw new TransformationError('Unknown event type from Iterable');
  }
}

function process(payload) {
  const event = getBodyFromV2SpecPayload(payload);
  checkForRequiredFields(event);
  const message = new Message(`Iterable`);

  // event type is always track
  const eventType = 'track';

  message.setEventType(eventType);

  message.setEventName(event.eventName);

  message.setPropertiesV2(event, mapping);

  message.context.integration.version = '1.0.0';

  if (event.dataFields?.createdAt) {
    const ts = new Date(event.dataFields.createdAt).toISOString();
    message.receivedAt = ts;
    message.timestamp = ts;
  }

  // As email is present in message.traits, removing it from properties to reduce redundancy
  delete message.properties?.email;

  // Treating userId as unique identifier
  // If userId is not present, then generating it from email using md5 hash function
  if (!isDefinedAndNotNull(message.userId)) {
    message.userId = md5(message.context.traits.email);
  }

  return message;
}

module.exports = { process };
