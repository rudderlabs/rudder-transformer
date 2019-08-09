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

//Conditional enable/disable of logging
const DEBUG = false;
if (!DEBUG){
    console.log = function() {};
}

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
                            var messageObj = {};

                            //GA message is as-is full payload
                            messageObj['rl_message'] = value;

                            //Set rl_integrations to only GA
                            //messageObj['rl_message']['rl_integrations'] = 'GA';
                            messageObj['rl_message']['rl_integrations'] = '{"GA":true}';

                            //Add rl_anonymous_id
                            messageObj['rl_message']['rl_anonymous_id'] = anonymousId;

                            //Add the GA message
                            messageList.push(messageObj);

                            //Next proceed to prepare information for the per-user Amplitude event
                            var singleMessageObj = jsonQ(value);


                            //First extract the user_id 
                            var user_id 
                            = String(singleMessageObj.find("rl_user_properties").find("user_id").value());

                            //Also extract the total_payments
                            var total_payments 
                            = parseFloat(String(singleMessageObj.find("rl_properties").find("total_payments").value()));

                            //Check if entry exits for the user in the total_payments map
                            //Add existing value from map to the total_payments extracted
                            //in previous step
                            if (userTotalPayments.has(user_id)) {
                                total_payments += userTotalPayments.get(user_id);
                            } 
                            
                            //Set total_payments against user_id
                            //The first time a message is encountered for the user
                            //the value will get set as-is. For all subsequent occurrences 
                            //within the same batch, value will keep getting added
                            userTotalPayments.set(user_id, total_payments);

                            //The map will be used at the very end once all messages 
                            //have been iterated

                            //Also need keep set rl_context for the user in order to 
                            //populate the same into the combined message for the user 
                            //at the end
                            if (!userContext.has(user_id)){
                                userContext.set(user_id, singleMessageObj.find("rl_context").value()[0]);
                            }    

                            //Now to also send across every fifth message as-is 
                            //to Amplitude
                            messageCounter++;
                            if ((messageCounter % 5) == 0){

                                //Repeat sequence as in the case of GA
                                //for adding message to push list
                                singleMessageObj = value;

                                //Set rl_integrations to only Amplitude
                                //singleMessageObj['rl_integrations'] = 'amplitude';
                                singleMessageObj['rl_integrations'] = '{"AM":true}';
    
                                //Construct single message
                                messageObj = {};
                                messageObj['rl_message'] = singleMessageObj;
                                //Add rl_anonymous_id
                                messageObj['rl_message']['rl_anonymous_id'] = anonymousId;

                                
                                //Add the Amplitude message
                                messageList.push(messageObj);
    
                            }

                        });    

                        //All messages iterated through and message list populated
                        //Time to now construct last set of messages for total_payments
                        userTotalPayments.forEach(function (totalPaymentsForUser, 
                                                            userId, map){

                            //Object to use as input for single, basic message 
                            //construction
                            var basicObj = {};

                            basicObj['rl_context']
                             = userContext.get(userId);

                            basicObj['rl_user_properties'] = {};
                            basicObj['rl_user_properties']['user_id'] = userId;

                            basicObj['rl_properties'] = {};
                            basicObj['rl_properties']['total_payments'] 
                            = totalPaymentsForUser;
                            //basicObj['rl_integrations'] = "amplitude";
                            basicObj['rl_integrations'] = '{"AM":true}';

                            //Everything is track for Amplitude
                            basicObj['rl_type'] = "track";
                            basicObj['rl_event'] = "total_payments_per_user_per_session";

                            
                            var tempMessageObject = {};
                            tempMessageObject['rl_message'] = basicObj;

                            //Add rl_anonymous_id
                            //Temporary if-then to handle changing message structure
                            if (!basicObj['rl_context']['rl_traits']){
                                tempMessageObject['rl_message']['rl_anonymous_id'] 
                                = userId;
                            } else {
                                tempMessageObject['rl_message']['rl_anonymous_id'] 
                                = basicObj['rl_context']['rl_traits']['rl_anonymous_id'];    
                            }

                            //Add to message list
                            messageList.push(tempMessageObject);
                                                                

                        });





                        


                        //Construct overall payload
                        var responseObj = {};
                        responseObj['sent_at'] = String(jsonQobj.find("sent_at").value());
                        responseObj['batch'] = messageList;

                        //response.end(JSON.stringify(responseObj));
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
