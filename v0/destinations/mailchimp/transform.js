/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
const get = require("get-value");
const { isDefinedAndNotNull } = require("../../util");
const { EventType } = require("../../../constants");
const {
  CustomError,
  constructPayload,
  defaultRequestConfig,
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
  filterTagValue,
  checkIfMailExists,
  checkIfDoubleOptIn,
  stitchEndpointAndMethodForExistingEmails,
  stitchEndpointAndMethodForNONExistingEmails,
  getBatchEndpoint,
  mergeAdditionalTraitsFields,
  formattingAddressObject,
  ADDRESS_MANDATORY_FIELDS,
  ADDRESS_OBJ_TEMPLATE
} = require("./utils");

const { MappedToDestinationKey } = require("../../../constants");
const {
  MAX_BATCH_SIZE,
  SUBSCRIPTION_STATUS,
  VALID_STATUSES,
  MERGE_CONFIG,
  MERGE_ADDRESS
} = require("./config");

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
  // ref: https://mailchimp.com/developer/marketing/docs/merge-fields/#structure
  const mergedFieldPayload = constructPayload(message, MERGE_CONFIG);
  const mergedAddressPayload = constructPayload(message, MERGE_ADDRESS);
  const { apiKey, datacenterId } = Config;
  let mergeFields;

  // From the behaviour of destination we know that, if address
  // data is to be sent all of ["addr1", "city", "state", "zip"] are mandatory.
  if (Object.keys(mergedAddressPayload).length > 0) {
  const correctAddressPayload = formattingAddressObject(mergedAddressPayload);
  mergedFieldPayload.ADDRESS = correctAddressPayload;
  }

  // for sending any fields other than email_address, while the email is already existing
  // enableMergeFields needs to be set to true.
  if (isDefinedAndNotNull(updateSubscription) && emailExists) {
    if (isDefined(enableMergeFields) && enableMergeFields === true) {
      mergeFields = mergeAdditionalTraitsFields(traits, mergedFieldPayload);
    } else {
      mergeFields = null;
    }
  } else {
    // if user sends a non-existing email, then also enableMergeField is checked
    // eslint-disable-next-line no-lonely-if
    if (isDefined(enableMergeFields) && enableMergeFields === true) {
      mergeFields = mergeAdditionalTraitsFields(traits, mergedFieldPayload);
    }
  }
  primaryPayload = { ...primaryPayload, merge_fields: mergeFields };

  /*

  * The following block is dedicated for deducing the "status" field of the
    output payload. 

  * Status field can be manually changed "only" for the already existing subscribers.

  * If the particular email is not suscribed already, Rudderstack will check if double 
    opt-in is switched on, in that case, the status is set as "pending". Otherwise, it is 
    set to "subscribed"

  * Rudderstack is not setting any default status for already existing emails, unless appropriate 
    "subscriptionStatus" is provided via integrations object.

  */

  if (isDefinedAndNotNull(updateSubscription) && emailExists) {
    Object.keys(updateSubscription).forEach(field => {
      if (field === "subscriptionStatus") {
        // for existing emails, the status of the user can be changed manually
        // from the integrations object values
        primaryPayload.status = updateSubscription[field];
      } else {
        // other integration object fields will be sent as it is with the payload
        primaryPayload[field] = updateSubscription[field];
      }
    });
  } else if (!emailExists) {
    const isDoubleOptin = await checkIfDoubleOptIn(
      apiKey,
      datacenterId,
      audienceId
    );
    if (isDoubleOptin) {
      primaryPayload.status = SUBSCRIPTION_STATUS.pending;
    } else {
      primaryPayload.status = SUBSCRIPTION_STATUS.subscribed;
    }
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

  if (mappedToDestination) {
    /**
    Passing the traits as it is, for reverseETL sources. For these sources, 
    it is expected to have merge fields in proper format, along with appropriate status 
    as well.
     */
    addExternalIdToTraits(message);
    const updatedTraits = getFieldValueFromMessage(message, "traits")

    // 
    const mergedAddressPayload = constructPayload(message, MERGE_ADDRESS);
    if (Object.keys(mergedAddressPayload).length > 0) {
      // From the behaviour of destination we know that, if address
      // data is to be sent all of ["addr1", "city", "state", "zip"] are mandatory.
      const correctAddressPayload = formattingAddressObject(mergedAddressPayload);
      updatedTraits.ADDRESS = correctAddressPayload;
      }
    return responseBuilderSimple(
      updatedTraits,
      message,
      Config,
      audienceId,
      false // sending emailExists as false, for reverseETL, as the events will be
      // sent to the dedicated batching endpoint. Hence we do not need to deduce the
      // endpoint or method for this case.
    );
  }

  const emailExists = await checkIfMailExists(
    apiKey,
    datacenterId,
    audienceId,
    email
  );

  // const emailExists = false;

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
  console.log("in mailchimp");
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
      members: batchResponseList,

      // setting this to "true" will update user details, if a user already exists
      update_existing: true
    };

    const BATCH_ENDPOINT = getBatchEndpoint(destination.Config);

    batchEventResponse.batchedRequest.endpoint = BATCH_ENDPOINT;

    const basicAuth = Buffer.from(
      `apiKey:${destination.Config.apiKey}`
    ).toString("base64");

    batchEventResponse.batchedRequest.userId = getFieldValueFromMessage(
      message,
      "userId"
    );

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

function getEventChunks(event, eventsChunk) {
  // build eventsChunk of MAX_BATCH_SIZE
  eventsChunk.push(event);
}

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  let eventsChunk = []; // temporary variable to divide payload into chunks
  const arrayChunks = []; // transformed payload of (n) batch size
  const batchErrorRespList = [];
  let batchedResponseList = [];
  const reverseETLEventArray = [];
  const conventionalEventArray = [];

  inputs.forEach(singleInput => {
    const { message } = singleInput;
    if (isDefinedAndNotNull(get(message, MappedToDestinationKey))) {
      reverseETLEventArray.push(singleInput);
    } else {
      conventionalEventArray.push(singleInput);
    }
  });

  await Promise.all(
    reverseETLEventArray.map(async (event, index) => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          getEventChunks(event, eventsChunk);
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
        batchErrorRespList.push(
          getErrorRespEvents(
            [event.metadata],
            error.response ? error.response.status : 400,
            error.message || "Error occurred while processing payload."
          )
        );
      }
    })
  );
  const respList = await Promise.all(
    conventionalEventArray.map(async input => {
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

  if (arrayChunks.length > 0) {
    batchedResponseList = await batchEvents(arrayChunks);
  }
  return [...batchedResponseList, ...respList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
