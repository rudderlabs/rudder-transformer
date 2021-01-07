const { EventType } = require("../../../constants");

const {
  constructPayload,
  defaultRequestConfig,
  getFieldValueFromMessage,
  getValueFromMessage,
  removeUndefinedAndNullValues,
  removeUndefinedAndNullAndEmptyValues
} = require("../../util");

const { ConfigCategory, mappingConfig, getEndpoint } = require("./config");

function buildResponse(payload, endpoint) {
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return {
    ...response,
    headers: {
      "Content-Type": "application/json"
    }
  };
}

function processTrackEvent(message, destination, mappingJson) {
  const requestJson = {};
  if (message.messageId) {
    requestJson.request_id = message.messageId;
  }

  const eventJson = constructPayload(message, mappingJson);
  requestJson.events = [eventJson];

  return buildResponse(
    requestJson,
    getEndpoint(
      destination.Config.accountId,
      getFieldValueFromMessage(message, "userIdOnly")
    )
  );
}

function processPage(
  message,
  destination,
  trackMappingJson,
  profileMappingJson
) {
  const requestJson = {};
  if (message.messageId) {
    requestJson.request_id = message.messageId;
  }

  // generating profile part of the payload
  const profileJson = constructPayload(message, profileMappingJson);
  // eslint-disable-next-line no-underscore-dangle
  profileJson._appcuesId = destination.Config.accountId;
  requestJson.profile_update = profileJson;

  // generating event part of the payload
  const eventJson = constructPayload(message, trackMappingJson);
  // eslint-disable-next-line no-underscore-dangle
  eventJson.attributes._identity = {};
  // eslint-disable-next-line no-underscore-dangle
  eventJson.attributes._identity.userId = getFieldValueFromMessage(
    message,
    "userIdOnly"
  );
  eventJson.attributes = removeUndefinedAndNullAndEmptyValues(
    eventJson.attributes
  );

  if (
    (message.properties && message.properties.url) ||
    (message.context.page && message.context.page.url)
  ) {
    eventJson.context = {};
    eventJson.context.url = getValueFromMessage(message, [
      "context.page.url",
      "properties.url"
    ]);
  }
  requestJson.events = [eventJson];

  return buildResponse(
    requestJson,
    getEndpoint(
      destination.Config.accountId,
      getFieldValueFromMessage(message, "userIdOnly")
    )
  );
}

function process(event) {
  const { message, destination } = event;

  if (!message.type) {
    throw new Error("Message Type is not present. Aborting message.");
  }

  const messageType = message.type.toLowerCase();

  switch (messageType) {
    case EventType.TRACK:
      return processTrackEvent(
        message,
        destination,
        mappingConfig[ConfigCategory.TRACK.name]
      );
    case EventType.PAGE:
      message.event = "Viewed a Page";
      return processPage(
        message,
        destination,
        mappingConfig[ConfigCategory.TRACK.name],
        mappingConfig[ConfigCategory.PROFILE.name]
      );
    case EventType.SCREEN:
      message.event = "Viewed a Screen";
      return processTrackEvent(
        message,
        destination,
        mappingConfig[ConfigCategory.TRACK.name]
      );
    case EventType.IDENTIFY:
      return buildResponse(
        constructPayload(message, mappingConfig[ConfigCategory.IDENTIFY.name]),
        getEndpoint(
          destination.Config.accountId,
          getFieldValueFromMessage(message, "userIdOnly")
        )
      );
    default:
      throw new Error("Message type is not supported");
  }
}

module.exports = {
  process
};
