var jsonQ = require('jsonq');
var gat = require("./GATransform.js");

module.exports = {

    get: async function(req, res, body) {
        console.log("ga:get() starting");

        var requestJson = JSON.parse(body);
        return gat.process(jsonQ(requestJson));

    },
    post: async function(req, res, body) {
        console.log("ga:post() starting");
        
        var requestJson = JSON.parse(body);
        return gat.process(jsonQ(requestJson));

    },
    put: async function(req, res, body) {
        console.log("ga:put() starting");

        var requestJson = JSON.parse(body);
        return gat.process(jsonQ(requestJson));

    },
    delete: async function(req, res, body) {
        console.log("ga:delete() starting");

        var requestJson = JSON.parse(body);
        return gat.process(jsonQ(requestJson));

    }
};
