//Implementation of custom filter for Torpedo
//It will take in a batch and then
//a) Emit 1:1 request for each message with "ga" as integration
//b) Emit 1 message for "amplitude" per user_id where the "total_payments" property 
//          value is the sum of all total_payments for that user in that batch
//c) Emit every 5th event for "amplitude"
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const url = require("url");
const jsonQ = require("jsonq");
const amplitudeJS = require("./v0/AmplitudeTransform.js");
require("./util/logUtil");

function start(port){
    if(!port){
        port = 9393;
    }

    if (cluster.isMaster) {
        console.log(`Master ${process.pid} is running`);

    // Fork workers.
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
            
        });
    } else {
        //Main server body
        http.createServer(function (request,response){
            var pathname = url.parse(request.url).pathname;
            
            //Adding logic for a call that will invalidate cache
            //for particular module in order that next require call for
            //that module will reload the same
            if (request.method == 'POST') {
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

                        response.statusCode = 200;
                        var requestJson = JSON.parse(body);
                        var jsonQobj = jsonQ(requestJson);

                        //Iterate through the messages

                        //But first create the message list that will finally hold all messages
                        var messageList = [];

                        //Also create the map structure where total_payments will be
                        // tracked per user
                        var userTotalPayments = new Map();

                        //Also map structures for keeping user-specific
                        //context just for completeness sake. They
                        //do not influence processing in any way
                        var userContext = new Map();
                        
                        //And finally a counter for catching every n-th message
                        var messageCounter = 0;

                        jsonQobj.find("rl_message").each(function (index, path, value){

                            //Extract the rl_anonymous_id for direct inclusion under
                            //rl_message
                            var anonymousId = (jsonQ(value)).find("rl_anonymous_id").value()[0];
                            

                            //Construct single message
                            var messageObj = new Object();

                            //GA message is as-is full payload
                            messageObj['rl_message'] = Object.assign({},value);

                            //Set rl_integrations to only GA
                            //messageObj['rl_message']['rl_integrations'] = 'GA';
                            messageObj['rl_message']['rl_integrations'] = '{"All": false, "GA":true}';

                            //Add rl_anonymous_id
                            messageObj['rl_message']['rl_anonymous_id'] = anonymousId;

                            //Add the GA message
                            messageList.push(messageObj);
                            

                            //Send only non-spin events to Amplitude

                            var eventName = (jsonQ(value)).find("rl_message").find("rl_event").value()[0];
                            
                            if (!(eventName && eventName.match(/spin_result/g))){ //non-spin event
                                //Repeat construction 
                                var messageObjAM = new Object();

                                //Amplitude message is as-is full payload for non-spin message
                                messageObjAM['rl_message'] = Object.assign({},value);

                                //Set rl_integrations to only Amplitude
                                messageObjAM['rl_message']['rl_integrations'] = '{"All": false, "AM":true}';

                                //Add rl_anonymous_id
                                messageObjAM['rl_message']['rl_anonymous_id'] = anonymousId;

                                //Add the AM message
                                messageList.push(messageObjAM);

                            }

                        });    

                        //Construct overall payload
                        var responseObj = {};
                        responseObj['sent_at'] = String(jsonQobj.find("sent_at").value());
                        responseObj['batch'] = messageList;

                        //response.end(JSON.stringify(responseObj));
                        //console.log(JSON.stringify(messageList))
                        response.end(JSON.stringify(messageList));
                        //response.end(body);

                    } catch (se) {
                
                        response.statusCode = 500;	//500 for other errors
                        response.statusMessage = se.message;
                        console.log(se.stack);
                        
                        response.end()	
                    }
                });
            }
        }).listen(port);

        console.log(`Worker ${process.pid} started`);
        
    }

    console.log("aggregatorServer: started");
    
}

start(9393);
