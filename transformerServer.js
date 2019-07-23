var http = require("http");
var url = require("url");
var jsonQ = require('jsonq');

function start(port, route) {

    /*    
   function onRequest(request, response) {
       var pathname = url.parse(request.url).pathname;
       console.log("transformerServer:OnRequest() Request for " + pathname + " received.");
       route(pathname, request, response);
   }

   http.createServer(onRequest).listen(port);
   */


   console.log("transformerServer:Start() Server has started.");

   //Main server body
    http.createServer(function (request,response){
        var pathname = url.parse(request.url).pathname;
        
        //Adding logic for a call that will invalidate cache
        //for particular module in order that next require call for
        //that module will reload the same
	    if (request.method == 'POST' && pathname != "/reload") {
            var body = '';
	        var respBody = '';	

            request.on('data', function (data) {
                body += data;

                // Too much POST data, kill the connection!
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6)
                    request.connection.destroy();
            });

            request.on('end', async function () {
                try {	//need to send 400 error for malformed JSON
                    respJson = await route(pathname, request, response, body);
				    var respList = "[" + respJson + "]"; //caller expects list
				    console.log(respList);
				    response.statusCode = 200;
				    response.end(respList);
			    } catch (se) {
					
				    switch(se.constructor.name){
					    case 'RangeError':
						    respose.statusCode = 400; //400 for unexpected value as well
						    response.statusMessage = se.message;
						    break;
					    case 'SyntaxError':
						    console.log(se.message);
						    response.statusCode = 400; //400 for JSON syntax error
						    response.statusMessage = 'Malformed JSON payload ' + se.message;
						    break;
					    default:
						    response.statusCode = 500;	//500 for other errors
						    response.statusMessage = se.message;
						    console.log(se.stack);
				    }
				    response.end()	
			    }
            });
        //logic for module cache invalidation    
        } else if (pathname == "/reload") {
            var query = url.parse(request.url, true).query;
            delete require.cache[require.resolve("./"+query.version+"/"+query.name+".js")];
            response.statusCode=200;
            response.end();
        }
    }).listen(port);
}

exports.start = start;