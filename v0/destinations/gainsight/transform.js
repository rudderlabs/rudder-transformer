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
  getFieldValueFromMessage,
  getValueFromMessage,
  extractCustomFields,
  defaultPutRequestConfig,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig
} = require("../../util/index");
const { searchGroup, createGroup, updateGroup } = require("./util");


const identifyResponseBuilder = (message, { Config }) => {
  if (!getValueFromMessage(message, ["traits.email", "context.traits.name"])) {
    throw new Error("email is required for identify");
  }
  let payload = constructPayload(message, identifyMapping);

  if (!payload.name) {
    const fname = getFieldValueFromMessage(message, "firstName");
    const lname = getFieldValueFromMessage(message, "lastName");
    set(payload, "name", `${fname || ""} ${lname || ""}`.trim());
    set(payload, "FirstName", fname);
    set(payload, "LastName", lname);
    delete payload.name;
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
  payload = extractCustomFields(message, payload, GROUP_EXCLUSION_KEYS);
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
