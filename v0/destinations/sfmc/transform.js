const axios = require("axios");
const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG, ENDPOINTS } = require("./config");
const {
  removeUndefinedAndNullValues,
  getFieldValueFromMessage,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  defaultRequestConfig,
  constructPayload,
  flattenJson,
  toTitleCase,
  getHashFromArray
} = require("../../util");

async function getToken(clientId, clientSecret, subdomain) {
  try {
    const resp = await axios.post(
      `https://${subdomain}.${ENDPOINTS.GET_TOKEN}`,
      {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret
      },
      {
        "Content-Type": "application/json"
      }
    );
    if (resp && resp.data) return resp.data.access_token;
    throw new Error("Could not retrieve authorisation token");
  } catch (error) {
    throw new Error("Could not retrieve authorisation token");
  }
}
function responseBuilderForIdentifyContacts(message, subdomain, authToken) {
  const response = defaultRequestConfig();
  response.endpoint = `https://${subdomain}.${ENDPOINTS.CONTACTS}`;
  response.method = defaultPostRequestConfig.requestMethod;
  const contactKey =
    getFieldValueFromMessage(message, "userId") ||
    getFieldValueFromMessage(message, "email");
  if (!contactKey) {
    throw new Error("Either user id or anonymous id or email is required");
  }
  response.body.JSON = {
    attributeSets: [], // not sure about this mapping
    contactKey
  };
  response.headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`
  };
  return response;
}
function responseBuilderForInsertData(
  message,
  externalKey,
  subdomain,
  category,
  authToken,
  type,
  primaryKey,
  uuid
) {
  const primaryKeyArray = primaryKey.split(",");
  let payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const response = defaultRequestConfig();
  const contactKey =
    getFieldValueFromMessage(message, "userId") ||
    getFieldValueFromMessage(message, "email");
  if (!contactKey) {
    throw new Error("Either user id or anonymous id or email is required");
  }
  response.method = defaultPutRequestConfig.requestMethod;
  payload = removeUndefinedAndNullValues(toTitleCase(flattenJson(payload)));
  if (
    type === "identify" ||
    (type === "track" &&
      primaryKeyArray.length === 1 &&
      primaryKeyArray.includes("Contact Key") &&
      !uuid)
  ) {
    response.endpoint = `https://${subdomain}.${ENDPOINTS.INSERT_CONTACTS}${externalKey}/rows/Contact Key:${contactKey}`;
    response.body.JSON = {
      values: {
        "Contact Key": contactKey,
        ...payload
      }
    };
  } else if (type === "track" && uuid) {
    const generateUuid = message.messageId;
    response.endpoint = `https://${subdomain}.${ENDPOINTS.INSERT_CONTACTS}${externalKey}/rows/Uuid:${generateUuid}`;
    response.body.JSON = {
      values: {
        Uuid: generateUuid,
        ...payload
      }
    };
  } else {
    let strPrimary = "";
    primaryKeyArray.forEach((key, index) => {
      const keyTrimmed = key.trim();
      let payloadValue = payload[keyTrimmed];
      if (keyTrimmed === "Contact Key") {
        payloadValue = contactKey;
      }
      if (index === 0) {
        strPrimary += `${keyTrimmed}:${payloadValue}`;
      } else {
        strPrimary += `,${keyTrimmed}:${payloadValue}`;
      }
    });
    response.endpoint = `https://${subdomain}.${ENDPOINTS.INSERT_CONTACTS}${externalKey}/rows/${strPrimary}`;
    response.body.JSON = {
      values: {
        ...payload
      }
    };
  }
  response.headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`
  };
  return response;
}
async function responseBuilderSimple(message, category, destination) {
  const {
    clientId,
    clientSecret,
    subDomain,
    createOrUpdateContacts,
    externalKey,
    eventToExternalKey,
    eventToPrimaryKey,
    eventToUUID
  } = destination.Config;
  const hashMapExternalKey = getHashFromArray(eventToExternalKey, "from", "to");
  const hashMapPrimaryKey = getHashFromArray(eventToPrimaryKey, "from", "to");
  const hashMapUUID = getHashFromArray(eventToUUID, "event", "uuid");
  let finalPayload;
  let identifyContactsPayload;
  let identifyInsertDataPayload;
  if (category.type === "identify" && !createOrUpdateContacts) {
    let authToken = await getToken(clientId, clientSecret, subDomain);
    identifyContactsPayload = responseBuilderForIdentifyContacts(
      message,
      subDomain,
      authToken
    );
    authToken = await getToken(clientId, clientSecret, subDomain);
    identifyInsertDataPayload = responseBuilderForInsertData(
      message,
      externalKey,
      subDomain,
      category,
      authToken,
      "identify"
    );
    finalPayload = [identifyContactsPayload, identifyInsertDataPayload];
  } else if (
    category.type === "track" &&
    hashMapExternalKey[message.event.toLowerCase()]
  ) {
    const authToken = await getToken(clientId, clientSecret, subDomain);
    const trackInsertDataPayload = responseBuilderForInsertData(
      message,
      hashMapExternalKey[message.event.toLowerCase()],
      subDomain,
      category,
      authToken,
      "track",
      hashMapPrimaryKey[message.event.toLowerCase()] || "Contact Key",
      hashMapUUID[message.event.toLowerCase()]
    );
    finalPayload = trackInsertDataPayload;
  } else {
    finalPayload = {};
  }
  return finalPayload;
}
const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();
  let category;
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw new Error("Message type not supported");
  }
  // build the response
  return responseBuilderSimple(message, category, destination);
};
const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
