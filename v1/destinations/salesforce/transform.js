const get = require("get-value");
const axios = require("axios");
const { EventType } = require("../../../constants");
const {
  ConfigCategory,
  SF_API_VERSION,
  SF_TOKEN_REQUEST_URL,
  mappingConfig,
  defaultTraits
} = require("./config");
const {
  removeUndefinedValues,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  constructPayload
} = require("../../util");

// Utility method to construct the header to be used for SFDC API calls
// The "Authorization: Bearer <token>" header element needs to be passed for
// authentication for all SFDC REST API calls
async function getSFDCHeader(destination) {
  const response = await axios.post(
    `${SF_TOKEN_REQUEST_URL}?username=${
      destination.Config.userName
    }&password=${encodeURIComponent(
      destination.Config.password
    )}${encodeURIComponent(destination.Config.initialAccessToken)}&client_id=${
      destination.Config.consumerKey
    }&client_secret=${destination.Config.consumerSecret}&grant_type=password`,
    {}
  );

  return [`Bearer ${response.data.access_token}`, response.data.instance_url];
}

function getParamsFromConfig(message, destination) {
  const params = {};

  const obj = {};
  // customMapping: [{from:<>, to: <>}] , structure of custom mapping
  if (destination.Config.customMappings) {
    destination.Config.customMappings.forEach(mapping => {
      obj[mapping.from] = mapping.to;
    });
  }
  const keys = Object.keys(obj);
  keys.forEach(key => {
    params[obj[key]] = get(message.properties, key);
  });
  return params;
}

// Basic response builder
// We pass the parameterMap with any processing-specific key-value prepopulated
// We also pass the incoming payload, the hit type to be generated and
// the field mapping and credentials JSONs
async function responseBuilderSimple(
  message,
  mappingJson,
  ignoreMapJson,
  destination,
  targetEndpoint,
  authorizationData
) {
  // First name and last name need to be extracted from the name field
  // and inserted into the message
  let firstName = "";
  let lastName = "";
  const traits = getFieldValueFromMessage(message, "traits");
  if (traits.name) {
    // Split by space and then take first and last elements
    const nameComponents = traits.name.split(" ");
    firstName = nameComponents[0]; // first element
    lastName = nameComponents[nameComponents.length - 1]; // last element
    // Insert first and last names separately into message
    traits.firstName = firstName;
    traits.lastName = lastName;
  }

  const rawPayload = constructPayload(message, mappingJson);

  if (!rawPayload.LastName || rawPayload.LastName.trim() === "") {
    rawPayload.LastName = "n/a";
  }

  if (!rawPayload.Company || rawPayload.Company.trim() === "") {
    rawPayload.Company = "n/a";
  }

  // Remove keys with undefined values
  const payload = removeUndefinedValues(rawPayload);

  // Get custom params from destination config
  let customParams = getParamsFromConfig(message, destination);
  customParams = removeUndefinedValues(customParams);

  const customKeys = Object.keys(traits);
  customKeys.forEach(key => {
    if (
      !defaultTraits.some(function(k) {
        return ~k.indexOf(key);
      }) &&
      !ignoreMapJson.includes(key)
    ) {
      const val = traits[key];
      if (val) payload[`${key}__c`] = val;
    }
  });

  const response = defaultRequestConfig();
  const header = {
    "Content-Type": "application/json",
    Authorization: authorizationData[0]
  };

  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = header;
  response.body.JSON = { ...customParams, ...payload };
  response.endpoint = targetEndpoint;
  response.userId = message.anonymousId;
  response.statusCode = 200;

  return response;
}

// Function for handling identify events
async function processIdentify(message, destination) {
  // Get the authorization header if not available
  // if (!authorizationData) {
  const authorizationData = await getSFDCHeader(destination);
  // }
  // start with creation endpoint, update only if Lead does not exist
  let targetEndpoint = `${authorizationData[1]}/services/data/v${SF_API_VERSION}/sobjects/Lead`;

  // check if the lead exists
  // need to perform a parameterized search for this using email
  const { email } = getFieldValueFromMessage(message, "traits");

  const leadQueryUrl = `${authorizationData[1]}/services/data/v${SF_API_VERSION}/parameterizedSearch/?q=${email}&sobject=Lead&Lead.fields=id`;

  // request configuration will be conditional
  // POST for create, PATCH for update
  const leadQueryResponse = await axios.get(leadQueryUrl, {
    headers: {
      Authorization: authorizationData[0]
    }
  });

  if (leadQueryResponse && leadQueryResponse.data.searchRecords) {
    const retrievedLeadCount = leadQueryResponse.data.searchRecords.length;
    // if count is greater than zero, it means that lead exists, then only update it
    // else the original endpoint, which is the one for creation - can be used
    if (retrievedLeadCount > 0) {
      targetEndpoint += `/${leadQueryResponse.data.searchRecords[0].Id}?_HttpMethod=PATCH`;
    }
  }

  return responseBuilderSimple(
    message,
    mappingConfig[ConfigCategory.IDENTIFY.name],
    mappingConfig[ConfigCategory.IGNORE.name],
    destination,
    targetEndpoint,
    authorizationData
  );
}

// Generic process function which invokes specific handler functions depending on message type
// and event type where applicable
async function processSingleMessage(message, destination) {
  let response;
  if (message.type === EventType.IDENTIFY) {
    response = await processIdentify(message, destination);
  } else {
    throw new Error(`message type ${message.type} is not supported`);
  }
  return response;
}

async function process(event) {
  const response = await processSingleMessage(event.message, event.destination);
  return response;
}

exports.process = process;
