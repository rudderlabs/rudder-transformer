var jsonQ = require("jsonq");
var amplitude = require("./AmplitudeTransform.js");

module.exports = {
  async get(req, res, body) {
    console.log("amplitude:get() starting");
    return amplitude.process(body);
  },
  async post(req, res, body) {
    console.log("amplitude:post() starting");
    var result = amplitude.process(body);
    console.log("Result in handler : " + result);
    return result;
  },
  async put(req, res, body) {
    console.log("amplitude:put() starting");
    return amplitude.process(body);
  },
  async delete(req, res, body) {
    console.log("amplitude:delete() starting");
    return amplitude.process(body);
  }
};
