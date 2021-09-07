const get = require("get-value");
const logger = require("../../../logger");
const { EventType } = require("../../../constants");
const { getSubscriptionHistory } = require("./nethandler");
const {
  CustomError,
  getDestinationExternalID,
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  removeUndefinedAndNullValues,
  constructPayload,
  getSuccessRespEvents,
  getErrorRespEvents,
  getFieldValueFromMessage
} = require("../../util");
const {
  createPayloadMapping,
  updatePayloadMapping,
  baseEndpoint,
  isValidPlanCurrency
} = require("./config");

const identifyResponseBuilder = async (message, { Config }) => {
  const userId = getDestinationExternalID(message, "profitwellUserId");
  const userAlias = getFieldValueFromMessage(message, "userId");

  if (!userId && !userAlias) {
    throw new CustomError("userId or userAlias is required for identify", 400);
  }

  let subscriptionId = getDestinationExternalID(
    message,
    "profitwellSubscriptionId"
  );
  let subscriptionAlias =
    get(message, "traits.subscriptionAlias") ||
    get(message, "context.traits.subscriptionAlias");

  if (!subscriptionId && !subscriptionAlias) {
    throw new CustomError(
      "subscriptionId or subscriptionAlias is required for identify",
      400
    );
  }

  const targetUrl = `${baseEndpoint}/v2/users/${userId || userAlias}`;
  const res = await getSubscriptionHistory(targetUrl, {
    headers: {
      Authorization: Config.privateApiKey
    }
  });

  let payload;
  const response = defaultRequestConfig();

  if (res.success) {
    // some() breaks if the callback returns true
    let subscriptionFound = true;
    const valFound = res.response.some(element => {
      if (userId === element.user_id || userAlias === element.user_alias) {
        if (subscriptionId === element.subscription_id) {
          subscriptionId = element.subscription_id;
          subscriptionFound = true;
          return true;
        }
        if (subscriptionAlias === element.subscription_alias) {
          subscriptionAlias = element.subscription_alias;
          subscriptionFound = true;
          return true;
        }
        subscriptionFound = false;
      }
      return false;
    });

    // for a given userId, subscriptionId not found
    if (!subscriptionFound) {
      payload = constructPayload(message, createPayloadMapping);
      payload = {
        ...payload,
        user_id: userId,
        user_alias: userAlias
      };
      if (!isValidPlanCurrency(payload)) {
        payload.plan_currency = null;
      }
      response.method = defaultPostRequestConfig.requestMethod;
      response.endpoint = `${baseEndpoint}/v2/subscriptions`;
      response.headers = {
        "Content-Type": "application/json",
        Authorization: Config.privateApiKey
      };
      response.body.JSON = removeUndefinedAndNullValues(payload);
      return response;
    }

    // userId and SubscriptionId is found
    if (valFound) {
      payload = constructPayload(message, updatePayloadMapping);
      response.method = defaultPutRequestConfig.requestMethod;
      response.endpoint = `${baseEndpoint}/v2/subscriptions/${subscriptionId ||
        subscriptionAlias}`;
      response.headers = {
        "Content-Type": "application/json",
        Authorization: Config.privateApiKey
      };
      response.body.JSON = removeUndefinedAndNullValues(payload);
      return response;
    }
  }

  if (res.response.response.status !== 404) {
    throw new CustomError(
      "Failed to get subscription history for a user",
      res.response.response.status
    );
  }
  logger.debug("Failed to get subscription history for a user");

  // userId and subscriptionId does not exist
  // create new subscription for new user
  payload = constructPayload(message, createPayloadMapping);
  payload = {
    ...payload,
    user_alias: userAlias
  };
  if (!isValidPlanCurrency(payload)) {
    payload.plan_currency = null;
  }
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = `${baseEndpoint}/v2/subscriptions`;
  response.headers = {
    "Content-Type": "application/json",
    Authorization: Config.privateApiKey
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

const process = async event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new CustomError("invalid message type. Aborting.", 400);
  }

  if (!destination.Config.privateApiKey) {
    throw new CustomError("Private API Key not found. Aborting.", 400);
  }

  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, destination);
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
