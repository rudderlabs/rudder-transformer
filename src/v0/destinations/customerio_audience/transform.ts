import {
  ConfigurationError,
  InstrumentationError,
  isDefinedAndNotNull,
} from '@rudderstack/integrations-lib';
import { SegmentAction } from './config';
import {
  CustomerIOConnectionType,
  CustomerIODestinationType,
  CustomerIORouterRequestType,
  RespList,
} from './type';

import { batchResponseBuilder, getEventAction } from './utils';
import { handleRtTfSingleEventError, getEventType } from '../../util';
import { EventType } from '../../../constants';

interface ProcessedEvent extends RespList {
  eventAction: keyof typeof SegmentAction;
}

export const createEventChunk = (
  event: CustomerIORouterRequestType & { message: { identifiers: Record<string, any> } },
): ProcessedEvent => {
  const eventAction = getEventAction(event);

  const identifiers = event?.message?.identifiers;
  if (!isDefinedAndNotNull(identifiers) || Object.keys(identifiers).length === 0) {
    throw new ConfigurationError('[CustomerIO] Identifiers are required, aborting.');
  }

  const id = Object.values(identifiers)[0];
  if (!isDefinedAndNotNull(id)) {
    throw new ConfigurationError('[CustomerIO] Identifier is required, aborting.');
  }

  if (typeof id !== 'string' && typeof id !== 'number') {
    throw new ConfigurationError('[CustomerIO] Identifier type should be a string or integer');
  }

  return {
    payload: { ids: [id] },
    metadata: event.metadata,
    eventAction: eventAction as keyof typeof SegmentAction,
  };
};

export const validateEvent = (
  event: CustomerIORouterRequestType & { message: { identifiers: Record<string, any> } },
): boolean => {
  const eventType = getEventType(event?.message);
  if (eventType !== EventType.RECORD) {
    throw new InstrumentationError(`message type ${eventType} is not supported`);
  }

  const eventAction = getEventAction(event);
  if (!Object.values(SegmentAction).includes(eventAction)) {
    throw new InstrumentationError(`action ${eventAction} is not supported`);
  }

  const identifiers = event?.message?.identifiers;
  if (!identifiers || Object.keys(identifiers).length === 0) {
    throw new InstrumentationError(`identifiers cannot be empty`);
  }

  if (Object.keys(identifiers).length > 1) {
    throw new InstrumentationError(`only one identifier is supported`);
  }

  const id = Object.values(identifiers)[0];
  if (typeof id !== 'string' && typeof id !== 'number') {
    throw new ConfigurationError(`identifier type should be a string or integer`);
  }

  const connectionConfig = event?.connection?.config as
    | {
        destination: { audienceId: string; identifierMappings: Record<string, any> };
      }
    | undefined;
  if (!connectionConfig) {
    throw new InstrumentationError('connection config is required, aborting.');
  }

  const { audienceId, identifierMappings } = connectionConfig.destination;

  if (!audienceId) {
    throw new InstrumentationError('audienceId is required, aborting.');
  }

  if (!identifierMappings || Object.keys(identifierMappings).length === 0) {
    throw new InstrumentationError('identifierMappings cannot be empty');
  }

  return true;
};

const processRouterDest = async (inputs: CustomerIORouterRequestType[], reqMetadata: any) => {
  if (!inputs?.length) return [];

  const { destination, connection } = inputs[0];

  const customerIODestination = destination as CustomerIODestinationType;
  const customerIOConnection = connection as CustomerIOConnectionType;

  // Process events and separate valid and error cases
  const processedEvents = inputs.map((event) => {
    try {
      validateEvent(
        event as CustomerIORouterRequestType & { message: { identifiers: Record<string, any> } },
      );
      return {
        success: true,
        data: createEventChunk(
          event as CustomerIORouterRequestType & { message: { identifiers: Record<string, any> } },
        ),
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
    customerIODestination,
    customerIOConnection,
  );

  return [...batchSuccessfulRespList, ...errorEvents];
};

export { processRouterDest };
