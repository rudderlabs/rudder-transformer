/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
const get = require("get-value");
const { isDefinedAndNotNull, defaultPutRequestConfig } = require("../../util");
const { EventType } = require("../../../constants");
const {
  CustomError,
  defaultRequestConfig,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  getErrorRespEvents,
  defaultBatchRequestConfig
} = require("../../util");
const {
  getBatchEndpoint,
  processPayload,
  mailChimpSubscriptionEndpoint,
  getAudienceId
} = require("./utils");

const { MappedToDestinationKey } = require("../../../constants");
const { MAX_BATCH_SIZE, VALID_STATUSES } = require("./config");

const responseBuilderSimple = async (
  finalPayload,
  email,
  Config,
  audienceId
) => {
  const { datacenterId, apiKey } = Config;
  const response = defaultRequestConfig();
  response.endpoint = mailChimpSubscriptionEndpoint(
    datacenterId,
    audienceId,
    email
  );
  response.method = defaultPutRequestConfig.requestMethod;
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
    audienceId
  };
};

const identifyResponseBuilder = async (message, { Config }) => {
  const email = getFieldValueFromMessage(message, "email");
  if (!email) {
    throw new CustomError("[Mailchimp] :: Email is required for identify", 400);
  }
  const audienceId = getAudienceId(message, Config);
  const processedPayload = await processPayload(message, Config, audienceId);
  return responseBuilderSimple(processedPayload, email, Config, audienceId);
};

const process = async event => {
  let response;
  const { message, destination } = event;
  const messageType = message.type.toLowerCase();
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

function batchEvents(successRespList) {
  // Batching reference doc: https://mailchimp.com/developer/marketing/api/lists/
  let eventsChunk = []; // temporary variable to divide payload into chunks
  const batchedResponseList = [];
  const arrayChunks = []; // transformed payload of (n) batch size

  successRespList.forEach((event, index) => {
    eventsChunk.push(event);
    if (
      eventsChunk.length === MAX_BATCH_SIZE ||
      index === successRespList.length - 1
    ) {
      arrayChunks.push(eventsChunk);
      eventsChunk = [];
    }
  });

  // list of chunks [ [..], [..] ]
  arrayChunks.forEach(chunk => {
    let batchEventResponse = defaultBatchRequestConfig();
    const batchResponseList = [];
    const metadata = [];

    // extracting destination
    // from the first event in a batch
    const { destination } = chunk[0];

    // Batch event into dest batch structure
    chunk.forEach(event => {
      batchResponseList.push(event.message.body.JSON);
      metadata.push(event.metadata);
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

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }
  let batchResponseList = [];
  const batchErrorRespList = [];
  const reverseETLEventArray = [];
  const conventionalEventArray = [];
  const successRespList = [];
  // using the first destination config for transforming the batch
  const { destination } = inputs[0];

  inputs.forEach(singleInput => {
    const { message } = singleInput;
    if (isDefinedAndNotNull(get(message, MappedToDestinationKey))) {
      reverseETLEventArray.push(singleInput);
    } else {
      conventionalEventArray.push(singleInput);
    }
  });
  // only events coming from reverseETL sources are sent to batch endPoint.
  await Promise.all(
    reverseETLEventArray.map(async event => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          successRespList.push({
            message: event.message,
            metadata: event.metadata,
            destination
          });
        } else {
          // if not transformed
          successRespList.push({
            message: await process(event),
            metadata: event.metadata,
            destination
          });
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

  // array of events recieved from sources except of reverseETL, are sent using normal router transform
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
  if (successRespList.length > 0) {
    batchResponseList = batchEvents(successRespList);
  }

  return [...batchResponseList, ...respList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
