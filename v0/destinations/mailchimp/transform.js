/* eslint-disable camelcase */
const { SHA256 } = require("crypto-js");
const get = require("get-value");
const set = require("set-value");
const { EventType } = require("../../../constants");
const axios = require("axios");
const md5 = require("md5");
const {
  CustomError,
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  removeUndefinedAndNullValues,
  extractCustomFields,
  isEmptyObject,
  flattenJson
} = require("../../util");
const { getMailChimpEndpoint } = require("./utils");
const logger = require("../../../logger");
const {
  identifyMapping,
  MAX_BATCH_SIZE,
  MAILCHIMP_IDENTIFY_EXCLUSION,
  SUBSCRIPTION_STATUS,
  VALID_STATUSES
} = require("./config");

async function checkIfMailExists(apiKey, datacenterId, audienceId, email) {
  if (!email) {
    return false;
  }
  const hash = md5(email);
  const url = `${getMailChimpEndpoint(
    datacenterId,
    audienceId
  )}/members/${hash}`;

  let status = false;
  try {
    await axios.get(url, {
      auth: {
        username: "apiKey",
        password: `${apiKey}`
      }
    });
    status = true;
  } catch (error) {
    logger.error("axios error");
  }
  return status;
}

async function checkIfDoubleOptIn(apiKey, datacenterId, audienceId) {
  let response;
  const url = `${getMailChimpEndpoint(datacenterId, audienceId)}`;
  try {
    response = await axios.get(url, {
      auth: {
        username: "apiKey",
        password: `${apiKey}`
      }
    });
  } catch (error) {
    throw new CustomError(
      "User does not have access to the requested operation",
      error.status || 400
    );
  }
  return !!response.data.double_optin;
}

const identifyResponseBuilder = async (message, { Config }) => {
  // get common top level rawPayload
  const payload = constructPayload(message, identifyMapping);
  const { apiKey, datacenterId } = Config;
  let { audienceId } = Config;

  const { email } = message.context.traits;

  if (!email) {
    throw new CustomError("Email is required for identify calls ", 400);
  }

  const mailChimpExists = get(message, "context.MailChimp");
  if (mailChimpExists) {
    const listIdExists = get(message, "context.MailChimp.listId");
    if (listIdExists) {
      audienceId = message.context.MailChimp.listId;
    }
  }

  // const BATCH_ENDPOINT = `${BASE_URL}?skip_merge_validation=<${skip_merge_validation}&skip_duplicate_check=${skip_duplicate_check}`;

  let customMergeFields = {};
  customMergeFields = extractCustomFields(
    message,
    customMergeFields,
    ["context.traits"],
    MAILCHIMP_IDENTIFY_EXCLUSION
  );

  if (!isEmptyObject(customMergeFields)) {
    customMergeFields = flattenJson(customMergeFields);
    payload.merge_fields = { ...payload.merge_fields, ...customMergeFields };
  }

  // if (payload.params) {
  //   payload.params = removeUndefinedAndNullValues(payload.params);
  // }

  // if (isEmptyObject(payload.params)) {
  //   delete payload.params;
  // }

  const emailExists = await checkIfMailExists(
    apiKey,
    datacenterId,
    audienceId,
    email
  );

  const response = defaultRequestConfig();

  if (emailExists) {
    const hash = md5(email);
    response.endpoint = `${getMailChimpEndpoint(
      datacenterId,
      audienceId
    )}/members/${hash}`;

    response.method = defaultPutRequestConfig.requestMethod;

    if (mailChimpExists) {
      const subscriptionStatusExists = get(
        message,
        "context.MailChimp.subscriptionStatus"
      );
      if (subscriptionStatusExists) {
        payload.status = message.context.MailChimp.subscriptionStatus;
      }
    }
  } else {
    response.endpoint = `${getMailChimpEndpoint(
      datacenterId,
      audienceId
    )}/members`;
    response.method = defaultPostRequestConfig.requestMethod;
    const isDoubleOptin = await checkIfDoubleOptIn(
      apiKey,
      datacenterId,
      audienceId
    );
    payload.status = isDoubleOptin
      ? SUBSCRIPTION_STATUS.pending
      : SUBSCRIPTION_STATUS.subscribed;
  }

  if (payload.status && !VALID_STATUSES.includes(payload.status)) {
    throw new CustomError(
      "The status must be one of [subscribed, unsubscribed, cleaned, pending, transactional]",
      400
    );
  }

  const basicAuth = Buffer.from(`apiKey:${apiKey}`).toString("base64");
  // build response
  response.headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${basicAuth}`
  };

  response.body.JSON = payload;
  response.userId = message.userId || message.anonymousId;
  return response;
};

const process = async event => {
  const { message, destination } = event;

  const destConfig = destination.Config;
  if (!destConfig.apiKey) {
    throw new CustomError("API Key not found. Aborting ", 400);
  }

  if (!destConfig.audienceId) {
    throw new CustomError("Audience Id not found. Aborting", 400);
  }

  if (!destConfig.datacenterId) {
    throw new CustomError("DataCenter Id not found. Aborting", 400);
  }

  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
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
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  return response;
};

module.exports = { process };
