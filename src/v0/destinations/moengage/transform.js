const btoa = require('btoa');
const {
  ConfigurationError,
  TransformationError,
  InstrumentationError,
  isObject,
  isEmptyObject,
} = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  endpointEU,
  endpointIND,
  endpointUS,
} = require('./config');
const {
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  flattenJson,
  simpleProcessRouterDest,
  isAppleFamily,
} = require('../../util');
const { JSON_MIME_TYPE } = require('../../util/constant');

// moengage supports object type, if user enables object data type we merge the custom attributes
// ref: https://help.moengage.com/hc/en-us/articles/29787626775828-Support-for-Object-Data-Type
const mergeCustomAttributes = (attributes) => {
  if (!attributes.data) {
    return attributes;
  }
  const { data, ...rest } = attributes;
  return isObject(data) ? { ...rest, ...data } : rest;
};

// check the region and which api end point should be used
const getCommonDestinationEndpoint = ({ apiId, region, category }) => {
  switch (region) {
    case 'EU':
      return `${endpointEU[category.type]}${apiId}`;
    case 'US':
      return `${endpointUS[category.type]}${apiId}`;
    case 'IND':
      return `${endpointIND[category.type]}${apiId}`;
    default:
      throw new ConfigurationError('The region is not valid');
  }
};

const createDestinationPayload = ({ message, category, useObjectData }) => {
  const payload = {};
  const setPayloadAttributes = (configCategory) => {
    payload.attributes = constructPayload(message, MAPPING_CONFIG[configCategory]);
    payload.attributes = useObjectData
      ? mergeCustomAttributes(payload.attributes)
      : flattenJson(payload.attributes);
  };

  switch (category.type) {
    case 'identify':
      // Track User
      payload.type = 'customer';
      setPayloadAttributes(
        useObjectData
          ? CONFIG_CATEGORIES.IDENTIFY_ATTR_OBJ.name
          : CONFIG_CATEGORIES.IDENTIFY_ATTR.name,
      );
      return payload;
    case 'device':
      // Track Device
      payload.type = 'device';
      setPayloadAttributes(
        useObjectData ? CONFIG_CATEGORIES.DEVICE_ATTR_OBJ.name : CONFIG_CATEGORIES.DEVICE_ATTR.name,
      );

      if (isAppleFamily(payload.attributes?.platform)) {
        payload.attributes.platform = 'iOS';
      }
      return payload;
    case 'track':
      // Create Event
      payload.type = 'event';
      payload.actions = [
        constructPayload(
          message,
          useObjectData
            ? MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_ATTR_OBJ.name]
            : MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_ATTR.name],
        ),
      ];

      if (isAppleFamily(payload.actions[0]?.platform)) {
        payload.actions[0].platform = 'iOS';
      }
      return payload;
    default:
      throw new InstrumentationError(`Event type ${category.type} is not supported`);
  }
};

function responseBuilderSimple(message, category, destination) {
  // preparing base payload with mandatory fields
  const basePayload = constructPayload(message, MAPPING_CONFIG[category.name]);
  if (!basePayload) {
    // fail-safety for developer error
    throw new TransformationError('Base payload could not be constructed');
  }

  const { apiId, region, apiKey, useObjectData } = destination.Config;
  const response = defaultRequestConfig();
  response.endpoint = getCommonDestinationEndpoint({ apiId, region, category });
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    'MOE-APPKEY': apiId,
    // Basic Authentication encodes a 'username:password'
    // using base64 and prepends it with the string 'Basic '.
    Authorization: `Basic ${btoa(`${apiId}:${apiKey}`)}`,
  };
  response.userId = message.userId || message.anonymousId;

  if (category.type === 'alias') {
    delete response.headers['MOE-APPKEY'];
    response.body.JSON = removeUndefinedAndNullValues(basePayload);
    return response;
  }

  const payload = createDestinationPayload({ message, category, useObjectData });
  if (isEmptyObject(payload)) {
    throw new TransformationError('Payload could not be constructed');
  }
  response.body.JSON = removeUndefinedAndNullValues({ ...basePayload, ...payload });
  return response;
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const messageType = message.type.toLowerCase();
  let category;
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      response = responseBuilderSimple(message, category, destination);
      // only if device information is present device info will be added/updated
      // with an identify call otherwise only user info will be added/updated
      if (message?.context?.device?.type && message?.context?.device?.token) {
        // build the response
        response = [
          // user api payload (output for identify)
          response,
          // device api payload
          responseBuilderSimple(message, CONFIG_CATEGORIES.DEVICE, destination),
        ];
      }
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      // build the response
      response = responseBuilderSimple(message, category, destination);
      break;
    case EventType.ALIAS:
      category = CONFIG_CATEGORIES.ALIAS;
      // build the response
      response = responseBuilderSimple(message, category, destination);
      break;
    default:
      throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }

  return response;
};

const process = (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = {
  process,
  processRouterDest,
  mergeCustomAttributes,
  getCommonDestinationEndpoint,
};
