/* eslint-disable no-nested-ternary */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
const get = require('get-value');
const cloneDeep = require('lodash/cloneDeep');
const stats = require('../../../util/stats');
const { EventType, MappedToDestinationKey } = require('../../../constants');
const {
  identifyConfig,
  formatConfig,
  LEAD_LOOKUP_METRIC,
  ACTIVITY_METRIC,
  FETCH_TOKEN_METRIC,
} = require('./config');
const {
  addExternalIdToTraits,
  getDestinationExternalIDInfoForRetl,
  isDefined,
  removeUndefinedValues,
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig,
  getFieldValueFromMessage,
  getDestinationExternalID,
  getSuccessRespEvents,
  getErrorRespEvents,
  isDefinedAndNotNull,
  generateErrorObject,
  checkInvalidRtTfEvents,
  handleRtTfSingleEventError,
} = require('../../util');
const Cache = require('../../util/cache');
const { USER_LEAD_CACHE_TTL, AUTH_CACHE_TTL, JSON_MIME_TYPE } = require('../../util/constant');
const {
  marketoResponseHandler,
  sendGetRequest,
  sendPostRequest,
  getResponseHandlerData,
} = require('./util');
const logger = require('../../../logger');
const {
  InstrumentationError,
  ConfigurationError,
  UnauthorizedError,
} = require('../../util/errorTypes');

const userIdLeadCache = new Cache(USER_LEAD_CACHE_TTL); // 1 day
const emailLeadCache = new Cache(USER_LEAD_CACHE_TTL); // 1 day
const authCache = new Cache(AUTH_CACHE_TTL); // 1 hr

// //////////////////////////////////////////////////////////////////////
// BASE URL REF: https://developers.marketo.com/rest-api/base-url/
// //////////////////////////////////////////////////////////////////////

// calls Marketo Auth API and fetches bearer token
// fails the transformer if auth fails
// ------------------------
// Ref: https://developers.marketo.com/rest-api/authentication/#creating_an_access_token
const getAuthToken = async (formattedDestination) =>
  authCache.get(formattedDestination.ID, async () => {
    const { accountId, clientId, clientSecret } = formattedDestination;
    const clientResponse = await sendGetRequest(
      `https://${accountId}.mktorest.com/identity/oauth/token`,
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials',
        },
      },
    );
    const data = marketoResponseHandler(clientResponse, 'During fetching auth token');
    if (data) {
      stats.increment(FETCH_TOKEN_METRIC, { status: 'success' });
      return { value: data.access_token, age: data.expires_in };
    }
    stats.increment(FETCH_TOKEN_METRIC, { status: 'failed' });
    return null;
  });

// lookup Marketo with userId or anonymousId
// Marketo will create the lead
// fails transformer if lookup fails - fields are not created in Marketo
// ------------------------
// Ref: https://developers.marketo.com/rest-api/lead-database/leads/#create_and_update
// Section: Create and Update
// ------------------------
// In this request, you’ll see two important fields, action and lookupField.
// action specifies the operation type of the request, and can be
// createOrUpdate, createOnly, updateOnly, or createDuplicate.
// If it is omitted, the action defaults to createOrUpdate.
// The lookupField parameter specifies the key to use in the operation.
// If lookupField is omitted, the default key is email.
// ------------------------
// Thus we'll always be using createOrUpdate
const createOrUpdateLead = async (formattedDestination, token, userId, anonymousId) =>
  userIdLeadCache.get(userId || anonymousId, async () => {
    const attribute = userId ? { userId } : { anonymousId };
    stats.increment(LEAD_LOOKUP_METRIC, {
      type: 'userid',
      action: 'create',
    });
    const { accountId } = formattedDestination;
    const clientResponse = await sendPostRequest(
      `https://${accountId}.mktorest.com/rest/v1/leads.json`,
      // `https://httpstat.us/200`,
      {
        action: 'createOrUpdate',
        input: [attribute],
        lookupField: userId ? 'userId' : 'anonymousId',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': JSON_MIME_TYPE,
        },
      },
    );
    const data = getResponseHandlerData(
      clientResponse,
      '[Marketo Transformer]: During lookup lead',
      formattedDestination,
      authCache,
    );
    if (data) {
      const { result } = data;
      if (result && Array.isArray(result) && result.length > 0) {
        return result[0].id;
      }
    }
    return null;
  });

// lookup Marketo using email
// fails transformer if lookup fails - fields are not created in Marketo
// ------------------------
// Ref: https://developers.marketo.com/rest-api/lead-database/leads/#create_and_update
// ------------------------
const lookupLeadUsingEmail = async (formattedDestination, token, email) =>
  emailLeadCache.get(email, async () => {
    stats.increment(LEAD_LOOKUP_METRIC, { type: 'email', action: 'fetch' });
    const clientResponse = await sendGetRequest(
      `https://${formattedDestination.accountId}.mktorest.com/rest/v1/leads.json`,
      // `https://httpstat.us/200`,
      {
        params: { filterValues: email, filterType: 'email' },
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = getResponseHandlerData(
      clientResponse,
      '[Marketo Transformer]: During lead look up using email',
      formattedDestination,
      authCache,
    );
    if (data) {
      const { result } = data;
      if (result && Array.isArray(result) && result.length > 0) {
        return result[0].id;
      }
    }
    return null;
  });

// lookup Marketo using userId/anonymousId
// fails transformer if lookup fails - and create if not exist is disabled
// if userId is present searches using userId else searches using anonymousId
// ------------------------
// Ref: https://developers.marketo.com/rest-api/lead-database/leads/#create_and_update
// ------------------------
const lookupLeadUsingId = async (formattedDestination, token, userId, anonymousId) =>
  userIdLeadCache.get(userId || anonymousId, async () => {
    stats.increment(LEAD_LOOKUP_METRIC, { type: 'userId', action: 'fetch' });
    const clientResponse = await sendGetRequest(
      `https://${formattedDestination.accountId}.mktorest.com/rest/v1/leads.json`,
      {
        params: {
          filterValues: userId || anonymousId,
          filterType: userId ? 'userId' : 'anonymousId',
        },
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = getResponseHandlerData(
      clientResponse,
      '[Marketo Transformer]: During lead look up using userId',
      formattedDestination,
      authCache,
    );
    if (data) {
      const { result } = data;
      if (result && Array.isArray(result) && result.length > 0) {
        return result[0].id;
      }
    }
    return null;
  });

const getLeadId = async (message, formattedDestination, token) => {
  // precedence ->>
  //  -> externalId (context.externalId[0].type == marketoLeadId)
  //  -> lookup lead using email
  //  -> lookup lead using userId or anonymousId
  //  if nothing is found check if user has given permission to create the leads
  //  -> -> if provided ---- create the lead and use that ID
  //  -> -> if not ---- throw with error

  const userId = getFieldValueFromMessage(message, 'userIdOnly');
  const email = getFieldValueFromMessage(message, 'email');
  // check if marketo lead id is set in the externalId through rETL
  // "externalId": [
  //   {
  //     "id": "lynnanderson@smith.net",
  //     "identifierType": "email",
  //     "type": "MARKETO-{object}"
  //   }
  let leadId = getDestinationExternalIDInfoForRetl(message, 'MARKETO').destinationExternalId;
  if (!leadId) {
    leadId = getDestinationExternalID(message, 'marketoLeadId');
  }

  // leadId is not supplied through the externalId parameter
  if (!leadId) {
    // search for lead using email
    if (email) {
      leadId = await lookupLeadUsingEmail(formattedDestination, token, email);
    } else {
      // search lead using userId or anonymousId
      leadId = await lookupLeadUsingId(formattedDestination, token, userId, message.anonymousId);
    }
  }

  // if leadId lookup failed
  if (!leadId) {
    // check we have permission to create lead on marketo
    if (formattedDestination.createIfNotExist) {
      leadId = await createOrUpdateLead(formattedDestination, token, userId, message.anonymousId);
    } else {
      throw new ConfigurationError('Lead creation is turned off on the dashboard');
    }
  }

  if (!leadId) {
    // throwing here as lookup failed because of
    // either "anonymousId" or "userId" field is not created in marketo
    // --> resulting to lookup failure or lead doesn't exist with "email".
    //
    // In the scenario of either of these, we should abort the event and the top level
    // try-catch should handle this
    throw new InstrumentationError(
      'lookup failure - either anonymousId or userId or both fields are not created in marketo',
    );
  }

  return leadId;
};

// Handles identify calls
// ------------------------
// Ref: https://developers.marketo.com/rest-api/lead-database/leads/#create_and_update
// Section: Create and Update
// ------------------------
// Almost same as leadId lookup. Noticable difference from lookup is we'll using
// `id` i.e. leadId as lookupField at the end of it
const processIdentify = async (message, formattedDestination, token) => {
  // If mapped to destination, Add externalId to traits
  if (get(message, MappedToDestinationKey)) {
    addExternalIdToTraits(message);
  }
  // get the leadId and proceed
  const { accountId, leadTraitMapping } = formattedDestination;

  const traits = getFieldValueFromMessage(message, 'traits');
  if (!traits) {
    throw new InstrumentationError('Invalid traits value for Marketo');
  }

  const leadId = await getLeadId(message, formattedDestination, token);

  let attribute = constructPayload(traits, identifyConfig);
  // leadTraitMapping will not be used if mapping is done through VDM in rETL
  if (!get(message, MappedToDestinationKey)) {
    Object.keys(leadTraitMapping).forEach((key) => {
      const val = traits[key];
      attribute[leadTraitMapping[key]] = val;
    });
    attribute = removeUndefinedValues(attribute);
  } else {
    attribute = removeUndefinedValues(traits);
  }

  const userId = getFieldValueFromMessage(message, 'userIdOnly');
  const inputObj = {
    ...attribute,
    id: leadId,
  };
  if (isDefinedAndNotNull(userId)) {
    inputObj.userId = userId;
  }
  let endPoint = `https://${accountId}.mktorest.com/rest/v1/leads.json`;
  let payload = {
    action: 'createOrUpdate',
    input: [inputObj],
    lookupField: 'id',
  };
  // handled if vdm enabled
  if (get(message, MappedToDestinationKey)) {
    const { objectType } = getDestinationExternalIDInfoForRetl(message, 'MARKETO');
    // if leads object then will fallback to the already existing endpoint and payload
    if (objectType !== 'leads') {
      endPoint = `https://${accountId}.mktorest.com/rest/v1/customobjects/${objectType}.json`;
      // we will be using the dedupeBy dedupeFields for this endpoint
      // DOC: https://developers.marketo.com/rest-api/lead-database/custom-objects/#create_and_update
      // if marketoGUID is mapped it should be removed before sending to marketo as for this type the following error can arise
      // Field 'marketoGUID' not updateable or Field 'marketoGUID' is not allowed when dedupeBy is 'dedupeFields'
      if (traits.marketoGUID) {
        delete traits.marketoGUID;
      }
      const input = [removeUndefinedValues(traits)];
      payload = {
        action: 'createOrUpdate',
        dedupeBy: 'dedupeFields',
        input,
      };
    }
  }
  return {
    endPoint,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    payload,
  };
};

// process track events - only mapped events
// ------------------------
// Ref: https://developers.marketo.com/rest-api/endpoint-reference/lead-database-endpoint-reference/#!/Activities/addCustomActivityUsingPOST
const processTrack = async (message, formattedDestination, token) => {
  // check if trackAnonymousEvent is turned off and userId is not present - fail
  // check if the event is mapped in customActivityEventMap. if not - fail
  // get primaryKey name for the event
  // - get the value from properties with that name
  // - check if the value is valid. if not - fail
  //
  // get the leadId and proceed
  // format the payload

  const {
    trackAnonymousEvents,
    accountId,
    customActivityEventMap,
    customActivityPrimaryKeyMap,
    customActivityPropertyMap,
  } = formattedDestination;

  const userId = getFieldValueFromMessage(message, 'userIdOnly');
  if (!(trackAnonymousEvents || userId)) {
    throw new ConfigurationError('Anonymous event tracking is turned off and invalid userId');
  }

  const activityTypeId = customActivityEventMap[message.event];
  if (!activityTypeId) {
    throw new ConfigurationError('Event is not mapped to Custom Activity');
  }

  const primaryKeyPropName = customActivityPrimaryKeyMap[message.event];
  const primaryAttributeValue = get(message, `properties.${primaryKeyPropName}`);
  if (!primaryAttributeValue) {
    throw new ConfigurationError('Primary Key value is invalid for the event');
  }

  // get leadId
  const leadId = await getLeadId(message, formattedDestination, token);

  // handle addition of custom activity attributes
  // Reference: https://developers.marketo.com/rest-api/lead-database/activities/#add_custom_activities

  const attributes = [];
  Object.keys(customActivityPropertyMap).forEach((key) => {
    // exclude the primaryKey
    if (key !== primaryKeyPropName) {
      const value = message.properties[key];
      if (isDefined(value)) {
        attributes.push({ name: customActivityPropertyMap[key], value });
      }
    }
  });

  const payload = {
    input: [
      {
        activityDate: getFieldValueFromMessage(message, 'timestamp'),
        activityTypeId: Number.parseInt(activityTypeId, 10),
        attributes,
        leadId,
        primaryAttributeValue,
      },
    ],
  };

  // metric collection
  stats.increment(ACTIVITY_METRIC);

  return {
    endPoint: `https://${accountId}.mktorest.com/rest/v1/activities/external.json`,
    headers: { Authorization: `Bearer ${token}` },
    payload,
  };
};

const responseWrapper = (response) => {
  const resp = defaultRequestConfig();
  resp.endpoint = response.endPoint;
  resp.method = defaultPostRequestConfig.requestMethod;
  resp.headers = { ...response.headers, 'Content-Type': JSON_MIME_TYPE };
  resp.body.JSON = response.payload;
  return resp;
};

const processEvent = async (message, destination, token) => {
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }
  const messageType = message.type.toLowerCase();
  const formattedDestination = formatConfig(destination);

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await processIdentify(message, formattedDestination, token);
      break;
    case EventType.TRACK:
      response = await processTrack(message, formattedDestination, token);
      break;
    default:
      throw new InstrumentationError('Message type not supported');
  }

  // wrap response for router processing
  return responseWrapper(response);
};

const process = async (event) => {
  const token = await getAuthToken(formatConfig(event.destination));
  if (!token) {
    throw new UnauthorizedError('Authorization failed');
  }
  const response = await processEvent(event.message, event.destination, token);
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  // Token needs to be generated for marketo which will be done on input level.
  // If destination information is not present Error should be thrown
  const errorRespEvents = checkInvalidRtTfEvents(inputs);
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }
  let token;
  try {
    token = await getAuthToken(formatConfig(inputs[0].destination));

    // If token is null track/identify calls cannot be executed.
    if (!token) {
      throw new UnauthorizedError('Authorization failed');
    }
  } catch (error) {
    logger.error('Router Transformation problem:');
    const errObj = generateErrorObject(error);
    logger.error(errObj);
    const respEvents = getErrorRespEvents(
      inputs.map((input) => input.metadata),
      errObj.status,
      errObj.message,
      errObj.statTags,
    );
    return [{ ...respEvents, destination: inputs?.[0]?.destination }];
  }

  // Checking previous status Code. Initially setting to false.
  // If true then previous status is 500 and every subsequent event output should be
  // sent with status code 500 to the router to be retried.
  const respList = await Promise.all(
    inputs.map(async (input) => {
      try {
        return getSuccessRespEvents(
          await processEvent(input.message, input.destination, token),
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
function processMetadataForRouter(output) {
  const { metadata, destination } = output;
  const clonedMetadata = cloneDeep(metadata);
  clonedMetadata.forEach((metadataElement) => {
    // eslint-disable-next-line no-param-reassign
    metadataElement.destInfo = { authKey: destination?.ID };
  });
  return clonedMetadata;
}

module.exports = {
  process,
  processRouterDest,
  processMetadataForRouter,
  authCache,
  getAuthToken,
};
