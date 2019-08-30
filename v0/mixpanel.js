var jsonQ = require('jsonq');
var mixpanel = require("./MixpanelTransform.js");

module.exports = {

    get: async function(req, res, body) {
        console.log("mixpanel:get() starting");

        var requestJson = JSON.parse(body);
        return mixpanel.process(jsonQ(requestJson));

    },
    post: async function(req, res, body) {
        console.log("mixpanel:post() starting");
        
        var requestJson = JSON.parse(body);
        return mixpanel.process(jsonQ(requestJson));

    },
    put: async function(req, res, body) {
        console.log("mixpanel:put() starting");

        var requestJson = JSON.parse(body);
        return mixpanel.process(jsonQ(requestJson));

    },
    delete: async function(req, res, body) {
        console.log("mixpanel:delete() starting");

        var requestJson = JSON.parse(body);
        return mixpanel.process(jsonQ(requestJson));

    }
};
