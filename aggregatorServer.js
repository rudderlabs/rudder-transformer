//Aggregator server for demo
//Sums up at quantity and price field levels for events sent and pushes out
//This is not the actual transformer server
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const url = require("url");
const jsonQ = require("jsonq");
const amplitudeJS = require("./v0/AmplitudeTransform.js");

function start(port){
    if(!port){
        port = 9191;
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

                        //Iterate through the messages, emit a new message which
                        //has quantity and price fields as the sum of field values
                        //from individual messages received in this request

                        var totalQuantity = 0;
                        var totalPrice = 0;

                        jsonQobj.find("rl_properties").each(function (index, path, value){
                            totalQuantity += parseInt(String(value.quantity),10);
                            totalPrice += parseFloat(String(value.price));
                        });    

                        //Construct single object
                        var basicObj = amplitudeJS.createSingleMessageBasicStructure(jsonQobj);

                        //Add the aggregated quanity and price to the single object
                        basicObj['rl_properties'] = {}
                        basicObj['rl_properties']['quantity'] = String(totalQuantity);
                        basicObj['rl_properties']['price'] = String(totalPrice);
                        basicObj['rl_integrations'] = jsonQobj.find("rl_integrations").value()[0];

                        //Construct single message
                        var messageObj = {};
                        messageObj['rl_message'] = basicObj;

                        //Construct message list and push the message to the same
                        var messageList = [];
                        messageList.push(messageObj);


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
    console.log("aggregatorServer: started")
}

start(9292);