const get = require("get-value");
const axios = require("axios");
const { EventType } = require("../../../constants");
const {
  SF_API_VERSION,
  SF_TOKEN_REQUEST_URL,
  identifyMappingJson,
  ignoredTraits
} = require("./config");
const {
  removeUndefinedValues,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  getFirstAndLastName
} = require("../../util");

// Utility method to construct the header to be used for SFDC API calls
// The "Authorization: Bearer <token>" header element needs to be passed for
// authentication for all SFDC REST API calls
async function getSFDCHeader(destination) {
  const authUrl = `${SF_TOKEN_REQUEST_URL}?username=${
    destination.Config.userName
  }&password=${encodeURIComponent(
    destination.Config.password
  )}${encodeURIComponent(destination.Config.initialAccessToken)}&client_id=${
    destination.Config.consumerKey
  }&client_secret=${destination.Config.consumerSecret}&grant_type=password`;
  const response = await axios.post(authUrl, {});

  return {
    token: `Bearer ${response.data.access_token}`,
    instanceUrl: response.data.instance_url
  };
}

// Basic response builder
// We pass the parameterMap with any processing-specific key-value prepopulated
// We also pass the incoming payload, the hit type to be generated and
// the field mapping and credentials JSONs
function responseBuilderSimple(message, targetEndpoint, authorizationData) {
  // First name and last name need to be extracted from the name field
  // get traits from the message
  let traits = getFieldValueFromMessage(message, "traits");
  if (traits) {
    // adjust for firstName and lastName
    traits = { ...traits, ...getFirstAndLastName(traits, "n/a") };
    // construct the payload using the mappingJson and add extra params
    const rawPayload = constructPayload(traits, identifyMappingJson);
    Object.keys(traits).forEach(key => {
      if (ignoredTraits.indexOf(key) === -1 && traits[key]) {
        rawPayload[`${key}__c`] = traits[key];
      }
    });

    const response = defaultRequestConfig();
    const header = {
      "Content-Type": "application/json",
      Authorization: authorizationData.token
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.headers = header;
    response.body.JSON = removeUndefinedValues(rawPayload);
    response.endpoint = targetEndpoint;

    return response;
  }

  return null;
}

// Check for externalId field under context and look for probable Salesforce objects
// We'll make separate requests for every Salesforce Object types present under externalIds
//
// Expected externalId map for Contact object:
//
// ------------------------
// {
//   "type": "Salesforce-Contact",
//   "id": "0035g000001FaHfAAK"
// }
// ------------------------
//
// We'll use the Salesforce Object names by removing "Salesforce-" string from the type field
//
// Default Object type will be "Lead" for backward compatibility
async function getSalesforceIdFromPayload(message, authorizationData) {
  // define default map
  const salesforceMaps = [];

  // get externalId
  const externalIds = get(message, "context.externalId");

  // if externalIds are present look for type `Salesforce-`
  if (externalIds && Array.isArray(externalIds)) {
    externalIds.forEach(extIdMap => {
      const { type, id } = extIdMap;
      if (type.includes("Salesforce")) {
        salesforceMaps.push({
          salesforceType: type.replace("Salesforce-", ""),
          salesforceId: id
        });
      }
    });
  }

  // if nothing is present consider it as a Lead Object
  // BACKWORD COMPATIBILITY
  if (salesforceMaps.length === 0) {
    // its a lead object. try to get lead object id using search query
    // check if the lead exists
    // need to perform a parameterized search for this using email
    const { email } = getFieldValueFromMessage(message, "traits");

    const leadQueryUrl = `${authorizationData.instanceUrl}/services/data/v${SF_API_VERSION}/parameterizedSearch/?q=${email}&sobject=Lead&Lead.fields=id`;

    // request configuration will be conditional
    const leadQueryResponse = await axios.get(leadQueryUrl, {
      headers: { Authorization: authorizationData.token }
    });

    let leadObjectId;
    if (
      leadQueryResponse &&
      leadQueryResponse.data &&
      leadQueryResponse.data.searchRecords
    ) {
      // if count is greater than zero, it means that lead exists, then only update it
      // else the original endpoint, which is the one for creation - can be used
      if (leadQueryResponse.data.searchRecords.length > 0) {
        leadObjectId = leadQueryResponse.data.searchRecords[0].Id;
      }
    }

    // add a Lead Object to the response
    salesforceMaps.push({ salesforceType: "Lead", salesforceId: leadObjectId });
  }

  return salesforceMaps;
}

// Function for handling identify events
async function processIdentify(message, destination) {
  const responseData = [];

  // Get the authorization header if not available
  const authorizationData = await getSFDCHeader(destination);

  // get salesforce object map
  const salesforceMaps = await getSalesforceIdFromPayload(
    message,
    authorizationData
  );

  // iterate over the object types found
  salesforceMaps.forEach(salesforceMap => {
    const { salesforceType, salesforceId } = salesforceMap;

    // if id is valid, do update else create the object
    // POST for create, PATCH for update
    let targetEndpoint = `${authorizationData.instanceUrl}/services/data/v${SF_API_VERSION}/sobjects/${salesforceType}`;
    if (salesforceId) {
      targetEndpoint += `/${salesforceId}?_HttpMethod=PATCH`;
    }

    // finally build the response and push to the list
    const resp = responseBuilderSimple(
      message,
      targetEndpoint,
      authorizationData
    );
    if (resp) {
      responseData.push(resp);
    }
  });

  return responseData;
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
