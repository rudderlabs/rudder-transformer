const { send, httpGET } = require("../../../adapters/network");
const {
  getFieldValueFromMessage,
  constructPayload,
  CustomError
} = require("../../util");
const {
  CONTACT_PROPERTIES,
  LEAD_STATUS,
  LIFECYCLE_STAGE
} = require("./config");

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
  const { apiKey } = destination.Config;
  const url = `${CONTACT_PROPERTIES}?hapikey=${apiKey}`;

  const res = await httpGET(url);

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
        } else {
          switch (hsSupportedKey) {
            case "hs_lead_status":
              propValue = propValue
                .toString()
                .replace(/\s+/g, "_")
                .toUpperCase();
              if (!LEAD_STATUS.includes(propValue)) {
                throw new CustomError(
                  `Invalid value. 'hs_lead_status' valid values are [${LEAD_STATUS}]`,
                  400
                );
              }
              break;
            case "lifecyclestage":
              propValue = propValue
                .toString()
                .replace(/ /g, "")
                .toLowerCase();
              if (!LIFECYCLE_STAGE.includes(propValue)) {
                throw new CustomError(
                  `Invalid value. 'hs_lead_status' valid values are [${LIFECYCLE_STAGE}]`,
                  400
                );
              }
              break;
            default:
              break;
          }
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

module.exports = {
  formatKey,
  getTraits,
  getProperties,
  getTransformedJSON,
  formatPropertyValueForIdentify,
  getAllContactProperties,
  getEmailAndUpdatedProps
};
