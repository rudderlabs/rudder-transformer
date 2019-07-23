var jsonQ = require('jsonq');
var amplitude = require("./AmplitudeTransform.js");

module.exports = {

    get: async function(req, res, body) {
        console.log("amplitude:get() starting");

        var requestJson = JSON.parse(body);
        return await amplitude.process(jsonQ(requestJson));

    },
    post: async function(req, res, body) {
        console.log("amplitude:post() starting");
        
        var requestJson = JSON.parse(body);
        return await amplitude.process(jsonQ(requestJson));

    },
    put: async function(req, res, body) {
        console.log("amplitude:put() starting");

        var requestJson = JSON.parse(body);
        return await amplitude.process(jsonQ(requestJson));

    },
    delete: async function(req, res, body) {
        console.log("amplitude:delete() starting");

        var requestJson = JSON.parse(body);
        return await amplitude.process(jsonQ(requestJson));

    }
};
