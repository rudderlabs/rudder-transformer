const isIp = require("is-ip");
var validUrl = require("valid-url");
const { EventType } = require("../../../constants");
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  fixIP
} = require("../util");
const { ENDPOINT } = require("./config");

function addAddons(properties, config) {
  const addons = [];
  if (config.ipAddon && properties.request_ip && isIp(properties.request_ip)) {
    addons.push({
      name: "keen:ip_to_geo",
      input: { ip: "request_ip" },
      output: "ip_geo_info"
    });
  }
  if (config.uaAddon && properties.user_agent) {
    addons.push({
      name: "keen:ua_parser",
      input: { ua_string: "user_agent" },
      output: "parsed_user_agent"
    });
  }
  if (config.urlAddon && properties.url && validUrl.isUri(properties.url)) {
    addons.push({
      name: "keen:url_parser",
      input: { url: "url" },
      output: "parsed_page_url"
    });
  }
  // should check referrer ?
  if (
    config.referrerAddon &&
    properties.referrer &&
    properties.url &&
    validUrl.isUri(properties.url)
  ) {
    addons.push({
      name: "keen:referrer_parser",
      input: {
        referrer_url: "referrer",
        page_url: "url"
      },
      output: "referrer_info"
    });
  }

  properties.keen = {
    addons
  };
}

function buildResponse(eventName, message, destination) {
  const endpoint =
    ENDPOINT + "/" + destination.Config.projectID + "/events/" + eventName;
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json",
    Authorization: destination.Config.writeKey
  };
  response.userId = message.userId ? message.userId : message.anonymousId;
  response.body.JSON = {
    ...message.properties
  };
  return response;
}

function processTrack(message, destination) {
  const eventName = message.event;
  let properties = message.properties;
  const user = {};
  user.userId = message.userId
    ? message.userId != ""
      ? message.userId
      : message.anonymousId
    : message.anonymousId;
  user.traits = message.context.traits;
  properties = {
    ...properties,
    user
  };
  // add userid/anonymousid
  properties.userId = message.userId;
  properties.anonymousId = message.anonymousId;

  // add ip from the message
  fixIP(properties, message, "request_ip");

  // add user-agent
  properties.user_agent = message.context.userAgent;

  addAddons(properties, destination.Config);

  message.properties = properties;
  return buildResponse(eventName, message, destination);
}

function processPage(message, destination) {
  const pageName = message.name;
  const pageCategory = message.properties
    ? message.properties.category
    : undefined;

  let eventName = "Loaded a Page";

  if (pageName) {
    eventName = "Viewed " + pageName + " page";
  }

  if (pageCategory && pageName) {
    eventName = "Viewed " + pageCategory + " " + pageName + " page";
  }

  message.event = eventName;

  return processTrack(message, destination);
}

function process(event) {
  const respList = [];
  let response;
  const { message, destination } = event;
  const messageType = message.type.toLowerCase();

  switch (messageType) {
    case EventType.PAGE:
      response = processPage(message, destination);
      response.statusCode = 200;
      respList.push(response);
      break;
    case EventType.TRACK:
      response = processTrack(message, destination);
      response.statusCode = 200;
      respList.push(response);
      break;
    default:
      console.log("Message type not supported");
      throw new Error("Message type not supported");
  }

  return respList;
}

exports.process = process;
