const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  getSubscriptionHistory,
  unixTimestampOrError,
  isValidPlanCurrency
} = require("./utils");
const {
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
  BASE_ENDPOINT,
  createPayloadMapping,
  updatePayloadMapping
} = require("./config");
const {
  NetworkError,
  ConfigurationError,
  InstrumentationError,
  NetworkInstrumentationError
} = require("../../util/errorTypes");
const { getDynamicErrorType } = require("../../../adapters/utils/networkUtils");
const tags = require("../../util/tags");

const identifyResponseBuilder = async (message, { Config }) => {
  const userId = getDestinationExternalID(message, "profitwellUserId");
  const userAlias = getFieldValueFromMessage(message, "userId");

  if (!userId && !userAlias) {
    throw new InstrumentationError(
      "userId or userAlias is required for identify"
    );
  }

  let subscriptionId = getDestinationExternalID(
    message,
    "profitwellSubscriptionId"
  );
  let subscriptionAlias =
    get(message, "traits.subscriptionAlias") ||
    get(message, "context.traits.subscriptionAlias");

  if (!subscriptionId && !subscriptionAlias) {
    throw new InstrumentationError(
      "subscriptionId or subscriptionAlias is required for identify"
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
        throw new NetworkInstrumentationError(
          "Profitwell subscription_id not found"
        );
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
        throw new InstrumentationError(
          "invalid format for planInterval. Aborting"
        );
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
        throw new InstrumentationError(
          "invalid format for planInterval. Aborting"
        );
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
    throw new NetworkError(
      `Failed to get subscription history for a user (${error.response.statusText})`,
      error.response.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(error.response.status)
      },
      error.response
    );
  }

  // drop event if profitwellUserId (externalId) did not match with any user_id
  if (userId) {
    throw new InstrumentationError("No user found for profitwell user_id");
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
    throw new InstrumentationError("Invalid format for planInterval. Aborting");
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
    throw new InstrumentationError("Event type is required");
  }

  if (!destination.Config.privateApiKey) {
    throw new ConfigurationError("Private API Key not found. Aborting.");
  }

  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, destination);
      break;
    default:
      throw new InstrumentationError(
        `message type ${messageType} not supported`
      );
  }
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
