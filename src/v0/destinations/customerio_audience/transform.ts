import { SegmentAction } from './config';
import { EventStructure, RespList } from './type';

const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { batchResponseBuilder, getEventAction } = require('./utils');
const { handleRtTfSingleEventError, getEventType } = require('../../util');
const { EventType } = require('../../../constants');

interface ProcessedEvent extends RespList {
  eventAction: keyof typeof SegmentAction;
}

const createEventChunk = (event: EventStructure): ProcessedEvent => {
  const eventAction = getEventAction(event);
  const { identifiers } = event?.message || {};
  const id: string | number = Object.values(identifiers)[0];

  return {
    payload: { ids: [id] },
    metadata: event.metadata,
    eventAction,
  };
};

const validateEvent = (event: EventStructure): boolean => {
  const eventType = getEventType(event?.message);
  if (eventType !== EventType.RECORD) {
    throw new InstrumentationError(`message type ${eventType} is not supported`);
  }

  const eventAction = getEventAction(event);
  if (!Object.values(SegmentAction).includes(eventAction)) {
    throw new InstrumentationError(`action ${eventAction} is not supported`);
  }

  const identifiers = event?.message?.identifiers || {};
  if (Object.entries(identifiers).length === 0) {
    throw new InstrumentationError(`identifiers cannot be empty`);
  }

  return true;
};

const processRouterDest = async (inputs: any[], reqMetadata: any) => {
  if (!inputs?.length) return [];

  const { destination, connection } = inputs[0];

  // Process events and separate valid and error cases
  const processedEvents = inputs.map((event) => {
    try {
      validateEvent(event);
      return {
        success: true,
        data: createEventChunk(event),
      };
    } catch (error) {
      return {
        success: false,
        error: handleRtTfSingleEventError(event, error, reqMetadata),
      };
    }
  });

  // Separate successful and failed events
  const successfulEvents = processedEvents
    .filter((result) => result.success)
    .map((result) => result.data as ProcessedEvent);

  const errorEvents = processedEvents
    .filter((result) => !result.success)
    .map((result) => result.error);

  // Split successful events into delete and insert/update lists
  const deleteRespList = successfulEvents
    .filter((event) => event.eventAction === SegmentAction.DELETE)
    .map(({ payload, metadata }) => ({ payload, metadata }));

  const insertOrUpdateRespList = successfulEvents
    .filter((event) => event.eventAction !== SegmentAction.DELETE)
    .map(({ payload, metadata }) => ({ payload, metadata }));

  const batchSuccessfulRespList = batchResponseBuilder(
    insertOrUpdateRespList,
    deleteRespList,
    destination,
    connection,
  );

  return [...batchSuccessfulRespList, ...errorEvents];
};

export { processRouterDest };
