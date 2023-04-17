/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
const get = require('get-value');
const { EventType } = require('../../../constants');
const {
  getEndpoint,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  CLEVERTAP_DEFAULT_EXCLUSION,
} = require('./config');

const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  extractCustomFields,
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  toUnixTimestamp,
  isAppleFamily,
  simpleProcessRouterDest,
} = require('../../util');
const { InstrumentationError, TransformationError } = require('../../util/errorTypes');

/*
Following behaviour is expected when "enableObjectIdMapping" is enabled

For Identify Events
---------------RudderStack-----------------             ------------Clevertap-------------
anonymousId(present?)				userId(present?)	 					objectId(value)			        identity(value)
true						            true						            anonymousId			              userId
true						            false					              anonymousId			              -
false					              true						            (clevertap_generated_uuid)		userId

For tracking events
---------------RudderStack-----------------           ----------Clevertap---------
anonymousId(present?)				userId(present?)					tracking with
true						            true						          objectId (value = anonymousId)
true						            false					            objectId (value = anonymousId)
false					              true						          identity (value = userId)
*/

// wraps to default request config
const responseWrapper = (payload, destination) => {
  const response = defaultRequestConfig();
  // If the acount belongs to specific regional server,
  // we need to modify the url endpoint based on dest config.
  // Source: https://developer.clevertap.com/docs/idc
  response.endpoint = getEndpoint(destination.Config);
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    'X-CleverTap-Account-Id': destination.Config.accountId,
    'X-CleverTap-Passcode': destination.Config.passcode,
    'Content-Type': 'application/json',
  };
  response.body.JSON = payload;
  return response;
};

/**
 * Expected behaviours:                            
    payload = {                                       "finalPayload": {
      "device": {                                          "device": "{\"browser\":{\"name\":\"Chrome121\",\"version\":\"106.0.0.0\"},\"os\":{\"version\":\"10.15.7\"}}",
        "browser": {                                       "name": "macOS",
          "name": "Chrome121",                             "platform": "web"
          "version": "106.0.0.0"                        }
        },
        "os": {
          "version": "10.15.7"
        }
      },
      "name": "macOS",
      "platform": "web"
    }                                        
 *                                                    
  }
 * This function stringify the payload attributes if it's an array or objects.
 * @param {*} payload
 * @returns
 * return the final payload after converting to the relevant data-types.
 */
const convertObjectAndArrayToString = (payload, event) => {
  const finalPayload = {};
  if (payload) {
    Object.keys(payload).forEach((key) => {
      if (payload[key] && (Array.isArray(payload[key]) || typeof payload[key] === 'object')) {
        finalPayload[key] = JSON.stringify(payload[key]);
      } else {
        finalPayload[key] = payload[key];
      }
    });
    if (event === 'Charged' && finalPayload.Items) {
      finalPayload.Items = JSON.parse(finalPayload.Items);
      if (
        !Array.isArray(finalPayload.Items) ||
        (Array.isArray(finalPayload.Items) && typeof finalPayload.Items[0] !== 'object')
      ) {
        throw new InstrumentationError('Products property value must be an array of objects');
      }
    }
  }
  return finalPayload;
};

// generates clevertap identify payload with both objectId and identity
const mapIdentifyPayloadWithObjectId = (message, profile) => {
  const userId = getFieldValueFromMessage(message, 'userIdOnly');
  const anonymousId = get(message, 'anonymousId');
  const payload = {
    type: 'profile',
    profileData: profile,
    ts: get(message, 'traits.ts') || get(message, 'context.traits.ts'),
  };

  // If timestamp is not in unix format
  if (payload.ts && !Number(payload.ts)) {
    payload.ts = toUnixTimestamp(payload.ts);
  }

  // If anonymousId is present prioritising to set it as objectId
  if (anonymousId) {
    payload.objectId = anonymousId;
    // If userId is present we set it as identity inside profiledData
    if (userId) {
      payload.profileData.identity = userId;
    }
  } else if (userId) {
    // If only userId present set it as identity in root of payload
    payload.identity = userId;
  }
  return {
    d: [payload],
  };
};

// generates clevertap identify payload with only identity
const mapIdentifyPayload = (message, profile) => {
  const payload = {
    d: [
      {
        type: 'profile',
        profileData: profile,
        ts: get(message, 'traits.ts') || get(message, 'context.traits.ts'),
        identity: getFieldValueFromMessage(message, 'userId'),
      },
    ],
  };

  // If timestamp is not in unix format
  if (payload.d[0].ts && !Number(payload.d[0].ts)) {
    payload.d[0].ts = toUnixTimestamp(payload.d[0].ts);
  }
  return payload;
};

const mapAliasPayload = (message) => {
  const payload = {
    d: [
      {
        type: 'profile',
        profileData: { identity: message.userId },
        ts: get(message, 'traits.ts') || get(message, 'context.traits.ts'),
        identity: message.previousId,
      },
    ],
  };

  // If timestamp is not in unix format
  if (payload.d[0].ts && !Number(payload.d[0].ts)) {
    payload.d[0].ts = toUnixTimestamp(payload.d[0].ts);
  }
  return payload;
};

// generates clevertap tracking payload with objectId or identity
const mapTrackPayloadWithObjectId = (message, eventPayload) => {
  const userId = getFieldValueFromMessage(message, 'userIdOnly');
  const anonymousId = get(message, 'anonymousId');
  if (anonymousId) {
    // If anonymousId is present set it as objectId in root
    eventPayload.objectId = anonymousId;
  } else if (userId) {
    // If userId is present set it as identity in root
    eventPayload.identity = userId;
  } else {
    // Flow should not reach here fail safety
    throw InstrumentationError('Unable to process without anonymousId or userId');
  }
  return eventPayload;
};

// generates clevertap tracking payload with only identity
const mapTrackPayload = (message, eventPayload) => {
  eventPayload.identity = getFieldValueFromMessage(message, 'userId');
  return eventPayload;
};

// Here we are creating the profileData info for identify calls
// ---------------------------------------------------------------------
const getClevertapProfile = (message, category) => {
  let profile = constructPayload(message, MAPPING_CONFIG[category.name]);
  // Extract other K-V property from traits about user custom properties
  if (
    !get(profile, 'Name') &&
    getFieldValueFromMessage(message, 'firstName') &&
    getFieldValueFromMessage(message, 'lastName')
  ) {
    profile.Name = `${getFieldValueFromMessage(message, 'firstName')} ${getFieldValueFromMessage(
      message,
      'lastName',
    )}`;
  }
  profile = extractCustomFields(
    message,
    profile,
    ['traits', 'context.traits'],
    CLEVERTAP_DEFAULT_EXCLUSION,
  );
  profile = convertObjectAndArrayToString(profile);

  // Add additional properties being passed inside overrideFields in traits or contextual traits
  // to be added to the profile object, to be sent into Clevertap profileData
  if (message.traits?.overrideFields) {
    const { overrideFields } = message.traits;
    Object.assign(profile, overrideFields);
  } else if (message.context.traits?.overrideFields) {
    const { overrideFields } = message.context.traits;
    Object.assign(profile, overrideFields);
  }

  return removeUndefinedAndNullValues(profile);
};

const responseBuilderSimple = (message, category, destination) => {
  let payload;
  // For identify type of events we require a specific type of payload
  // Source: https://developer.clevertap.com/docs/upload-user-profiles-api
  // ---------------------------------------------------------------------
  if (category.type === 'identify') {
    const profile = getClevertapProfile(message, category);
    if (destination.Config.enableObjectIdMapping) {
      payload = mapIdentifyPayloadWithObjectId(message, profile);
      // In case we have device token present we return an array
      // of response the first object is identify payload and second
      // object is the upload device token payload
      // TO use uploadDeviceToken api "enableObjectIdMapping" should be enabled
      // also anoymousId should be present to map it with objectId
      const deviceToken = get(message, 'context.device.token');
      let deviceOS = get(message, 'context.os.name');
      if (deviceOS) {
        deviceOS = deviceOS.toLowerCase();
      }
      if (
        get(message, 'anonymousId') &&
        deviceToken &&
        (deviceOS === 'android' || isAppleFamily(deviceOS))
      ) {
        const tokenType = deviceOS === 'android' ? 'fcm' : 'apns';
        const payloadForDeviceToken = {
          d: [
            {
              type: 'token',
              tokenData: {
                id: deviceToken,
                type: tokenType,
              },
              objectId: get(message, 'anonymousId'),
            },
          ],
        };
        const respArr = [];
        respArr.push(responseWrapper(payload, destination)); // identify
        respArr.push(responseWrapper(payloadForDeviceToken, destination)); // device token
        return respArr;
      }
    } else {
      payload = mapIdentifyPayload(message, profile);
    }
  } else if (category.type === 'alias') {
    // const profile = getClevertapProfile(message, category);
    payload = mapAliasPayload(message);
  } else {
    // If trackAnonymous option is disabled from dashboard then we will check for presence of userId only
    // if userId is not present we will throw error. If it is enabled we will process the event with anonId.
    if (!destination.Config.trackAnonymous && !getFieldValueFromMessage(message, 'userIdOnly')) {
      throw new InstrumentationError('userId, not present cannot track anonymous user');
    }
    let eventPayload;
    // For 'Order Completed' type of events we are mapping it as 'Charged'
    // Special event in Clevertap.
    // Source: https://developer.clevertap.com/docs/concepts-events#recording-customer-purchases
    if (get(message.event) && get(message.event).toLowerCase() === 'order completed') {
      eventPayload = {
        evtName: 'Charged',
        evtData: constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.ECOM.name]),
        ts: get(message, 'properties.ts'),
      };

      eventPayload.evtData = extractCustomFields(
        message,
        eventPayload.evtData,
        ['properties'],
        ['checkout_id', 'revenue', 'products', 'ts'],
      );
    }
    // For other type of events we need to follow payload for sending events
    // Source: https://developer.clevertap.com/docs/upload-events-api
    // ----------------------------------------------------------------------
    else {
      eventPayload = constructPayload(message, MAPPING_CONFIG[category.name]);
    }
    eventPayload.type = 'event';
    // stringify the evtData if it's an Object or array.
    if (eventPayload.evtData) {
      eventPayload.evtData = convertObjectAndArrayToString(
        eventPayload.evtData,
        eventPayload.evtName,
      );
    }

    // setting identification for tracking payload here based on destination config
    if (destination.Config.enableObjectIdMapping) {
      eventPayload = mapTrackPayloadWithObjectId(message, eventPayload);
    } else {
      eventPayload = mapTrackPayload(message, eventPayload);
    }

    // If timestamp is not in unix format
    if (eventPayload.ts && !Number(eventPayload.ts)) {
      eventPayload.ts = toUnixTimestamp(eventPayload.ts);
    }

    payload = {
      d: [removeUndefinedAndNullValues(eventPayload)],
    };
  }

  if (payload) {
    return responseWrapper(payload, destination);
  }
  // fail-safety for developer error
  throw new TransformationError('Payload could not be constructed');
};
// Main Process func for processing events
// Idnetify, Track, Screen, and Page calls are supported
const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }
  const messageType = message.type.toLowerCase();

  let category;
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      break;
    case EventType.PAGE:
      category = CONFIG_CATEGORIES.PAGE;
      break;
    case EventType.SCREEN:
      category = CONFIG_CATEGORIES.SCREEN;
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    case EventType.ALIAS:
      category = CONFIG_CATEGORIES.ALIAS;
      break;
    default:
      throw new InstrumentationError('Message type not supported');
  }
  return responseBuilderSimple(message, category, destination);
};

const process = (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
