const set = require("set-value");
const { EventType } = require("../../../constants");
const {
  constructPayload,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  getFieldValueFromMessage,
} = require("../../util");
const { ENDPOINTS, identifyDataMapping, groupDataMapping, trackDataMapping } = require("./config");
const {
  createOrUpdateCompany,
  getdestUserIdOrError,
  CustomError
} = require("./util");

const identifyResponseBuilder = async (message, { Config }) => {
  const { destUserId } = await getdestUserIdOrError(message, "identify");

  const payload = constructPayload(message, identifyDataMapping);
  if (!payload.name) {
    const fName = getFieldValueFromMessage(message, "firstName");
    const lName = getFieldValueFromMessage(message, "lastName");
    set(payload, "name", `${fName} ${lName}`.trim());
  }

  const response = defaultRequestConfig();
  response.endpoint = ENDPOINTS.IDENTIFY_ENDPOINT;
  response.headers = {
    Authorization: `Bearer ${Config.apiToken}`
  };

  // update existing User
  if (destUserId) {
    /**
     * not allowing update for email and userId
     */
    delete payload.email;
    delete payload.external_id;
    delete payload.signed_up_at;

    response.method = defaultPutRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }

  // create new User
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

const groupResponseBuilder = async ( message, { Config } ) => {
  const groupId = getFieldValueFromMessage(message, "groupId");
  if (!groupId) {
    throw new CustomError("groupId is required for group call", 400);
  }

  const { destUserId } = await getdestUserIdOrError(message, "group");

  const payload = constructPayload(message, groupDataMapping);
  payload = removeUndefinedAndNullValues(payload);
  set(payload, "company_id", groupId);

  const companyId = await createOrUpdateCompany(payload, Config);

  const response = defaultRequestConfig();
  response.body.JSON = {
    "id": companyId
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = ENDPOINTS.getAttachEndpoint(destUserId);
  response.headers = {
    Authorization: `Bearer ${Config.apiToken}`
  };
  return response;
};

const trackResponseBuilder = (message, { Config }) => {
  const { idsObject } = getdestUserIdOrError(message, "track");

  const payload = {
    ...constructPayload(message, trackDataMapping),
    ...idsObject
  }

  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.headers = {
    Authorization: `Bearer ${Config.apiToken}`
  };
  return response;
};

// process single message
const process = async event => {
  if (!message || !message.type) {
    throw CustomError("Message Type is not present. Aborting message.", 400);
  }
  if (!Config.apiToken) {
    throw new CustomError("API Token is missing.", 400);
  }

  const { message, destination } = event;
  const messageType = getValueFromMessage(message, "type")
    .toLowerCase()
    .trim();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, destination);
      break;
    case EventType.GROUP:
      response = await groupResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = await trackResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`message type ${messageType} not supported`, 400);
  }
  return response;
};

exports.process = process;
