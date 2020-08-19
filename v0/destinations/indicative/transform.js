const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  defaultPostRequestConfig
} = require("../../util");

const handleProperties = properties => {
  const result = {};
  let l;

  const recurse = (cur, prop) => {
    let i;
    if (Object(cur) !== cur) {
      // primitive types
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      if (cur.length > 0) {
        const fel = cur[0];
        if (Object(fel) !== fel) {
          result[prop] = cur.toString();
        } else if (Array.isArray(fel)) {
          // ignore array or arrys
        } else {
          const objectMap = {};
          Object.keys(fel).forEach(key => {
            // discarding nested objects and arrays for array of objects
            // only allowing primitive times for array of objects
            if (Object(fel[key]) !== fel[key]) {
              objectMap[key] = [];
            }
          });

          for (i = 0, l = cur.length; i < l; i += 1) {
            const el = cur[i];
            Object.keys(el).forEach(k => {
              if (Object.keys(objectMap).indexOf(k) !== -1) {
                objectMap[k].push(el[k]);
              }
            });
          }

          Object.keys(objectMap).forEach(key => {
            result[prop ? `${prop}.${key}` : key] = objectMap[key].toString();
          });
        }
      }
    } else {
      let isEmpty = true;
      Object.keys(cur).forEach(key => {
        isEmpty = false;
        recurse(cur[key], prop ? `${prop}.${key}` : key);
      });

      if (isEmpty && prop) {
        result[prop] = {};
      }
    }
  };

  recurse(properties, "");
  return result;
};

const responseBuilderSimple = (message, category, destination) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
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
      "Indicative-Client": "RudderStack",
      "Content-Type": "application/json"
    };
    response.userId = getFieldValueFromMessage(message, "userId");
    response.body.JSON = responseBody;
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();

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
      throw new Error("Message type not supported");
  }

  // build the response
  respList.push(responseBuilderSimple(message, category, destination));

  if (messageType === EventType.IDENTIFY) {
    const userId = getFieldValueFromMessage(message, "userIdOnly");
    // append the alias call only if a valid value of "userId" is present
    // otherwise its a request with only anonymousId with traits. alias call isn't ideal
    if (userId) {
      // append an alias call with anonymousId and userId for identity resolution
      respList.push(
        responseBuilderSimple(message, CONFIG_CATEGORIES.ALIAS, destination)
      );
    }
  }

  return respList;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
