const set = require("set-value");
const { EventType } = require("../../../constants");
const {
  constructPayload,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  getFieldValueFromMessage
} = require("../../util");
const {
  ENDPOINTS,
  identifyDataMapping,
  groupDataMapping,
  trackDataMapping
} = require("./config");
const {
  createOrUpdateCompany,
  getdestUserIdOrError,
  CustomError
} = require("./util");

const identifyResponseBuilder = async (message, { Config }) => {
  const { destUserId } = await getdestUserIdOrError(
    message,
    Config,
    "identify"
  );

  const payload = constructPayload(message, identifyDataMapping);
  if (!payload.name) {
    const fName = getFieldValueFromMessage(message, "firstName");
    const lName = getFieldValueFromMessage(message, "lastName");
    set(payload, "name", `${fName} ${lName}`.trim());
  }

  const response = defaultRequestConfig();
  response.headers = {
    Authorization: `Bearer ${Config.apiToken}`,
    "Content-Type": "application/json"
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
    response.endpoint = `${ENDPOINTS.IDENTIFY_ENDPOINT}/${destUserId}`;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }

  // create new User
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = ENDPOINTS.IDENTIFY_ENDPOINT;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

const groupResponseBuilder = async (message, { Config }) => {
  const groupId = getFieldValueFromMessage(message, "groupId");
  if (!groupId) {
    throw new CustomError("groupId is required for group call", 400);
  }

  const { destUserId } = await getdestUserIdOrError(message, Config, "group");

  let payload = constructPayload(message, groupDataMapping);
  payload = removeUndefinedAndNullValues(payload);
  set(payload, "company_id", groupId);

  const companyId = await createOrUpdateCompany(payload, Config);

  const response = defaultRequestConfig();
  response.body.JSON = {
    id: companyId
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = ENDPOINTS.getAttachEndpoint(destUserId);
  response.headers = {
    Authorization: `Bearer ${Config.apiToken}`,
    "Content-Type": "application/json"
  };
  return response;
};

const trackResponseBuilder = async (message, { Config }) => {
  const { idsObject } = await getdestUserIdOrError(message, Config, "track");

  const payload = {
    ...constructPayload(message, trackDataMapping),
    ...idsObject
  };

  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.endpoint = ENDPOINTS.TRACK_ENDPOINT;
  response.headers = {
    Authorization: `Bearer ${Config.apiToken}`,
    "Content-Type": "application/json"
  };
  return response;
};

// process single message
const process = async event => {
  const { message, destination } = event;
  if (!message.type) {
    throw CustomError("Message Type is not present. Aborting message.", 400);
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
    case EventType.TRACK:
      response = await trackResponseBuilder(message, destination);
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
