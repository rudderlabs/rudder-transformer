const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  getHashFromArrayWithDuplicate,
  constructPayload,
  removeHyphens,
  defaultRequestConfig,
  defaultPostRequestConfig,
  simpleProcessRouterDest,
  getHashFromArray
} = require("../../util");
const ErrorBuilder = require("../../util/error");
const {
  trackClickConversionsMapping,
  CLICK_CONVERSION,
  trackCallConversionsMapping,
  CALL_CONVERSION
} = require("./config");
const { validateDestinationConfig, getAccessToken } = require("./utils");

const getConversions = (
  message,
  metadata,
  { Config },
  event,
  conversionType
) => {
  let payload;
  let endpoint;
  const filteredCustomerId = removeHyphens(Config.customerId);
  if (conversionType === "click") {
    payload = constructPayload(message, trackClickConversionsMapping);
    endpoint = CLICK_CONVERSION.replace(":customerId", filteredCustomerId);
  } else {
    payload = constructPayload(message, trackCallConversionsMapping);
    endpoint = CALL_CONVERSION.replace(":customerId", filteredCustomerId);
  }

  payload.partialFailure = true;

  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = endpoint;
  response.params = {
    event,
    customerId: filteredCustomerId,
    customVariables: Config.customVariables,
    properties: message.properties
  };
  response.body.JSON = payload;
  response.headers = {
    Authorization: `Bearer ${getAccessToken(metadata)}`,
    "Content-Type": "application/json",
    "developer-token": get(metadata, "secret.developer_token")
  };

  return response;
};

const trackResponseBuilder = (message, metadata, destination) => {
  let {
    eventsToConversionsNamesMapping,
    eventsToOfflineConversionsTypeMapping
  } = destination.Config;
  let { event } = message;
  if (!event) {
    throw new ErrorBuilder()
      .setMessage(
        "[Google Ads Offline Conversions]:: Event name is not present"
      )
      .setStatus(400)
      .build();
  }

  event = event.toLowerCase().trim();

  eventsToConversionsNamesMapping = getHashFromArray(
    eventsToConversionsNamesMapping
  );

  eventsToOfflineConversionsTypeMapping = getHashFromArrayWithDuplicate(
    eventsToOfflineConversionsTypeMapping
  );

  const responseList = [];
  if (
    !eventsToConversionsNamesMapping[event] ||
    !eventsToOfflineConversionsTypeMapping[event]
  ) {
    throw new ErrorBuilder()
      .setMessage(`Event name '${event}' is not valid`)
      .setStatus(400)
      .build();
  }

  eventsToOfflineConversionsTypeMapping[event].forEach(conversionType => {
    responseList.push(
      getConversions(
        message,
        metadata,
        destination,
        eventsToConversionsNamesMapping[event],
        conversionType
      )
    );
  });

  return responseList;
};

const process = async event => {
  const { message, metadata, destination } = event;

  if (!message.type) {
    throw new ErrorBuilder()
      .setMessage(
        "[Google Ads Offline Conversions]:: Message type is not present. Aborting message."
      )
      .setStatus(400)
      .build();
  }

  validateDestinationConfig(destination);

  const messageType = message.type.toLowerCase();
  let response;
  if (messageType === EventType.TRACK) {
    response = trackResponseBuilder(message, metadata, destination);
  } else {
    throw new ErrorBuilder()
      .setMessage(
        `[Google Ads Offline Conversions]:: Message type ${messageType} not supported`
      )
      .setStatus(400)
      .build();
  }

  return response;
};

const processRouterDest = async inputs => {
  const respList = await simpleProcessRouterDest(
    inputs,
    "Google_adwords_offline_conversions",
    process
  );
  return respList;
};

module.exports = { process, processRouterDest };
