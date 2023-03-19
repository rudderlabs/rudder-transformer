/* eslint-disable no-nested-ternary,no-param-reassign */
const _ = require('lodash');
const get = require('get-value');
const { BrazeDedupUtility } = require('./util');
const tags = require('../../util/tags');
const { EventType, MappedToDestinationKey } = require('../../../constants');
const {
  adduserIdFromExternalId,
  defaultRequestConfig,
  getDestinationExternalID,
  getFieldValueFromMessage,
  removeUndefinedValues,
  isDefinedAndNotNull,
  simpleProcessRouterDest,
  isHttpStatusSuccess,
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
const { httpPOST } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');

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
          data[key] = {};
          let opsResultArray = [];

          if (traits[key][CustomAttributeOperationTypes.UPDATE]) {
            for (let i = 0; i < traits[key][CustomAttributeOperationTypes.UPDATE].length; i += 1) {
              const myObj = {};
              myObj.$identifier_key =
                traits[key][CustomAttributeOperationTypes.UPDATE][i].identifier;
              myObj.$identifier_value =
                traits[key][CustomAttributeOperationTypes.UPDATE][i][
                  traits[key][CustomAttributeOperationTypes.UPDATE][i].identifier
                ];
              delete traits[key][CustomAttributeOperationTypes.UPDATE][i][
                traits[key][CustomAttributeOperationTypes.UPDATE][i].identifier
              ];
              delete traits[key][CustomAttributeOperationTypes.UPDATE][i].identifier;
              myObj.$new_object = {};
              Object.keys(traits[key][CustomAttributeOperationTypes.UPDATE][i]).forEach(
                (subKey) => {
                  myObj.$new_object[subKey] =
                    traits[key][CustomAttributeOperationTypes.UPDATE][i][subKey];
                },
              );
              opsResultArray.push(myObj);
            }
            // eslint-disable-next-line no-underscore-dangle
            data._merge_objects = isDefinedAndNotNull(mergeObjectsUpdateOperation)
              ? mergeObjectsUpdateOperation
              : false;
            data[key][`$${CustomAttributeOperationTypes.UPDATE}`] = opsResultArray;
          }

          opsResultArray = [];
          if (traits[key][CustomAttributeOperationTypes.REMOVE]) {
            for (let i = 0; i < traits[key][CustomAttributeOperationTypes.REMOVE].length; i += 1) {
              const myObj = {};
              myObj.$identifier_key =
                traits[key][CustomAttributeOperationTypes.REMOVE][i].identifier;
              myObj.$identifier_value =
                traits[key][CustomAttributeOperationTypes.REMOVE][i][
                  traits[key][CustomAttributeOperationTypes.REMOVE][i].identifier
                ];
              opsResultArray.push(myObj);
            }
            data[key][`$${CustomAttributeOperationTypes.REMOVE}`] = opsResultArray;
          }

          if (traits[key][CustomAttributeOperationTypes.ADD]) {
            data[key][`$${CustomAttributeOperationTypes.ADD}`] =
              traits[key][CustomAttributeOperationTypes.ADD];
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

async function processIdentify(message, destination) {
  // override userId with externalId in context(if present) and event is mapped to destination
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (mappedToDestination) {
    adduserIdFromExternalId(message);
  }

  const identifyPayload = getIdentifyPayload(message);
  const identifyEndpoint = getIdentifyEndpoint(getEndpointFromConfig(destination));

  const brazeIdentifyResp = await httpPOST(identifyEndpoint, identifyPayload, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${destination.Config.restApiKey}`,
    },
  });

  const processedBrazeIdentifyResp = processAxiosResponse(brazeIdentifyResp);
  if (!isHttpStatusSuccess(processedBrazeIdentifyResp.status)) {
    throw new NetworkError(
      'Braze identify failed',
      processedBrazeIdentifyResp.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(processedBrazeIdentifyResp.status),
      },
      processedBrazeIdentifyResp.response,
    );
  }
}

function processTrackWithUserAttributes(message, destination, mappingJson, deduplicationStore) {
  let payload = getUserAttributesObject(message, mappingJson);
  if (payload && Object.keys(payload).length > 0) {
    payload = setExternalIdOrAliasObject(payload, message);

    if (destination.Config.deduplicationEnabled) {
      const dedupedAttributePayload = BrazeDedupUtility.deduplicate(
        payload,
        deduplicationStore.userStore,
      );
      payload =
        Object.keys(dedupedAttributePayload).some(
          (key) => !['external_id', 'user_alias'].includes(key),
        ).length > 0
          ? dedupedAttributePayload
          : payload;
    }
    return buildResponse(
      message,
      destination,
      { attributes: [payload] },
      getTrackEndPoint(getEndpointFromConfig(destination)),
    );
  }
  throw new InstrumentationError(
    'No attributes found to update the user, the anonymous (alias only) user has been identified with proved userId',
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

function processTrackEvent(messageType, message, destination, mappingJson, deduplicationStore) {
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
    if (destination.Config.deduplicationEnabled) {
      const dedupedAttributePayload = BrazeDedupUtility.deduplicate(
        attributePayload,
        deduplicationStore.userStore,
      );
      requestJson.attributes = Object.keys(dedupedAttributePayload).some(
        (key) => !['external_id', 'user_alias'].includes(key),
      )
        ? [dedupedAttributePayload]
        : [attributePayload];
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

async function process(event, deduplicationStore = { userStore: new Map() }) {
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
        deduplicationStore,
      );
      break;
    case EventType.PAGE:
      message.event = message.name || get(message, 'properties.name') || 'Page Viewed';
      response = processTrackEvent(
        messageType,
        message,
        destination,
        mappingConfig[category.name],
        deduplicationStore,
      );
      break;
    case EventType.SCREEN:
      message.event = message.name || get(message, 'properties.name') || 'Screen Viewed';
      response = processTrackEvent(
        messageType,
        message,
        destination,
        mappingConfig[category.name],
        deduplicationStore,
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
        deduplicationStore,
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
  if (destination.Config.deduplicationEnabled) {
    const lookedUpUsers = await BrazeDedupUtility.doLookup(inputs);
    BrazeDedupUtility.enrichUserStore(lookedUpUsers, userStore);
  }
  // group events by userId or anonymousId and then call process
  const groupedInputs = _.groupBy(
    inputs,
    (input) => input.message.userId || input.message.anonymousId,
  );

  // process each group of events for userId or anonymousId
  const allResps = Object.keys(groupedInputs).map(async (id) => {
    const respList = await simpleProcessRouterDest(groupedInputs[id], process, reqMetadata, {
      userStore,
    });
    return respList;
  });

  const output = await Promise.all(allResps);

  return _.flatMap(output);
};

module.exports = { process, processRouterDest };
