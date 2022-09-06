const _ = require("lodash");
const { get } = require("lodash");
const { defaultPostRequestConfig } = require("../../util");
const { EventType } = require("../../../constants");
const {
  CustomError,
  defaultRequestConfig,
  isDefinedAndNotNull,
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
  setIdPriceQuantity,
  checkUserPayloadValidity,
  processHashedUserPayload
} = require("./utils");

const {
  ENDPOINT,
  MAX_BATCH_SIZE,
  USER_CONFIGS,
  CUSTOM_CONFIGS
} = require("./config");

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

const commonFieldResponseBuilder = (message, { Config }) => {
  let processedUserPayload;
  const { appId, advertiserId, deduplicationKey, sendingUnHashedData } = Config;
  // ref: https://s.pinimg.com/ct/docs/conversions_api/dist/v3.html
  const processedCommonPayload = processCommonPayload(message);
  /*
    message deduplication facility is provided *only* for the users who are using the *new configuration*.
    if  "enableDeduplication" is set to *true* and "deduplicationKey" is set via webapp, that key value will be
    sent as "event_id". On it's absence it will fallback to "messageId".
    And if "enableDeduplication" is set to false, it will fallback to "messageId"
  */
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
  const deducedEventName = deduceEventName(message, Config);

  return {
    ...processedCommonPayload,
    event_name: deducedEventName,
    app_id: appId,
    advertiser_id: advertiserId,
    user_data: processedUserPayload
  };
};

/**
 * This function will process the ecommerce fields and return the final payload
 * @param {*} message
 * @param {*} mandatoryPayload
 * @returns
 */
const processEcomFields = (message, mandatoryPayload) => {
  let totalQuantity = 0;
  let quantityInconsistent = false;
  const contentArray = [];
  const contentIds = [];
  const { properties } = message;
  // ref: https://s.pinimg.com/ct/docs/conversions_api/dist/v3.html
  let customPayload = constructPayload(message, CUSTOM_CONFIGS);

  // if product array is present will look for the product level information
  if (
    properties.products &&
    Array.isArray(properties.products) &&
    properties.products.length > 0
  ) {
    const { products } = properties;
    products.forEach(product => {
      const prodParams = setIdPriceQuantity(product, message);
      contentIds.push(prodParams.contentId);
      contentArray.push(prodParams.content);
      if (!product.quantity) {
        quantityInconsistent = true;
      }
      totalQuantity = product.quantity
        ? totalQuantity + product.quantity
        : totalQuantity;
    });

    if (totalQuantity === 0) {
      /*
      in case any of the products inside product array does not have quantity,
       will map the quantity of root level
      */
      totalQuantity = properties.quantity;
    }
  } else {
    /*
    for the events where product array is not present, root level id, price and
    quantity are taken into consideration
    */
    const prodParams = setIdPriceQuantity(message.properties, message);
    contentIds.push(prodParams.contentId);
    contentArray.push(prodParams.content);
    totalQuantity = properties.quantity
      ? totalQuantity + properties.quantity
      : totalQuantity;
  }
  /*
    if properties.numOfItems is not provided by the user, the total quantity of the products
    will be sent as num_items
  */
  if (
    !isDefinedAndNotNull(customPayload.num_items) &&
    quantityInconsistent === false
  ) {
    customPayload.num_items = parseInt(totalQuantity, 10);
  }
  customPayload = {
    ...customPayload,
    content_ids: contentIds,
    contents: contentArray
  };

  return {
    ...mandatoryPayload,
    custom_data: { ...customPayload }
  };
};

const process = event => {
  let response = {};
  let mandatoryPayload = {};
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
      mandatoryPayload = commonFieldResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(
        `message type ${messageType} is not supported`,
        400
      );
  }

  /**
   * Track payloads will need additional custom parameters
   */
  if (messageType === EventType.TRACK) {
    response = processEcomFields(message, mandatoryPayload);
  } else {
    response = mandatoryPayload;
  }
  return responseBuilderSimple(response);
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
        const transformedPayload = {
          message: process(event),
          metadata: event.metadata,
          destination
        };
        successRespList.push(transformedPayload);
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
