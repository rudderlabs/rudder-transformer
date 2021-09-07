const { send } = require("../../../adapters/network");

const getSubscriptionHistory = async (endpoint, options) => {
  const requestOptions = {
    url: endpoint,
    method: "get",
    ...options
  };
  const res = await send(requestOptions);
  return res;
};

module.exports = { getSubscriptionHistory };
