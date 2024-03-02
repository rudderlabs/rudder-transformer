const sha256 = require('sha256');
const { TransformationError } = require('@rudderstack/integrations-lib');
const Message = require('../message');
const { mapping, tsToISODate, formEventName } = require('./util');
const { generateUUID, removeUndefinedAndNullValues } = require('../../util');
const { JSON_MIME_TYPE } = require('../../util/constant');

function processNormalEvent(slackPayload) {
  const message = new Message(`SLACK`);
  // we are setting event type as track always
  message.setEventType('track');
  message.setEventName(formEventName(slackPayload.type));
  if (slackPayload.user) {
    const stringifiedUserId =
      typeof slackPayload.user === 'string' ? slackPayload.user : slackPayload.user.id;
    message.setProperty(
      'anonymousId',
      stringifiedUserId ? sha256(stringifiedUserId).toString().substring(0, 36) : generateUUID(),
    );
    // setting the userId got from Monday into externalId
    message.context.externalId = [
      {
        type: 'slackUserId',
        id: stringifiedUserId,
      },
    ];
  } else {
    throw new TransformationError('UserId not found');
  }
  // Set the standard event property originalTimestamp
  message.setProperty('originalTimestamp', tsToISODate(slackPayload.ts || slackPayload.event_ts));
  // Map the remaining standard event properties according to mappings for the payload properties
  message.setPropertiesV2(slackPayload, mapping);
  // Copy the complete Slack payload to message.properties
  if (!message.properties) message.properties = {};
  Object.assign(message.properties, slackPayload);
  return message;
}

// the payload for the challenge event will be as follows:
// {
//  challenge : "some_key"
// }
// this will be sent when the webhook is added to an item in monday.

function isChallengeEvent(event) {
  return event?.type === 'url_verification' && !!event?.challenge;
}

// sending challenge event object back to Monday
function processChallengeEvent(event) {
  const response = { challenge: event?.challenge };
  return {
    outputToSource: {
      body: Buffer.from(JSON.stringify(response)).toString('base64'),
      contentType: JSON_MIME_TYPE,
    },
    statusCode: 200,
  };
}

// we will check here if the event is a challenge event or not
// and process accordingly.
// For challenge event the recieved challenge object is sent back
// to Monday to verify the webhook url.
// Ref: https://developer.monday.com/api-reference/docs/webhooks-1#how-to-verify-a-webhook-url
function process(event) {
  const response = isChallengeEvent(event)
    ? processChallengeEvent(event)
    : processNormalEvent(event);
  return removeUndefinedAndNullValues(response);
}

exports.process = process;
