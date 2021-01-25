/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
const get = require("get-value");
const axios = require("axios");
const { EventType } = require("../../../constants");
const {
  SF_API_VERSION,
  SF_TOKEN_REQUEST_URL,
  identifyMappingJson,
  groupMappingJson,
  ignoredTraits,
  CRUD_OPERATION
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
function responseBuilderSimple(traits, salesforceMap, authorizationData) {
  const { salesforceType, salesforceId } = salesforceMap;

  // if id is valid, do update else create the object
  // POST for create, PATCH for update
  let targetEndpoint = `${authorizationData.instanceUrl}/services/data/v${SF_API_VERSION}/sobjects/${salesforceType}`;
  if (salesforceId) {
    const httpMethod = salesforceMap.httpMethod || "PATCH";
    targetEndpoint += `/${salesforceId}?_HttpMethod=${httpMethod}`;
  }

  // First name and last name need to be extracted from the name field
  // get traits from the message
  let rawPayload = traits;
  // map using the config only if the type is Lead
  if (salesforceType === "Lead") {
    // adjust for firstName and lastName
    // construct the payload using the mappingJson and add extra params
    rawPayload = constructPayload(
      { ...traits, ...getFirstAndLastName(traits, "n/a") },
      identifyMappingJson
    );
    Object.keys(traits).forEach(key => {
      if (ignoredTraits.indexOf(key) === -1 && traits[key]) {
        rawPayload[`${key}__c`] = traits[key];
      }
    });
  }

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
    const email = getFieldValueFromMessage(message, "email");

    if (!email) {
      throw new Error("Invalid Email address for Lead Objet");
    }

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

/**
 * Get Mapping field from fieldmapping and upsertmapping array data present in actionconfigurations object
 * @param {*} message
 * @param {*} fieldMapping
 * @param {*} upsertMapping
 */
function getMappingField(message, fieldMapping, upsertMapping) {
  const mappingPayload = { Field: {}, Upsert: {} };
  if (fieldMapping.length === 0) {
    return null;
  }
  fieldMapping.forEach(map => {
    mappingPayload.Field[map.to] = get(message, map.from);
  });

  if (upsertMapping.length > 0) {
    upsertMapping.forEach(map => {
      mappingPayload.Upsert[map.to] = get(message, map.from);
    });
  }

  return mappingPayload;
}

/**
 * Validate id field if CRUD Operation is Update
 * @param {*} fields
 */
function isValidUpdateOperation(fields) {
  if (!fields.Id) {
    return false;
  }

  return true;
}

/**
 * This fn will generate response payload for each action configuration array.
 * @param {*} crudOperation
 * @param {*} sfObject
 * @param {*} fields
 * @param {*} upserts
 * @param {*} authorizationData
 */
function generateActionConfiguration(
  crudOperation,
  sfObject,
  fields,
  upserts,
  authorizationData
) {
  const sfMap = {
    salesforceType: null,
    salesforceId: null
  };
  sfMap.salesforceType = sfObject;
  switch (crudOperation) {
    case CRUD_OPERATION.UPDATE:
      if (isValidUpdateOperation(fields)) {
        sfMap.salesforceId = fields.Id;
        delete fields.Id;
      }
      break;
    case CRUD_OPERATION.DELETE:
      sfMap.httpMethod = CRUD_OPERATION.DELETE.toUpperCase();
      break;
    case CRUD_OPERATION.CREATE:
      break;
    default:
      throw new Error(`actions is not configured to process track event`);
  }

  return responseBuilderSimple(fields, sfMap, authorizationData);
}

/**
 * Function to process track event present in actions form
 * @param {*} message
 * @param {*} destination
 * @param {*} actionConfigurations
 * @param {*} authorizationData
 */
function processTrack(
  message,
  destination,
  actionConfigurations,
  authorizationData
) {
  let payload = {};
  const customActionResponse = [];
  actionConfigurations.forEach(config => {
    payload = getMappingField(
      message,
      config.fieldMappings,
      config.upsertMappings
    );
    customActionResponse.push(
      generateActionConfiguration(
        config.crudOperation,
        config.salesForceObject,
        payload.Field,
        payload.Upsert,
        authorizationData
      )
    );
  });
  return customActionResponse;
}

/**
 * Handle Custom Actions present in  added in config object
 * @param {*} message
 * @param {*} destination
 */
async function processCustomActions(message, destination) {
  const { event } = message;
  let { actions } = destination.Config;
  let customActionResponse = [];
  if (!event) {
    throw new Error(`message type ${message.type} should contain an event.`);
  }
  if (actions && actions.length === 0) {
    throw new Error(`actions is not configured to process track event`);
  }

  const authorizationData = await getSFDCHeader(destination);
  actions = actions.filter(a => {
    return event === a.eventName;
  });

  /**
   * Loop Over list of actions and push generated payload into array.
   */
  actions.forEach(ac => {
    let res = [];
    if (message.type === EventType.TRACK) {
      res = processTrack(
        message,
        destination,
        ac.actionConfigurations,
        authorizationData
      );
    }
    customActionResponse = customActionResponse.concat(res);
  });

  return customActionResponse;
}

/**
 * Function to handle group event. It only creates a new account in Salesforce.
 * @param {*} message
 * @param {*} destination
 */
async function processGroup(message, destination) {
  let payload = {};
  const sfMap = {
    salesforceType: "Account",
    salesforceId: null
  };
  // check the traits before hand
  const traits = getFieldValueFromMessage(message, "traits");
  if (!traits) {
    throw new Error("Invalid traits for Salesforce request");
  }

  // Get the authorization header if not available
  const authorizationData = await getSFDCHeader(destination);

  payload = constructPayload(message, groupMappingJson);

  return responseBuilderSimple(payload, sfMap, authorizationData);
}

/**
 * Function for handling identify events
 * @param {*} message
 * @param {*} destination
 */
async function processIdentify(message, destination) {
  // check the traits before hand
  const traits = getFieldValueFromMessage(message, "traits");
  if (!traits) {
    throw new Error("Invalid traits for Salesforce request");
  }

  // if traits is correct, start processing
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
    // finally build the response and push to the list
    responseData.push(
      responseBuilderSimple(traits, salesforceMap, authorizationData)
    );
  });

  return responseData;
}

// Generic process function which invokes specific handler functions depending on message type
// and event type where applicable
async function processSingleMessage(message, destination) {
  let response;
  const eventType = message.type;
  switch (eventType) {
    case EventType.IDENTIFY:
      response = await processIdentify(message, destination);
      break;
    case EventType.GROUP:
      response = await processGroup(message, destination);
      break;
    case EventType.TRACK:
      response = await processCustomActions(message, destination);
      break;
    default:
      throw new Error(`message type ${message.type} is not supported`);
  }
  return response;
}

async function process(event) {
  const response = await processSingleMessage(event.message, event.destination);
  return response;
}

exports.process = process;

/** ------------------------------------------------------  For Future Reference ----------------------------------------------- */
/**
function shallowEqual(src, dest) {
  const srcKeys = Object.keys(src);
  const destKeys = Object.keys(dest);

  if (srcKeys.length > destKeys.length) {
    return false;
  }

  for (const key of srcKeys) {
    if (src[key] !== dest[key]) {
      return false;
    }
  }

  return true;
}
async function generateUpsertMappingRule(sfObject, upserts, authorizationData) {
  const items = [];
  const url = `${authorizationData.instanceUrl}/services/data/v${SF_API_VERSION}/sobjects/${sfObject}`;
  const response = await axios.get(url, {
    headers: { Authorization: authorizationData.token }
  });
  const { recentItems } = response;
  for (const item in recentItems) {
    if (shallowEqual(upserts, item)) {
      items.push(item.Id);
    }
  }
  return items;
}

function createUpsertMapping(
  crudOperation,
  sfObject,
  fields,
  upserts,
  authorizationData
) {
  let updateMappingIds = [];
  const sfMap = {
    salesforceType: null,
    salesforceId: null
  };
  updateMappingIds = generateUpsertMappingRule(sfObject, upserts);
  if (updateMappingIds.length === 0) {
    crudOperation = CRUD_OPERATION.CREATE;
  } else {
    updateMappingIds.forEach(id => {
      sfMap.salesforceId = id;
      customActionResponse.push(
        responseBuilderSimple(fields, sfMap, authorizationData)
      );
    });
    crudOperation = CRUD_OPERATION.UPDATE;
  }
  return updateMappingIds;
}

if (crudOperation === CRUD_OPERATION.UPSERT) {
  sfMap = createUpsertMapping(
    crudOperation,
    sfObject,
    fields,
    upserts,
    authorizationData
  );
} else
 */
/** --------------------------------------------------- END ------------------------------------------------------- */
