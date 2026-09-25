import get from 'get-value';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import { EventType, MappedToDestinationKey, GENERIC_TRUE_VALUES } from '../../../constants';
import { handleRtTfSingleEventError, getDestinationExternalIDInfoForRetl } from '../../util';
import { API_VERSION, HS_RECORD_ID_PROPERTY, HS_RECORD_ID_REGEX } from './config';
import { processRetlLegacyIdentify, batchRetlLegacyEvents } from './retl-v1';
import { processRetlIdentify, batchRetlEvents } from './retl-v3';
import {
  splitEventsForCreateUpdate,
  setHsSearchId,
  getProperties,
  validateDestinationConfig,
  isLookupFieldUnique,
} from './util';
import type {
  HubSpotPropertyMap,
  HubSpotBatchRouterResult,
  HubSpotRouterTransformationOutput,
  HubspotRouterRequest,
  HubspotProcessorTransformationOutput,
  HubspotRudderMessage,
  HubSpotBatchProcessingItem,
} from './types';

// An event is rETL when it is mapped-to-destination (reverse-ETL/VDM source).
const isRetlMappedEvent = (message: HubspotRudderMessage): boolean => {
  const mappedToDestination = get(message, MappedToDestinationKey);
  return (
    Boolean(mappedToDestination) && GENERIC_TRUE_VALUES.includes(mappedToDestination.toString())
  );
};

/**
 * Decides whether a single router input should be handled by the dedicated rETL
 * code path. True for rETL-mapped (reverse-ETL/VDM) events.
 */
const shouldUseHsRetlSplitPath = (input: HubspotRouterRequest): boolean =>
  isRetlMappedEvent(input.message);

const processSingleMessageRetl = async (
  { message, destination, metadata }: HubspotRouterRequest,
  propertyMap?: HubSpotPropertyMap,
): Promise<HubspotProcessorTransformationOutput | HubspotProcessorTransformationOutput[]> => {
  if (!message.type) {
    throw new InstrumentationError('Message type is not present. Aborting message.');
  }

  // rETL sources only emit identify (object/association) events.
  if (message.type !== EventType.IDENTIFY) {
    throw new InstrumentationError(`Message type ${message.type} is not supported`);
  }
  if (destination.Config.apiVersion === API_VERSION.v3) {
    return [await processRetlIdentify({ message, destination, metadata }, propertyMap)];
  }
  // Legacy API
  return [await processRetlLegacyIdentify({ message, destination, metadata }, propertyMap)];
};

const processBatchRouterRetl = async (
  inputs: HubspotRouterRequest[],
  reqMetadata: NonNullable<unknown>,
): Promise<HubSpotBatchRouterResult> => {
  let tempInputs = inputs;
  // using the first destination config for transforming the batch
  const { destination, metadata } = tempInputs[0];
  let propertyMap: HubSpotPropertyMap | undefined;
  const externalIdInfo = getDestinationExternalIDInfoForRetl(tempInputs[0].message, 'HS');
  const objectType = externalIdInfo?.objectType;
  const identifierType = externalIdInfo?.identifierType;
  const successRespList: HubSpotBatchProcessingItem[] = [];
  const errorRespList: HubSpotRouterTransformationOutput[] = [];
  let batchedResponseList: HubSpotRouterTransformationOutput[] = [];

  try {
    validateDestinationConfig(destination);
    // skip splitting the batches to inserts and updates if the object is an association
    if (!objectType || String(objectType).toLowerCase() !== 'association') {
      // hs_object_id is hubspot's own record id, so records are addressed directly: no Search,
      // and no upsert either, since a record id only ever updates an existing record, never
      // creates one. Both the v3 and legacy rETL handlers send updateObject to crm/v3 batch/update.
      const isRecordIdLookup = identifierType === HS_RECORD_ID_PROPERTY;

      if (isRecordIdLookup) {
        // The record id is the warehouse value of the mapped identifier column. rETL only drops
        // rows whose primary key is null or duplicated, so when the primary key is another column
        // this value can be empty or malformed. Such a row can't be updated and would put a bad id
        // into the shared batch/update request, so fail it here, before any hubspot call, with a
        // non-retryable error. Tag the rest for a direct update.
        tempInputs = tempInputs.filter((input) => {
          const recordId = String(
            getDestinationExternalIDInfoForRetl(input.message, 'HS')?.destinationExternalId ?? '',
          );
          if (!HS_RECORD_ID_REGEX.test(recordId)) {
            const reason = recordId
              ? `rETL - invalid HubSpot record id "${recordId}"`
              : 'rETL - HubSpot record id (hs_object_id) is empty';
            errorRespList.push(
              handleRtTfSingleEventError(input, new InstrumentationError(reason), reqMetadata),
            );
            return false;
          }
          const taggedInput = input;
          taggedInput.message.context = {
            ...input.message.context,
            externalId: setHsSearchId(input, recordId),
            hubspotOperation: 'updateObject',
          };
          return true;
        });
        if (tempInputs.length === 0) {
          return { batchedResponseList, errorRespList, dontBatchEvents: [] };
        }
      }

      propertyMap = await getProperties(destination, metadata);

      // Upsert is only implemented for the v3 endpoint (retl-v3); the
      // legacy (v1) handler has no upsert branch, so never tag v1 events for upsert.
      // When apiVersion is v3 AND the identifierType is a unique property for this
      // objectType we use the v3 batch upsert endpoint directly: tag every event for
      // upsert and skip `splitEventsForCreateUpdate` (and its Search chain).
      // Otherwise, unchanged.
      const canUpsert =
        !isRecordIdLookup &&
        destination.Config.apiVersion === API_VERSION.v3 &&
        objectType &&
        identifierType &&
        (await isLookupFieldUnique(destination, identifierType, metadata, objectType));

      if (canUpsert) {
        tempInputs = tempInputs.map((input) => {
          const taggedInput = input;
          taggedInput.message.context = {
            ...input.message.context,
            hubspotOperation: 'upsertObject',
          };
          return taggedInput;
        });
      } else if (!isRecordIdLookup) {
        // get info about existing objects and split accordingly.
        // (record id events were already tagged for update above)
        tempInputs = await splitEventsForCreateUpdate(tempInputs, destination, metadata);
      }
    }
  } catch (error: unknown) {
    // Any error thrown from the above try block applies to all the events
    return {
      batchedResponseList,
      errorRespList: [
        ...errorRespList,
        ...tempInputs.map((input) => handleRtTfSingleEventError(input, error, reqMetadata)),
      ],
      dontBatchEvents: [],
    };
  }

  await Promise.all(
    tempInputs.map(async (input) => {
      try {
        let receivedResponse = await processSingleMessageRetl(
          { message: input.message, destination, metadata: input.metadata },
          propertyMap,
        );

        receivedResponse = Array.isArray(receivedResponse) ? receivedResponse : [receivedResponse];

        // received response can be in array format [{}, {}, {}, ..., {}]
        // if multiple response is being returned
        receivedResponse.forEach((element) => {
          successRespList.push({
            message: element,
            metadata: input.metadata,
            destination,
          });
        });
      } catch (error: unknown) {
        const errRespEvent = handleRtTfSingleEventError(input, error, reqMetadata);
        errorRespList.push(errRespEvent);
      }
    }),
  );

  const dontBatchTrueResponses: HubSpotBatchProcessingItem[] = [];
  const dontBatchFalseOrUndefinedResponses: HubSpotBatchProcessingItem[] = [];
  // segregating successRespList depending on dontBatch value
  successRespList.forEach((successResp) => {
    if (successResp.metadata?.dontBatch) {
      dontBatchTrueResponses.push(successResp);
    } else {
      dontBatchFalseOrUndefinedResponses.push(successResp);
    }
  });

  const isV3 = destination.Config.apiVersion === API_VERSION.v3;

  // batch implementation
  if (dontBatchFalseOrUndefinedResponses.length > 0) {
    batchedResponseList = isV3
      ? batchRetlEvents(dontBatchFalseOrUndefinedResponses)
      : batchRetlLegacyEvents(dontBatchFalseOrUndefinedResponses);
  }

  // For dontBatch=true events, route them through the same batching logic
  // as individual single-event batches.
  let dontBatchEvents: HubSpotRouterTransformationOutput[] = [];
  if (dontBatchTrueResponses.length > 0) {
    dontBatchEvents = isV3
      ? dontBatchTrueResponses.flatMap((event) => batchRetlEvents([event]))
      : dontBatchTrueResponses.flatMap((event) => batchRetlLegacyEvents([event]));
  }

  return {
    batchedResponseList,
    errorRespList,
    dontBatchEvents,
  };
};

export { processBatchRouterRetl, shouldUseHsRetlSplitPath, isRetlMappedEvent };
