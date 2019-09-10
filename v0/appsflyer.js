var jsonQ = require("jsonq");
var appsflyer = require("./AppsFlyerTransform.js");

module.exports = {
  async get(req, res, body) {
    console.log("appsflyer:get() starting");

    var requestJson = JSON.parse(body);
    return appsflyer.process(jsonQ(requestJson));
  },
  async post(req, res, body) {
    console.log("appsflyer:post() starting");

    var requestJson = JSON.parse(body);
    return appsflyer.process(jsonQ(requestJson));
  },
  async put(req, res, body) {
    console.log("appsflyer:put() starting");

    var requestJson = JSON.parse(body);
    return appsflyer.process(jsonQ(requestJson));
  },
  async delete(req, res, body) {
    console.log("appsflyer:delete() starting");

    var requestJson = JSON.parse(body);
    return appsflyer.process(jsonQ(requestJson));
  }
};
