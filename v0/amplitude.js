var jsonQ = require('jsonq');
var amplitude = require("./AmplitudeTransform.js");

//Condtional enable/disable of logging
const DEBUG = false;
if (!DEBUG){
    console.log = function (){};
}

module.exports = {

    get: async function(req, res, body) {
        console.log("amplitude:get() starting");

        var requestJson = JSON.parse(body);
        return amplitude.process(jsonQ(requestJson));

    },
    post: async function(req, res, body) {
        console.log("amplitude:post() starting");
        
        var requestJson = JSON.parse(body);
        var result = amplitude.process(jsonQ(requestJson));
        console.log("Result in handler : " +  result);
        return result;
    },
    put: async function(req, res, body) {
        console.log("amplitude:put() starting");

        var requestJson = JSON.parse(body);
        return amplitude.process(jsonQ(requestJson));

    },
    delete: async function(req, res, body) {
        console.log("amplitude:delete() starting");

        var requestJson = JSON.parse(body);
        return amplitude.process(jsonQ(requestJson));
    }
};
