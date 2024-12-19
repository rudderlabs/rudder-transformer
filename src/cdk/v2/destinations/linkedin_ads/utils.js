const lodash = require('lodash');
const crypto = require('crypto');
const moment = require('moment');

const {
  InstrumentationError,
  getHashFromArrayWithDuplicate,
  isDefinedAndNotNullAndNotEmpty,
  ConfigurationError,
} = require('@rudderstack/integrations-lib');
const {
  getFieldValueFromMessage,
  constructPayload,
  getDestinationExternalID,
} = require('../../../../v0/util');
const {
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  MAX_BATCH_SIZE,
  API_HEADER_METHOD,
  API_PROTOCOL_VERSION,
  API_VERSION,
} = require('./config');
const {
  AUTH_STATUS_INACTIVE,
  REFRESH_TOKEN,
} = require('../../../../adapters/networkhandler/authConstants');

const formatEmail = (email, destConfig) => {
  if (email) {
    if (destConfig.hashData === true) {
      return crypto.createHash('sha256').update(email).digest('hex');
    }
    return email;
  }
  return null;
};

const fetchUserIds = (message, destConfig) => {
  const userIds = [];
  const email = formatEmail(getFieldValueFromMessage(message, 'email'), destConfig);
  const linkedinFirstPartyAdsTrackingUUID = getDestinationExternalID(
    message,
    'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID',
  );
  const acxiomId = getDestinationExternalID(message, 'ACXIOM_ID');
  const oracleMoatId = getDestinationExternalID(message, 'ORACLE_MOAT_ID');
  if (!email && !linkedinFirstPartyAdsTrackingUUID && !acxiomId && !oracleMoatId) {
    throw new InstrumentationError(
      '[LinkedIn Conversion API] no matching user id found. Please provide at least one of the following: email, linkedinFirstPartyAdsTrackingUUID, acxiomId, oracleMoatId',
    );
  }

  if (email) {
    userIds.push({ idType: 'SHA256_EMAIL', idValue: email });
  }
  if (linkedinFirstPartyAdsTrackingUUID) {
    userIds.push({
      idType: 'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID',
      idValue: linkedinFirstPartyAdsTrackingUUID,
    });
  }
  if (acxiomId) {
    userIds.push({ idType: 'ACXIOM_ID', idValue: acxiomId });
  }
  if (oracleMoatId) {
    userIds.push({ idType: 'ORACLE_MOAT_ID', idValue: oracleMoatId });
  }
  return userIds;
};

const curateUserInfoObject = (message) => {
  const commonCategory = CONFIG_CATEGORIES.USER_INFO;
  const commonPayload = constructPayload(message, MAPPING_CONFIG[commonCategory.name]);
  if (commonPayload.firstName && commonPayload.lastName) {
    return commonPayload;
  }
  return null;
};

function checkIfPricePresent(properties) {
  // Check if 'products' exists and is an array
  if (Array.isArray(properties?.products)) {
    // Use 'some' to check if at least one object has a 'price' field
    const hasPrice = properties.products.some((product) => product.hasOwnProperty('price'));
    return hasPrice;
  }
  return !!properties.price;
}

const calculateConversionObject = (message) => {
  const { properties } = message;

  const calculateAmount = () => {
    if (properties?.products && properties.products.length > 0) {
      return properties.products.reduce(
        (acc, product) => acc + (product.price || 0) * (product.quantity || 1),
        0,
      );
    }
    return properties.price * (properties.quantity ?? 1);
  };
  if (checkIfPricePresent(properties)) {
    const conversionObject = {
      currencyCode: properties.currency || 'USD',
      amount: `${calculateAmount()}`,
    };
    return conversionObject;
  }
  return null;
};

const deduceConversionRules = (trackEventName, destConfig) => {
  let conversionRule;
  const { conversionMapping } = destConfig;
  if (conversionMapping.length > 0) {
    const keyMap = getHashFromArrayWithDuplicate(conversionMapping, 'from', 'to', false);
    conversionRule = keyMap[trackEventName];
  }
  if (isDefinedAndNotNullAndNotEmpty(conversionRule)) {
    const finalEvent = typeof conversionRule === 'string' ? [conversionRule] : [...conversionRule];
    return finalEvent;
  }
  throw new ConfigurationError(
    `[LinkedIn Conversion API] no matching conversion rule found for ${trackEventName}. Please provide a conversion rule. Aborting`,
  );
};

const createConversionString = (ruleId) => `urn:lla:llaPartnerConversion:${ruleId}`;

const generateHeader = (accessToken) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-RestLi-Method': API_HEADER_METHOD,
    'X-Restli-Protocol-Version': API_PROTOCOL_VERSION,
    'LinkedIn-Version': API_VERSION,
    Authorization: `Bearer ${accessToken}`,
  };
  return headers;
};

const fetchAndVerifyConversionHappenedAt = (message) => {
  const timeStamp = message.timestamp || message.originalTimestamp;
  if (timeStamp) {
    const start = moment(timeStamp);
    if (!start.isValid()) {
      throw new InstrumentationError('Invalid timestamp format.');
    }
    const current = moment();
    // calculates past event in days
    const deltaDay = current.diff(start, 'days', true);

    if (Math.ceil(deltaDay) > 90) {
      throw new InstrumentationError('Events must be sent within ninety days of their occurrence.');
    }
  }

  const timeInMilliseconds = moment(timeStamp).valueOf(); // `valueOf` returns the time in milliseconds
  return timeInMilliseconds;
};

function batchResponseBuilder(successfulEvents) {
  if (successfulEvents.length === 0) {
    return [];
  }
  const constants = {
    version: successfulEvents[0].message[0].version,
    type: successfulEvents[0].message[0].type,
    method: successfulEvents[0].message[0].method,
    endpoint: successfulEvents[0].message[0].endpoint,
    headers: successfulEvents[0].message[0].headers,
    destination: successfulEvents[0].destination,
  };

  const allElements = successfulEvents.flatMap((event) => event.message[0].body.JSON.elements);
  const allMetadata = successfulEvents.map((event) => event.metadata);

  // Using lodash to chunk the elements into groups of up to 3
  const chunkedElements = lodash.chunk(allElements, MAX_BATCH_SIZE);
  const chunkedMetadata = lodash.chunk(allMetadata, MAX_BATCH_SIZE);

  return chunkedElements.map((elementsBatch, index) => ({
    batchedRequest: {
      body: {
        JSON: { elements: elementsBatch },
        JSON_ARRAY: {},
        XML: {},
        FORM: {},
      },
      version: constants.version,
      type: constants.type,
      method: constants.method,
      endpoint: constants.endpoint,
      headers: constants.headers,
      params: {},
      files: {},
    },
    metadata: chunkedMetadata[index],
    batched: true,
    statusCode: 200,
    destination: constants.destination,
  }));
}

function constructPartialStatus(errorMessage) {
  const errorPattern = /Index: (\d+), ERROR :: (.*?)\n/g;
  let match;
  const errorMap = {};

  try {
    // eslint-disable-next-line no-cond-assign
    while ((match = errorPattern.exec(errorMessage)) !== null) {
      const [, index, message] = match;
      errorMap[index] = message;
    }

    return errorMap;
  } catch (e) {
    return null;
  }
}

function createResponseArray(metadata, partialStatus) {
  const partialStatusArray = Object.entries(partialStatus).map(([index, message]) => [
    Number(index),
    message,
  ]);
  // Convert destPartialStatus to an object for easier lookup
  const errorMap = partialStatusArray.reduce((acc, [index, message]) => {
    const jobId = metadata[index]?.jobId; // Get the jobId from the metadata array based on the index
    if (jobId !== undefined) {
      acc[jobId] = message;
    }
    return acc;
  }, {});

  return metadata.map((item) => {
    const error = errorMap[item.jobId];
    return {
      statusCode: error ? 400 : 500,
      metadata: item,
      error: error || 'success',
    };
  });
}

/**
 *
 * @param {*} destinationResponse example: {status : 401, response {"status":401,"serviceErrorCode":65601,"code":"REVOKED_ACCESS_TOKEN","message":"The token used in the request has been revoked by the user"}}
 * @returns proper auth error category
 */
const getAuthErrCategoryFromStCode = (destinationResponse) => {
  const { status, response } = destinationResponse;
  if (status === 401) {
    if (response.code === 'REVOKED_ACCESS_TOKEN') {
      // ACCESS_DENIED
      return AUTH_STATUS_INACTIVE;
    }
    // UNAUTHORIZED
    return REFRESH_TOKEN;
  }
  if (status === 403) {
    // ACCESS_DENIED
    return AUTH_STATUS_INACTIVE;
  }
  return '';
};

module.exports = {
  formatEmail,
  calculateConversionObject,
  curateUserInfoObject,
  fetchUserIds,
  deduceConversionRules,
  createConversionString,
  generateHeader,
  fetchAndVerifyConversionHappenedAt,
  batchResponseBuilder,
  constructPartialStatus,
  createResponseArray,
  checkIfPricePresent,
  getAuthErrCategoryFromStCode,
};
