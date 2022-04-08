const {
  getBrowserInfo,
  getDeviceModel,
  isValidUrl,
  isDefinedAndNotNull
} = require("../../v0/util");

function commonPostMapper(event, mappedPayload) {
  const { message, destination } = event;

  let payload = mappedPayload;

  if (
    message.channel === "web" &&
    message.context &&
    message.context.userAgent
  ) {
    const browser = getBrowserInfo(message.context.userAgent);
    const osInfo = getDeviceModel(message);
    payload.properties.$os = osInfo;
    payload.properties.$browser = browser.name;
    payload.properties.$browser_version = browser.version;
  }

  // For EventType Screen Posthog maps screen name to our event property.
  if (message.type.toLowerCase() === "screen") {
    payload.properties.$screen_name = message.event;
  }

  // Validate current url from payload and generate host form that url.
  const url = isValidUrl(payload.properties.$current_url);
  if (url) {
    payload.properties.$host = url.host;
  }

  if (isDefinedAndNotNull(payload.distinct_id)) {
    payload.distinct_id = payload.distinct_id.toString();
  }
  if (
    payload.properties &&
    isDefinedAndNotNull(payload.properties.distinct_id)
  ) {
    payload.properties.distinct_id = payload.properties.distinct_id.toString();
  }
  payload = {
    ...payload,
    api_key: destination.Config.teamApiKey
  };
  if (message.type.toLowerCase() !== "track") {
    payload.event = `$${message.type}`;
  }
  switch (message.type.toLowerCase()) {
    case "track":
      payload.type = "capture";
      break;
    case "alias":
      payload.type = "alias";
      payload.event = "$create_alias";
      break;
    case "page":
      payload.type = "page";
      payload.event = "$pageview";
      break;
    default:
      payload.type = message.type.toLowerCase();
      payload.event = `$${message.type}`;
  }
  return payload;
}

module.exports = { commonPostMapper };
