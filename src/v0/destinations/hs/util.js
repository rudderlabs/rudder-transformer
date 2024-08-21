/* eslint-disable no-await-in-loop */
const lodash = require('lodash');
const set = require('set-value');
const get = require('get-value');
const {
  NetworkInstrumentationError,
  InstrumentationError,
  ConfigurationError,
  NetworkError,
} = require('@rudderstack/integrations-lib');
const { httpGET, httpPOST } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const {
  getFieldValueFromMessage,
  constructPayload,
  isEmpty,
  getHashFromArray,
  getDestinationExternalIDInfoForRetl,
  getValueFromMessage,
  isNull,
  validateEventName,
  defaultBatchRequestConfig,
  defaultPostRequestConfig,
  getSuccessRespEvents,
} = require('../../util');
const {
  CONTACT_PROPERTY_MAP_ENDPOINT,
  IDENTIFY_CRM_SEARCH_CONTACT,
  IDENTIFY_CRM_SEARCH_ALL_OBJECTS,
  SEARCH_LIMIT_VALUE,
  hsCommonConfigJson,
  primaryToSecondaryFields,
  DESTINATION,
  MAX_CONTACTS_PER_REQUEST,
} = require('./config');

const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');

/**
 * validate destination config and check for existence of data
 * @param {*} param0
 */
const validateDestinationConfig = ({ Config }) => {
  if (Config.authorizationType === 'newPrivateAppApi') {
    // NEW API
    if (!Config.accessToken) {
      throw new ConfigurationError('Access Token not found. Aborting');
    }
  } else {
    // Legacy API
    if (!Config.hubID) {
      throw new ConfigurationError('Hub ID not found. Aborting');
    }
    if (!Config.apiKey) {
      throw new ConfigurationError('API Key not found. Aborting');
    }
  }
};

/**
 * modify the key inorder to suite with HS constraints
 * @param {*} key
 * @returns
 */
const formatKey = (key) => {
  // lowercase and replace spaces and . with _
  let modifiedKey = key.toLowerCase();
  modifiedKey = modifiedKey.replace(/\s+/g, '_');
  modifiedKey = modifiedKey.replace(/\./g, '_');
  return modifiedKey;
};

/**
 * get traits from traits or properties
 * @param {*} message
 * @returns
 */
const fetchFinalSetOfTraits = (message) => {
  // get from traits or properties
  let traits = getFieldValueFromMessage(message, 'traits');
  if (!traits || Object.keys(traits).length === 0) {
    traits = message.properties;
  }
  return traits;
};

/**
 * get all the hubspot properties
 * @param {*} destination
 * @returns
 */
const getProperties = async (destination, metadata) => {
  let hubspotPropertyMap = {};
  let hubspotPropertyMapResponse;
  const { Config } = destination;

  // select API authorization type
  if (Config.authorizationType === 'newPrivateAppApi') {
    // Private Apps
    const requestOptions = {
      headers: {
        'Content-Type': JSON_MIME_TYPE,
        Authorization: `Bearer ${Config.accessToken}`,
      },
    };
    hubspotPropertyMapResponse = await httpGET(CONTACT_PROPERTY_MAP_ENDPOINT, requestOptions, {
      destType: 'hs',
      feature: 'transformation',
      endpointPath: `/properties/v1/contacts/properties`,
      requestMethod: 'GET',
      module: 'router',
      metadata,
    });
    hubspotPropertyMapResponse = processAxiosResponse(hubspotPropertyMapResponse);
  } else {
    // API Key (hapikey)
    const url = `${CONTACT_PROPERTY_MAP_ENDPOINT}?hapikey=${Config.apiKey}`;
    hubspotPropertyMapResponse = await httpGET(
      url,
      {},
      {
        destType: 'hs',
        feature: 'transformation',
        endpointPath: `/properties/v1/contacts/properties?hapikey`,
        requestMethod: 'GET',
        module: 'router',
        metadata,
      },
    );
    hubspotPropertyMapResponse = processAxiosResponse(hubspotPropertyMapResponse);
  }

  if (hubspotPropertyMapResponse.status !== 200) {
    throw new NetworkError(
      `Failed to get hubspot properties: ${JSON.stringify(hubspotPropertyMapResponse.response)}`,
      hubspotPropertyMapResponse.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(hubspotPropertyMapResponse.status),
      },
      hubspotPropertyMapResponse,
    );
  }

  const propertyMap = {};
  if (hubspotPropertyMapResponse.response && Array.isArray(hubspotPropertyMapResponse.response)) {
    hubspotPropertyMapResponse.response.forEach((element) => {
      propertyMap[element.name] = element.type;
    });
  }

  hubspotPropertyMap = propertyMap;
  return hubspotPropertyMap;
};

/**
 * Validates the Hubspot property and payload property data types
 * @param {*} propertyMap
 * @param {*} hsSupportedKey
 * @param {*} value
 * @param {*} traitsKey
 */
const validatePayloadDataTypes = (propertyMap, hsSupportedKey, value, traitsKey) => {
  let propValue = value;
  // Hub spot data type validations
  if (propertyMap[hsSupportedKey] === 'string' && typeof propValue !== 'string') {
    if (typeof propValue === 'object') {
      propValue = JSON.stringify(propValue);
    } else {
      propValue = propValue.toString();
    }
  }

  if (propertyMap[hsSupportedKey] === 'bool' && typeof propValue === 'object') {
    throw new InstrumentationError(
      `Property ${traitsKey} data type ${typeof propValue} is not matching with Hubspot property data type ${
        propertyMap[hsSupportedKey]
      }`,
    );
  }

  if (propertyMap[hsSupportedKey] === 'number' && typeof propValue !== 'number') {
    throw new InstrumentationError(
      `Property ${traitsKey} data type ${typeof propValue} is not matching with Hubspot property data type ${
        propertyMap[hsSupportedKey]
      }`,
    );
  }

  return propValue;
};

/**
 * Converts date to UTC Midnight TimeStamp
 * @param {*} propValue
 * @returns
 */
const getUTCMidnightTimeStampValue = (propValue) => {
  const time = propValue;
  const date = new Date(time);
  date.setUTCHours(0, 0, 0, 0);
  return date.getTime();
};

/**
 * add addtional properties in the payload that is provided in traits
 * only when it matches with HS properties (pre-defined/created from dashboard)
 * @param {*} message
 * @param {*} destination
 * @param {*} propertyMap
 * @returns
 */
const getTransformedJSON = async ({ message, destination, metadata }, propertyMap) => {
  let rawPayload = {};
  const traits = fetchFinalSetOfTraits(message);

  if (traits) {
    const traitsKeys = Object.keys(traits);
    if (!propertyMap) {
      // fetch HS properties
      // eslint-disable-next-line no-param-reassign
      propertyMap = await getProperties(destination, metadata);
    }
    rawPayload = constructPayload(message, hsCommonConfigJson);

    // if there is any extra/custom property in hubspot, that has not already
    // been mapped but exists in the traits, we will include those values to the final payload
    traitsKeys.forEach((traitsKey) => {
      // lowercase and replace ' ' & '.' with '_'
      const hsSupportedKey = formatKey(traitsKey);
      if (!rawPayload[traitsKey] && propertyMap[hsSupportedKey]) {
        // HS accepts empty string to remove the property from contact
        // https://community.hubspot.com/t5/APIs-Integrations/Clearing-values-of-custom-properties-in-Hubspot-contact-using/m-p/409156
        let propValue = isNull(traits[traitsKey]) ? '' : traits[traitsKey];
        if (propertyMap[hsSupportedKey] === 'date') {
          propValue = getUTCMidnightTimeStampValue(propValue);
        }

        rawPayload[hsSupportedKey] = validatePayloadDataTypes(
          propertyMap,
          hsSupportedKey,
          propValue,
          traitsKey,
        );
      }
    });
  }
  return { ...rawPayload };
};

/**
 * transform the payload data into following structure.
 * Example:
 * Input
 *  {
 *    email: testhubspot2@email.com"
 *    firstname: "Test Hubspot"
 *  }
 *
 * Output:
 *  {
 *    "property": "email",
 *    "value": "testhubspot2@email.com"
 *  },
 *  {
 *    "property": "firstname",
 *    "value": "Test Hubspot"
 *  }
 * @param {*} propMap
 * @returns
 */
const formatPropertyValueForIdentify = (propMap) =>
  Object.keys(propMap).map((key) => ({ property: key, value: propMap[key] }));

/**
 * for batching -
 * extract email and remove it from the final payload
 * @param {*} properties
 * @returns
 */
const getEmailAndUpdatedProps = (properties) => {
  const index = properties.findIndex((prop) => prop.property === 'email');
  return {
    email: properties[index].value,
    updatedProperties: properties.filter((prop, i) => i !== index),
  };
};

/* NEW API util functions */

/**
 * @param {*} message The entire message object
 * @param {*} sourceKey the base object to search the lookup value from
 * @param {*} lookupField destination.Config.lookupField or email
 * @returns returns the lookup value
 */
const getMappingFieldValueFormMessage = (message, sourceKey, lookupField) => {
  const baseObject = get(message, `${sourceKey}`);
  const lookupValue = baseObject ? baseObject[`${lookupField}`] : null;
  return lookupValue;
};

/**
 * A function to retrieve lookup value by searching the lookup field in
 * ["traits", "context.traits", "properties"]
 * @param {*} message The message object
 * @param {*} lookupField either destination.Config.lookupField or email
 * @returns object containing the name of the lookupField and the lookup value
 */
const getLookupFieldValue = (message, lookupField) => {
  const SOURCE_KEYS = ['traits', 'context.traits', 'properties'];
  let value = getValueFromMessage(message, `${lookupField}`);
  if (!value) {
    // Check in free-flowing object level
    SOURCE_KEYS.some((sourceKey) => {
      value = getMappingFieldValueFormMessage(message, sourceKey, lookupField);
      return !!value;
    });
  }
  const lookupValueInfo = value ? { fieldName: lookupField, value } : null;
  return lookupValueInfo;
};

/**
 * look for the contact in hubspot and extract its contactId for updation
 * Ref - https://developers.hubspot.com/docs/api/crm/contacts#endpoint?spec=GET-/crm/v3/objects/contacts
 * @param {*} destination
 * @returns
 */
const searchContacts = async (message, destination, metadata) => {
  const { Config } = destination;
  let searchContactsResponse;
  let contactId;
  if (!getFieldValueFromMessage(message, 'traits') && !message.properties) {
    throw new InstrumentationError('Identify - Invalid traits value for lookup field');
  }
  const lookupFieldInfo =
    getLookupFieldValue(message, Config.lookupField) || getLookupFieldValue(message, 'email');
  if (!lookupFieldInfo?.value) {
    throw new InstrumentationError(
      'Identify:: email i.e a default lookup field for contact lookup not found in traits',
    );
  }

  const requestData = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: lookupFieldInfo.fieldName,
            value: lookupFieldInfo.value,
            operator: 'EQ',
          },
        ],
      },
    ],
    sorts: ['ascending'],
    properties: [lookupFieldInfo.fieldName],
    limit: 2,
    after: 0,
  };

  const endpointPath = '/contacts/search';
  if (Config.authorizationType === 'newPrivateAppApi') {
    // Private Apps
    const requestOptions = {
      headers: {
        'Content-Type': JSON_MIME_TYPE,
        Authorization: `Bearer ${Config.accessToken}`,
      },
    };
    searchContactsResponse = await httpPOST(
      IDENTIFY_CRM_SEARCH_CONTACT,
      requestData,
      requestOptions,
      {
        destType: 'hs',
        feature: 'transformation',
        endpointPath,
        requestMethod: 'POST',
        module: 'router',
        metadata,
      },
    );
    searchContactsResponse = processAxiosResponse(searchContactsResponse);
  } else {
    // API Key
    const url = `${IDENTIFY_CRM_SEARCH_CONTACT}?hapikey=${Config.apiKey}`;
    searchContactsResponse = await httpPOST(url, requestData, {
      destType: 'hs',
      feature: 'transformation',
      endpointPath,
      requestMethod: 'POST',
      module: 'router',
      metadata,
    });
    searchContactsResponse = processAxiosResponse(searchContactsResponse);
  }

  if (searchContactsResponse.status !== 200) {
    throw new NetworkError(
      `Failed to get hubspot contacts: ${JSON.stringify(searchContactsResponse.response)}`,
      searchContactsResponse.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(searchContactsResponse.status),
      },
      searchContactsResponse,
    );
  }

  // throw error if more than one contact is found as it's ambiguous
  if (searchContactsResponse.response?.results?.length > 1) {
    throw new NetworkInstrumentationError(
      'Unable to get single Hubspot contact. More than one contacts found. Retry with unique lookupPropertyName and lookupValue',
    );
  } else if (searchContactsResponse.response?.results?.length === 1) {
    // a single and unique contact found
    contactId = searchContactsResponse.response?.results[0]?.id;
  } else {
    // contact not found
    contactId = null;
  }

  return contactId;
};

/**
 * get event name and properties mappings from config
 * and put in the final payload
 * @param {*} message
 * @param {*} destination
 * @param {*} payload
 * @returns
 */
const getEventAndPropertiesFromConfig = (message, destination, payload) => {
  const { hubspotEvents } = destination.Config;

  let event = get(message, 'event');
  if (!event) {
    throw new InstrumentationError('event name is required for track call');
  }
  if (!hubspotEvents) {
    throw new InstrumentationError('Event and property mappings are required for track call');
  }
  validateEventName(event);
  event = event.trim().toLowerCase();
  let eventName;
  let eventProperties;
  const properties = {};

  // 1. fetch event name from webapp config
  // some will traverse through all the indexes of the array and find the event
  const hubspotEventFound = hubspotEvents.some((hubspotEvent) => {
    if (
      hubspotEvent &&
      hubspotEvent.rsEventName &&
      hubspotEvent.rsEventName.trim().toLowerCase() === event &&
      !isEmpty(hubspotEvent.hubspotEventName)
    ) {
      eventName = hubspotEvent.hubspotEventName.trim();
      eventProperties = hubspotEvent.eventProperties;
      return true;
    }
    return false;
  });

  if (!hubspotEventFound) {
    throw new ConfigurationError(
      `Event name '${event}' mappings are not configured in the destination`,
    );
  }

  // 2. fetch event properties from webapp config
  eventProperties = getHashFromArray(eventProperties, ...Array(2), false);

  Object.keys(eventProperties).forEach((key) => {
    const value = get(message, `properties.${key}`);
    if (value) {
      properties[eventProperties[key]] = value;
    }
  });

  // eslint-disable-next-line no-param-reassign
  payload = { ...payload, eventName, properties };
  return payload;
};

/**
 * Validates object and identifier type is present in message
 * @param {*} firstMessage
 * @returns
 */
const getObjectAndIdentifierType = (firstMessage) => {
  const { objectType, identifierType } = getDestinationExternalIDInfoForRetl(
    firstMessage,
    DESTINATION,
  );
  if (!objectType || !identifierType) {
    throw new InstrumentationError('rETL - external Id not found.');
  }
  return { objectType, identifierType };
};

/**
 * Returns values for search api call
 * @param {*} inputs
 * @returns
 */
const extractIDsForSearchAPI = (inputs) => {
  const values = inputs.map((input) => {
    const { message } = input;
    const { destinationExternalId } = getDestinationExternalIDInfoForRetl(message, DESTINATION);
    return destinationExternalId.toString().toLowerCase();
  });

  return Array.from(new Set(values));
};

/**
 * Returns hubspot records
 * Ref : https://developers.hubspot.com/docs/api/crm/search
 * @param {*} data
 * @param {*} requestOptions
 * @param {*} objectType
 * @param {*} identifierType
 * @param {*} destination
 * @returns
 */
const performHubSpotSearch = async (
  reqdata,
  reqOptions,
  objectType,
  identifierType,
  destination,
  metadata,
) => {
  let checkAfter = 1;
  const searchResults = [];
  const requestData = reqdata;
  const { Config } = destination;

  const endpoint = IDENTIFY_CRM_SEARCH_ALL_OBJECTS.replace(':objectType', objectType);
  const endpointPath = `objects/:objectType/search`;

  const url =
    Config.authorizationType === 'newPrivateAppApi'
      ? endpoint
      : `${endpoint}?hapikey=${Config.apiKey}`;

  const requestOptions = Config.authorizationType === 'newPrivateAppApi' ? reqOptions : {};

  /* *
   * This is needed for processing paginated response when searching hubspot.
   * we can't avoid await in loop as response to the request contains the pagination details
   * */

  while (checkAfter) {
    const searchResponse = await httpPOST(url, requestData, requestOptions, {
      destType: 'hs',
      feature: 'transformation',
      endpointPath,
      requestMethod: 'POST',
      module: 'router',
      metadata,
    });

    const processedResponse = processAxiosResponse(searchResponse);

    if (processedResponse.status !== 200) {
      throw new NetworkError(
        `rETL - Error during searching object record. ${JSON.stringify(
          processedResponse.response?.message,
        )}`,
        processedResponse.status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(processedResponse.status),
        },
        processedResponse,
      );
    }

    const after = processedResponse.response?.paging?.next?.after || 0;
    requestData.after = after; // assigning to the new value of after
    checkAfter = after; // assigning to the new value if no after we assign it to 0 and no more calls will take place

    const results = processedResponse.response?.results;
    const extraProp = primaryToSecondaryFields[identifierType];
    if (results) {
      searchResults.push(
        ...results.map((result) => {
          const contact = {
            id: result.id,
            property: result.properties[identifierType],
          };
          // Following maps the extra property to the contact object which
          // help us to know if the contact was found using secondary property
          if (extraProp) {
            contact[extraProp] = result.properties?.[extraProp];
          }
          return contact;
        }),
      );
    }
  }
  /*
  searchResults = {
    id: 'existing_contact_id',
    property: 'existing_contact_email', // when email is identifier 
    hs_additional_emails: ['secondary_email'] // when email is identifier 
  } */
  return searchResults;
};

/**
 * Returns requestData
 * @param {*} identifierType
 * @param {*} chunk
 * @returns
 */
const getRequestData = (identifierType, chunk) => {
  const requestData = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: identifierType,
            values: chunk,
            operator: 'IN',
          },
        ],
      },
    ],
    properties: [identifierType],
    limit: SEARCH_LIMIT_VALUE,
    after: 0,
  };
  /* In case of email as identifier we add a filter for hs_additional_emails field
   * and append hs_additional_emails to properties list
   * We are doing this because there might be emails exisitng as hs_additional_emails for some conatct but
   * will not come up in search API until we search with hs_additional_emails as well.
   * Not doing this resulted in erro 409 Duplicate records found
   */
  const secondaryProp = primaryToSecondaryFields[identifierType];
  if (secondaryProp) {
    requestData.filterGroups.push({
      filters: [
        {
          propertyName: secondaryProp,
          values: chunk,
          operator: 'IN',
        },
      ],
    });
    requestData.properties.push(secondaryProp);
  }
  return requestData;
};

/**
 * DOC: https://developers.hubspot.com/docs/api/crm/search
 * @param {*} inputs
 * @param {*} destination
 */
const getExistingContactsData = async (inputs, destination, metadata) => {
  const { Config } = destination;
  const hsIdsToBeUpdated = [];
  const firstMessage = inputs[0].message;

  if (!firstMessage) {
    throw new InstrumentationError('rETL - objectType or identifier type not found.');
  }

  const { objectType, identifierType } = getObjectAndIdentifierType(firstMessage);

  const values = extractIDsForSearchAPI(inputs);
  const valuesChunk = lodash.chunk(values, MAX_CONTACTS_PER_REQUEST);
  const requestOptions = {
    headers: {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Bearer ${Config.accessToken}`,
    },
  };
  // eslint-disable-next-line no-restricted-syntax
  for (const chunk of valuesChunk) {
    const requestData = getRequestData(identifierType, chunk);
    const searchResults = await performHubSpotSearch(
      requestData,
      requestOptions,
      objectType,
      identifierType,
      destination,
      metadata,
    );
    if (searchResults.length > 0) {
      hsIdsToBeUpdated.push(...searchResults);
    }
  }
  return hsIdsToBeUpdated;
};
/**
 * This functions sets HsSearchId in the externalId array
 * @param {*} input -> Input message
 * @param {*} id -> Id to be added
 * @param {*} useSecondaryProp -> Let us know if that id was found using secondary property and not primnary
 * @returns
 */
const setHsSearchId = (input, id, useSecondaryProp = false) => {
  const { message } = input;
  const resultExternalId = [];
  const externalIdArray = message.context?.externalId;
  if (externalIdArray) {
    externalIdArray.forEach((extIdObj) => {
      const { type } = extIdObj;
      const extIdObjParam = extIdObj;
      if (type.includes(DESTINATION)) {
        extIdObjParam.hsSearchId = id;
      }
      if (useSecondaryProp) {
        // we are using it so that when final payload is made
        // then primary key shouldn't be overidden
        extIdObjParam.useSecondaryObject = useSecondaryProp;
      }
      resultExternalId.push(extIdObjParam);
    });
  }
  return resultExternalId;
};

/**
 *
 * To reduce the number of calls for searching of already existing objects
 * We do search for all the objects before router transform and assign the type (create/update)
 * accordingly to context.hubspotOperation
 *
 * For email as primary key we use `hs_additional_emails` as well property to search existing contacts
 * */

const splitEventsForCreateUpdate = async (inputs, destination, metadata) => {
  // get all the id and properties of already existing objects needed for update.
  const hsIdsToBeUpdated = await getExistingContactsData(inputs, destination, metadata);

  const resultInput = inputs.map((input) => {
    const { message } = input;
    const inputParam = input;
    const { destinationExternalId, identifierType } = getDestinationExternalIDInfoForRetl(
      message,
      DESTINATION,
    );

    const filteredInfo = hsIdsToBeUpdated.filter(
      (update) =>
        update.property.toString().toLowerCase() === destinationExternalId.toString().toLowerCase(), // second condition is for secondary property for identifier type
    );

    if (filteredInfo.length > 0) {
      inputParam.message.context.externalId = setHsSearchId(input, filteredInfo[0].id);
      inputParam.message.context.hubspotOperation = 'updateObject';
      return inputParam;
    }
    const secondaryProp = primaryToSecondaryFields[identifierType];
    if (secondaryProp) {
      /* second condition is for secondary property for identifier type
       For example:
       update[secondaryProp] = "abc@e.com;cd@e.com;k@w.com"
       destinationExternalId = "cd@e.com"
       So we are splitting all the emails in update[secondaryProp] into an array using ';'
       and then checking if array includes  destinationExternalId
       */
      const filteredInfoForSecondaryProp = hsIdsToBeUpdated.filter((update) =>
        update[secondaryProp]
          ?.toString()
          .toLowerCase()
          .split(';')
          .includes(destinationExternalId.toString().toLowerCase()),
      );
      if (filteredInfoForSecondaryProp.length > 0) {
        inputParam.message.context.externalId = setHsSearchId(
          input,
          filteredInfoForSecondaryProp[0].id,
          true,
        );
        inputParam.message.context.hubspotOperation = 'updateObject';
        return inputParam;
      }
    }
    // if not found in the existing contacts, then it's a new contact
    inputParam.message.context.hubspotOperation = 'createObject';
    return inputParam;
  });

  return resultInput;
};

const getHsSearchId = (message) => {
  const externalIdArray = message.context?.externalId;
  let hsSearchId = null;

  if (externalIdArray) {
    externalIdArray.forEach((extIdObj) => {
      const { type } = extIdObj;
      if (type.includes(DESTINATION)) {
        hsSearchId = extIdObj.hsSearchId;
      }
    });
  }
  return { hsSearchId };
};

/**
 * returns updated traits
 * @param {*} propertyMap
 * @param {*} traits
 * @param {*} destination
 */
const populateTraits = async (propertyMap, traits, destination, metadata) => {
  const populatedTraits = traits;
  let propertyToTypeMap = propertyMap;
  if (!propertyToTypeMap) {
    // fetch HS properties
    propertyToTypeMap = await getProperties(destination, metadata);
  }

  const keys = Object.keys(populatedTraits);
  keys.forEach((key) => {
    const value = populatedTraits[key];
    if (propertyToTypeMap[key] === 'date') {
      populatedTraits[key] = getUTCMidnightTimeStampValue(value);
    }
  });

  return populatedTraits;
};

const addExternalIdToHSTraits = (message) => {
  const externalIdObj = message.context?.externalId?.[0];
  if (externalIdObj.useSecondaryObject) {
    /* this condition help us to NOT override the primary key value with the secondary key value
     example: 
     for `email` as primary key and `hs_additonal_emails` as secondary key we don't want to override `email` with `hs_additional_emails`.
    neither we want to map anything for `hs_additional_emails` as this property can not be set 
     */
    return;
  }
  set(getFieldValueFromMessage(message, 'traits'), externalIdObj.identifierType, externalIdObj.id);
};

const convertToResponseFormat = (successRespListWithDontBatchTrue) => {
  const response = [];
  if (Array.isArray(successRespListWithDontBatchTrue)) {
    successRespListWithDontBatchTrue.forEach((event) => {
      const { message, metadata, destination } = event;
      const endpoint = get(message, 'endpoint');

      const batchedResponse = defaultBatchRequestConfig();
      batchedResponse.batchedRequest.headers = message.headers;
      batchedResponse.batchedRequest.endpoint = endpoint;
      batchedResponse.batchedRequest.body = message.body;
      batchedResponse.batchedRequest.params = message.params;
      batchedResponse.batchedRequest.method = defaultPostRequestConfig.requestMethod;
      batchedResponse.metadata = [metadata];
      batchedResponse.destination = destination;

      response.push(
        getSuccessRespEvents(
          batchedResponse.batchedRequest,
          batchedResponse.metadata,
          batchedResponse.destination,
        ),
      );
    });
  }
  return response;
};

const isIterable = (obj) => {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
};

module.exports = {
  validateDestinationConfig,
  addExternalIdToHSTraits,
  formatKey,
  fetchFinalSetOfTraits,
  getProperties,
  getTransformedJSON,
  formatPropertyValueForIdentify,
  getEmailAndUpdatedProps,
  getEventAndPropertiesFromConfig,
  searchContacts,
  splitEventsForCreateUpdate,
  getHsSearchId,
  validatePayloadDataTypes,
  getUTCMidnightTimeStampValue,
  populateTraits,
  getObjectAndIdentifierType,
  extractIDsForSearchAPI,
  getRequestData,
  convertToResponseFormat,
  isIterable,
};
