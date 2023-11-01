const { getFieldValueFromMessage, base64Convertor, getDestinationExternalID } = require('../../../../v0/util');

const lookUpFields = ['email', 'phone', 'externalCustomerId'];
const reservedCustomAttributes = [
  'email',
  'phone',
  'address',
  'name',
  'avatar',
  'firstName',
  'lstName',
  'userId',
];

const getHeaders = (destination) => {
  const { apiToken, userName } = destination.Config;
  return {
    'Content-Type': 'application/json',
    Authorization: `Basic ${base64Convertor(`${userName}:${apiToken}`)}`,
  };
};

const getEndpoint = (destination) => {
  const { domain } = destination.Config;
  return `https://${domain}/api/v1/customer-profiles`;
};

const formatField = (message, fieldName) => {
  const field = getFieldValueFromMessage(message, fieldName);
  if (field) {
    if (typeof field === 'object' && Array.isArray(field)) {
      return field.map((item) => ({ original: item }));
    }
    return [{ original: field }];
  }
  return undefined;
};

const getQueryParams = (message, integrationsObj) => {
  let queryParamKey;
  let queryParamValue;
  if (integrationsObj && integrationsObj.lookup){
    queryParamKey = integrationsObj.lookup;
  }
  if (!queryParamKey) {
    queryParamKey = 'email';
  }
  if (!lookUpFields.includes(queryParamKey)) {
    queryParamKey = 'email';
  }

  if (queryParamKey === 'email' || queryParamKey === 'phone') {
    queryParamValue = getFieldValueFromMessage(message,queryParamKey);
    if (!queryParamValue) return undefined;
  } else{
    queryParamValue = getDestinationExternalID(message, 'gladlyExternalCustomerId');
    if (!queryParamValue) return undefined;
  }

  queryParamKey = queryParamKey === 'phone' ? 'phoneNumber' : queryParamKey;
  return { key: queryParamKey, value: queryParamValue };
};

const getCustomAttributes = (message) => {
  const customAttributes = message.context.traits;
  reservedCustomAttributes.forEach((customAttribute) => {
    if (customAttributes[customAttribute]) {
      delete customAttributes[customAttribute];
    }
  });
  return customAttributes;
};

module.exports = { formatField, getCustomAttributes, getEndpoint, getQueryParams, getHeaders };
