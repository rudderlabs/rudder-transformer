import get from 'get-value';
import lodash from 'lodash';
import validator from 'validator';
import { TransformationError, InstrumentationError } from '@rudderstack/integrations-lib';
import {
  defaultPostRequestConfig,
  defaultRequestConfig,
  defaultPatchRequestConfig,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  defaultBatchRequestConfig,
  removeUndefinedAndNullValues,
  getDestinationExternalIDInfoForRetl,
  getDestinationExternalIDObjectForRetl,
  sortBatchesByMinJobId,
} from '../../util';
import stats from '../../../util/stats';
import {
  BASE_ENDPOINT,
  OBJECT_TYPE_PLACEHOLDER,
  MAX_BATCH_SIZE_CRM_CONTACT,
  CRM_CREATE_UPDATE_ALL_OBJECTS_ENDPOINT_PATH,
  CRM_UPSERT_ALL_OBJECTS_ENDPOINT_PATH,
  MAX_BATCH_SIZE_CRM_OBJECT,
  CRM_ASSOCIATION_V3_ENDPOINT_PATH,
  RETL_CREATE_ASSOCIATION_OPERATION,
  RETL_SOURCE,
  BATCH_CREATE_PATH_SUFFIX,
  BATCH_UPDATE_PATH_SUFFIX,
} from './config';
import {
  populateTraits,
  addExternalIdToHSTraits,
  removeHubSpotSystemField,
  getHsSearchId,
  addHsAuthentication,
  recordTransformFlow,
} from './util';
import { JSON_MIME_TYPE } from '../../util/constant';
import type { Metadata } from '../../../types';
import type {
  HubSpotDestination,
  HubSpotPropertyMap,
  HubSpotBatchInputItem,
  HubSpotRouterTransformationOutput,
  HubspotProcessorTransformationOutput,
  HubspotRudderMessage,
  HubSpotBatchProcessingItem,
  HubSpotBatchRequestOutput,
  HubSpotUpsertPayload,
} from './types';
import { hasAssociationShape, hasUpsertPayloadShape } from './types';

/**
 * rETL (new/v3 API) identify handler.
 *
 * This is the reverse-ETL (mappedToDestination) branch of `processIdentify`,
 * extracted so the rETL code path is independent of the event-stream one.
 * rETL sources only emit association or object create/update identify events;
 * anything else is rejected (no event-stream fallback).
 *
 * Ref - https://developers.hubspot.com/docs/api/crm/contacts
 */
const processRetlIdentify = async (
  {
    message,
    destination,
    metadata,
  }: { message: HubspotRudderMessage; destination: HubSpotDestination; metadata: Metadata },
  propertyMap?: HubSpotPropertyMap,
): Promise<HubspotProcessorTransformationOutput> => {
  const { Config } = destination;
  let traits: Record<string, unknown> = getFieldValueFromMessage(message, 'traits');
  // since hubspot does not allow invalid emails, we need to
  // validate the email before sending it to hubspot
  if (traits?.email && !validator.isEmail(traits.email as string)) {
    throw new InstrumentationError(`Email "${traits.email}" is invalid`);
  }
  const operation = get(message, 'context.hubspotOperation');

  const externalIdObj = getDestinationExternalIDObjectForRetl(message, 'HS');
  const externalIdInfo = getDestinationExternalIDInfoForRetl(message, 'HS');
  const objectType = externalIdInfo?.objectType;

  // build response
  let endpoint: string | undefined;
  let endpointPath: string | undefined;
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;

  // Handle hubspot association events sent from retl source
  if (objectType && String(objectType).toLowerCase() === 'association' && externalIdObj) {
    const { associationTypeId, fromObjectType, toObjectType } = externalIdObj;
    const associationEndpointPath = CRM_ASSOCIATION_V3_ENDPOINT_PATH.replace(
      ':fromObjectType',
      fromObjectType,
    ).replace(':toObjectType', toObjectType);
    response.endpoint = `${BASE_ENDPOINT}${associationEndpointPath}`;
    response.endpointPath = associationEndpointPath;
    response.body.JSON = {
      ...traits,
      type: associationTypeId,
    };
    response.headers = {
      'Content-Type': JSON_MIME_TYPE,
    };
    response.operation = RETL_CREATE_ASSOCIATION_OPERATION;
    response.source = RETL_SOURCE;
    recordTransformFlow(destination, 'retl', 'retl', 'association');
    return addHsAuthentication(response, Config);
  }

  // rETL object create/update/upsert — associations return above; objects require a resolved operation.
  if (!operation) {
    throw new InstrumentationError('operation not found');
  }
  if (!objectType) {
    throw new InstrumentationError('objectType not found');
  }

  // rETL upsert — when the identifierType is a unique property we can use the v3
  // batch upsert endpoint directly (no Search chain). This mirrors
  // `processUpsertIdentify` for contacts, mapping identifierType -> idProperty and
  // destinationExternalId -> id.
  if (operation === 'upsertObject') {
    const identifierType = externalIdInfo?.identifierType;
    const destinationExternalId = externalIdInfo?.destinationExternalId;
    if (!identifierType || !destinationExternalId) {
      throw new InstrumentationError(
        'rETL - identifierType or destinationExternalId not found for upsert',
      );
    }

    let properties = await populateTraits(propertyMap, traits, destination, metadata);
    properties = removeHubSpotSystemField(properties);

    // Ref: https://developers.hubspot.com/docs/api/crm/contacts#create-or-update-contacts-upsert
    const upsertPayload = {
      id: destinationExternalId,
      idProperty: identifierType,
      properties,
      // objectWriteTraceId is used to correlate results in 207 multi-status responses
      objectWriteTraceId: metadata?.jobId?.toString(),
    };

    // endpoint is the full v3 batch upsert endpoint; the batcher uses it as-is.
    const upsertEndpointPath = CRM_UPSERT_ALL_OBJECTS_ENDPOINT_PATH.replace(
      OBJECT_TYPE_PLACEHOLDER,
      objectType,
    );
    response.endpoint = `${BASE_ENDPOINT}${upsertEndpointPath}`;
    response.endpointPath = upsertEndpointPath;
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(upsertPayload);
    response.source = RETL_SOURCE;
    response.operation = 'upsertObject';
    response.headers = {
      'Content-Type': JSON_MIME_TYPE,
    };
    recordTransformFlow(destination, 'retl', 'retl', 'upsert');
    return addHsAuthentication(response, Config);
  }

  if (operation === 'createObject') {
    addExternalIdToHSTraits(message);
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

  response.endpoint = endpoint!;
  response.endpointPath = endpointPath;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
  };
  return addHsAuthentication(response, Config);
};

const batchIdentifyRetl = (
  arrayChunksIdentify: HubSpotBatchProcessingItem[][],
  batchedResponseList: HubSpotRouterTransformationOutput[],
  batchOperation: string,
): HubSpotRouterTransformationOutput[] => {
  // list of chunks [ [..], [..] ]
  const destinationId = arrayChunksIdentify[0][0].destination.ID;
  arrayChunksIdentify.forEach((chunk) => {
    const identifyResponseList: Array<HubSpotBatchInputItem | Record<string, unknown>> = [];
    const metadata: Metadata[] = [];
    // add metric for batch size
    stats.gauge('hs_batch_size', chunk.length, {
      destination_id: destinationId,
    });
    // extracting message, destination value
    // from the first event in a batch
    const { message, destination } = chunk[0];

    let batchEventResponse: HubSpotBatchRequestOutput = defaultBatchRequestConfig();

    if (batchOperation === 'createObject') {
      batchEventResponse.batchedRequest.endpoint = `${message.endpoint}${BATCH_CREATE_PATH_SUFFIX}`;
      batchEventResponse.batchedRequest.endpointPath = `${message.endpointPath}${BATCH_CREATE_PATH_SUFFIX}`;

      // create operation
      chunk.forEach((ev) => {
        identifyResponseList.push({
          ...ev.message.body.JSON,
        });
        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'updateObject') {
      batchEventResponse.batchedRequest.endpoint = `${message.endpoint.substr(
        0,
        message.endpoint.lastIndexOf('/'),
      )}${BATCH_UPDATE_PATH_SUFFIX}`;
      batchEventResponse.batchedRequest.endpointPath = `${message.endpointPath}${BATCH_UPDATE_PATH_SUFFIX}`;
      // update operation
      chunk.forEach((ev) => {
        const updateEndpoint = ev.message.endpoint;
        identifyResponseList.push({
          ...ev.message.body.JSON,
          id: updateEndpoint.split('/').pop(),
        });

        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'createAssociations') {
      chunk.forEach((ev) => {
        batchEventResponse.batchedRequest.endpoint = ev.message.endpoint;
        batchEventResponse.batchedRequest.endpointPath = ev.message.endpointPath;
        if (!hasAssociationShape(ev.message.body.JSON)) {
          throw new TransformationError('rETL - Invalid payload for createAssociations batch');
        }
        identifyResponseList.push(ev.message.body.JSON);
        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'upsertObject') {
      // Upsert operation for the v3 batch upsert endpoint.
      // Each event already carries the complete upsert payload structure:
      // { id, idProperty, properties, objectWriteTraceId }
      chunk.forEach((ev) => {
        const json = ev.message.body.JSON;

        if (!hasUpsertPayloadShape(json)) {
          throw new TransformationError('rETL - Invalid payload for upsertObject batch');
        }
        const { id, idProperty, properties } = json;

        // Deduplicate by id + idProperty (lookup value) - hubspot fails the batch
        // upsert request if the same id appears more than once.
        const existing = identifyResponseList.find(
          (data): data is HubSpotUpsertPayload =>
            hasUpsertPayloadShape(data) && data.id === id && data.idProperty === idProperty,
        );
        if (existing) {
          // Merge latest properties with existing properties
          existing.properties = { ...existing.properties, ...properties };
          // Track duplicate objectWriteTraceId for monitoring
          stats.increment('hs_upsert_duplicate_trace_id', {
            destination_id: destinationId,
          });
        } else {
          identifyResponseList.push(json);
        }
        metadata.push(ev.metadata);
      });
      batchEventResponse.batchedRequest.endpoint = chunk[0].message.endpoint;
      batchEventResponse.batchedRequest.endpointPath = chunk[0].message.endpointPath;
    } else {
      throw new TransformationError('Unknown hubspot operation', 400);
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
 * rETL (new/v3 API) batching. Only rETL-sourced object create/update and
 * association events are expected here. Any non-rETL response is deferred to the
 * existing event-stream batcher so behaviour is preserved.
 */
const batchRetlEvents = (
  destEvents: HubSpotBatchProcessingItem[],
): HubSpotRouterTransformationOutput[] => {
  let batchedResponseList: HubSpotRouterTransformationOutput[] = [];
  // rETL specific chunk
  const createAllObjectsEventChunk: HubSpotBatchProcessingItem[] = [];
  const updateAllObjectsEventChunk: HubSpotBatchProcessingItem[] = [];
  const upsertAllObjectsEventChunk: HubSpotBatchProcessingItem[] = [];
  const associationObjectsEventChunk: HubSpotBatchProcessingItem[] = [];
  let maxBatchSize: number = MAX_BATCH_SIZE_CRM_OBJECT;

  destEvents.forEach((event) => {
    const { operation } = event.message;
    const { endpoint } = event.message;
    maxBatchSize = endpoint.includes('contact')
      ? MAX_BATCH_SIZE_CRM_CONTACT
      : MAX_BATCH_SIZE_CRM_OBJECT;
    if (operation) {
      if (operation === 'createObject') {
        createAllObjectsEventChunk.push(event);
      } else if (operation === 'updateObject') {
        updateAllObjectsEventChunk.push(event);
      } else if (operation === 'upsertObject') {
        // Identify: chunks for handling upsert (v3 batch upsert) events
        upsertAllObjectsEventChunk.push(event);
      } else if (operation === RETL_CREATE_ASSOCIATION_OPERATION) {
        // Identify: chunks for handling association events
        associationObjectsEventChunk.push(event);
      }
    } else {
      throw new TransformationError('rETL -  Error in getting operation');
    }
  });

  const arrayChunksIdentifyCreateObjects = lodash.chunk(createAllObjectsEventChunk, maxBatchSize);
  const arrayChunksIdentifyUpdateObjects = lodash.chunk(updateAllObjectsEventChunk, maxBatchSize);
  const arrayChunksIdentifyUpsertObjects = lodash.chunk(upsertAllObjectsEventChunk, maxBatchSize);
  const arrayChunksIdentifyCreateAssociations = lodash.chunk(
    associationObjectsEventChunk,
    MAX_BATCH_SIZE_CRM_OBJECT,
  );

  // batching up 'create' all objects endpoint chunks
  if (arrayChunksIdentifyCreateObjects.length > 0) {
    batchedResponseList = batchIdentifyRetl(
      arrayChunksIdentifyCreateObjects,
      batchedResponseList,
      'createObject',
    );
  }

  // batching up 'update' all objects endpoint chunks
  if (arrayChunksIdentifyUpdateObjects.length > 0) {
    batchedResponseList = batchIdentifyRetl(
      arrayChunksIdentifyUpdateObjects,
      batchedResponseList,
      'updateObject',
    );
  }

  // batching up 'upsert' all objects endpoint chunks (v3 batch upsert)
  if (arrayChunksIdentifyUpsertObjects.length > 0) {
    batchedResponseList = batchIdentifyRetl(
      arrayChunksIdentifyUpsertObjects,
      batchedResponseList,
      'upsertObject',
    );
  }

  // batching association events
  if (arrayChunksIdentifyCreateAssociations.length > 0) {
    batchedResponseList = batchIdentifyRetl(
      arrayChunksIdentifyCreateAssociations,
      batchedResponseList,
      'createAssociations',
    );
  }

  return sortBatchesByMinJobId(batchedResponseList);
};

export { processRetlIdentify, batchRetlEvents };
