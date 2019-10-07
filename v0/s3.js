var jsonQ = require("jsonq");
var warehouseT = require("./warehouseTransform.js");

module.exports = {
  async get(req, res, body) {
    console.log("warehouse:get() starting");

    var requestJson = JSON.parse(body);
    return warehouseT.process(jsonQ(requestJson));
  },
  async post(req, res, body) {
    console.log("warehouse:post() starting");

    var requestJson = JSON.parse(body);
    var x = warehouseT.process(jsonQ(requestJson))
    console.log('_________');
    console.log(x);
    console.log('_________');
    return x;
  },
  async put(req, res, body) {
    console.log("warehouse:put() starting");

    var requestJson = JSON.parse(body);
    return warehouseT.process(jsonQ(requestJson));
  },
  async delete(req, res, body) {
    console.log("warehouse:delete() starting");

    var requestJson = JSON.parse(body);
    return warehouseT.process(jsonQ(requestJson));
  }
};
