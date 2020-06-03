const v0 = require("./v0/process.js");
const v1 = require("./v1/process.js");

function processWarehouseMessage(provider, message, schemaVersion) {
  switch (schemaVersion) {
    case "v0":
      return v0(provider, message);
    case "v1":
      return v1(provider, message);
    default:
      return v1(provider, message);
  }
}

module.exports = {
  processWarehouseMessage
};
