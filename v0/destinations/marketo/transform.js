/* eslint-disable no-nested-ternary */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
const get = require("get-value");
const { EventType } = require("../../../constants");
const { identifyConfig, formatConfig } = require("./config");
const {
  isDefinedAndNotNull,
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig,
  getFieldValueFromMessage,
  getDestinationExternalID,
  getSuccessRespEvents,
  getErrorRespEvents
} = require("../../util");
const { getAxiosResponse, postAxiosResponse } = require("../../util/network");
const Cache = require("../../util/cache");
const { USER_LEAD_CACHE_TTL, AUTH_CACHE_TTL } = require("../../util/constant");

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
const getAuthToken = async formattedDestination => {
  return authCache.get(formattedDestination.ID, async () => {
    const { accountId, clientId, clientSecret } = formattedDestination;
    const resp = await getAxiosResponse(
      `https://${accountId}.mktorest.com/identity/oauth/token`,
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "client_credentials"
        }
      },
      formattedDestination.responseRules
        ? formattedDestination.responseRules
        : null,
      "During getting auth token"
    );
    if (resp) {
      return resp.access_token;
    }
    return null;
  });
};

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
const lookupLead = async (
  formattedDestination,
  accountId,
  token,
  userId,
  anonymousId
) => {
  return userIdLeadCache.get(userId || anonymousId, async () => {
    const attribute = userId ? { userId } : { anonymousId };
    const resp = await postAxiosResponse(
      `https://${accountId}.mktorest.com/rest/v1/leads.json`,
      {
        action: "createOrUpdate",
        input: [attribute],
        lookupField: userId ? "userId" : "anonymousId"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json"
        }
      },
      formattedDestination ? formattedDestination.responseRules : null,
      "During lookup lead"
    );
    if (resp) {
      const { result } = resp;
      if (result && Array.isArray(result) && result.length > 0) {
        return result[0].id;
      }
    }
    return null;
  });
};

// lookup Marketo using email
// fails transformer if lookup fails - fields are not created in Marketo
// ------------------------
// Ref: https://developers.marketo.com/rest-api/lead-database/leads/#create_and_update
// ------------------------
const lookupLeadUsingEmail = async (
  formattedDestination,
  accountId,
  token,
  email
) => {
  return emailLeadCache.get(email, async () => {
    const resp = await getAxiosResponse(
      `https://${accountId}.mktorest.com/rest/v1/leads.json`,
      {
        params: { filterValues: email, filterType: "email" },
        headers: { Authorization: `Bearer ${token}` }
      },
      formattedDestination ? formattedDestination.responseRules : null,
      "During lead look up using email"
    );
    if (resp) {
      const { result } = resp;
      if (result && Array.isArray(result) && result.length > 0) {
        return result[0].id;
      }
    }
    return null;
  });
};

// Handles identify calls
// ------------------------
// Ref: https://developers.marketo.com/rest-api/lead-database/leads/#create_and_update
// Section: Create and Update
// ------------------------
// Almost same as leadId lookup. Noticable difference from lookup is we'll using
// `id` i.e. leadId as lookupField at the end of it
const processIdentify = async (
  message,
  formattedDestination,
  destinationDefinition,
  token
) => {
  // get bearer token
  // lookup using email. if present use that
  // else lookup using userId
  // if exists use that leadId
  // else make the call to create the lead
  const { accountId, leadTraitMapping } = formattedDestination;

  const traits = getFieldValueFromMessage(message, "traits");
  if (!traits) {
    throw new Error("Invalid traits value for Marketo");
  }

  const userId = getFieldValueFromMessage(message, "userIdOnly");

  const email = getFieldValueFromMessage(message, "email");
  let leadId = getDestinationExternalID(message, "marketoLeadId");
  if (!leadId) {
    if (email) {
      leadId = await lookupLeadUsingEmail(
        formattedDestination,
        accountId,
        token,
        email
      );
    } else {
      leadId = await lookupLead(
        formattedDestination,
        accountId,
        token,
        userId,
        message.anonymousId
      );
    }
  }

  leadId = null;

  if (!leadId) {
    // throwing here as lookup failed because of
    // either "anonymousId" or "userId" field is not created in marketo - resulting to lookup failure
    // or lead doesn't exist with "email".
    //
    // In the scenario of either of these, we should abort the event and the top level
    // try-catch should handle this
    const error = new Error("Lead lookup failed");
    error.code = 400;
    throw error;
  }

  const attribute = constructPayload(traits, identifyConfig);
  Object.keys(leadTraitMapping).forEach(key => {
    const val = traits[key];
    if (isDefinedAndNotNull(val)) {
      attribute[leadTraitMapping[key]] = val;
    }
  });

  return {
    endPoint: `https://${accountId}.mktorest.com/rest/v1/leads.json`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    payload: {
      action: "createOrUpdate",
      input: [
        {
          ...attribute,
          id: leadId,
          userId
        }
      ],
      lookupField: "id"
    }
  };
};

// process track events - only mapped events
// ------------------------
// Ref: https://developers.marketo.com/rest-api/endpoint-reference/lead-database-endpoint-reference/#!/Activities/addCustomActivityUsingPOST
const processTrack = async (
  message,
  destination,
  destinationDefinition,
  token
) => {
  // check if trackAnonymousEvent is turned off and userId is not present - fail
  // check if the event is mapped in customActivityEventMap. if not - fail
  // get primaryKey name for the event
  // - get the value from properties with that name
  // - check if the value is valid. if not - fail
  //
  // get bearer token
  // loop up using userId/anonymousId and get the leadId
  // format the payload

  const {
    trackAnonymousEvents,
    accountId,
    customActivityEventMap,
    customActivityPrimaryKeyMap,
    customActivityPropertyMap
  } = destination;

  const userId = getFieldValueFromMessage(message, "userIdOnly");
  if (!(trackAnonymousEvents || userId)) {
    throw new Error(
      "Anonymous event tracking is turned off and invalid userId"
    );
  }

  const activityTypeId = customActivityEventMap[message.event];
  if (!activityTypeId) {
    throw new Error("Event is not mapped to Custom Activity");
  }

  const primaryKeyPropName = customActivityPrimaryKeyMap[message.event];
  const primaryAttributeValue = get(
    message,
    `properties.${primaryKeyPropName}`
  );
  if (!primaryAttributeValue) {
    throw new Error("Primary Key value is invalid for the event");
  }

  // get leadId
  let leadId = getDestinationExternalID(message, "marketoLeadId");
  if (!leadId) {
    leadId = await lookupLead(
      destinationDefinition,
      accountId,
      token,
      userId,
      message.anonymousId
    );
  }
  if (!leadId) {
    const error = new Error("Lead lookup failed");
    error.code = 400;
    throw error;
  }

  // handle custom activy attributes
  const attributes = [];
  Object.keys(customActivityPropertyMap).forEach(key => {
    // exclude the primaryKey
    if (key !== primaryKeyPropName) {
      const value = message.properties[key];
      if (value) {
        attributes.push({ apiName: customActivityPropertyMap[key], value });
      }
    }
  });

  const payload = {
    input: [
      {
        activityDate: getFieldValueFromMessage(message, "timestamp"),
        activityTypeId: Number.parseInt(activityTypeId, 10),
        attributes,
        leadId,
        primaryAttributeValue
      }
    ]
  };

  return {
    endPoint: `https://${accountId}.mktorest.com/rest/v1/activities/external.json`,
    headers: { Authorization: `Bearer ${token}` },
    payload
  };
};

const responseWrapper = response => {
  const resp = defaultRequestConfig();
  resp.endpoint = response.endPoint;
  resp.method = defaultPostRequestConfig.requestMethod;
  resp.headers = { ...response.headers, "Content-Type": "application/json" };
  resp.body.JSON = response.payload;
  return resp;
};

const processEvent = async (message, destination, token) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await processIdentify(
        message,
        formatConfig(destination),
        destination.DestinationDefinition,
        token
      );
      break;
    case EventType.TRACK:
      response = await processTrack(
        message,
        formatConfig(destination),
        destination.DestinationDefinition,
        token
      );
      break;
    default:
      throw new Error("Message type not supported");
  }

  // wrap response for router processing
  return responseWrapper(response);
};

const process = async event => {
  const token = await getAuthToken(formatConfig(event.destination));
  if (!token) {
    throw Error("Authorisation failed");
  }
  const response = await processEvent(event.message, event.destination, token);
  return response;
};

const processRouterDest = async inputs => {
  // Token needs to be generated for marketo which will be done on input level.
  // If destination information is not present Error should be thrown
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }
  let token;
  try {
    token = await getAuthToken(formatConfig(inputs[0].destination));
  } catch (error) {
    const respEvents = getErrorRespEvents(
      inputs.map(input => input.metadata),
      error.response ? error.response.status : 500, // default to retryable
      error.message || "Error occurred while processing payload."
    );
    return [respEvents];
  }

  // If token is null track/identify calls cannot be executed.
  if (!token) {
    const respEvents = getErrorRespEvents(
      inputs.map(input => input.metadata),
      400,
      "Authorisation failed"
    );
    return [respEvents];
  }

  // Checking previous status Code. Initially setting to false.
  // If true then previous status is 500 and every subsequent event output should be
  // sent with status code 500 to the router to be retried.
  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        return getSuccessRespEvents(
          await processEvent(input.message, input.destination, token),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 500,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
