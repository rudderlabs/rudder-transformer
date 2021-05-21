/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
const set = require("set-value");
const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  identifyMapping,
  groupMapping,
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
  defaultPostRequestConfig,
  getHashFromArray,
  getDestinationExternalID,
  getSuccessRespEvents,
  getErrorRespEvents
} = require("../../util/index");
const {
  searchGroup,
  createGroup,
  updateGroup,
  renameCustomFieldsFromMap,
  getConfigOrThrowError,
} = require("./util");
const {CustomError} = require("../../util/error");

/**
 * Person Object is created or updated. Upsert API makes PUT request for both cases
 * https://support.gainsight.com/Gainsight_NXT/API_and_Developer_Docs/Person_API/Person_API_Documentation
 */
const identifyResponseBuilder = (message, { Config }) => {
  const { accessKey } = getConfigOrThrowError(Config, ["accessKey"], "identify");
  if (!getValueFromMessage(message, ["traits.email", "context.traits.email"])) {
    throw new CustomError("email is required for identify", 400);
  }

  let payload = constructPayload(message, identifyMapping);
  const defaultKeys = Object.keys(payload);

  payload = extractCustomFields(
    message,
    payload,
    ["traits", "context.traits"],
    IDENTIFY_EXCLUSION_KEYS
  );

  const personMap = getHashFromArray(Config.personMap, "from", "to", false);
  payload = renameCustomFieldsFromMap(
    payload,
    personMap,
    defaultKeys
  );

  if (!payload.Name) {
    const fName = payload.FirstName;
    const lName = payload.LastName;
    const mName = payload.MiddleName;
    const name = mName
      ? `${fName || ""} ${mName} ${lName || ""}`
      : `${fName || ""} ${lName || ""}`;

    set(payload, "Name", name.trim());
  }

  const response = defaultRequestConfig();
  response.method = defaultPutRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.headers = {
    Accesskey: accessKey,
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
  const { accessKey } = getConfigOrThrowError(Config, ["accessKey"], "group");
  const groupName = getValueFromMessage(message, "traits.name");
  if (!groupName) {
    throw new CustomError("company name is required for group", 400);
  }

  const email = getValueFromMessage(message, "context.traits.email");
  if (!email) {
    throw new CustomError("user email is required for group", 400);
  }

  const resp = await searchGroup(groupName, Config);

  let payload = constructPayload(message, groupMapping);
  const defaultKeys = Object.keys(payload);
  
  payload = extractCustomFields(
    message,
    payload,
    ["traits"],
    GROUP_EXCLUSION_KEYS
  );

  const companyMap = getHashFromArray(Config.companyMap, "from", "to", false);
  payload = renameCustomFieldsFromMap(
    payload,
    companyMap,
    defaultKeys
  );
  payload = removeUndefinedAndNullValues(payload);

  let groupGsid;
  if (resp.data.data.records.length === 0) {
    groupGsid = await createGroup(payload, Config);
  } else {
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
    Accesskey: accessKey,
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
  // TODO: extract contractId (optional field)

  const event = getValueFromMessage(message, "event");
  if (!event) {
    throw new CustomError("event name is required for track", 400);
  }

  const config = getConfigOrThrowError(
    Config,
    ["sharedSecret", "topicName", "tenantId"],
    "track"
  );

  const eventNameMap = getHashFromArray(Config.eventNameMap, "from", "to", false);
  if (!eventNameMap || !get(eventNameMap, event)) {
    throw new CustomError(`Event name mapping not provided for ${event}`, 400);
  }
  const eventVersionMap = getHashFromArray(Config.eventVersionMap, "from", "to", false);
  if (!eventVersionMap || !get(eventVersionMap, event)) {
    throw new CustomError(`event version mapping not provided for ${event}`, 400);
  }

  let contractId = getDestinationExternalID(message, "gainsightEventContractId");
  if (!contractId) {
    contractId = Config.contractId;
  }

  let payload = {};
  payload = extractCustomFields(message, payload, ["properties"], []);

  const response = defaultRequestConfig();
  response.body.JSON = payload;
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = ENDPOINTS.trackEndpoint(Config.domain);
  response.headers = {
    ...config,
    "Content-Type": "application/json",
    eventName: get(eventNameMap, event),
    eventVersion: get(eventVersionMap, event)
  };

  if (contractId) {
    set(response.headers, "contractId", contractId);
  }
  // can work without setting this as well
  if (Config.accessKey) {
    set(response.headers, "Accesskey", Config.accessKey);
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
      throw new CustomError(`message type ${messageType} not supported`, 400);
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

module.exports = {process, processRouterDest};
