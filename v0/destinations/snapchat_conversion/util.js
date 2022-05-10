const get = require("get-value");
const sha256 = require("sha256");
const { logger } = require("handlebars");

const { isDefinedAndNotNull } = require("../../util");

function msUnixTimestamp(timestamp) {
  const time = new Date(timestamp);
  return time.getTime() * 1000 + time.getMilliseconds();
}

function getHashedValue(identifier) {
  if (identifier) {
    return sha256(identifier);
  }
}
function getNormalizedPhoneNumber(message) {
  let phoneNumber = message?.context?.traits?.phone?.toString();
  let leadingZero = true;
  if (phoneNumber) {
    for (let i = 0; i < phoneNumber.length; i += 1) {
      if (Number.isNaN(parseInt(phoneNumber[i], 10))) {
        phoneNumber = phoneNumber.replace(phoneNumber[i], "");
        i--;
      } else if (phoneNumber[i] === "0" && leadingZero) {
        phoneNumber = phoneNumber.replace(phoneNumber[i], "");
        i--;
      } else {
        leadingZero = false;
      }
    }
    return phoneNumber;
  }
}

function getDataUseValue(message) {
  const att = get(message, "context.device.attTrackingStatus");
  let limitAdTracking;
  if (isDefinedAndNotNull(att)) {
    if (att === 3) {
      limitAdTracking = false;
    } else if (att === 2) {
      limitAdTracking = true;
    }
  }
  return limitAdTracking;
}

function getItemIds(message) {
  let itemIds = [];
  const products = get(message, "properties.products");
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
  const products = get(message, "properties.products");
  if (products && Array.isArray(products)) {
    products.forEach(element => {
      const pPrice = element.price;
      if (pPrice) {
        priceSum += pPrice;
      }
    });
  } else {
    priceSum = null;
  }
  return priceSum;
}

module.exports = {
  msUnixTimestamp,
  getItemIds,
  getPriceSum,
  getDataUseValue,
  getNormalizedPhoneNumber,
  getHashedValue
};
