/* eslint-disable no-nested-ternary,no-param-reassign */
const _ = require('lodash');
const get = require('get-value');
const { BrazeDedupUtility, CustomAttributeOperationUtil, processDeduplication } = require('./util');
const tags = require('../../util/tags');
const { EventType, MappedToDestinationKey } = require('../../../constants');
const {
  adduserIdFromExternalId,
  defaultRequestConfig,
  getDestinationExternalID,
  getFieldValueFromMessage,
  removeUndefinedValues,
  isDefinedAndNotNull,
  isHttpStatusSuccess,
  simpleProcessRouterDestSync,
  simpleProcessRouterDest,
} = require('../../util');
const { InstrumentationError, NetworkError } = require('../../util/errorTypes');
const {
  ConfigCategory,
  mappingConfig,
  getIdentifyEndpoint,
  getTrackEndPoint,
  getSubscriptionGroupEndPoint,
  BRAZE_PARTNER_NAME,
  CustomAttributeOperationTypes,
} = require('./config');

const logger = require('../../../logger');
const { getEndpointFromConfig } = require('./util');
const { handleHttpRequest } = require('../../../adapters/network');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');

function formatGender(gender) {
  // few possible cases of woman
  if (['woman', 'female', 'w', 'f'].includes(gender.toLowerCase())) {
    return 'F';
  }

  // few possible cases of man
  if (['man', 'male', 'm'].includes(gender.toLowerCase())) {
    return 'M';
  }

  // few possible cases of other
  if (['other', 'o'].includes(gender.toLowerCase())) {
    return 'O';
  }

  return null;
}

function buildResponse(message, destination, properties, endpoint) {
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.userId = message.userId || message.anonymousId;
  response.body.JSON = removeUndefinedValues(properties);
  return {
    ...response,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${destination.Config.restApiKey}`,
    },
    userId: message.userId || message.anonymousId,
  };
}

function setAliasObjectWithAnonId(payload, message) {
  if (message.anonymousId) {
    payload.user_alias = {
      alias_name: message.anonymousId,
      alias_label: 'rudder_id',
    };
  }
  return payload;
}

function setExternalId(payload, message) {
  const externalId = getDestinationExternalID(message, 'brazeExternalId') || message.userId;
  if (externalId) {
    payload.external_id = externalId;
  }
  return payload;
}

function setExternalIdOrAliasObject(payload, message) {
  const userId = getFieldValueFromMessage(message, 'userIdOnly');
  if (userId || getDestinationExternalID(message, 'brazeExternalId')) {
    return setExternalId(payload, message);
  }

  // eslint-disable-next-line no-underscore-dangle
  payload._update_existing_only = false;
  return setAliasObjectWithAnonId(payload, message);
}

function getIdentifyPayload(message) {
  let payload = {};
  payload = setAliasObjectWithAnonId(payload, message);
  payload = setExternalId(payload, message);
  return { aliases_to_identify: [payload] };
}

function populateCustomAttributesWithOperation(
  traits,
  data,
  mergeObjectsUpdateOperation,
  enableNestedArrayOperations,
) {
  try {
    // add,update,remove on json attributes
    if (enableNestedArrayOperations) {
      Object.keys(traits)
        .filter((key) => typeof traits[key] === 'object' && !Array.isArray(traits[key]))
        .forEach((key) => {
          if (traits[key][CustomAttributeOperationTypes.UPDATE]) {
            CustomAttributeOperationUtil.customAttributeUpdateOperation(
              key,
              data,
              traits,
              mergeObjectsUpdateOperation,
            );
          }
          if (traits[key][CustomAttributeOperationTypes.REMOVE]) {
            CustomAttributeOperationUtil.customAttributeRemoveOperation(key, data, traits);
          }
          if (traits[key][CustomAttributeOperationTypes.ADD]) {
            CustomAttributeOperationUtil.customAttributeAddOperation(key, data, traits);
          }
        });
    }
  } catch (exp) {
    logger.info('Failure occured during custom attributes operations', exp);
  }
}

// Ref: https://www.braze.com/docs/api/objects_filters/user_attributes_object/
function getUserAttributesObject(message, mappingJson, destination) {
  // blank output object
  const data = {};
  // get traits from message
  const traits = getFieldValueFromMessage(message, 'traits');

  // return the traits as-is if message is mapped to destination
  if (get(message, MappedToDestinationKey)) {
    return traits;
  }

  // iterate over the destKeys and set the value if present
  Object.keys(mappingJson).forEach((destKey) => {
    let value = get(traits, mappingJson[destKey]);
    if (value) {
      // handle gender special case
      if (destKey === 'gender') {
        value = formatGender(value);
      }
      if (destKey === 'email') {
        value = value.toLowerCase();
      }
      data[destKey] = value;
    }
  });

  // reserved keys : already mapped through mappingJson
  const reservedKeys = [
    'address',
    'birthday',
    'email',
    'firstName',
    'gender',
    'avatar',
    'lastName',
    'phone',
  ];

  if (traits) {
    // iterate over rest of the traits properties
    Object.keys(traits).forEach((traitKey) => {
      // if traitKey is not reserved add the value to final output
      if (!reservedKeys.includes(traitKey)) {
        const value = get(traits, traitKey);
        if (value !== undefined) {
          data[traitKey] = value;
        }
      }
    });

    // populate data with custom attribute operations
    populateCustomAttributesWithOperation(
      traits,
      data,
      message.properties?.mergeObjectsUpdateOperation,
      destination?.Config.enableNestedArrayOperations,
    );
  }

  return data;
}

/**
 * makes a call to braze identify endpoint to merge the alias (anonymousId) user with the
 * identified user with external_id (userId) [Identity resolution]
 * https://www.braze.com/docs/api/endpoints/user_data/post_user_identify/
 *
 * @param {*} message
 * @param {*} destination
 */
async function processIdentify(message, destination) {
  // override userId with externalId in context(if present) and event is mapped to destination
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (mappedToDestination) {
    adduserIdFromExternalId(message);
  }

  const identifyPayload = getIdentifyPayload(message);
  const identifyEndpoint = getIdentifyEndpoint(getEndpointFromConfig(destination));
  const { processedResponse: brazeIdentifyResp } = await handleHttpRequest(
    'post',
    identifyEndpoint,
    identifyPayload,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${destination.Config.restApiKey}`,
      },
    },
  );
  if (!isHttpStatusSuccess(brazeIdentifyResp.status)) {
    throw new NetworkError(
      'Braze identify failed',
      brazeIdentifyResp.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(brazeIdentifyResp.status),
      },
      brazeIdentifyResp.response,
    );
  }
}

function processTrackWithUserAttributes(message, destination, mappingJson, processParams) {
  let payload = getUserAttributesObject(message, mappingJson);
  if (payload && Object.keys(payload).length > 0) {
    payload = setExternalIdOrAliasObject(payload, message);
    const requestJson = { attributes: [payload] };
    if (destination.Config.supportDedup) {
      const dedupedAttributePayload = processDeduplication(processParams.userStore, payload);
      if (dedupedAttributePayload) {
        requestJson.attributes = [dedupedAttributePayload];
      } else {
        throw new InstrumentationError(
          '[Braze Deduplication]: Duplicate user detected, the user is dropped',
        );
      }
    }
    return buildResponse(
      message,
      destination,
      requestJson,
      getTrackEndPoint(getEndpointFromConfig(destination)),
    );
  }
  throw new InstrumentationError(
    'No attributes found to update the user profile',
  );
}

function handleReservedProperties(props) {
  // remove reserved keys from custom event properties
  // https://www.appboy.com/documentation/Platform_Wide/#reserved-keys
  const reserved = ['time', 'product_id', 'quantity', 'event_name', 'price', 'currency'];

  reserved.forEach((element) => {
    delete props[element];
  });
  return props;
}

function addMandatoryEventProperties(payload, message) {
  payload.name = message.event;
  payload.time = message.timestamp;
  return payload;
}

function addMandatoryPurchaseProperties(productId, price, currencyCode, quantity, timestamp) {
  if (currencyCode) {
    return {
      product_id: productId,
      price,
      currency: currencyCode,
      quantity,
      time: timestamp,
    };
  }
  return null;
}

function getPurchaseObjs(message) {
  const { products, currency } = message.properties;
  const currencyCode = currency;

  const purchaseObjs = [];

  if (products) {
    // we have to make a separate call to appboy for each product
    products.forEach((product) => {
      const productId = product.product_id || product.sku;
      const { price, quantity, currency: prodCur } = product;
      if (productId && isDefinedAndNotNull(price) && quantity) {
        if (Number.isNaN(price) || Number.isNaN(quantity)) {
          return;
        }
        let purchaseObj = addMandatoryPurchaseProperties(
          productId,
          price,
          currencyCode || prodCur,
          quantity,
          message.timestamp,
        );
        if (purchaseObj) {
          purchaseObj = setExternalIdOrAliasObject(purchaseObj, message);
          purchaseObjs.push(purchaseObj);
        }
      }
    });
  }

  return purchaseObjs.length === 0 ? null : purchaseObjs;
}

function processTrackEvent(messageType, message, destination, mappingJson, processParams) {
  const eventName = message.event;

  if (!message.properties) {
    message.properties = {};
  }
  let { properties } = message;
  const requestJson = {
    partner: BRAZE_PARTNER_NAME,
  };

  let attributePayload = getUserAttributesObject(message, mappingJson, destination);
  if (attributePayload && Object.keys(attributePayload).length > 0) {
    attributePayload = setExternalIdOrAliasObject(attributePayload, message);
    requestJson.attributes = [attributePayload];
    if (destination.Config.supportDedup) {
      const dedupedAttributePayload = processDeduplication(
        processParams.userStore,
        attributePayload,
      );
      if (dedupedAttributePayload) {
        requestJson.attributes = [dedupedAttributePayload];
      } else {
        delete requestJson.attributes;
      }
    }
  }

  if (
    messageType === EventType.TRACK &&
    typeof eventName === 'string' &&
    eventName.toLowerCase() === 'order completed'
  ) {
    const purchaseObjs = getPurchaseObjs(message);

    if (purchaseObjs) {
      // del used properties
      delete properties.products;
      delete properties.currency;

      let payload = {};
      payload.properties = properties;

      payload = setExternalIdOrAliasObject(payload, message);
      return buildResponse(
        message,
        destination,
        {
          attributes: [attributePayload],
          purchases: purchaseObjs,
          partner: BRAZE_PARTNER_NAME,
        },
        getTrackEndPoint(getEndpointFromConfig(destination)),
      );
    }
    throw new InstrumentationError('Invalid Order Completed event');
  }
  properties = handleReservedProperties(properties);
  let payload = {};

  // mandatory fields
  payload = addMandatoryEventProperties(payload, message);
  payload.properties = properties;

  payload = setExternalIdOrAliasObject(payload, message);
  if (payload) {
    requestJson.events = [payload];
  }

  return buildResponse(
    message,
    destination,
    requestJson,
    getTrackEndPoint(getEndpointFromConfig(destination)),
  );
}

// For group call we will add a user attribute with the groupId attribute
// with the value as true
//
// Ex: If the groupId is 1234, we'll add a attribute to the user object with the
// key `ab_rudder_group_1234` with the value `true`
function processGroup(message, destination) {
  const groupId = getFieldValueFromMessage(message, 'groupId');
  if (!groupId) {
    throw new InstrumentationError('Invalid groupId');
  }
  if (destination.Config.enableSubscriptionGroupInGroupCall) {
    if (!(message.traits && (message.traits.phone || message.traits.email))) {
      throw new InstrumentationError(
        'Message should have traits with subscriptionState, email or phone',
      );
    }
    const subscriptionGroup = {};
    subscriptionGroup.subscription_group_id = groupId;
    if (
      message.traits.subscriptionState !== 'subscribed' &&
      message.traits.subscriptionState !== 'unsubscribed'
    ) {
      throw new InstrumentationError(
        'you must provide a subscription state in traits and possible values are subscribed and unsubscribed.',
      );
    }
    subscriptionGroup.subscription_state = message.traits.subscriptionState;
    subscriptionGroup.external_id = [message.userId];
    const phone = getFieldValueFromMessage(message, 'phone');
    const email = getFieldValueFromMessage(message, 'email');
    if (phone) {
      subscriptionGroup.phone = phone;
    } else if (email) {
      subscriptionGroup.email = email;
    }
    const response = defaultRequestConfig();
    response.endpoint = getSubscriptionGroupEndPoint(getEndpointFromConfig(destination));
    response.body.JSON = removeUndefinedValues(subscriptionGroup);
    return {
      ...response,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${destination.Config.restApiKey}`,
      },
    };
  }
  const groupAttribute = {};
  groupAttribute[`ab_rudder_group_${groupId}`] = true;
  setExternalId(groupAttribute, message);
  return buildResponse(
    message,
    destination,
    {
      attributes: [groupAttribute],
      partner: BRAZE_PARTNER_NAME,
    },
    getTrackEndPoint(getEndpointFromConfig(destination)),
  );
}

async function process(event, processParams = { userStore: new Map() }) {
  let response;
  const { message, destination } = event;
  const messageType = message.type.toLowerCase();

  let category = ConfigCategory.DEFAULT;
  switch (messageType) {
    case EventType.TRACK:
      response = processTrackEvent(
        messageType,
        message,
        destination,
        mappingConfig[category.name],
        processParams,
      );
      break;
    case EventType.PAGE:
      message.event = message.name || get(message, 'properties.name') || 'Page Viewed';
      response = processTrackEvent(
        messageType,
        message,
        destination,
        mappingConfig[category.name],
        processParams,
      );
      break;
    case EventType.SCREEN:
      message.event = message.name || get(message, 'properties.name') || 'Screen Viewed';
      response = processTrackEvent(
        messageType,
        message,
        destination,
        mappingConfig[category.name],
        processParams,
      );
      break;
    case EventType.IDENTIFY:
      category = ConfigCategory.IDENTIFY;
      if (message.anonymousId) {
        await processIdentify(message, destination);
      }
      response = processTrackWithUserAttributes(
        message,
        destination,
        mappingConfig[category.name],
        processParams,
      );
      break;
    case EventType.GROUP:
      response = processGroup(message, destination);

      break;
    default:
      throw new InstrumentationError('Message type is not supported');
  }

  return response;
}

const processRouterDest = async (inputs, reqMetadata) => {
  const userStore = new Map();
  const { destination } = inputs[0];
  if (destination.Config.supportDedup) {
    let lookedUpUsers;
    try {
      lookedUpUsers = await BrazeDedupUtility.doLookup(inputs);
    } catch (error) {
      logger.error('Error while fetching user store', error);
    }

    BrazeDedupUtility.updateUserStore(userStore, lookedUpUsers);
  }
  // group events by userId or anonymousId and then call process
  const groupedInputs = _.groupBy(
    inputs,
    (input) => input.message.userId || input.message.anonymousId,
  );

  // process each group of events for userId or anonymousId
  // if deduplication is enabled process each group of events for a user (userId or anonymousId)
  // synchronously (slower) else process asynchronously (faster)
  const allResps = Object.keys(groupedInputs).map(async (id) => {
    const respList = destination.Config.supportDedup
      ? await simpleProcessRouterDestSync(groupedInputs[id], process, reqMetadata, {
          userStore,
        })
      : await simpleProcessRouterDest(groupedInputs[id], process, reqMetadata);
    return respList;
  });

  const output = await Promise.all(allResps);

  return _.flatMap(output);
};

module.exports = { process, processRouterDest };
