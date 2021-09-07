const { send } = require("../../../adapters/network");
const { toUnixTimestamp } = require("../../util");

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

module.exports = { getSubscriptionHistory, unixTimestampOrNull };
