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
  getValueFromMessage
} = require("../../util");
const { ConfigCategory, mappingConfig, baseEndpoint } = require("./config");

const identifyResponseBuilder = async (message, { Config }) => {
  const response = defaultRequestConfig();

  const user_id = getDestinationExternalID(message, "profitwellUserId");
  const user_alias = getValueFromMessage(message, "userId");

  if (!user_id && !user_alias) {
    logger.error("UserId must be provided");
  }

  let subscriptionId = getDestinationExternalID(
    message,
    "profitwellSubscriptionId"
  );
  let subscriptionAlias =
    get(message, "traits.subscriptionAlias") ||
    get(message, "context.traits.subscriptionAlias");

  const targetUrl = `${baseEndpoint}/v2/users/${user_id || user_alias}`;
  const res = await getSubscriptionHistory(targetUrl, {
    headers: {
      Authorization: Config.privateApiKey
    }
  });

  let payload;
  if (res.success) {
    // some() breaks if the callback returns true
    let subscriptionFound = true;
    const valFound = res.response.some(element => {
      if (user_id === element.user_id || user_alias === element.user_alias) {
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
      payload = constructPayload(
        message,
        mappingConfig[ConfigCategory.IDENTIFY_CREATE.name]
      );
      payload = {
        ...payload,
        user_id,
        user_alias
      };
      payload = removeUndefinedAndNullValues(payload);
      response.method = defaultPostRequestConfig.requestMethod;
      response.endpoint = `${baseEndpoint}/v2/subscriptions`;
      response.headers = {
        "Content-Type": "application/json",
        Authorization: Config.privateApiKey
      };
      response.body.JSON = payload;
      return response;
    }

    // userId and SubscriptionId is found
    if (valFound) {
      payload = constructPayload(
        message,
        mappingConfig[ConfigCategory.IDENTIFY_UPDATE.name]
      );
      payload = removeUndefinedAndNullValues(payload);
      response.method = defaultPutRequestConfig.requestMethod;
      response.endpoint = `${baseEndpoint}/v2/subscriptions/${subscriptionId ||
        subscriptionAlias}`;
      response.headers = {
        "Content-Type": "application/json",
        Authorization: Config.privateApiKey
      };
      response.body.JSON = payload;
      return response;
    }
  }

  // userId and subscriptionId does not exist
  // create new subscription for new user
  payload = constructPayload(
    message,
    mappingConfig[ConfigCategory.IDENTIFY_CREATE.name]
  );
  payload = {
    ...payload,
    user_alias
  };
  payload = removeUndefinedAndNullValues(payload);
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = `${baseEndpoint}/v2/subscriptions`;
  response.headers = {
    "Content-Type": "application/json",
    Authorization: Config.privateApiKey
  };
  response.body.JSON = payload;
  return response;
};

const process = async event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new CustomError(
      "Message type is not present. Aborting message.",
      400
    );
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
