const get = require("get-value");
const { EventType } = require("../../../constants");
const { getSubscriptionHistory } = require("./nethandler");
const {
  CustomError,
  getDestinationExternalID,
  isDefinedAndNotNull,
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  removeUndefinedAndNullValues,
  constructPayload
} = require("../../util");
const { ConfigCategory, mappingConfig, baseEndpoint } = require("./config");

const identifyResponseBuilder = async (message, { Config }) => {
  const response = defaultRequestConfig();

  let subscriptionId = getDestinationExternalID(
    message,
    "profitwellSubscriptionId"
  );
  let subscriptionAlias =
    get(message, "traits.subscriptionAlias") ||
    get(message, "context.traits.subscriptionAlias");

  let payload;
  if (
    isDefinedAndNotNull(subscriptionId) ||
    isDefinedAndNotNull(subscriptionAlias)
  ) {
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

  // If SubscriptionId or SubscriptionAlias is not given
  const user_id = getDestinationExternalID(message, "profitwellUserId");
  const user_alias =
    get(message, "traits.userId") ||
    get(message, "context.traits.userId") ||
    get(message, "traits.anonymousId") ||
    get(message, "context.traits.anonymousId");

  if (user_id || user_alias) {
    let res;
    const targetUrl = `${baseEndpoint}/v2/users/${user_id || user_alias}`;
    try {
      res = await getSubscriptionHistory(targetUrl, null, {
        headers: {
          Authorization: Config.privateApiKey
        }
      });
    } catch (err) {
      throw new CustomError(
        "Failed to get user's subscription history",
        err.response.status || 400
      );
    }

    // user_id exists in response payload
    // some() breaks if the callback returns true
    const valFound = res.some(element => {
      if (element.user_id || element.user_alias) {
        if (element.subscription_id) {
          subscriptionId = element.subscription_id;
          return true;
        }
        if (element.subscription_alias) {
          subscriptionAlias = element.subscription_alias;
          return true;
        }
      }
      return false;
    });

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

  // subscriptionId or user_id does not exist
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
    Authorization: Config.Authorization
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

module.exports = { process };
