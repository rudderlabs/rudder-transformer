const sha256 = require('sha256');
const { TransformationError } = require('@rudderstack/integrations-lib');
const Message = require('../message');
const { mapping, tsToISODate, normalizeEventName } = require('./util');
const { generateUUID, removeUndefinedAndNullValues } = require('../../util');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { EventType } = require('../../../constants');

/**
 * Transform event data to RudderStack supported standard event schema
 * @param {Object} slackPayload - The complete data received on the webhook from Slack
 * @param {Object} slackPayload.event - The data object specific to the Slack event received. Has different schema for different event types.
 * @returns {Object} Event data transformed to RudderStack supported standard event schema
 */
function processNormalEvent(slackPayload) {
  const message = new Message(`SLACK`);
  if (!slackPayload?.event) {
    throw new TransformationError('Missing the required event data');
  }
  switch (slackPayload.event.type) {
    case 'team_join':
      message.setEventType(EventType.IDENTIFY);
      break;
    case 'user_change':
      message.setEventType(EventType.IDENTIFY);
      break;
    default:
      message.setEventType(EventType.TRACK);
      break;
  }
  message.setEventName(normalizeEventName(slackPayload.event.type));
  if (!slackPayload.event.user) {
    throw new TransformationError('UserId not found');
  }
  const stringifiedUserId =
    typeof slackPayload.event.user === 'object'
      ? slackPayload.event.user.id
      : slackPayload.event.user;
  message.setProperty(
    'anonymousId',
    stringifiedUserId ? sha256(stringifiedUserId).toString().substring(0, 36) : generateUUID(),
  );
  // Set the user id received from Slack into externalId
  message.context.externalId = [
    {
      type: 'slackUserId',
      id: stringifiedUserId,
    },
  ];
  // Set the standard common event fields. More info at https://www.rudderstack.com/docs/event-spec/standard-events/common-fields/
  // originalTimestamp - The actual time (in UTC) when the event occurred
  message.setProperty(
    'originalTimestamp',
    tsToISODate(slackPayload.event.ts || slackPayload.event.event_ts || slackPayload.event_time),
  );
  // sentAt - Time, client-side, when the event was sent from the client to RudderStack
  message.setProperty('sentAt', tsToISODate(slackPayload.event_time));
  // Map the remaining standard event properties according to mappings for the payload properties
  message.setPropertiesV2(slackPayload, mapping);
  // Copy the complete Slack event payload to message.properties
  if (!message.properties) message.properties = {};
  Object.assign(message.properties, slackPayload.event);
  return message;
}

/**
 * Handles a special event for webhook url verification.
 * Responds back with the challenge key received in the request.
 * Reference - https://api.slack.com/apis/connections/events-api#subscribing
 * @param {Object} event - Event data received from Slack
 * @param {string} event.challenge - The challenge key received in the request
 * @returns response that needs to be sent back to the source, alongwith the same challenge key received int the request
 */
function processUrlVerificationEvent(event) {
  const response = { challenge: event?.challenge };
  return {
    outputToSource: {
      body: Buffer.from(JSON.stringify(response)).toString('base64'),
      contentType: JSON_MIME_TYPE,
    },
    statusCode: 200,
  };
}

/**
 * Checks if the event is a special url verification event or not.
 * Slack sends this event at the time of webhook setup to verify webhook url ownership for the security purpose.
 * Reference - https://api.slack.com/apis/connections/events-api#subscribing
 * @param {Object} event - Event data received from Slack
 * @param {string} event.challenge - The challenge key received in the request
 * @param {string} event.type - The type of Slack event. `url_verification` when it is a special webhook url verification event.
 * @returns {boolean} true if it is a valid challenge event for url verification event
 */
function isWebhookUrlVerificationEvent(event) {
  return event?.type === 'url_verification' && !!event?.challenge;
}

/**
 * Processes the event with needed transformation and sends back the response
 * Reference - https://api.slack.com/apis/connections/events-api
 * @param {Object} event
 */
function process(event) {
  const response = isWebhookUrlVerificationEvent(event)
    ? processUrlVerificationEvent(event)
    : processNormalEvent(event);
  return removeUndefinedAndNullValues(response);
}

exports.process = process;
