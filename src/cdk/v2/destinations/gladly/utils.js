const get = require('get-value');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { base64Convertor, getDestinationExternalID } = require('../../../../v0/util');
const { MappedToDestinationKey } = require('../../../../constants');

const reservedCustomAttributes = [
  'email',
  'phone',
  'address',
  'name',
  'avatar',
  'firstName',
  'lastName',
  'userId',
];

const externalIdKey = 'context.externalId.0.id';
const identifierTypeKey = 'context.externalId.0.identifierType';

const getHeaders = (destination) => {
  const { apiToken, userName } = destination.Config;
  const credentials = `${userName}:${apiToken}`;
  const base64Credentials = base64Convertor(credentials);
  return {
    'Content-Type': 'application/json',
    Authorization: `Basic ${base64Credentials}`,
  };
};

const getEndpoint = (destination) => {
  const { domain } = destination.Config;
  return `https://${domain}/api/v1/customer-profiles`;
};

const getFieldValue = (field) => {
  if (field) {
    if (Array.isArray(field)) {
      return field.map((item) => ({ original: item }));
    }
    return [{ original: field }];
  }
  return undefined;
};

const formatFieldForRETl = (message, fieldName) => {
  const identifierType = get(message, identifierTypeKey);
  if (identifierType && identifierType === fieldName) {
    const field = get(message, externalIdKey);
    if (field) {
      return [{ original: field }];
    }
  }
  const key = fieldName === 'email' ? 'emails' : 'phones';
  const field = get(message, `traits.${key}`);
  return getFieldValue(field);
};

const formatFieldForEventStream = (message, fieldName) => {
  const field = get(message, `context.traits.${fieldName}`);
  return getFieldValue(field);
};

const formatField = (message, fieldName) => {
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (mappedToDestination) {
    return formatFieldForRETl(message, fieldName);
  }
  return formatFieldForEventStream(message, fieldName);
};

const getCustomAttributes = (message) => {
  const mappedToDestination = get(message, MappedToDestinationKey);
  // for rETL
  if (mappedToDestination) {
    if (message?.traits?.customAttributes && typeof message.traits.customAttributes === 'object') {
      return Object.keys(message.traits.customAttributes).length > 0
        ? message.traits.customAttributes
        : undefined;
    }
    return undefined;
  }

  // for event stream
  const customAttributes = message.context?.traits || {};
  reservedCustomAttributes.forEach((customAttribute) => {
    if (customAttributes[customAttribute]) {
      delete customAttributes[customAttribute];
    }
  });
  return Object.keys(customAttributes).length > 0 ? customAttributes : undefined;
};

const getExternalCustomerId = (message) => {
  const mappedToDestination = get(message, MappedToDestinationKey);
  // for rETL
  if (mappedToDestination) {
    const identifierType = get(message, identifierTypeKey);
    if (identifierType === 'externalCustomerId') {
      return get(message, externalIdKey);
    }

    if (message?.traits?.externalCustomerId) {
      return message.traits.externalCustomerId;
    }

    return undefined;
  }

  // for event stream
  return message.userId;
};

const getCustomerId = (message) => {
  const mappedToDestination = get(message, MappedToDestinationKey);
  // for rETL
  if (mappedToDestination) {
    const identifierType = get(message, identifierTypeKey);
    if (identifierType === 'id') {
      return get(message, externalIdKey);
    }

    if (message?.traits?.id) {
      return message.traits.id;
    }

    return undefined;
  }

  // for event stream
  const customerId = getDestinationExternalID(message, 'GladlyCustomerId');
  if (customerId) {
    return customerId;
  }

  return undefined;
};

const validatePayload = (payload) => {
  if (!(payload?.phones || payload?.emails || payload?.id || payload?.externalCustomerId)) {
    throw new InstrumentationError(
      'One of phone, email, userId or GladlyCustomerId is required for an identify call',
    );
  }
};

const getQueryParams = (payload) => {
  if (payload.emails && payload.emails.length > 0) {
    return `email=${encodeURIComponent(payload.emails[0].original)}`;
  }

  if (payload.phones && payload.phones.length > 0) {
    return `phoneNumber=${encodeURIComponent(payload.phones[0].original)}`;
  }

  if (payload.externalCustomerId) {
    return `externalCustomerId=${encodeURIComponent(payload.externalCustomerId)}`;
  }

  return undefined;
};

module.exports = {
  getHeaders,
  getEndpoint,
  formatField,
  getFieldValue,
  getCustomerId,
  getQueryParams,
  validatePayload,
  formatFieldForRETl,
  getCustomAttributes,
  getExternalCustomerId,
  formatFieldForEventStream,
};
