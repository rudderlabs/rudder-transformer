const get = require("get-value");
const { EventType, MappedToDestinationKey } = require("../../../constants");
const {
  ConfigCategory,
  MappingConfig,
  ReservedTraitsProperties,
  ReservedCompanyProperties
} = require("./config");
const {
  constructPayload,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  addExternalIdToTraits
} = require("../../util");

function getCompanyAttribute(company) {
  const companiesList = [];
  if (company.id) {
    companiesList.push({
      company_id: company.id
    });
  }
  return companiesList;
}

function validateIdentify(message, payload) {
  const finalPayload = payload;

  if (payload.user_id || payload.email) {
    if (payload.name === undefined || payload.name === "") {
      const firstName = getFieldValueFromMessage(message, "firstName");
      const lastName = getFieldValueFromMessage(message, "lastName");
      if (firstName && lastName) {
        finalPayload.name = `${firstName} ${lastName}`;
      } else {
        finalPayload.name = firstName || lastName;
      }
    }

    if (get(finalPayload, "custom_attributes.company")) {
      finalPayload.companies = getCompanyAttribute(
        finalPayload.custom_attributes.company
      );
    }

    if (finalPayload.custom_attributes) {
      ReservedTraitsProperties.forEach(trait => {
        delete finalPayload.custom_attributes[trait];
      });
    }

    return finalPayload;
  }
  throw new CustomError("Email or userId is mandatory", 400);
}

function validateGroup(message, payload) {
  const finalPayload = payload;

  if (payload.company_id) {
    if (finalPayload.custom_attributes) {
      ReservedCompanyProperties.forEach(trait => {
        delete finalPayload.custom_attributes[trait];
      });
    }

    return finalPayload;
  }
  throw new CustomError("Email or userId is mandatory", 400);
}

function validateTrack(message, payload) {
  // pass only string, number, boolean properties
  if (payload.user_id || payload.email) {
    const finalPayload = payload;
    const metadata = {};
    if (message.properties) {
      if (message.properties.organization_id) {
        finalPayload.company_id = message.properties.organization_id;
      } else if (message.properties.company_id) {
        finalPayload.company_id = message.properties.company_id;
      }

      Object.keys(message.properties).forEach(key => {
        const val = message.properties[key];
        if (val && typeof val !== "object" && !Array.isArray(val)) {
          metadata[key] = val;
        }
      });

      if (payload.user_id) {
        if (!metadata.user_id && !metadata.userId) {
          metadata.user_id = payload.user_id;
        }
      }
    }
    return { ...finalPayload, metadata };
  }
  throw new CustomError("Email or userId is mandatory", 400);
}

function validateAndBuildResponse(message, payload, category, destination) {
  const messageType = message.type.toLowerCase();
  const response = defaultRequestConfig();
  switch (messageType) {
    case EventType.IDENTIFY:
      response.body.JSON = removeUndefinedAndNullValues(
        validateIdentify(message, payload)
      );
      break;
    case EventType.TRACK:
      response.body.JSON = removeUndefinedAndNullValues(
        validateTrack(message, payload)
      );
      break;

    case EventType.GROUP:
      response.body.JSON = removeUndefinedAndNullValues(
        validateGroup(message, payload)
      );
      break;
    default:
      throw new CustomError("Message type not supported", 400);
  }

  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = category.endpoint;
  response.headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${destination.Config.apiKey}`,
    Accept: "application/json"
  };
  response.userId = message.anonymousId;
  return response;
}

function processSingleMessage(message, destination) {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Ignoring message.",
      400
    );
  }
  const { sendAnonymousId } = destination.Config;
  const messageType = message.type.toLowerCase();
  let category;

  switch (messageType) {
    case EventType.IDENTIFY:
      category = ConfigCategory.IDENTIFY;
      break;
    case EventType.TRACK:
      category = ConfigCategory.TRACK;
      break;
    case EventType.GROUP:
      category = ConfigCategory.GROUP;
      break;
    default:
      throw new CustomError("Message type not supported", 400);
  }

  // build the response and return
  let payload;
  if (get(message, MappedToDestinationKey)) {
    addExternalIdToTraits(message);
    payload = getFieldValueFromMessage(message, "traits");
  } else {
    payload = constructPayload(message, MappingConfig[category.name]);
  }
  if (sendAnonymousId && !payload.user_id) {
    payload.user_id = message.anonymousId;
  }
  return validateAndBuildResponse(message, payload, category, destination);
}

function process(event) {
  let response;
  try {
    response = processSingleMessage(event.message, event.destination);
  } catch (error) {
    throw new CustomError(
      error.message || "Unknown error",
      error.status || 400
    );
  }
  return response;
}

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
