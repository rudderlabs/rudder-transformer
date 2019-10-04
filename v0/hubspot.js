var hubspot = require("./HubSpotTransform.js");

module.exports = {

    get: async function(req, res, body) {
        console.log("hubspot:get() starting");

        var requestJson = JSON.parse(body);
        return hubspot.process(requestJson);

    },
    post: async function(req, res, body) {
        console.log("hubspot:post() starting");

        var requestJson = JSON.parse(body);
        return hubspot.process(requestJson);

    },
    put: async function(req, res, body) {
        console.log("hubspot:put() starting");

        var requestJson = JSON.parse(body);
        return hubspot.process(requestJson);

    },
    delete: async function(req, res, body) {
        console.log("hubspot:delete() starting");

        var requestJson = JSON.parse(body);
        return hubspot.process(requestJson);

    }
};