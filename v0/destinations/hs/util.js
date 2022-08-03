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
  getHashFromArray
} = require("../../util");
const {
  CONTACT_PROPERTY_MAP_ENDPOINT,
  IDENTIFY_CRM_SEARCH_CONTACT,
  hsCommonConfigJson,
  API_VERSION
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
 * look for the contact in hubspot and extract its contactId for updation
 * Ref - https://developers.hubspot.com/docs/api/crm/contacts#endpoint?spec=GET-/crm/v3/objects/contacts
 * @param {*} destination
 * @returns
 */
const searchContacts = async (message, destination) => {
  const { Config } = destination;
  let searchContactsResponse;
  let contactId;
  const traits = getFieldValueFromMessage(message, "traits");
  let propertyName;

  if (!traits) {
    throw new CustomError(
      "[HS]:: Identify - Invalid traits value for lookup field",
      400
    );
  }

  // lookupField key provided in Config.lookupField not found in traits
  // then default it to email
  if (!traits[`${Config.lookupField}`]) {
    propertyName = "email";

    if (!traits.email) {
      throw new CustomError(
        "[HS] Identify:: email i.e a deafult lookup field for contact lookup not found in traits",
        400
      );
    }
  } else {
    // look for propertyName (key name) in traits
    // Config.lookupField -> lookupField
    // traits: { lookupField: email }
    propertyName = traits[`${Config.lookupField}`];
  }

  // extract its value from the known propertyName (key name)
  // if not found in our structure then look for it in traits
  // Config.lookupField -> lookupField
  // eg: traits: { lookupField: email, email: "test@test.com" }
  const value =
    getFieldValueFromMessage(message, propertyName) ||
    traits[`${propertyName}`];

  if (!value) {
    throw new CustomError(
      `[HS] Identify:: '${propertyName}' lookup field for contact lookup not found in traits`,
      400
    );
  }

  const requestData = {
    filterGroups: [
      {
        filters: [
          {
            propertyName,
            value,
            operator: "EQ"
          }
        ]
      }
    ],
    sorts: ["ascending"],
    properties: [propertyName],
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
  eventProperties = getHashFromArray(eventProperties);

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

module.exports = {
  validateDestinationConfig,
  formatKey,
  fetchFinalSetOfTraits,
  getProperties,
  getTransformedJSON,
  formatPropertyValueForIdentify,
  getEmailAndUpdatedProps,
  getEventAndPropertiesFromConfig,
  searchContacts
};
