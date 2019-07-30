//Conditional enable/disable of logging
const DEBUG = false;
if (!DEBUG){
    console.log = function (){};
}

function route(pathname, req, res, body) {
    console.log("transformerRouter:route() About to route a request for " + pathname);

    try {
        //dynamically load the js file base on the url path
        var handler = require("." + pathname);
        var respToReturn = "Failed to process request";

        console.log("transformerRouter:route() selected handler: " + handler);

        //make sure we got a correct instantiation of the module
        if (typeof handler["post"] === 'function') {
            //route to the right method in the module based on the HTTP action
            if(req.method.toLowerCase() == 'get') {
                respToReturn = handler["get"](req, res, body);
            } else if (req.method.toLowerCase() == 'post') {
                respToReturn = handler["post"](req, res, body);
            } else if (req.method.toLowerCase() == 'put') {
                respToReturn = handler["put"](req, res, body);
            } else if (req.method.toLowerCase() == 'delete') {
                respToReturn = handler["delete"](req, res, body);
            }

            console.log("transformerRouter:route() routed successfully");
            return respToReturn;
        } 
    } catch(err) {
        console.log("transformerRouter:route() exception instantiating handler: " + err.stack);
        throw err;
    }

    var errorMessage = "transformerRoute:route() No request handler found for " + pathname;
    console.log(errorMessage);

    throw new Error(errorMessage);

}

exports.route = route;
