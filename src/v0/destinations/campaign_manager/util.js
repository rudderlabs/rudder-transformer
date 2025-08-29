const { parsePhoneNumber } = require('libphonenumber-js');
const sha256 = require('sha256');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const {
  constructPayload,
  isDefinedAndNotNull,
  removeUndefinedAndNullValues,
  isEmptyObject,
} = require('../../util');
const { ConfigCategories, mappingConfig } = require('./config');

function convertToMicroseconds(input) {
  const timestamp = Date.parse(input);

  if (!Number.isNaN(timestamp)) {
    // If the input is a valid date string, timestamp will be a number
    if (input.includes('Z')) {
      // ISO 8601 date string with milliseconds
      return timestamp * 1000;
    }
    // to handle case of "2022-11-17T00:22:02.903+05:30" strings
    return timestamp.toString().length === 13 ? timestamp * 1000 : timestamp * 1000000;
  }

  if (/^\d+$/.test(input)) {
    // If the input is a numeric string (assume microseconds or milliseconds)
    if (input.length === 13) {
      // equal to 13 indicates milliseconds
      return parseInt(input, 10) * 1000;
    }

    if (input.length === 10) {
      // equal to 10 indicates seconds
      return parseInt(input, 10) * 1000000;
    }
    // Otherwise, assume microseconds
    return parseInt(input, 10);
  }
  return timestamp;
}

const normalizeEmail = (email) => {
  const domains = ['@gmail.com', '@googlemail.com'];

  const matchingDomain = domains.find((domain) => email.endsWith(domain));

  if (matchingDomain) {
    const localPart = email.split('@')[0].replace(/\./g, '');
    return `${localPart}${matchingDomain}`;
  }

  return email;
};

const normalizePhone = (phone, countryCode) => {
  try {
    const phoneNumberObject = parsePhoneNumber(phone, countryCode);
    if (phoneNumberObject && phoneNumberObject.isValid()) {
      return phoneNumberObject.format('E.164');
    }
    throw new InstrumentationError('Invalid phone number');
  } catch (error) {
    throw new InstrumentationError(`Invalid phone number with error: ${error}`);
  }
};

// ref:- https://developers.google.com/doubleclick-advertisers/guides/conversions_ec#hashing
const normalizeAndHash = (key, value, options) => {
  if (!isDefinedAndNotNull(value)) return value;

  let normalizedValue;
  const trimmedValue = value.trim().toLowerCase();
  switch (key) {
    case 'hashedEmail':
      normalizedValue = normalizeEmail(trimmedValue);
      break;
    case 'hashedPhoneNumber':
      normalizedValue = normalizePhone(trimmedValue, options.countryCode);
      break;
    case 'hashedFirstName':
    case 'hashedLastName':
    case 'hashedStreetAddress':
      normalizedValue = trimmedValue;
      break;
    default:
      return value;
  }
  return sha256(normalizedValue);
};

const prepareUserIdentifiers = (message, isHashingRequired) => {
  const payload = constructPayload(
    message,
    mappingConfig[ConfigCategories.ENHANCED_CONVERSION.name],
  );

  if (isHashingRequired) {
    payload.hashedEmail = normalizeAndHash('hashedEmail', payload.hashedEmail);
    payload.hashedPhoneNumber = normalizeAndHash('hashedPhoneNumber', payload.hashedPhoneNumber, {
      options: payload.addressInfo?.countryCode,
    });

    if (!isEmptyObject(payload.addressInfo)) {
      payload.addressInfo.hashedFirstName = normalizeAndHash(
        'hashedFirstName',
        payload.addressInfo.hashedFirstName,
      );

      payload.addressInfo.hashedLastName = normalizeAndHash(
        'hashedLastName',
        payload.addressInfo.hashedLastName,
      );

      payload.addressInfo.hashedStreetAddress = normalizeAndHash(
        'hashedStreetAddress',
        payload.addressInfo.hashedStreetAddress,
      );
    }
  }

  const userIdentifiers = [];
  if (isDefinedAndNotNull(payload.hashedEmail)) {
    userIdentifiers.push({ hashedEmail: payload.hashedEmail });
  }
  if (isDefinedAndNotNull(payload.hashedPhoneNumber)) {
    userIdentifiers.push({ hashedPhoneNumber: payload.hashedPhoneNumber });
  }

  payload.addressInfo = removeUndefinedAndNullValues(payload.addressInfo);
  if (!isEmptyObject(payload.addressInfo)) {
    userIdentifiers.push({ addressInfo: payload.addressInfo });
  }

  return userIdentifiers;
};

module.exports = {
  convertToMicroseconds,
  normalizeEmail,
  normalizePhone,
  normalizeAndHash,
  prepareUserIdentifiers,
};
