/* eslint-disable no-prototype-builtins */
const Handlebars = require("handlebars");
const Axios = require("axios");
const { EventType } = require("../../../constants");
const { EndPoints, BASE_URL } = require("./config");
const { getHashFromArray } = require("../../util");
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  getValueFromMessage,
  getDestinationExternalID
} = require("../../util");

const getTemplate = (message, destination) => {
  const { eventTemplateMap } = destination.Config;
  const hashMap = getHashFromArray(eventTemplateMap, "from", "to", false);

  return (
    (message.event ? hashMap[message.event] : null) || hashMap["*"] || null
  );
};

const stringifyJSON = json => {
  let output = "";
  Object.keys(json).forEach(key => {
    if (json.hasOwnProperty(key)) {
      output += `${key}: ${json[key]} `;
    }
  });
  return output;
};

const lookupContact = async (term, destination) => {
  let res;
  try {
    res = await Axios.get(`${BASE_URL}/contacts?page=1&term=${term}`, {
      headers: {
        Authorization: `Bearer ${destination.Config.apiToken}`
      }
    });
  } catch (err) {
    throw new Error("[Trengo] :: Inside lookupContact, failed to make request");
  }
  if (res.status === 200 && res.data && Array.isArray(res.data)) {
    if (res.data.length > 1) {
      throw new Error(
        `[Trengo] :: Inside lookupContact, unaable to update contact duplicates present for identifer : ${term}`
      );
    } else if (res.data.length === 1) {
      const { data } = res;
      return data[0].id;
    }
    return -1;
  }
  return null;
};

const contactBuilderTrengo = async (
  message,
  destination,
  cretaeScope = true
) => {
  let result;
  const externalId = getDestinationExternalID(message, "trengo");
  const userID = getFieldValueFromMessage(message, "userId");
  const contactName = getValueFromMessage(message, "name")
    ? getValueFromMessage(message, "name")
    : `${getFieldValueFromMessage(
        message,
        "firstName"
      )} ${getFieldValueFromMessage(message, "lastName")}`;

  if (cretaeScope) {
    result = {
      payload: {
        name: contactName,
        identifier: userID,
        channel_id: externalId || destination.Config.channelId
      },
      endpoint: `${BASE_URL}/channels/${externalId ||
        destination.Config.channelId}/contacts`
    };
  } else {
    const contactId = await lookupContact(userID, destination);
    if (!contactId) {
      throw new Error(
        `[Trengo] :: LookupContact failed for term:${userID} update failed, aborting as dedup option is enabled`
      );
    }
    if (contactId === -1) {
      return -1;
    }
    result = {
      payload: {
        name: contactName
      },
      endpoint: `${BASE_URL}/contacts/${contactId}`
    };
  }
  return result;
};

const ticketBuilderTrengo = (message, destination) => {
  let subjectLine;
  const externalId = getDestinationExternalID(message, "trengo");
  if (destination.Config.channelIdentifier === "email") {
    const template = getTemplate(message, destination);
    if (!(template && template.length > 0)) {
      throw new Error(
        `[Trengo] :: Cound not process track events, template value not present - Template ${template}`
      );
    }
    const hTemplate = Handlebars.compile(template.trim());
    const templateInput = {
      event: message.event,
      properties: stringifyJSON(message.properties),
      ...message.properties
    };
    subjectLine = hTemplate(templateInput).trim();
  }
  const result = {
    payload: {
      contact_id: getFieldValueFromMessage(message, "userId"),
      channel_id: externalId || destination.Config.channelId,
      subject: subjectLine || message.event
    },
    endpoint: EndPoints.createTicket
  };
  return result;
};

const responseBuilderSimple = async (message, messageType, destination) => {
  let trengoPayload;
  if (!destination.Config.channelId) {
    throw new Error(
      "[Trengo] :: Cound not process event, missing mandatory field channelId"
    );
  }
  // channel id
  if (messageType === EventType.IDENTIFY) {
    // create contact
    if (
      destination.Config.channelIdentifier === "phone" &&
      destination.Config.enableDedup
    ) {
      trengoPayload = await contactBuilderTrengo(message, destination, false);
      if (trengoPayload === -1) {
        trengoPayload = await contactBuilderTrengo(message, destination, true);
      }
    } else {
      trengoPayload = await contactBuilderTrengo(message, destination, true);
    }
  } else {
    // create ticket --> need to search using email then use contact id to create ticket
    trengoPayload = ticketBuilderTrengo(message, destination);
  }
  if (trengoPayload) {
    const response = defaultRequestConfig();
    response.endpoint = trengoPayload.endpoint;
    response.method = defaultPostRequestConfig.requestMethod;
    response.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${destination.Config.apiToken}`
    };
    response.body.JSON = trengoPayload.payload;
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
};

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();
  if (messageType !== EventType.IDENTIFY && messageType !== EventType.TRACK) {
    throw new Error("Message type not supported");
  }
  const resp = await responseBuilderSimple(message, messageType, destination);
  return resp;
};

const process = async event => {
  const response = await processEvent(event.message, event.destination);
  return response;
};

exports.process = process;
