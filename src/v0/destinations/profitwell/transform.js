const { EventType } = require('../../../constants');
const {
  getSubscriptionHistory,
  unixTimestampOrError,
  isValidPlanCurrency,
  validatePayloadAndRetunImpIds,
  createMissingSubscriptionResponse,
  createResponseForSubscribedUser,
} = require('./utils');
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  constructPayload,
  simpleProcessRouterDest,
} = require('../../util');
const { BASE_ENDPOINT, createPayloadMapping } = require('./config');
const { NetworkError, ConfigurationError, InstrumentationError } = require('../../util/errorTypes');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');

const identifyResponseBuilder = async (message, { Config }) => {
  const { userId, userAlias, subscriptionId, subscriptionAlias } =
    validatePayloadAndRetunImpIds(message);
  let finalSubscriptionId = subscriptionId;
  let finalSubscriptionAlias = subscriptionAlias;

  const targetUrl = `${BASE_ENDPOINT}/v2/users/${userId || userAlias}/`;
  const res = await getSubscriptionHistory(targetUrl, {
    headers: {
      Authorization: Config.privateApiKey,
    },
  });

  let payload;
  const response = defaultRequestConfig();

  if (res.success) {
    let subscriptionFound = true;
    const valFound = res.response.data.some((element) => {
      if (
        (userId && userId === element.user_id) ||
        (userAlias && userAlias === element.user_alias)
      ) {
        if (finalSubscriptionId && finalSubscriptionId === element.subscription_id) {
          finalSubscriptionId = element.subscription_id;
          subscriptionFound = true;
          return true;
        }
        if (
          !finalSubscriptionId &&
          finalSubscriptionAlias &&
          finalSubscriptionAlias === element.subscription_alias
        ) {
          finalSubscriptionAlias = element.subscription_alias;
          subscriptionFound = true;
          return true;
        }
        subscriptionFound = false;
      }
      return false;
    });

    if (!subscriptionFound) {
      return createMissingSubscriptionResponse(
        userId,
        userAlias,
        finalSubscriptionId,
        finalSubscriptionAlias,
        message,
        Config,
      );
    }

    // for a given userId, subscription is found at dest.
    if (valFound) {
      return createResponseForSubscribedUser(
        message,
        finalSubscriptionId,
        finalSubscriptionAlias,
        Config,
      );
    }
  }

  // handler for other destination side errors
  const error = res.response;
  if (error.response.status !== 404) {
    throw new NetworkError(
      `Failed to get subscription history for a user (${error.response.statusText})`,
      error.response.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(error.response.status),
      },
      error.response,
    );
  }

  // drop event if profitwellUserId (externalId) did not match with any user_id
  if (userId) {
    throw new InstrumentationError('No user found for profitwell user_id');
  }

  // create new subscription for new user with given userAlias
  payload = constructPayload(message, createPayloadMapping);
  payload = {
    ...payload,
    user_alias: userAlias,
  };
  if (
    payload.plan_interval &&
    !(
      payload.plan_interval.toLowerCase() === 'month' ||
      payload.plan_interval.toLowerCase() === 'year'
    )
  ) {
    throw new InstrumentationError('Invalid format for planInterval. Aborting');
  }
  if (payload.plan_currency && !isValidPlanCurrency(payload.plan_currency)) {
    payload.plan_currency = null;
  }
  if (
    payload.status &&
    !(payload.status.toLowerCase() === 'active' || payload.status.toLowerCase() === 'trialing')
  ) {
    payload.status = null;
  }
  payload.effective_date = unixTimestampOrError(
    payload.effective_date,
    message.timestamp,
    message.originalTimestamp,
  );
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = `${BASE_ENDPOINT}/v2/subscriptions/`;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: Config.privateApiKey,
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

const process = async (event) => {
  const { message, destination } = event;
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  if (!destination.Config.privateApiKey) {
    throw new ConfigurationError('Private API Key not found. Aborting.');
  }

  const messageType = message.type.toLowerCase();

  let response;
  if (messageType === EventType.IDENTIFY) {
    response = await identifyResponseBuilder(message, destination);
  } else {
    throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
