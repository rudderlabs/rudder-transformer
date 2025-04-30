/**
 * Dummy destination transformation
 * This destination is used for testing common or platform changes without destination-specific concerns
 */

import { InstrumentationError, ConfigurationError } from '@rudderstack/integrations-lib';
import { EventType } from '../../../constants';
import {
  constructPayload,
  removeUndefinedAndNullValues,
  handleRtTfSingleEventError,
  getSuccessRespEvents,
} from '../../util';
import { CONFIG_CATEGORIES, MAPPING_CONFIG } from './config';
import { buildResponse } from './utils';

/**
 * Process an identify event
 * @param message - The message to process
 * @returns The processed payload
 */
function processIdentify(message: Record<string, any>) {
  const payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]);
  return removeUndefinedAndNullValues({
    type: 'identify',
    userId: message.userId || message.anonymousId,
    traits: message.traits || {},
    timestamp: message.timestamp || new Date().toISOString(),
    messageId: message.messageId,
    ...payload,
  });
}

/**
 * Process a track event
 * @param message - The message to process
 * @returns The processed payload
 */
function processTrack(message: Record<string, any>) {
  const payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name]);
  return removeUndefinedAndNullValues({
    type: 'track',
    event: message.event,
    userId: message.userId || message.anonymousId,
    properties: message.properties || {},
    timestamp: message.timestamp || new Date().toISOString(),
    messageId: message.messageId,
    ...payload,
  });
}

/**
 * Process a page event
 * @param message - The message to process
 * @returns The processed payload
 */
function processPage(message: Record<string, any>) {
  const payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.PAGE.name]);
  return removeUndefinedAndNullValues({
    type: 'page',
    name: message.name,
    userId: message.userId || message.anonymousId,
    properties: message.properties || {},
    timestamp: message.timestamp || new Date().toISOString(),
    messageId: message.messageId,
    ...payload,
  });
}

/**
 * Process a screen event
 * @param message - The message to process
 * @returns The processed payload
 */
function processScreen(message: Record<string, any>) {
  const payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.SCREEN.name]);
  return removeUndefinedAndNullValues({
    type: 'screen',
    name: message.name,
    userId: message.userId || message.anonymousId,
    properties: message.properties || {},
    timestamp: message.timestamp || new Date().toISOString(),
    messageId: message.messageId,
    ...payload,
  });
}

/**
 * Process a group event
 * @param message - The message to process
 * @returns The processed payload
 */
function processGroup(message: Record<string, any>) {
  const payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.GROUP.name]);
  return removeUndefinedAndNullValues({
    type: 'group',
    groupId: message.groupId,
    userId: message.userId || message.anonymousId,
    traits: message.traits || {},
    timestamp: message.timestamp || new Date().toISOString(),
    messageId: message.messageId,
    ...payload,
  });
}

/**
 * Process an alias event
 * @param message - The message to process
 * @returns The processed payload
 */
function processAlias(message: Record<string, any>) {
  const payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.ALIAS.name]);
  return removeUndefinedAndNullValues({
    type: 'alias',
    userId: message.userId,
    previousId: message.previousId,
    timestamp: message.timestamp || new Date().toISOString(),
    messageId: message.messageId,
    ...payload,
  });
}

/**
 * Process a single event
 * @param event - The event to process
 * @returns The processed response
 */
function process(event: Record<string, any>) {
  const { message, destination } = event;

  // Validate message type
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }

  // Validate destination config
  if (!destination.Config) {
    throw new ConfigurationError('Destination config is not present. Aborting message.');
  }

  const messageType = message.type.toLowerCase();
  let payload: Record<string, any>;

  // Process based on message type
  switch (messageType) {
    case EventType.IDENTIFY:
      payload = processIdentify(message);
      break;
    case EventType.TRACK:
      payload = processTrack(message);
      break;
    case EventType.PAGE:
      payload = processPage(message);
      break;
    case EventType.SCREEN:
      payload = processScreen(message);
      break;
    case EventType.GROUP:
      payload = processGroup(message);
      break;
    case EventType.ALIAS:
      payload = processAlias(message);
      break;
    default:
      throw new InstrumentationError(`Message type ${messageType} is not supported`);
  }

  return payload;
}

/**
 * Process router destination events
 * @param inputs - The inputs to process
 * @param reqMetadata - The request metadata
 * @returns The processed responses
 */
async function processRouterDest(inputs: Record<string, any>[], reqMetadata: Record<string, any>) {
  // Process each input and collect payloads
  const payloads: Record<string, any>[] = [];
  const failureResponses: Record<string, any>[] = [];
  const successMetadatas: Record<string, any>[] = [];
  const destination = inputs[0]?.destination;

  // Process each input
  inputs.forEach((input) => {
    try {
      // Process the event
      const payload = process(input);
      payloads.push(payload);
      successMetadatas.push(input.metadata);
    } catch (error) {
      // Handle error and store the error details
      const failureResponse = handleRtTfSingleEventError(input, error, reqMetadata);
      failureResponses.push(failureResponse);
    }
  });

  // If we have successful payloads, build a batched response
  if (payloads.length > 0) {
    // Build the response with all payloads in the events array
    const response = buildResponse({ events: payloads });

    // Create a success response with all the metadata
    const successResponse = getSuccessRespEvents(response, successMetadatas, destination);

    return [successResponse, ...failureResponses];
  }

  return failureResponses;
}

export { process, processRouterDest };
