const { Utils } = require("rudder-transformer-cdk");

function screenPostMapper(event, mappedPayload, rudderContext) {
  // TODO: throw error here if destination.Config.apiKey is missing?
  const { message, destination } = event;
  const eventData = message.properties || {};
  const eventJson = {
    action: "event",
    kochava_app_id: destination.Config.apiKey,
    kochava_device_id: Utils.getValueFromMessage(message, ["context.device.id", "anonymousId"])
  };

  let eventName = "screen view";
  if (message.properties && message.properties.name) {
    eventName += ` ${message.properties.name}`;
  }
  const additionalMapping = {
    action: "event",
    app_tracking_transparency: {
      att:
        Utils.getValueFromMessage(
          message,
          "context.device.attTrackingStatus"
        ) === 3 || false
    },
    app_version: Utils.getValueFromMessage(message, "context.app.build"),
    device_ver:
      message.context &&
      message.context.device &&
      message.context.device.model &&
      message.context.os &&
      message.context.os.name &&
      message.context.os.version
        ? `${message.context.device.model}-${message.context.os.name}-${message.context.os.version}`
        : "",
    device_ids: {
      idfa:
        message.context &&
        message.context.os &&
        message.context.os.name &&
        isAppleFamily(message.context.os.name)
          ? message.context.device.advertisingId || ""
          : "",
      idfv:
        message.context &&
        message.context.os &&
        message.context.os.name &&
        isAppleFamily(message.context.os.name)
          ? message.context.device.id || message.anonymousId || ""
          : "",
      adid:
        message.context &&
        message.context.os &&
        message.context.os.name &&
        message.context.os.name.toLowerCase() === "android"
          ? message.context.device.advertisingId || ""
          : "",
      android_id:
        message.context &&
        message.context.os &&
        message.context.os.name &&
        message.context.os.name.toLowerCase() === "android"
          ? message.context.device.id || message.anonymousId || ""
          : ""
    },
    currency: (eventData && eventData.currency) || "USD",
    event_data: eventData,
    event_name: eventName
  };

  return { ...eventJson, data: { ...mappedPayload, ...additionalMapping } };
}

module.exports = { screenPostMapper };
