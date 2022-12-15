const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  getSubscriptionHistory,
  unixTimestampOrError,
  isValidPlanCurrency
} = require("./utils");
const {
  CustomError,
  getDestinationExternalID,
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  removeUndefinedAndNullValues,
  constructPayload,
  getFieldValueFromMessage,
  simpleProcessRouterDest
} = require("../../util");
const {
  createPayloadMapping,
  updatePayloadMapping,
  BASE_ENDPOINT
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

  const targetUrl = `${BASE_ENDPOINT}/v2/users/${userId || userAlias}/`;
  const res = await getSubscriptionHistory(targetUrl, {
    headers: {
      Authorization: Config.privateApiKey
    }
  });

  let payload;
  const response = defaultRequestConfig();

  if (res.success) {
    let subscriptionFound = true;
    const valFound = res.response.data.some(element => {
      if (userId && userId === element.user_id) {
        if (subscriptionId && subscriptionId === element.subscription_id) {
          subscriptionId = element.subscription_id;
          subscriptionFound = true;
          return true;
        }
        if (
          !subscriptionId &&
          subscriptionAlias &&
          subscriptionAlias === element.subscription_alias
        ) {
          subscriptionAlias = element.subscription_alias;
          subscriptionFound = true;
          return true;
        }
        subscriptionFound = false;
      } else if (userAlias && userAlias === element.user_alias) {
        if (subscriptionId && subscriptionId === element.subscription_id) {
          subscriptionId = element.subscription_id;
          subscriptionFound = true;
          return true;
        }
        if (
          !subscriptionId &&
          subscriptionAlias &&
          subscriptionAlias === element.subscription_alias
        ) {
          subscriptionAlias = element.subscription_alias;
          subscriptionFound = true;
          return true;
        }
        subscriptionFound = false;
      }
      return false;
    });

    if (!subscriptionFound) {
      // for a given userId, subscriptionId not found
      // dropping event if profitwellSubscriptionId (externalId) did not
      // match with any subscription_id at destination
      if (subscriptionId) {
        throw new CustomError("profitwell subscription_id not found", 400);
      }
      payload = constructPayload(message, createPayloadMapping);
      payload = {
        ...payload,
        user_id: userId,
        user_alias: userAlias
      };
      if (
        payload.plan_interval &&
        !(
          payload.plan_interval.toLowerCase() === "month" ||
          payload.plan_interval.toLowerCase() === "year"
        )
      ) {
        throw new CustomError("invalid format for planInterval. Aborting", 400);
      }
      if (
        payload.plan_currency &&
        !isValidPlanCurrency(payload.plan_currency)
      ) {
        payload.plan_currency = null;
      }
      if (
        payload.status &&
        !(
          payload.status.toLowerCase() === "active" ||
          payload.status.toLowerCase() === "trialing"
        )
      ) {
        payload.status = null;
      }
      payload.effective_date = unixTimestampOrError(
        payload.effective_date,
        message.originalTimestamp
      );
      response.method = defaultPostRequestConfig.requestMethod;
      response.endpoint = `${BASE_ENDPOINT}/v2/subscriptions/`;
      response.headers = {
        "Content-Type": "application/json",
        Authorization: Config.privateApiKey
      };
      response.body.JSON = removeUndefinedAndNullValues(payload);
      return response;
    }

    // for a given userId, subscription is found at dest.
    if (valFound) {
      payload = constructPayload(message, updatePayloadMapping);
      if (
        payload.plan_interval &&
        !(
          payload.plan_interval.toLowerCase() === "month" ||
          payload.plan_interval.toLowerCase() === "year"
        )
      ) {
        throw new CustomError("invalid format for planInterval. Aborting", 400);
      }
      if (
        payload.status &&
        !(
          payload.status.toLowerCase() === "active" ||
          payload.status.toLowerCase() === "trialing"
        )
      ) {
        payload.status = null;
      }
      payload.effective_date = unixTimestampOrError(
        payload.effective_date,
        message.originalTimestamp
      );
      response.method = defaultPutRequestConfig.requestMethod;
      response.endpoint = `${BASE_ENDPOINT}/v2/subscriptions/${subscriptionId ||
        subscriptionAlias}/`;
      response.headers = {
        "Content-Type": "application/json",
        Authorization: Config.privateApiKey
      };
      response.body.JSON = removeUndefinedAndNullValues(payload);
      return response;
    }
  }

  // handler for other destination side errors
  const error = res.response;
  if (error.response.status !== 404) {
    throw new CustomError(
      `Failed to get subscription history for a user (${error.response.statusText})`,
      res.response.response.status
    );
  }

  // drop event if profitwellUserId (externalId) did not match with any user_id
  if (userId) {
    throw new CustomError("no user found for profitwell user_id", 400);
  }

  // create new subscription for new user with given userAlias
  payload = constructPayload(message, createPayloadMapping);
  payload = {
    ...payload,
    user_alias: userAlias
  };
  if (
    payload.plan_interval &&
    !(
      payload.plan_interval.toLowerCase() === "month" ||
      payload.plan_interval.toLowerCase() === "year"
    )
  ) {
    throw new CustomError("invalid format for planInterval. Aborting", 400);
  }
  if (payload.plan_currency && !isValidPlanCurrency(payload.plan_currency)) {
    payload.plan_currency = null;
  }
  if (
    payload.status &&
    !(
      payload.status.toLowerCase() === "active" ||
      payload.status.toLowerCase() === "trialing"
    )
  ) {
    payload.status = null;
  }
  payload.effective_date = unixTimestampOrError(
    payload.effective_date,
    message.originalTimestamp
  );
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = `${BASE_ENDPOINT}/v2/subscriptions/`;
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
  const respList = await simpleProcessRouterDest(inputs, "PROFITWELL", process);
  return respList;
};

module.exports = { process, processRouterDest };
