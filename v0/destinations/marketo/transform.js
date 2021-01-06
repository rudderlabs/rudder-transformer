/* eslint-disable no-await-in-loop */
const get = require("get-value");
const axios = require("axios");
const { EventType } = require("../../../constants");
const { identifyConfig, formatConfig } = require("./config");
const {
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig,
  getFieldValueFromMessage
} = require("../../util");

// //////////////////////////////////////////////////////////////////////
// BASE URL REF: https://developers.marketo.com/rest-api/base-url/
// //////////////////////////////////////////////////////////////////////

// calls Marketo Auth API and fetches bearer token
// fails the transformer if auth fails
// ------------------------
// Ref: https://developers.marketo.com/rest-api/authentication/#creating_an_access_token
const getAuthToken = async destination => {
  const { accountId, clientId, clientSecret } = destination;
  const resp = await axios
    .get(`https://${accountId}.mktorest.com/identity/oauth/token`, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials"
      }
    })
    .catch(error => {
      throw error;
    });

  if (resp.data) {
    return resp.data.access_token;
  }

  return null;
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
const lookupLead = async (accountId, token, userId, anonymousId) => {
  const attribute = userId ? { userId } : { anonymousId };
  const resp = await axios
    .post(
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
      }
    )
    .catch(error => {
      throw error;
    });

  if (resp.data) {
    const { result } = resp.data;
    if (result && Array.isArray(result) && result.length > 0) {
      return result[0].id;
    }
  }
  return null;
};

// lookup Marketo using email
// fails transformer if lookup fails - fields are not created in Marketo
// ------------------------
// Ref: https://developers.marketo.com/rest-api/lead-database/leads/#create_and_update
// ------------------------
const lookupLeadUsingEmail = async (accountId, token, email) => {
  const resp = await axios
    .get(`https://${accountId}.mktorest.com/rest/v1/leads.json`, {
      params: { filterValues: email, filterType: "email" },
      headers: { Authorization: `Bearer ${token}` }
    })
    .catch(error => {
      throw error;
    });

  if (resp.data) {
    const { result } = resp.data;
    if (result && Array.isArray(result) && result.length > 0) {
      return result[0].id;
    }
  }
  return null;
};

// Handles identify calls
// ------------------------
// Ref: https://developers.marketo.com/rest-api/lead-database/leads/#create_and_update
// Section: Create and Update
// ------------------------
// Almost same as leadId lookup. Noticable difference from lookup is we'll using
// `id` i.e. leadId as lookupField at the end of it
const processIdentify = async (message, destination, token) => {
  // get bearer token
  // lookup using email. if present use that
  // else lookup using userId
  // if exists use that leadId
  // else make the call to create the lead
  const { accountId, leadTraitMapping } = destination;

  const traits = getFieldValueFromMessage(message, "traits");

  if (!traits) {
    throw new Error("Invalid traits value for Marketo");
  }

  const userId = getFieldValueFromMessage(message, "userIdOnly");

  const email = getFieldValueFromMessage(message, "email");
  const leadId =
    (email && (await lookupLeadUsingEmail(accountId, token, email))) ||
    (await lookupLead(accountId, token, userId, message.anonymousId));

  if (!leadId) {
    throw new Error("Lead lookup failed");
  }

  const attribute = constructPayload(traits, identifyConfig);
  Object.keys(leadTraitMapping).forEach(key => {
    const val = traits[key];
    if (val) {
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
const processTrack = async (message, destination, token) => {
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
  const leadId = await lookupLead(
    accountId,
    token,
    userId,
    message.anonymousId
  );
  if (!leadId) {
    throw new Error("Lead lookup failed");
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
        token
      );
      break;
    case EventType.TRACK:
      response = await processTrack(message, formatConfig(destination), token);
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

/**  create output according to  {
      "message": {},
      "metadata": [],
      "batched": false,
      "statusCode": 500,
      "error": "",
      "destination": { "ID": "a", "url": "a" }
    }
    */
// Success responses
const getSuccessRespEvents = (message, metadata, destination) => {
  const returnResponse = {};
  returnResponse.message = message;
  returnResponse.metadata = metadata;
  returnResponse.batched = false;
  returnResponse.statusCode = 200;
  returnResponse.destination = destination;
  return returnResponse;
};

// Error responses
const getErrorRespEvents = (metadata, statusCode, error) => {
  const returnResponse = {};
  returnResponse.metadata = metadata;
  returnResponse.batched = false;
  returnResponse.statusCode = statusCode;
  returnResponse.error = error;
  return returnResponse;
};

const processRouterDest = async input => {
  // Token needs to be generated for marketo which will be done on input level.
  // If destination information is not present Error should be thrown
  if (!Array.isArray(input) || input.length <= 0) {
    const respEvents = getErrorRespEvents(
      null,
      400,
      "Destination config not present for event"
    );
    return [respEvents];
  }
  let token;
  try {
    token = await getAuthToken(formatConfig(input[0].destination));
  } catch (error) {
    const respEvents = getErrorRespEvents(
      input.map(ev => ev.metadata),
      error.response ? error.response.status : 400,
      error.message || "Error occurred while processing payload."
    );
    return [respEvents];
  }
  // If token is null track/identify calls cannot be executed.
  if (!token) {
    const respEvents = getErrorRespEvents(
      input.map(ev => ev.metadata),
      400,
      "Authorisation failed"
    );
    return [respEvents];
  }
  const respList = [];
  // Checking previous status Code. Initially setting to false.
  // If true then previous status is 500 and every subsequent event output should be sent with status code 500 to the router to be retried.
  let prevStatus = false;
  for (let i = 0; i < input.length; i += 1) {
    const inputs = input[i];
    let respEvents = {};
    if (prevStatus) {
      respEvents = getErrorRespEvents(
        [inputs.metadata],
        500,
        "Skipping external API call"
      );
      respList.push(respEvents);
    } else {
      try {
        respEvents = getSuccessRespEvents(
          await processEvent(inputs.message, inputs.destination, token),
          [inputs.metadata],
          inputs.destination
        );
        respList.push(respEvents);
      } catch (error) {
        respEvents = getErrorRespEvents(
          [inputs.metadata],
          error.response ? error.response.status : 400,
          error.message || "Error occurred while processing payload."
        );
        prevStatus = respEvents.statusCode === 500;
        respList.push(respEvents);
      }
    }
  }

  return respList;
};

module.exports = { process, processRouterDest };
