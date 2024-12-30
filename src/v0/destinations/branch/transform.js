const get = require('get-value');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const { endpoints } = require('./config');
const { categoriesList } = require('./data/eventMapping');
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  getFieldValueFromMessage,
  isDefinedAndNotNull,
  isAppleFamily,
  simpleProcessRouterDest,
} = require('../../util');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { getMappedEventNameFromConfig } = require('./utils');

function responseBuilder(payload, message, destination, category) {
  const response = defaultRequestConfig();

  if (category === 'custom') {
    response.endpoint = endpoints.customEventUrl;
  } else {
    response.endpoint = endpoints.standardEventUrl;
  }
  response.method = defaultPostRequestConfig.requestMethod;

  response.body.JSON = removeUndefinedAndNullValues({
    ...payload,
    branch_key: destination.Config.branchKey,
  });

  return {
    ...response,
    headers: {
      'Content-Type': JSON_MIME_TYPE,
      Accept: JSON_MIME_TYPE,
    },
    userId: message.anonymousId,
  };
}

function getCategoryAndName(rudderEventName) {
  // eslint-disable-next-line no-restricted-syntax
  for (const category of categoriesList) {
    let requiredName = null;
    let requiredCategory = null;
    // eslint-disable-next-line array-callback-return, sonarjs/no-ignored-return
    Object.keys(category.name).forEach((branchKey) => {
      if (
        typeof branchKey === 'string' &&
        typeof rudderEventName === 'string' &&
        (branchKey.toLowerCase() === rudderEventName.toLowerCase() ||
          category.name[branchKey].toLowerCase() === rudderEventName.toLowerCase())
      ) {
        requiredName = category.name[branchKey];
        requiredCategory = category;
      }
    });
    if (requiredName != null && requiredCategory != null) {
      return { evName: requiredName, category: requiredCategory };
    }
  }
  return { evName: rudderEventName, category: 'custom' };
}

function getUserData(message) {
  // os field is not mandatory as based on device type it can be one of
  // "Android" or "iOS" but it does not apply & is not valid in case of web events
  const os = get(message, 'context.os.name');

  let userData = {
    os,
    os_version: get(message, 'context.os.version'),
    app_version: get(message, 'context.app.version'),
    model: get(message, 'context.device.model'),
    brand: get(message, 'context.device.brand'),
    screen_dpi: get(message, 'context.screen.density'),
    screen_height: get(message, 'context.screen.height'),
    screen_width: get(message, 'context.screen.width'),
    developer_identity: getFieldValueFromMessage(message, 'userId'),
    user_agent: get(message, 'context.userAgent'),
  };

  if (isDefinedAndNotNull(os)) {
    if (isAppleFamily(os)) {
      userData.idfa = get(message, 'context.idfa') || get(message, 'context.device.advertisingId');

      userData.idfv = get(message, 'context.idfv') || get(message, 'context.device.id');
    } else if (os.toLowerCase() === 'android') {
      userData.android_id = get(message, 'context.android_id') || get(message, 'context.device.id');
      userData.aaid = get(message, 'context.aaid') || get(message, 'context.device.advertisingId');
    }
  }

  const att = get(message, 'context.device.attTrackingStatus');
  if (isDefinedAndNotNull(att)) {
    if (att === 3) {
      userData.limit_ad_tracking = false;
    } else if (att === 2) {
      userData.limit_ad_tracking = true;
    }
  }

  userData = removeUndefinedAndNullValues(userData);

  return userData;
}

function mapPayload(category, rudderProperty, rudderPropertiesObj) {
  const contentItems = {};
  const eventData = {};
  const customData = {};

  let valFound = false;
  if (category.content_items) {
    // eslint-disable-next-line sonarjs/no-ignored-return
    Object.keys(category.content_items).forEach((branchMappingProperty) => {
      if (branchMappingProperty === rudderProperty) {
        const tmpKeyName = category.content_items[branchMappingProperty];
        contentItems[tmpKeyName] = rudderPropertiesObj[rudderProperty];
        valFound = true;
      }
    });
  }

  if (!valFound && category.event_data) {
    category.event_data.find((branchMappingProperty) => {
      if (branchMappingProperty === rudderProperty) {
        eventData[rudderProperty] = rudderPropertiesObj[rudderProperty];
        valFound = true;
        return true;
      }
      return false;
    });
  }

  if (!valFound) {
    customData[rudderProperty] = rudderPropertiesObj[rudderProperty];
  }
  return {
    contentItemsObj: contentItems,
    eventDataObj: eventData,
    customDataObj: customData,
  };
}

function getCommonPayload(message, category, evName) {
  const rawPayload = {};
  let rudderPropertiesObj;
  const contentItems = [];
  const eventData = {};
  const customData = {};
  let productObj = {};

  // eslint-disable-next-line default-case
  switch (message.type) {
    case EventType.TRACK:
      rudderPropertiesObj = get(message, 'properties') ? message.properties : null;
      break;
    case EventType.IDENTIFY:
      rudderPropertiesObj = getFieldValueFromMessage(message, 'traits');
      break;
  }

  if (rudderPropertiesObj != null) {
    Object.keys(rudderPropertiesObj).forEach((rudderProperty) => {
      if (rudderProperty === 'products') {
        productObj = {};
        for (let i = 0; i < rudderPropertiesObj.products.length; i += 1) {
          const product = rudderPropertiesObj.products[i];
          // eslint-disable-next-line @typescript-eslint/no-loop-func
          Object.keys(product).forEach((productProp) => {
            const { contentItemsObj, eventDataObj, customDataObj } = mapPayload(
              category,
              productProp,
              product,
            );
            Object.assign(productObj, contentItemsObj);
            Object.assign(eventData, eventDataObj);
            Object.assign(customData, customDataObj);
          });
          contentItems.push(productObj);
          productObj = {};
        }
      } else {
        const { contentItemsObj, eventDataObj, customDataObj } = mapPayload(
          category,
          rudderProperty,
          rudderPropertiesObj,
        );
        Object.assign(productObj, contentItemsObj);
        Object.assign(eventData, eventDataObj);
        Object.assign(customData, customDataObj);
      }
    });
    contentItems.push(productObj);
    rawPayload.custom_data = customData;
    rawPayload.content_items = contentItems;
    rawPayload.event_data = eventData;

    Object.keys(rawPayload).forEach((key) => {
      if (Object.keys(rawPayload[key]).length === 0) {
        rawPayload[key] = null;
      }
    });
  }
  rawPayload.user_data = getUserData(message);
  rawPayload.name = evName;

  return rawPayload;
}

function processMessage(message, destination) {
  let evName;
  let category;
  let updatedEventName = message.event;
  switch (message.type) {
    case EventType.TRACK: {
      if (!message.event) {
        throw new InstrumentationError('Event name is required');
      }
      const eventNameFromConfig = getMappedEventNameFromConfig(message, destination);
      if (eventNameFromConfig) {
        updatedEventName = eventNameFromConfig;
      }
      ({ evName, category } = getCategoryAndName(updatedEventName));
      break;
    }
    case EventType.IDENTIFY:
      ({ evName, category } = getCategoryAndName(message.userId));
      break;
    default:
      throw new InstrumentationError('Message type is not supported');
  }
  const rawPayload = getCommonPayload(message, category, evName);
  return responseBuilder(rawPayload, message, destination, category);
}

function process(event) {
  const { message, destination } = event;
  return processMessage(message, destination);
}

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
