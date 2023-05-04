const get = require('get-value');
const sha256 = require('sha256');
const logger = require('../../../logger');

const {
  isDefinedAndNotNull,
  getFieldValueFromMessage,
  defaultBatchRequestConfig,
} = require('../../util');
const { ENDPOINT } = require('./config');
const { JSON_MIME_TYPE } = require('../../util/constant');

const channelMapping = {
  web: 'WEB',
  mobile: 'MOBILE_APP',
  mobile_app: 'MOBILE_APP',
  offline: 'OFFLINE',
};

function msUnixTimestamp(timestamp) {
  const time = new Date(timestamp);
  return time.getTime() * 1000 + time.getMilliseconds();
}

function getHashedValue(identifier) {
  if (identifier) {
    const regexExp = /^[\da-f]{64}$/gi;
    if (!regexExp.test(identifier)) {
      return sha256(identifier);
    }
    return identifier;
  }
  return null;
}

function getNormalizedPhoneNumber(message) {
  const regexExp = /^[\da-f]{64}$/gi;
  let phoneNumber = getFieldValueFromMessage(message, 'phone');
  if (regexExp.test(phoneNumber)) {
    return phoneNumber;
  }
  let leadingZero = true;
  if (phoneNumber) {
    for (let i = 0; i < phoneNumber.length; i += 1) {
      if (Number.isNaN(parseInt(phoneNumber[i], 10)) || (phoneNumber[i] === '0' && leadingZero)) {
        phoneNumber = phoneNumber.replace(phoneNumber[i], '');
        i -= 1;
      } else {
        leadingZero = false;
      }
    }
    return phoneNumber;
  }
  return null;
}

function getDataUseValue(message) {
  const att = get(message, 'context.device.attTrackingStatus');
  let limitAdTracking;
  if (isDefinedAndNotNull(att)) {
    if (att === 3) {
      limitAdTracking = false;
    } else if (att === 2) {
      limitAdTracking = true;
    }
  }
  if (limitAdTracking) {
    limitAdTracking = "['lmu']";
    return limitAdTracking;
  }
  return null;
}

function getItemIds(message) {
  let itemIds = [];
  const products = get(message, 'properties.products');
  if (products && Array.isArray(products)) {
    products.forEach((element, index) => {
      const pId = element.product_id;
      if (pId) {
        itemIds.push(pId);
      } else {
        logger.debug(`product_id not present for product at index ${index}`);
      }
    });
  } else {
    itemIds = null;
  }
  return itemIds;
}
function getPriceSum(message) {
  let priceSum = 0;
  const products = get(message, 'properties.products');
  if (products && Array.isArray(products)) {
    products.forEach((element) => {
      const { price } = element;
      const { quantity = 1 } = element;
      if (price && !Number.isNaN(parseFloat(price)) && !Number.isNaN(parseInt(quantity, 10))) {
        priceSum += parseFloat(price) * parseInt(quantity, 10);
      }
    });
  } else {
    priceSum = null;
  }
  return String(priceSum);
}

/**
 * Create Snapchat Batch payload based on the passed events
 * @param {*} events
 * @returns
 */
function generateBatchedPayloadForArray(events, destination) {
  const batchResponseList = [];

  // extracting destination
  // from the first event in a batch
  const { apiKey } = destination.Config;

  const { batchedRequest } = defaultBatchRequestConfig();

  // Batch event into dest batch structure
  events.forEach((ev) => {
    batchResponseList.push(ev.body.JSON);
  });

  batchedRequest.body.JSON_ARRAY = {
    batch: JSON.stringify(batchResponseList),
  };

  batchedRequest.endpoint = ENDPOINT;
  batchedRequest.headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Bearer ${apiKey}`,
  };

  return batchedRequest;
}

module.exports = {
  msUnixTimestamp,
  getItemIds,
  getPriceSum,
  getDataUseValue,
  getNormalizedPhoneNumber,
  getHashedValue,
  channelMapping,
  generateBatchedPayloadForArray,
};
