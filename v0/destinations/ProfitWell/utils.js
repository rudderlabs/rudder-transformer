const { send } = require("../../../adapters/network");
const { toUnixTimestamp } = require("../../util");
const { CURRENCY_CODES } = require("./config");

const getSubscriptionHistory = async (endpoint, options) => {
  const requestOptions = {
    url: endpoint,
    method: "get",
    ...options
  };
  const res = await send(requestOptions);
  return res;
};

const unixTimestampOrNull = timestamp => {
  const convertedTS = toUnixTimestamp(timestamp);
  if (Number.isNaN(convertedTS)) {
    return null;
  }
  return convertedTS;
};

const isValidPlanCurrency = payload => {
  return CURRENCY_CODES.includes(payload.plan_currency.toLowerCase());
};

module.exports = {
  getSubscriptionHistory,
  unixTimestampOrNull,
  isValidPlanCurrency
};
