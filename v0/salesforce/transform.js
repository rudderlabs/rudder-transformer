const get = require("get-value");
const axios = require("axios");
const { EventType } = require("../../constants");
const {
  ConfigCategory,
  SF_API_VERSION,
  SF_TOKEN_REQUEST_URL,
  mappingConfig
} = require("./config");
const { removeUndefinedValues, defaultRequestConfig } = require("../util");

const formatQueryParams = params => {
  let paramStr = "";
  Object.keys(params).forEach(p => {
    paramStr += `${p}=${params[p]}&`;
  });
  return paramStr.substring(0, paramStr.length - 1);
};

// Utility method to construct the header to be used for SFDC API calls
// The "Authorization: Bearer <token>" header element needs to be passed for
// authentication for all SFDC REST API calls
async function getSFDCHeader(destination) {
  const url = `${SF_TOKEN_REQUEST_URL}?${formatQueryParams({
    username: encodeURIComponent(destination.Config.userName),
    password:
      encodeURIComponent(destination.Config.password) +
      encodeURIComponent(destination.Config.initialAccessToken),
    client_id: destination.Config.consumerKey,
    client_secret: destination.Config.consumerSecret,
    grant_type: "password"
  })}`;

  const response = await axios.post(url, {});

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
  const rawPayload = {};

  // First name and last name need to be extracted from the name field
  // and inserted into the message

  // TODO : check for the first name logic
  let firstName = "";
  let lastName = "";
  if (message.context.traits.name) {
    // Split by space and then take first and last elements
    const nameComponents = message.context.traits.name.split(" ");
    firstName = nameComponents[0]; // first element
    lastName = nameComponents[nameComponents.length - 1]; // last element
    // Insert first and last names separately into message
    message.context.traits.firstName = firstName;
    message.context.traits.lastName = lastName;
  }

  Object.keys(mappingJson).forEach(sourceKey => {
    const val = get(message, sourceKey);
    if (val) {
      if (typeof val === "string") {
        if (val.trim().length > 0)
          rawPayload[mappingJson[sourceKey]] = get(message, sourceKey);
      } else if (typeof val !== "object") {
        rawPayload[mappingJson[sourceKey]] = get(message, sourceKey);
      }
    }
  });

  if (!rawPayload.LastName || rawPayload.LastName.trim() === "") {
    rawPayload.LastName = "n/a";
  }

  if (!rawPayload.Company || rawPayload.Company.trim() === "") {
    rawPayload.Company = "n/a";
  }

  // Remove keys with undefined values
  const payload = removeUndefinedValues(rawPayload);

  // TODO : check for the bitwise operator
  const customKeys = Object.keys(message.context.traits);
  customKeys.forEach(key => {
    const keyPath = `context.traits.${key}`;
    const mappingJsonKeys = Object.keys(mappingJson);
    if (
      !mappingJsonKeys.some(k => {
        return ~k.indexOf(keyPath);
      }) &&
      !(keyPath in ignoreMapJson)
    ) {
      const val = message.context.traits[key];
      if (val) {
        payload[`${key}__c`] = val;
      }
    }
  });

  // Get custom params from destination config
  const customParams = removeUndefinedValues(
    getParamsFromConfig(message, destination)
  );

  const response = defaultRequestConfig();
  const header = {
    "Content-Type": "application/json",
    Authorization: authorizationData[0]
  };
  // console.log(response);

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
  const authorizationData = await getSFDCHeader(destination);

  // start with creation endpoint, update only if Lead does not exist
  let targetEndpoint = `${authorizationData[1]}/services/data/v${SF_API_VERSION}/sobjects/Lead`;

  // check if the lead exists
  // need to perform a parameterized search for this using email
  const { email } = message.context.traits;

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
    response = {
      statusCode: 400,
      error: `message type ${message.type} is not supported`
    };
  }
  return response;
}

async function process(event) {
  const response = await processSingleMessage(event.message, event.destination);
  return response;
}

exports.process = process;
