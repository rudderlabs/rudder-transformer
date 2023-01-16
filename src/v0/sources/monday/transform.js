const sha256 = require('sha256');
const Message = require('../message');
const { mapping, formEventName } = require('./util');
const { TransformationError } = require('../../util/errorTypes');
const { generateUUID, removeUndefinedAndNullValues } = require('../../util');

function processNormalEvent(mondayPayload) {
  const message = new Message(`MONDAY`);
  // we are setting event type as track always
  message.setEventType('track');
  message.setEventName(formEventName(mondayPayload.event.type));
  if (mondayPayload.event?.userId) {
    const stringifiedUserId = mondayPayload.event.userId.toString();
    message.setProperty(
      'anonymousId',
      stringifiedUserId ? sha256(stringifiedUserId).toString().substring(0, 36) : generateUUID(),
    );
    // setting the userId got from Monday into externalId
    message.context.externalId = [
      {
        type: 'mondayUserId',
        id: mondayPayload.event.userId,
      },
    ];
  } else {
    throw new TransformationError('UserId not found');
  }

  message.setPropertiesV2(mondayPayload, mapping);
  /* deleting properties already mapped in
  the payload's root */
  delete message.properties.triggerTime;
  delete message.properties.userId;
  return message;
}

// the payload for the challenge event will be as follows:
// {
//  challenge : "some_key"
// }
// this will be sent when the webhook is added to an item in monday.

function isChallengeEvent(event) {
  return !!event?.challenge;
}

// sending challenge event object back to Monday
function processChallengeEvent(event) {
  return {
    outputToSource: {
      body: Buffer.from(JSON.stringify(event)).toString('base64'),
      contentType: 'application/json',
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
