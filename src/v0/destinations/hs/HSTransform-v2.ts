import get from 'get-value';
import lodash from 'lodash';
import {
  TransformationError,
  ConfigurationError,
  InstrumentationError,
} from '@rudderstack/integrations-lib';
import validator from 'validator';
import { MappedToDestinationKey, GENERIC_TRUE_VALUES } from '../../../constants';
import {
  defaultPostRequestConfig,
  defaultRequestConfig,
  defaultPatchRequestConfig,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  defaultBatchRequestConfig,
  removeUndefinedAndNullValues,
  getDestinationExternalID,
  constructPayload,
  isDefinedAndNotNullAndNotEmpty,
  getDestinationExternalIDInfoForRetl,
  getDestinationExternalIDObjectForRetl,
  sortBatchesByMinJobId,
} from '../../util';
import stats from '../../../util/stats';
import {
  IDENTIFY_CRM_UPDATE_CONTACT,
  IDENTIFY_CRM_CREATE_NEW_CONTACT,
  MAX_BATCH_SIZE_CRM_CONTACT,
  BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT,
  BATCH_IDENTIFY_CRM_UPDATE_CONTACT,
  BATCH_IDENTIFY_CRM_UPSERT_CONTACT,
  mappingConfig,
  ConfigCategory,
  TRACK_CRM_ENDPOINT,
  CRM_CREATE_UPDATE_ALL_OBJECTS,
  MAX_BATCH_SIZE_CRM_OBJECT,
  CRM_ASSOCIATION_V3,
  RETL_CREATE_ASSOCIATION_OPERATION,
  RETL_SOURCE,
} from './config';
import {
  getTransformedJSON,
  searchContacts,
  getEventAndPropertiesFromConfig,
  getHsSearchId,
  populateTraits,
  addExternalIdToHSTraits,
  removeHubSpotSystemField,
  isUpsertEnabled,
  getUpsertLookupInfo,
  isLookupFieldUnique,
} from './util';
import { JSON_MIME_TYPE } from '../../util/constant';
import type { Metadata } from '../../../types';
import type {
  HubSpotDestination,
  HubSpotPropertyMap,
  HubSpotTrackEventRequest,
  HubSpotBatchInputItem,
  HubSpotRouterTransformationOutput,
  HubspotProcessorTransformationOutput,
  HubspotRouterRequest,
  HubSpotBatchProcessingItem,
  HubspotRudderMessage,
  HubSpotBatchRequestOutput,
} from './types';
import { hasPropertiesRecord, hasAssociationShape } from './types';

const addHsAuthentication = (
  response: HubspotProcessorTransformationOutput,
  Config: HubSpotDestination['Config'],
): HubspotProcessorTransformationOutput => {
  // choosing API Type
  if (Config.authorizationType === 'newPrivateAppApi') {
    // Private Apps
    response.headers = {
      ...response.headers,
      Authorization: `Bearer ${Config.accessToken}`,
    };
  } else {
    // use legacy API Key
    response.params = { hapikey: Config.apiKey };
  }
  return response;
};

/**
 * Process identify event for HubSpot V3 Upsert API.
 * This function builds the upsert payload that will be batched and sent to
 * /crm/v3/objects/contacts/batch/upsert endpoint.
 *
 * Ref - https://developers.hubspot.com/docs/api/crm/contacts#create-or-update-contacts-upsert
 *
 * @param {object} param0 - Object containing message, destination, and metadata
 * @param {object} propertyMap - HubSpot property map for type validation
 * @returns {object} - Response object with upsert payload
 */
const processUpsertIdentify = async (
  {
    message,
    destination,
    metadata,
  }: { message: HubspotRudderMessage; destination: HubSpotDestination; metadata: Metadata },
  propertyMap?: HubSpotPropertyMap,
) => {
  const { Config } = destination;

  // Get lookup info for upsert (id and idProperty)
  const lookupInfo = getUpsertLookupInfo(message, Config.lookupField!);
  if (!lookupInfo) {
    throw new InstrumentationError(
      `Identify:: lookupField "${Config.lookupField}" value not found in traits. Email fallback also not available.`,
    );
  }

  // Build properties payload
  let properties = await getTransformedJSON({ message, destination, metadata }, propertyMap);
  properties = removeHubSpotSystemField(properties);

  // Build upsert payload
  // Ref: https://developers.hubspot.com/docs/api/crm/contacts#create-or-update-contacts-upsert
  const upsertPayload = {
    id: lookupInfo.id,
    idProperty: lookupInfo.idProperty,
    properties,
    // objectWriteTraceId is used to correlate results in 207 multi-status responses
    objectWriteTraceId: metadata?.jobId?.toString(),
  };

  // Build response
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = BATCH_IDENTIFY_CRM_UPSERT_CONTACT;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
  };
  response.body.JSON = removeUndefinedAndNullValues(upsertPayload);
  response.operation = 'upsertContacts';

  return addHsAuthentication(response, Config);
};

/**
 * Using New API
 * Ref - https://developers.hubspot.com/docs/api/crm/contacts
 * @param {*} message
 * @param {*} destination
 * @param {*} propertyMap
 * @returns
 */
const processIdentify = async (
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
  if (traits?.email && !validator.isEmail(traits.email)) {
    throw new InstrumentationError(`Email "${traits.email}" is invalid`);
  }
  const mappedToDestination = get(message, MappedToDestinationKey);
  const operation = get(message, 'context.hubspotOperation');
  const externalIdObj = getDestinationExternalIDObjectForRetl(message, 'HS');
  const externalIdInfo = getDestinationExternalIDInfoForRetl(message, 'HS');
  const objectType = externalIdInfo?.objectType;
  // build response
  let endpoint: string | undefined;
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;

  // Handle hubspot association events sent from retl source
  if (
    objectType &&
    String(objectType).toLowerCase() === 'association' &&
    mappedToDestination &&
    GENERIC_TRUE_VALUES.includes(mappedToDestination.toString()) &&
    externalIdObj
  ) {
    const { associationTypeId, fromObjectType, toObjectType } = externalIdObj;
    response.endpoint = CRM_ASSOCIATION_V3.replace(':fromObjectType', fromObjectType).replace(
      ':toObjectType',
      toObjectType,
    );
    response.body.JSON = {
      ...traits,
      type: associationTypeId,
    };
    response.headers = {
      'Content-Type': JSON_MIME_TYPE,
    };
    response.operation = RETL_CREATE_ASSOCIATION_OPERATION;
    response.source = RETL_SOURCE;
    return addHsAuthentication(response, Config);
  }

  // if mappedToDestination is set true, then add externalId to traits
  if (
    mappedToDestination &&
    GENERIC_TRUE_VALUES.includes(mappedToDestination.toString()) &&
    operation
  ) {
    if (!objectType) {
      throw new InstrumentationError('objectType not found');
    }
    if (operation === 'createObject') {
      addExternalIdToHSTraits(message);
      endpoint = CRM_CREATE_UPDATE_ALL_OBJECTS.replace(':objectType', objectType);
    } else if (operation === 'updateObject' && getHsSearchId(message)) {
      const { hsSearchId } = getHsSearchId(message);
      endpoint = `${CRM_CREATE_UPDATE_ALL_OBJECTS.replace(
        ':objectType',
        objectType,
      )}/${hsSearchId}`;
      response.method = defaultPatchRequestConfig.requestMethod;
    }

    traits = await populateTraits(propertyMap, traits, destination, metadata);
    traits = removeHubSpotSystemField(traits);
    response.body.JSON = removeUndefinedAndNullValues({ properties: traits });
    response.source = 'rETL';
    response.operation = operation;
  } else {
    if (!Config.lookupField) {
      throw new ConfigurationError('lookupField is a required field in webapp config');
    }

    let contactId = getDestinationExternalID(message, 'hsContactId');

    // If no contactId provided and upsert is enabled and lookup field is unique, use upsert flow
    // This skips the searchContacts call and uses the batch upsert endpoint
    if (
      !contactId &&
      isUpsertEnabled(metadata?.workspaceId) &&
      (await isLookupFieldUnique(destination, Config.lookupField!, metadata))
    ) {
      return processUpsertIdentify({ message, destination, metadata }, propertyMap);
    }

    // Legacy flow: search for contact if contactId is not provided
    if (!contactId) {
      contactId = await searchContacts(message, destination, metadata);
    }

    let properties = await getTransformedJSON({ message, destination, metadata }, propertyMap);
    properties = removeHubSpotSystemField(properties);

    const payload = {
      properties,
    };

    if (contactId) {
      // contact exists
      // update
      endpoint = IDENTIFY_CRM_UPDATE_CONTACT.replace(':contactId', contactId);
      response.operation = 'updateContacts';
      response.method = defaultPatchRequestConfig.requestMethod;
    } else {
      // contact do not exist
      // create
      endpoint = IDENTIFY_CRM_CREATE_NEW_CONTACT;
      response.operation = 'createContacts';
    }
    response.body.JSON = removeUndefinedAndNullValues(payload);
  }

  response.endpoint = endpoint!;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
  };

  // choosing API Type
  if (Config.authorizationType === 'newPrivateAppApi') {
    // Private Apps
    response.headers = {
      ...response.headers,
      Authorization: `Bearer ${Config.accessToken}`,
    };
  } else {
    // use legacy API Key
    response.params = { hapikey: Config.apiKey };
  }
  return response;
};

/**
 * using New API
 * Ref - https://developers.hubspot.com/docs/api/analytics/events
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const processTrack = async ({
  message,
  destination,
}: HubspotRouterRequest): Promise<HubspotProcessorTransformationOutput> => {
  const { Config } = destination;

  let payload: HubSpotTrackEventRequest = constructPayload(
    message,
    mappingConfig[ConfigCategory.TRACK.name],
  )!;

  // fetch event name and its properties from config (webapp) and put it in final payload
  payload = getEventAndPropertiesFromConfig(message, destination, payload);

  // append track mapping.json along with properties fetched from webapp
  payload.properties = {
    ...payload.properties,
    ...constructPayload(message, mappingConfig[ConfigCategory.TRACK_PROPERTIES.name]),
  };

  // either of email or utk or objectId (Could be a 'contact id' or a 'visitor id') should be present
  if (!payload.email && !payload.utk && !payload.objectId) {
    throw new InstrumentationError(
      'Either of email, utk or objectId is required for custom behavioral events',
    );
  }

  const response = defaultRequestConfig();
  response.endpoint = TRACK_CRM_ENDPOINT;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.messageType = 'track';

  // choosing API Type
  if (Config.authorizationType === 'newPrivateAppApi') {
    // remove hubId
    // eslint-disable-next-line no-underscore-dangle
    response.headers = {
      ...response.headers,
      Authorization: `Bearer ${Config.accessToken}`,
    };
  } else {
    // using legacyApiKey
    response.endpoint = `${TRACK_CRM_ENDPOINT}?hapikey=${Config.apiKey}`;
  }

  return response;
};

const batchIdentify = (
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
      batchEventResponse.batchedRequest.endpoint = `${message.endpoint}/batch/create`;

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
      )}/batch/update`;
      // update operation
      chunk.forEach((ev) => {
        const updateEndpoint = ev.message.endpoint;
        identifyResponseList.push({
          ...ev.message.body.JSON,
          id: updateEndpoint.split('/').pop(),
        });

        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'createContacts') {
      // create operation
      chunk.forEach((ev) => {
        // duplicate email can cause issue with create in batch
        // updating the existing one to avoid duplicate
        // as same event can fire in batch one of the reason
        // can be due to network lag or processor being busy
        const bodyJSON = ev.message.body.JSON;

        if (!hasPropertiesRecord(bodyJSON)) {
          throw new TransformationError('rETL - Invalid payload for createContacts batch');
        }

        const { properties } = bodyJSON;
        const isDuplicate = identifyResponseList.find(
          (data) => (data.properties as { email?: string })?.email === properties?.email,
        );
        if (isDefinedAndNotNullAndNotEmpty(isDuplicate) && isDuplicate) {
          isDuplicate.properties = properties;
        } else {
          identifyResponseList.push({ properties });
        }
        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'updateContacts') {
      // update operation
      chunk.forEach((ev) => {
        // update has contactId and properties
        // extract contactId from the end of the endpoint
        const id = ev.message.endpoint.split('/').pop();
        const bodyJSON = ev.message.body.JSON;

        // duplicate contactId is not allowed in batch
        // updating the existing one to avoid duplicate
        // as same event can fire in batch one of the reason
        // can be due to network lag or processor being busy
        const isDuplicate = identifyResponseList.find((data) => data.id === id);
        if (hasPropertiesRecord(bodyJSON)) {
          if (isDefinedAndNotNullAndNotEmpty(isDuplicate)) {
            // rewriting the same value to avoid duplicate entry
            isDuplicate!.properties = bodyJSON.properties;
          } else {
            // appending unique events
            identifyResponseList.push({
              id,
              properties: bodyJSON.properties,
            });
          }
        }
        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'createAssociations') {
      chunk.forEach((ev) => {
        batchEventResponse.batchedRequest.endpoint = ev.message.endpoint;
        if (!hasAssociationShape(ev.message.body.JSON)) {
          throw new TransformationError('rETL - Invalid payload for createAssociations batch');
        }
        identifyResponseList.push(ev.message.body.JSON);
        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'upsertContacts') {
      // Upsert operation for V3 batch upsert endpoint
      // Each event already has the complete upsert payload structure
      // { id, idProperty, properties, objectWriteTraceId }
      chunk.forEach((ev) => {
        const bodyJSON = ev.message.body.JSON as
          | { id: string; idProperty: string; properties: Record<string, unknown>; objectWriteTraceId?: string }
          | undefined;
        if (!bodyJSON || !bodyJSON.id || !bodyJSON.idProperty || !bodyJSON.properties) {
          throw new TransformationError('rETL - Invalid payload for upsertContacts batch');
        }
        const { id, idProperty, properties, objectWriteTraceId } = bodyJSON;

        // Deduplicate by id (lookup value) - keep the latest properties
        const existing = identifyResponseList.find(
          (data) =>
            (data as Record<string, unknown>).id === id &&
            (data as Record<string, unknown>).idProperty === idProperty,
        ) as
          | { id: string; idProperty: string; properties: Record<string, unknown>; objectWriteTraceId?: string }
          | undefined;
        if (isDefinedAndNotNullAndNotEmpty(existing)) {
          // Merge latest properties with existing properties
          existing!.properties = { ...existing!.properties, ...properties };
          // Track duplicate objectWriteTraceId for monitoring
          stats.increment('hs_upsert_duplicate_trace_id', {
            destination_id: destinationId,
            original_trace_id: String(existing!.objectWriteTraceId ?? ''),
            duplicate_trace_id: String(objectWriteTraceId ?? ''),
          });
          // Update objectWriteTraceId to the latest one
          existing!.objectWriteTraceId = objectWriteTraceId;
        } else {
          // Add new entry with full upsert payload
          identifyResponseList.push(bodyJSON);
        }
        metadata.push(ev.metadata);
      });
    } else {
      throw new TransformationError('Unknown hubspot operation', 400);
    }

    batchEventResponse.batchedRequest.body.JSON = {
      inputs: identifyResponseList,
    };

    if (batchOperation === 'createContacts') {
      batchEventResponse.batchedRequest.endpoint = BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT;
    } else if (batchOperation === 'updateContacts') {
      batchEventResponse.batchedRequest.endpoint = BATCH_IDENTIFY_CRM_UPDATE_CONTACT;
    } else if (batchOperation === 'upsertContacts') {
      batchEventResponse.batchedRequest.endpoint = BATCH_IDENTIFY_CRM_UPSERT_CONTACT;
    }

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

const batchEvents = (
  destEvents: HubSpotBatchProcessingItem[],
): HubSpotRouterTransformationOutput[] => {
  let batchedResponseList: HubSpotRouterTransformationOutput[] = [];
  const trackResponseList: HubSpotRouterTransformationOutput[] = [];
  // create contact chunk
  const createContactEventsChunk: HubSpotBatchProcessingItem[] = [];
  // update contact chunk
  const updateContactEventsChunk: HubSpotBatchProcessingItem[] = [];
  // upsert contact chunk (V3 batch upsert)
  const upsertContactEventsChunk: HubSpotBatchProcessingItem[] = [];
  // rETL specific chunk
  const createAllObjectsEventChunk: HubSpotBatchProcessingItem[] = [];
  const updateAllObjectsEventChunk: HubSpotBatchProcessingItem[] = [];
  const associationObjectsEventChunk: HubSpotBatchProcessingItem[] = [];
  let maxBatchSize: number = MAX_BATCH_SIZE_CRM_OBJECT;

  destEvents.forEach((event) => {
    // handler for track call
    // track call does not have batch endpoint
    const { operation, messageType, source } = event.message;
    if (messageType === 'track') {
      const { message, metadata, destination } = event;
      const endpoint = get(message, 'endpoint');

      const batchedResponse: HubSpotBatchRequestOutput = defaultBatchRequestConfig();
      batchedResponse.batchedRequest.headers = message.headers!;
      batchedResponse.batchedRequest.endpoint = endpoint;
      batchedResponse.batchedRequest.body = message.body;
      batchedResponse.batchedRequest.params = message.params!;
      batchedResponse.batchedRequest.method = defaultPostRequestConfig.requestMethod;
      batchedResponse.metadata = [metadata];
      batchedResponse.destination = destination;

      trackResponseList.push(
        getSuccessRespEvents(
          batchedResponse.batchedRequest,
          batchedResponse.metadata,
          batchedResponse.destination,
        ),
      );
    } else if (source && source === 'rETL') {
      const { endpoint } = event.message;
      maxBatchSize = endpoint.includes('contact')
        ? MAX_BATCH_SIZE_CRM_CONTACT
        : MAX_BATCH_SIZE_CRM_OBJECT;
      if (operation) {
        if (operation === 'createObject') {
          createAllObjectsEventChunk.push(event);
        } else if (operation === 'updateObject') {
          updateAllObjectsEventChunk.push(event);
        } else if (operation === RETL_CREATE_ASSOCIATION_OPERATION) {
          // Identify: chunks for handling association events
          associationObjectsEventChunk.push(event);
        }
      } else {
        throw new TransformationError('rETL -  Error in getting operation');
      }
    } else if (operation === 'createContacts') {
      // Identify: making chunks for CRM create contact endpoint
      createContactEventsChunk.push(event);
    } else if (operation === 'updateContacts') {
      // Identify: making chunks for CRM update contact endpoint
      updateContactEventsChunk.push(event);
    } else if (operation === 'upsertContacts') {
      // Identify: making chunks for CRM upsert contact endpoint (V3 batch upsert)
      upsertContactEventsChunk.push(event);
    } else {
      throw new TransformationError('rETL - Not a valid operation');
    }
  });

  const arrayChunksIdentifyCreateObjects = lodash.chunk(createAllObjectsEventChunk, maxBatchSize);

  const arrayChunksIdentifyUpdateObjects = lodash.chunk(updateAllObjectsEventChunk, maxBatchSize);

  // eventChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
  // CRM create contact endpoint chunks
  const arrayChunksIdentifyCreateContact = lodash.chunk(
    createContactEventsChunk,
    MAX_BATCH_SIZE_CRM_CONTACT,
  );
  // CRM update contact endpoint chunks
  const arrayChunksIdentifyUpdateContact = lodash.chunk(
    updateContactEventsChunk,
    MAX_BATCH_SIZE_CRM_CONTACT,
  );

  // CRM upsert contact endpoint chunks (V3 batch upsert)
  const arrayChunksIdentifyUpsertContact = lodash.chunk(
    upsertContactEventsChunk,
    MAX_BATCH_SIZE_CRM_CONTACT,
  );

  const arrayChunksIdentifyCreateAssociations = lodash.chunk(
    associationObjectsEventChunk,
    MAX_BATCH_SIZE_CRM_OBJECT,
  );

  // batching up 'create' all objects endpoint chunks
  if (arrayChunksIdentifyCreateObjects.length > 0) {
    batchedResponseList = batchIdentify(
      arrayChunksIdentifyCreateObjects,
      batchedResponseList,
      'createObject',
    );
  }

  // batching up 'update' all objects endpoint chunks
  if (arrayChunksIdentifyUpdateObjects.length > 0) {
    batchedResponseList = batchIdentify(
      arrayChunksIdentifyUpdateObjects,
      batchedResponseList,
      'updateObject',
    );
  }

  // batching up 'create' contact endpoint chunks
  if (arrayChunksIdentifyCreateContact.length > 0) {
    batchedResponseList = batchIdentify(
      arrayChunksIdentifyCreateContact,
      batchedResponseList,
      'createContacts',
    );
  }

  // batching up 'update' contact endpoint chunks
  if (arrayChunksIdentifyUpdateContact.length > 0) {
    batchedResponseList = batchIdentify(
      arrayChunksIdentifyUpdateContact,
      batchedResponseList,
      'updateContacts',
    );
  }

  // batching up 'upsert' contact endpoint chunks (V3 batch upsert)
  if (arrayChunksIdentifyUpsertContact.length > 0) {
    batchedResponseList = batchIdentify(
      arrayChunksIdentifyUpsertContact,
      batchedResponseList,
      'upsertContacts',
    );
  }

  // batching association events
  if (arrayChunksIdentifyCreateAssociations.length > 0) {
    batchedResponseList = batchIdentify(
      arrayChunksIdentifyCreateAssociations,
      batchedResponseList,
      'createAssociations',
    );
  }

  return sortBatchesByMinJobId(batchedResponseList.concat(trackResponseList));
};

export { processIdentify, processTrack, batchEvents };
