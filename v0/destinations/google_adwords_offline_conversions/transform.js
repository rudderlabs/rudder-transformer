const get = require("get-value");
const { set } = require("lodash");
const { EventType } = require("../../../constants");
const {
  getHashFromArrayWithDuplicate,
  constructPayload,
  removeHyphens,
  defaultRequestConfig,
  defaultPostRequestConfig,
  simpleProcessRouterDest,
  getHashFromArray,
  removeUndefinedAndNullAndEmptyValues
} = require("../../util");
const ErrorBuilder = require("../../util/error");
const { CLICK_CONVERSION, CALL_CONVERSION } = require("./config");
let {
  trackClickConversionsMapping,
  trackCallConversionsMapping
} = require("./config");
const {
  validateDestinationConfig,
  getAccessToken,
  removeHashToSha256TypeFromMappingJson
} = require("./utils");

/**
 * get conversions depending on the type set from dashboard
 * i.e click conversions or call conversions
 * @param {*} message
 * @param {*} metadata
 * @param {*} param2
 * @param {*} event
 * @param {*} conversionType
 * @returns
 */
const getConversions = (
  message,
  metadata,
  { Config },
  event,
  conversionType
) => {
  let payload;
  let endpoint;
  const filteredCustomerId = removeHyphens(Config.customerId);
  const { hashUserIdentifier } = Config;

  if (conversionType === "click") {
    // click conversions

    if (hashUserIdentifier === false) {
      trackClickConversionsMapping = removeHashToSha256TypeFromMappingJson(
        trackClickConversionsMapping
      );
    }

    payload = constructPayload(message, trackClickConversionsMapping);
    endpoint = CLICK_CONVERSION.replace(":customerId", filteredCustomerId);

    // let products = payload.conversions[0].CartData.items;
    const products = get(message, "properties.products");
    const itemList = [];
    if (products && products.length > 0 && Array.isArray(products)) {
      // products is a list of items
      products.forEach(product => {
        if (Object.keys(product).length) {
          itemList.push({
            productId: product.product_id,
            quantity: product.quantity,
            unitPrice: product.price
          });
        }
      });

      set(payload, "conversions[0].CartData.items", itemList);
    }

    payload.conversions[0] = removeUndefinedAndNullAndEmptyValues(
      payload.conversions[0]
    );
  } else {
    // call conversions

    if (hashUserIdentifier === false) {
      trackCallConversionsMapping = removeHashToSha256TypeFromMappingJson(
        trackCallConversionsMapping
      );
    }

    payload = constructPayload(message, trackCallConversionsMapping);
    endpoint = CALL_CONVERSION.replace(":customerId", filteredCustomerId);
  }

  payload.partialFailure = true;

  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = endpoint;
  response.params = {
    event,
    customerId: filteredCustomerId,
    customVariables: Config.customVariables,
    properties: message.properties
  };
  response.body.JSON = payload;
  response.headers = {
    Authorization: `Bearer ${getAccessToken(metadata)}`,
    "Content-Type": "application/json",
    "developer-token": get(metadata, "secret.developer_token")
  };

  return response;
};

/**
 * response builder for track
 * @param {*} message
 * @param {*} metadata
 * @param {*} destination
 * @returns
 */
const trackResponseBuilder = (message, metadata, destination) => {
  let {
    eventsToConversionsNamesMapping,
    eventsToOfflineConversionsTypeMapping
  } = destination.Config;
  let { event } = message;
  if (!event) {
    throw new ErrorBuilder()
      .setMessage(
        "[Google Ads Offline Conversions]:: Event name is not present"
      )
      .setStatus(400)
      .build();
  }

  event = event.toLowerCase().trim();

  eventsToConversionsNamesMapping = getHashFromArray(
    eventsToConversionsNamesMapping
  );

  eventsToOfflineConversionsTypeMapping = getHashFromArrayWithDuplicate(
    eventsToOfflineConversionsTypeMapping
  );

  const responseList = [];
  if (
    !eventsToConversionsNamesMapping[event] ||
    !eventsToOfflineConversionsTypeMapping[event]
  ) {
    throw new ErrorBuilder()
      .setMessage(`Event name '${event}' is not valid`)
      .setStatus(400)
      .build();
  }

  eventsToOfflineConversionsTypeMapping[event].forEach(conversionType => {
    responseList.push(
      getConversions(
        message,
        metadata,
        destination,
        eventsToConversionsNamesMapping[event],
        conversionType
      )
    );
  });

  return responseList;
};

const process = async event => {
  const { message, metadata, destination } = event;

  if (!message.type) {
    throw new ErrorBuilder()
      .setMessage(
        "[Google Ads Offline Conversions]:: Message type is not present. Aborting message."
      )
      .setStatus(400)
      .build();
  }

  validateDestinationConfig(destination);

  const messageType = message.type.toLowerCase();
  let response;
  if (messageType === EventType.TRACK) {
    response = trackResponseBuilder(message, metadata, destination);
  } else {
    throw new ErrorBuilder()
      .setMessage(
        `[Google Ads Offline Conversions]:: Message type ${messageType} not supported`
      )
      .setStatus(400)
      .build();
  }

  return response;
};

const processRouterDest = async inputs => {
  const respList = await simpleProcessRouterDest(
    inputs,
    "Google_adwords_offline_conversions",
    process
  );
  return respList;
};

module.exports = { process, processRouterDest };
