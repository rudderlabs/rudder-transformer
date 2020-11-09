/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  defaultPostRequestConfig
} = require("../../util");

const generateDestinationProperty = message => {
  // To Do :: Write logic for mapping destination 'Properties'
  const PHPropertyJson = [
    { destKey: "$os", sourceKeys: "os.name" },
    { destKey: "browser", sourceKeys: "context.browser.name" },
    { destKey: "$current_url", sourceKeys: "context.page.url" },
    { destKey: "$host", sourceKeys: "" },
    { destKey: "$pathname", sourceKeys: "context.page.path" },
    { destKey: "$browser_version", sourceKeys: "context.browser.version" },
    { destKey: "$screen_height", sourceKeys: "context.screen.height" },
    { destKey: "$screen_width", sourceKeys: "context.screen.width" },
    { destKey: "$lib", sourceKeys: "context.library.name" },
    { destKey: "$lib_version", sourceKeys: "context.library.version" },
    { destKey: "$insert_id", sourceKeys: "" }, // TO DO : Need to Check
    { destKey: "$time", sourceKeys: "timestamp" },
    { destKey: "$device_id", sourceKeys: "context.device.id" },
    { destKey: "distinct_id", sourceKeys: "userId" },
    { destKey: "$initial_referrer", sourceKeys: "properties.referrer" },
    { destKey: "$initial_referring_domain", sourceKeys: "properties.url" },
    { destKey: "$ip", sourceKeys: "context.ip" },
    { destKey: "$timestamp", sourceKeys: "originalTimestamp" }
  ];

  const data = constructPayload(message, PHPropertyJson);

  return data;
};

const responseBuilderSimple = (message, category, destination) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  if (!payload) {
    // fail-safety for developer error
    // eslint-disable-next-line no-undef
    throw Error(Message.FailedToConstructPayload);
  }

  if (payload.properties) {
    payload.properties = generateDestinationProperty(payload.properties);
  }

  if (category.type !== CONFIG_CATEGORIES.TRACK.type) {
    payload.event = category.event;
  }

  const responseBody = {
    ...payload,
    api_Key: destination.Config.teamApiKey,
    type:
      category.type === CONFIG_CATEGORIES.TRACK.type ? "capture" : category.type // To Do:: Need to improve this line of code. Figure out some other ways.
  };
  const response = defaultRequestConfig();
  response.endpoint = `${destination.Config.yourInstance}/batch`;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Indicative-Client": "RudderStack",
    "Content-Type": "application/json"
  };
  response.userId = getFieldValueFromMessage(message, "userId");
  response.body.JSON = responseBody;
  return response;
};

const validateMessageType = message => {
  if (!message.type) {
    throw Error(Message.TypeNotFound);
  }

  const category = CONFIG_CATEGORIES[message.type.toUpperCase()];
  if (!category) {
    throw Error(Message.TypeNotSupported);
  }
};

const processEvent = (message, destination) => {
  validateMessageType(message);

  const messageType = message.type.toLowerCase();

  const repList = [];

  const category = CONFIG_CATEGORIES[messageType.toUpperCase()];
  repList.push(responseBuilderSimple(message, category, destination));
  return repList;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
