const sha256 = require('sha256');
const { get, set, cloneDeep } = require('lodash');
const moment = require('moment');
const { EventType } = require('../../../constants');
const {
  getHashFromArrayWithDuplicate,
  constructPayload,
  removeHyphens,
  defaultRequestConfig,
  defaultPostRequestConfig,
  simpleProcessRouterDest,
  getHashFromArray,
  getFieldValueFromMessage,
} = require('../../util');

const {
  CLICK_CONVERSION,
  CALL_CONVERSION,
  trackClickConversionsMapping,
  trackCallConversionsMapping,
} = require('./config');
const {
  validateDestinationConfig,
  getAccessToken,
  removeHashToSha256TypeFromMappingJson,
} = require('./utils');
const { InstrumentationError, ConfigurationError } = require('../../util/errorTypes');

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
const getConversions = (message, metadata, { Config }, event, conversionType) => {
  let payload;
  let endpoint;
  const filteredCustomerId = removeHyphens(Config.customerId);
  const {
    hashUserIdentifier,
    defaultUserIdentifier,
    UserIdentifierSource,
    conversionEnvironment,
    customVariables,
    subAccount,
    loginCustomerId,
  } = Config;
  const { properties, originalTimestamp } = message;

  if (conversionType === 'click') {
    // click conversions
    let updatedClickMapping = cloneDeep(trackClickConversionsMapping);

    if (hashUserIdentifier === false) {
      updatedClickMapping = removeHashToSha256TypeFromMappingJson(updatedClickMapping);
    }

    payload = constructPayload(message, updatedClickMapping);

    // either of email or phone should be passed
    // defaultUserIdentifier depends on the webapp configuration
    // Ref - https://developers.google.com/google-ads/api/rest/reference/rest/v11/customers/uploadClickConversions#ClickConversion

    let email;
    let phone;
    if (defaultUserIdentifier === 'email') {
      email = getFieldValueFromMessage(message, 'email');
      if (email) {
        email = hashUserIdentifier ? sha256(email).toString() : email;
        set(payload, 'conversions[0].userIdentifiers[0].hashedEmail', email);
      }
    } else {
      phone = getFieldValueFromMessage(message, 'phone');
      if (phone) {
        phone = hashUserIdentifier ? sha256(phone).toString() : phone;
        set(payload, 'conversions[0].userIdentifiers[0].hashedPhoneNumber', phone);
      }
    }

    endpoint = CLICK_CONVERSION.replace(':customerId', filteredCustomerId);

    const products = get(message, 'properties.products');
    const itemList = [];
    if (products && products.length > 0 && Array.isArray(products)) {
      // products is a list of items
      products.forEach((product) => {
        if (Object.keys(product).length > 0) {
          itemList.push({
            productId: product.product_id,
            quantity: parseInt(product.quantity, 10),
            unitPrice: Number(product.price),
          });
        }
      });

      set(payload, 'conversions[0].cartData.items', itemList);
    }

    // userIdentifierSource
    // if userIdentifierSource doesn't exist in properties
    // then it is taken from the webapp config
    if (!properties.userIdentifierSource && UserIdentifierSource !== 'none') {
      set(payload, 'conversions[0].userIdentifiers[0].userIdentifierSource', UserIdentifierSource);

      // one of email or phone must be provided
      if (!email && !phone) {
        throw new InstrumentationError(`Either of email or phone is required for user identifier`);
      }
    }

    // conversionEnvironment
    // if conversionEnvironment doesn't exist in properties
    // then it is taken from the webapp config
    if (!properties.conversionEnvironment && conversionEnvironment !== 'none') {
      set(payload, 'conversions[0].conversionEnvironment', conversionEnvironment);
    }
  } else {
    // call conversions

    payload = constructPayload(message, trackCallConversionsMapping);
    endpoint = CALL_CONVERSION.replace(':customerId', filteredCustomerId);
  }

  // transform originalTimestamp to conversionDateTime format (yyyy-mm-dd hh:mm:ss+|-hh:mm)
  // e.g 2019-10-14T11:15:18.299Z -> 2019-10-14 16:10:29+0530
  if (!properties.conversionDateTime && originalTimestamp) {
    const timestamp = originalTimestamp;
    const conversionDateTime = moment(timestamp)
      .utcOffset(moment(timestamp).utcOffset())
      .format('YYYY-MM-DD HH:MM:SSZ');
    set(payload, 'conversions[0].conversionDateTime', conversionDateTime);
  }

  payload.partialFailure = true;

  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = endpoint;
  response.params = {
    event,
    customerId: filteredCustomerId,
    customVariables,
    properties,
  };
  response.body.JSON = payload;
  response.headers = {
    Authorization: `Bearer ${getAccessToken(metadata)}`,
    'Content-Type': 'application/json',
    'developer-token': get(metadata, 'secret.developer_token'),
  };

  if (subAccount) {
    if (loginCustomerId) {
      const filteredLoginCustomerId = removeHyphens(loginCustomerId);
      response.headers['login-customer-id'] = filteredLoginCustomerId;
    } else {
      throw new ConfigurationError(`loginCustomerId is required as subAccount is enabled`);
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
  let { eventsToConversionsNamesMapping, eventsToOfflineConversionsTypeMapping } =
    destination.Config;
  let { event } = message;
  if (!event) {
    throw new InstrumentationError('Event name is not present');
  }

  event = event.toLowerCase().trim();

  eventsToConversionsNamesMapping = getHashFromArray(eventsToConversionsNamesMapping);

  eventsToOfflineConversionsTypeMapping = getHashFromArrayWithDuplicate(
    eventsToOfflineConversionsTypeMapping,
  );

  const responseList = [];
  if (!eventsToConversionsNamesMapping[event] || !eventsToOfflineConversionsTypeMapping[event]) {
    throw new ConfigurationError(`Event name '${event}' is not valid`);
  }

  eventsToOfflineConversionsTypeMapping[event].forEach((conversionType) => {
    responseList.push(
      getConversions(
        message,
        metadata,
        destination,
        eventsToConversionsNamesMapping[event],
        conversionType,
      ),
    );
  });

  return responseList;
};

const process = async (event) => {
  const { message, metadata, destination } = event;

  if (!message.type) {
    throw new InstrumentationError('Message type is not present. Aborting message.');
  }

  validateDestinationConfig(destination);

  const messageType = message.type.toLowerCase();
  let response;
  if (messageType === EventType.TRACK) {
    response = trackResponseBuilder(message, metadata, destination);
  } else {
    throw new InstrumentationError(`Message type ${messageType} not supported`);
  }

  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
