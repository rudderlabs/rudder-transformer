var jsonQ = require("jsonq");
var gat = require("./GATransform.js");

module.exports = {
  async get(req, res, body) {
    console.log("ga:get() starting");

    var requestJson = JSON.parse(body);
    return gat.process(jsonQ(requestJson));
  },
  async post(req, res, body) {
    console.log("ga:post() starting");

    var requestJson = JSON.parse(body);
    return gat.process(jsonQ(requestJson));
  },
  async put(req, res, body) {
    console.log("ga:put() starting");

    var requestJson = JSON.parse(body);
    return gat.process(jsonQ(requestJson));
  },
  async delete(req, res, body) {
    console.log("ga:delete() starting");

    var requestJson = JSON.parse(body);
    return gat.process(jsonQ(requestJson));
  }
};
