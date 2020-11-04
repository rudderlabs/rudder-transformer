const md5 = require("md5");
const { EventType } = require("../../../constants");
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
  getFieldValueFromMessage
} = require("../../util");

function getCompanyAttribute(company) {
  const companiesList = [];
  if (company.name || company.id) {
    const customAttributes = {};
    Object.keys(company).forEach(key => {
      // the key is not in ReservedCompanyProperties
      if (!ReservedCompanyProperties.includes(key)) {
        const val = company[key];
        if (val) {
          customAttributes[key] = val;
        }
      }
    });

    companiesList.push({
      company_id: company.id || md5(company.name),
      custom_attributes: customAttributes,
      name: company.name,
      industry: company.industry
    });
  }
  return companiesList;
}

function validateIdentify(message, payload) {
  const finalPayload = payload;

  finalPayload.update_last_request_at = true;
  if (payload.user_id || payload.email) {
    if (payload.name === undefined || payload.name === "") {
      const firstName = getFieldValueFromMessage(message, "firstName");
      const lastName = getFieldValueFromMessage(message, "lastName");
      if (firstName && lastName) {
        finalPayload.name = `${firstName} ${lastName}`;
      } else {
        finalPayload.name = firstName ? `${firstName}` : `${lastName}`;
      }
    }

    if (finalPayload.custom_attributes.company) {
      finalPayload.companies = getCompanyAttribute(
        finalPayload.custom_attributes.company
      );
    }
    ReservedTraitsProperties.forEach(trait => {
      delete finalPayload.custom_attributes[trait];
    });

    return finalPayload;
  }
  throw new Error("Email or userId is mandatory");
}

function validateTrack(message, payload) {
  // pass only string, number, boolean properties
  if (payload.user_id || payload.email) {
    const metadata = {};
    if (message.properties) {
      Object.keys(message.properties).forEach(key => {
        const val = message.properties[key];
        if (val && typeof val !== "object" && !Array.isArray(val)) {
          metadata[key] = val;
        }
      });
    }
    return { ...payload, metadata };
  }
  throw new Error("Email or userId is mandatory");
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
    default:
      throw new Error("Message type not supported");
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
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();
  let category;

  switch (messageType) {
    case EventType.IDENTIFY:
      category = ConfigCategory.IDENTIFY;
      break;
    case EventType.TRACK:
      category = ConfigCategory.TRACK;
      break;
    // case EventType.GROUP:
    //   category = ConfigCategory.GROUP;
    //   break;
    default:
      throw new Error("Message type not supported");
  }

  // build the response and return
  const payload = constructPayload(message, MappingConfig[category.name]);
  return validateAndBuildResponse(message, payload, category, destination);
}

function process(event) {
  let response;
  try {
    response = processSingleMessage(event.message, event.destination);
  } catch (error) {
    throw new Error(error.message || "Unknown error");
  }
  return response;
}

exports.process = process;
