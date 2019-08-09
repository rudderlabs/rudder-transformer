var jsonQ = require('jsonq');
var fs = require('fs');
var http = require('http');
var qs = require('querystring');

const DEBUG = true;
if (!DEBUG){
	console.log = function (){};
}

var aFDescriptionConfigFile = fs.readFileSync('data/AFDescriptionConfig.json');
var aFDescriptionConfigJson = JSON.parse(aFDescriptionConfigFile);

var aFAdClickOrAdViewConfigFile = fs.readFileSync('data/AFAdClickOrAdViewConfig.json');
var aFAdClickOrAdViewConfigJson = JSON.parse(aFAdClickOrAdViewConfigFile);

var aFAddPaymentInfoConfigFile = fs.readFileSync('data/AFAddPaymentInfoConfig.json');
var aFAddPaymentInfoConfigJson = JSON.parse(aFAddPaymentInfoConfigFile);

var aFAddToCartOrWishlistConfigFile = fs.readFileSync('data/AFAddToCartOrWishlistConfig.json');
var aFAddToCartOrWishlistConfigJson = JSON.parse(aFAddToCartOrWishlistConfigFile);

var aFCompleteRegistrationConfigFile = fs.readFileSync('data/AFCompleteRegistrationConfig.json');
var aFCompleteRegistrationConfigJson = JSON.parse(aFCompleteRegistrationConfigFile);

var aFLevelAchievedConfigFile = fs.readFileSync('data/AFLevelAchievedConfig.json');
var aFLevelAchievedConfigJson = JSON.parse(aFLevelAchievedConfigFile);

var aFListViewConfigFile = fs.readFileSync('data/AFListViewConfig.json');
var aFListViewConfigJson = JSON.parse(aFListViewConfigFile);

var aFRateConfigFile = fs.readFileSync('data/AFRateConfig.json');
var aFRateConfigJson = JSON.parse(aFRateConfigFile);

var aFSpentCreditConfigFile = fs.readFileSync('data/AFSpentCreditConfig.json');
var aFSpentCreditConfigJson = JSON.parse(aFSpentCreditConfigFile);

var aFStartTrialConfigFile = fs.readFileSync('data/AFStartTrialConfig.json');
var aFStartTrialConfigJson = JSON.parse(aFStartTrialConfigFile);

var aFSubscriptionConfigFile = fs.readFileSync('data/AFSubscriptionConfig.json');
var aFSubscriptionConfigJson = JSON.parse(aFSubscriptionConfigFile);

var aFTutorialCompletionConfigFile = fs.readFileSync('data/AFTutorialCompletionConfig.json');
var aFTutorialCompletionConfigJson = JSON.parse(aFTutorialCompletionConfigFile);

var aFTravelBookingConfigFile = fs.readFileSync('data/AFTravelBookingConfig.json');
var aFTravelBookingConfigJson = JSON.parse(aFTravelBookingConfigFile);

var aFUpdateConfigFile = fs.readFileSync('data/AFUpdateConfig.json');
var aFUpdateConfigJson = JSON.parse(aFUpdateConfigFile);

var aFInitiatedCheckoutConfigFile = fs.readFileSync('data/AFInitiatedCheckoutConfig.json');
var aFInitiatedCheckoutConfigJson = JSON.parse(aFInitiatedCheckoutConfigFile);

var aFPurchaseConfigFile = fs.readFileSync('data/AFPurchaseConfig.json');
var aFPurchaseConfigJson = JSON.parse(aFPurchaseConfigFile);

var aFSearchConfigFile = fs.readFileSync('data/AFSearchConfig.json');
var aFSearchConfigJson = JSON.parse(aFSearchConfigFile);

var aFContentViewConfigFile = fs.readFileSync('data/AFContentViewConfig.json');
var aFContentViewConfigJson = JSON.parse(aFContentViewConfigFile);


function processEventTypeTrack(parameterMap, jsonQobj){
    var eventType = String(jsonQobj.find('rl_event').value()).toLowerCase();
    var eventName = "";
    var jsonConfig = "";
    var isMultiSupport = false;
    var isUnIdentifiedEvent = false;
    switch(eventType.toLowerCase()){
        case 'level achieved':
            eventName = 'af_level_achieved';
            jsonConfig = aFLevelAchievedConfigJson;
            break;
        case 'add payment info':
            eventName = 'af_add_payment_info';
            jsonConfig = aFAddPaymentInfoConfigJson;
            break;
        case 'add to cart':
            eventName = 'af_add_to_cart';
            jsonConfig = aFAddToCartOrWishlistConfigJson;
            isMultiSupport = true;
            break;
        case 'add to wishlist':
            eventName = 'af_add_to_wishlist';
            jsonConfig = aFAddToCartOrWishlistConfigJson;
            isMultiSupport = true;
            break;
        case 'complete registration':
            eventName = 'af_complete_registration';
            jsonConfig = aFCompleteRegistrationConfigJson;
            break;
        case 'tutorial completion':
            eventName = 'af_tutorial_completion';
            jsonConfig = aFTutorialCompletionConfigJson;
            isMultiSupport = true;
			break;
		case 'initiated checkout':
            eventName = 'af_initiated_checkout';
            jsonConfig = aFInitiatedCheckoutConfigJson;
            isMultiSupport = true;
			break;
		case 'purchase':
            eventName = 'af_purchase';
            jsonConfig = aFPurchaseConfigJson;
            isMultiSupport = true;
			break;
		case 'subscription':
            eventName = 'af_subscribe';
            jsonConfig = aFSubscriptionConfigJson;
            break;
        case 'start trial':
            eventName = 'af_start_trial';
            jsonConfig = aFStartTrialConfigJson;
            break;
        case 'rate':
            eventName = 'af_rate';
            jsonConfig = aFRateConfigJson;
            isMultiSupport = true;
            break;
        case 'search':
            eventName = 'af_search';
            jsonConfig = aFSearchConfigJson;
            break;
        case 'spent credits':
            eventName = 'af_spent_credits';
            jsonConfig = aFSpentCreditConfigJson;
            isMultiSupport = true;
            break;
        case 'achievement unlocked':
            eventName = 'af_achievement_unlocked';
            jsonConfig = aFDescriptionConfigJson;
            break;
        case 'content view':
            eventName = 'af_content_view';
            jsonConfig = aFContentViewConfigFileJson;
            isMultiSupport = true;
            break;
        case 'list view':
            eventName = 'af_list_view';
            jsonConfig = aFListViewConfigJson;
            break;
        case 'ad click':
            eventName = 'af_ad_click';
            jsonConfig = aFAdClickOrAdViewConfigJson;
            break;
        case 'ad view':
            eventName = 'af_ad_view';
            jsonConfig = aFAdClickOrAdViewConfigJson;
            break;
        case 'travel booking':
            eventName = 'af_travel_booking';
            jsonConfig = aFTravelBookingConfigJson;
            isMultiSupport = true;
            break;
        case 'share':
            eventName = 'af_share';
            jsonConfig = aFDescriptionConfigJson;
            break;
        case 'invite':
            eventName = 'af_invite';
            jsonConfig = aFDescriptionConfigJson;
            break;
        case 'login':
            eventName = 'af_login';
            jsonConfig = '';
            break;
        case 're-engage':
            eventName = 'af_re_engage';
            jsonConfig = aFDescriptionConfigJson;
            break;
        case 'opened from push notification':
            eventName = 'af_opened_from_push_notification';
            jsonConfig = '';
            break;
        case 'update':
            eventName = 'af_update';
            jsonConfig = aFUpdateConfigJson;
            isMultiSupport = true;
            break;
        default:
            eventName = eventType.toLowerCase();
            isUnIdentifiedEvent = true;
            break;

            
    }
    parameterMap.set("eventName", eventName);
    if(isUnIdentifiedEvent){
        getEventValueForUnIdentifiedTrackEvent(parameterMap, jsonQobj);
    } else {
        getEventValueMapFromMappingJson(parameterMap, jsonQobj, jsonConfig, isMultiSupport);
    }

}

function getEventValueForUnIdentifiedTrackEvent(parameterMap, jsonQobj){
    var properties = (jsonQobj.find("rl_properties").value())[0];
    parameterMap.set("eventValue", JSON.stringify(properties));
}

//Helper function for generating desired JSON from Map
const mapToObj = m => {
	return Array.from(m).reduce((obj, [key, value]) => {
	  obj[key] = value;
	  return obj;
	}, {});
  };


function responseBuilderSimple (parameterMap, jsonQobj){

    var responseMap = new Map();
    var app_id = String(jsonQobj.find("rl_context").find("rl_app").find("rl_namespace").value());
	responseMap.set("endpoint","https://api2.appsflyer.com/inappevent/"+app_id);
	responseMap.set("request-format","PARAMS");

	
	
	jsonQobj.find('rl_anonymous_id').each(function (index, path, value){
		parameterMap.set("appsflyer_id",String(value));
    });
    
    //customer_user_id
    jsonQobj.find('rl_user_id').each(function (index, path, value){
        parameterMap.set("customer_user_id",String(value));
    });
    //parameterMap.set("advertising_id","1");
    //parameterMap.set("eventCurrency","1");
    parameterMap.set("eventTime",String(jsonQobj.find("rl_timestamp").value()));
    parameterMap.set("af_events_api","true");

    responseMap.set("payload",mapToObj(parameterMap));
    
    var headerMap = new Map();//TODO

	var responseJson = JSON.stringify(mapToObj(responseMap));

	var events = []
	events.push(responseJson);
	return events;
}

function getEventValueMapFromMappingJson(parameterMap, jsonQobj, mappingJson, isMultiSupport){

    var eventValueMap = new Map();

	jsonQ.each(mappingJson, function(sourceKey, destinationKey){
		var tempObj = jsonQobj.find('rl_context').parent();

		var pathElements = sourceKey.split('.');

		for (var i=0; i<pathElements.length; i++) {
			tempObj = tempObj.find(pathElements[i]);	
		}
				
		tempObj.each(function (index, path, value){
			eventValueMap.set(String(destinationKey),String(value));
        });
    });
    if(isMultiSupport){
        var productIdArray = jsonQobj.find("rl_properties").find("products").find("content_id").parent();
        var contentIdArray = [];
        var quantityArray = [];
        var priceArray = [];
        productIdArray.each(function (path, index, value){
            contentIdArray.push(value.content_id);
            quantityArray.push(value.quantity);
            priceArray.push(value.price);
        });	
        eventValueMap.set("af_content_id", contentIdArray);
        eventValueMap.set("af_quantity", quantityArray);
        eventValueMap.set("af_price", priceArray);

    }
    var eventValue = JSON.stringify(mapToObj(eventValueMap));
    if(eventValue == "{}"){
        eventValue = "";
    }
    parameterMap.set("eventValue", eventValue);

}

function processSingleMessage(jsonQobj){
    var messageType = String(jsonQobj.find('rl_type').value()).toLowerCase();
    var parameterMap = new Map();
    switch (messageType){
        case 'track':
            processEventTypeTrack(parameterMap, jsonQobj);
            break;
        default:
            parameterMap.set("eventName",  String(jsonQobj.find('rl_event').value()));
            parameterMap.set("eventValue", "");
    }
    return responseBuilderSimple(parameterMap,jsonQobj); 
}

function process (jsonQobj){
    var respList = [];
	jsonQobj.find("rl_message").each(function (index, path, value){
		result = processSingleMessage(jsonQ(value));
		respList.push(result);
		
    });
	return respList;
}

exports.process = process;