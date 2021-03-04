const axios = require("axios");
const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG, ENDPOINTS } = require("./config");
const {
  removeUndefinedAndNullValues,
  getFieldValueFromMessage,
  defaultPostRequestConfig,
  defaultRequestConfig,
  constructPayload,
  flattenJson,
  toTitleCase
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
function responseBuilderForIdentifyInsertData(
  message,
  externalKey,
  subdomain,
  category,
  authToken
) {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const response = defaultRequestConfig();
  const contactKey =
    getFieldValueFromMessage(message, "userId") ||
    getFieldValueFromMessage(message, "email");
  if (!contactKey) {
    throw new Error("Either user id or anonymous id or email is required");
  }
  response.endpoint = `https://${subdomain}.${ENDPOINTS.INSERT_CONTACTS}${externalKey}/rows/Contact Key:${contactKey}`;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(
    toTitleCase(flattenJson(payload))
  );
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
    subdomain,
    createOrUpdateContacts,
    externalKey
  } = destination.Config;
  let identifyContactsPayload;
  let identifyInsertDataPayload;
  if (category.type === "identify" && !createOrUpdateContacts) {
    let authToken = await getToken(clientId, clientSecret, subdomain);
    identifyContactsPayload = responseBuilderForIdentifyContacts(
      message,
      subdomain,
      authToken
    );
    authToken = await getToken(clientId, clientSecret, subdomain);
    identifyInsertDataPayload = responseBuilderForIdentifyInsertData(
      message,
      externalKey,
      subdomain,
      category,
      authToken
    );
    return [identifyContactsPayload, identifyInsertDataPayload];
  }
  return null;
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
    // TODO
    //   case EventType.TRACK:
    //     category = CONFIG_CATEGORIES.TRACK;
    //     break;
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
