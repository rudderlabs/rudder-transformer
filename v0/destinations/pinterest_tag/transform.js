const _ = require("lodash");
const { get } = require("lodash");
const { defaultPostRequestConfig } = require("../../util");
const { EventType } = require("../../../constants");
const {
  CustomError,
  defaultRequestConfig,
  getSuccessRespEvents,
  getErrorRespEvents,
  constructPayload,
  defaultBatchRequestConfig,
  removeUndefinedAndNullValues
} = require("../../util");
const {
  processUserPayload,
  processCommonPayload,
  deduceEventName,
  postProcessEcomFields,
  checkUserPayloadValidity,
  processHashedUserPayload
} = require("./utils");

const { ENDPOINT, MAX_BATCH_SIZE, USER_CONFIGS } = require("./config");

const responseBuilderSimple = finalPayload => {
  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(finalPayload);
  return {
    ...response,
    headers: {
      "Content-Type": "application/json"
    }
  };
};

/**
 *
 * @param {*} message
 * @param {*} destination.Config
 * @param {*} messageType
 * @param {*} eventName
 * @returns the output of each input payload.
 * message deduplication logic looks like below:
 * This facility is provided *only* for the users who are using the *new configuration*.
 * if  "enableDeduplication" is set to *true* and "deduplicationKey" is set via webapp, that key value will be
 * sent as "event_id". On it's absence it will fallback to "messageId".
 * And if "enableDeduplication" is set to false, it will fallback to "messageId"
 */
const commonFieldResponseBuilder = (
  message,
  { Config },
  messageType,
  eventName
) => {
  let processedUserPayload;
  const { appId, advertiserId, deduplicationKey, sendingUnHashedData } = Config;
  // ref: https://s.pinimg.com/ct/docs/conversions_api/dist/v3.html
  const processedCommonPayload = processCommonPayload(message);

  processedCommonPayload.event_id =
    get(message, `${deduplicationKey}`) || message.messageId;
  const userPayload = constructPayload(message, USER_CONFIGS, "pinterest");
  const isValidUserPayload = checkUserPayloadValidity(userPayload);
  if (isValidUserPayload === false) {
    throw new CustomError(
      "It is required at least one of em, hashed_maids or pair of client_ip_address and client_user_agent.",
      400
    );
  }

  /**
   * User can configure hashed checkbox to false if they are sending already hashed data to Rudderstack
   * Otherwise we will hash data user data by default.
   */
  if (sendingUnHashedData) {
    processedUserPayload = processUserPayload(userPayload);
  } else {
    // when user is sending already hashed data to Rudderstack
    processedUserPayload = processHashedUserPayload(userPayload, message);
  }

  let response = {
    ...processedCommonPayload,
    event_name: eventName,
    app_id: appId,
    advertiser_id: advertiserId,
    user_data: processedUserPayload
  };

  if (messageType === EventType.TRACK) {
    response = postProcessEcomFields(message, response);
  }
  // return responseBuilderSimple(response);
  return response;
};

const process = event => {
  const toSendEvents = [];
  const respList = [];
  const deducedEventNameArray = [];
  const { message, destination } = event;
  const messageType = message.type?.toLowerCase();

  if (!destination.Config?.advertiserId) {
    throw new CustomError("Advertiser Id not found. Aborting", 400);
  }

  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  switch (messageType) {
    case EventType.PAGE:
    case EventType.SCREEN:
    case EventType.TRACK:
      deducedEventNameArray.push(
        ...deduceEventName(message, destination.Config)
      );
      deducedEventNameArray.forEach(eventName => {
        toSendEvents.push(
          commonFieldResponseBuilder(
            message,
            destination,
            messageType,
            eventName
          )
        );
      });

      break;
    default:
      throw new CustomError(
        `message type ${messageType} is not supported`,
        400
      );
  }

  toSendEvents.forEach(sendEvent => {
    respList.push(responseBuilderSimple(sendEvent));
  });
  return respList;
};

const generateBatchedPaylaodForArray = events => {
  let batchEventResponse = defaultBatchRequestConfig();
  const batchResponseList = [];
  const metadata = [];
  // extracting destination from the first event in a batch
  const { destination } = events[0];
  // Batch event into dest batch structure
  events.forEach(event => {
    batchResponseList.push(event.message.body.JSON);
    metadata.push(event.metadata);
  });

  batchEventResponse.batchedRequest.body.JSON = {
    data: batchResponseList
  };

  batchEventResponse.batchedRequest.endpoint =
    "https://ct.pinterest.com/events/v3";

  batchEventResponse.batchedRequest.headers = {
    "Content-Type": "application/json"
  };

  batchEventResponse = {
    ...batchEventResponse,
    metadata,
    destination
  };
  return batchEventResponse;
};

const batchEvents = successRespList => {
  const batchedResponseList = [];

  // eventChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
  const eventChunks = _.chunk(successRespList, MAX_BATCH_SIZE);
  eventChunks.forEach(chunk => {
    const batchEventResponse = generateBatchedPaylaodForArray(chunk);
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
};

const processRouterDest = inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }
  let batchResponseList = [];
  const batchErrorRespList = [];
  const successRespList = [];
  const { destination } = inputs[0];

  inputs.map(event => {
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
        const transformedMessageArray = process(event);
        transformedMessageArray.forEach(singleResponse => {
          const transformedPayload = {
            message: singleResponse,
            metadata: event.metadata,
            destination
          };
          successRespList.push(transformedPayload);
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
  });

  if (successRespList.length > 0) {
    batchResponseList = batchEvents(successRespList);
  }

  return [...batchResponseList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
