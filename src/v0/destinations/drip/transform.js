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
  getValueFromMessage,
  isObject,
  simpleProcessRouterDest
} = require("../../util");
const logger = require("../../../logger");
const {
  ENDPOINT,
  identifyMapping,
  trackMapping,
  campaignMapping,
  IDENTIFY_EXCLUSION_FIELDS,
  TRACKING_EXLCUSION_FIELDS,
  ecomEvents,
  ecomMapping,
  eventNameMapping
} = require("./config");
const {
  userExists,
  isValidEmail,
  isValidTimestamp,
  createUpdateUser,
  createList
} = require("./util");
const { TRANSFORMER_METRIC } = require("../../util/constant");

const identifyResponseBuilder = async (message, { Config }) => {
  const id = getDestinationExternalID(message, "dripId");

  let email = getFieldValueFromMessage(message, "email");
  if (!isValidEmail(email)) {
    email = null;
    logger.error("Email format is incorrect");
  }

  const userId = getFieldValueFromMessage(message, "userId");
  if (!(id || email)) {
    throw new CustomError("dripId or email is required for the call", 400);
  }

  let payload = constructPayload(message, identifyMapping);
  if (payload.address1 && isObject(payload.address1)) {
    let addressString = "";
    Object.keys(payload.address1).forEach(key => {
      addressString = addressString.concat(` ${payload.address1[key]}`);
    });
    payload.address1 = addressString.trim();
  }

  payload.id = id;
  payload.email = email;
  payload.user_id = userId;

  if (!payload.first_name && !payload.last_name) {
    const name = getFieldValueFromMessage(message, "name");
    if (name && typeof name === "string") {
      const [fname, lname] = name.trim().split(" ");
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
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json"
  };
  response.method = defaultPostRequestConfig.requestMethod;
  const campaignId =
    getDestinationExternalID(message, "dripCampaignId") || Config.campaignId;
  if (campaignId && email) {
    const check = await createUpdateUser(finalpayload, Config, basicAuth);
    if (!check) {
      throw new CustomError("Unable to create/update user.", 400);
    }

    let campaignPayload = constructPayload(message, campaignMapping);
    campaignPayload.email = email;

    campaignPayload = removeUndefinedAndNullValues(campaignPayload);
    const finalCampaignPayload = {
      subscribers: [campaignPayload]
    };

    response.endpoint = `${ENDPOINT}/v2/${Config.accountId}/campaigns/${campaignId}/subscribers`;
    response.body.JSON = finalCampaignPayload;
    return response;
  }
  response.endpoint = `${ENDPOINT}/v2/${Config.accountId}/subscribers`;
  response.body.JSON = finalpayload;
  return response;
};

const trackResponseBuilder = async (message, { Config }) => {
  const id = getDestinationExternalID(message, "dripId");

  let email = getValueFromMessage(message, [
    "properties.email",
    "traits.email",
    "context.traits.email"
  ]);
  if (!isValidEmail(email)) {
    email = null;
    logger.error("Enter correct email format.");
  }
  if (!id && !email) {
    throw new CustomError("Drip Id or email is required.", 400);
  }

  let event = getValueFromMessage(message, "event");
  if (!event) {
    throw new CustomError("Event name is required", 400);
  }
  event = event.trim().toLowerCase();

  if (!Config.enableUserCreation && !id) {
    const check = await userExists(Config, email);
    if (!check) {
      throw new CustomError(
        "User creation mode is disabled and user does not exist. Track call aborted.",
        400
      );
    }
  }
  if (ecomEvents.includes(event)) {
    const payload = constructPayload(message, ecomMapping);
    payload.email = email;
    payload.person_id = id;

    if (payload.occurred_at && !isValidTimestamp(payload.occurred_at)) {
      payload.occurred_at = null;
      logger.error("Timestamp format must be ISO-8601.");
    }
    const productList = getValueFromMessage(message, "properties.products");
    if (productList) {
      const itemList = createList(productList);
      if (itemList && itemList.length > 0) {
        payload.items = itemList;
      }
    }
    payload.action = eventNameMapping[event];
    const basicAuth = Buffer.from(Config.apiKey).toString("base64");
    const response = defaultRequestConfig();
    response.headers = {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/json"
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.endpoint = `${ENDPOINT}/v3/${Config.accountId}/shopper_activity/order`;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }

  let payload = constructPayload(message, trackMapping);
  payload.action = event;
  payload.id = id;
  payload.email = email;
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
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json"
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = `${ENDPOINT}/v2/${Config.accountId}/events`;
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
  const respList = await simpleProcessRouterDest(inputs, "DRIP", process);
  return respList;
};

module.exports = { process, processRouterDest };
