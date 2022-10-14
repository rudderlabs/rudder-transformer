/* eslint-disable no-nested-ternary */
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
  getHashFromArray,
  CustomError,
  isEmpty,
  simpleProcessRouterDest
} = require("../../util");
const {
  nodeSysErrorToStatus
} = require("../../../adapters/utils/networkUtils");

// DOC: https://developer.salesforce.com/docs/atlas.en-us.mc-app-development.meta/mc-app-development/access-token-s2s.htm

const getToken = async (clientId, clientSecret, subdomain) => {
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
    if (resp && resp.data) {
      return resp.data.access_token;
    }
    throw new CustomError("Could not retrieve authorisation token", 400);
  } catch (error) {
    if (!isEmpty(error.response)) {
      throw new CustomError(
        `Authorization Failed ${error.response.statusText}`,
        error.response.status
      );
    } else {
      const httpError = nodeSysErrorToStatus(error.code);
      throw new CustomError(
        `Authorization Failed ${httpError.message}`,
        httpError.status
      );
    }
  }
};

// DOC : https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/createContacts.htm

const responseBuilderForIdentifyContacts = (message, subdomain, authToken) => {
  const response = defaultRequestConfig();
  response.endpoint = `https://${subdomain}.${ENDPOINTS.CONTACTS}`;
  response.method = defaultPostRequestConfig.requestMethod;
  // set contact key as userId or email from traits. Either of these two is required.
  const contactKey =
    getFieldValueFromMessage(message, "userIdOnly") ||
    getFieldValueFromMessage(message, "email");
  if (!contactKey) {
    throw new CustomError("Either userId or email is required", 400);
  }
  response.body.JSON = { attributeSets: [], contactKey };
  response.headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`
  };
  return response;
};

// DOC : https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/putDataExtensionRowByKey.htm?search_text=%252Fhub%252Fv1%252Fdataevents%252Fkey:%7Bkey%7D%252Frows%252F%7BprimaryKeys%7D

const responseBuilderForInsertData = (
  message,
  externalKey,
  subdomain,
  category,
  authToken,
  type,
  primaryKey,
  uuid
) => {
  // set contact key as userId or email from traits. Either of these two is required.
  const contactKey =
    getFieldValueFromMessage(message, "userIdOnly") ||
    getFieldValueFromMessage(message, "email");
  if (!contactKey) {
    throw new CustomError("Either userId or email is required", 400);
  }

  const response = defaultRequestConfig();
  response.method = defaultPutRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`
  };
  // multiple primary keys can be set by the user as comma separated.
  let primaryKeyArray;
  if (primaryKey) {
    primaryKeyArray = primaryKey.split(",");
  }
  // Rudder handles the payload by sending the properties as title case only as the user is instructed to set column names in data
  // extensions as title case.
  const payload = removeUndefinedAndNullValues(
    toTitleCase(
      flattenJson(constructPayload(message, MAPPING_CONFIG[category.name]))
    )
  );
  // for both identify and track calls with only one primary key set as "Contact Key" is same.
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
    // for track calls and uuid as true the primary keys set will be overridden and only Uuid will be set as the primary key
    const generateUuid = message.messageId; // messageId is set as the Uuid.
    response.endpoint = `https://${subdomain}.${ENDPOINTS.INSERT_CONTACTS}${externalKey}/rows/Uuid:${generateUuid}`;
    response.body.JSON = {
      values: {
        Uuid: generateUuid,
        ...payload
      }
    };
  } else {
    // other track cases where there are multiple primary keys or one primary key which is not "Contact Key" and uuid is false
    let strPrimary = "";
    primaryKeyArray.forEach((key, index) => {
      const keyTrimmed = key.trim();
      let payloadValue = payload[keyTrimmed];
      if (keyTrimmed === "Contact Key") {
        // if one of the multiple primary key is "Contact Key"
        payloadValue = contactKey;
      }
      // to format the strin like "Primary Key1":"value1","Primary Key2":"value2"
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

  return response;
};

const responseBuilderSimple = async (message, category, destination) => {
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
  // map from an event name to an external key of a data extension.
  const hashMapExternalKey = getHashFromArray(eventToExternalKey, "from", "to");
  // map from an event name to a primary key of the data extension.
  const hashMapPrimaryKey = getHashFromArray(eventToPrimaryKey, "from", "to");
  // map from an event name to uuid as true or false to determine to send uuid as primary key or not.
  const hashMapUUID = getHashFromArray(eventToUUID, "event", "uuid");
  // token needed for authorization for subsequent calls
  const authToken = await getToken(clientId, clientSecret, subDomain);
  // if createOrUpdateContacts is true identify calls for create and update of contacts will not occur.
  if (category.type === "identify" && !createOrUpdateContacts) {
    // first call to identify the contact
    const identifyContactsPayload = responseBuilderForIdentifyContacts(
      message,
      subDomain,
      authToken
    );
    // second call to insert/update data against the contact in the data extension
    const identifyInsertDataPayload = responseBuilderForInsertData(
      message,
      externalKey,
      subDomain,
      category,
      authToken,
      "identify"
    );
    return [identifyContactsPayload, identifyInsertDataPayload];
  }

  if (category.type === "identify" && createOrUpdateContacts) {
    throw new CustomError("Creating or updating contacts is disabled", 400);
  }

  if (
    category.type === "track" &&
    hashMapExternalKey[message.event.toLowerCase()]
  ) {
    return responseBuilderForInsertData(
      message,
      hashMapExternalKey[message.event.toLowerCase()],
      subDomain,
      category,
      authToken,
      "track",
      hashMapPrimaryKey[message.event.toLowerCase()] || "Contact Key",
      hashMapUUID[message.event.toLowerCase()]
    );
  }

  throw new CustomError("Event not mapped for this track call", 400);
};

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  const messageType = message.type.toLowerCase();
  let category;
  // only accept track and identify calls
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw new CustomError("Message type not supported", 400);
  }

  // build the response
  const response = await responseBuilderSimple(message, category, destination);
  return response;
};

const process = async event => {
  const response = await processEvent(event.message, event.destination);
  return response;
};

const processRouterDest = async inputs => {
  const respList = await simpleProcessRouterDest(inputs, "SFMC", process);
  return respList;
};

module.exports = { process, processRouterDest };
