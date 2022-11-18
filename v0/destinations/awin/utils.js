const {
  isDefinedAndNotNullAndNotEmpty,
  isDefinedAndNotNull
} = require("../../util");

let totalAmount;
const channel = "aw";
let commissionGroup;
let voucherCode;
let currencyCode;
let orderReference;
let testMode;
let cks;

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

const generateEndpoint = (endpoint, paramsIds, paramsValues) => {
  for (let i = 0; i < paramsIds.length; i++) {
    if (isDefinedAndNotNull(paramsValues[i])) {
      let paramsValue = String(paramsValues[i]);
      if (paramsIds[i] === "parts") {
        if (isDefinedAndNotNull(paramsValues[0])) {
          endpoint = endpoint.concat(`&${paramsIds[i]}=${paramsValue}`);
        }
      } else {
        endpoint = endpoint.concat(`&${paramsIds[i]}=${paramsValue}`);
      }
    }
  }
  return endpoint;
};

const getEndpoint = (message, endpoint) => {
  setParams(message);
  const paramsIds = [
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
    totalAmount,
    channel,
    `${commissionGroup}:${totalAmount}`,
    voucherCode,
    currencyCode,
    orderReference,
    testMode,
    cks
  ];
  return generateEndpoint(endpoint, paramsIds, paramsValues);
};

module.exports = {
  getEndpoint
};
