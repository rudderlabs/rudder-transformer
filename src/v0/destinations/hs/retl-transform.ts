import get from 'get-value';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import { EventType, MappedToDestinationKey, GENERIC_TRUE_VALUES } from '../../../constants';
import { handleRtTfSingleEventError, getDestinationExternalIDInfoForRetl } from '../../util';
import { isFeatureEnabled } from '../../../util/featureFlags';
import { API_VERSION } from './config';
import { processRetlLegacyIdentify, batchRetlLegacyEvents } from './retl-hs-transform-v1';
import { processRetlIdentify, batchRetlEvents } from './retl-hs-transform-v3';
import { splitEventsForCreateUpdate, getProperties, validateDestinationConfig } from './util';
import type {
  HubSpotPropertyMap,
  HubSpotBatchRouterResult,
  HubSpotRouterTransformationOutput,
  HubspotRouterRequest,
  HubspotProcessorTransformationOutput,
  HubspotRudderMessage,
  HubSpotBatchProcessingItem,
} from './types';

const HS_RETL_SPLIT_WORKSPACE_IDS_ENV = 'DEST_HS_RETL_SPLIT_WORKSPACE_IDS';

/**
 * The rETL/event-stream split is opt-in per workspace via the rollout flag above.
 * When the flag is unset the split is off for everyone and the existing
 * (unchanged) code path is used.
 */
const isHsRetlSplitEnabledForWorkspace = (workspaceId: string): boolean =>
  isFeatureEnabled(HS_RETL_SPLIT_WORKSPACE_IDS_ENV, workspaceId);

// An event is rETL when it is mapped-to-destination (reverse-ETL/VDM source).
const isRetlMappedEvent = (message: HubspotRudderMessage): boolean => {
  const mappedToDestination = get(message, MappedToDestinationKey);
  return (
    Boolean(mappedToDestination) && GENERIC_TRUE_VALUES.includes(mappedToDestination.toString())
  );
};

/**
 * Decides whether a single router input should be handled by the new, dedicated
 * rETL code path. True only for allow-listed workspaces AND rETL-mapped events.
 */
const shouldUseHsRetlSplitPath = (input: HubspotRouterRequest): boolean => {
  const workspaceId = input.metadata?.workspaceId;
  if (!workspaceId) {
    return false;
  }
  return isHsRetlSplitEnabledForWorkspace(workspaceId) && isRetlMappedEvent(input.message);
};

const processSingleMessageRetl = async (
  { message, destination, metadata }: HubspotRouterRequest,
  propertyMap?: HubSpotPropertyMap,
): Promise<HubspotProcessorTransformationOutput | HubspotProcessorTransformationOutput[]> => {
  if (!message.type) {
    throw new InstrumentationError('Message type is not present. Aborting message.');
  }

  // Config Validation
  validateDestinationConfig(destination);

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
  const successRespList: HubSpotBatchProcessingItem[] = [];
  const errorRespList: HubSpotRouterTransformationOutput[] = [];
  let batchedResponseList: HubSpotRouterTransformationOutput[] = [];

  try {
    // skip splitting the batches to inserts and updates if the object is an association
    if (!objectType || String(objectType).toLowerCase() !== 'association') {
      propertyMap = await getProperties(destination, metadata);
      // get info about existing objects and split accordingly.
      tempInputs = await splitEventsForCreateUpdate(tempInputs, destination, metadata);
    }
  } catch (error: unknown) {
    // Any error thrown from the above try block applies to all the events
    return {
      batchedResponseList,
      errorRespList: tempInputs.map((input) =>
        handleRtTfSingleEventError(input, error, reqMetadata),
      ),
      dontBatchEvents: [],
    };
  }

  await Promise.all(
    inputs.map(async (input) => {
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

export {
  processBatchRouterRetl,
  shouldUseHsRetlSplitPath,
  isHsRetlSplitEnabledForWorkspace,
  isRetlMappedEvent,
};
