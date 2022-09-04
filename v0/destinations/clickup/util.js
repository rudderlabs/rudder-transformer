const { httpGET } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { isEmpty, getHashFromArray, CustomError } = require("../../util");
const { getCustomFieldsEndPoint } = require("./config");

/**
 * Validates priority
 * @param {*} priority
 */
const validatePriority = priority => {
  if (
    (priority &&
      !(Number.isInteger(priority) && priority >= 1 && priority <= 4)) ||
    priority === 0
  ) {
    throw new CustomError(
      "Invalid Priority. Value must be Integer and in range [1,4]",
      400
    );
  }
};

/**
 * Validates phone with country code
 * @param {*} phone
 */
const validatePhoneWithCountryCode = phone => {
  const regex = /^\+(?:[{0-9] ?){6,14}[0-9]$/;
  if (!regex.test(phone)) {
    throw new CustomError("Invalid Phone Number", 400);
  }
};

/**
 * Validates email
 * @param {*} email
 */
const validateEmail = email => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regex.test(email)) {
    throw new CustomError("Invalid Email", 400);
  }
};

/**
 * Validates url
 * @param {*} url
 */
const validateUrl = url => {
  const regex = /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  if (!regex.test(url)) {
    throw new CustomError("Invalid URL", 400);
  }
};

/**
 * Validates location latitude/longitude
 * @param {*} location
 */
const validateLocation = location => {
  const lat = location?.lat;
  const lng = location?.lng;
  if (lat && !(lat >= -90 && lat <= 90)) {
    throw new CustomError(
      "Invalid Latitude. Latitude must be in range [-90, 90]",
      400
    );
  }
  if (lng && !(lng >= -180 && lng <= 180)) {
    throw new CustomError(
      "Invalid Longitude. Longitude must be in range [-180, 180]",
      400
    );
  }
};

/**
 * Validates custom field as per clickup api doc
 * ref: https://clickup.com/api
 * @param {*} customField
 * @param {*} value
 */
const validateCustomField = (customField, value) => {
  switch (customField?.type) {
    case "location":
      validateLocation(value);
      break;
    case "phone":
      validatePhoneWithCountryCode(value);
      break;
    case "email":
      validateEmail(value);
      break;
    case "url":
      validateUrl(value);
      break;
    default:
      break;
  }
};

/**
 * Function to get the dropdown option uuid
 * ref: https://clickup.com/api
 * @param {*} customField {"name":"My Drop Down Field","type":"drop_down","type_config":{"default":0,"placeholder":"Select a value","options":[{"id":"UUID1","name":"Option 1","color":"#FFFFF"},{"id":"UUID2","name":"Option 2","color":"#000000"}]}}
 * @param {*} value
 * @returns
 */
const getDropDown = (customField, value) => {
  const options = customField?.type_config?.options;
  const dropDownOption = options.find(
    option => option?.name.toLowerCase() === value.toLowerCase()
  );
  return dropDownOption?.id;
};

/**
 * Function to get the labels uuid
 * ref: https://clickup.com/api
 * @param {*} customField {"name":"My Label Field","type":"labels","type_config":{"options":[{"id":"UUID1","label":"Label 1","color":"#123456"},{"id":"UUID2","label":"Label 2","color":"#FFFFFF"}]}}
 * @param {*} value
 * @returns
 */
const getLabels = (customField, value) => {
  const options = customField?.type_config?.options;
  const labelIds = [];
  value.forEach(label => {
    const labelOption = options.find(
      option => option?.label.toLowerCase() === label.toLowerCase()
    );
    if (labelOption?.id) {
      labelIds.push(labelOption?.id);
    }
  });
  return labelIds;
};

/**
 * Format the location
 * ref: https://clickup.com/api
 * @param {*} value {"lat":-28.016667,"lng":153.4,"formattedAddress":"Gold Coast QLD, Australia"}
 * @returns // {"location":{"lat":-28.016667,"lng":153.4},"formatted_address":"Gold Coast QLD, Australia"}
 */
const getLocation = value => {
  let location;
  if (value.lat && value.lng && value.formattedAddress) {
    location = {
      location: { lat: value.lat, lng: value.lng },
      formatted_address: value.formattedAddress
    };
  }
  return location;
};

/**
 * Format the available clickup custom field arrays to hashMap
 * where key is custom field name and value is custom field
 * @param {*} arrays [{"id":"a0b8efe1-c828-4c63-8850-0d0742888f9d","name":"Email","type":"email","type_config":{},"date_created":"1662225840284","hide_from_guests":false,"required":false}]
 * @param {*} fromKey
 * @param {*} isLowerCase
 * @returns // {"Email":{"id":"a0b8efe1-c828-4c63-8850-0d0742888f9d","name":"Email","type":"email","type_config":{},"date_created":"1662225840284","hide_from_guests":false,"required":false}}
 */
const getHashFromArrayWithValueAsObject = (
  arrays,
  fromKey = "from",
  isLowerCase = true
) => {
  const hashMap = {};
  if (Array.isArray(arrays)) {
    arrays.forEach(array => {
      if (isEmpty(array[fromKey])) return;
      hashMap[
        isLowerCase ? array[fromKey].toLowerCase() : array[fromKey]
      ] = array;
    });
  }
  return hashMap;
};

/**
 * Function to get the the externalId array with the given type
 * @param {*} message {"context":{"externalId":[{"type":"clickUpAssigneeId","id":61205104},{"type":"clickUpAssigneeId","id":61217234},{"type":"clickUpAssigneeId","id":61228575}]}}
 * @param {*} type clickUpAssigneeId
 * @returns [61205104, 61217234, 61228575]
 */
const getDestinationExternalIDArray = (message, type) => {
  let externalIdArray = null;
  const destinationExternalId = [];
  if (message.context && message.context.externalId) {
    externalIdArray = message.context.externalId;
  }
  if (externalIdArray) {
    externalIdArray.forEach(extIdObj => {
      if (extIdObj.type === type) {
        destinationExternalId.push(extIdObj.id);
      }
    });
  }
  return destinationExternalId;
};

/**
 * Retrieve configured clickup custom fields for the  given list
 * https://api.clickup.com/api/v2/list/listId/field
 * ref: https://clickup.com/api
 * @param {*} listId
 * @param {*} apiToken
 * @returns
 */
const retrieveCustomFields = async (listId, apiToken) => {
  const endpoint = getCustomFieldsEndPoint(listId);
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: apiToken
    }
  };
  const customFieldsResponse = await httpGET(endpoint, requestOptions);
  const processedCustomFieldsResponse = processAxiosResponse(
    customFieldsResponse
  );

  if (processedCustomFieldsResponse.status !== 200) {
    throw new CustomError(
      `[ClickUp]:: Unable to retrieve available custom fields due to ${JSON.stringify(
        processedCustomFieldsResponse.response
      )}`,
      processedCustomFieldsResponse.status
    );
  }

  return processedCustomFieldsResponse.response?.fields;
};

/**
 * Function to get the custom field value. As clickup is accepting uuid for dropdown/labels, and location in specific format
 * @param {*} customField
 * @param {*} value
 * @returns
 */
const findCustomFieldValue = (customField, value) => {
  switch (customField?.type) {
    case "drop_down":
      return getDropDown(customField, value);
    case "labels":
      return getLabels(customField, value);
    case "location":
      return getLocation(value);
    default:
      return value;
  }
};

/**
 * Function to to build the custom field.
 * returns the array of custom field with each object contains id,value
 * @param {*} keyToCustomFieldName [{"from":"url","to":"Url"}]
 * @param {*} properties {"url":"https://www.rudderstack.com/"}
 * @param {*} listId
 * @param {*} apiToken
 * @returns [{"id":"b0f40a94-ea2a-4998-a514-8074d0eddcde","value":"https://www.rudderstack.com/"}]
 */
const customFieldsBuilder = async (
  keyToCustomFieldName,
  properties,
  listId,
  apiToken
) => {
  const responseArray = [];
  // retrieve available clickup custom field for the given list
  const availableCustomFields = await retrieveCustomFields(listId, apiToken);
  // convert array to hashMap with key as field name and value as custom field object
  const availableCustomFieldsMap = getHashFromArrayWithValueAsObject(
    availableCustomFields,
    "name",
    false
  );

  // convert destination.Config.keyToCustomFieldName to hashMap
  const configCustomFieldsMap = getHashFromArray(
    keyToCustomFieldName,
    "from",
    "to",
    false
  );

  Object.keys(configCustomFieldsMap).forEach(propertiesKey => {
    let fieldValue = properties[propertiesKey];
    if (fieldValue) {
      const fieldName = configCustomFieldsMap[propertiesKey];
      const customField = availableCustomFieldsMap[fieldName];
      validateCustomField(customField, fieldValue);
      fieldValue = findCustomFieldValue(customField, fieldValue);
      if (fieldValue && customField) {
        responseArray.push({
          id: customField.id,
          value: fieldValue
        });
      }
    }
  });

  return responseArray;
};

/**
 * Function to discard any event that is not a part of destination.Config.whiteListedEvents
 * @param {*} message
 * @param {*} destination
 */
const eventFiltering = (message, destination) => {
  const { whiteListedEvents } = destination.Config;
  const { event } = message;
  if (whiteListedEvents) {
    const allowEvent = whiteListedEvents.some(
      whiteListedEvent =>
        whiteListedEvent.eventName.toLowerCase() === event.toLowerCase()
    );
    if (!allowEvent) {
      throw new CustomError(
        "Event Discarded. To allow this event, add this in Allowlist",
        400
      );
    }
  }
};

module.exports = {
  validatePriority,
  customFieldsBuilder,
  getDestinationExternalIDArray,
  eventFiltering
};
