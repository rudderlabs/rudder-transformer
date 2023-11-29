/* eslint-disable no-nested-ternary */
const {
  NetworkError,
  ConfigurationError,
  InstrumentationError,
  isDefinedAndNotNull,
  isEmpty,
} = require('@rudderstack/integrations-lib');
const myAxios = require('../../../util/myAxios');
const { EventType } = require('../../../constants');
const { CONFIG_CATEGORIES, MAPPING_CONFIG, ENDPOINTS } = require('./config');
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
  simpleProcessRouterDest,
} = require('../../util');
const {
  getDynamicErrorType,
  nodeSysErrorToStatus,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');

const CONTACT_KEY_KEY = 'Contact Key';

// DOC: https://developer.salesforce.com/docs/atlas.en-us.mc-app-development.meta/mc-app-development/access-token-s2s.htm

const getToken = async (clientId, clientSecret, subdomain) => {
  try {
    const resp = await myAxios.post(
      `https://${subdomain}.${ENDPOINTS.GET_TOKEN}`,
      {
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      },
      {
        'Content-Type': JSON_MIME_TYPE,
      },
      { destType: 'sfmc', feature: 'transformation' },
    );
    if (resp && resp.data) {
      return resp.data.access_token;
    }
    const status = resp.status || 400;
    throw new NetworkError(
      'Could not retrieve access token',
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      resp,
    );
  } catch (error) {
    if (!isEmpty(error.response)) {
      const status = error.status || 400;
      throw new NetworkError(`Authorization Failed ${error.response.statusText}`, status, {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      });
    } else {
      const httpError = nodeSysErrorToStatus(error.code);
      const status = httpError.status || 400;
      throw new NetworkError(`Authorization Failed ${httpError.message}`, status, {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      });
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
    getFieldValueFromMessage(message, 'userIdOnly') || getFieldValueFromMessage(message, 'email');
  if (!contactKey) {
    throw new InstrumentationError('Either userId or email is required');
  }
  response.body.JSON = { attributeSets: [], contactKey };
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Bearer ${authToken}`,
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
  uuid,
) => {
  // set contact key as userId or email from traits. Either of these two is required.
  const contactKey =
    getFieldValueFromMessage(message, 'userIdOnly') || getFieldValueFromMessage(message, 'email');
  if (!contactKey) {
    throw new InstrumentationError('Either userId or email is required');
  }

  const response = defaultRequestConfig();
  response.method = defaultPutRequestConfig.requestMethod;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Bearer ${authToken}`,
  };
  // multiple primary keys can be set by the user as comma separated.
  let primaryKeyArray;
  if (primaryKey) {
    primaryKeyArray = primaryKey.split(',');
  }
  // Rudder handles the payload by sending the properties as title case only as the user is instructed to set column names in data
  // extensions as title case.
  const payload = removeUndefinedAndNullValues(
    toTitleCase(flattenJson(constructPayload(message, MAPPING_CONFIG[category.name]))),
  );
  // for both identify and track calls with only one primary key set as "Contact Key" is same.
  if (
    type === 'identify' ||
    (type === 'track' &&
      primaryKeyArray.length === 1 &&
      primaryKeyArray.includes(CONTACT_KEY_KEY) &&
      !uuid)
  ) {
    response.endpoint = `https://${subdomain}.${ENDPOINTS.INSERT_CONTACTS}${externalKey}/rows/Contact Key:${contactKey}`;
    response.body.JSON = {
      values: {
        [CONTACT_KEY_KEY]: contactKey,
        ...payload,
      },
    };
  } else if (type === 'track' && uuid) {
    // for track calls and uuid as true the primary keys set will be overridden and only Uuid will be set as the primary key
    const generateUuid = message.messageId; // messageId is set as the Uuid.
    response.endpoint = `https://${subdomain}.${ENDPOINTS.INSERT_CONTACTS}${externalKey}/rows/Uuid:${generateUuid}`;
    response.body.JSON = {
      values: {
        Uuid: generateUuid,
        ...payload,
      },
    };
  } else {
    // other track cases where there are multiple primary keys or one primary key which is not "Contact Key" and uuid is false
    let strPrimary = '';
    primaryKeyArray.forEach((key, index) => {
      const keyTrimmed = key.trim();
      let payloadValue = payload[keyTrimmed];
      if (keyTrimmed === CONTACT_KEY_KEY) {
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
        ...payload,
      },
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
    eventToUUID,
  } = destination.Config;
  // map from an event name to an external key of a data extension.
  const hashMapExternalKey = getHashFromArray(eventToExternalKey, 'from', 'to');
  // map from an event name to a primary key of the data extension.
  const hashMapPrimaryKey = getHashFromArray(eventToPrimaryKey, 'from', 'to');
  // map from an event name to uuid as true or false to determine to send uuid as primary key or not.
  const hashMapUUID = getHashFromArray(eventToUUID, 'event', 'uuid');
  // token needed for authorization for subsequent calls
  const authToken = await getToken(clientId, clientSecret, subDomain);
  // if createOrUpdateContacts is true identify calls for create and update of contacts will not occur.
  if (category.type === 'identify' && !createOrUpdateContacts) {
    // first call to identify the contact
    const identifyContactsPayload = responseBuilderForIdentifyContacts(
      message,
      subDomain,
      authToken,
    );
    // second call to insert/update data against the contact in the data extension
    const identifyInsertDataPayload = responseBuilderForInsertData(
      message,
      externalKey,
      subDomain,
      category,
      authToken,
      'identify',
    );
    return [identifyContactsPayload, identifyInsertDataPayload];
  }

  if (category.type === 'identify' && createOrUpdateContacts) {
    throw new ConfigurationError(
      'Creating or updating contacts is disabled. To enable this feature set "Do Not Create or Update Contacts" to false',
    );
  }

  if (category.type === 'track') {
    if (isEmpty(message.event)) {
      throw new ConfigurationError('Event name is required for track events');
    }
    if (typeof message.event !== 'string') {
      throw new ConfigurationError('Event name must be a string');
    }
    if (!isDefinedAndNotNull(hashMapExternalKey[message.event.toLowerCase()])) {
      throw new ConfigurationError('Event not mapped for this track call');
    }

    return responseBuilderForInsertData(
      message,
      hashMapExternalKey[message.event.toLowerCase()],
      subDomain,
      category,
      authToken,
      'track',
      hashMapPrimaryKey[message.event.toLowerCase()] || CONTACT_KEY_KEY,
      hashMapUUID[message.event.toLowerCase()],
    );
  }

  throw new ConfigurationError(`Event type '${category.type}' not supported`);
};

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
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
      throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }

  // build the response
  const response = await responseBuilderSimple(message, category, destination);
  return response;
};

const process = async (event) => {
  const response = await processEvent(event.message, event.destination);
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest, responseBuilderSimple };
