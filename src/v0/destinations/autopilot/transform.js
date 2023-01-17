const { EventType } = require('../../../constants');
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require('./config');
const {
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig,
  getFieldValueFromMessage,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest,
} = require('../../util');

const { InstrumentationError, TransformationError } = require('../../util/errorTypes');

const identifyFields = [
  'email',
  'firstname',
  'firstName',
  'lastname',
  'lastName',
  'phone',
  'company',
  'status',
  'LeadSource',
];

function responseBuilderSimple(message, category, destination) {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  if (payload) {
    const response = defaultRequestConfig();
    response.headers = {
      autopilotapikey: destination.Config.apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    let responseBody;
    let contactIdOrEmail;
    let customPayload;
    switch (message.type) {
      case EventType.IDENTIFY:
        // fix for cases where traits and context.traits is missing
        customPayload = message.traits || message.context.traits || {};
        identifyFields.forEach((value) => {
          delete customPayload[value];
        });
        if (Object.keys(customPayload).length > 0) {
          responseBody = {
            contact: { ...payload, custom: customPayload },
          };
        } else {
          responseBody = {
            contact: { ...payload },
          };
        }
        response.endpoint = category.endPoint;
        break;
      case EventType.TRACK:
        responseBody = { ...payload };
        contactIdOrEmail = getFieldValueFromMessage(message, 'email');
        if (contactIdOrEmail) {
          response.endpoint = `${category.endPoint}/${destination.Config.triggerId}/contact/${contactIdOrEmail}`;
        } else {
          throw new InstrumentationError('Email is required for track calls');
        }
        break;
      default:
        break;
    }
    response.method = defaultPostRequestConfig.requestMethod;
    response.userId = message.anonymousId;
    response.body.JSON = removeUndefinedAndNullValues(responseBody);
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError('Payload could not be constructed');
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('invalid message type for autopilot');
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
      throw new InstrumentationError(`message type ${messageType} not supported for autopilot`);
  }

  // build the response
  return responseBuilderSimple(message, category, destination);
};

const process = (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
