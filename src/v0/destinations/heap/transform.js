const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require('./config');
const { EventType } = require('../../../constants');
const {
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  flattenJson,
  simpleProcessRouterDest,
} = require('../../util');
const { InstrumentationError, TransformationError } = require('../../util/errorTypes');

function responseBuilderSimple(message, category, destination) {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  if (payload) {
    if (payload.properties) {
      payload.properties = flattenJson(payload.properties);
      // remove duplicate key as it is being passed at root.
      if (payload.properties.idempotencyKey) {
        delete payload.properties.idempotencyKey;
      }
    }
    const responseBody = {
      ...payload,
      app_id: destination.Config.appId,
    };
    const response = defaultRequestConfig();
    response.endpoint = category.endPoint;
    response.method = defaultPostRequestConfig.requestMethod;
    response.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    response.userId = message.anonymousId;
    response.body.JSON = removeUndefinedAndNullValues(responseBody);
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError('Payload could not be constructed');
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('invalid message type for heap');
  }

  const messageType = message.type;
  let category;
  switch (messageType.toLowerCase()) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw new InstrumentationError(`message type ${messageType} not supported for heap`);
  }

  // build the response
  return responseBuilderSimple(message, category, destination);
};

const process = async (event) => processEvent(event.message, event.destination);
const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
