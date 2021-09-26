const { send } = require("../../../adapters/network");

const getAllContactProperties = async endpoint => {
  const requestOptions = {
    url: endpoint,
    method: "get"
  };
  const res = await send(requestOptions);
  return res;
};

module.exports = {
  getAllContactProperties
};
