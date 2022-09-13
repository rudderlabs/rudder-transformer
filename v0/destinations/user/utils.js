const get = require("get-value");
const {
  CustomError,
  toUnixTimestamp,
  constructPayload,
  getIntegrationsObj,
  getValueFromMessage,
  getDestinationExternalID,
  getFieldValueFromMessage,
  isDefinedAndNotNullAndNotEmpty
} = require("../../util");
const { httpGET, httpPOST, httpPUT } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const {
  BASE_ENDPOINT,
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  groupSourceKeys,
  identifySourceKeys
} = require("./config");

/**
 * Returns updated User.com url
 * @param {*} endpoint
 * @param {*} appSubdomain
 * @returns
 */
const prepareUrl = (endpoint, appSubdomain) => {
  return endpoint.replace("appSubdomainName", appSubdomain);
};

/**
 * Returns company address in string format
 * @param {*} endpoint
 * @param {*} appSubdomain
 * @returns
 */
const prepareCompanyAddress = address => {
  let companyAddress = "";
  const keys = Object.keys(address);
  keys.forEach(key => {
    companyAddress += address[key];
  });
  return companyAddress;
};

/**
 * Returns the remaining keys from traits
 * Remaining keys : keys which is not included in webapp configuration mapping and not included in source-dest keys file
 * @param {*} traits
 * @param {*} sourceKeys
 * @returns
 */
const getRemainingTraits = (traits, sourceKeys) => {
  const properties = {};
  const keys = Object.keys(traits);
  keys.forEach(key => {
    if (!sourceKeys.includes(key)) {
      properties[key] = traits[key];
    }
  });
  return properties;
};

/**
 * Returns the user attributes(configured from webapp mapping) and remaining attributes(which is not configured anywhere)
 * @param {*} userAttributesMap
 * @param {*} message
 * @returns
 */
const getUserDestAttributes = (userAttributesMap, message) => {
  const properties = {};
  let traits = getFieldValueFromMessage(message, "traits");
  const contextTraits = get(message, "context.traits");
  traits = { ...traits, ...contextTraits };
  const sourceKeys = [...identifySourceKeys];

  userAttributesMap.forEach(attribute => {
    const { from, to } = attribute;
    if (traits[from]) {
      properties[to] = traits[from];
      sourceKeys.push(from);
    }
  });

  const remainingTraits = getRemainingTraits(traits, sourceKeys);
  return { ...properties, ...remainingTraits };
};

/**
 * Returns the list of the userEvents matching with payload event
 * @param {*} userEvents
 * @param {*} name
 * @returns
 */
const getUserEvent = (userEvents, name) => {
  return userEvents.filter(userEvent => {
    const { rsEventName } = userEvent;
    return rsEventName === name;
  });
};

/**
 * Returns the event properties(configured from webapp mapping) and remaining event properties
 * Remaining event properties : event properties which is not configured anywhere
 * @param {*} userEvent
 * @param {*} properties
 * @returns
 */
const getEventAttributes = (userEvent, properties) => {
  const data = properties;
  const { eventProperties } = userEvent;
  eventProperties.forEach(property => {
    const { from, to } = property;
    if (properties[from]) {
      data[to] = properties[from];
      delete data[from];
    }
  });
  return data;
};

/**
 * Returns the company attributes(configured from webapp mapping) and remaining attributes(which is not configured anywhere)
 * @param {*} companyAttributesMap
 * @param {*} message
 * @returns
 */
const getCompanyDestAttributes = (companyAttributesMap, message) => {
  const traits = getFieldValueFromMessage(message, "traits");
  const properties = {};
  const sourceKeys = [...groupSourceKeys];

  companyAttributesMap.forEach(attribute => {
    const { from, to } = attribute;
    if (traits[from]) {
      properties[to] = traits[from];
      sourceKeys.push(from);
    }
  });

  const remainingTraits = getRemainingTraits(traits, sourceKeys);
  return { ...properties, ...remainingTraits };
};

/**
 * validating the page call payload
 * if any of the required parameter is not present then we will throw an error
 * @param {*} message
 * @returns
 */
const validatePagePayload = message => {
  const pageUrl = getFieldValueFromMessage(message, "pageUrl");
  const pagePath = getFieldValueFromMessage(message, "pagePath");
  const timestamp = getFieldValueFromMessage(message, "timestamp");

  if (!pageUrl) {
    throw new CustomError("Parameter url is required", 400);
  }
  if (!pagePath) {
    throw new CustomError("Parameter path is required", 400);
  }
  if (!timestamp) {
    throw new CustomError("Parameter timestamp is required", 400);
  }
};

/**
 * validating the group call payload
 * if any of the required parameter is not present then we will throw an error
 * @param {*} message
 * @returns
 */
const validateGroupPayload = message => {
  const traits = getFieldValueFromMessage(message, "traits");
  const { name } = traits;
  if (!name) {
    throw new CustomError("Parameter name is required", 400);
  }
};

/**
 * Creating a company
 * ref: https://apidocs.user.com/companies/create-company.html
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const createCompany = async (message, destination) => {
  let payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_COMPANY.name]
  );
  const { companyAttributesMapping } = destination.Config;
  const companyAttributes = getCompanyDestAttributes(
    companyAttributesMapping,
    message
  );
  payload = { ...payload, ...companyAttributes };
  if (payload.address) {
    const { address } = payload;
    payload.address = prepareCompanyAddress(address);
  }
  let { endpoint } = CONFIG_CATEGORIES.CREATE_COMPANY;
  const { Config } = destination;
  const { appSubdomain, apiKey } = Config;
  endpoint = prepareUrl(endpoint, appSubdomain);
  delete payload.userId;

  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${apiKey}`,
      Accept: "*/*;version=2"
    }
  };

  const response = await httpPOST(endpoint, payload, requestOptions);
  const data = processAxiosResponse(response);
  return data.response;
};

/**
 * Updating the company
 * ref: https://apidocs.user.com/companies/update-company.html
 * @param {*} message
 * @param {*} destination
 * @param {*} company
 * @returns
 */
const updateCompany = async (message, destination, company) => {
  let payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.UPDATE_COMPANY.name]
  );
  const { companyAttributesMapping } = destination.Config;
  const companyAttributes = getCompanyDestAttributes(
    companyAttributesMapping,
    message
  );
  payload = { ...payload, ...companyAttributes };
  if (payload.address) {
    const { address } = payload;
    payload.address = prepareCompanyAddress(address);
  }
  let { endpoint } = CONFIG_CATEGORIES.UPDATE_COMPANY;
  const { Config } = destination;
  const { appSubdomain, apiKey } = Config;
  const { id: companyId } = company;
  endpoint = prepareUrl(endpoint, appSubdomain).replace(
    "<company_id>",
    companyId
  );
  delete payload.userId;

  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${apiKey}`,
      Accept: "*/*;version=2"
    }
  };

  const response = await httpPUT(endpoint, payload, requestOptions);
  const data = processAxiosResponse(response);
  return data.response;
};

/**
 * Returns the user if found by userKey or else return null
 * ref: https://apidocs.user.com/users/find-user-by-key.html
 * @param {*} apiKey
 * @param {*} userKey
 * @param {*} appSubdomain
 * @returns
 */
const getUserByUserKey = async (apiKey, userKey, appSubdomain) => {
  const endpoint = prepareUrl(
    `${BASE_ENDPOINT}/users/search/?key=${userKey}`,
    appSubdomain
  );
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${apiKey}`,
      Accept: "*/*;version=2"
    }
  };

  const userResponse = await httpGET(endpoint, requestOptions);
  const processedUserResponse = processAxiosResponse(userResponse);
  if (processedUserResponse.status === 200) {
    return processedUserResponse.response;
  }
  return null;
};

/**
 * Returns the user if found by an email or else return null
 * ref: https://apidocs.user.com/users/find-user-by-email.html
 * @param {*} apiKey
 * @param {*} email
 * @param {*} appSubdomain
 * @returns
 */
const getUserByEmail = async (apiKey, email, appSubdomain) => {
  if (!email) {
    throw new CustomError("lookup field : email value is not present", 400);
  }

  const endpoint = prepareUrl(
    `${BASE_ENDPOINT}/users/search/?email=${email}`,
    appSubdomain
  );
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${apiKey}`,
      Accept: "*/*;version=2"
    }
  };

  const userResponse = await httpGET(endpoint, requestOptions);
  const processedUserResponse = processAxiosResponse(userResponse);

  if (processedUserResponse.status === 200) {
    return processedUserResponse.response;
  }

  return null;
};

/**
 * Returns the user if found by phone number or else return null
 * ref: https://apidocs.user.com/users/find-user-by-phone-number.html
 * @param {*} apiKey
 * @param {*} phoneNumber
 * @param {*} appSubdomain
 * @returns
 */
const getUserByPhoneNumber = async (apiKey, phoneNumber, appSubdomain) => {
  if (!phoneNumber) {
    throw new CustomError("lookup field : phone value is not present", 400);
  }

  const endpoint = prepareUrl(
    `${BASE_ENDPOINT}/users/search/?phone_number=${phoneNumber}`,
    appSubdomain
  );
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${apiKey}`,
      Accept: "*/*;version=2"
    }
  };

  const userResponse = await httpGET(endpoint, requestOptions);
  const processedUserResponse = processAxiosResponse(userResponse);

  if (processedUserResponse.status === 200) {
    const { response } = processedUserResponse;
    const { results } = response;
    if (results.length === 0) {
      throw new CustomError("no user found for a given lookup field", 400);
    } else if (results.length > 1) {
      throw new CustomError(
        "multiple users obtained for a given lookup field",
        400
      );
    } else {
      const [first] = results;
      return first;
    }
  }

  return null;
};

/**
 * Returns the user if found by user custom id or else return null
 * ref: https://apidocs.user.com/users-custom-id/get-single-user-details.html
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const getUserByCustomId = async (message, destination) => {
  const { Config } = destination;
  const { appSubdomain, apiKey } = Config;
  const userCustomId = getFieldValueFromMessage(message, "userId");
  let { endpoint } = CONFIG_CATEGORIES.GET_USER_BY_USER_CUSTOM_ID;
  endpoint = prepareUrl(endpoint, appSubdomain).replace(
    "<user_custom_id>",
    userCustomId
  );

  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${apiKey}`,
      Accept: "*/*;version=2"
    }
  };

  const userResponse = await httpGET(endpoint, requestOptions);
  const processedUserResponse = processAxiosResponse(userResponse);

  if (processedUserResponse.status === 200) {
    return processedUserResponse.response;
  }

  return null;
};

/**
 * Returns the company if found by company custom id or else return null
 * ref: https://apidocs.user.com/companies/get-company-by-id.html
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const getCompanyByCustomId = async (message, destination) => {
  const { Config } = destination;
  const { appSubdomain, apiKey } = Config;
  const companyCustomId = getFieldValueFromMessage(message, "groupId");
  let { endpoint } = CONFIG_CATEGORIES.GET_COMPANY_BY_COMPANY_CUSTOM_ID;
  endpoint = prepareUrl(endpoint, appSubdomain).replace(
    "<company_custom_id>",
    companyCustomId
  );

  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${apiKey}`,
      Accept: "*/*;version=2"
    }
  };

  const response = await httpGET(endpoint, requestOptions);
  const processedUserResponse = processAxiosResponse(response);
  if (processedUserResponse.status === 200) {
    return processedUserResponse.response;
  }

  return null;
};

/**
 * lookup logic to find user
 * priority : userKey(eternalId) -> lookup field(integrationObj) -> userId -> default lookup(email)
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const retrieveUserFromLookup = async (message, destination) => {
  const { Config } = destination;
  const { appSubdomain, apiKey } = Config;
  const userKey = getDestinationExternalID(message, "userKey");
  if (isDefinedAndNotNullAndNotEmpty(userKey)) {
    return getUserByUserKey(apiKey, userKey, appSubdomain);
  }

  const integrationsObj = getIntegrationsObj(message, "user");
  if (integrationsObj && integrationsObj.lookup) {
    const { lookup: lookupField } = integrationsObj;
    const lookupFieldValue = getFieldValueFromMessage(message, lookupField);

    if (lookupField === "email") {
      return getUserByEmail(apiKey, lookupFieldValue, appSubdomain);
    }

    if (lookupField === "phone") {
      return getUserByPhoneNumber(apiKey, lookupFieldValue, appSubdomain);
    }
    throw new CustomError(
      `lookup field : ${lookupField} is not supported for this destination`,
      400
    );
  } else {
    const userId = getValueFromMessage(message, "userId");
    if (userId) {
      return getUserByCustomId(message, destination);
    }
    const email = getFieldValueFromMessage(message, "email");
    if (isDefinedAndNotNullAndNotEmpty(email)) {
      return getUserByEmail(apiKey, email, appSubdomain);
    }
    throw new CustomError("default lookup field : email value is empty", 400);
  }
};

/**
 * Returns 'Create User' payload
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const createUserPayloadBuilder = (message, destination) => {
  let payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_USER.name]
  );
  const { userAttributesMapping } = destination.Config;
  const userAttributes = getUserDestAttributes(userAttributesMapping, message);
  payload = { ...payload, ...userAttributes };
  const { endpoint } = CONFIG_CATEGORIES.CREATE_USER;
  const method = "POST";
  return { payload, endpoint, method };
};

/**
 * Returns 'Update User' payload
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const updateUserPayloadBuilder = (message, destination) => {
  let payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.UPDATE_USER.name]
  );
  const { userAttributesMapping } = destination.Config;
  const userAttributes = getUserDestAttributes(userAttributesMapping, message);
  payload = { ...payload, ...userAttributes };
  const { endpoint } = CONFIG_CATEGORIES.UPDATE_USER;
  const method = "PUT";
  return { payload, endpoint, method };
};

/**
 * Returns 'Create Event Occurrence' payload
 * @param {*} message
 * @param {*} user
 * @param {*} destination
 * @returns
 */
const createEventOccurrencePayloadBuilder = (message, user, destination) => {
  const { properties } = message;
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_EVENT_OCCURRENCE.name]
  );
  const { Config } = destination;
  const { userEvents } = Config;
  const { name } = payload;
  const userEvent = getUserEvent(userEvents, name);
  if (userEvent.length === 1) {
    const [first] = userEvent;
    payload.name = first.userEventName;
    payload.data = getEventAttributes(first, properties);
  }

  const { id } = user;
  payload.user_id = id;
  if (payload.timestamp) {
    const { timestamp } = payload;
    payload.timestamp = toUnixTimestamp(timestamp);
  }
  const { endpoint } = CONFIG_CATEGORIES.CREATE_EVENT_OCCURRENCE;
  const method = "POST";
  return { payload, endpoint, method };
};

/**
 * Returns 'Page Visit' payload
 * @param {*} message
 * @param {*} user
 * @returns
 */
const pageVisitPayloadBuilder = (message, user) => {
  validatePagePayload(message);
  const { user_key: userKey } = user;
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_SITE_VIEWS.name]
  );
  payload.client_user = userKey;
  const { endpoint } = CONFIG_CATEGORIES.CREATE_SITE_VIEWS;
  const method = "POST";
  return { payload, endpoint, method };
};

/**
 * Returns 'Add User To Company' payload
 * @param {*} user
 * @param {*} company
 * @returns
 */
const addUserToCompanyPayloadBuilder = (user, company) => {
  const payload = {};
  const { id: userId, custom_id: userCustomId } = user;
  const { id: companyId } = company;
  let { endpoint } = CONFIG_CATEGORIES.ADD_USER_TO_COMPANY;
  endpoint = endpoint.replace("<company_id>", companyId);
  payload.user_id = userId;
  payload.user_custom_id = userCustomId;
  const method = "POST";
  return { payload, endpoint, method, companyId };
};

module.exports = {
  prepareUrl,
  createCompany,
  updateCompany,
  getUserByCustomId,
  validateGroupPayload,
  getCompanyByCustomId,
  retrieveUserFromLookup,
  pageVisitPayloadBuilder,
  createUserPayloadBuilder,
  updateUserPayloadBuilder,
  addUserToCompanyPayloadBuilder,
  createEventOccurrencePayloadBuilder
};
