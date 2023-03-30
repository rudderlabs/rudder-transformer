const get = require('get-value');
const { EventType } = require('../../../constants');
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require('./config');
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  defaultPostRequestConfig,
  simpleProcessRouterDest,
} = require('../../util');
const { getUAInfo } = require('./utils');
const { InstrumentationError, TransformationError } = require('../../util/errorTypes');

const handleProperties = (properties) => {
  const result = {};
  let l;

  const recurse = (cur, prop) => {
    let i;
    if (Object(cur) !== cur) {
      // primitive types
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      if (cur.length > 0) {
        // array for primitive type
        const pArr = [];
        // array for storing the objects of the array
        const cArr = [];
        cur.forEach((item) => {
          if (Object(item) !== item) {
            // primitive | push too pArr
            pArr.push(item);
          } else if (Array.isArray(item)) {
            // discard array of arrays
          } else {
            // object | push to cArr
            cArr.push(item);
          }
        });

        // handle primitive element array
        if (pArr.length > 0) {
          result[prop] = pArr.toString();
        }

        // handle object array
        if (cArr.length > 0) {
          // take the first element
          const fel = cArr[0];
          const objectMap = {};

          // take the keys from the first element and store
          // we're expecting all the objects of the array are same
          // we'll discard if a new item is found later on
          Object.keys(fel).forEach((key) => {
            // discarding nested objects and arrays for array of objects
            // only allowing primitive times for array of objects
            if (Object(fel[key]) !== fel[key]) {
              // initiate empty arrays for each of the
              // properties from the object
              objectMap[key] = [];
            }
          });

          // now iterate over the cArr
          for (i = 0, l = cArr.length; i < l; i += 1) {
            const el = cArr[i];
            Object.keys(el).forEach((k) => {
              if (Object.keys(objectMap).includes(k)) {
                // if the key is in the objectMap -
                // in other words, the key was present in the first element of the array
                objectMap[k].push(el[k]);
              }
            });
          }

          // fonally add the stringified arrays to the final result
          Object.keys(objectMap).forEach((key) => {
            result[prop ? `${prop}.${key}` : key] = objectMap[key].toString();
          });
        }
      }
      // else {
      // result[prop] = [];
      // }
    } else {
      // let isEmpty = true;
      Object.keys(cur).forEach((key) => {
        // isEmpty = false;
        recurse(cur[key], prop ? `${prop}.${key}` : key);
      });

      // if (isEmpty && prop) {
      //   result[prop] = {};
      // }
    }
  };

  recurse(properties, '');
  return result;
};

const responseBuilderSimple = (message, category, destination) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  // Passing user agent info for identify, track, screen and page calls
  if (category.name !== CONFIG_CATEGORIES.ALIAS.name) {
    payload.properties = { ...payload.properties, ...getUAInfo(message) };
  }

  if (payload) {
    if (payload.properties) {
      // keeping this properties handling logic here
      // If we observe similar expectation from other destination, will move to Utils
      payload.properties = handleProperties(payload.properties);
    }
    const responseBody = { ...payload, apiKey: destination.Config.apiKey };
    const response = defaultRequestConfig();
    response.endpoint = category.endPoint;
    response.method = defaultPostRequestConfig.requestMethod;
    response.headers = {
      'Indicative-Client': 'RudderStack',
      'Content-Type': 'application/json',
    };
    response.userId = getFieldValueFromMessage(message, 'userId');
    response.body.JSON = responseBody;
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError('Payload could not be constructed');
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }
  const messageType = message.type.toLowerCase();
  const formattedMessage = message;

  let category;
  const respList = [];
  switch (messageType) {
    case EventType.ALIAS:
      category = CONFIG_CATEGORIES.ALIAS;
      break;
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
    default:
      throw new InstrumentationError(`Message type ${messageType} not supported`);
  }

  // append context.page to properties for page, track
  if (messageType === EventType.PAGE || messageType === EventType.TRACK) {
    if (!formattedMessage.properties) {
      formattedMessage.properties = {};
    }
    formattedMessage.properties = {
      ...get(formattedMessage, 'context.page'),
      campaign: get(formattedMessage, 'context.campaign'),
      ...formattedMessage.properties,
    };
  }

  // build the response
  respList.push(responseBuilderSimple(formattedMessage, category, destination));

  if (messageType === EventType.IDENTIFY) {
    const userId = getFieldValueFromMessage(formattedMessage, 'userIdOnly');
    // append the alias call only if a valid value of "userId" is present
    // otherwise its a request with only anonymousId with traits. alias call isn't ideal
    if (userId) {
      // append an alias call with anonymousId and userId for identity resolution
      respList.push(responseBuilderSimple(formattedMessage, CONFIG_CATEGORIES.ALIAS, destination));
    }
  }

  return respList;
};

const process = (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
