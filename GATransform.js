//Library references
var jsonQ = require('jsonq');
var fs = require('fs');
var http = require('http');
var qs = require('querystring');

//Load and parse configurations for different messages
var pageviewConfigFile = fs.readFileSync('GAPageViewConfig.json');
var pageviewConfigJson = JSON.parse(pageviewConfigFile);

var screenviewConfigFile = fs.readFileSync('GAScreenViewConfig.json');
var screenviewConfigJson = JSON.parse(screenviewConfigFile);

var nonEcomGenericEventConfigFile = fs.readFileSync('GANonEComEventConfig.json');
var nonEcomGenericEventConfigJson = JSON.parse(nonEcomGenericEventConfigFile);

var promotionEventConfigFile = fs.readFileSync('GAPromotionEventConfig.json');
var promotionEventConfigJson = JSON.parse(promotionEventConfigFile);

var paymentRelatedEventConfigFile = fs.readFileSync('GAPaymentRelatedEventConfig.json');
var paymentRelatedEventConfigJson = JSON.parse(paymentRelatedEventConfigFile);

var refundEventConfigFile = fs.readFileSync('GARefundEventConfig.json');
var refundEventConfigJson = JSON.parse(refundEventConfigFile);

//Single configuration file for all product list related events
var productListEventConfigFile = fs.readFileSync('GAProductListEventConfig.json');
var productListEventConfigJson = JSON.parse(productListEventConfigFile);

var transactionEventConfigFile = fs.readFileSync('GATransactionEventConfig.json');
var transactionEventConfigJson = JSON.parse(transactionEventConfigFile);

//Use single config file for both Product Click and View events since directly mapped
//attributes remain the same
var productEventConfigFile = fs.readFileSync('GAProductEventConfig.json');
var productEventConfigJson = JSON.parse(productEventConfigFile);

//Similarly single sharing event config
var sharingEventConfigFile = fs.readFileSync("GASharingEventConfig.json");
var sharingEventConfigJson = JSON.parse(sharingEventConfigFile);

//Config file for generic e-commerce events
var ecomGenericEventConfigFile = fs.readFileSync("GAEComGenericEventConfig.json");
var ecomGenericEventConfigJson = JSON.parse(ecomGenericEventConfigFile);

//Load customer credentials
var customerCredentialsConfig = fs.readFileSync('GACustomerCredentialsConfig.json');
var customerCredentialsConfigJson = JSON.parse(customerCredentialsConfig);

//Helper function for generating desired JSON from Map
const mapToObj = m => {
	return Array.from(m).reduce((obj, [key, value]) => {
	  obj[key] = value;
	  return obj;
	}, {});
  };

//Basic response builder
//We pass the responseMap with any processing-specific key-value prepopulated
//We also pass the incoming payload, the hit type to be generated and
//the field mapping and credentials JSONs
function responseBuilderSimple (responseMap, jsonQobj, hitType, mappingJson, credsJson){

	//We'll keep building a simple key-value JSON structure which will be finally returned
	//We add the static parts as well as the direct mappings from config JSON	
	responseMap.set("endpoint","https://www.google-analytics.com/collect");
	responseMap.set("request-format","PARAMS");
	responseMap.set("v","1");
	responseMap.set("t",String(hitType));

	//Add the customer 	credentials
	jsonQ.each(credsJson, function(key,value){
		responseMap.set("tid",String(value));
	});
	var loopCounter = 1;
	//Iterate through each key mapping of pageview type messges
	//the source keys are provided in the format a.b.c.d which means
	//structure a contains structure b contains structure c contains
	//element d. So the path is reconstructed by spltting the source key by dot
	jsonQ.each(mappingJson, function(sourceKey, destinationKey){
		//The structure for page messages is the root, so we have to reset the reference
		//point before traversing for every key
		var tempObj = jsonQobj.find('rl_message');

		//console.log(tempObj.length)

		var pathElements = sourceKey.split('.');
		//console.log(loopCounter++);

		//Now take each path element and traverse the structure
		for (var i=0; i<pathElements.length; i++) {
			//console.log(pathElements[i]);
			tempObj = tempObj.find(pathElements[i]);	
		}

		//Once the entry for the source key has been found, the value needs to be mapped 
		//to the destination key
				
		tempObj.each(function (index, path, value){
			//Add the derived key-value pair to the response JSON
			responseMap.set(String(destinationKey),String(value));
		});
		
	});

	//Convert map to JSON
	var responseJson = JSON.stringify(mapToObj(responseMap));
	var events = []
	events.push(responseJson);
	return events;
}


//We want all event types to be processed in parallel in order to maximize performance. 
//So we leverage JavaSript Promises for this
//Function for processing pageviews
function processPageviews(jsonQobj) {
	return new Promise((resolve)=>{
		resolve(responseBuilderSimple(new Map(), jsonQobj, 'pageview', pageviewConfigJson, customerCredentialsConfigJson));
	});
}

//Function for processing screenviews
function processScreenviews(jsonQobj) {
	return new Promise((resolve)=>{
		resolve(responseBuilderSimple(new Map(),jsonQobj,'screenview', screenviewConfigJson, customerCredentialsConfigJson));
	});
}

//Function for processing non-ecom generic track events
function processNonEComGenericEvent(jsonQobj){
	return new Promise((resolve)=>{
		resolve(responseBuilderSimple(new Map(),jsonQobj,'event',nonEcomGenericEventConfigJson, customerCredentialsConfigJson));
	});
}

//Function for processing promotion viewed or clicked event
function processPromotionEvent(jsonQobj){
	return new Promise((resolve)=>{
		var responseMap = new Map();
		var eventString = String(jsonQobj.find('rl_message').find('rl_event').value());
		switch(eventString.toLowerCase()){
			case 'promotion viewed':
				responseMap.set("promoa","view"); //pre-populate
				break;
			case 'promotion clicked':
				responseMap.set("promoa","promo_click");
				break;
		}
		
		//Future releases will have additional logic for below elements allowing for
		//customer-side overriding of event category and event action values
		responseMap.set("ec",eventString);
		responseMap.set("ea",eventString);

		resolve(responseBuilderSimple(responseMap,jsonQobj,'event',promotionEventConfigJson, customerCredentialsConfigJson));
	});
}


//Function for processing payment-related events
function processPaymentRelatedEvent(jsonQobj){
	return new Promise((resolve)=>{
		var responseMap = new Map();
		responseMap.set("pa","checkout"); //pre-populate
		resolve(responseBuilderSimple(responseMap,jsonQobj,'transaction',paymentRelatedEventConfigJson, customerCredentialsConfigJson));
	});
}

//Function for processing order refund events
function processRefundEvent(jsonQobj){
	return new Promise((resolve)=>{
		var responseMap = new Map();
		responseMap.set("pa","refund"); //pre-populate

		//First we need to check whether we're dealing with full refund or partial refund
		//In case of partial refund, product array will be present in payload
		var productArray = jsonQobj.find("rl_properties").find("products").find("product_id").parent();	
		if (productArray.length > 0){ //partial refund
			//console.log(productArray.length);
			//Now iterate through the products and add parameters accordingly
			var prodIndex = 1; 
			productArray.each(function(index, path, value){
				//If product_id is not provided, then SKU will be used in place of id
				if (!value.product_id || 0 === value.product_id.length){
					responseMap.set("pr"+prodIndex+"id",value.sku);
				} else {
					responseMap.set("pr"+prodIndex+"id",value.product_id);
				}
				
				responseMap.set("pr"+prodIndex+"nm",value.name);
				responseMap.set("pr"+prodIndex+"ca",value.category);
				responseMap.set("pr"+prodIndex+"br",value.brand);
				responseMap.set("pr"+prodIndex+"va",value.variant);
				responseMap.set("pr"+prodIndex+"cc",value.coupon);
				responseMap.set("pr"+prodIndex+"ps",value.position);
				responseMap.set("pr"+prodIndex+"pr",value.price);
				responseMap.set("pr"+prodIndex+"qt",value.quantity);
				prodIndex++;
			});
		} else { //full refund, only populate order_id
			responseMap.set("ti",String(jsonQobj.find("order_id").value()));
		} 
		//Finally fill up with mandatory and directly mapped fields
		resolve(responseBuilderSimple(responseMap,jsonQobj,'transaction',refundEventConfigJson, customerCredentialsConfigJson));
	});
}

//Function for processing product and cart shared events
function processSharingEvent(jsonQobj){
	return new Promise((resolve)=>{
		var responseMap = new Map();
		//URL will be there for Product Shared event, hence that can be used as share target
		//For Cart Shared, the list of product ids can be shared
		var eventTypeString = String(jsonQobj.find("rl_event").value());
		switch (eventTypeString.toLowerCase()){
			case "product shared":
				responseMap.set("st",String(jsonQobj.find("rl_properties").find("url").value()));
				break;
			case "cart shared":
				var productIdArray = jsonQobj.find("rl_properties").find("products").find("product_id").parent();
				var shareTargetString = ""; //all product ids will be concatenated with separation
				productIdArray.each(function (path, index, value){
					shareTargetString += " " + value.product_id;
				});	
				responseMap.set("st",shareTargetString);
				break;
			default:
				responseMap.set("st","empty");	
		}
		resolve(responseBuilderSimple(responseMap,jsonQobj,'social',sharingEventConfigJson, customerCredentialsConfigJson));
	});
}

//Function for processing product list view event
function processProductListEvent(jsonQobj){
	return new Promise((resolve)=>{
		var eventString = String(jsonQobj.find('rl_message').find('rl_event').value());
		var responseMap = new Map();
		//Future releases will have additional logic for below elements allowing for
		//customer-side overriding of event category and event action values
		responseMap.set("ec",eventString);
		responseMap.set("ea",eventString);

		//Set action depending on Product List Action
		switch(eventString.toLowerCase()){
			case 'product list viewed':
			case 'product list filtered':
				responseMap.set("pa","detail");
				break;
			case 'product list clicked':
				responseMap.set("pa","click");
				break;
		}


		var productArray = jsonQobj.find("rl_properties").find("products").find("product_id").parent();	
		if (productArray.length > 0){ 
			//console.log(productArray.length);
			//Now iterate through the products and add parameters accordingly
			var prodIndex = 1; 
			productArray.each(function(index, path, value){
				//If product_id is not provided, then SKU will be used in place of id
				if (!value.product_id || 0 === value.product_id.length){
					responseMap.set("il1pi"+prodIndex+"id",value.sku);
				} else {
					responseMap.set("il1pi"+prodIndex+"id",value.product_id);
				}
				responseMap.set("il1pi"+prodIndex+"nm",value.name);
				responseMap.set("il1pi"+prodIndex+"ca",value.category);
				responseMap.set("il1pi"+prodIndex+"br",value.brand);
				responseMap.set("il1pi"+prodIndex+"va",value.variant);
				responseMap.set("il1pi"+prodIndex+"cc",value.coupon);
				responseMap.set("il1pi"+prodIndex+"ps",value.position);
				responseMap.set("il1pi"+prodIndex+"pr",value.price);
				prodIndex++;
			});
		} else { //throw error, empty Product List in Product List Viewed event payload
			throw new Error("Empty Product List provided for Product List Viewed Event");
		} 
		resolve(responseBuilderSimple(responseMap,jsonQobj,'event',productListEventConfigJson, customerCredentialsConfigJson));
	});
}

//Function for processing product viewed or clicked events
function processProductEvent(jsonQobj){
	return new Promise((resolve)=>{
		var eventString = String(jsonQobj.find('rl_message').find('rl_event').value());
		var responseMap = new Map();
		//Future releases will have additional logic for below elements allowing for
		//customer-side overriding of event category and event action values
		responseMap.set("ec",eventString);
		responseMap.set("ea",eventString);

		//Set product action to click or detail depending on event
		switch(eventString.toLowerCase()){
			case 'product clicked':
				//Set product action to click
				responseMap.set("pa","click");
				break;
			case 'product viewed':
				responseMap.set("pa","detail");
				break;
			case 'product added':
			case 'wishlist product added to cart':	
			case 'product added to wishlist':
				responseMap.set("pa","add");
				break;
			case 'product removed':
			case 'product removed from wishlist':	
				responseMap.set("pa","remove");
				break;		
		}
		
		var productId = String(jsonQobj.find("rl_properties").find("product_id").value());
		var sku = String(jsonQobj.find("rl_properties").find("sku").value());

		//If product_id not present, use sku
		if (!productId || 0 === productId.length){
			responseMap.set("pr1id",sku);
		} else {
			responseMap.set("pr1id",productId);
		}
		resolve(responseBuilderSimple(responseMap,jsonQobj,'event',productEventConfigJson, customerCredentialsConfigJson));
	});
}

//Function for processing transaction event
function processTransactionEvent(jsonQobj){
	return new Promise((resolve)=>{
		var eventString = String(jsonQobj.find('rl_message').find('rl_event').value());
		var responseMap = new Map();
		
		//Set product action as per event
		switch(eventString.toLowerCase()){
			case 'checkout started':
			case 'order updated':
				responseMap.set("pa","checkout");
				break;
			case 'order completed':
				responseMap.set("pa","purchase");
				break;
			case 'order cancelled':
				responseMap.set("pa","refund");
				break;		
		}
		
		//One of total/revenue/value should be there
		var revenueString = String(jsonQobj.find("rl_properties").find("revenue").value());
		var valueString = String(jsonQobj.find("rl_properties").find("value").value());
		var totalString = String(jsonQobj.find("rl_properties").find("total").value());

		if (!revenueString || 0 === revenueString.length) { //revenue field is null or empty, cannot be used
			if (!valueString || 0 === valueString.length) { //value field is null or empty, cannot be used
				if (!(!totalString || 0 === totalString.length)) { //last option - total field
					responseMap.set("tr", totalString);
				}
			} else {
				responseMap.set("tr", valueString); //value field is populated, usable
			}
		} else {
			responseMap.set("tr",revenueString); //revenue field is populated, usable
		}
		var productArray = jsonQobj.find("rl_properties").find("products").find("product_id").parent();	
		if (productArray.length > 0){ 
			//console.log(productArray.length);
			//Now iterate through the products and add parameters accordingly
			var prodIndex = 1; 
			productArray.each(function(index, path, value){
				//If product_id is not provided, then SKU will be used in place of id
				if (!value.product_id || 0 === value.product_id.length){
					responseMap.set("pr"+prodIndex+"id",value.sku);
				} else {
					responseMap.set("pr"+prodIndex+"id",value.product_id);
				}
				responseMap.set("pr"+prodIndex+"nm",value.name);
				responseMap.set("pr"+prodIndex+"ca",value.category);
				responseMap.set("pr"+prodIndex+"br",value.brand);
				responseMap.set("pr"+prodIndex+"va",value.variant);
				responseMap.set("pr"+prodIndex+"cc",value.coupon);
				responseMap.set("pr"+prodIndex+"ps",value.position);
				responseMap.set("pr"+prodIndex+"pr",value.price);
				prodIndex++;
			});
		} else { //throw error, empty Product List in Product List Viewed event payload
			throw new Error("No product information supplied for transaction event");
		} 
		resolve(responseBuilderSimple(responseMap,jsonQobj,'transaction',transactionEventConfigJson, customerCredentialsConfigJson));
	});
}

//Function for handling generic e-commerce events
function processEComGenericEvent(jsonQobj){
	return new Promise((resolve)=>{
		var eventString = String(jsonQobj.find('rl_message').find('rl_event').value());
		var responseMap = new Map();
		//Future releases will have additional logic for below elements allowing for
		//customer-side overriding of event category and event action values
		responseMap.set("ec",eventString);
		responseMap.set("ea",eventString);
				
		resolve(responseBuilderSimple(responseMap,jsonQobj,'event',ecomGenericEventConfigJson, customerCredentialsConfigJson));
	});
}

//Generic process function which invokes specific handler functions depending on message type
//and event type where applicable
async function process(jsonQobj){

	//Route to appropriate process depending on type of message received
	var messageType = String(jsonQobj.find("rl_message").find('rl_type').value()).toLowerCase();
	console.log(String(messageType));
	switch (messageType){
		case 'page':
			//console.log('processing page');
			return await processPageviews(jsonQobj);
		case 'screen':
			//console.log('processing screen');
			return await processScreenviews(jsonQobj);
		case 'track':
			var eventType = String(jsonQobj.find('rl_message').find('rl_event').value()).toLowerCase();
			console.log(eventType);	
			//There can be both ECommerce as well as Non-ECommerce 'track' events
			//Need to handle individually
			switch (eventType){
				case 'product list viewed':
				case 'product list filtered':	
				case 'product list clicked':
					return await processProductListEvent(jsonQobj);
					break;
				case 'promotion viewed':
				case 'promotion clicked':
					return await processPromotionEvent(jsonQobj);
					break;
				case 'product clicked':
				case 'product viewed':
				case 'product added':
				case 'wishlist product added to cart':	
				case 'product removed':
				case 'product removed from wishlist':
				case 'product added to wishlist':	
					return await processProductEvent(jsonQobj);
					break;
				case 'checkout started':
				case 'order updated':
				case 'order completed':	
				case 'order cancelled':
					return await processTransactionEvent(jsonQobj);
					break;
				case 'checkout step viewed':
				case 'checkout step completed':
				case 'payment info entered':
					return await processPaymentRelatedEvent(jsonQobj);
					break;
				case 'order refunded':
					return await processRefundEvent(jsonQobj);
					break;
				case 'product shared':
				case 'cart shared':	
					return await processSharingEvent(jsonQobj);
					break;
				case 'cart viewed':
				case 'coupon entered':
				case 'coupon applied':
				case 'coupon denied':
				case 'coupon removed':
				case 'product reviewed':
					return await processEComGenericEvent(jsonQobj);	
					break;
				default:
					return await processNonEComGenericEvent(jsonQobj);		
			}
		default:
			console.log('could not determine type');
			throw new RangeError('Unexpected value in type field');
	}

}

//Main server body
http.createServer(function (req,res){
	if (req.method == 'POST') {
        var body = '';
	var respBody = '';	

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        req.on('end', async function () {
			try {	//need to send 400 error for malformed JSON
				var requestJson = JSON.parse(body);
				//console.log("Input JSON parsed successfully");
				respJson = await process(jsonQ(requestJson));
				var respList = "[" + respJson + "]"; //caller expects list
				console.log(respList);
				res.statusCode = 200;
				res.end(respList);
			} catch (se) {
					
				switch(se.constructor.name){
					case 'RangeError':
						res.statusCode = 400; //400 for unexpected value as well
						res.statusMessage = se.message;
						break;
					case 'SyntaxError':
						console.log(se.message);
						res.statusCode = 400; //400 for JSON syntax error
						res.statusMessage = 'Malformed JSON payload ' + se.message;
						break;
					default:
						res.statusCode = 500;	//500 for other errors
						res.statusMessage = se.message;
						console.log(se.stack);
				}
				res.end()	
			}
		});
    }
}).listen(9090);
