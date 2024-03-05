/* eslint-disable no-lonely-if */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
const cloneDeep = require('lodash/cloneDeep');
const get = require('get-value');
const set = require('set-value');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const {
  EventType,
  SpecedTraits,
  TraitsMapping,
  MappedToDestinationKey,
} = require('../../../constants');
const {
  addExternalIdToTraits,
  adduserIdFromExternalId,
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig,
  defaultBatchRequestConfig,
  getParsedIP,
  getFieldValueFromMessage,
  getValueFromMessage,
  deleteObjectProperty,
  removeUndefinedAndNullValues,
  isDefinedAndNotNull,
  isAppleFamily,
  isDefinedAndNotNullAndNotEmpty,
  simpleProcessRouterDest,
  isValidInteger,
  handleRtTfSingleEventError,
} = require('../../util');
const {
  BASE_URL,
  BASE_URL_EU,
  ConfigCategory,
  mappingConfig,
  batchEventsWithUserIdLengthLowerThanFive,
  IDENTIFY_AM,
  AMBatchSizeLimit,
  AMBatchEventLimit,
} = require('./config');

const AMUtils = require('./utils');

const logger = require('../../../logger');

const { JSON_MIME_TYPE } = require('../../util/constant');

const EVENTS_KEY_PATH = 'body.JSON.events';

const baseEndpoint = (destConfig) => {
  let retVal;
  if (destConfig.residencyServer === 'EU') {
    retVal = BASE_URL_EU;
  } else {
    // "US" or when it is not specified
    retVal = BASE_URL;
  }
  return retVal;
};

const defaultEndpoint = (destConfig) => {
  const retVal = `${baseEndpoint(destConfig)}/2/httpapi`;
  return retVal;
};

const batchEndpoint = (destConfig) => {
  const retVal = `${baseEndpoint(destConfig)}/batch`;
  return retVal;
};

const groupEndpoint = (destConfig) => {
  const retVal = `${baseEndpoint(destConfig)}/groupidentify`;
  return retVal;
};

const aliasEndpoint = (destConfig) => {
  const retVal = `${baseEndpoint(destConfig)}/usermap`;
  return retVal;
};

const handleSessionIdUnderRoot = (sessionId) => {
  if (typeof sessionId === 'string') {
    const extractedPart = sessionId.split(':').reverse();
    if (!isValidInteger(extractedPart[0])) return -1;
    return Number(extractedPart[0]);
  }
  return Number(sessionId);
};

const handleSessionIdUnderContext = (sessionId) => {
  if (!isValidInteger(sessionId)) return -1;
  return Number(sessionId);
};

const checkForJSONAndUserIdLengthAndDeviceId = (jsonBody, userId, deviceId) =>
  Object.keys(jsonBody).length === 0 ||
  (userId &&
    userId.length < 5 &&
    (!batchEventsWithUserIdLengthLowerThanFive ||
      (batchEventsWithUserIdLengthLowerThanFive && !deviceId)));
const getSessionId = (message) => {
  let sessionId = -1;
  const rootSessionId = get(message, 'session_id');
  if (rootSessionId) {
    sessionId = handleSessionIdUnderRoot(rootSessionId);
    if (sessionId !== -1) {
      return sessionId;
    }
  }
  const contextSessionId = get(message, 'context.sessionId');
  if (contextSessionId) {
    sessionId = handleSessionIdUnderContext(contextSessionId);
  }
  return sessionId;
};

const addMinIdlength = () => ({ min_id_length: 1 });

const setPriceQuanityInPayload = (message, rawPayload) => {
  let price;
  let quantity;
  if (isDefinedAndNotNull(message.properties?.price)) {
    price = message.properties.price;
    quantity = message.properties?.quantity || 1;
  } else {
    price = message.properties?.revenue;
    quantity = 1;
  }
  rawPayload.price = price;
  rawPayload.quantity = quantity;
  rawPayload.revenue = message.properties?.revenue;
  return rawPayload;
};

const createRevenuePayload = (message, rawPayload) => {
  rawPayload.productId = message.properties?.product_id;
  rawPayload.revenueType =
    message.properties?.revenueType || message.properties?.revenue_type || 'Purchased';
  rawPayload = setPriceQuanityInPayload(message, rawPayload);
  return rawPayload;
};

const updateTraitsObject = (property, traitsObject, actionKey) => {
  const propertyToUpdate = getValueFromMessage(traitsObject, property);
  if (traitsObject[actionKey] && property && typeof property === 'string') {
    traitsObject[actionKey][property] = propertyToUpdate;
    deleteObjectProperty(traitsObject, property);
  }
  return traitsObject;
};

const prepareTraitsConfig = (configPropertyTrait, actionKey, traitsObject) => {
  traitsObject[actionKey] = {};
  configPropertyTrait.forEach((traitsElement) => {
    const property = traitsElement?.traits;
    traitsObject = updateTraitsObject(property, traitsObject, actionKey);
  });
  if (
    typeof traitsObject?.[actionKey] === 'object' &&
    Object.keys(traitsObject?.[actionKey] || {})?.length === 0
  ) {
    delete traitsObject[actionKey];
  }
  return traitsObject;
};

const handleTraits = (messageTrait, destination) => {
  let traitsObject = JSON.parse(JSON.stringify(messageTrait));

  if (destination.Config?.traitsToIncrement) {
    const actionKey = '$add';
    traitsObject = prepareTraitsConfig(
      destination.Config.traitsToIncrement,
      actionKey,
      traitsObject,
    );
  }
  if (destination.Config?.traitsToSetOnce) {
    const actionKey = '$setOnce';
    traitsObject = prepareTraitsConfig(destination.Config.traitsToSetOnce, actionKey, traitsObject);
  }
  if (destination.Config?.traitsToAppend) {
    const actionKey = '$append';
    traitsObject = prepareTraitsConfig(destination.Config.traitsToAppend, actionKey, traitsObject);
  }
  if (destination.Config?.traitsToPrepend) {
    const actionKey = '$prepend';
    traitsObject = prepareTraitsConfig(destination.Config.traitsToPrepend, actionKey, traitsObject);
  }
  return traitsObject;
};

const getScreenevTypeAndUpdatedProperties = (message, CATEGORY_KEY) => {
  const name = message.name || message.event || get(message, CATEGORY_KEY);

  return {
    eventType: `Viewed ${message.name || message.event || get(message, CATEGORY_KEY) || ''} Screen`,
    updatedProperties: {
      ...message.properties,
      name,
    },
  };
};

const handleMappingJsonObject = (
  mappingJson,
  sourceKey,
  validatePayload,
  payload,
  message,
  Config,
) => {
  const { isFunc, funcName, outKey } = mappingJson[sourceKey];
  if (isFunc) {
    if (validatePayload) {
      const data = get(payload, outKey);
      if (!isDefinedAndNotNull(data)) {
        const val = AMUtils[funcName](message, sourceKey, Config);
        if (val || val === false || val === 0) {
          set(payload, outKey, val);
        }
      }
    } else {
      const data = get(message.traits, outKey);
      // when in identify(or any other call) it checks whether outKey is present in traits
      // then that value is assigned else function is applied.
      // that key (outKey) will be a default key for reverse ETL and thus removed from the payload.
      if (isDefinedAndNotNull(data)) {
        set(payload, outKey, data);
        delete message.traits[outKey];
        return;
      }
      // get the destKey/outKey value from calling the util function
      set(payload, outKey, AMUtils[funcName](message, sourceKey, Config));
    }
  }
};

const updateConfigProperty = (message, payload, mappingJson, validatePayload, Config) => {
  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach((sourceKey) => {
    // check if custom processing is required on the payload sourceKey ==> destKey
    if (typeof mappingJson[sourceKey] === 'object') {
      handleMappingJsonObject(mappingJson, sourceKey, validatePayload, payload, message, Config);
    } else if (validatePayload) {
      // if data is present in traits assign
      const messageData = get(message.traits, mappingJson[sourceKey]);
      if (isDefinedAndNotNull(messageData)) {
        set(payload, mappingJson[sourceKey], messageData);
      } else {
        const data = get(payload, mappingJson[sourceKey]);
        if (!isDefinedAndNotNull(data)) {
          const val = get(message, sourceKey);
          if (val || val === false || val === 0) {
            set(payload, mappingJson[sourceKey], val);
          }
        }
      }
    } else {
      const data = get(message.traits, mappingJson[sourceKey]);
      if (isDefinedAndNotNull(data)) {
        set(payload, mappingJson[sourceKey], data);
      } else {
        set(payload, mappingJson[sourceKey], get(message, sourceKey));
      }
    }
  });
};
const userPropertiesHandler = (message, destination, rawPayload) => {
  // update payload user_properties from userProperties/traits/context.traits/nested traits of Rudder message
  // traits like address converted to top level user properties (think we can skip this extra processing as AM supports nesting upto 40 levels)
  let traits = getFieldValueFromMessage(message, 'traits');
  if (traits) {
    traits = handleTraits(traits, destination);
  }
  rawPayload.user_properties = {
    ...rawPayload.user_properties,
    ...message.userProperties,
  };
  if (traits) {
    Object.keys(traits).forEach((trait) => {
      if (SpecedTraits.includes(trait)) {
        const mapping = TraitsMapping[trait];
        Object.keys(mapping).forEach((key) => {
          const checkKey = get(rawPayload.user_properties, key);
          // this is done only if we want to add default values under address to the user_properties
          // these values are also sent to the destination at the top level.
          if (!isDefinedAndNotNull(checkKey)) {
            set(rawPayload, `user_properties.${key}`, get(traits, mapping[key]));
          }
        });
      } else {
        set(rawPayload, `user_properties.${trait}`, get(traits, trait));
      }
    });
  }
  // update identify call request with unset fields
  // AM docs https://www.docs.developers.amplitude.com/analytics/apis/http-v2-api/#keys-for-the-event-argument:~:text=exceed%2040%20layers.-,user_properties,-Optional.%20Object.%20A
  const unsetObject = AMUtils.getUnsetObj(message);
  if (unsetObject) {
    // Example   unsetObject = {
    //     "testObj.del1": "-"
    // }
    set(rawPayload, `user_properties.$unset`, unsetObject);
  }
  return rawPayload;
};

const getDefaultResponseData = (message, rawPayload, evType, groupInfo) => {
  const traits = getFieldValueFromMessage(message, 'traits');
  set(rawPayload, 'event_properties', message.properties);

  if (traits) {
    rawPayload.user_properties = {
      ...rawPayload.user_properties,
      ...traits,
    };
  }

  rawPayload.event_type = evType;
  rawPayload.user_id = message.userId;
  if (message.isRevenue) {
    // making the revenue payload
    rawPayload = createRevenuePayload(message, rawPayload);
    // deleting the properties price, product_id, quantity and revenue from event_properties since it is already in root
    if (rawPayload.event_properties) {
      delete rawPayload.event_properties.price;
      delete rawPayload.event_properties.product_id;
      delete rawPayload.event_properties.quantity;
      delete rawPayload.event_properties.revenue;
    }
  }
  const groups = groupInfo && cloneDeep(groupInfo);
  return { groups, rawPayload };
};


const getResponseData = (evType, destination, rawPayload, message, groupInfo) => {
  let groups;

  switch (evType) {
    case EventType.IDENTIFY:
      // event_type for identify event is $identify
      rawPayload.event_type = IDENTIFY_AM;
      rawPayload = userPropertiesHandler(message, destination, rawPayload);
      break;
    case EventType.GROUP:
      // event_type for identify event is $identify
      rawPayload.event_type = IDENTIFY_AM;
      // for Rudder group call, update the user_properties with group info
      if (groupInfo?.group_type && groupInfo?.group_value) {
        groups = {};
        groups[groupInfo.group_type] = groupInfo.group_value;
        set(rawPayload, `user_properties.${[groupInfo.group_type]}`, groupInfo.group_value);
      }
      break;
    case EventType.ALIAS:
      break;
    default:
      if (destination.Config.enableEnhancedUserOperations) {
        // handle all other events like track, page, screen for user properties
        rawPayload = userPropertiesHandler(message, destination, rawPayload);
      }
      ({ groups, rawPayload } = getDefaultResponseData(message, rawPayload, evType, groupInfo));
  }
  if (destination.Config.enableEnhancedUserOperations) {
    rawPayload = AMUtils.userPropertiesPostProcess(rawPayload);
  }
  return { rawPayload, groups };
};

const buildPayloadForMobileChannel = (message, destination, payload) => {
  if (!destination.Config.mapDeviceBrand) {
    set(payload, 'device_brand', get(message, 'context.device.manufacturer'));
  }

  const deviceId = get(message, 'context.device.id');
  const platform = get(message, 'context.device.type');
  const advertId = get(message, 'context.device.advertisingId');

  if (platform) {
    if (isAppleFamily(platform)) {
      set(payload, 'idfa', advertId);
      set(payload, 'idfv', deviceId);
    } else if (platform.toLowerCase() === 'android') {
      set(payload, 'adid', advertId);
    }
  }
};
const nonAliasResponsebuilder = (
  message,
  payload,
  destination,
  evType,
  groupInfo,
  rootElementName,
) => {
  const respList = [];
  const addOptions = 'options';
  const response = defaultRequestConfig();
  const groupResponse = defaultRequestConfig();
  const endpoint = defaultEndpoint(destination.Config);
  if (message.channel === 'mobile') {
    buildPayloadForMobileChannel(message, destination, payload);
  }
  payload.time = new Date(getFieldValueFromMessage(message, 'timestamp')).getTime();

  // send user_id only when present, for anonymous users not required
  if (message.userId && message.userId !== null) {
    payload.user_id = message.userId;
  }
  payload.session_id = getSessionId(message);

  updateConfigProperty(
    message,
    payload,
    mappingConfig[ConfigCategory.COMMON_CONFIG.name],
    true,
    destination.Config,
  );

  // we are not fixing the verson for android specifically any more because we've put a fix in iOS SDK
  // for correct versionName
  // ====================
  // fixVersion(payload, message);

  if (payload.user_properties) {
    delete payload.user_properties.city;
    delete payload.user_properties.country;
    if (payload.user_properties.address) {
      delete payload.user_properties.address.city;
      delete payload.user_properties.address.country;
    }
  }

  if (!payload.user_id && !payload.device_id) {
    logger.debug('Either of user ID or device ID fields must be specified');
    throw new InstrumentationError('Either of user ID or device ID fields must be specified');
  }

  payload.ip = getParsedIP(message);
  payload.library = 'rudderstack';
  payload = removeUndefinedAndNullValues(payload);
  response.endpoint = endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
  };
  response.userId = message.anonymousId;
  response.body.JSON = {
    api_key: destination.Config.apiKey,
    [rootElementName]: [payload],
    [addOptions]: addMinIdlength(),
  };
  respList.push(response);

  // https://developers.amplitude.com/docs/group-identify-api
  // Refer (1.), Rudder group call updates group propertiees.
  if (evType === EventType.GROUP && groupInfo) {
    groupResponse.method = defaultPostRequestConfig.requestMethod;
    groupResponse.endpoint = groupEndpoint(destination.Config);
    let groupPayload = cloneDeep(groupInfo);
    groupResponse.userId = message.anonymousId;
    groupPayload = removeUndefinedValues(groupPayload);
    groupResponse.body.FORM = {
      api_key: destination.Config.apiKey,
      identification: [JSON.stringify(groupPayload)],
    };
    respList.push(groupResponse);
  }
  return respList;
};

const responseBuilderSimple = (
  groupInfo,
  rootElementName,
  message,
  evType,
  mappingJson,
  destination,
) => {
  const rawPayload = {};
  const respList = [];
  const aliasResponse = defaultRequestConfig();
  if (
    EventType.IDENTIFY && // If mapped to destination, Add externalId to traits
    get(message, MappedToDestinationKey)
  ) {
    addExternalIdToTraits(message);
    const identifierType = get(message, 'context.externalId.0.identifierType');
    if (identifierType === 'user_id') {
      // this can be either device_id / user_id
      adduserIdFromExternalId(message);
    }
  }

  // 1. first populate the dest keys from the config files.
  // Group config file is similar to Identify config file
  // because we need to make an identify call too along with group entity update
  // to link the user to the particular group name/value. (pass in "groups" key to https://api.amplitude.com/2/httpapi where event_type: $identify)
  // Additionally, we will update the user_properties with groupName:groupValue
  updateConfigProperty(message, rawPayload, mappingJson, false, destination.Config);

  // 2. get campaign info (only present for JS sdk and http calls)
  const campaign = get(message, 'context.campaign') || {};
  const initialRef = {
    initial_referrer: get(message, 'context.page.initial_referrer'),
    initial_referring_domain: get(message, 'context.page.initial_referring_domain'),
  };
  const oldKeys = Object.keys(campaign);
  // appends utm_ prefix to all the keys of campaign object. For example the `name` key in campaign object will be changed to `utm_name`
  oldKeys.forEach((oldKey) => {
    campaign[`utm_${oldKey}`] = campaign[oldKey];
    delete campaign[oldKey];
  });

  // append campaign info extracted above(2.) to user_properties.
  // AM sdk's have a flag that captures the UTM params(https://amplitude.github.io/Amplitude-JavaScript/#amplitudeclientinit)
  // but http api docs don't have any such specific keys to send the UTMs, so attaching to user_properties
  rawPayload.user_properties = rawPayload.user_properties || {};
  rawPayload.user_properties = {
    ...rawPayload.user_properties,
    ...initialRef,
    ...campaign,
  };

  const respData = getResponseData(evType, destination, rawPayload, message, groupInfo);
  const { groups, rawPayload: updatedRawPayload } = respData;

  // for  https://api.amplitude.com/2/httpapi , pass the "groups" key
  // refer (1.) for passing "groups" for Rudder group call
  // https://developers.amplitude.com/docs/http-api-v2#schemaevent
  set(updatedRawPayload, 'groups', groups);
  let payload = removeUndefinedValues(updatedRawPayload);
  let unmapUserId;
  if (evType === EventType.ALIAS) {
    // By default (1.), Alias config file populates user_id and global_user_id
    // if the alias Rudder call has unmap set, delete the global_user_id key from AM event payload
    // https://help.amplitude.com/hc/en-us/articles/360002750712-Portfolio-Cross-Project-Analysis#h_76557c8b-54cd-4e28-8c82-2f6778f65cd4
    unmapUserId = get(message, 'integrations.Amplitude.unmap');
    if (unmapUserId) {
      payload.user_id = unmapUserId;
      delete payload.global_user_id;
      payload.unmap = true;
    }
    aliasResponse.method = defaultPostRequestConfig.requestMethod;
    aliasResponse.endpoint = aliasEndpoint(destination.Config);
    aliasResponse.userId = message.anonymousId;
    payload = removeUndefinedValues(payload);
    aliasResponse.body.FORM = {
      api_key: destination.Config.apiKey,
      [rootElementName]: [JSON.stringify(payload)],
    };
    respList.push(aliasResponse);
  } else {
    return nonAliasResponsebuilder(
      message,
      payload,
      destination,
      evType,
      groupInfo,
      rootElementName,
    );
  }
  return respList;
};

const getGroupInfo = (destination, groupInfo, groupTraits) => {
  const { groupTypeTrait, groupValueTrait } = destination.Config;
  if (groupTypeTrait && groupValueTrait) {
    let updatedGroupInfo = { ...groupInfo };
    const groupTypeValue = get(groupTraits, groupTypeTrait);
    const groupNameValue = get(groupTraits, groupValueTrait);
    // since the property updates on group at https://api2.amplitude.com/groupidentify
    // expects a string group name and value , so error out if the keys are not primitive
    // Note: This different for groups object at https://api.amplitude.com/2/httpapi where the
    // group value can be array of strings as well.
    if (
      groupTypeValue &&
      typeof groupTypeValue === 'string' &&
      groupNameValue &&
      (typeof groupNameValue === 'string' || typeof groupNameValue === 'number')
    ) {
      updatedGroupInfo = {};
      updatedGroupInfo.group_type = groupTypeValue;
      updatedGroupInfo.group_value = groupNameValue;
      // passing the entire group traits without deleting the above keys
      updatedGroupInfo.group_properties = groupTraits;
      return updatedGroupInfo;
    }
    logger.debug('Group call parameters are not valid');
    throw new InstrumentationError('Group call parameters are not valid');
  }
  return groupInfo;
};

// Generic process function which invokes specific handler functions depending on message type
// and event type where applicable
const processSingleMessage = (message, destination) => {
  let payloadObjectName = 'events';
  let evType;
  // It is expected that Rudder alias. identify group calls won't have this set
  // To be used for track/page calls to associate the event to a group in AM
  let groupInfo = get(message, 'integrations.Amplitude.groups') || undefined;
  let category = ConfigCategory.DEFAULT;
  const { name, event, properties } = message;
  const messageType = message.type.toLowerCase();
  const CATEGORY_KEY = 'properties.category';
  const {
    useUserDefinedPageEventName,
    userProvidedPageEventString,
    useUserDefinedScreenEventName,
    userProvidedScreenEventString,
  } = destination.Config;
  switch (messageType) {
    case EventType.IDENTIFY:
      payloadObjectName = 'events'; // identify same as events
      evType = 'identify';
      category = ConfigCategory.IDENTIFY;
      break;
    case EventType.PAGE:
      if (useUserDefinedPageEventName) {
        const getMessagePath = userProvidedPageEventString
          ?.substring(
            userProvidedPageEventString.indexOf('{') + 2,
            userProvidedPageEventString.indexOf('}'),
          )
          .trim();
        evType =
          userProvidedPageEventString?.trim() === ''
            ? name
            : userProvidedPageEventString
                ?.trim()
                .replaceAll(/{{([^{}]+)}}/g, get(message, getMessagePath));
      } else {
        evType = `Viewed ${name || get(message, CATEGORY_KEY) || ''} Page`;
      }
      message.properties = {
        ...properties,
        name: name || get(message, CATEGORY_KEY),
      };
      category = ConfigCategory.PAGE;
      break;
    case EventType.SCREEN:
      {
        const { eventType, updatedProperties } = getScreenevTypeAndUpdatedProperties(
          message,
          CATEGORY_KEY,
        );
        let customScreenEv = '';
        if (useUserDefinedScreenEventName) {
          const getMessagePath = userProvidedScreenEventString
            .substring(
              userProvidedScreenEventString.indexOf('{') + 2,
              userProvidedScreenEventString.indexOf('}'),
            )
            .trim();
          customScreenEv =
            userProvidedScreenEventString.trim() === ''
              ? name
              : userProvidedScreenEventString
                  .trim()
                  .replaceAll(/{{([^{}]+)}}/g, get(message, getMessagePath));
        }
        evType = useUserDefinedScreenEventName ? customScreenEv : eventType;
        message.properties = updatedProperties;
        category = ConfigCategory.SCREEN;
      }
      break;
    case EventType.GROUP:
      evType = 'group';
      payloadObjectName = 'events';
      category = ConfigCategory.GROUP;
      // read from group traits from message
      // groupTraits => top level "traits" for JS SDK
      // groupTraits => "context.traits" for mobile SDKs
      groupInfo = getGroupInfo(
        destination,
        groupInfo,
        getFieldValueFromMessage(message, 'groupTraits'),
      );
      // read destination config related group settings
      // https://developers.amplitude.com/docs/group-identify-api
      break;
    case EventType.ALIAS:
      evType = 'alias';
      // the alias call params end up under "mapping" params
      // https://help.amplitude.com/hc/en-us/articles/360002750712-Portfolio-Cross-Project-Analysis#h_76557c8b-54cd-4e28-8c82-2f6778f65cd4
      payloadObjectName = 'mapping';
      category = ConfigCategory.ALIAS;
      break;
    case EventType.TRACK:
      evType = event;
      if (!isDefinedAndNotNullAndNotEmpty(evType)) {
        throw new InstrumentationError('Event not present. Please send event field');
      }
      if (
        properties &&
        isDefinedAndNotNull(properties?.revenue) &&
        isDefinedAndNotNull(properties?.revenue_type)
      ) {
        // if properties has revenue and revenue_type fields
        // consider the event as revenue event directly
        category = ConfigCategory.REVENUE;
      }
      break;
    default:
      logger.debug('could not determine type');
      throw new InstrumentationError('message type not supported');
  }
  AMUtils.validateEventType(evType);
  return responseBuilderSimple(
    groupInfo,
    payloadObjectName,
    message,
    evType,
    mappingConfig[category.name],
    destination,
  );
};

const createProductPurchasedEvent = (message, destination, product, counter) => {
  const eventClonePurchaseProduct = cloneDeep(message);

  eventClonePurchaseProduct.event = 'Product Purchased';
  // In product purchased event event properties consists of the details of each product
  eventClonePurchaseProduct.properties = product;

  if (destination.Config.trackRevenuePerProduct === true) {
    eventClonePurchaseProduct.isRevenue = true;
  }
  // need to modify the message id of each newly created event, as it is mapped to insert_id and that is used by Amplitude for dedup.
  eventClonePurchaseProduct.messageId = `${message.messageId}-${counter}`;
  return eventClonePurchaseProduct;
};

const isProductArrayInPayload = (message) => {
  const isProductArray =
    (message.properties?.products &&
      Array.isArray(message.properties.products) &&
      message.properties.products.length > 0) === true;
  return isProductArray;
};

const getProductPurchasedEvents = (message, destination) => {
  const productPurchasedEvents = [];
  if (isProductArrayInPayload(message)) {
    let counter = 0;

    // Create product purchased event for each product in products array.
    message.properties.products.forEach((product) => {
      counter += 1;
      const productPurchasedEvent = createProductPurchasedEvent(
        message,
        destination,
        product,
        counter,
      );
      productPurchasedEvents.push(productPurchasedEvent);
    });
  }
  return productPurchasedEvents;
};

const trackRevenueEvent = (message, destination) => {
  let sendEvents = [];
  const originalEvent = cloneDeep(message);

  if (destination.Config.trackProductsOnce === false) {
    if (isProductArrayInPayload(message)) {
      // when trackProductsOnce false no product array present
      delete originalEvent.properties?.products;
    } else {
      // when product array is not there in payload, will track the revenue of the original event.
      originalEvent.isRevenue = true;
    }
  } else if (!isProductArrayInPayload(message)) {
    // when the user enables both trackProductsOnce and trackRevenuePerProduct, we will track revenue on each product level.
    // So, if trackProductsOnce is true and there is no products array in payload, we will track the revenue of original event.
    // when trackRevenuePerProduct is false, track the revenue of original event - that is handled in next if block.
    originalEvent.isRevenue = true;
  }
  // when trackRevenuePerProduct is false, track the revenue of original event.
  if (destination.Config.trackRevenuePerProduct === false) {
    originalEvent.isRevenue = true;
  }

  sendEvents.push(originalEvent);

  if (
    destination.Config.trackRevenuePerProduct === true ||
    destination.Config.trackProductsOnce === false
  ) {
    const productPurchasedEvents = getProductPurchasedEvents(message, destination);
    if (productPurchasedEvents.length > 0) {
      sendEvents = [...sendEvents, ...productPurchasedEvents];
    }
  }
  return sendEvents;
};

const process = (event) => {
  const respList = [];
  const { message, destination } = event;
  const messageType = message.type?.toLowerCase();
  const toSendEvents = [];
  if (!destination?.Config?.apiKey) {
    throw new ConfigurationError('No API Key is Found. Please Configure API key from dashbaord');
  }
  if (messageType === EventType.TRACK) {
    const { properties } = message;
    if (isDefinedAndNotNull(properties?.revenue)) {
      const revenueEvents = trackRevenueEvent(message, destination);
      revenueEvents.forEach((revenueEvent) => {
        toSendEvents.push(revenueEvent);
      });
    } else {
      toSendEvents.push(message);
    }
  } else {
    toSendEvents.push(message);
  }

  toSendEvents.forEach((sendEvent) => {
    respList.push(...processSingleMessage(sendEvent, destination));
  });
  return respList;
};

const getBatchEvents = (message, destination, metadata, batchEventResponse) => {
  let batchComplete = false;
  const batchEventArray = get(batchEventResponse, 'batchedRequest.body.JSON.events') || [];
  const batchEventJobs = get(batchEventResponse, 'metadata') || [];
  const batchPayloadJSON = get(batchEventResponse, 'batchedRequest.body.JSON') || {};
  const incomingMessageJSON = get(message, 'body.JSON');
  let incomingMessageEvent = get(message, EVENTS_KEY_PATH);
  // check if the incoming singular event is an array or not
  // and set it back to array
  incomingMessageEvent = Array.isArray(incomingMessageEvent)
    ? incomingMessageEvent[0]
    : incomingMessageEvent;
  const userId = incomingMessageEvent.user_id;

  /* delete the userId as it is less than 5 as AM is giving 400
  that is not a documented behviour where it states if either deviceid or userid is present
  batch request won't return 400
    {
      "code": 400,
      "events_with_invalid_id_lengths": {
          "user_id": [
              0
          ]
      },
      "error": "Invalid id length for user_id or device_id"
    }
   */
  if (batchEventsWithUserIdLengthLowerThanFive && userId && userId.length < 5) {
    delete incomingMessageEvent.user_id;
  }

  set(message, EVENTS_KEY_PATH, [incomingMessageEvent]);
  // if this is the first event, push to batch and return
  const BATCH_ENDPOINT = batchEndpoint(destination.Config);
  if (batchEventArray.length === 0) {
    if (JSON.stringify(incomingMessageJSON).length < AMBatchSizeLimit) {
      delete message.body.JSON.options;
      batchEventResponse.batchedRequest = message;
      set(batchEventResponse, 'batchedRequest.endpoint', BATCH_ENDPOINT);
      batchEventResponse.metadata = [metadata];
    }
  } else {
    // https://developers.amplitude.com/docs/batch-event-upload-api#feature-comparison-between-httpapi-2httpapi--batch
    if (
      batchEventArray.length < AMBatchEventLimit &&
      JSON.stringify(batchPayloadJSON).length + JSON.stringify(incomingMessageEvent).length <
        AMBatchSizeLimit
    ) {
      batchEventArray.push(incomingMessageEvent); // set value
      batchEventJobs.push(metadata);
      set(batchEventResponse, 'batchedRequest.body.JSON.events', batchEventArray);
      set(batchEventResponse, 'metadata', batchEventJobs);
    } else {
      // event could not be pushed
      // it will be pushed again by a call from the caller of this method
      batchComplete = true;
    }
  }
  return batchComplete;
};

const getFirstEvent = (messageEvent) =>
  messageEvent && Array.isArray(messageEvent) ? messageEvent[0] : messageEvent;
const batch = (destEvents) => {
  const respList = [];
  let batchEventResponse = defaultBatchRequestConfig();
  let response;
  let isBatchComplete;
  let jsonBody;
  let messageEvent;
  let destinationObject;
  destEvents.forEach((ev) => {
    const { message, metadata, destination } = ev;
    destinationObject = { ...destination };
    jsonBody = get(message, 'body.JSON');
    messageEvent = get(message, EVENTS_KEY_PATH);
    const firstEvent = getFirstEvent(messageEvent);

    const userId = firstEvent?.user_id ?? undefined;
    const deviceId = firstEvent?.device_id ?? undefined;

    // this case shold not happen and should be filtered already
    // by the first pass of single event transformation
    if (messageEvent && !userId && !deviceId) {
      const MissingUserIdDeviceIdError = new InstrumentationError(
        'Both userId and deviceId cannot be undefined',
      );
      respList.push(handleRtTfSingleEventError(ev, MissingUserIdDeviceIdError, {}));
      return;
    }
    /* check if not a JSON body or (userId length < 5 && batchEventsWithUserIdLengthLowerThanFive is false) or
      (batchEventsWithUserIdLengthLowerThanFive is true and userId is less than 5 but deviceId not present),
      send the event as is after batching
     */
    if (checkForJSONAndUserIdLengthAndDeviceId(jsonBody, userId, deviceId)) {
      response = defaultBatchRequestConfig();
      response.batchedRequest = message;
      response.metadata = [metadata];
      response.destination = destinationObject;
      respList.push(response);
    } else {
      // check if the event can be pushed to an existing batch
      isBatchComplete = getBatchEvents(message, destination, metadata, batchEventResponse);
      if (isBatchComplete) {
        /* if the batch is already complete, push it to response list
        and push the event to a new batch
        */
        batchEventResponse.destination = destinationObject;
        respList.push({ ...batchEventResponse });
        batchEventResponse = defaultBatchRequestConfig();
        batchEventResponse.destination = destinationObject;
        isBatchComplete = getBatchEvents(message, destination, metadata, batchEventResponse);
      }
    }
  });
  // if there is some unfinished batch push it to response list
  if (isDefinedAndNotNull(isBatchComplete) && !isBatchComplete) {
    batchEventResponse.destination = destinationObject;
    respList.push(batchEventResponse);
  }
  return respList;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

const responseTransform = (input) => ({
  status: 200,
  destination: { ...input },
  message: 'Processed Successfully',
});

module.exports = { process, processRouterDest, batch, responseTransform };
