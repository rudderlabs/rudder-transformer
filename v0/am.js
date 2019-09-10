var jsonQ = require("jsonq");
var amplitude = require("./AmplitudeTransform.js");

module.exports = {
  async get(req, res, body) {
    console.log("amplitude:get() starting");

    var requestJson = JSON.parse(body);
    return amplitude.process(jsonQ(requestJson));
  },
  async post(req, res, body) {
    console.log("amplitude:post() starting");

    var requestJson = JSON.parse(body);
    var result = amplitude.process(jsonQ(requestJson));
    console.log("Result in handler : " + result);
    return result;
  },
  async put(req, res, body) {
    console.log("amplitude:put() starting");

    var requestJson = JSON.parse(body);
    return amplitude.process(jsonQ(requestJson));
  },
  async delete(req, res, body) {
    console.log("amplitude:delete() starting");

    var requestJson = JSON.parse(body);
    return amplitude.process(jsonQ(requestJson));
  }
};
