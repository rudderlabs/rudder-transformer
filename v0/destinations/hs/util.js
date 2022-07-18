const { send, httpGET, httpPOST } = require("../../../adapters/network");
const {
  getFieldValueFromMessage,
  constructPayload,
  CustomError
} = require("../../util");
const { CONTACT_PROPERTIES, IDENTIFY_CRM_SEARCH_CONTACT } = require("./config");

const formatKey = key => {
  // lowercase and replace spaces and . with _
  let modifiedKey = key.toLowerCase();
  modifiedKey = modifiedKey.replace(/\s+/g, "_");
  modifiedKey = modifiedKey.replace(/\./g, "_");
  return modifiedKey;
};

const getTraits = message => {
  // get from traits or properties
  let traits = getFieldValueFromMessage(message, "traits");
  if (!traits || !Object.keys(traits).length) {
    traits = message.properties;
  }
  return traits;
};

const getProperties = async destination => {
  let hubSpotPropertyMap = {};
  let res;
  const { Config } = destination;

  // choosing API Type
  if (Config.authorizationType === "newPrivateAppApi") {
    // Private Apps
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Config.accessToken}`
      }
    };
    res = await httpGET(CONTACT_PROPERTIES, requestOptions);
  } else {
    // API Key
    const url = `${CONTACT_PROPERTIES}?hapikey=${Config.apiKey}`;
    res = await httpGET(url);
  }

  if (res.success === false) {
    // check if exists err.response && err.response.status else 500
    const error = res.response;
    if (error.response) {
      throw new CustomError(
        JSON.stringify(error.response.data) ||
          JSON.stringify(error.response.statusText) ||
          "Failed to get hubspot properties",
        error.response.status || 500
      );
    }
    throw new CustomError(
      "Failed to get hubspot properties : invalid response",
      500
    );
  }

  const propertyMap = {};
  res.response.data.forEach(element => {
    propertyMap[element.name] = element.type;
  });
  hubSpotPropertyMap = propertyMap;
  return hubSpotPropertyMap;
};

const getTransformedJSON = async (
  message,
  mappingJson,
  destination,
  propertyMap
) => {
  let rawPayload = {};
  const traits = getTraits(message);

  if (traits) {
    const traitsKeys = Object.keys(traits);
    if (!propertyMap) {
      // fetch HS properties
      // eslint-disable-next-line no-param-reassign
      propertyMap = await getProperties(destination);
    }

    rawPayload = constructPayload(message, mappingJson);

    // if provided data in traits matches with the
    // property created in HS then add those in final payload
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

const formatPropertyValueForIdentify = propMap => {
  return Object.keys(propMap).map(key => {
    return { property: key, value: propMap[key] };
  });
};

const getAllContactProperties = async endpoint => {
  const requestOptions = {
    url: endpoint,
    method: "get"
  };
  const res = await send(requestOptions);
  return res;
};

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
 * @param {*} destination
 * @returns
 */
const searchContacts = async (message, destination, lookupField = null) => {
  const { Config } = destination;
  let res;
  let contactId = null;
  const traits = getFieldValueFromMessage(message, "traits");
  let propertyName;

  if (lookupField) {
    propertyName = lookupField;
  } else {
    propertyName = traits[`${Config.lookupField}`];
  }

  const value = traits[`${propertyName}`];

  if (!value) {
    throw new CustomError(
      `[HS] Identify:: '${propertyName}' key name i.e provided in config is required under traits for contact lookup`,
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
    res = await httpPOST(
      IDENTIFY_CRM_SEARCH_CONTACT,
      requestData,
      requestOptions
    );
  } else {
    // API Key
    const url = `${IDENTIFY_CRM_SEARCH_CONTACT}?hapikey=${Config.apiKey}`;
    res = await httpPOST(url, requestData);
  }

  if (res.success === false) {
    // check if exists err.response && err.response.status else 500
    const error = res.response;
    if (error.response) {
      throw new CustomError(
        JSON.stringify(error.response.data) ||
          JSON.stringify(error.response.statusText) ||
          "Failed to get hubspot contacts",
        error.response.status || 500
      );
    }
    throw new CustomError(
      "Failed to get hubspot contacts : invalid response",
      500
    );
  }

  if (res.response.data.results.length > 1) {
    throw new CustomError(
      "Unable to get single Hubspot contact. More than one contacts found. Retry with unique lookupPropertyName and lookupValue",
      400
    );
  } else if (res.response.data.results.length === 1) {
    // while updating contactId is a required
    contactId = res.response.data.results[0].id;
  }

  // contact not found
  return contactId;
};

const getCRMUpdatedProps = properties => {
  const updatedProps = {};
  properties.forEach(key => {
    const { property, value } = key;
    updatedProps[property] = value;
  });
  return updatedProps;
};

module.exports = {
  formatKey,
  getTraits,
  getProperties,
  getTransformedJSON,
  formatPropertyValueForIdentify,
  getAllContactProperties,
  getEmailAndUpdatedProps,
  getCRMUpdatedProps,
  searchContacts
};
