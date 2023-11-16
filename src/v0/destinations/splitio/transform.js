const { TransformationError, InstrumentationError } = require('@rudderstack/integrations-lib');
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  KEY_CHECK_LIST,
  EVENT_TYPE_ID_REGEX,
} = require('./config');
const { EventType } = require('../../../constants');
const {
  removeUndefinedAndNullValues,
  removeUndefinedNullValuesAndEmptyObjectArray,
  defaultPostRequestConfig,
  defaultRequestConfig,
  constructPayload,
  flattenJson,
  isDefinedAndNotNullAndNotEmpty,
  getFieldValueFromMessage,
  isDefinedAndNotNull,
  simpleProcessRouterDest,
  ErrorMessage,
} = require('../../util');
const { JSON_MIME_TYPE } = require('../../util/constant');

function responseBuilderSimple(payload, category, destination) {
  if (payload) {
    const responseBody = payload;
    const response = defaultRequestConfig();
    response.endpoint = category.endPoint;
    response.method = defaultPostRequestConfig.requestMethod;
    response.headers = {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Bearer ${destination.Config.apiKey}`,
    };
    response.body.JSON = removeUndefinedAndNullValues(responseBody);
    return response;
  }
  // fail-safety for developer error;
  throw new TransformationError(ErrorMessage.FailedToConstructPayload);
}

function populateOutputProperty(inputObject) {
  const outputProperty = {};
  Object.keys(inputObject).forEach((key) => {
    if (!KEY_CHECK_LIST.includes(key)) {
      outputProperty[key] = inputObject[key];
    }
  });
  return outputProperty;
}

function prepareResponse(message, destination, category) {
  let bufferProperty = {};
  const { environment, trafficType } = destination.Config;
  const { type, properties } = message;
  let traits;

  let outputPayload = {};

  outputPayload = constructPayload(message, MAPPING_CONFIG[category.name]);
  outputPayload.eventTypeId = outputPayload.eventTypeId.replace(/ /g, '_');
  if (EVENT_TYPE_ID_REGEX.test(outputPayload.eventTypeId)) {
    switch (type) {
      case EventType.IDENTIFY:
        traits = getFieldValueFromMessage(message, 'traits');
        if (isDefinedAndNotNull(traits)) bufferProperty = populateOutputProperty(traits);
        break;
      case EventType.GROUP:
        if (message.traits) {
          bufferProperty = populateOutputProperty(message.traits);
        }
        break;
      case EventType.TRACK:
      case EventType.PAGE:
      case EventType.SCREEN:
        if (properties) {
          bufferProperty = populateOutputProperty(properties);
        }
        if (message.category) {
          bufferProperty.category = message.category;
        }
        if (type !== 'track') {
          outputPayload.eventTypeId = `Viewed_${outputPayload.eventTypeId}_${type}`;
        }
        break;
      default:
        throw new InstrumentationError(`Event type ${type} is not supported`);
    }
  } else {
    throw new InstrumentationError(
      `eventTypeId does not match with ideal format ${EVENT_TYPE_ID_REGEX}`,
    );
  }
  if (isDefinedAndNotNullAndNotEmpty(environment)) {
    outputPayload.environmentName = environment;
  }
  outputPayload.trafficTypeName = trafficType;
  outputPayload.properties = removeUndefinedNullValuesAndEmptyObjectArray(
    flattenJson(bufferProperty),
  );

  return outputPayload;
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  const category = CONFIG_CATEGORIES.EVENT;
  const response = prepareResponse(message, destination, category);
  // build the response
  return responseBuilderSimple(response, category, destination);
};

const process = (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
