const { getFieldValueFromMessage, base64Convertor, isNewStatusCodesAccepted } = require('../../../../v0/util');
const { HTTP_STATUS_CODES } = require('../../../../v0/util/constant');

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
    if (Array.isArray(field)) {
      return field.map((item) => ({ original: item }));
    }
    return [{ original: field }];
  }
  return undefined;
};

const getCustomAttributes = (message) => {
  if (message.traits?.customAttributes && typeof message.traits?.customAttributes === 'object'){
    return message.traits?.customAttributes;
  }

  const customAttributes = message.context.traits;
  reservedCustomAttributes.forEach((customAttribute) => {
    if (customAttributes[customAttribute]) {
      delete customAttributes[customAttribute];
    }
  });
  return customAttributes;
};

const getStatusCode = (requestMetadata, statusCode) => {
  if(isNewStatusCodesAccepted(requestMetadata) && statusCode === 200){
    return HTTP_STATUS_CODES.SUPPRESS_EVENTS;
  }
  return statusCode;
}

module.exports = { formatField, getCustomAttributes, getEndpoint, getHeaders, getStatusCode };
