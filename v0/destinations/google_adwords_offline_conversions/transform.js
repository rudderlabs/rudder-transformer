const sha256 = require("sha256");
const { get, set, cloneDeep } = require("lodash");
const moment = require("moment");
const { EventType } = require("../../../constants");
const {
  getHashFromArrayWithDuplicate,
  constructPayload,
  removeHyphens,
  defaultRequestConfig,
  defaultPostRequestConfig,
  simpleProcessRouterDest,
  getHashFromArray,
  getFieldValueFromMessage
} = require("../../util");
const ErrorBuilder = require("../../util/error");
const {
  CLICK_CONVERSION,
  CALL_CONVERSION,
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
  const { properties } = message;

  if (conversionType === "click") {
    // click conversions
    let updatedClickMapping = cloneDeep(trackClickConversionsMapping);

    if (hashUserIdentifier === false) {
      updatedClickMapping = removeHashToSha256TypeFromMappingJson(
        updatedClickMapping
      );
    }

    payload = constructPayload(message, updatedClickMapping);

    // either of email or phone should be passed
    // defaultUserIdentifier depends on the webapp configuration
    // Ref - https://developers.google.com/google-ads/api/rest/reference/rest/v11/customers/uploadClickConversions#ClickConversion

    let email;
    let phone;
    if (Config.defaultUserIdentifier === "email") {
      email = getFieldValueFromMessage(message, "email");
      if (email) {
        email = Config.hashUserIdentifier ? sha256(email).toString() : email;
        set(payload, "conversions[0].userIdentifiers[0].hashedEmail", email);
      }
    } else {
      phone = getFieldValueFromMessage(message, "phone");
      if (phone) {
        phone = Config.hashUserIdentifier ? sha256(phone).toString() : phone;
        set(
          payload,
          "conversions[0].userIdentifiers[0].hashedPhoneNumber",
          phone
        );
      }
    }

    endpoint = CLICK_CONVERSION.replace(":customerId", filteredCustomerId);

    const products = get(message, "properties.products");
    const itemList = [];
    if (products && products.length > 0 && Array.isArray(products)) {
      // products is a list of items
      products.forEach(product => {
        if (Object.keys(product).length) {
          itemList.push({
            productId: product.product_id,
            quantity: parseInt(product.quantity, 10),
            unitPrice: Number(product.price)
          });
        }
      });

      set(payload, "conversions[0].cartData.items", itemList);
    }

    // userIdentifierSource
    // if userIdentifierSource doesn't exist in properties
    // then it is taken from the webapp config
    if (
      !properties.userIdentifierSource &&
      Config.UserIdentifierSource !== "none"
    ) {
      set(
        payload,
        "conversions[0].userIdentifiers[0].userIdentifierSource",
        Config.UserIdentifierSource
      );

      // one of email or phone must be provided
      if (!email && !phone) {
        throw new ErrorBuilder()
          .setMessage(
            `[Google Ads Offline Conversions]:: either of email or phone is required for user identifier`
          )
          .setStatus(400)
          .build();
      }
    }

    // conversionEnvironment
    // if conversionEnvironment doesn't exist in properties
    // then it is taken from the webapp config
    if (
      !properties.conversionEnvironment &&
      Config.conversionEnvironment !== "none"
    ) {
      set(
        payload,
        "conversions[0].conversionEnvironment",
        Config.conversionEnvironment
      );
    }
  } else {
    // call conversions

    payload = constructPayload(message, trackCallConversionsMapping);
    endpoint = CALL_CONVERSION.replace(":customerId", filteredCustomerId);
  }

  // transform originalTimestamp to conversionDateTime format (yyyy-mm-dd hh:mm:ss+|-hh:mm)
  // e.g 2019-10-14T11:15:18.299Z -> 2019-10-14 16:10:29+0530
  if (!properties.conversionDateTime && message.originalTimestamp) {
    const timestamp = message.originalTimestamp;
    const conversionDateTime = moment(timestamp)
      .utcOffset(moment(timestamp).utcOffset())
      .format("YYYY-MM-DD HH:MM:SSZ");
    set(payload, "conversions[0].conversionDateTime", conversionDateTime);
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

  if (Config.subAccount) {
    if (Config.loginCustomerId) {
      const filteredLoginCustomerId = removeHyphens(Config.loginCustomerId);
      response.headers["login-customer-id"] = filteredLoginCustomerId;
    } else {
      throw new ErrorBuilder()
        .setMessage(
          `[Google Ads Offline Conversions]:: loginCustomerId is required as subAccount is enabled`
        )
        .setStatus(400)
        .build();
    }
  }

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
        "[Google Ads Offline Conversions]:: message type is not present. Aborting message."
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
