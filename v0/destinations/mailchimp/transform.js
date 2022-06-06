/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
const get = require("get-value");
const md5 = require("md5");
const { isDefinedAndNotNull } = require("../../util");
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
  getErrorRespEvents,
  defaultBatchRequestConfig
} = require("../../util");
const {
  getMailChimpEndpoint,
  filterTagValue,
  checkIfMailExists,
  checkIfDoubleOptIn
} = require("./utils");

const { MappedToDestinationKey } = require("../../../constants");
const {
  MAX_BATCH_SIZE,
  MAILCHIMP_IDENTIFY_EXCLUSION,
  SUBSCRIPTION_STATUS,
  VALID_STATUSES,
  MERGE_CONFIG
} = require("./config");

const mergeAdditionalTraitsFields = (traits, mergedFieldPayload) => {
  if (isDefined(traits)) {
    Object.keys(traits).forEach(trait => {
      // if any trait field is present, other than the fixed mapping, that is passed as well.
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
  // ref: https://mailchimp.com/developer/marketing/docs/merge-fields/#structure
  const mergedFieldPayload = constructPayload(message, MERGE_CONFIG);
  const { apiKey, datacenterId } = Config;
  let allMergedFields;

  // for sending any fields other than email_address, while the email is already existing
  // enableMergeFields needs to be set to true.
  if (isDefinedAndNotNull(updateSubscription) && emailExists) {
    if (isDefined(enableMergeFields) && enableMergeFields === true) {
      allMergedFields = mergeAdditionalTraitsFields(traits, mergedFieldPayload);
    } else {
      allMergedFields = null;
    }
  } else {
    // if user sends a non-existing email, the trait fields are sent within
    // the merge_field object only

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

const stitchEndpointAndMethodForExistingEmails = (
  datacenterId,
  audienceId,
  email,
  response
) => {
  // ref: https://mailchimp.com/developer/marketing/api/list-members/add-or-update-list-member/
  const hash = md5(email);
  response.endpoint = `${getMailChimpEndpoint(
    datacenterId,
    audienceId
  )}/members/${hash}`;
  response.method = defaultPutRequestConfig.requestMethod;
};

const stitchEndpointAndMethodForNONExistingEmails = (
  datacenterId,
  audienceId,
  email,
  response
) => {
  // ref: https://mailchimp.com/developer/marketing/api/list-members/add-member-to-list/
  response.endpoint = `${getMailChimpEndpoint(
    datacenterId,
    audienceId
  )}/members`;
  response.method = defaultPostRequestConfig.requestMethod;
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
  if (emailExists) {
    stitchEndpointAndMethodForExistingEmails(
      datacenterId,
      audienceId,
      email,
      response
    );
  } else {
    stitchEndpointAndMethodForNONExistingEmails(
      datacenterId,
      audienceId,
      email,
      response
    );
  }

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
    userId: getFieldValueFromMessage(message, "userId")
  };
};

const identifyResponseBuilder = async (message, { Config }) => {
  const mappedToDestination = get(message, MappedToDestinationKey);
  const { apiKey, datacenterId, enableMergeFields } = Config;
  const email = getFieldValueFromMessage(message, "email");
  let audienceId;

  if (!email) {
    throw new CustomError("email is required for identify", 400);
  }
  const primaryPayload = {
    email_address: email
  };

  if (message.context.MailChimp) {
    if (message.context.MailChimp.listId) {
      audienceId = message.context.MailChimp.listId;
    } else {
      audienceId = Config.audienceId;
    }
  } else {
    audienceId = Config.audienceId;
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
  /* 
  Integrations object is supposed to be present inside message, and is expected
  to be in the following format:
  
   "integrations": {
        "MailChimp": {
          "subscriptionStatus": "subscribed"
        }
      }
  */
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
    throw new CustomError("API Key not found. Aborting", 400);
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

function batchEvents(arrayChunks) {
  // Batching reference doc: https://mailchimp.com/developer/marketing/api/lists/
  const batchedResponseList = [];

  // list of chunks [ [..], [..] ]
  arrayChunks.forEach(chunk => {
    const batchResponseList = [];
    const metadata = [];

    // extracting destination
    // from the first event in a batch
    const { destination, message } = chunk[0];

    let batchEventResponse = defaultBatchRequestConfig();

    // Batch event into dest batch structure
    chunk.forEach(ev => {
      batchResponseList.push(ev.message.body.JSON);
      metadata.push(ev.metadata);
    });

    batchEventResponse.batchedRequest.body.JSON = {
      members: batchResponseList
    };

    const BASE_URL = `https://${destination.Config.datacenterId}.api.mailchimp.com/3.0/lists/${destination.Config.audienceId}`;

    const BATCH_ENDPOINT = `${BASE_URL}?skip_merge_validation=<false&skip_duplicate_check=true`;

    batchEventResponse.batchedRequest.endpoint = BATCH_ENDPOINT;

    const basicAuth = Buffer.from(
      `apiKey:${destination.Config.apiKey}`
    ).toString("base64");

    batchEventResponse.batchedRequest.userId = message.userId
      ? message.userId
      : message.anonymousId;

    batchEventResponse.batchedRequest.headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth}`
    };
    batchEventResponse = {
      ...batchEventResponse,
      metadata,
      destination
    };
    batchedResponseList.push(
      getSuccessRespEvents(
        batchEventResponse.batchedRequest,
        batchEventResponse.metadata,
        batchEventResponse.destination,
        true
      )
    );
  });

  return batchedResponseList;
}

function getEventChunks(event, identifyResponseList, eventsChunk) {
  // build eventsChunk of MAX_BATCH_SIZE
  eventsChunk.push(event);
}

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const identifyResponseList = []; // list containing single track event in batched format
  let eventsChunk = []; // temporary variable to divide payload into chunks
  const arrayChunks = []; // transformed payload of (n) batch size
  const errorRespList = [];
  await Promise.all(
    inputs.map(async (event, index) => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          getEventChunks(event, identifyResponseList, eventsChunk);
          // slice according to batch size
          if (
            eventsChunk.length &&
            (eventsChunk.length >= MAX_BATCH_SIZE ||
              index === inputs.length - 1)
          ) {
            arrayChunks.push(eventsChunk);
            eventsChunk = [];
          }
        } else {
          // if not transformed
          getEventChunks(
            {
              message: await process(event),
              metadata: event.metadata,
              destination: event.destination
            },
            identifyResponseList,
            eventsChunk
          );
          // slice according to batch size
          if (
            eventsChunk.length &&
            (eventsChunk.length >= MAX_BATCH_SIZE ||
              index === inputs.length - 1)
          ) {
            arrayChunks.push(eventsChunk);
            eventsChunk = [];
          }
        }
      } catch (error) {
        errorRespList.push(
          getErrorRespEvents(
            [event.metadata],
            error.response ? error.response.status : 400,
            error.message || "Error occurred while processing payload."
          )
        );
      }
    })
  );

  let batchedResponseList = [];
  if (arrayChunks.length) {
    batchedResponseList = await batchEvents(arrayChunks);
  }
  return [
    ...batchedResponseList.concat(identifyResponseList),
    ...errorRespList
  ];
};

module.exports = { process, processRouterDest };
