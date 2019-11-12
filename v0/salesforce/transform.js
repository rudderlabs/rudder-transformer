const get = require("get-value");
const axios = require("axios");
const { EventType } = require("../../constants");
const {
  ConfigCategory,
  SF_API_VERSION,
  SF_TOKEN_REQUEST_URL,
  mappingConfig,
} = require("./config");
const {
  removeUndefinedValues,
  toStringValues,
  defaultPostRequestConfig
} = require("../util");

var authorizationHeader;

//Utility method to construct the header to be used for SFDC API calls
//The "Authorization: Bearer <token>" header element needs to be passed for 
//authentication for all SFDC REST API calls
async function getSFDCHeader(destination){
   
  console.log(SF_TOKEN_REQUEST_URL
    +"?username="+destination.Config.userName
    +"&password="+destination.Config.password+destination.Config.initialAccessToken
    +"&client_id="+destination.Config.consumerKey
    +"&client_secret="+destination.Config.consumerSecret
    +"&grant_type=password");
  const response = await axios.post(SF_TOKEN_REQUEST_URL
    +"?username="+destination.Config.userName
    +"&password="+destination.Config.password+destination.Config.initialAccessToken
    +"&client_id="+destination.Config.consumerKey
    +"&client_secret="+destination.Config.consumerSecret
    +"&grant_type=password",{});
    
    console.log(response);
    return "Bearer " + response.data.access_token;
}

// Basic response builder
// We pass the parameterMap with any processing-specific key-value prepopulated
// We also pass the incoming payload, the hit type to be generated and
// the field mapping and credentials JSONs
async function responseBuilderSimple(
  message,
  mappingJson,
  destination,
  targetEndpoint
) {

  //Need to get the authorization header element
  //Need this to be async 
   if (!authorizationHeader) {
     authorizationHeader = await getSFDCHeader(destination);
   }
 
  const rawPayload =  {};

  //First name and last name need to be extracted from the name field
  //and inserted into the message
  
  var firstName = "";
  var lastName = "";
  if(message.context.traits.name){
    //Split by space and then take first and last elements
    var nameComponents = message.context.traits.name.split(" ");
    firstName = nameComponents[0]; //first element
    lastName = nameComponents[nameComponents.length - 1]; //last element
    
  }

  //Insert first and last names separately into message
  message.context.traits.firstName = firstName;
  message.context.traits.lastName = lastName;
  
  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    rawPayload[mappingJson[sourceKey]] = get(message, sourceKey);
  });
  // Remove keys with undefined values
  const payload = removeUndefinedValues(rawPayload);

  //Get custom params from destination config
  let customParams = getParamsFromConfig(message, destination);
  customParams = removeUndefinedValues(customParams);

  const response = {
    endpoint: targetEndpoint,
    requestConfig: defaultPostRequestConfig,
    header: {
      "Content-Type" : "application/json",
      "Authorization" : authorizationHeader
    },
    userId: message.anonymousId,
    payload: { ...customParams, ...payload }
  };
  return response;
}

function getParamsFromConfig(message, destination) {
  let params = {};

  var obj = {};
  // customMapping: [{from:<>, to: <>}] , structure of custom mapping
  if (destination.Config.customMappings) {
    destination.Config.customMappings.forEach(mapping => {
      obj[mapping.from] = mapping.to;
    });
  }
  let keys = Object.keys(obj);
  keys.forEach(key => {
    params[obj[key]] = get(message.properties, key);
  });
  return params;
}




//Function for handling identify events
async function processIdentify(message,destination) {

  var targetEndpoint = "https://" 
                      + destination.Config.instanceName 
                      + ".salesforce.com"
                      + "/services/data/v"
                      + SF_API_VERSION
                      + "/sobjects/Lead";

  //Get the authorization header if not available
  if (!authorizationHeader) {
    authorizationHeader = await getSFDCHeader(destination);
  }

  console.log("Header " + authorizationHeader);
  
  //check if the lead exists
  //need to perform a parameterized search for this using email
  var email = message.context.traits.email;
  
  var leadQueryUrl = "https://" 
                      + destination.Config.instanceName 
                      + ".salesforce.com"
                      + "/services/data/v"
                      + SF_API_VERSION
                      + "/parameterizedSearch/?q="
                      + email
                      + "&sobject=User&User.fields=id"


  var leadQueryResponse = await axios.get(leadQueryUrl, 
                                        {headers: {
                                          "Authorization" : authorizationHeader  
                                          }
                                        });

  var retrievedLeadCount = leadQueryResponse.data.searchRecords.length;
  
  //if count is zero, then Lead does not exist, create the same 
  if(retrievedLeadCount > 0) {
    console.log(leadQueryResponse.data.searchRecords[0].Id);
    targetEndpoint += "/"+leadQueryResponse.data.searchRecords[0].Id;
  }                                      
  
  return responseBuilderSimple(
    message,
    mappingConfig[category.name],
    destination,
    targetEndpoint
  );
}

// Generic process function which invokes specific handler functions depending on message type
// and event type where applicable
async function processSingleMessage(message, destination) {
  let response;
  if (message.type === EventType.IDENTIFY) {
    response = await processIdentify(message, destination);
  } else {
    response = {
      statusCode: 400,
      error: "message type " + message.type + " is not supported"
    };
  }
  return response;
}

// Iterate over input batch and generate response for each message
async function process(events) {
  
  let respList = [];
  respList = await Promise.all(
    events.map(event => processSingleMessage(event.message, event.destination))
  );  
  return respList;
}

exports.process = process;
