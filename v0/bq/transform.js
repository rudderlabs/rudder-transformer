const get = require("get-value");
const moment = require("moment");
const util = require("util");
const {
  toSnakeCase,
  toSafeDBString,
  validTimestamp,
  isObject
} = require("../util");
const { ConfigCategory, mappingConfig } = require("./config");

const whDefaultConfigJson = mappingConfig[ConfigCategory.DEFAULT.name];
const whTrackConfigJson = mappingConfig[ConfigCategory.TRACK.name];

function dataType(val) {
  if (validTimestamp(val)) {
    return "datetime";
  }

  const type = typeof val;
  switch (type) {
    case "number":
      return Number.isInteger(val) ? "int" : "float";
    case "string":
    case "boolean":
      return type;
    default:
      return "string";
  }
}

function setFromConfig(input, configJson) {
  const output = {};
  Object.keys(configJson).forEach(key => {
    let val = get(input, key);
    if (val !== undefined) {
      if (dataType(val) === "datetime") {
        val = moment(val)
          .utc()
          .format("YYYY-MM-DD hh:mm:ss.SSS Z");
      }
      output[configJson[key]] = val;
    }
  });
  return output;
}

function setFromProperties(input, prefix = "") {
  let output = {};
  if (!input) return output;
  Object.keys(input).forEach(key => {
    if (isObject(input[key])) {
      output = {
        ...output,
        ...setFromProperties(input[key], `${prefix + key}_`)
      };
    } else {
      let val = input[key];
      if (dataType(val) === "datetime") {
        val = moment(val)
          .utc()
          .format("YYYY-MM-DD hh:mm:ss.SSS Z"); // supported format in bigquery
      }
      output[toSafeDBString(prefix + key)] = input[key];
    }
  });
  return output;
}

function getColumns(obj) {
  const columns = { uuid_ts: "datetime" };
  Object.keys(obj).forEach(key => {
    columns[toSafeDBString(key)] = dataType(obj[key]);
  });
  return columns;
}

function processSingleMessage(message, destination) {
  const responses = [];
  const eventType = message.type.toLowerCase();
  switch (eventType) {
    case "track": {
      let result = {
        ...setFromConfig(message, whDefaultConfigJson),
        ...setFromProperties(message.context, "context_")
      };
      result = { ...result, ...setFromConfig(message, whTrackConfigJson) };
      result.event = toSnakeCase(result.event_text);

      const trackEvent = {
        ...result,
        ...setFromProperties(message.properties),
        ...setFromProperties(message.userProperties)
      };

      const tracksMetadata = {
        table: "tracks",
        columns: getColumns(result)
      };
      responses.push({ metadata: tracksMetadata, data: result });

      const trackEventMetadata = {
        table: toSafeDBString(trackEvent.event),
        columns: getColumns(trackEvent)
      };
      responses.push({ metadata: trackEventMetadata, data: trackEvent });
      break;
    }
    case "identify": {
      const event = {
        ...setFromProperties(message.context.traits),
        ...setFromProperties(message.context, "context_")
      };
      const usersEvent = { ...event };
      const identifiesEvent = { ...event };

      usersEvent.id = message.userId;
      usersEvent.user_id = message.userId;
      identifiesEvent.user_id = message.userId;
      identifiesEvent.anonymous_id = message.anonymousId;
      identifiesEvent.id = message.messageId;

      const identifiesMetadata = {
        table: "identifies",
        columns: getColumns(identifiesEvent)
      };
      responses.push({ metadata: identifiesMetadata, data: identifiesEvent });

      const usersMetadata = {
        table: "users",
        columns: getColumns(usersEvent)
      };
      responses.push({ metadata: usersMetadata, data: usersEvent });
      break;
    }
    case "page":
    case "screen": {
      const defaultEvent = {
        ...setFromConfig(message, whDefaultConfigJson),
        ...setFromProperties(message.context, "context_")
      };
      const event = {
        ...defaultEvent,
        ...setFromProperties(message.properties)
      };
      const metadata = {
        table: `${eventType}s`,
        columns: getColumns(event)
      };
      responses.push({ metadata, data: event });
      break;
    }
    default:
      throw new Error("Unknown event type", eventType);
  }
  return responses;
}

function process(event) {
  return processSingleMessage(event.message, event.destination);
}

exports.process = process;
