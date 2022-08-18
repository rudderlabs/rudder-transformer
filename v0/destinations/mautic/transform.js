const {
  defaultRequestConfig,
  CustomError,
  constructPayload,
  // isDefinedAndNotNull,
  // getIntegrationsObj,
  removeUndefinedAndNullValues,
  getErrorRespEvents,
  getSuccessRespEvents,
  getDestinationExternalID,
  defaultPostRequestConfig,
  defaultPatchRequestConfig
} = require("../../util");

const {
  FIELDS,
  validateEmail,
  deduceAddressFields,
  validatePayload,
  searchContactId,
  refinePayloadFields
} = require("./utils");

const { EventType } = require("../../../constants");

const { BASE_URL, mappingConfig, ConfigCategories } = require("./config");

const responseBuilderGroup = async (endpoint, destination) => {
  const { userName, password } = destination.Config;
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  const basicAuth = Buffer.from(`${userName}:${password}`).toString("base64");
  response.headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${basicAuth}`
  };
  response.method = defaultPostRequestConfig.requestMethod;
  return response;
};

const groupResponseBuilder = async (message, destination) => {
  let groupClass;
  if (message.traits === undefined || message.traits.type === undefined) {
    throw new CustomError("Type of group not mentioned inside traits");
  }
  const { subDomainName } = destination.Config;
  switch (message.traits.type.toLowerCase()) {
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
      throw new CustomError("This grouping is not supported");
  }
  const identifyFlag = false;
  let contactId = getDestinationExternalID(message, "mauticContactId");
  if (!contactId) {
    contactId = await searchContactId(message, destination, identifyFlag); // Getting the contact Id using Lookup field and then email
  }

  const endpoint = `${BASE_URL.replace(
    "subDomainName",
    subDomainName
  )}/${groupClass}/${message.groupId}/contact/${contactId}/add`;
  return responseBuilderGroup(endpoint, destination);
};
const responseBuilderIdentify = async (
  payload,
  endpoint,
  method,
  messageType,
  destination
) => {
  const { userName, password } = destination.Config;
  if (payload) {
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
  throw new CustomError("Payload could not be Constructed");
};

const identifyResponseBuilder = async (message, destination) => {
  let endpoint;
  let method;
  const { subDomainName } = destination.Config;
  // constructing payload from mapping JSONs
  let payload = constructPayload(
    message,
    mappingConfig[ConfigCategories.IDENTIFY.name]
  );
  // Adding all the fields inpayload that needs validation and
  payload = refinePayloadFields(payload, message);
  // if the payload is valid adding address fields if present

  if (validatePayload(payload)) {
    const { address1, address2 } = deduceAddressFields(message); // throws error if address greater than 128
    payload.address1 = address1;
    payload.address2 = address2;
  }
  /* 
     1. if contactId is present  inside externalID we will use that
     2. Otherwise we will look for the lookup field from the web app 
  */
  const identifyFlag = true;
  let contactId = getDestinationExternalID(message, "mauticContactId");
  if (contactId) {
    //contact exist in externalId
    //update
    endpoint = `${BASE_URL.replace(
      "subDomainName",
      subDomainName
    )}/contacts/${contactId}/edit`;
    method = defaultPatchRequestConfig.requestMethod;
  } else {
    if (!contactId) {
      contactId = await searchContactId(message, destination, identifyFlag); // Getting the contact Id using Lookup field and then email
    }
    if (contactId && contactId?.Promise) {
      // contact found through lookup Call
      // update
      endpoint = `${BASE_URL.replace(
        "subDomainName",
        subDomainName
      )}/contacts/${contactId}/edit`;
      method = defaultPatchRequestConfig.requestMethod;
    } else {
      // contact do not exist
      // create
      endpoint = `${BASE_URL.replace(
        "subDomainName",
        subDomainName
      )}/contacts/new`;
      method = defaultPostRequestConfig.requestMethod;
    }
  }

  return responseBuilderIdentify(
    payload,
    endpoint,
    method,
    EventType.IDENTIFY,
    destination
  );
};

const process = async event => {
  const { message, destination } = event;
  const { lookUpField, password, subDomainName, userName } = destination.Config;
  if (!password) {
    throw new CustomError("Password field can not be empty.", 400);
  }
  if (!subDomainName) {
    throw new CustomError("Sub-Domain Name field can not be empty.", 400);
  }
  if (!FIELDS.includes(lookUpField)) {
    throw new CustomError("Lookup Field Name not available.", 400);
  }

  if (!validateEmail(userName)) {
    throw new CustomError("User Name is not Valid.", 400);
  }

  // Validating if message type is even given or not
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, destination);
      break;
    case EventType.GROUP:
      response = await groupResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`Message type ${messageType} not supported.`, 400);
  }
  return response;
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
