var fb_app = require("./Fb_appTransformation.js");

module.exports = {

    get: async function(req, res, body) {
        console.log("ga:get() starting");

        var requestJson = JSON.parse(body);
        return fb_app.process(requestJson);

    },
    post: async function(req, res, body) {
        console.log("ga:post() starting");
        
        var requestJson = JSON.parse(body);
        return fb_app.process(requestJson);

    },
    put: async function(req, res, body) {
        console.log("ga:put() starting");

        var requestJson = JSON.parse(body);
        return fb_app.process(requestJson);

    },
    delete: async function(req, res, body) {
        console.log("ga:delete() starting");

        var requestJson = JSON.parse(body);
        return fb_app.process(requestJson);

    }
};