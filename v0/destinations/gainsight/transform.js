/* eslint-disable prettier/prettier */
const set = require("set-value");
const { EventType } = require("../../../constants");
const {
  identifyMapping,
  groupMapping,
  eventConfigMapping,
  IDENTIFY_EXCLUSION_KEYS,
  GROUP_EXCLUSION_KEYS,
  ENDPOINTS
} = require("./config");
const {
  constructPayload,
  defaultRequestConfig,
  getValueFromMessage,
  extractCustomFields,
  defaultPutRequestConfig,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig
} = require("../../util/index");
const { searchGroup, createGroup, updateGroup } = require("./util");

/**
 * Person Object is created or updated. Upsert API makes PUT request for both cases
 * https://support.gainsight.com/Gainsight_NXT/API_and_Developer_Docs/Person_API/Person_API_Documentation
 */
const identifyResponseBuilder = (message, { Config }) => {
  if (!getValueFromMessage(message, ["traits.email", "context.traits.email"])) {
    throw new Error("email is required for identify");
  }
  let payload = constructPayload(message, identifyMapping);

  if (!payload.Name) {
    const fName = payload.FirstName;
    const lName = payload.LastName;
    const mName = payload.MiddleName;
    const name = mName ? 
      `${fName || ""} ${mName} ${lName || ""}`:
      `${fName || ""} ${lName || ""}`;

    set(payload, "Name", name.trim());
  }

  payload = extractCustomFields(
    message,
    payload,
    ["traits", "context.traits"],
    IDENTIFY_EXCLUSION_KEYS
  );

  const response = defaultRequestConfig();
  response.method = defaultPutRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.headers = {
    Accesskey: Config.accessKey,
    "Content-Type": "application/json"
  };
  response.endpoint = ENDPOINTS.identifyEndpoint(Config.domain);
  return response;
};

/**
 * Company object is created or updated and added to a
 * Person Object.
 * https://support.gainsight.com/Gainsight_NXT/API_and_Developer_Docs/Company_API/Company_API_Documentation
 */
const groupResponseBuilder = async (message, { Config }) => {
  const groupName = getValueFromMessage(message, "traits.name");
  if (!groupName) {
    throw new Error("company name is required for group");
  }

  const email = getValueFromMessage(message, "context.traits.email");
  if (!email) {
    throw new Error("user email is required for group");
  }

  const resp = await searchGroup(groupName, Config);

  let payload = constructPayload(message, groupMapping);
  payload = extractCustomFields(message, payload, ["traits"], GROUP_EXCLUSION_KEYS);
  payload = removeUndefinedAndNullValues(payload);

  let groupGsid;
  if (resp.data.data.records.length === 0) {
    groupGsid = await createGroup(payload, Config);
  } 
  else {
    groupGsid = await updateGroup(payload, Config);
  }

  const responsePayload = {
    Email: email,
    companies: [{ Company_ID: groupGsid }]
  };

  // update person with the group (company)
  const response = defaultRequestConfig();
  response.method = defaultPutRequestConfig.requestMethod;
  response.endpoint = ENDPOINTS.identifyEndpoint(Config.domain);
  response.headers = {
    Accesskey: Config.accessKey,
    "Content-Type": "application/json"
  };
  response.body.JSON = responsePayload;
  return response;
};

/**
 * Events with eventName and versions are created in Gainsight Dashboard
 * under a particular Topic. The track call will send a payload to the
 * mentioned eventName, eventVersion for the particular topicName.
 * https://support.gainsight.com/Gainsight_NXT/Journey_Orchestrator_and_Email_Templates/Programs/Events_Framework#Event_API_Contract
 */
const trackResponseBuilder = (message, { Config }) => {
  const eventConfig = constructPayload(message, eventConfigMapping);
  const eventPayload = getValueFromMessage(message, "properties.eventPayload");

  const response = defaultRequestConfig();
  response.body.JSON = eventPayload;
  response.method= defaultPostRequestConfig.requestMethod;
  response.endpoint = ENDPOINTS.trackEndpoint(Config.domain);
  response.headers = {
    sharedSecret: Config.sharedSecret,
    Accesskey: Config.accessKey,
    "Content-Type": "application/json",
    ...eventConfig
  };
  if (Config.contractId) {
    response.headers.contractId = Config.contractId;
  }
  return response;
};

/**
 * Processing Single event
 */
const process = async event => {
  const { message, destination } = event;
  const messageType = getValueFromMessage(message, "type")
    .toLowerCase()
    .trim();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    case EventType.GROUP:
      response = await groupResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    default:
      throw new Error(`message type ${messageType} not supported`);
  }
  return response;
};

exports.process = process;
