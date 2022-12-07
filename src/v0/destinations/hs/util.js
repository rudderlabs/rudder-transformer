const get = require("get-value");
const { httpGET, httpPOST } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const {
  getFieldValueFromMessage,
  constructPayload,
  CustomError,
  isEmpty,
  getHashFromArray,
  getDestinationExternalIDInfoForRetl,
  getValueFromMessage
} = require("../../util");
const {
  CONTACT_PROPERTY_MAP_ENDPOINT,
  IDENTIFY_CRM_SEARCH_CONTACT,
  IDENTIFY_CRM_SEARCH_ALL_OBJECTS,
  SEARCH_LIMIT_VALUE,
  hsCommonConfigJson,
  DESTINATION
} = require("./config");

/**
 * validate destination config and check for existence of data
 * @param {*} param0
 */
const validateDestinationConfig = ({ Config }) => {
  if (Config.authorizationType === "newPrivateAppApi") {
    // NEW API
    if (!Config.accessToken) {
      throw new CustomError("[HS]:: Access Token not found. Aborting", 400);
    }
  } else {
    // Legacy API
    if (!Config.hubID) {
      throw new CustomError("[HS]:: Hub ID not found. Aborting", 400);
    }
    if (!Config.apiKey) {
      throw new CustomError("[HS]:: API Key not found. Aborting", 400);
    }
  }
};

/**
 * modify the key inorder to suite with HS constraints
 * @param {*} key
 * @returns
 */
const formatKey = key => {
  // lowercase and replace spaces and . with _
  let modifiedKey = key.toLowerCase();
  modifiedKey = modifiedKey.replace(/\s+/g, "_");
  modifiedKey = modifiedKey.replace(/\./g, "_");
  return modifiedKey;
};

/**
 * get traits from traits or properties
 * @param {*} message
 * @returns
 */
const fetchFinalSetOfTraits = message => {
  // get from traits or properties
  let traits = getFieldValueFromMessage(message, "traits");
  if (!traits || !Object.keys(traits).length) {
    traits = message.properties;
  }
  return traits;
};

/**
 * get all the hubspot properties
 * @param {*} destination
 * @returns
 */
const getProperties = async destination => {
  let hubspotPropertyMap = {};
  let hubspotPropertyMapResponse;
  const { Config } = destination;

  // select API authorization type
  if (Config.authorizationType === "newPrivateAppApi") {
    // Private Apps
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Config.accessToken}`
      }
    };
    hubspotPropertyMapResponse = await httpGET(
      CONTACT_PROPERTY_MAP_ENDPOINT,
      requestOptions
    );
    hubspotPropertyMapResponse = processAxiosResponse(
      hubspotPropertyMapResponse
    );
  } else {
    // API Key (hapikey)
    const url = `${CONTACT_PROPERTY_MAP_ENDPOINT}?hapikey=${Config.apiKey}`;
    hubspotPropertyMapResponse = await httpGET(url);
    hubspotPropertyMapResponse = processAxiosResponse(
      hubspotPropertyMapResponse
    );
  }

  if (hubspotPropertyMapResponse.status !== 200) {
    throw new CustomError(
      `Failed to get hubspot properties: ${JSON.stringify(
        hubspotPropertyMapResponse.response
      )}`,
      hubspotPropertyMapResponse.status
    );
  }

  const propertyMap = {};
  hubspotPropertyMapResponse.response.forEach(element => {
    propertyMap[element.name] = element.type;
  });
  hubspotPropertyMap = propertyMap;
  return hubspotPropertyMap;
};

/**
 * add addtional properties in the payload that is provided in traits
 * only when it matches with HS properties (pre-defined/created from dashboard)
 * @param {*} message
 * @param {*} destination
 * @param {*} propertyMap
 * @returns
 */
const getTransformedJSON = async (message, destination, propertyMap) => {
  let rawPayload = {};
  const traits = fetchFinalSetOfTraits(message);

  if (traits) {
    const traitsKeys = Object.keys(traits);
    if (!propertyMap) {
      // fetch HS properties
      // eslint-disable-next-line no-param-reassign
      propertyMap = await getProperties(destination);
    }

    rawPayload = constructPayload(message, hsCommonConfigJson);

    // if there is any extra/custom property in hubspot, that has not already
    // been mapped but exists in the traits, we will include those values to the final payload
    traitsKeys.forEach(traitsKey => {
      // lowercase and replace ' ' & '.' with '_'
      const hsSupportedKey = formatKey(traitsKey);
      if (!rawPayload[traitsKey] && propertyMap[hsSupportedKey]) {
        let propValue = traits[traitsKey];
        if (propertyMap[hsSupportedKey] === "date") {
          const time = propValue;
          const date = new Date(time);
          date.setUTCHours(0, 0, 0, 0);
          propValue = date.getTime();
        }
        rawPayload[hsSupportedKey] = propValue;
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
const formatPropertyValueForIdentify = propMap => {
  return Object.keys(propMap).map(key => {
    return { property: key, value: propMap[key] };
  });
};

/**
 * for batching -
 * extract email and remove it from the final payload
 * @param {*} properties
 * @returns
 */
const getEmailAndUpdatedProps = properties => {
  const index = properties.findIndex(prop => prop.property === "email");
  return {
    email: properties[index].value,
    updatedProperties: properties.filter((prop, i) => i !== index)
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
  const SOURCE_KEYS = ["traits", "context.traits", "properties"];
  let value = getValueFromMessage(message, `${lookupField}`);
  if (!value) {
    // Check in free-flowing object level
    SOURCE_KEYS.some(sourceKey => {
      value = getMappingFieldValueFormMessage(message, sourceKey, lookupField);
      if (value) {
        return true;
      }
      return false;
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
const searchContacts = async (message, destination) => {
  const { Config } = destination;
  let searchContactsResponse;
  let contactId;
  if (!getFieldValueFromMessage(message, "traits") && !message.properties) {
    throw new CustomError(
      "[HS]:: Identify - Invalid traits value for lookup field",
      400
    );
  }
  const lookupFieldInfo =
    getLookupFieldValue(message, Config.lookupField) ||
    getLookupFieldValue(message, "email");
  if (!lookupFieldInfo?.value) {
    throw new CustomError(
      "[HS] Identify:: email i.e a default lookup field for contact lookup not found in traits",
      400
    );
  }

  const requestData = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: lookupFieldInfo.fieldName,
            value: lookupFieldInfo.value,
            operator: "EQ"
          }
        ]
      }
    ],
    sorts: ["ascending"],
    properties: [lookupFieldInfo.fieldName],
    limit: 2,
    after: 0
  };

  if (Config.authorizationType === "newPrivateAppApi") {
    // Private Apps
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Config.accessToken}`
      }
    };
    searchContactsResponse = await httpPOST(
      IDENTIFY_CRM_SEARCH_CONTACT,
      requestData,
      requestOptions
    );
    searchContactsResponse = processAxiosResponse(searchContactsResponse);
  } else {
    // API Key
    const url = `${IDENTIFY_CRM_SEARCH_CONTACT}?hapikey=${Config.apiKey}`;
    searchContactsResponse = await httpPOST(url, requestData);
    searchContactsResponse = processAxiosResponse(searchContactsResponse);
  }

  if (searchContactsResponse.status !== 200) {
    throw new CustomError(
      `Failed to get hubspot contacts: ${JSON.stringify(
        searchContactsResponse.response
      )}`,
      searchContactsResponse.status
    );
  }

  // throw error if more than one contact is found as it's ambiguous
  if (searchContactsResponse.response?.results?.length > 1) {
    throw new CustomError(
      "Unable to get single Hubspot contact. More than one contacts found. Retry with unique lookupPropertyName and lookupValue",
      400
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

  let event = get(message, "event");
  if (!event) {
    throw new CustomError("event name is required for track call", 400);
  }
  event = event.trim().toLowerCase();
  let eventName;
  let eventProperties;
  const properties = {};

  // 1. fetch event name from webapp config
  // some will traverse through all the indexes of the array and find the event
  const hubspotEventFound = hubspotEvents.some(hubspotEvent => {
    if (
      hubspotEvent &&
      hubspotEvent.rsEventName &&
      hubspotEvent.rsEventName.trim().toLowerCase() === event
    ) {
      if (!isEmpty(hubspotEvent.hubspotEventName)) {
        eventName = hubspotEvent.hubspotEventName.trim();
        eventProperties = hubspotEvent.eventProperties;
        return true;
      }
    }
    return false;
  });

  if (!hubspotEventFound) {
    throw new CustomError(`[HS]:: '${event}' event name not found`, 400);
  }

  // 2. fetch event properties from webapp config
  eventProperties = getHashFromArray(eventProperties, ...Array(2), false);

  Object.keys(eventProperties).forEach(key => {
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
 * DOC: https://developers.hubspot.com/docs/api/crm/search
 * @param {*} inputs
 * @param {*} destination
 */
const getExistingData = async (inputs, destination) => {
  const { Config } = destination;
  const values = [];
  let searchResponse;
  let updateHubspotIds = [];
  const firstMessage = inputs[0].message;
  let objectType = null;
  let identifierType = null;

  if (firstMessage) {
    objectType = getDestinationExternalIDInfoForRetl(firstMessage, DESTINATION)
      .objectType;
    identifierType = getDestinationExternalIDInfoForRetl(
      firstMessage,
      DESTINATION
    ).identifierType;
    if (!objectType || !identifierType) {
      throw new CustomError("[HS]:: rETL - external Id not found.", 400);
    }
  } else {
    throw new CustomError(
      "[HS]:: rETL - objectType or identifier type not found. ",
      400
    );
  }
  inputs.map(async input => {
    const { message } = input;
    const { destinationExternalId } = getDestinationExternalIDInfoForRetl(
      message,
      DESTINATION
    );
    values.push(destinationExternalId);
  });
  const requestData = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: identifierType,
            values,
            operator: "IN"
          }
        ]
      }
    ],
    properties: [identifierType],
    limit: SEARCH_LIMIT_VALUE,
    after: 0
  };

  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Config.accessToken}`
    }
  };
  let checkAfter = 1; // variable to keep checking if we have more results

  /* eslint-disable no-await-in-loop */

  /* *
   * This is needed for processing paginated response when searching hubspot.
   * we can't avoid await in loop as response to the request contains the pagination details
   * */

  while (checkAfter) {
    const endpoint = IDENTIFY_CRM_SEARCH_ALL_OBJECTS.replace(
      ":objectType",
      objectType
    );

    const url =
      Config.authorizationType === "newPrivateAppApi"
        ? endpoint
        : `${endpoint}?hapikey=${Config.apiKey}`;
    searchResponse =
      Config.authorizationType === "newPrivateAppApi"
        ? await httpPOST(url, requestData, requestOptions)
        : await httpPOST(url, requestData);
    searchResponse = processAxiosResponse(searchResponse);

    if (searchResponse.status !== 200) {
      throw new CustomError(
        `[HS]:: rETL - Error during searching object record. ${searchResponse.response?.message}`,
        searchResponse.status || 400
      );
    }

    const after = searchResponse.response?.paging?.next?.after || 0;

    requestData.after = after; // assigning to the new value of after
    checkAfter = after; // assigning to the new value if no after we assign it to 0 and no more calls will take place

    const results = searchResponse.response?.results;
    if (results) {
      updateHubspotIds = results.map(result => {
        const propertyValue = result.properties[identifierType];
        return { id: result.id, property: propertyValue };
      });
    }
  }
  return updateHubspotIds;
};

const setHsSearchId = (input, id) => {
  const { message } = input;
  const resultExternalId = [];
  const externalIdArray = message.context?.externalId;
  if (externalIdArray) {
    externalIdArray.forEach(extIdObj => {
      const { type } = extIdObj;
      const extIdObjParam = extIdObj;
      if (type.includes(DESTINATION)) {
        extIdObjParam.hsSearchId = id;
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
 * */

const splitEventsForCreateUpdate = async (inputs, destination) => {
  // get all the id and properties of already existing objects needed for update.
  const updateHubspotIds = await getExistingData(inputs, destination);

  const resultInput = inputs.map(input => {
    const { message } = input;
    const inputParam = input;
    const { destinationExternalId } = getDestinationExternalIDInfoForRetl(
      message,
      DESTINATION
    );

    const filteredInfo = updateHubspotIds.filter(
      update => update.property.toString() === destinationExternalId.toString()
    );

    if (filteredInfo.length) {
      inputParam.message.context.externalId = setHsSearchId(
        input,
        filteredInfo[0].id
      );
      inputParam.message.context.hubspotOperation = "updateObject";
      return inputParam;
    }
    inputParam.message.context.hubspotOperation = "createObject";
    return inputParam;
  });

  return resultInput;
};

const getHsSearchId = message => {
  const externalIdArray = message.context?.externalId;
  let hsSearchId = null;

  if (externalIdArray) {
    externalIdArray.forEach(extIdObj => {
      const { type } = extIdObj;
      if (type.includes(DESTINATION)) {
        hsSearchId = extIdObj.hsSearchId;
      }
    });
  }
  return { hsSearchId };
};

module.exports = {
  validateDestinationConfig,
  formatKey,
  fetchFinalSetOfTraits,
  getProperties,
  getTransformedJSON,
  formatPropertyValueForIdentify,
  getEmailAndUpdatedProps,
  getEventAndPropertiesFromConfig,
  searchContacts,
  splitEventsForCreateUpdate,
  getHsSearchId
};
