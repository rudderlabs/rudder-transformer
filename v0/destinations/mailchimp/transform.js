/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
const get = require("get-value");
const axios = require("axios");
const md5 = require("md5");
const { isDefinedAndNotNull } = require("rudder-transformer-cdk/build/utils");
const { EventType } = require("../../../constants");
const {
  CustomError,
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  addExternalIdToTraits,
  getFieldValueFromMessage,
  getIntegrationsObj,
  isDefined,
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  getErrorRespEvents
} = require("../../util");
const { getMailChimpEndpoint } = require("./utils");
const logger = require("../../../logger");
const { MappedToDestinationKey } = require("../../../constants");
const {
  MAILCHIMP_IDENTIFY_EXCLUSION,
  SUBSCRIPTION_STATUS,
  VALID_STATUSES,
  mergeConfig
} = require("./config");
// const config = require("./config");

// Converts to upper case and removes spaces
function filterTagValue(tag) {
  const maxLength = 10;
  const newTag = tag.replace(/[^\w\s]/gi, "");
  if (newTag.length > maxLength) {
    return newTag.slice(0, 10);
  }
  return newTag.toUpperCase();
}

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

const mergeAdditionalTraitsFields = (traits, mergedFieldPayload) => {
  if (isDefined(traits)) {
    Object.keys(traits).forEach(trait => {
      if (MAILCHIMP_IDENTIFY_EXCLUSION.indexOf(trait) === -1) {
        const tag = filterTagValue(trait);
        mergedFieldPayload[tag] = traits[trait];
      }
    });
  }
  return mergedFieldPayload;
};

const processPayloadBuild = async (
  message,
  updateSubscription,
  primaryPayload,
  Config,
  emailExists,
  audienceId,
  enableMergeFields
) => {
  const traits = getFieldValueFromMessage(message, "traits");
  const email = getFieldValueFromMessage(message, "email");
  const mergedFieldPayload = constructPayload(message, mergeConfig);
  const { apiKey, datacenterId } = Config;
  let allMergedFields;

  if (isDefinedAndNotNull(updateSubscription) && emailExists) {
    if (isDefined(enableMergeFields) && enableMergeFields === true) {
      allMergedFields = mergeAdditionalTraitsFields(traits, mergedFieldPayload);
    } else {
      allMergedFields = null;
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (email) {
      allMergedFields = mergeAdditionalTraitsFields(traits, mergedFieldPayload);
    }
  }

  primaryPayload.merge_fields = allMergedFields;
  if (isDefinedAndNotNull(updateSubscription) && emailExists) {
    Object.keys(updateSubscription).forEach(field => {
      if (field === "subscriptionStatus") {
        primaryPayload.status = updateSubscription[field];
      } else {
        primaryPayload[field] = updateSubscription[field];
      }
    });
  } else if (!emailExists) {
    const isDoubleOptin = await checkIfDoubleOptIn(
      apiKey,
      datacenterId,
      audienceId
    );
    primaryPayload.status = isDoubleOptin
      ? SUBSCRIPTION_STATUS.pending
      : SUBSCRIPTION_STATUS.subscribed;
  }
  if (
    primaryPayload.status &&
    !VALID_STATUSES.includes(primaryPayload.status)
  ) {
    throw new CustomError(
      "The status must be one of [subscribed, unsubscribed, cleaned, pending, transactional]",
      400
    );
  }

  return removeUndefinedAndNullValues(primaryPayload);
};
const formFinalEndPoint = (datacenterId, audienceId, emailExists, email) => {
  let endpoint;
  if (emailExists) {
    const hash = md5(email);
    endpoint = `${getMailChimpEndpoint(
      datacenterId,
      audienceId
    )}/members/${hash}`;
  } else {
    endpoint = `${getMailChimpEndpoint(datacenterId, audienceId)}/members`;
  }
  return endpoint;
};
const responseBuilderSimple = async (
  finalPayload,
  message,
  messageConfig,
  audienceId,
  emailExists
) => {
  const { datacenterId, apiKey } = messageConfig;
  const response = defaultRequestConfig();
  const email = getFieldValueFromMessage(message, "email");
  response.endpoint = formFinalEndPoint(
    datacenterId,
    audienceId,
    emailExists,
    email
  );
  response.method = emailExists
    ? defaultPutRequestConfig.requestMethod
    : defaultPostRequestConfig.requestMethod;
  response.body.JSON = finalPayload;
  const basicAuth = Buffer.from(`apiKey:${apiKey}`).toString("base64");
  if (finalPayload.status && !VALID_STATUSES.includes(finalPayload.status)) {
    throw new CustomError(
      "The status must be one of [subscribed, unsubscribed, cleaned, pending, transactional]",
      400
    );
  }
  return {
    ...response,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth}`
    },
    userId: message.userId ? message.userId : message.anonymousId
  };
};

const identifyResponseBuilder = async (message, { Config }) => {
  const mappedToDestination = get(message, MappedToDestinationKey);
  const { apiKey, datacenterId, enableMergeFields } = Config;

  const primaryPayload = {
    email_address: getFieldValueFromMessage(message, "email")
  };

  const audienceId = get(message, "context.MailChimp")
    ? get(message, "context.MailChimp.listId")
      ? message.context.MailChimp.listId
      : Config.audienceId
    : Config.audienceId;

  const email = getFieldValueFromMessage(message, "email");
  if (!email) {
    throw new CustomError("email is required for identify", 400);
  }
  const emailExists = await checkIfMailExists(
    apiKey,
    datacenterId,
    audienceId,
    email
  );

  if (mappedToDestination) {
    // build response with existing traits only
    addExternalIdToTraits(message);
    return responseBuilderSimple(
      getFieldValueFromMessage(message, "traits"),
      message,
      Config,
      audienceId,
      emailExists
    );
  }

  const updateSubscription = getIntegrationsObj(message, "mailchimp");

  const mergedFieldPayload = await processPayloadBuild(
    message,
    updateSubscription,
    primaryPayload,
    Config,
    emailExists,
    audienceId,
    enableMergeFields
  );

  return responseBuilderSimple(
    mergedFieldPayload,
    message,
    Config,
    audienceId,
    emailExists
  );
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
      throw new CustomError(
        `message type ${messageType} is not supported`,
        400
      );
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
