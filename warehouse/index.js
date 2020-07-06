const get = require("get-value");
const _ = require("lodash");

const v0 = require("./v0/util");
const v1 = require("./v1/util");

const whDefaultConfigJson = require("./config/WHDefaultConfig.json");
const whTrackConfigJson = require("./config/WHTrackConfig.json");
const whPageConfigJson = require("./config/WHPageConfig.json");
const whScreenConfigJson = require("./config/WHScreenConfig.json");
const whGroupConfigJson = require("./config/WHGroupConfig.json");
const whAliasConfigJson = require("./config/WHAliasConfig.json");

const isObject = value => {
  const type = typeof value;
  return (
    value != null &&
    (type === "object" || type === "function") &&
    !Array.isArray(value)
  );
};

// https://www.myintervals.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
// make sure to disable prettier for regex expression
// prettier-ignore
const timestampRegex = new RegExp(
  // eslint-disable-next-line no-useless-escape
  /^([\+-]?\d{4})((-)((0[1-9]|1[0-2])(-([12]\d|0[1-9]|3[01])))([T\s]((([01]\d|2[0-3])((:)[0-5]\d))([\:]\d+)?)?(:[0-5]\d([\.]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)$/
);

function validTimestamp(input) {
  return timestampRegex.test(input);
}

// // older implementation with fallback to new Date()
// function validTimestamp(input) {
//   // eslint-disable-next-line no-restricted-globals
//   if (!isNaN(input)) return false;
//   return new Date(input).getTime() > 0;
// }

const getDataType = (val, options) => {
  const type = typeof val;
  switch (type) {
    case "number":
      return Number.isInteger(val) ? "int" : "float";
    case "boolean":
      return "boolean";
    default:
      break;
  }
  if (validTimestamp(val)) {
    return "datetime";
  }
  if (options.getDataTypeOverride && typeof options.getDataTypeOverride === "function") {
    return options.getDataTypeOverride(val, options) || "string"
  }
  return "string";
};

const rudderCreatedTables = [
  "tracks",
  "users",
  "identifies",
  "pages",
  "screens",
  "aliases",
  "groups",
  "accounts"
];
function excludeRudderCreatedTableNames(name) {
  if (rudderCreatedTables.includes(name.toLowerCase())) {
    return `_${name}`;
  }
  return name;
}

function setFromConfig(utils, resp, input, configJson, columnTypes, options) {
  Object.keys(configJson).forEach(key => {
    let val = get(input, key);
    if (val !== undefined || val !== null) {
      const datatype = getDataType(val, options);
      if (datatype === "datetime") {
        val = new Date(val).toISOString();
      }
      const prop = configJson[key];
      const columnName = utils.safeColumnName(options.provider, prop);
      resp[columnName] = val;
      columnTypes[columnName] = datatype;
    }
  });
}

function setFromProperties(
  utils,
  resp,
  input,
  columnTypes,
  options,
  prefix = ""
) {
  if (!input) return;
  Object.keys(input).forEach(key => {
    if (isObject(input[key])) {
      setFromProperties(
          utils,
          resp,
          input[key],
          columnTypes,
          options,
        `${prefix + key}_`
      );
    } else {
      let val = input[key];
      if (val === null || val === undefined) {
        return;
      }
      const datatype = getDataType(val, options);
      if (datatype === "datetime") {
        val = new Date(val).toISOString();
      }
      let safeKey = utils.transformColumnName(prefix + key);
      if (safeKey != "") {
        safeKey = utils.safeColumnName(options.provider, safeKey);
        resp[safeKey] = val;
        columnTypes[safeKey] = datatype;
      }
    }
  });
}

function getColumns(options, obj, columnTypes) {
  const columns = {};
  const uuidTS = options.provider === "snowflake" ? "UUID_TS" : "uuid_ts";
  columns[uuidTS] = "datetime";
  Object.keys(obj).forEach(key => {
    columns[key] = columnTypes[key] || getDataType(obj[key], options);
  });
  return columns;
}

function getVersionedUtils(schemaVersion) {
  switch (schemaVersion) {
    case "v0":
      return v0;
    case "v1":
      return v1;
    default:
      return v1;
  }
}

function processWarehouseMessage(message, options) {
  const utils = getVersionedUtils(options.schemaVersion);
  const responses = [];
  const eventType = message.type.toLowerCase();
  // store columnTypes as each column is set, so as not to call getDataType again
  const columnTypes = {};
  switch (eventType) {
    case "track": {
      const commonProps = {};
      setFromProperties(
        utils,
        commonProps,
        message.context,
        columnTypes,
        options,
        "context_"
      );

      setFromConfig(
        utils,
        commonProps,
        message,
        whTrackConfigJson,
        columnTypes,
        options
      );
      setFromConfig(
        utils,
        commonProps,
        message,
        whDefaultConfigJson,
        columnTypes,
        options
      );

      // set event column based on event_text in the tracks table
      const eventColName = utils.safeColumnName(options.provider, "event");
      commonProps[eventColName] = utils.transformTableName(
        commonProps[utils.safeColumnName(options.provider, "event_text")]
      );
      columnTypes[eventColName] = "string";

      // shallow copy is sufficient since it does not contains nested objects
      const tracksEvent = { ...commonProps };
      const tracksMetadata = {
        table: utils.safeTableName(options.provider, "tracks"),
        columns: getColumns(options, tracksEvent, columnTypes),
        receivedAt: message.receivedAt
      };
      responses.push({
        metadata: tracksMetadata,
        data: tracksEvent
      });

      // do not create event table in case of empty event name (after utils.transformColumnName)
      if (tracksEvent[eventColName] === "") {
        break;
      }
      const trackProps = {};
      setFromProperties(
        utils,
        trackProps,
        message.properties,
        columnTypes,
        options
      );
      setFromProperties(
        utils,
        trackProps,
        message.userProperties,
        columnTypes,
        options
      );
      // always set commonProps last so that they are not overwritten
      const trackEvent = { ...trackProps, ...commonProps };
      const trackEventMetadata = {
        table: excludeRudderCreatedTableNames(
          utils.safeTableName(
            options.provider,
            utils.transformColumnName(trackEvent[eventColName])
          )
        ),
        columns: getColumns(options, trackEvent, columnTypes),
        receivedAt: message.receivedAt
      };
      responses.push({
        metadata: trackEventMetadata,
        data: trackEvent
      });
      break;
    }
    case "identify": {
      const commonProps = {};
      setFromProperties(
        utils,
        commonProps,
        message.userProperties,
        columnTypes,
        options
      );
      setFromProperties(
        utils,
        commonProps,
        message.context ? message.context.traits : {},
        columnTypes,
        options
      );
      setFromProperties(
        utils,
        commonProps,
        message.traits,
        columnTypes,
        options,
        ""
      );

      // set context props
      setFromProperties(
        utils,
        commonProps,
        message.context,
        columnTypes,
        options,
        "context_"
      );

      const usersEvent = { ...commonProps };
      usersEvent[utils.safeColumnName(options.provider, "id")] = message.userId;
      usersEvent[
        utils.safeColumnName(options.provider, "received_at")
      ] = message.receivedAt
          ? new Date(message.receivedAt).toISOString()
          : null;
      columnTypes[utils.safeColumnName(options.provider, "received_at")] = "datetime";
      const usersMetadata = {
        table: utils.safeTableName(options.provider, "users"),
        columns: getColumns(options, usersEvent, columnTypes),
        receivedAt: message.receivedAt
      };
      const usersResponse = { metadata: usersMetadata };
      if (_.toString(message.userId).trim() !== "") {
        usersResponse.data = usersEvent;
      }
      responses.push(usersResponse);

      const identifiesEvent = { ...commonProps };
      setFromConfig(
        utils,
        identifiesEvent,
        message,
        whDefaultConfigJson,
        columnTypes,
        options
      );
      const identifiesMetadata = {
        table: utils.safeTableName(options.provider, "identifies"),
        columns: getColumns(options, identifiesEvent, columnTypes),
        receivedAt: message.receivedAt
      };
      responses.push({ metadata: identifiesMetadata, data: identifiesEvent });

      break;
    }
    case "page":
    case "screen": {
      const event = {};
      setFromProperties(
        utils,
        event,
        message.properties,
        columnTypes,
        options
      );
      // set rudder properties after user set properties to prevent overwriting
      setFromProperties(
        utils,
        event,
        message.context,
        columnTypes,
        options,
        "context_"
      );
      setFromConfig(
        utils,
        event,
        message,
        whDefaultConfigJson,
        columnTypes,
        options
      );

      if (eventType === "page") {
        setFromConfig(
          utils,
          event,
          message,
          whPageConfigJson,
          columnTypes,
          options
        );
      } else if (eventType === "screen") {
        setFromConfig(
          utils,
          event,
          message,
          whScreenConfigJson,
          columnTypes,
          options
        );
      }

      const metadata = {
        table: utils.safeTableName(options.provider, `${eventType}s`),
        columns: getColumns(options, event, columnTypes),
        receivedAt: message.receivedAt
      };
      responses.push({ metadata, data: event });
      break;
    }
    case "group": {
      const event = {};
      setFromProperties(event, message.traits, columnTypes, options);
      setFromProperties(
        utils,
        event,
        message.context,
        columnTypes,
        options,
        "context_"
      );
      setFromConfig(
        utils,
        event,
        message,
        whDefaultConfigJson,
        columnTypes,
        options
      );
      setFromConfig(
        utils,
        event,
        message,
        whGroupConfigJson,
        columnTypes,
        options
      );

      const metadata = {
        table: utils.safeTableName(options.provider, "groups"),
        columns: getColumns(options, event, columnTypes),
        receivedAt: message.receivedAt
      };
      responses.push({ metadata, data: event });
      break;
    }
    case "alias": {
      const event = {};
      setFromProperties(event, message.traits, columnTypes, options);
      setFromProperties(
        utils,
        event,
        message.context,
        columnTypes,
        options,
        "context_"
      );
      setFromConfig(
        utils,
        event,
        message,
        whDefaultConfigJson,
        columnTypes,
        options
      );
      setFromConfig(
        utils,
        event,
        message,
        whAliasConfigJson,
        columnTypes,
        options
      );

      const metadata = {
        table: utils.safeTableName(options.provider, "aliases"),
        columns: getColumns(options, event, columnTypes),
        receivedAt: message.receivedAt
      };
      responses.push({ metadata, data: event });
      break;
    }
    default:
      throw new Error("Unknown event type", eventType);
  }
  return responses;
}

module.exports = {
  processWarehouseMessage
};
