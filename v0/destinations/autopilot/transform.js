const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG, DESTINATION } = require("./config");
const { TRANSFORMER_METRIC } = require("../../util/constant");

const {
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig,
  getFieldValueFromMessage,
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError
} = require("../../util");
const ErrorBuilder = require("../../util/error");

const identifyFields = [
  "email",
  "firstname",
  "firstName",
  "lastname",
  "lastName",
  "phone",
  "company",
  "status",
  "LeadSource"
];

function responseBuilderSimple(message, category, destination) {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  if (payload) {
    const response = defaultRequestConfig();
    response.headers = {
      autopilotapikey: destination.Config.apiKey,
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    let responseBody;
    let contactIdOrEmail;
    let customPayload;
    switch (message.type) {
      case EventType.IDENTIFY:
        // fix for cases where traits and context.traits is missing
        customPayload = message.traits || message.context.traits || {};
        identifyFields.forEach(value => {
          delete customPayload[value];
        });
        if (Object.keys(customPayload).length) {
          responseBody = {
            contact: { ...payload, custom: customPayload }
          };
        } else {
          responseBody = {
            contact: { ...payload }
          };
        }
        response.endpoint = category.endPoint;
        break;
      case EventType.TRACK:
        responseBody = { ...payload };
        contactIdOrEmail = getFieldValueFromMessage(message, "email");
        if (contactIdOrEmail) {
          response.endpoint = `${category.endPoint}/${destination.Config.triggerId}/contact/${contactIdOrEmail}`;
        } else {
          throw new ErrorBuilder()
            .setStatus(400)
            .setMessage("Email is required for track calls")
            .setStatTags({
              destination: DESTINATION,
              stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
              scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
              meta:
                TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META
                  .BAD_PARAM
            })
            .build();
          // throw new CustomError("Email is required for track calls", 400);
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
  throw new CustomError("Payload could not be constructed", 400);
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError("invalid message type for autopilot", 400);
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
      throw new CustomError(
        `message type ${messageType} not supported for autopilot`,
        400
      );
  }

  // build the response
  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};
const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
