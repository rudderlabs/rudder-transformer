/* eslint-disable prettier/prettier */
const get = require("get-value");
const { set } = require("set-value");
const { EventType } = require("../../../constants");
const {
  getIdentifyEndpoint,
  identifyMapping,
  IDENTIFY_EXCLUSION_KEYS,
  GROUP_EXCLUSION_KEYS,
  groupMapping
} = require("./config");
const {
  constructPayload,
  defaultRequestConfig,
  getFieldValueFromMessage,
  getValueFromMessage,
  extractCustomFields,
  defaultPutRequestConfig,
  removeUndefinedAndNullValues
} = require("../../util/index");
const { searchGroup, createGroup, updateGroup } = require("./util");


const identifyResponseBuilder = (message, { Config }) => {
  if (!getValueFromMessage(message, ["traits.email", "context.traits.name"])) {
    throw new Error("email is required for identify");
  }
  let payload = constructPayload(message, identifyMapping);

  if (!payload.name) {
    const fname = getFieldValueFromMessage(message, "firstName").trim();
    const lname = getFieldValueFromMessage(message, "lastName").trim();
    set(payload, "name", `${fname || ""} ${lname || ""}`.trim());
    set(payload, "FirstName", fname);
    set(payload, "LastName", lname);
  }

  payload = extractCustomFields(
    message,
    payload,
    ["traits", "context.traits"],
    IDENTIFY_EXCLUSION_KEYS
  );

  const response = defaultRequestConfig();
  response.method = defaultPutRequestConfig();
  response.body.json = removeUndefinedAndNullValues(payload);
  response.headers = {
    Accesskey: Config.accessKey,
    "Content-Type": "application/json"
  };
  response.endpoint = getIdentifyEndpoint(Config.domain);
  return response;
};

const groupResponseBuilder = (message, { Config }) => {
  const groupName = get(message, "traits.name");
  if (!groupName) {
    throw new Error("group name is required");
  }

  const email = get(message, "context.traits.email");
  if (!email) {
    throw new Error("email is required for group");
  }

  const resp = searchGroup(groupName, Config);

  let payload = constructPayload(message, groupMapping);
  payload = extractCustomFields(message, payload, GROUP_EXCLUSION_KEYS);
  payload = removeUndefinedAndNullValues(payload);

  let groupGsid;
  if (resp.data.data.length === 0) {
    groupGsid = createGroup(payload, Config);
  } 
  else {
    groupGsid = updateGroup(payload, Config);
  }

  const responsePayload = {
    Email: email,
    companies: [{ Company_ID: groupGsid }]
  };

  // update person with the group (company)
  const response = defaultRequestConfig();
  response.method = defaultPutRequestConfig();
  response.headers = {
    Accesskey: Config.accessKey,
    "Content-Type": "application/json"
  };
  response.body.JSON = responsePayload;
  return response;
};

const process = event => {
  const { message, destination } = event;
  const messageType = get(message, "type")
    .toLowerCase()
    .trim();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    case EventType.GROUP:
      response = groupResponseBuilder(message, destination);
      break;
    default:
      throw new Error(`message type ${messageType} not supported`);
  }
  return response;
};

exports.process = process;
