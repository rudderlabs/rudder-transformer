const {
  isDefinedAndNotNullAndNotEmpty,
  isDefinedAndNotNull
} = require("../../util");

const tt = "ss";
const tv = "2";
let totalAmount;
const channel = "aw";
let commissionGroup;
let voucherCode;
let currencyCode;
let orderReference;
let testMode;
let cks;

/**
 * Used to set params
 * @param {*} message 
 */
const setParams = message => {
  const properties = message?.properties;
  if (isDefinedAndNotNullAndNotEmpty(properties)) {
    totalAmount =
      properties.revenue ||
      properties.amount ||
      properties.totalAmount ||
      properties.total_amount;
    commissionGroup =
      properties.commissionGroup || properties.commission_group || "DEFAULT";
    voucherCode = properties.voucherCode || properties.voucher_code;
    currencyCode =
      properties.currency ||
      properties.currencyCode ||
      properties.currency_code;

    orderReference =
      properties.order_id ||
      properties.orderId ||
      properties.orderReference ||
      properties.order_reference;
    testMode =
      properties.testMode ||
      properties.test_mode ||
      properties.isTest ||
      properties.is_test ||
      0;
    cks = properties.cks || properties.awc || "awc";
  }
};
/**
 * This function will return params
 * @param {*} paramsIds 
 * @param {*} paramsValues 
 * @returns actual params to be passed
 */
const generateParams = (paramsIds, paramsValues) => {
  const params = {};
  let paramsValue;
  for (let i = 0; i < paramsIds.length; i++) {
    if (isDefinedAndNotNull(paramsValues[i])) {
      paramsValue = String(paramsValues[i]);
      if (paramsIds[i] === "parts") {
        // if totalAmount is defined and not null
        if (isDefinedAndNotNull(paramsValues[3])) {
          params[paramsIds[i]] = paramsValue;
        }
      } else {
        params[paramsIds[i]] = paramsValue;
      }
    }
  }
  return params;
};

/**
 * Used to retrieve the params
 * @param {*} message 
 * @param {*} advertiserId 
 * @returns params
 */
const getParams = (message, advertiserId) => {
  setParams(message);
  const paramsIds = [
    "tt",
    "tv",
    "merchant",
    "amount",
    "ch",
    "parts",
    "vc",
    "cr",
    "ref",
    "testmode",
    "cks"
  ];
  const paramsValues = [
    tt,
    tv,
    advertiserId,
    totalAmount,
    channel,
    `${commissionGroup}:${totalAmount}`,
    voucherCode,
    currencyCode,
    orderReference,
    testMode,
    cks
  ];
  return generateParams(paramsIds, paramsValues);
};

module.exports = {
  getParams
};
