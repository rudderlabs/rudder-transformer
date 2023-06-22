const { httpGET } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const {
  getHashFromArray,
  getHashFromArrayWithValueAsObject,
  formatTimeStamp,
} = require('../../util');
const { getCustomFieldsEndPoint } = require('./config');
const { NetworkError, InstrumentationError } = require('../../util/errorTypes');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');

/**
 * Validates priority
 * @param {*} priority
 */
const validatePriority = (priority) => {
  if (
    (priority && !(Number.isInteger(priority) && priority >= 1 && priority <= 4)) ||
    priority === 0
  ) {
    throw new InstrumentationError(
      `Invalid value specified for priority. Value must be Integer and in range "[1,4]"`,
    );
  }
};

/**
 * Validates phone with country code
 * @param {*} phone
 */
const validatePhoneWithCountryCode = (phone) => {
  const regex = /^\+(?:[\d{] ?){6,14}\d$/;
  if (!regex.test(phone)) {
    throw new InstrumentationError('The provided phone number is invalid');
  }
};

/**
 * Validates email
 * @param {*} email
 */
const validateEmail = (email) => {
  const regex =
    /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/;
  if (!regex.test(email)) {
    throw new InstrumentationError('The provided email is invalid');
  }
};

/**
 * Validates url
 * @param {*} url
 */
const validateUrl = (url) => {
  const regex = /^(https?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w!#$&'()*+,/:;=?@[\]~-]+$/;
  if (!regex.test(url)) {
    throw new InstrumentationError('The provided url is invalid');
  }
};

/**
 * Validates location latitude/longitude
 * @param {*} location
 */
const validateLocation = (location) => {
  const lat = location?.lat;
  const lng = location?.lng;
  if (lat && !(lat >= -90 && lat <= 90)) {
    throw new InstrumentationError(
      `Invalid value specified for latitude. Latitude must be in range "[-90, 90]"`,
    );
  }
  if (lng && !(lng >= -180 && lng <= 180)) {
    throw new InstrumentationError(
      `Invalid value specified for longitude. Longitude must be in range "[-180, 180]"`,
    );
  }
};

/**
 * Validates Rating
 * @param {*} customField
 * @param {*} rating
 */
const validateRating = (customField, rating) => {
  const count = customField?.type_config?.count;
  if (rating && !(rating >= 0 && rating <= count)) {
    throw new InstrumentationError(
      `Invalid value specified for rating. Value must be in range "[0,${count}]"`,
    );
  }
};

/**
 * Validates custom field as per clickup api doc
 * ref: https://clickup.com/api
 * @param {*} customField
 * @param {*} value
 */
const validateUserSentCustomFieldValues = (customField, value) => {
  switch (customField?.type) {
    case 'location':
      validateLocation(value);
      break;
    case 'phone':
      validatePhoneWithCountryCode(value);
      break;
    case 'email':
      validateEmail(value);
      break;
    case 'url':
      validateUrl(value);
      break;
    case 'emoji':
      validateRating(customField, value);
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
    (option) => option?.name.toLowerCase() === value.toLowerCase(),
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
  value.forEach((label) => {
    const labelOption = options.find(
      (option) => option?.label.toLowerCase() === label.toLowerCase(),
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
const getLocation = (value) => {
  let location;
  if (value.lat && value.lng && value.formattedAddress) {
    location = {
      location: { lat: value.lat, lng: value.lng },
      formatted_address: value.formattedAddress,
    };
  }
  return location;
};

/**
 * Function to get the the externalId array with the given type
 * @param {*} message {"context":{"externalId":[{"type":"clickUpAssigneeId","id":61205104},{"type":"clickUpAssigneeId","id":61217234},{"type":"clickUpAssigneeId","id":61228575}]}}
 * @param {*} type clickUpAssigneeId
 * @returns [61205104, 61217234, 61228575]
 */
const getListOfAssignees = (message, type) => {
  let externalIdArray = null;
  const destinationExternalId = [];
  if (message.context && message.context.externalId) {
    externalIdArray = message.context.externalId;
  }
  if (externalIdArray) {
    externalIdArray.forEach((extIdObj) => {
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
      'Content-Type': JSON_MIME_TYPE,
      Authorization: apiToken,
    },
  };
  const customFieldsResponse = await httpGET(endpoint, requestOptions);
  const processedCustomFieldsResponse = processAxiosResponse(customFieldsResponse);

  if (processedCustomFieldsResponse.status !== 200) {
    throw new NetworkError(
      `Failed to fetch available custom fields due to "${JSON.stringify(
        processedCustomFieldsResponse.response,
      )}"`,
      processedCustomFieldsResponse.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(processedCustomFieldsResponse.status),
      },
      processedCustomFieldsResponse.response,
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
const populateCustomFieldValue = (customField, value) => {
  switch (customField?.type) {
    case 'drop_down':
      return getDropDown(customField, value);
    case 'labels':
      return getLabels(customField, value);
    case 'location':
      return getLocation(value);
    case 'date':
      return formatTimeStamp(value);
    default:
      return value;
  }
};

const extractUIMappedCustomFieldDetails = (
  availableCustomFieldsMap,
  configCustomFieldsMap,
  propertiesKey,
) => {
  const fieldName = configCustomFieldsMap[propertiesKey];
  return availableCustomFieldsMap[fieldName];
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
const customFieldsBuilder = async (keyToCustomFieldName, properties, listId, apiToken) => {
  const responseArray = [];
  if (properties && keyToCustomFieldName) {
    // retrieve available clickup custom field for the given list
    const availableCustomFields = await retrieveCustomFields(listId, apiToken);
    // convert array to hashMap with key as field name and value as custom field object
    const availableCustomFieldsMap = getHashFromArrayWithValueAsObject(
      availableCustomFields,
      'name',
      false,
    );

    // convert destination.Config.keyToCustomFieldName to hashMap
    const configCustomFieldsMap = getHashFromArray(keyToCustomFieldName, 'from', 'to', false);

    Object.keys(configCustomFieldsMap).forEach((propertiesKey) => {
      let fieldValue = properties[propertiesKey];
      if (fieldValue) {
        const customFieldDetailedInfo = extractUIMappedCustomFieldDetails(
          availableCustomFieldsMap,
          configCustomFieldsMap,
          propertiesKey,
        );
        validateUserSentCustomFieldValues(customFieldDetailedInfo, fieldValue);
        fieldValue = populateCustomFieldValue(customFieldDetailedInfo, fieldValue);
        if (fieldValue && customFieldDetailedInfo) {
          responseArray.push({
            id: customFieldDetailedInfo.id,
            value: fieldValue,
          });
        }
      }
    });
  }
  return responseArray;
};

/**
 * Function to discard any event that is not a part of destination.Config.whitelistedEvents
 * @param {*} message
 * @param {*} destination
 */
const checkEventIfUIMapped = (message, destination) => {
  const { whitelistedEvents } = destination.Config;
  const { event } = message;

  if (whitelistedEvents && whitelistedEvents.length > 0) {
    const allowEvent = whitelistedEvents.some(
      (whiteListedEvent) => whiteListedEvent.eventName.toLowerCase() === event.toLowerCase(),
    );
    if (!allowEvent) {
      throw new InstrumentationError(
        'The event was discarded as it was not allow listed in the destination configuration',
      );
    }
  }
};

module.exports = {
  validatePriority,
  customFieldsBuilder,
  getListOfAssignees,
  checkEventIfUIMapped,
};
