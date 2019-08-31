//Library references
var jsonQ = require('jsonq');
var fs = require('fs');
var http = require('http');
var qs = require('querystring');


//Load and parse configurations for different messages
var pageviewConfigFile = fs.readFileSync('data/GAPageViewConfig.json');
var pageviewConfigJson = JSON.parse(pageviewConfigFile);

var screenviewConfigFile = fs.readFileSync('data/GAScreenViewConfig.json');
var screenviewConfigJson = JSON.parse(screenviewConfigFile);

var nonEcomGenericEventConfigFile = fs.readFileSync('data/GANonEComEventConfig.json');
var nonEcomGenericEventConfigJson = JSON.parse(nonEcomGenericEventConfigFile);

var promotionEventConfigFile = fs.readFileSync('data/GAPromotionEventConfig.json');
var promotionEventConfigJson = JSON.parse(promotionEventConfigFile);

var paymentRelatedEventConfigFile = fs.readFileSync('data/GAPaymentRelatedEventConfig.json');
var paymentRelatedEventConfigJson = JSON.parse(paymentRelatedEventConfigFile);

var refundEventConfigFile = fs.readFileSync('data/GARefundEventConfig.json');
var refundEventConfigJson = JSON.parse(refundEventConfigFile);

//Single configuration file for all product list related events
var productListEventConfigFile = fs.readFileSync('data/GAProductListEventConfig.json');
var productListEventConfigJson = JSON.parse(productListEventConfigFile);

var transactionEventConfigFile = fs.readFileSync('data/GATransactionEventConfig.json');
var transactionEventConfigJson = JSON.parse(transactionEventConfigFile);

//Use single config file for both Product Click and View events since directly mapped
//attributes remain the same
var productEventConfigFile = fs.readFileSync('data/GAProductEventConfig.json');
var productEventConfigJson = JSON.parse(productEventConfigFile);

//Similarly single sharing event config
var sharingEventConfigFile = fs.readFileSync("data/GASharingEventConfig.json");
var sharingEventConfigJson = JSON.parse(sharingEventConfigFile);

//Config file for generic e-commerce events
var ecomGenericEventConfigFile = fs.readFileSync("data/GAEComGenericEventConfig.json");
var ecomGenericEventConfigJson = JSON.parse(ecomGenericEventConfigFile);

//Load customer credentials
var customerCredentialsConfig = fs.readFileSync('data/GACustomerCredentialsConfig.json');
var customerCredentialsConfigJson = JSON.parse(customerCredentialsConfig);

//Helper function for generating desired JSON from Map
const mapToObj = m => {
	return Array.from(m).reduce((obj, [key, value]) => {
	  obj[key] = value;
	  return obj;
	}, {});
  };

//Basic response builder
//We pass the parameterMap with any processing-specific key-value prepopulated
//We also pass the incoming payload, the hit type to be generated and
//the field mapping and credentials JSONs
function responseBuilderSimple (parameterMap, jsonQobj, hitType, mappingJson, credsJson){

	//We'll keep building a simple key-value JSON structure which will be finally returned
	//We add the static parts as well as the direct mappings from config JSON
	//There will be three keys - endpoint, request-format and payload
	//The payload will be another JSON containing the key-value pairs to be sent
	//finally as query parameters
	
	//Create a final map to be used for response and populate the static parts first
	var responseMap = new Map();	
	responseMap.set("endpoint","https://www.google-analytics.com/collect");
	//responseMap.set("request-format","PARAMS");

	var requestConfigMap = new Map();
    requestConfigMap.set("request-format","PARAMS");
	requestConfigMap.set("request_method","GET");
	
	responseMap.set("request_config", mapToObj(requestConfigMap));

    responseMap.set("header",{});

	//Need to set user_id outside of payload
	jsonQobj.find('rl_anonymous_id').each(function (index, path, value){
		responseMap.set("user_id",String(value));
	});
	
	//Now add static parameters to the parameter map
	parameterMap.set("v","1");
	parameterMap.set("t",String(hitType));

	jsonQobj.find("rl_destination").each((i, p, value) => {
		console.log("destination: ", value)
		console.log("tid: ", String(value.config.trackingID))
		parameterMap.set("tid", String(value.config.trackingID));
	  });
	  //   Add the customer credentials
	  //   jsonQ.each(credsJson, function(key, value) {
	  //     parameterMap.set('tid', String(value));
	  //   });

	var loopCounter = 1;
	//Iterate through each key mapping of pageview type messges
	//the source keys are provided in the format a.b.c.d which means
	//structure a contains structure b contains structure c contains
	//element d. So the path is reconstructed by spltting the source key by dot
	jsonQ.each(mappingJson, function(sourceKey, destinationKey){
		//The structure for page messages is the root, so we have to reset the reference
		//point before traversing for every key
		var tempObj = jsonQobj.find('rl_context').parent();

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
			parameterMap.set(String(destinationKey),String(value));
		});
		
	});

	//Assign parameter map against payload key
	responseMap.set("payload",mapToObj(parameterMap));

	//Convert response map to JSON
	var responseJson = JSON.stringify(mapToObj(responseMap));

	var events = []
	events.push(responseJson);
	return events;
}

//Function for processing pageviews
function processPageviews(jsonQobj) {
	return responseBuilderSimple(new Map(), jsonQobj, 'pageview', pageviewConfigJson, customerCredentialsConfigJson);
}

//Function for processing screenviews
function processScreenviews(jsonQobj) {
	return responseBuilderSimple(new Map(),jsonQobj,'screenview', screenviewConfigJson, customerCredentialsConfigJson);
}

//Function for processing non-ecom generic track events
function processNonEComGenericEvent(jsonQobj){
	return	responseBuilderSimple(new Map(),jsonQobj,'event',nonEcomGenericEventConfigJson, customerCredentialsConfigJson);
}

//Function for processing promotion viewed or clicked event
function processPromotionEvent(jsonQobj){
	var parameterMap = new Map();
	var eventString = String(jsonQobj.find('rl_event').value());
	switch(eventString.toLowerCase()){
		case 'promotion viewed':
			parameterMap.set("promoa","view"); //pre-populate
			break;
		case 'promotion clicked':
			parameterMap.set("promoa","promo_click");
			break;
	}
	
	//Future releases will have additional logic for below elements allowing for
	//customer-side overriding of event category and event action values
	parameterMap.set("ec",eventString);
	parameterMap.set("ea",eventString);

	return responseBuilderSimple(parameterMap,jsonQobj,'event',promotionEventConfigJson, customerCredentialsConfigJson);
}


//Function for processing payment-related events
function processPaymentRelatedEvent(jsonQobj){
	var parameterMap = new Map();
	parameterMap.set("pa","checkout"); //pre-populate
	return responseBuilderSimple(parameterMap,jsonQobj,'transaction',paymentRelatedEventConfigJson, customerCredentialsConfigJson);
}

//Function for processing order refund events
function processRefundEvent(jsonQobj){
	var parameterMap = new Map();
	parameterMap.set("pa","refund"); //pre-populate

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
				parameterMap.set("pr"+prodIndex+"id",value.sku);
			} else {
				parameterMap.set("pr"+prodIndex+"id",value.product_id);
			}
			
			parameterMap.set("pr"+prodIndex+"nm",value.name);
			parameterMap.set("pr"+prodIndex+"ca",value.category);
			parameterMap.set("pr"+prodIndex+"br",value.brand);
			parameterMap.set("pr"+prodIndex+"va",value.variant);
			parameterMap.set("pr"+prodIndex+"cc",value.coupon);
			parameterMap.set("pr"+prodIndex+"ps",value.position);
			parameterMap.set("pr"+prodIndex+"pr",value.price);
			parameterMap.set("pr"+prodIndex+"qt",value.quantity);
			prodIndex++;
		});
	} else { //full refund, only populate order_id
		parameterMap.set("ti",String(jsonQobj.find("order_id").value()));
	} 
	//Finally fill up with mandatory and directly mapped fields
	 return responseBuilderSimple(parameterMap,jsonQobj,'transaction',refundEventConfigJson, customerCredentialsConfigJson);
}

//Function for processing product and cart shared events
function processSharingEvent(jsonQobj){
	var parameterMap = new Map();
	//URL will be there for Product Shared event, hence that can be used as share target
	//For Cart Shared, the list of product ids can be shared
	var eventTypeString = String(jsonQobj.find("rl_event").value());
	switch (eventTypeString.toLowerCase()){
		case "product shared":
			parameterMap.set("st",String(jsonQobj.find("rl_properties").find("url").value()));
			break;
		case "cart shared":
			var productIdArray = jsonQobj.find("rl_properties").find("products").find("product_id").parent();
			var shareTargetString = ""; //all product ids will be concatenated with separation
			productIdArray.each(function (path, index, value){
				shareTargetString += " " + value.product_id;
			});	
			parameterMap.set("st",shareTargetString);
			break;
		default:
			parameterMap.set("st","empty");	
	}
	return responseBuilderSimple(parameterMap,jsonQobj,'social',sharingEventConfigJson, customerCredentialsConfigJson);
}

//Function for processing product list view event
function processProductListEvent(jsonQobj){
	var eventString = String(jsonQobj.find('rl_event').value());
	var parameterMap = new Map();
	//Future releases will have additional logic for below elements allowing for
	//customer-side overriding of event category and event action values
	parameterMap.set("ec",eventString);
	parameterMap.set("ea",eventString);

	//Set action depending on Product List Action
	switch(eventString.toLowerCase()){
		case 'product list viewed':
		case 'product list filtered':
			parameterMap.set("pa","detail");
			break;
		case 'product list clicked':
			parameterMap.set("pa","click");
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
				parameterMap.set("il1pi"+prodIndex+"id",value.sku);
			} else {
				parameterMap.set("il1pi"+prodIndex+"id",value.product_id);
			}
			parameterMap.set("il1pi"+prodIndex+"nm",value.name);
			parameterMap.set("il1pi"+prodIndex+"ca",value.category);
			parameterMap.set("il1pi"+prodIndex+"br",value.brand);
			parameterMap.set("il1pi"+prodIndex+"va",value.variant);
			parameterMap.set("il1pi"+prodIndex+"cc",value.coupon);
			parameterMap.set("il1pi"+prodIndex+"ps",value.position);
			parameterMap.set("il1pi"+prodIndex+"pr",value.price);
			prodIndex++;
		});
	} else { //throw error, empty Product List in Product List Viewed event payload
		throw new Error("Empty Product List provided for Product List Viewed Event");
	} 
	return responseBuilderSimple(parameterMap,jsonQobj,'event',productListEventConfigJson, customerCredentialsConfigJson);
}

//Function for processing product viewed or clicked events
function processProductEvent(jsonQobj){
	var eventString = String(jsonQobj.find('rl_event').value());
	var parameterMap = new Map();
	//Future releases will have additional logic for below elements allowing for
	//customer-side overriding of event category and event action values
	parameterMap.set("ec",eventString);
	parameterMap.set("ea",eventString);

	//Set product action to click or detail depending on event
	switch(eventString.toLowerCase()){
		case 'product clicked':
			//Set product action to click
			parameterMap.set("pa","click");
			break;
		case 'product viewed':
			parameterMap.set("pa","detail");
			break;
		case 'product added':
		case 'wishlist product added to cart':	
		case 'product added to wishlist':
			parameterMap.set("pa","add");
			break;
		case 'product removed':
		case 'product removed from wishlist':	
			parameterMap.set("pa","remove");
			break;		
	}
	
	var productId = String(jsonQobj.find("rl_properties").find("product_id").value());
	var sku = String(jsonQobj.find("rl_properties").find("sku").value());

	//If product_id not present, use sku
	if (!productId || 0 === productId.length){
		parameterMap.set("pr1id",sku);
	} else {
		parameterMap.set("pr1id",productId);
	}
	 return responseBuilderSimple(parameterMap,jsonQobj,'event',productEventConfigJson, customerCredentialsConfigJson);
}

//Function for processing transaction event
function processTransactionEvent(jsonQobj){
	var eventString = String(jsonQobj.find('rl_event').value());
	var parameterMap = new Map();
	
	//Set product action as per event
	switch(eventString.toLowerCase()){
		case 'checkout started':
		case 'order updated':
			parameterMap.set("pa","checkout");
			break;
		case 'order completed':
			parameterMap.set("pa","purchase");
			break;
		case 'order cancelled':
			parameterMap.set("pa","refund");
			break;		
	}
	
	//One of total/revenue/value should be there
	var revenueString = String(jsonQobj.find("rl_properties").find("revenue").value());
	var valueString = String(jsonQobj.find("rl_properties").find("value").value());
	var totalString = String(jsonQobj.find("rl_properties").find("total").value());

	if (!revenueString || 0 === revenueString.length) { //revenue field is null or empty, cannot be used
		if (!valueString || 0 === valueString.length) { //value field is null or empty, cannot be used
			if (!(!totalString || 0 === totalString.length)) { //last option - total field
				parameterMap.set("tr", totalString);
			}
		} else {
			parameterMap.set("tr", valueString); //value field is populated, usable
		}
	} else {
		parameterMap.set("tr",revenueString); //revenue field is populated, usable
	}
	var productArray = jsonQobj.find("rl_properties").find("products").find("product_id").parent();	
	if (productArray.length > 0){ 
		//console.log(productArray.length);
		//Now iterate through the products and add parameters accordingly
		var prodIndex = 1; 
		productArray.each(function(index, path, value){
			//If product_id is not provided, then SKU will be used in place of id
			if (!value.product_id || 0 === value.product_id.length){
				parameterMap.set("pr"+prodIndex+"id",value.sku);
			} else {
				parameterMap.set("pr"+prodIndex+"id",value.product_id);
			}
			parameterMap.set("pr"+prodIndex+"nm",value.name);
			parameterMap.set("pr"+prodIndex+"ca",value.category);
			parameterMap.set("pr"+prodIndex+"br",value.brand);
			parameterMap.set("pr"+prodIndex+"va",value.variant);
			parameterMap.set("pr"+prodIndex+"cc",value.coupon);
			parameterMap.set("pr"+prodIndex+"ps",value.position);
			parameterMap.set("pr"+prodIndex+"pr",value.price);
			prodIndex++;
		});
	} else { //throw error, empty Product List in Product List Viewed event payload
		throw new Error("No product information supplied for transaction event");
	} 
	return responseBuilderSimple(parameterMap,jsonQobj,'transaction',transactionEventConfigJson, customerCredentialsConfigJson);
}

//Function for handling generic e-commerce events
function processEComGenericEvent(jsonQobj){
	console.log("processEComGenericEvent called");
	var eventString = String(jsonQobj.find('rl_event').value());
	var parameterMap = new Map();
	//Future releases will have additional logic for below elements allowing for
	//customer-side overriding of event category and event action values
	parameterMap.set("ec",eventString);
	parameterMap.set("ea",eventString);
			
	return responseBuilderSimple(parameterMap,jsonQobj,'event',ecomGenericEventConfigJson, customerCredentialsConfigJson);
}

//Generic process function which invokes specific handler functions depending on message type
//and event type where applicable
  function processSingleMessage(jsonQobj){

	//Route to appropriate process depending on type of message received
	var messageType = String(jsonQobj.find('rl_type').value()).toLowerCase();
	//console.log(String(messageType));
	switch (messageType){
		case 'page':
			//console.log('processing page');
			return   processPageviews(jsonQobj);
		case 'screen':
			//console.log('processing screen');
			return   processScreenviews(jsonQobj);
		case 'track':
			var eventType = String(jsonQobj.find('rl_event').value()).toLowerCase();
			//console.log(eventType);	
			//There can be both ECommerce as well as Non-ECommerce 'track' events
			//Need to handle individually
			switch (eventType){
				case 'product list viewed':
				case 'product list filtered':	
				case 'product list clicked':
					return   processProductListEvent(jsonQobj);
					break;
				case 'promotion viewed':
				case 'promotion clicked':
					return   processPromotionEvent(jsonQobj);
					break;
				case 'product clicked':
				case 'product viewed':
				case 'product added':
				case 'wishlist product added to cart':	
				case 'product removed':
				case 'product removed from wishlist':
				case 'product added to wishlist':	
					return   processProductEvent(jsonQobj);
					break;
				case 'checkout started':
				case 'order updated':
				case 'order completed':	
				case 'order cancelled':
					return   processTransactionEvent(jsonQobj);
					break;
				case 'checkout step viewed':
				case 'checkout step completed':
				case 'payment info entered':
					return   processPaymentRelatedEvent(jsonQobj);
					break;
				case 'order refunded':
					return   processRefundEvent(jsonQobj);
					break;
				case 'product shared':
				case 'cart shared':	
					return   processSharingEvent(jsonQobj);
					break;
				case 'cart viewed':
				case 'coupon entered':
				case 'coupon applied':
				case 'coupon denied':
				case 'coupon removed':
				case 'product reviewed':
				case 'products searched':	
					return   processEComGenericEvent(jsonQobj);	
					break;
				default:
					return   processNonEComGenericEvent(jsonQobj);		
			}
		default:
			console.log('could not determine type');
			//throw new RangeError('Unexpected value in type field');
			var events = []
			events.push("{\"error\":\"message type not supported\"}");
			return events;
	}

}

//Iterate over input batch and generate response for each message
function process (jsonQobj){
	var respList = [];
	var counter = 0;
	jsonQobj.find("rl_message").each(function (index, path, value){
		result = processSingleMessage(jsonQ(value));
		respList.push(result);
		
	});
	return respList;
}

exports.process = process;