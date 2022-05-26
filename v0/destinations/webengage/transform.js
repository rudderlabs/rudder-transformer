const { EventType } = require("../../../constants");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  WEBENGAGE_IDENTIFY_EXCLUSION,
  BASE_URL,
  BASE_URL_IND
} = require("./config");

const {
  defaultRequestConfig,
  constructPayload,
  defaultPostRequestConfig,
  CustomError,
  ErrorMessage,
  extractCustomFields
} = require("../../util");
const moment = require("moment");
const logger = require("../../../logger");

const isValidTimestamp = timestamp => {
  const re = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
  return re.test(String(timestamp));
};

const responseBuilder = (message, category, { Config }) => {
  let payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  if (!payload) {
    // fail-safety for developer error
    throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
  }
  if (!payload.userId && !payload.anonymousId) {
    throw new CustomError(
      "[WEBENGAGE]: Either one of userId or anonymousId is mandatory.",
      400
    );
  }
  let baseUrl, endPoint;
  const dataCenter = Config.dataCenter;
  switch (dataCenter) {
    case "ind":
      baseUrl = BASE_URL_IND;
      break;
    default:
      baseUrl = BASE_URL;
  }

  if (category.type === "identify") {
    const customAttributes = {};
    extractCustomFields(
      message,
      customAttributes,
      ["context.traits", "traits"],
      WEBENGAGE_IDENTIFY_EXCLUSION
    );

    payload = { ...payload, attributes: customAttributes };
    endPoint = `${baseUrl}/${Config.licenseCode}/users`;
  } else {
    const eventTimeStamp = payload.eventTime;
    if (eventTimeStamp) {
      if (isValidTimestamp(eventTimeStamp)) {
        payload.eventTime = moment(eventTimeStamp).format(
          "YYYY-MM-DDThh:mm:sZZ"
        );
      } else {
        logger.error("timestamp format must be ISO 8601.");
        delete payload.eventTime;
      }
    }

    endPoint = `${baseUrl}/${Config.licenseCode}/events`;
  }
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Config.apiKey}`
  };
  response.endpoint = endPoint;
  response.body.JSON = payload;
  return response;
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();
  let response;
  let category;
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES[message.type.toUpperCase()];
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES["EVENT"];
      break;
    case EventType.PAGE:
    case EventType.SCREEN:
      category = CONFIG_CATEGORIES["EVENT"];
      const name = message.name
        ? ` ${message.name}`
        : message.properties?.name
        ? ` ${message.properties.name}`
        : "";
      const categoryName = message.properties.category
        ? ` ${message.properties.category}`
        : "";
      message.event = `Viewed${name}${categoryName} ${messageType}`;
      break;
    default:
      throw new Error("Message type not supported");
  }
  response = responseBuilder(message, category, destination);
  return response;
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
