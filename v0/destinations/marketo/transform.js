/* eslint-disable no-nested-ternary */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
const get = require("get-value");
const stats = require("../../../util/stats");
const { EventType } = require("../../../constants");
const {
  identifyConfig,
  formatConfig,
  LEAD_LOOKUP_METRIC,
  ACTIVITY_METRIC,
  FETCH_TOKEN_METRIC,
  DESTINATION
} = require("./config");
const {
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
  populateErrStat
} = require("../../util");
const ErrorBuilder = require("../../util/error");
const Cache = require("../../util/cache");
const {
  USER_LEAD_CACHE_TTL,
  AUTH_CACHE_TTL,
  TRANSFORMER_METRIC
} = require("../../util/constant");
const {
  marketoResponseHandler,
  sendGetRequest,
  sendPostRequest
} = require("./networkResponseHandler");

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
    const response = marketoResponseHandler({
      clientResponse: await sendGetRequest(
        `https://${accountId}.mktorest.com/identity/oauth/token`,
        {
          params: {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "client_credentials"
          }
        }
      ),
      sourceMessage: "During fetching auth token",
      stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM
    });
    if (response && response.data) {
      stats.increment(FETCH_TOKEN_METRIC, 1, { status: "success" });
      return response.data.access_token;
    }
    stats.increment(FETCH_TOKEN_METRIC, 1, { status: "failed" });
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
const createOrUpdateLead = async (
  formattedDestination,
  token,
  userId,
  anonymousId
) => {
  return userIdLeadCache.get(userId || anonymousId, async () => {
    const attribute = userId ? { userId } : { anonymousId };
    stats.increment(LEAD_LOOKUP_METRIC, 1, {
      type: "userid",
      action: "create"
    });
    const { accountId } = formattedDestination;
    const response = marketoResponseHandler({
      clientResponse: await sendPostRequest(
        `https://${accountId}.mktorest.com/rest/v1/leads.json`,
        // `https://httpstat.us/200`,
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
        }
      ),
      sourceMessage: "During lookup lead",
      stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM
    });
    if (response && response.data) {
      const { result } = response.data;
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
const lookupLeadUsingEmail = async (formattedDestination, token, email) => {
  return emailLeadCache.get(email, async () => {
    stats.increment(LEAD_LOOKUP_METRIC, 1, { type: "email", action: "fetch" });
    const response = marketoResponseHandler({
      clientResponse: await sendGetRequest(
        `https://${formattedDestination.accountId}.mktorest.com/rest/v1/leads.json`,
        // `https://httpstat.us/200`,
        {
          params: { filterValues: email, filterType: "email" },
          headers: { Authorization: `Bearer ${token}` }
        }
      ),
      sourceMessage: "During lead look up using email",
      stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM
    });
    if (response && response.data) {
      const { result } = response.data;
      if (result && Array.isArray(result) && result.length > 0) {
        return result[0].id;
      }
    }
    return null;
  });
};

// lookup Marketo using userId/anonymousId
// fails transformer if lookup fails - and create if not exist is disabled
// if userId is present searches using userId else searches using anonymousId
// ------------------------
// Ref: https://developers.marketo.com/rest-api/lead-database/leads/#create_and_update
// ------------------------
const lookupLeadUsingId = async (
  formattedDestination,
  token,
  userId,
  anonymousId
) => {
  return userIdLeadCache.get(userId || anonymousId, async () => {
    stats.increment(LEAD_LOOKUP_METRIC, 1, { type: "userId", action: "fetch" });
    const response = marketoResponseHandler({
      clientResponse: await sendGetRequest(
        `https://${formattedDestination.accountId}.mktorest.com/rest/v1/leads.json`,
        {
          params: {
            filterValues: userId || anonymousId,
            filterType: userId ? "userId" : "anonymousId"
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      ),
      sourceMessage: "During lead look up using userId",
      stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM
    });
    if (response.data) {
      const { result } = response.data;
      if (result && Array.isArray(result) && result.length > 0) {
        return result[0].id;
      }
    }
    return null;
  });
};

const getLeadId = async (message, formattedDestination, token) => {
  // precedence ->>
  //  -> externalId (context.externalId[0].type == marketoLeadId)
  //  -> lookup lead using email
  //  -> lookup lead using userId or anonymousId
  //  if nothing is found check if user has given permission to create the leads
  //  -> -> if provided ---- create the lead and use that ID
  //  -> -> if not ---- throw with error

  const userId = getFieldValueFromMessage(message, "userIdOnly");
  const email = getFieldValueFromMessage(message, "email");
  let leadId = getDestinationExternalID(message, "marketoLeadId");

  // leadId is not supplied through the externalId parameter
  if (!leadId) {
    // search for lead using email
    if (email) {
      leadId = await lookupLeadUsingEmail(formattedDestination, token, email);
    } else {
      // search lead using userId or anonymousId
      leadId = await lookupLeadUsingId(
        formattedDestination,
        token,
        userId,
        message.anonymousId
      );
    }
  }

  // if leadId lookup failed
  if (!leadId) {
    // check we have permission to create lead on marketo
    if (formattedDestination.createIfNotExist) {
      leadId = await createOrUpdateLead(
        formattedDestination,
        token,
        userId,
        message.anonymousId
      );
    } else {
      throw new ErrorBuilder()
        .setStatus(400)
        .setMessage("Lead creation is turned off on the dashboard")
        .setStatTags({
          destination: DESTINATION,
          stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
          meta:
            TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META
              .CONFIGURATION
        })
        .build();
    }
  }

  if (!leadId) {
    // throwing here as lookup failed because of
    // either "anonymousId" or "userId" field is not created in marketo
    // --> resulting to lookup failure or lead doesn't exist with "email".
    //
    // In the scenario of either of these, we should abort the event and the top level
    // try-catch should handle this
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage(
        "lookup failure - either anonymousId or userId or both fields are not created in marketo"
      )
      .setStatTags({
        destination: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta:
          TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META
            .INSTRUMENTATION
      })
      .build();
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
  // get the leadId and proceed
  const { accountId, leadTraitMapping } = formattedDestination;

  const traits = getFieldValueFromMessage(message, "traits");
  if (!traits) {
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage("Invalid traits value for Marketo")
      .setStatTags({
        destination: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
      })
      .build();
  }

  const leadId = await getLeadId(message, formattedDestination, token);

  let attribute = constructPayload(traits, identifyConfig);
  Object.keys(leadTraitMapping).forEach(key => {
    const val = traits[key];
    attribute[leadTraitMapping[key]] = val;
  });
  attribute = removeUndefinedValues(attribute);

  const userId = getFieldValueFromMessage(message, "userIdOnly");
  const inputObj = {
    ...attribute,
    id: leadId
  };
  if (isDefinedAndNotNull(userId)) {
    inputObj.userId = userId;
  }
  return {
    endPoint: `https://${accountId}.mktorest.com/rest/v1/leads.json`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    payload: {
      action: "createOrUpdate",
      input: [inputObj],
      lookupField: "id"
    }
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
    customActivityPropertyMap
  } = formattedDestination;

  const userId = getFieldValueFromMessage(message, "userIdOnly");
  if (!(trackAnonymousEvents || userId)) {
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage("Anonymous event tracking is turned off and invalid userId")
      .setStatTags({
        destination: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta:
          TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.CONFIGURATION
      })
      .build();
  }

  const activityTypeId = customActivityEventMap[message.event];
  if (!activityTypeId) {
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage("Event is not mapped to Custom Activity")
      .setStatTags({
        destination: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta:
          TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.CONFIGURATION
      })
      .build();
  }

  const primaryKeyPropName = customActivityPrimaryKeyMap[message.event];
  const primaryAttributeValue = get(
    message,
    `properties.${primaryKeyPropName}`
  );
  if (!primaryAttributeValue) {
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage("Primary Key value is invalid for the event")
      .setStatTags({
        destination: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta:
          TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.CONFIGURATION
      })
      .build();
  }

  // get leadId
  const leadId = await getLeadId(message, formattedDestination, token);

  // handle custom activy attributes
  const attribute = [];
  Object.keys(customActivityPropertyMap).forEach(key => {
    // exclude the primaryKey
    if (key !== primaryKeyPropName) {
      const value = message.properties[key];
      if (isDefined(value)) {
        attribute.push({ apiName: customActivityPropertyMap[key], value });
      }
    }
  });

  const payload = {
    input: [
      {
        activityDate: getFieldValueFromMessage(message, "timestamp"),
        activityTypeId: Number.parseInt(activityTypeId, 10),
        attribute,
        leadId,
        primaryAttributeValue
      }
    ]
  };

  // metric collection
  stats.increment(ACTIVITY_METRIC, 1);

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
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage("Message Type is not present. Aborting message.")
      .setStatTags({
        destination: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
      })
      .build();
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
      throw new ErrorBuilder()
        .setStatus(400)
        .setMessage("Message type not supported")
        .setStatTags({
          destination: DESTINATION,
          stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
          meta:
            TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
        })
        .build();
  }

  // wrap response for router processing
  return responseWrapper(response);
};

const process = async event => {
  const token = await getAuthToken(formatConfig(event.destination));
  if (!token) {
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage("Authorisation failed")
      .setStatTags({
        destination: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.AUTHENTICATION.SCOPE
      })
      .build();
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
    // eslint-disable-next-line no-ex-assign
    error = populateErrStat(error, DESTINATION);
    const respEvents = getErrorRespEvents(
      inputs.map(input => input.metadata),
      error.status || 500, // default to retryable
      error.message || "Error occurred while processing payload.",
      error
    );
    return [respEvents];
  }

  // If token is null track/identify calls cannot be executed.
  if (!token) {
    const errResp = {
      status: 400,
      message: "Authorisation failed",
      statTags: {
        destination: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.AUTHENTICATION.SCOPE
      }
    };
    const respEvents = getErrorRespEvents(
      inputs.map(input => input.metadata),
      errResp.status,
      errResp.message,
      errResp
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
        // eslint-disable-next-line no-ex-assign
        error = populateErrStat(error, DESTINATION);
        return getErrorRespEvents(
          [input.metadata],
          error.status || 500,
          error.message || "Error occurred while processing payload.",
          error
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
