const { get } = require('lodash');
const { defaultPostRequestConfig, handleRtTfSingleEventError } = require('../../util');
const { EventType } = require('../../../constants');
const {
  defaultRequestConfig,
  getSuccessRespEvents,
  getErrorRespEvents,
  constructPayload,
  defaultBatchRequestConfig,
  removeUndefinedAndNullValues,
  batchMultiplexedEvents,
} = require('../../util');
const {
  processUserPayload,
  processCommonPayload,
  deduceEventName,
  postProcessEcomFields,
  checkUserPayloadValidity,
  processHashedUserPayload,
} = require('./utils');

const { ENDPOINT, MAX_BATCH_SIZE, USER_CONFIGS } = require('./config');
const { ConfigurationError, InstrumentationError } = require('../../util/errorTypes');

const responseBuilderSimple = (finalPayload) => {
  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(finalPayload);
  return {
    ...response,
    headers: {
      'Content-Type': 'application/json',
    },
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
const commonFieldResponseBuilder = (message, { Config }, messageType, eventName) => {
  let processedUserPayload;
  const { appId, advertiserId, deduplicationKey, sendingUnHashedData } = Config;
  // ref: https://s.pinimg.com/ct/docs/conversions_api/dist/v3.html
  const processedCommonPayload = processCommonPayload(message);

  processedCommonPayload.event_id = get(message, `${deduplicationKey}`) || message.messageId;
  const userPayload = constructPayload(message, USER_CONFIGS, 'pinterest');
  const isValidUserPayload = checkUserPayloadValidity(userPayload);
  if (isValidUserPayload === false) {
    throw new InstrumentationError(
      'It is required at least one of em, hashed_maids or pair of client_ip_address and client_user_agent',
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
    user_data: processedUserPayload,
  };

  if (messageType === EventType.TRACK) {
    response = postProcessEcomFields(message, response);
  }
  // return responseBuilderSimple(response);
  return response;
};

const process = (event) => {
  const toSendEvents = [];
  const respList = [];
  const deducedEventNameArray = [];
  const { message, destination } = event;
  const messageType = message.type?.toLowerCase();

  if (!destination.Config?.advertiserId) {
    throw new ConfigurationError('Advertiser Id not found. Aborting');
  }

  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  switch (messageType) {
    case EventType.PAGE:
    case EventType.SCREEN:
    case EventType.TRACK:
      deducedEventNameArray.push(...deduceEventName(message, destination.Config));
      deducedEventNameArray.forEach((eventName) => {
        toSendEvents.push(commonFieldResponseBuilder(message, destination, messageType, eventName));
      });

      break;
    default:
      throw new InstrumentationError(`message type ${messageType} is not supported`);
  }

  toSendEvents.forEach((sendEvent) => {
    respList.push(responseBuilderSimple(sendEvent));
  });
  return respList;
};

const generateBatchedPayloadForArray = (events) => {
  const { batchedRequest } = defaultBatchRequestConfig();
  const batchResponseList = events.map((event) => event.body.JSON);

  batchedRequest.body.JSON = {
    data: batchResponseList,
  };
  batchedRequest.endpoint = ENDPOINT;
  batchedRequest.headers = {
    'Content-Type': 'application/json',
  };
  return batchedRequest;
};

const processRouterDest = (inputs, reqMetadata) => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, 'Invalid event array');
    return [respEvents];
  }

  const successRespList = [];
  const batchErrorRespList = [];
  inputs.forEach((input) => {
    try {
      let resp = input.message;
      // transform if not already done
      if (!input.message.statusCode) {
        resp = process(input);
      }

      successRespList.push({
        message: Array.isArray(resp) ? resp : [resp],
        metadata: input.metadata,
        destination: input.destination,
      });
    } catch (error) {
      batchErrorRespList.push(handleRtTfSingleEventError(input, error, reqMetadata));
    }
  });

  const batchResponseList = [];
  if (successRespList.length > 0) {
    const batchedEvents = batchMultiplexedEvents(successRespList, MAX_BATCH_SIZE);
    batchedEvents.forEach((batch) => {
      const batchedRequest = generateBatchedPayloadForArray(batch.events);
      batchResponseList.push(
        getSuccessRespEvents(batchedRequest, batch.metadata, batch.destination, true),
      );
    });
  }

  return [...batchResponseList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
