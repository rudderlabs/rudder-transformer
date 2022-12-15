const {
  defaultRequestConfig,
  constructPayload,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest,
  getDestinationExternalID,
  defaultPostRequestConfig,
  defaultPatchRequestConfig
} = require("../../util");

const {
  validateEmail,
  deduceAddressFields,
  deduceStateField,
  validatePayload,
  searchContactIds,
  validateGroupCall
} = require("./utils");

const { EventType } = require("../../../constants");
const { BASE_URL, mappingConfig, ConfigCategories } = require("./config");

const {
  TransformationError,
  InstrumentationError,
  ConfigurationError
} = require("../../util/errorTypes");

const responseBuilder = async (
  payload,
  endpoint,
  method,
  messageType,
  Config
) => {
  const { userName, password } = Config;
  if (messageType === EventType.IDENTIFY && !payload) {
    throw new TransformationError(
      "Something went wrong while constructing the payload"
    );
  } else {
    const response = defaultRequestConfig();
    if (messageType === EventType.IDENTIFY) {
      response.body.JSON = removeUndefinedAndNullValues(payload);
    } else {
      response.body.FORM = removeUndefinedAndNullValues(payload);
    }
    response.endpoint = endpoint;
    const basicAuth = Buffer.from(`${userName}:${password}`).toString("base64");
    response.headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth}`
    };
    response.method = method;
    return response;
  }
};

/**
 *
 * @param {*} message
 * @param {*} Config
 * @param {*} endPoint
 * @returns build response for group call
 */
const groupResponseBuilder = async (message, Config, endPoint) => {
  let groupClass;
  validateGroupCall(message);
  switch (message.traits?.type?.toLowerCase()) {
    case "segments":
      groupClass = "segments";
      break;
    case "campaigns":
      groupClass = "campaigns";
      break;
    case "companies":
      groupClass = "companies";
      break;
    default:
      throw new InstrumentationError(
        `Grouping type "${message.traits?.type?.toLowerCase()}" is not supported. Only "Segments", "Companies", and "Campaigns" are supported`
      );
  }
  let contactId = getDestinationExternalID(message, "mauticContactId");
  if (!contactId) {
    const contacts = await searchContactIds(message, Config, endPoint);
    if (!contacts || contacts.length === 0) {
      throw new ConfigurationError("Could not find any contact ID on lookup");
    }
    if (contacts.length > 1) {
      throw new ConfigurationError("Found more than one contact on lookup");
    }
    if (contacts.length === 1) {
      const [first] = contacts;
      contactId = first;
    }
  }

  if (
    message.traits.operation &&
    message.traits.operation !== "remove" &&
    message.traits.operation !== "add"
  ) {
    throw new InstrumentationError(
      `Invalid value specified for operation "${message.traits.operation}". Only "add" and "remove" are supported`
    );
  }
  const operation = message.traits.operation || "add";
  const endpoint = `${endPoint}/${groupClass}/${message.groupId}/contact/${contactId}/${operation}`;
  const payload = {};
  return responseBuilder(
    payload,
    endpoint,
    defaultPostRequestConfig.requestMethod,
    EventType.GROUP,
    Config
  );
};

/**
 *
 * @param {*} message
 * @param {*} Config
 * @param {*} endPoint
 * @returns build response for identify call
 */
const identifyResponseBuilder = async (message, Config, endpoint) => {
  let method;
  let endPoint;
  // constructing payload from mapping JSONs
  const payload = constructPayload(
    message,
    mappingConfig[ConfigCategories.IDENTIFY.name]
  );
  if (validatePayload(payload)) {
    const { address1, address2 } = deduceAddressFields(message);
    deduceStateField(payload);
    payload.address1 = address1;
    payload.address2 = address2;
  }
  /* 
     1. if contactId is present  inside externalID we will use that
     2. Otherwise we will look for the lookup field from the web app 
  */
  let contactId = getDestinationExternalID(message, "mauticContactId");

  if (!contactId) {
    const contacts = await searchContactIds(message, Config, endpoint);
    if (contacts?.length === 1) {
      const [first] = contacts;
      contactId = first;
      endPoint = `${endpoint}/contacts/${contactId}/edit`;
      method = defaultPatchRequestConfig.requestMethod;
    } else {
      endPoint = `${endpoint}/contacts/new`;
      method = defaultPostRequestConfig.requestMethod;
    }
  } else {
    endPoint = `${endpoint}/contacts/${contactId}/edit`;
    method = defaultPatchRequestConfig.requestMethod;
  }

  return responseBuilder(payload, endPoint, method, EventType.IDENTIFY, Config);
};

const process = async event => {
  const { message, destination } = event;
  const { password, subDomainName, userName } = destination.Config;
  const endpoint = `${BASE_URL.replace("subDomainName", subDomainName)}`;
  if (!password) {
    throw new ConfigurationError(
      "Invalid password value specified in the destination configuration"
    );
  }
  if (!subDomainName) {
    throw new ConfigurationError(
      "Invalid sub-domain value specified in the destination configuration"
    );
  }
  if (!validateEmail(userName)) {
    throw new ConfigurationError(
      "Invalid user name provided in the destination configuration"
    );
  }

  // Validating if message type is even given or not
  if (!message.type) {
    throw new InstrumentationError("Event type is required");
  }
  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(
        message,
        destination.Config,
        endpoint
      );
      break;
    case EventType.GROUP:
      response = await groupResponseBuilder(
        message,
        destination.Config,
        endpoint
      );
      break;
    default:
      throw new InstrumentationError(
        `Event type "${messageType}" is not supported`
      );
  }
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
