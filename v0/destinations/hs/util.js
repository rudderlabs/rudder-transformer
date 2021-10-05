const { send } = require("../../../adapters/network");

const getAllContactProperties = async endpoint => {
  const requestOptions = {
    url: endpoint,
    method: "get"
  };
  const res = await send(requestOptions);
  return res;
};

const getEmailAndUpdatedProps = properties => {
  const index = properties.findIndex(prop => prop.property === "email");
  return {
    email: properties[index].value,
    updatedProperties: properties.filter((prop, i) => i !== index)
  };
};

module.exports = {
  getAllContactProperties,
  getEmailAndUpdatedProps
};
