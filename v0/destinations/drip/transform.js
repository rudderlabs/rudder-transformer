const { EventType } = require("../../../constants");
const {
  getDestinationExternalID,
  getFieldValueFromMessage,
  constructPayload,
  extractCustomFields,
  isEmptyObject,
  CustomError,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getErrorRespEvents,
  getSuccessRespEvents
} = require("../../util");
const logger = require("../../../logger");
const {
  ENDPOINT,
  identifyMapping,
  trackMapping,
  campaignMapping,
  IDENTIFY_EXCLUSION_FIELDS,
  TRACKING_EXLCUSION_FIELDS
} = require("./config");
const {
  idValidity,
  isValidEmail,
  isValidTimestamp,
  createUpdateUser
} = require("./util");

const identifyResponseBuilder = async (message, { Config }) => {
  const { accountId } = Config.accountId;

  const id = getDestinationExternalID(message, "dripId");

  let email = getFieldValueFromMessage(message, "email");
  if (!isValidEmail(email)) {
    email = null;
    logger.error("Email format is incorrect");
  }
  const userId = getFieldValueFromMessage(message, "userId");
  if (!(id || email || userId)) {
    throw new CustomError(
      "dripId, email or userId is required for the call",
      400
    );
  }

  let payload = constructPayload(message, identifyMapping);
  payload.id = id;
  payload.email = email;
  payload.visitor_uuid = userId;

  // id — >(yes) -> check if the user already exists (GET call): exists? continue: error;
  // |
  // (no)->email —>(yes) —> no need to check anything --> continue;
  // 	|
  // 	(no)—> visitor_uuid—>(yes) -> check if the visitor_uuid is present in the list: exists? continue: erorr;
  // 				  |
  // 				  (no)—> call can’t be made

  if (!payload.first_name && !payload.last_name) {
    const name = getFieldValueFromMessage(message, "name");
    if (name && typeof name === "string") {
      const [fname, lname] = name.split(" ");
      payload.first_name = fname;
      payload.last_name = lname;
    }
  }
  if (!payload.custom_fields) {
    let customFields = {};
    customFields = extractCustomFields(
      message,
      customFields,
      ["traits", "context.traits"],
      IDENTIFY_EXCLUSION_FIELDS
    );
    if (!isEmptyObject(customFields)) {
      payload.custom_fields = customFields;
    }
  }

  payload = removeUndefinedAndNullValues(payload);
  const finalpayload = {
    subscribers: [payload]
  };
  const basicAuth = Buffer.from(Config.apiKey).toString("base64");
  const response = defaultRequestConfig();
  response.header = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json"
  };
  response.method = defaultPostRequestConfig.requestMethod;
  if (Config.campaign_id && email) {
    await createUpdateUser(finalpayload, Config, basicAuth);

    let campaignPayload = constructPayload(message, campaignMapping);
    campaignPayload.email = email;

    // if (!isEmptyObject(customFields)) {
    //   campaignPayload.custom_fields = customFields;
    // }

    campaignPayload = removeUndefinedAndNullValues(campaignPayload);
    const finalCampaignPayload = {
      subscribers: [campaignPayload]
    };

    response.endpoint = `${ENDPOINT}/${accountId}/campaigns/${Config.campaign_id}/subscribers`;
    response.body.JSON = finalCampaignPayload;
    return response;
  }
  response.endpoint = `${ENDPOINT}/${accountId}/subscribers`;
  response.body.JSON = finalpayload;
  return response;
};

const trackResponseBuilder = async (message, { Config }) => {
  const { accountId } = Config.accountId;

  const id = getDestinationExternalID(message, "dripId");

  let email = getFieldValueFromMessage(message, "email");
  if (!isValidEmail(email)) {
    email = null;
    logger.error("Enter correct email format.");
  }
  if (!id && !email) {
    throw new CustomError("Drip Id or email is required.", 400);
  }
  if (!Config.enableUserCreation) {
    await idValidity(Config, email);
  }
  let payload = constructPayload(message, trackMapping);
  payload.id = id;
  payload.email = email;
  if (!payload.action) {
    throw new CustomError("Action field is required.", 400);
  }
  if (payload.occurred_at && !isValidTimestamp(payload.occurred_at)) {
    payload.occurred_at = null;
    logger.error("Timestamp format must be ISO-8601.");
  }
  if (!payload.properties) {
    let properties = {};
    properties = extractCustomFields(
      message,
      properties,
      ["properties"],
      TRACKING_EXLCUSION_FIELDS
    );
    if (!isEmptyObject(properties)) {
      payload = {
        ...payload,
        properties
      };
    }
  }
  payload = removeUndefinedAndNullValues(payload);
  const finalpayload = {
    events: [payload]
  };
  const basicAuth = Buffer.from(Config.apiKey).toString("base64");
  const response = defaultRequestConfig();
  response.header = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json"
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = `${ENDPOINT}/${accountId}/events`;
  response.body.JSON = finalpayload;
  return response;
};

const process = async event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  if (!destination.Config.accountId) {
    throw new CustomError("Invalid Account Id. Aborting message.", 400);
  }
  if (!destination.Config.apiKey) {
    throw new CustomError("Inavalid API Key. Aborting message.", 400);
  }

  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, destination);
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
