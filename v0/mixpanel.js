var mixpanel = require("./MixpanelTransform.js");

module.exports = {

    get: async function(req, res, body) {
        console.log("mixpanel:get() starting");

        var requestJson = JSON.parse(body);
        return mixpanel.process(requestJson);

    },
    post: async function(req, res, body) {
        console.log("mixpanel:post() starting");
        
        var requestJson = JSON.parse(body);
        return mixpanel.process(requestJson);

    },
    put: async function(req, res, body) {
        console.log("mixpanel:put() starting");

        var requestJson = JSON.parse(body);
        return mixpanel.process(requestJson);

    },
    delete: async function(req, res, body) {
        console.log("mixpanel:delete() starting");

        var requestJson = JSON.parse(body);
        return mixpanel.process(requestJson);

    }
};
