const { get } = require('lodash');
const { EventType } = require('../../../constants');
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  getSuccessRespEvents,
  getErrorRespEvents,
  constructPayload,
  defaultBatchRequestConfig,
  removeUndefinedAndNullValues,
  batchMultiplexedEvents,
  handleRtTfSingleEventError,
} = require('../../util');
const {
  processUserPayload,
  processCommonPayload,
  deduceEventName,
  postProcessEcomFields,
  checkUserPayloadValidity,
  processHashedUserPayload,
  validateInput,
} = require('./utils');

const {
  ENDPOINT,
  MAX_BATCH_SIZE,
  USER_CONFIGS,
  getV5EventsEndpoint,
  API_VERSION,
} = require('./config');
const { InstrumentationError } = require('../../util/errorTypes');

const responseBuilderSimple = (finalPayload, { Config }) => {
  const { apiVersion = API_VERSION.v3, adAccountId, conversionToken } = Config;
  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(finalPayload);
  response.headers = { 'Content-Type': 'application/json' };

  if (apiVersion === API_VERSION.v5) {
    response.endpoint = getV5EventsEndpoint(adAccountId);
    response.headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${conversionToken}`,
    };
  }

  return response;
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
  const { appId, advertiserId, deduplicationKey, sendingUnHashedData, sendExternalId, apiVersion } =
    Config;
  // ref: https://s.pinimg.com/ct/docs/conversions_api/dist/v3.html
  const processedCommonPayload = processCommonPayload(message);

  processedCommonPayload.event_id = get(message, `${deduplicationKey}`) || message.messageId;
  const userPayload = constructPayload(message, USER_CONFIGS, 'pinterest');

  if (!sendExternalId) {
    delete userPayload.external_id;
  }

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

  if (apiVersion === API_VERSION.v5) {
    delete response.advertiser_id;
  }

  if (messageType === EventType.TRACK) {
    response = postProcessEcomFields(message, response);
  }

  return response;
};

const process = (event) => {
  const toSendEvents = [];
  const respList = [];
  const deducedEventNameArray = [];
  const { message, destination } = event;
  const messageType = message.type?.toLowerCase();

  validateInput(message, destination);

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
    respList.push(responseBuilderSimple(sendEvent, destination));
  });
  return respList;
};

const generateBatchedPayloadForArray = (events) => {
  const { batchedRequest } = defaultBatchRequestConfig();
  const batchResponseList = events.map((event) => event.body.JSON);

  batchedRequest.body.JSON = { data: batchResponseList };
  batchedRequest.endpoint = events[0].endpoint;
  batchedRequest.headers = events[0].headers;

  return batchedRequest;
};

const batchEvents = (successRespList) => {
  const batchResponseList = [];
  const batchedEvents = batchMultiplexedEvents(successRespList, MAX_BATCH_SIZE);
  batchedEvents.forEach((batch) => {
    const batchedRequest = generateBatchedPayloadForArray(batch.events);
    batchResponseList.push(
      getSuccessRespEvents(batchedRequest, batch.metadata, batch.destination, true),
    );
  });

  return batchResponseList;
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

  let batchResponseList = [];
  if (successRespList.length > 0) {
    batchResponseList = batchEvents(successRespList);
  }

  return [...batchResponseList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
