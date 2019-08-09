var jsonQ = require('jsonq');
var appsflyer = require("./AppsFlyerTransform.js");

//Conditional enable/disable of logging
const DEBUG = true;
if (!DEBUG){
    console.log = function() {};
}

module.exports = {

    get: async function(req, res, body) {
        console.log("appsflyer:get() starting");

        var requestJson = JSON.parse(body);
        return appsflyer.process(jsonQ(requestJson));

    },
    post: async function(req, res, body) {
        console.log("appsflyer:post() starting");
        
        var requestJson = JSON.parse(body);
        return appsflyer.process(jsonQ(requestJson));

    },
    put: async function(req, res, body) {
        console.log("appsflyer:put() starting");

        var requestJson = JSON.parse(body);
        return appsflyer.process(jsonQ(requestJson));

    },
    delete: async function(req, res, body) {
        console.log("appsflyer:delete() starting");

        var requestJson = JSON.parse(body);
        return appsflyer.process(jsonQ(requestJson));

    }
};
