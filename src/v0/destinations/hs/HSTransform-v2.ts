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
} from './util';
import { JSON_MIME_TYPE } from '../../util/constant';
import type { Metadata } from '../../../types';
import type {
  HubSpotDestination,
  HubSpotPropertyMap,
  HubSpotEventInput,
  HubSpotExternalIdObject,
  HubSpotExternalIdInfo,
} from './types';

const addHsAuthentication = (
  response: Record<string, unknown>,
  Config: HubSpotDestination['Config'],
): Record<string, unknown> => {
  // choosing API Type
  if (Config.authorizationType === 'newPrivateAppApi') {
    // Private Apps
    response.headers = {
      ...(response.headers as Record<string, unknown>),
      Authorization: `Bearer ${Config.accessToken}`,
    };
  } else {
    // use legacy API Key
    response.params = { hapikey: Config.apiKey };
  }
  return response;
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
  }: { message: Record<string, unknown>; destination: HubSpotDestination; metadata: Metadata },
  propertyMap?: HubSpotPropertyMap,
): Promise<Record<string, unknown>> => {
  const { Config } = destination;
  let traits = getFieldValueFromMessage(message, 'traits');
  // since hubspot does not allow invalid emails, we need to
  // validate the email before sending it to hubspot
  if (traits?.email && !validator.isEmail(traits.email)) {
    throw new InstrumentationError(`Email "${traits.email}" is invalid`);
  }
  const mappedToDestination = get(message, MappedToDestinationKey);
  const operation = get(message, 'context.hubspotOperation');
  const externalIdObj = getDestinationExternalIDObjectForRetl(message, 'HS');
  const externalIdInfo = getDestinationExternalIDInfoForRetl(
    message,
    'HS',
  ) as HubSpotExternalIdInfo | null;
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
    const { associationTypeId, fromObjectType, toObjectType } =
      externalIdObj as HubSpotExternalIdObject;
    response.endpoint = CRM_ASSOCIATION_V3.replace(':fromObjectType', fromObjectType || '').replace(
      ':toObjectType',
      toObjectType || '',
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

    // if contactId is not provided then search
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

  if (endpoint) {
    response.endpoint = endpoint;
  }
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
}: {
  message: Record<string, unknown>;
  destination: HubSpotDestination;
}): Promise<Record<string, unknown>> => {
  const { Config } = destination;

  let payload: Record<string, unknown> =
    (constructPayload(message, mappingConfig[ConfigCategory.TRACK.name]) as Record<
      string,
      unknown
    >) || {};

  // fetch event name and its properties from config (webapp) and put it in final payload
  payload = getEventAndPropertiesFromConfig(message, destination, payload);

  // append track mapping.json along with properties fetched from webapp
  payload.properties = {
    ...(payload.properties as Record<string, unknown>),
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
  arrayChunksIdentify: HubSpotEventInput[][],
  batchedResponseList: unknown[],
  batchOperation: string,
): unknown[] => {
  // list of chunks [ [..], [..] ]
  const destinationId = arrayChunksIdentify[0][0].destination.ID;
  arrayChunksIdentify.forEach((chunk) => {
    const identifyResponseList: Record<string, unknown>[] = [];
    const metadata: Metadata[] = [];
    // add metric for batch size
    stats.gauge('hs_batch_size', chunk.length, {
      destination_id: destinationId,
    });
    // extracting message, destination value
    // from the first event in a batch
    const { message, destination } = chunk[0];

    let batchEventResponse = defaultBatchRequestConfig();

    if (batchOperation === 'createObject') {
      batchEventResponse.batchedRequest.endpoint = `${message.endpoint}/batch/create`;

      // create operation
      chunk.forEach((ev) => {
        identifyResponseList.push({
          ...(ev.message.body as Record<string, unknown>).JSON as Record<string, unknown>,
        });
        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'updateObject') {
      batchEventResponse.batchedRequest.endpoint = `${(message.endpoint as string).substr(
        0,
        (message.endpoint as string).lastIndexOf('/'),
      )}/batch/update`;
      // update operation
      chunk.forEach((ev) => {
        const updateEndpoint = ev.message.endpoint as string;
        identifyResponseList.push({
          ...(ev.message.body as Record<string, unknown>).JSON as Record<string, unknown>,
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
        const bodyJSON = (ev.message.body as Record<string, unknown>).JSON as Record<
          string,
          unknown
        >;
        const bodyProps = bodyJSON?.properties as Record<string, unknown> | undefined;
        const isDuplicate = identifyResponseList.find(
          (data) =>
            (data.properties as Record<string, unknown> | undefined)?.email === bodyProps?.email,
        );
        if (isDefinedAndNotNullAndNotEmpty(isDuplicate) && isDuplicate) {
          // array is being shallow copied hence changes are affecting the original reference
          // basically rewriting the same value to avoid duplicate entry
          isDuplicate.properties = bodyJSON.properties;
        } else {
          // appending unique events
          identifyResponseList.push({
            properties: bodyJSON.properties,
          });
        }
        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'updateContacts') {
      // update operation
      chunk.forEach((ev) => {
        // update has contactId and properties
        // extract contactId from the end of the endpoint
        const id = (ev.message.endpoint as string).split('/').pop();
        const bodyJSON = (ev.message.body as Record<string, unknown>).JSON as Record<
          string,
          unknown
        >;

        // duplicate contactId is not allowed in batch
        // updating the existing one to avoid duplicate
        // as same event can fire in batch one of the reason
        // can be due to network lag or processor being busy
        const isDuplicate = identifyResponseList.find((data) => data.id === id);
        if (isDefinedAndNotNullAndNotEmpty(isDuplicate) && isDuplicate) {
          // rewriting the same value to avoid duplicate entry
          isDuplicate.properties = bodyJSON.properties;
        } else {
          // appending unique events
          identifyResponseList.push({
            id,
            properties: bodyJSON.properties,
          });
        }
        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'createAssociations') {
      chunk.forEach((ev) => {
        batchEventResponse.batchedRequest.endpoint = ev.message.endpoint as string;
        identifyResponseList.push(
          (ev.message.body as Record<string, unknown>).JSON as Record<string, unknown>,
        );
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
    }

    batchEventResponse.batchedRequest.headers = message.headers as Record<string, unknown>;
    batchEventResponse.batchedRequest.params = message.params as Record<string, unknown>;

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

const batchEvents = (destEvents: HubSpotEventInput[]): unknown[] => {
  let batchedResponseList: unknown[] = [];
  const trackResponseList: unknown[] = [];
  // create contact chunck
  const createContactEventsChunk: HubSpotEventInput[] = [];
  // update contact chunk
  const updateContactEventsChunk: HubSpotEventInput[] = [];
  // rETL specific chunk
  const createAllObjectsEventChunk: HubSpotEventInput[] = [];
  const updateAllObjectsEventChunk: HubSpotEventInput[] = [];
  const associationObjectsEventChunk: HubSpotEventInput[] = [];
  let maxBatchSize: number = MAX_BATCH_SIZE_CRM_OBJECT;

  destEvents.forEach((event) => {
    // handler for track call
    // track call does not have batch endpoint
    const { operation, messageType, source } = event.message;
    if (messageType === 'track') {
      const { message, metadata, destination } = event;
      const endpoint = get(message, 'endpoint');

      const batchedResponse = defaultBatchRequestConfig();
      batchedResponse.batchedRequest.headers = message.headers as Record<string, unknown>;
      batchedResponse.batchedRequest.endpoint = endpoint as string;
      batchedResponse.batchedRequest.body = message.body as {
        JSON: Record<string, unknown>;
        JSON_ARRAY: Record<string, unknown>;
        XML: Record<string, unknown>;
        FORM: Record<string, unknown>;
      };
      batchedResponse.batchedRequest.params = message.params as Record<string, unknown>;
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
      maxBatchSize = (endpoint as string).includes('contact')
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
