var gat = require("./GATransform.js");

module.exports = {
  async get(req, res, body) {
    console.log("ga:get() starting");
    return gat.process(body);
  },
  async post(req, res, body) {
    console.log("ga:post() starting");
    return gat.process(body);
  },
  async put(req, res, body) {
    console.log("ga:put() starting");
    return gat.process(body);
  },
  async delete(req, res, body) {
    console.log("ga:delete() starting");
    return gat.process(body);
  }
};
