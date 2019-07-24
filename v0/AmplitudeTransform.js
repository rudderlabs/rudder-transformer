//Library references
var jsonQ = require('jsonq');
var fs = require('fs');
var http = require('http');
var qs = require('querystring');


//Load and parse configurations for different messages

var identifyConfigFile = fs.readFileSync('data/AmplitudeIdentifyConfig.json');
var identifyConfigJson = JSON.parse(identifyConfigFile);

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
var customerCredentialsConfig = fs.readFileSync('data/AmplitudeCredentialsConfig.json');
var customerCredentialsConfigJson = JSON.parse(customerCredentialsConfig);

//Helper function for generating desired JSON from Map
const mapToObj = m => {
	return Array.from(m).reduce((obj, [key, value]) => {
	  obj[key] = value;
	  return obj;
	}, {});
  };

//Build response for Amplitude. In this case, endpoint will be different depending 
//on Rudder "rl_type"
//Also, the payload will be a complex JSON and not just key-value pairs
function responseBuilderSimple (parameterMap, rootElementName, jsonQobj, rl_type, mappingJson, credsJson){
	
	//Create a final map to be used for response and populate the static parts first
	var responseMap = new Map();	
	responseMap.set("request-format","PARAMS");

	//User Id for internal routing purpose needs to be set
	var anonId = jsonQobj.find("rl_anonymous_id");
	anonId.each(function (index, path, value){
		responseMap.set("user_id", String(value));
	});

	
	//Amplitude HTTP API calls take two parameters
	//First one is a api_key and the second one is a complete JSON
	jsonQ.each(credsJson, function(key,value){
		parameterMap.set("api_key",String(value));
	});

	//We would need to maintain a map of RHS objects in order to 
	//be able to add properties to the same without ending up with
	//multiple objects of same type
	var objMap = new Map(); 

	//Add fixed-logic fields to objMap
	var libraryName = jsonQobj.find("rl_library").find("rl_name");

	libraryName.each(function(index, path, value){
		objMap.set("platform",String(value).split(".")[2]);
	});


	jsonQ.each(mappingJson, function(sourceKey, destinationKey){
		console.log(destinationKey);
		//Reset reference point to root
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

		//There might be multiple entries for multiple levels of the same structure
		//or for multiple elements at same level in the structure. Hence the root
		//should be initialized outside
		var rootObj = {};
				
		tempObj.each(function (index, path, value){
			//Destination key can also be part of a structure
			var destinationPathElements = destinationKey.split('.');
			//Construct the object hierarchy, checking for existence at each step
			var parent = {};
	
			//to be directly added to root level
			if (destinationPathElements.length<2){ 

				objMap.set(destinationPathElements[0],value);

			} else { //multi-level hierarchy

				for (var level=0; level<destinationPathElements.length; level++){
				
					//Now there can be 3 situations - the root, intermediate branch, 
					//or leaf. If root, check if the root object exists, else create
					//if branch, check if root object has the branch, else add
					//for leaf - check if penultimate branch has leaf, else add
					
					switch(level){
					case 0: //root
						var tmp = objMap.get(destinationPathElements[0]);
						
						if (!tmp){ //root itself does not exist
							rootObj = {};
							objMap.set(destinationPathElements[0],rootObj);
							parent = rootObj; //for next calls
					
						} else { //root exits, set parent to root
							parent = tmp;
					
						}
						break;
					case destinationPathElements.length-1: //leaf
						
						//leaf will have value
						parent[destinationPathElements[level]]=value;
						break;
					default: //all other cases, i.e. intermediate branches
						//however this needs to be skipped for a.b cases
						if (destinationPathElements.length>2){
							var tmp = parent[destinationPathElements[level]];
							if (!tmp){ //level does not exists
					
								branchObj = {};
								parent[destinationPathElements[level]] = branchObj;
								parent = branchObj;
							} else {
					
								parent = tmp;
							}
		
						}
						
						break;
	
					}
					
				}
			}

		});
		
	});
	
	//Now add the entire object map to the parameter map against 
	//the designated root element name
	parameterMap.set(rootElementName, mapToObj(objMap));

	switch (rl_type){
	case "identify":
		responseMap.set("endpoint","https://api.amplitude.com/identify");
		break;
	}


	//Assign parameter map against payload key
	responseMap.set("payload",mapToObj(parameterMap));

	//Convert response map to JSON
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
		var parameterMap = new Map();
		var eventString = String(jsonQobj.find('rl_message').find('rl_event').value());
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

		resolve(responseBuilderSimple(parameterMap,jsonQobj,'event',promotionEventConfigJson, customerCredentialsConfigJson));
	});
}


//Function for processing payment-related events
function processPaymentRelatedEvent(jsonQobj){
	return new Promise((resolve)=>{
		var parameterMap = new Map();
		parameterMap.set("pa","checkout"); //pre-populate
		resolve(responseBuilderSimple(parameterMap,jsonQobj,'transaction',paymentRelatedEventConfigJson, customerCredentialsConfigJson));
	});
}

//Function for processing order refund events
function processRefundEvent(jsonQobj){
	return new Promise((resolve)=>{
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
		resolve(responseBuilderSimple(parameterMap,jsonQobj,'transaction',refundEventConfigJson, customerCredentialsConfigJson));
	});
}

//Function for processing product and cart shared events
function processSharingEvent(jsonQobj){
	return new Promise((resolve)=>{
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
		resolve(responseBuilderSimple(parameterMap,jsonQobj,'social',sharingEventConfigJson, customerCredentialsConfigJson));
	});
}

//Function for processing product list view event
function processProductListEvent(jsonQobj){
	return new Promise((resolve)=>{
		var eventString = String(jsonQobj.find('rl_message').find('rl_event').value());
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
		resolve(responseBuilderSimple(parameterMap,jsonQobj,'event',productListEventConfigJson, customerCredentialsConfigJson));
	});
}

//Function for processing product viewed or clicked events
function processProductEvent(jsonQobj){
	return new Promise((resolve)=>{
		var eventString = String(jsonQobj.find('rl_message').find('rl_event').value());
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
		resolve(responseBuilderSimple(parameterMap,jsonQobj,'event',productEventConfigJson, customerCredentialsConfigJson));
	});
}

//Function for processing transaction event
function processTransactionEvent(jsonQobj){
	return new Promise((resolve)=>{
		var eventString = String(jsonQobj.find('rl_message').find('rl_event').value());
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
		resolve(responseBuilderSimple(parameterMap,jsonQobj,'transaction',transactionEventConfigJson, customerCredentialsConfigJson));
	});
}

//Function for handling generic e-commerce events
function processEComGenericEvent(jsonQobj){
	return new Promise((resolve)=>{
		var eventString = String(jsonQobj.find('rl_message').find('rl_event').value());
		var parameterMap = new Map();
		//Future releases will have additional logic for below elements allowing for
		//customer-side overriding of event category and event action values
		parameterMap.set("ec",eventString);
		parameterMap.set("ea",eventString);
				
		resolve(responseBuilderSimple(parameterMap,jsonQobj,'event',ecomGenericEventConfigJson, customerCredentialsConfigJson));
	});
}

//Handler code for "identify"
function processIdentify(jsonQobj){
	return new Promise((resolve)=>{
		var parameterMap = new Map();
		resolve(responseBuilderSimple(parameterMap, 'identification', jsonQobj,'identify', identifyConfigJson, customerCredentialsConfigJson));


	});
	
}
//Generic process function which invokes specific handler functions depending on message type
//and event type where applicable
async function process(jsonQobj){

	//Route to appropriate process depending on type of message received
	var messageType = String(jsonQobj.find("rl_message").find('rl_type').value()).toLowerCase();
	//console.log(String(messageType));
	switch (messageType){
		case 'identify':
			return await processIdentify(jsonQobj);
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

exports.process = process;