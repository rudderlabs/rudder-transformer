var appsflyer = require("./AppsFlyerTransform.js");

module.exports = {
  async get(req, res, body) {
    console.log("appsflyer:get() starting");
    return appsflyer.process(body);
  },
  async post(req, res, body) {
    console.log("appsflyer:post() starting");
    return appsflyer.process(body);
  },
  async put(req, res, body) {
    console.log("appsflyer:put() starting");
    return appsflyer.process(body);
  },
  async delete(req, res, body) {
    console.log("appsflyer:delete() starting");
    return appsflyer.process(body);
  }
};
