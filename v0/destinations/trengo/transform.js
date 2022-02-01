/* eslint-disable no-nested-ternary */
/* eslint-disable no-prototype-builtins */
const Handlebars = require("handlebars");
const axios = require("axios");
const get = require("get-value");
const { EventType } = require("../../../constants");
const { EndPoints, BASE_URL } = require("./config");
const {
  getHashFromArray,
  removeUndefinedAndNullValues
} = require("../../util");
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  getFieldValueFromMessage,
  getDestinationExternalID,
  getSuccessRespEvents,
  getStringValueOfJSON,
  getErrorRespEvents,
  CustomError
} = require("../../util");

/**
 *
 * @param {*} message
 * @param {*} destination
 *
 * This func returns specific template based on event that is
 * sent (Track calls). If the event is not listed in the keys of the mapping
 * we will not process the event. In order to process specific events
 * it needs to be present in the mapping keys.
 */
const getTemplate = (message, destination) => {
  const { event } = message;
  const { eventTemplateMap } = destination.Config;
  const hashMap = getHashFromArray(eventTemplateMap, "from", "to", false);
  if (!Object.keys(hashMap).includes(event)) {
    throw new CustomError(
      `[Trengo] :: ${event} is not present in Event-Map template keys, aborting event`,
      400
    );
  }

  return message.event ? hashMap[message.event] : null;
};

/**
 *
 * @param {*} email
 * @param {*} phone
 * @param {*} channelIdentifier
 * Based on type of channelIdentifier selected from destination dashboard
 * we check the presence of required property which is email or phone either
 * has to be present based on destination settings.
 */
const validate = (email, phone, channelIdentifier) => {
  if (
    (channelIdentifier === "phone" && !phone) ||
    (channelIdentifier === "email" && !email)
  ) {
    throw new CustomError(
      `[Trengo] :: Mandatory field for Channel-Identifier :${channelIdentifier} not present`,
      400
    );
  }
};

/**
 *
 * @param {*} term
 * @param {*} destination
 *
 * This function looks up contact details and returns the contactId if found.
 * For duplicate contact found for a specific identifier it will return error
 * (as this func is used for updating and lodging tickets for a contact) hence
 * it will not work for duplicates.
 *
 * In case no contact is founf for a particular identifer it returns -1
 */
const lookupContact = async (term, destination) => {
  let res;
  try {
    res = await axios.get(`${BASE_URL}/contacts?page=1&term=${term}`, {
      headers: {
        Authorization: `Bearer ${destination.Config.apiToken}`
      }
    });
  } catch (err) {
    // check if exists err.response && err.response.status else 500
    if (err.response && err.response.status) {
      throw new CustomError(err.response.statusText, err.response.status);
    }
    throw new CustomError(
      "[Trengo] :: Inside lookupContact, failed to make request",
      500
    );
  }
  if (
    res &&
    res.status === 200 &&
    res.data &&
    res.data.data &&
    Array.isArray(res.data.data)
  ) {
    const { data } = res.data;
    if (data.length > 1) {
      throw new CustomError(
        `[Trengo] :: Inside lookupContact, duplicates present for identifer : ${term}`,
        400
      );
    } else if (data.length === 1) {
      return data[0].id;
    }
    return -1;
  }
  return null;
};
/**
 *
 * @param {*} message
 * @param {*} destination
 * @param {*} identifier
 * @param {*} cretaeScope
 *
 * This function cretaes contact payload
 * Based on create-scope flag it will either create payload
 * for cretaing contact or for updating contact.
 *
 */
const contactBuilderTrengo = async (
  message,
  destination,
  identifier,
  extIds,
  createScope = true
) => {
  let result;

  // External id will override the channelId
  const externalId = get(extIds, "externalId");
  const contactName = getFieldValueFromMessage(message, "name")
    ? getFieldValueFromMessage(message, "name")
    : `${getFieldValueFromMessage(
        message,
        "firstName"
      )} ${getFieldValueFromMessage(message, "lastName")}`;

  if (createScope) {
    // In create scope we directly create the payload for creating new contact
    // based on the info we have.

    let payload = {
      name: contactName,
      identifier,
      channel_id: externalId || destination.Config.channelId
    };
    payload = removeUndefinedAndNullValues(payload);
    result = {
      payload,
      endpoint: `${BASE_URL}/channels/${externalId ||
        destination.Config.channelId}/contacts`,
      method: "POST"
    };
  } else {
    // If we are in update scope we need to search the contact and get the contactId
    // using the identifier (email/phone) we have.
    let contactId = get(extIds, "contactId");
    if (!contactId) {
      // If we alrady dont have contactId in our message we do lookup
      contactId = await lookupContact(identifier, destination);
      if (!contactId) {
        // In case contactId is returned null we throw error (This indicates and search API issue in trengo end)
        throw new CustomError(
          `[Trengo] :: LookupContact failed for term:${identifier} update failed, aborting as dedup option is enabled`,
          400
        );
      }
      // In case we did not find the contact for this identifier we return -1
      if (contactId === -1) {
        return -1;
      }
    }

    // If we get contactId we update that contact with below payload
    let payload = {
      name: contactName
    };
    payload = removeUndefinedAndNullValues(payload);
    result = {
      payload,
      endpoint: `${BASE_URL}/contacts/${contactId}`,
      method: "PUT"
    };
  }
  return result;
};

const ticketBuilderTrengo = async (message, destination, identifer, extIds) => {
  let subjectLine;
  const template = getTemplate(message, destination);
  const externalId = get(extIds, "externalId");
  let contactId = get(extIds, "contactId");
  if (!contactId) {
    contactId = await lookupContact(identifer, destination);
    if (!contactId) {
      throw new CustomError(
        `[Trengo] :: LookupContact failed for term:${identifer} track event failed`,
        400
      );
    }

    if (contactId === -1) {
      throw new CustomError(
        `[Trengo] :: No contact found for term:${identifer} track event failed`,
        400
      );
    }
  }

  if (destination.Config.channelIdentifier === "email") {
    // check with keys
    if (template && template.length > 0) {
      try {
        const hTemplate = Handlebars.compile(template.trim());
        const templateInput = {
          event: message.event,
          properties: getStringValueOfJSON(message.properties),
          ...message.properties
        };
        subjectLine = hTemplate(templateInput).trim();
      } catch (err) {
        throw new CustomError(
          `[Trengo] :: Error occured in parsing event template for ${message.event}`,
          400
        );
      }
    }
  }
  let ticketPayload = {
    contact_id: contactId,
    channel_id: externalId || destination.Config.channelId,
    subject: subjectLine
  };
  ticketPayload = removeUndefinedAndNullValues(ticketPayload);
  const result = {
    payload: ticketPayload,
    endpoint: EndPoints.createTicket,
    method: "POST"
  };
  return result;
};

/**
 *
 * @param {*} message
 * @param {*} messageType
 * @param {*} destination
 *
 * The core function responsible for building the payload for trengo,
 * based on type of event and the destination configurations the
 * payloads are generated.
 */
const responseBuilderSimple = async (message, messageType, destination) => {
  let trengoPayload;
  // ChannelId is a mandatory field if it is not present in destination config
  // we will abort events.
  if (
    !destination.Config.channelId ||
    destination.Config.channelId.length === 0
  ) {
    throw new CustomError(
      "[Trengo] :: Cound not process event, missing mandatory field channelId",
      400
    );
  }

  const email = getFieldValueFromMessage(message, "email");
  const phone = getFieldValueFromMessage(message, "phone");
  // If externalId is present It will take preference over ChannelId
  // If contactId is present we will not lookup for contactId
  const extIds = {
    externalId: getDestinationExternalID(message, "trengoChannelId"),
    contactId: getDestinationExternalID(message, "trengoContactId")
  };
  const { channelIdentifier, enableDedup } = destination.Config;
  // In case of Identify type of events we create contacts or update
  if (messageType === EventType.IDENTIFY) {
    // If deduplication is enabled
    // we will first search the contact if unique contact is found
    // we will update its name else if not found we will create new.
    if (enableDedup) {
      // Here we are searching the contact first then if present creating the update
      // payload. If not found we return  -1.
      trengoPayload = await contactBuilderTrengo(
        message,
        destination,
        channelIdentifier === "email" ? email : phone,
        extIds,
        false
      );
      if (trengoPayload === -1) {
        // If not found create new
        // Destination behaviour
        // -- For phone type contacts duplicates will be created
        // -- For email type no duplicates will be created
        validate(email, phone, channelIdentifier);
        trengoPayload = await contactBuilderTrengo(
          message,
          destination,
          channelIdentifier === "email" ? email : phone,
          extIds,
          true
        );
      }
    } else {
      // If deduplicaton is disabled we will always create new contacts.
      // Destination behaviour
      // -- For phone type contacts duplicates will be created
      // -- For email type no duplicates will be created
      validate(email, phone, channelIdentifier);
      trengoPayload = await contactBuilderTrengo(
        message,
        destination,
        channelIdentifier === "email" ? email : phone,
        extIds,
        true
      );
    }
  } else {
    // Here we create ticket payload, we take the identifier email/phone based on channel
    // identifier. For track calls also we expect email/phone to be present in message
    trengoPayload = await ticketBuilderTrengo(
      message,
      destination,
      channelIdentifier === "email" ? email : phone,
      extIds
    );
  }
  // Wrapped payload with structure
  // {
  //  payload: { the paylaod.. },
  //  endpoint: "endpoint.."
  //  method: "POST"/"PUT"
  // }
  if (trengoPayload) {
    const response = defaultRequestConfig();
    response.endpoint = trengoPayload.endpoint;

    if (trengoPayload.method === "PUT") {
      response.method = defaultPutRequestConfig.requestMethod;
    } else {
      response.method = defaultPostRequestConfig.requestMethod;
    }

    response.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${destination.Config.apiToken}`
    };
    response.body.JSON = trengoPayload.payload;
    return response;
  }
  // fail-safety for developer error
  throw new CustomError("Payload could not be constructed", 400);
};

/**
 *
 * @param {*} message
 * @param {*} destination
 *
 * Main process function responsible for processing events.
 * If event type is not identify or track it will discard
 * the event
 */
const processEvent = async (message, destination) => {
  if (!message.type) {
    throw CustomError("Message Type is not present. Aborting message.", 400);
  }
  const messageType = message.type.toLowerCase();
  if (messageType !== EventType.IDENTIFY && messageType !== EventType.TRACK) {
    throw new CustomError("Message type not supported", 400);
  }
  const resp = await responseBuilderSimple(message, messageType, destination);
  return resp;
};

const process = async event => {
  const response = await processEvent(event.message, event.destination);
  return response;
};

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
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
        // if not transformed
        return getSuccessRespEvents(
          await process(input),
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
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
