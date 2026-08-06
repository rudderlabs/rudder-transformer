import get from 'get-value';
import lodash from 'lodash';
import {
  InstrumentationError,
  ConfigurationError,
  TransformationError,
} from '@rudderstack/integrations-lib';
import {
  defaultGetRequestConfig,
  defaultPostRequestConfig,
  defaultRequestConfig,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  defaultBatchRequestConfig,
  removeUndefinedAndNullValues,
  getDestinationExternalID,
  sortBatchesByMinJobId,
} from '../../util';
import {
  BASE_ENDPOINT,
  TRACK_BASE_ENDPOINT,
  MAX_BATCH_SIZE,
  IDENTIFY_CREATE_UPDATE_CONTACT_ENDPOINT_PATH,
  IDENTIFY_CREATE_NEW_CONTACT_ENDPOINT_PATH,
  BATCH_CONTACT_ENDPOINT_PATH,
  TRACK_ENDPOINT_PATH,
} from './config';
import {
  getTransformedJSON,
  getEmailAndUpdatedProps,
  formatPropertyValueForIdentify,
  removeHubSpotSystemField,
  recordTransformFlow,
} from './util';
import { JSON_MIME_TYPE } from '../../util/constant';
import type { Metadata } from '../../../types';
import type {
  HubSpotPropertyMap,
  HubSpotLegacyTrackParams,
  HubSpotRouterTransformationOutput,
  HubspotRouterRequest,
  HubspotProcessorTransformationOutput,
  HubSpotBatchProcessingItem,
  HubSpotBatchRequestOutput,
} from './types';

/**
 * using legacy API
 * Reference:
 * https://legacydocs.hubspot.com/docs/methods/contacts/create_contact
 * https://legacydocs.hubspot.com/docs/methods/contacts/create_or_update
 *
 * for rETL support for custom objects
 * Ref - https://developers.hubspot.com/docs/api/crm/crm-custom-objects
 * @param {*} message
 * @param {*} destination
 * @param {*} propertyMap
 * @returns
 */
const processLegacyIdentify = async (
  { message, destination, metadata }: HubspotRouterRequest,
  propertyMap?: HubSpotPropertyMap,
): Promise<HubspotProcessorTransformationOutput> => {
  const { Config } = destination;
  const traits = getFieldValueFromMessage(message, 'traits');
  let endpoint: string = '';
  let endpointPath: string = '';
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  if (!traits || !traits.email) {
    throw new InstrumentationError('Identify without email is not supported.');
  }
  const { email } = traits;

  let userProperties = await getTransformedJSON({ message, destination, metadata }, propertyMap);
  userProperties = removeHubSpotSystemField(userProperties);

  const payload = {
    properties: formatPropertyValueForIdentify(userProperties),
  };

  if (email) {
    endpoint = `${BASE_ENDPOINT}${IDENTIFY_CREATE_UPDATE_CONTACT_ENDPOINT_PATH.replace(
      ':contact_email',
      email,
    )}`;
    endpointPath = IDENTIFY_CREATE_UPDATE_CONTACT_ENDPOINT_PATH;
  } else {
    endpoint = `${BASE_ENDPOINT}${IDENTIFY_CREATE_NEW_CONTACT_ENDPOINT_PATH}`;
    endpointPath = IDENTIFY_CREATE_NEW_CONTACT_ENDPOINT_PATH;
  }
  response.body.JSON = removeUndefinedAndNullValues(payload);
  recordTransformFlow(destination, 'event_stream', 'es_retl', 'upsert');

  response.endpoint = endpoint;
  response.endpointPath = endpointPath;
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
 * using legacy API
 * Ref - https://legacydocs.hubspot.com/docs/methods/enterprise_events/http_api
 * @param {*} message
 * @param {*} destination
 * @param {*} propertyMap
 * @returns
 */
const processLegacyTrack = async (
  { message, destination, metadata }: HubspotRouterRequest,
  propertyMap?: HubSpotPropertyMap,
): Promise<HubspotProcessorTransformationOutput> => {
  const { Config } = destination;

  if (!Config.hubID) {
    throw new ConfigurationError('Invalid hub id value provided in the destination configuration');
  }

  const parameters: HubSpotLegacyTrackParams = {
    _a: Config.hubID,
    _n: message.event,
    _m:
      get(message, 'properties.revenue') ||
      get(message, 'properties.value') ||
      get(message, 'properties.total'),
    id: getDestinationExternalID(message, 'hubspotId'),
  };

  const userProperties = await getTransformedJSON({ message, destination, metadata }, propertyMap);

  const payload = { ...parameters, ...userProperties };
  const params = removeUndefinedAndNullValues(payload);

  const response = defaultRequestConfig();
  response.endpoint = `${TRACK_BASE_ENDPOINT}${TRACK_ENDPOINT_PATH}`;
  response.endpointPath = TRACK_ENDPOINT_PATH;
  response.method = defaultGetRequestConfig.requestMethod;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
  };
  response.messageType = 'track';
  recordTransformFlow(destination, 'event_stream', 'es_retl', 'track');

  // choosing API Type
  if (Config.authorizationType === 'newPrivateAppApi') {
    response.headers = {
      ...response.headers,
      Authorization: `Bearer ${Config.accessToken}`,
    };
  }
  response.params = params;

  return response;
};

const legacyBatchEvents = (
  destEvents: HubSpotBatchProcessingItem[],
): HubSpotRouterTransformationOutput[] => {
  const batchedResponseList: HubSpotRouterTransformationOutput[] = [];
  const trackResponseList: HubSpotRouterTransformationOutput[] = [];
  const eventsChunk: HubSpotBatchProcessingItem[] = [];
  destEvents.forEach((event) => {
    // handler for track call
    if (event.message.messageType === 'track') {
      const { message, metadata, destination } = event;
      const endpoint = get(message, 'endpoint');

      const batchedResponse: HubSpotBatchRequestOutput = defaultBatchRequestConfig();
      batchedResponse.batchedRequest.headers = message.headers!;
      batchedResponse.batchedRequest.endpoint = endpoint;
      batchedResponse.batchedRequest.endpointPath = TRACK_ENDPOINT_PATH;
      batchedResponse.batchedRequest.body = message.body;
      batchedResponse.batchedRequest.params = message.params!;
      batchedResponse.batchedRequest.method = defaultGetRequestConfig.requestMethod;
      batchedResponse.metadata = [metadata];
      batchedResponse.destination = destination;

      trackResponseList.push(
        getSuccessRespEvents(
          batchedResponse.batchedRequest,
          batchedResponse.metadata,
          batchedResponse.destination,
        ),
      );
    } else {
      // making chunks for identify
      eventsChunk.push(event);
    }
  });
  // eventChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
  const arrayChunksIdentify = lodash.chunk(eventsChunk, MAX_BATCH_SIZE);

  // list of chunks [ [..], [..] ]
  arrayChunksIdentify.forEach((chunk) => {
    const identifyResponseList: Record<string, unknown>[] = [];
    const metadata: Metadata[] = [];

    // extracting destination, apiKey value
    // from the first event in a batch
    const { destination } = chunk[0];
    const { Config } = destination;

    let batchEventResponse = defaultBatchRequestConfig();

    chunk.forEach((ev) => {
      const bodyJSON = ev.message.body.JSON;

      if (
        !bodyJSON ||
        Array.isArray(bodyJSON) ||
        !('properties' in bodyJSON) ||
        !Array.isArray(bodyJSON.properties)
      ) {
        throw new TransformationError(
          'Legacy identify batch: invalid payload (expected object with properties array)',
        );
      }

      const { email, updatedProperties } = getEmailAndUpdatedProps(bodyJSON.properties);
      // eslint-disable-next-line no-param-reassign
      bodyJSON.properties = updatedProperties;
      identifyResponseList.push({
        email,
        properties: bodyJSON.properties,
      });
      metadata.push(ev.metadata);
      batchEventResponse.batchedRequest.body.JSON_ARRAY = {
        batch: JSON.stringify(identifyResponseList),
      };
      batchEventResponse.batchedRequest.endpoint = `${BASE_ENDPOINT}${BATCH_CONTACT_ENDPOINT_PATH}`;
      batchEventResponse.batchedRequest.endpointPath = BATCH_CONTACT_ENDPOINT_PATH;
    });

    batchEventResponse.batchedRequest.headers = {
      'Content-Type': JSON_MIME_TYPE,
    };

    // choosing API Type
    if (Config.authorizationType === 'newPrivateAppApi') {
      // Private Apps
      batchEventResponse.batchedRequest.headers = {
        ...batchEventResponse.batchedRequest.headers,
        Authorization: `Bearer ${Config.accessToken}`,
      };
    } else {
      // API Key
      batchEventResponse.batchedRequest.params = { hapikey: Config.apiKey };
    }

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

  return sortBatchesByMinJobId(batchedResponseList.concat(trackResponseList));
};

export { processLegacyIdentify, processLegacyTrack, legacyBatchEvents };
