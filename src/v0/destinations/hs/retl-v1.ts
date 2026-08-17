import get from 'get-value';
import lodash from 'lodash';
import { InstrumentationError, TransformationError } from '@rudderstack/integrations-lib';
import {
  defaultPostRequestConfig,
  defaultRequestConfig,
  defaultPatchRequestConfig,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  addExternalIdToTraits,
  defaultBatchRequestConfig,
  removeUndefinedAndNullValues,
  getDestinationExternalIDInfoForRetl,
  sortBatchesByMinJobId,
} from '../../util';
import {
  BASE_ENDPOINT,
  CRM_CREATE_UPDATE_ALL_OBJECTS_ENDPOINT_PATH,
  MAX_BATCH_SIZE_CRM_OBJECT,
  MAX_BATCH_SIZE_CRM_CONTACT,
  OBJECT_TYPE_PLACEHOLDER,
  BATCH_CREATE_PATH_SUFFIX,
  BATCH_UPDATE_PATH_SUFFIX,
} from './config';
import {
  populateTraits,
  removeHubSpotSystemField,
  getHsSearchId,
  addHsAuthentication,
  recordTransformFlow,
} from './util';
import { JSON_MIME_TYPE } from '../../util/constant';
import type { Metadata } from '../../../types';
import type {
  HubSpotPropertyMap,
  HubSpotRouterTransformationOutput,
  HubspotRouterRequest,
  HubspotProcessorTransformationOutput,
  HubSpotBatchProcessingItem,
} from './types';

/**
 * rETL (legacy API) identify handler.
 *
 * This is the reverse-ETL (mappedToDestination) branch of `processLegacyIdentify`,
 * extracted verbatim so the rETL code path is independent of the event-stream one.
 * Behaviour is preserved: if the message is not an rETL-mapped identify with a
 * resolved hubspotOperation, we defer to the existing event-stream handler.
 *
 * for rETL support for custom objects
 * Ref - https://developers.hubspot.com/docs/api/crm/crm-custom-objects
 */
const processRetlLegacyIdentify = async (
  { message, destination, metadata }: HubspotRouterRequest,
  propertyMap?: HubSpotPropertyMap,
): Promise<HubspotProcessorTransformationOutput> => {
  const { Config } = destination;
  let traits = getFieldValueFromMessage(message, 'traits');
  const operation = get(message, 'context.hubspotOperation');
  if (!operation) {
    throw new InstrumentationError('operation not found');
  }

  let endpoint: string = '';
  let endpointPath: string = '';
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;

  addExternalIdToTraits(message);
  const externalIdInfo = getDestinationExternalIDInfoForRetl(message, 'HS');
  const objectType = externalIdInfo?.objectType;
  if (!objectType) {
    throw new InstrumentationError('objectType not found');
  }
  if (operation === 'createObject') {
    endpointPath = CRM_CREATE_UPDATE_ALL_OBJECTS_ENDPOINT_PATH.replace(
      OBJECT_TYPE_PLACEHOLDER,
      objectType,
    );
    endpoint = `${BASE_ENDPOINT}${endpointPath}`;
    recordTransformFlow(destination, 'retl', 'retl', 'create');
  } else if (operation === 'updateObject' && getHsSearchId(message)) {
    const { hsSearchId } = getHsSearchId(message);
    endpointPath = CRM_CREATE_UPDATE_ALL_OBJECTS_ENDPOINT_PATH.replace(
      OBJECT_TYPE_PLACEHOLDER,
      objectType,
    );
    endpoint = `${BASE_ENDPOINT}${endpointPath}/${hsSearchId}`;
    response.method = defaultPatchRequestConfig.requestMethod;
    recordTransformFlow(destination, 'retl', 'retl', 'update');
  }

  traits = await populateTraits(propertyMap, traits, destination, metadata);
  traits = removeHubSpotSystemField(traits);
  response.body.JSON = removeUndefinedAndNullValues({ properties: traits });
  response.source = 'rETL';
  response.operation = operation;

  response.endpoint = endpoint;
  response.endpointPath = endpointPath;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
  };

  return addHsAuthentication(response, Config);
};

// Segregating create and update calls for rETL sources (legacy API).
const batchIdentifyForRetl = (
  arrayChunksIdentify: HubSpotBatchProcessingItem[][],
  batchedResponseList: HubSpotRouterTransformationOutput[],
  batchOperation: string,
): HubSpotRouterTransformationOutput[] => {
  // list of chunks [ [..], [..] ]
  arrayChunksIdentify.forEach((chunk) => {
    const identifyResponseList: Record<string, unknown>[] = [];
    const metadata: Metadata[] = [];

    // extracting message, destination value
    // from the first event in a batch
    const { message, destination } = chunk[0];

    let batchEventResponse = defaultBatchRequestConfig();

    if (batchOperation === 'createObject') {
      // create operation
      chunk.forEach((ev) => {
        identifyResponseList.push({
          ...ev.message.body.JSON,
        });
        batchEventResponse.batchedRequest.endpoint = `${ev.message.endpoint}${BATCH_CREATE_PATH_SUFFIX}`;
        batchEventResponse.batchedRequest.endpointPath = `${ev.message.endpointPath}${BATCH_CREATE_PATH_SUFFIX}`;

        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'updateObject') {
      // update operation
      chunk.forEach((ev) => {
        const updateEndpoint = ev.message.endpoint;
        identifyResponseList.push({
          ...ev.message.body.JSON,
          id: updateEndpoint.split('/').pop(),
        });
        batchEventResponse.batchedRequest.endpoint = `${updateEndpoint.substr(
          0,
          updateEndpoint.lastIndexOf('/'),
        )}${BATCH_UPDATE_PATH_SUFFIX}`;
        batchEventResponse.batchedRequest.endpointPath = `${ev.message.endpointPath}${BATCH_UPDATE_PATH_SUFFIX}`;

        metadata.push(ev.metadata);
      });
    } else {
      throw new TransformationError('rETL -  Unknow hubspot operation');
    }

    batchEventResponse.batchedRequest.body.JSON = {
      inputs: identifyResponseList,
    };

    batchEventResponse.batchedRequest.headers = message.headers!;
    batchEventResponse.batchedRequest.params = message.params!;

    batchEventResponse = {
      ...batchEventResponse,
      metadata,
      destination,
    };
    batchedResponseList.push(
      getSuccessRespEvents(
        batchEventResponse.batchedRequest,
        batchEventResponse.metadata,
        batchEventResponse.destination,
        true,
      ),
    );
  });
  return batchedResponseList;
};

/**
 * rETL (legacy API) batching. Only rETL-sourced object create/update events are
 * expected here. Any non-rETL response is deferred to the existing event-stream
 * batcher so behaviour is preserved even if the fallback above ever triggers.
 */
const batchRetlLegacyEvents = (
  destEvents: HubSpotBatchProcessingItem[],
): HubSpotRouterTransformationOutput[] => {
  let batchedResponseList: HubSpotRouterTransformationOutput[] = [];
  const createAllObjectsEventChunk: HubSpotBatchProcessingItem[] = [];
  const updateAllObjectsEventChunk: HubSpotBatchProcessingItem[] = [];
  let maxBatchSize: number | undefined;

  destEvents.forEach((event) => {
    const { endpoint } = event.message;
    maxBatchSize = endpoint.includes('contact')
      ? MAX_BATCH_SIZE_CRM_CONTACT
      : MAX_BATCH_SIZE_CRM_OBJECT;
    const { operation } = event.message;
    if (operation) {
      if (operation === 'createObject') {
        createAllObjectsEventChunk.push(event);
      } else if (operation === 'updateObject') {
        updateAllObjectsEventChunk.push(event);
      }
    } else {
      throw new TransformationError('rETL -  Error in getting operation');
    }
  });

  const arrayChunksIdentifyCreateObjects = lodash.chunk(createAllObjectsEventChunk, maxBatchSize);
  const arrayChunksIdentifyUpdateObjects = lodash.chunk(updateAllObjectsEventChunk, maxBatchSize);

  // batching up 'create' all objects endpoint chunks
  if (arrayChunksIdentifyCreateObjects.length > 0) {
    batchedResponseList = batchIdentifyForRetl(
      arrayChunksIdentifyCreateObjects,
      batchedResponseList,
      'createObject',
    );
  }

  // batching up 'update' all objects endpoint chunks
  if (arrayChunksIdentifyUpdateObjects.length > 0) {
    batchedResponseList = batchIdentifyForRetl(
      arrayChunksIdentifyUpdateObjects,
      batchedResponseList,
      'updateObject',
    );
  }

  return sortBatchesByMinJobId(batchedResponseList);
};

export { processRetlLegacyIdentify, batchRetlLegacyEvents };
