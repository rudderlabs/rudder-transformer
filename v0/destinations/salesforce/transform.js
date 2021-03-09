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
  getFirstAndLastName,
  getSuccessRespEvents,
  getErrorRespEvents
} = require("../../util");
const logger = require("../../../logger");

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
  let response;
  try {
    response = await axios.post(authUrl, {});
  } catch (error) {
    logger.error(error);
    throw new Error(`SALESFORCE AUTH FAILED: ${error.message}`);
  }

  return {
    token: `Bearer ${response.data.access_token}`,
    instanceUrl: response.data.instance_url
  };
}

// https://rudderstack8-dev-ed.my.salesforce.com/services/data/v50.0/parameterizedSearch/?q=email815@gmail.com&sobject=Case&Case.where=Priority='P-low'&Case.fields=Id,SuppliedEmail,Priority,Product__c
// https://rudderstack8-dev-ed.my.salesforce.com/services/data/v50.0/parameterizedSearch/?q=email815@gmail.com&sobject=Case&Case.fields=Id,SuppliedEmail,Priority,Product__c

// To Do :: Look why we are getting this issues
async function getUpsertData(upserts, sfObject, instanceUrl, token) {
  let url = `${instanceUrl}/services/data/v${SF_API_VERSION}/parameterizedSearch`;
  const fields = `&${sfObject}.fields=Id`;
  let queryParams = "";
  const upsertKeys = Object.keys(upserts);
  let res = [];
  url += `/?q=${upserts[upsertKeys[0]]}&sobject=${sfObject}`;
  upsertKeys.splice(0, 1);

  if (upsertKeys.length > 0) {
    const whereClause = `&${sfObject}.where=`;
    upsertKeys.forEach((k, index) => {
      queryParams += `${k}='${upserts[k]}'`;
      if (upsertKeys.length > index + 1) {
        queryParams += "+and+";
      }
    });
    queryParams = whereClause + queryParams;
  }
  // eslint-disable-next-line no-unused-vars
  url = url + queryParams + fields;

  const upsertResponse = await axios.get(url, {
    headers: { Authorization: token }
  });

  if (
    upsertResponse &&
    upsertResponse.data &&
    upsertResponse.data.searchRecords
  ) {
    res = upsertResponse.data.searchRecords;
  }
  return res;
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
async function getSalesforceIdFromPayload(
  message,
  authorizationData,
  sfObject = "Lead",
  requiredField = "id",
  searchQuery = ""
) {
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
    const query = searchQuery || getFieldValueFromMessage(message, "email");

    if (!query) {
      throw new Error("Invalid Email address for Lead Object");
    }

    const leadQueryUrl = `${authorizationData.instanceUrl}/services/data/v${SF_API_VERSION}/parameterizedSearch/?q=${query}&sobject=${sfObject}&${sfObject}.fields=${requiredField}`;

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
    salesforceMaps.push({
      salesforceType: sfObject,
      salesforceId: leadObjectId
    });
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
      sfMap.salesforceId = fields.Id;
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
function processTrack(message, actionConfigurations, authorizationData) {
  let payload = {};
  const customActionResponse = [];
  actionConfigurations.forEach(config => {
    if (config.crudOperation !== CRUD_OPERATION.UPSERT) {
      payload = getMappingField(
        message,
        config.fieldMappings,
        config.upsertMappings
      );
      const res = generateActionConfiguration(
        config.crudOperation,
        config.salesForceObject,
        payload.Field,
        authorizationData
      );
      customActionResponse.push(res);
    }
  });

  return customActionResponse;
}

/**
 * Handle Custom Actions present in  added in config object
 * @param {*} message
 * @param {*} destination
 */
async function processCustomActions(message, authorizationData, actions) {
  const { event } = message;
  let customActionResponse = [];
  if (!event) {
    throw new Error(
      `message type ${message.type} should contain an event property.`
    );
  }
  if (actions && actions.length === 0) {
    throw new Error(`actions is not configured to process track event`);
  }

  actions = actions.filter(a => {
    return event === a.eventName;
  });

  let upsertActionConfig = [];
  actions.forEach(a => {
    upsertActionConfig = a.actionConfigurations.filter(ac => {
      return ac.crudOperation === CRUD_OPERATION.UPSERT;
    });
  });

  await Promise.all(
    upsertActionConfig.map(async u => {
      const payload = getMappingField(
        message,
        u.fieldMappings,
        u.upsertMappings
      );
      const response = await getUpsertData(
        payload.Upsert,
        u.salesForceObject,
        authorizationData.instanceUrl,
        authorizationData.token
      );
      const res = [];
      if (response.length === 0) {
        res.push(
          generateActionConfiguration(
            CRUD_OPERATION.CREATE,
            u.salesForceObject,
            payload.Field,
            authorizationData
          )
        );
      } else {
        response.forEach(r => {
          payload.Field.Id = r.Id;
          res.push(
            generateActionConfiguration(
              CRUD_OPERATION.UPDATE,
              u.salesForceObject,
              payload.Field,
              authorizationData
            )
          );
        });
      }
      customActionResponse = customActionResponse.concat(res);
    })
  );

  /**
   * Loop Over list of actions and push generated payload into array.
   */
  actions.forEach(ac => {
    let res = [];
    if (message.type === EventType.TRACK) {
      res = processTrack(message, ac.actionConfigurations, authorizationData);
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
async function processGroup(message, authorizationData) {
  let payload = {};
  // check the traits before hand
  const traits = getFieldValueFromMessage(message, "traits");
  if (!traits) {
    throw new Error("Invalid traits for Salesforce request");
  }

  payload = constructPayload(message, groupMappingJson);
  // get salesforce object map
  const salesforceMaps = await getSalesforceIdFromPayload(
    message,
    authorizationData,
    "Account",
    "Name",
    payload.Name
  );
  const responseData = [];
  // iterate over the object types found
  salesforceMaps.forEach(salesforceMap => {
    // finally build the response and push to the list
    responseData.push(
      responseBuilderSimple(payload, salesforceMap, authorizationData)
    );
  });

  return responseData;
}

/**
 * Function for handling identify events
 * @param {*} message
 * @param {*} destination
 */
async function processIdentify(message, authorizationData) {
  // check the traits before hand
  const traits = getFieldValueFromMessage(message, "traits");
  if (!traits) {
    throw new Error("Invalid traits for Salesforce request");
  }

  // if traits is correct, start processing
  const responseData = [];

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
async function processSingleMessage(message, authorizationData, destination) {
  let response;
  const eventType = message.type;
  switch (eventType) {
    case EventType.IDENTIFY:
      response = await processIdentify(message, authorizationData);
      break;
    case EventType.GROUP:
      response = await processGroup(message, authorizationData);
      break;
    case EventType.TRACK:
      response = await processCustomActions(
        message,
        authorizationData,
        destination.Config.actions
      );
      break;
    default:
      throw new Error(`message type ${message.type} is not supported`);
  }
  return response;
}

async function process(event) {
  // Get the authorization header if not available
  const authorizationData = await getSFDCHeader(event.destination);
  const response = await processSingleMessage(
    event.message,
    authorizationData,
    event.destination
  );
  return response;
}

exports.process = process;

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const authorizationData = await getSFDCHeader(inputs[0].destination);
  if (!authorizationData) {
    const respEvents = getErrorRespEvents(
      inputs.map(input => input.metadata),
      400,
      "Authorisation failed"
    );
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }

        // unprocessed payload
        return getSuccessRespEvents(
          await processSingleMessage(input.message, authorizationData),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response ? error.response.status : 500, // default to retryable
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
