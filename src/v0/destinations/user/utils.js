const get = require('get-value');
const {
  InstrumentationError,
  NetworkInstrumentationError,
} = require('@rudderstack/integrations-lib');
const {
  getHashFromArray,
  constructPayload,
  getIntegrationsObj,
  getValueFromMessage,
  getDestinationExternalID,
  getFieldValueFromMessage,
  defaultPutRequestConfig,
  defaultPostRequestConfig,
  isDefinedAndNotNullAndNotEmpty,
} = require('../../util');
const { httpGET, httpPOST, httpPUT } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const {
  BASE_ENDPOINT,
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  groupSourceKeys,
  identifySourceKeys,
} = require('./config');
const { JSON_MIME_TYPE } = require('../../util/constant');

const ACCEPT_HEADER_VAL = '*/*;version=2';

/**
 * Returns updated User.com url
 * @param {*} endpoint
 * @param {*} appSubdomain
 * @returns
 */
const prepareUrl = (endpoint, appSubdomain) => endpoint.replace('appSubdomainName', appSubdomain);

/**
 * Returns company address in string format
 * @param {*} endpoint
 * @param {*} appSubdomain
 * @returns
 */
const prepareCompanyAddress = (address) => {
  const addressType = typeof address;
  let companyAddress = '';
  if (addressType === 'object') {
    const keys = Object.keys(address);
    keys.forEach((key) => {
      companyAddress += address[key];
    });
  } else {
    companyAddress = address;
  }
  return companyAddress;
};

/**
 * Returns the remaining keys from traits
 * @param {*} traits
 * @param {*} sourceKeys
 * @returns
 */
const getIdentifyTraits = (message) => {
  const traits = getFieldValueFromMessage(message, 'traits');
  const contextTraits = get(message, 'context.traits');
  return { ...traits, ...contextTraits };
};

/**
 * Returns the remaining keys from traits
 * Remaining keys : keys which is not included in webapp configuration mapping and not included in source-dest keys file
 * @param {*} traits
 * @param {*} sourceKeys
 * @returns
 */
const getRemainingAttributes = (traits, sourceKeys) => {
  const properties = {};
  const keys = Object.keys(traits);
  keys.forEach((key) => {
    if (!sourceKeys.includes(key)) {
      properties[key] = traits[key];
    }
  });
  return properties;
};

/**
 * Returns the customAttributes (user, company and event custom attributes) + remaining attributes
 * Remaining attributes : keys which is not included in webapp configuration mapping and not included in source-dest keys file
 * @param {*} attributesMap
 * @param {*} properties
 * @param {*} excludeKeys
 * @returns
 */
const getAttributes = (attributesMap, properties, excludeKeys) => {
  const sourceKeys = excludeKeys;
  const data = {};
  const attributesMapKeys = Object.keys(attributesMap);

  attributesMapKeys.forEach((key) => {
    if (properties[key]) {
      const destinationAttributeName = attributesMap[key];
      data[destinationAttributeName] = properties[key];
      sourceKeys.push(key);
    }
  });

  const remainingAttributes = getRemainingAttributes(properties, sourceKeys);
  return { ...data, ...remainingAttributes };
};

/**
 * Returns the identify call payload
 * @param {*} destination
 * @param {*} commonUserPropertiesPayload
 * @param {*} message
 * @returns
 */
const prepareIdentifyPayload = (destination, commonUserPropertiesPayload, message) => {
  const payload = commonUserPropertiesPayload;
  const { userAttributesMapping } = destination.Config;
  const userAttributesMap = getHashFromArray(userAttributesMapping, 'from', 'to', false);
  const traits = getIdentifyTraits(message);
  const customUserAttributes = getAttributes(userAttributesMap, traits, identifySourceKeys);
  return {
    ...payload,
    ...customUserAttributes,
  };
};

/**
 * validating the group call payload
 * if any of the required parameter is not present then we will throw an error
 * @param {*} destination
 * @param {*} message
 * @param {*} commonCompanyProperties
 * @returns
 */
const prepareCreateOrUpdateCompanyPayload = (destination, message, commonCompanyProperties) => {
  let commonCompanyPropertiesPayload = commonCompanyProperties;
  const { companyAttributesMapping } = destination.Config;
  const companyAttributesMap = getHashFromArray(companyAttributesMapping, 'from', 'to', false);
  const traits = getFieldValueFromMessage(message, 'traits');
  const customCompanyAttributes = getAttributes(companyAttributesMap, traits, groupSourceKeys);
  commonCompanyPropertiesPayload = {
    ...commonCompanyPropertiesPayload,
    ...customCompanyAttributes,
  };
  if (commonCompanyPropertiesPayload.address) {
    const { address } = commonCompanyPropertiesPayload;
    commonCompanyPropertiesPayload.address = prepareCompanyAddress(address);
  }
  delete commonCompanyPropertiesPayload.userId;

  return commonCompanyPropertiesPayload;
};

/**
 * Returns the list of the userEvents matching with payload event
 * @param {*} userEvents
 * @param {*} name
 * @returns
 */
const getUserEvent = (userEvents, name) =>
  userEvents.filter((userEvent) => {
    const { rsEventName } = userEvent;
    return rsEventName === name;
  });

/**
 * validating the page call payload
 * if any of the required parameter is not present then we will throw an error
 * @param {*} message
 * @returns
 */
const validatePagePayload = (message) => {
  const pageUrl = getFieldValueFromMessage(message, 'pageUrl');
  const pagePath = getFieldValueFromMessage(message, 'pagePath');
  const timestamp = getFieldValueFromMessage(message, 'timestamp');

  if (!pageUrl) {
    throw new InstrumentationError('Parameter url is required');
  }
  if (!pagePath) {
    throw new InstrumentationError('Parameter path is required');
  }
  if (!timestamp) {
    throw new InstrumentationError('Parameter timestamp is required');
  }
};

/**
 * validating the group call payload
 * if any of the required parameter is not present then we will throw an error
 * @param {*} message
 * @returns
 */
const validateGroupPayload = (message) => {
  const traits = getFieldValueFromMessage(message, 'traits');
  const { name } = traits;
  if (!name) {
    throw new InstrumentationError('Parameter name is required');
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
  const commonCompanyPropertiesPayload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_COMPANY.name],
  );
  const payload = prepareCreateOrUpdateCompanyPayload(
    destination,
    message,
    commonCompanyPropertiesPayload,
  );
  let { endpoint } = CONFIG_CATEGORIES.CREATE_COMPANY;
  const { Config } = destination;
  const { appSubdomain, apiKey } = Config;
  endpoint = prepareUrl(endpoint, appSubdomain);

  const requestOptions = {
    headers: {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Token ${apiKey}`,
      Accept: ACCEPT_HEADER_VAL,
    },
  };

  const response = await httpPOST(endpoint, payload, requestOptions, {
    destType: 'user',
    feature: 'transformation',
  });
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
  const commonCompanyPropertiesPayload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.UPDATE_COMPANY.name],
  );
  const payload = prepareCreateOrUpdateCompanyPayload(
    destination,
    message,
    commonCompanyPropertiesPayload,
  );
  let { endpoint } = CONFIG_CATEGORIES.UPDATE_COMPANY;
  const { Config } = destination;
  const { appSubdomain, apiKey } = Config;
  const { id: companyId } = company;
  endpoint = prepareUrl(endpoint, appSubdomain).replace('<company_id>', companyId);

  const requestOptions = {
    headers: {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Token ${apiKey}`,
      Accept: ACCEPT_HEADER_VAL,
    },
  };

  const response = await httpPUT(endpoint, payload, requestOptions, {
    destType: 'user',
    feature: 'transformation',
  });
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
  const endpoint = prepareUrl(`${BASE_ENDPOINT}/users/search/?key=${userKey}`, appSubdomain);
  const requestOptions = {
    headers: {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Token ${apiKey}`,
      Accept: ACCEPT_HEADER_VAL,
    },
  };

  const userResponse = await httpGET(endpoint, requestOptions, {
    destType: 'user',
    feature: 'transformation',
  });
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
    throw new InstrumentationError('Lookup field : email value is not present');
  }

  const endpoint = prepareUrl(`${BASE_ENDPOINT}/users/search/?email=${email}`, appSubdomain);
  const requestOptions = {
    headers: {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Token ${apiKey}`,
      Accept: ACCEPT_HEADER_VAL,
    },
  };

  const userResponse = await httpGET(endpoint, requestOptions, {
    destType: 'user',
    feature: 'transformation',
  });
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
    throw new InstrumentationError('Lookup field : phone value is not present');
  }

  const endpoint = prepareUrl(
    `${BASE_ENDPOINT}/users/search/?phone_number=${phoneNumber}`,
    appSubdomain,
  );
  const requestOptions = {
    headers: {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Token ${apiKey}`,
      Accept: ACCEPT_HEADER_VAL,
    },
  };

  const userResponse = await httpGET(endpoint, requestOptions, {
    destType: 'user',
    feature: 'transformation',
  });
  const processedUserResponse = processAxiosResponse(userResponse);

  if (processedUserResponse.status === 200) {
    const { response } = processedUserResponse;
    const { results } = response;
    if (results.length === 0) {
      throw new NetworkInstrumentationError('No user found for a given lookup field');
    } else if (results.length > 1) {
      throw new NetworkInstrumentationError('Multiple users obtained for a given lookup field');
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
  const userCustomId = getFieldValueFromMessage(message, 'userId');
  let { endpoint } = CONFIG_CATEGORIES.GET_USER_BY_USER_CUSTOM_ID;
  endpoint = prepareUrl(endpoint, appSubdomain).replace('<user_custom_id>', userCustomId);

  const requestOptions = {
    headers: {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Token ${apiKey}`,
      Accept: ACCEPT_HEADER_VAL,
    },
  };

  const userResponse = await httpGET(endpoint, requestOptions, {
    destType: 'user',
    feature: 'transformation',
  });
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
  const companyCustomId = getFieldValueFromMessage(message, 'groupId');
  let { endpoint } = CONFIG_CATEGORIES.GET_COMPANY_BY_COMPANY_CUSTOM_ID;
  endpoint = prepareUrl(endpoint, appSubdomain).replace('<company_custom_id>', companyCustomId);

  const requestOptions = {
    headers: {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Token ${apiKey}`,
      Accept: ACCEPT_HEADER_VAL,
    },
  };

  const response = await httpGET(endpoint, requestOptions, {
    destType: 'user',
    feature: 'transformation',
  });
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
  const userKey = getDestinationExternalID(message, 'userKey');
  if (isDefinedAndNotNullAndNotEmpty(userKey)) {
    return getUserByUserKey(apiKey, userKey, appSubdomain);
  }

  const integrationsObj = getIntegrationsObj(message, 'user');
  if (integrationsObj && integrationsObj.lookup) {
    const { lookup: lookupField } = integrationsObj;
    const lookupFieldValue = getFieldValueFromMessage(message, lookupField);

    if (lookupField === 'email') {
      return getUserByEmail(apiKey, lookupFieldValue, appSubdomain);
    }

    if (lookupField === 'phone') {
      return getUserByPhoneNumber(apiKey, lookupFieldValue, appSubdomain);
    }

    throw new InstrumentationError(
      `Lookup field : ${lookupField} is not supported for this destination`,
    );
  } else {
    const userId = getValueFromMessage(message, 'userId');
    if (userId) {
      return getUserByCustomId(message, destination);
    }
    const email = getFieldValueFromMessage(message, 'email');
    if (isDefinedAndNotNullAndNotEmpty(email)) {
      return getUserByEmail(apiKey, email, appSubdomain);
    }

    throw new InstrumentationError('Default lookup field : email value is empty');
  }
};

/**
 * Returns 'Create Or Update User Payload' payload
 * @param {*} message
 * @param {*} destination
 * @param {*} id
 * @returns
 */
const createOrUpdateUserPayloadBuilder = (message, destination, id = null) => {
  const { appSubdomain } = destination.Config;
  const commonUserPropertiesPayload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_USER.name],
  );
  const payload = prepareIdentifyPayload(destination, commonUserPropertiesPayload, message);
  let endpoint = id
    ? CONFIG_CATEGORIES.UPDATE_USER.endpoint
    : CONFIG_CATEGORIES.CREATE_USER.endpoint;
  endpoint = prepareUrl(endpoint, appSubdomain);
  if (id) {
    endpoint = endpoint.replace('<user_id>', id);
  }
  const method = id
    ? defaultPutRequestConfig.requestMethod
    : defaultPostRequestConfig.requestMethod;
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
    MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_EVENT_OCCURRENCE.name],
  );
  const { Config } = destination;
  const { userEvents } = Config;
  const { name } = payload;
  const userEvent = getUserEvent(userEvents, name);
  if (userEvent.length === 1) {
    const [first] = userEvent;
    const { eventProperties: eventPropertiesMapping, userEventName } = first;
    const eventPropertiesMap = getHashFromArray(eventPropertiesMapping, 'from', 'to', false);
    payload.name = userEventName;
    payload.data = getAttributes(eventPropertiesMap, properties, []);
  }

  const { id } = user;
  payload.user_id = id;
  const { endpoint } = CONFIG_CATEGORIES.CREATE_EVENT_OCCURRENCE;
  const method = defaultPostRequestConfig.requestMethod;
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
    MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_SITE_VIEWS.name],
  );
  payload.client_user = userKey;
  const { endpoint } = CONFIG_CATEGORIES.CREATE_SITE_VIEWS;
  const method = defaultPostRequestConfig.requestMethod;
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
  endpoint = endpoint.replace('<company_id>', companyId);
  payload.user_id = userId;
  payload.user_custom_id = userCustomId;
  const method = defaultPostRequestConfig.requestMethod;
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
  addUserToCompanyPayloadBuilder,
  createOrUpdateUserPayloadBuilder,
  createEventOccurrencePayloadBuilder,
};
