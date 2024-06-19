const get = require('get-value');
const cloneDeep = require('lodash/cloneDeep');
const {
  InstrumentationError,
  NetworkInstrumentationError,
  getErrorRespEvents,
} = require('@rudderstack/integrations-lib');
const { EventType, MappedToDestinationKey } = require('../../../constants');
const {
  SF_API_VERSION,
  identifyLeadMappingJson,
  identifyContactMappingJson,
  ignoredLeadTraits,
  ignoredContactTraits,
} = require('./config');
const {
  removeUndefinedValues,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  getFirstAndLastName,
  getSuccessRespEvents,
  addExternalIdToTraits,
  getDestinationExternalIDObjectForRetl,
  handleRtTfSingleEventError,
  generateErrorObject,
  isHttpStatusSuccess,
} = require('../../util');
const { salesforceResponseHandler, collectAuthorizationInfo, getAuthHeader } = require('./utils');
const { handleHttpRequest } = require('../../../adapters/network');
const { JSON_MIME_TYPE } = require('../../util/constant');

// Basic response builder
// We pass the parameterMap with any processing-specific key-value pre-populated
// We also pass the incoming payload, the hit type to be generated and
// the field mapping and credentials JSONs
function responseBuilderSimple(
  traits,
  salesforceMap,
  authorizationData,
  mapProperty,
  mappedToDestination,
  authorizationFlow,
) {
  const { salesforceType, salesforceId } = salesforceMap;

  // if id is valid, do update else create the object
  // POST for create, PATCH for update
  let targetEndpoint = `${authorizationData.instanceUrl}/services/data/v${SF_API_VERSION}/sobjects/${salesforceType}`;
  if (salesforceId) {
    targetEndpoint += `/${salesforceId}?_HttpMethod=PATCH`;
  }

  // First name and last name need to be extracted from the name field
  // get traits from the message
  let rawPayload = traits;
  // map using the config only if the type is Lead
  // If message is already mapped to destination, Do not map it using config and send traits as-is
  if (salesforceType === 'Lead' && mapProperty && !mappedToDestination) {
    // adjust the payload only for new Leads. For update do incremental update
    // adjust for firstName and lastName
    // construct the payload using the mappingJson and add extra params
    rawPayload = constructPayload(
      { ...traits, ...getFirstAndLastName(traits, 'n/a') },
      identifyLeadMappingJson,
    );
    Object.keys(traits).forEach((key) => {
      if (!ignoredLeadTraits.includes(key) && traits[key]) {
        rawPayload[`${key}__c`] = traits[key];
      }
    });
  } else if (salesforceType === 'Contact' && mapProperty && !mappedToDestination) {
    rawPayload = constructPayload(
      { ...traits, ...getFirstAndLastName(traits, 'n/a') },
      identifyContactMappingJson,
    );
    Object.keys(traits).forEach((key) => {
      if (!ignoredContactTraits.includes(key) && traits[key]) {
        rawPayload[`${key}__c`] = traits[key];
      }
    });
  }

  // delete id in the payload for events coming from rETL sources mapped with visual mapper
  if (mappedToDestination) {
    delete rawPayload.Id;
  }

  const response = defaultRequestConfig();

  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    ...getAuthHeader({ authorizationFlow, authorizationData }),
  };
  response.body.JSON = removeUndefinedValues(rawPayload);
  response.endpoint = targetEndpoint;

  return response;
}

// Look up to salesforce using details passed as external id through payload
async function getSaleforceIdForRecord(
  authorizationData,
  objectType,
  identifierType,
  identifierValue,
  { destination, metadata },
  authorizationFlow,
) {
  const objSearchUrl = `${authorizationData.instanceUrl}/services/data/v${SF_API_VERSION}/parameterizedSearch/?q=${identifierValue}&sobject=${objectType}&in=${identifierType}&${objectType}.fields=id,${identifierType}`;
  const { processedResponse: processedsfSearchResponse } = await handleHttpRequest(
    'get',
    objSearchUrl,
    {
      headers: getAuthHeader({ authorizationFlow, authorizationData }),
    },
    {
      metadata,
      destType: 'salesforce',
      feature: 'transformation',
      endpointPath: '/parameterizedSearch',
      requestMethod: 'GET',
      module: 'router',
    },
  );
  if (!isHttpStatusSuccess(processedsfSearchResponse.status)) {
    salesforceResponseHandler(
      processedsfSearchResponse,
      `:- SALESFORCE SEARCH BY ID`,
      destination.ID,
      authorizationFlow,
    );
  }
  const searchRecord = processedsfSearchResponse.response?.searchRecords?.find(
    (rec) => typeof identifierValue !== 'undefined' && rec[identifierType] === `${identifierValue}`,
  );

  return searchRecord?.Id;
}

// Check for externalId field under context and look for probable Salesforce objects
// We'll make separate requests for every Salesforce Object types present under externalIds
//
// Expected externalId map for Contact object:
//
// ------------------------
// {
//   "type": "Salesforce-Library",
//   "id": "test@gmail.com"

// }
// ------------------------
//
// We'll use the Salesforce Object names by removing "Salesforce-" string from the type field
//
// Default Object type will be "Lead" for backward compatibility
async function getSalesforceIdFromPayload(
  { message, destination, metadata },
  authorizationData,
  authorizationFlow,
) {
  // define default map
  const salesforceMaps = [];

  // get externalId
  const externalIds = get(message, 'context.externalId');
  const mappedToDestination = get(message, MappedToDestinationKey);

  // if externalIds are present look for type `Salesforce-`
  if (externalIds && Array.isArray(externalIds) && !mappedToDestination) {
    externalIds.forEach((extIdMap) => {
      const { type, id } = extIdMap;
      if (type.includes('Salesforce')) {
        salesforceMaps.push({
          salesforceType: type.replace('Salesforce-', ''),
          salesforceId: id,
        });
      }
    });
  }

  // Support All salesforce objects, do not fallback to lead in case event is mapped to destination
  if (mappedToDestination) {
    const { id, type, identifierType } = get(message, 'context.externalId.0');

    if (!id || !type || !identifierType || !type.toLowerCase().includes('salesforce')) {
      throw new InstrumentationError(
        'Invalid externalId. id, type, identifierType must be provided',
      );
    }

    const objectType = type.toLowerCase().replace('salesforce-', '');
    let salesforceId = id;

    // Fetch the salesforce Id if the identifierType is not ID
    if (identifierType.toUpperCase() !== 'ID') {
      salesforceId = await getSaleforceIdForRecord(
        authorizationData,
        objectType,
        identifierType,
        id,
        { destination, metadata },
        authorizationFlow,
      );
    }

    salesforceMaps.push({
      salesforceType: objectType,
      salesforceId,
    });
  }

  // if nothing is present consider it as a Lead Object
  // BACKWORD COMPATIBILITY
  if (salesforceMaps.length === 0 && !mappedToDestination) {
    // its a lead object. try to get lead object id using search query
    // check if the lead exists
    // need to perform a parameterized search for this using email
    const email = encodeURIComponent(getFieldValueFromMessage(message, 'email'));

    if (!email) {
      throw new InstrumentationError('Invalid Email address for Lead Objet');
    }
    const leadQueryUrl = `${authorizationData.instanceUrl}/services/data/v${SF_API_VERSION}/parameterizedSearch/?q=${email}&sobject=Lead&Lead.fields=id,IsConverted,ConvertedContactId,IsDeleted`;

    // request configuration will be conditional
    const { processedResponse: processedLeadQueryResponse } = await handleHttpRequest(
      'get',
      leadQueryUrl,
      {
        headers: getAuthHeader({ authorizationFlow, authorizationData }),
      },
      {
        metadata,
        destType: 'salesforce',
        feature: 'transformation',
        endpointPath: '/parameterizedSearch',
        requestMethod: 'GET',
        module: 'router',
      },
    );

    if (!isHttpStatusSuccess(processedLeadQueryResponse.status)) {
      salesforceResponseHandler(
        processedLeadQueryResponse,
        `:- during Lead Query`,
        destination.ID,
        authorizationFlow,
      );
    }

    if (processedLeadQueryResponse.response.searchRecords.length > 0) {
      // if count is greater than zero, it means that lead exists, then only update it
      // else the original endpoint, which is the one for creation - can be used
      const record = processedLeadQueryResponse.response.searchRecords[0];
      if (record.IsDeleted === true) {
        if (record.IsConverted) {
          throw new NetworkInstrumentationError('The contact has been deleted.');
        } else {
          throw new NetworkInstrumentationError('The lead has been deleted.');
        }
      }
      if (record.IsConverted && destination.Config.useContactId) {
        salesforceMaps.push({
          salesforceType: 'Contact',
          salesforceId: record.ConvertedContactId,
        });
      } else {
        salesforceMaps.push({
          salesforceType: 'Lead',
          salesforceId: record.Id,
        });
      }
    } else {
      salesforceMaps.push({
        salesforceType: 'Lead',
        salesforceId: undefined,
      });
    }
  }
  return salesforceMaps;
}

// Function for handling identify events
async function processIdentify(
  { message, destination, metadata },
  authorizationData,
  authorizationFlow,
) {
  const mapProperty =
    destination.Config.mapProperty === undefined ? true : destination.Config.mapProperty;
  // check the traits before hand
  const traits = getFieldValueFromMessage(message, 'traits');
  if (!traits) {
    throw new InstrumentationError('PROCESS IDENTIFY: Invalid traits for Salesforce request');
  }

  // Append external ID to traits if event is mapped to destination and only if identifier type is not id
  // If identifier type is id, then it should not be added to traits, else saleforce will throw an error
  const mappedToDestination = get(message, MappedToDestinationKey);
  const externalId = getDestinationExternalIDObjectForRetl(message, 'SALESFORCE');
  if (mappedToDestination && externalId?.identifierType?.toLowerCase() !== 'id') {
    addExternalIdToTraits(message);
  }

  // if traits is correct, start processing
  const responseData = [];

  // get salesforce object map
  const salesforceMaps = await getSalesforceIdFromPayload(
    { message, destination, metadata },
    authorizationData,
    authorizationFlow,
  );

  // iterate over the object types found
  salesforceMaps.forEach((salesforceMap) => {
    // finally build the response and push to the list
    responseData.push(
      responseBuilderSimple(
        traits,
        salesforceMap,
        authorizationData,
        mapProperty,
        mappedToDestination,
        authorizationFlow,
      ),
    );
  });

  return responseData;
}

// Generic process function which invokes specific handler functions depending on message type
// and event type where applicable
async function processSingleMessage(
  { message, destination, metadata },
  authorizationData,
  authorizationFlow,
) {
  let response;
  if (message.type === EventType.IDENTIFY) {
    response = await processIdentify(
      { message, destination, metadata },
      authorizationData,
      authorizationFlow,
    );
  } else {
    throw new InstrumentationError(`message type ${message.type} is not supported`);
  }
  return response;
}

async function process(event) {
  const authInfo = await collectAuthorizationInfo(event);
  const response = await processSingleMessage(
    event,
    authInfo.authorizationData,
    authInfo.authorizationFlow,
  );
  return response;
}

const processRouterDest = async (inputs, reqMetadata) => {
  let authInfo;
  try {
    authInfo = await collectAuthorizationInfo(inputs[0]);
  } catch (error) {
    const errObj = generateErrorObject(error);
    const respEvents = getErrorRespEvents(
      inputs.map((input) => input.metadata),
      errObj.status,
      `Authorisation failed: ${error.message}`,
      errObj.statTags,
    );
    return [{ ...respEvents, destination: inputs?.[0]?.destination }];
  }

  const respList = await Promise.all(
    inputs.map(async (input) => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(input.message, [input.metadata], input.destination);
        }

        // unprocessed payload
        return getSuccessRespEvents(
          await processSingleMessage(input, authInfo.authorizationData, authInfo.authorizationFlow),
          [input.metadata],
          input.destination,
        );
      } catch (error) {
        return handleRtTfSingleEventError(input, error, reqMetadata);
      }
    }),
  );
  return respList;
};

/**
 * This function takes the transformed output containing metadata and returns the updated metadata
 * @param {*} output
 * @returns {*} metadata
 */
const processMetadataForRouter = (output) => {
  const { metadata, destination } = output;
  const clonedMetadata = cloneDeep(metadata);
  clonedMetadata.forEach((metadataElement) => {
    // eslint-disable-next-line no-param-reassign
    metadataElement.destInfo = { authKey: destination?.ID };
  });
  return clonedMetadata;
};

module.exports = { process, processRouterDest, processMetadataForRouter };
