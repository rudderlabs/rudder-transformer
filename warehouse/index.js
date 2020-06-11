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
  var type = typeof value;
  return (
    value != null &&
    (type == "object" || type == "function") &&
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

const getDataType = val => {
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
    name = `_${name}`;
  }
  return name;
}

function setFromConfig(provider, utils, resp, input, configJson, columnTypes) {
  Object.keys(configJson).forEach(key => {
    let val = get(input, key);
    if (val !== undefined || val !== null) {
      datatype = getDataType(val);
      if (datatype === "datetime") {
        val = new Date(val).toISOString();
      }
      const prop = configJson[key];
      const columnName = utils.safeColumnName(provider, prop);
      resp[columnName] = val;
      columnTypes[columnName] = datatype;
    }
  });
}

function setFromProperties(
  provider,
  utils,
  resp,
  input,
  columnTypes,
  prefix = ""
) {
  if (!input) return;
  Object.keys(input).forEach(key => {
    if (isObject(input[key])) {
      setFromProperties(
        provider,
        utils,
        resp,
        input[key],
        columnTypes,
        `${prefix + key}_`
      );
    } else {
      let val = input[key];
      if (val === null || val === undefined) {
        return;
      }
      datatype = getDataType(val);
      if (datatype === "datetime") {
        val = new Date(val).toISOString();
      }
      safeKey = utils.transformColumnName(prefix + key);
      if (safeKey != "") {
        safeKey = utils.safeColumnName(provider, safeKey);
        resp[safeKey] = val;
        columnTypes[safeKey] = datatype;
      }
    }
  });
}

function getColumns(provider, obj, columnTypes) {
  const columns = {};
  const uuidTS = provider === "snowflake" ? "UUID_TS" : "uuid_ts";
  columns[uuidTS] = "datetime";
  Object.keys(obj).forEach(key => {
    columns[key] = columnTypes[key] || getDataType(obj[key]);
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

function processWarehouseMessage(provider, message, schemaVersion) {
  const utils = getVersionedUtils(schemaVersion);
  const responses = [];
  const eventType = message.type.toLowerCase();
  // store columnTypes as each column is set, so as not to call getDataType again
  const columnTypes = {};
  switch (eventType) {
    case "track": {
      const commonProps = {};
      setFromProperties(
        provider,
        utils,
        commonProps,
        message.context,
        columnTypes,
        "context_"
      );
      setFromConfig(
        provider,
        utils,
        commonProps,
        message,
        whTrackConfigJson,
        columnTypes
      );
      setFromConfig(
        provider,
        utils,
        commonProps,
        message,
        whDefaultConfigJson,
        columnTypes
      );

      // set event column based on event_text in the tracks table
      const eventColName = utils.safeColumnName(provider, "event");
      commonProps[eventColName] = utils.transformTableName(
        commonProps[utils.safeColumnName(provider, "event_text")]
      );
      columnTypes[eventColName] = "string";

      // shallow copy is sufficient since it does not contains nested objects
      const tracksEvent = { ...commonProps };
      const tracksMetadata = {
        table: utils.safeTableName(provider, "tracks"),
        columns: getColumns(provider, tracksEvent, columnTypes),
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
        provider,
        utils,
        trackProps,
        message.properties,
        columnTypes
      );
      setFromProperties(
        provider,
        utils,
        trackProps,
        message.userProperties,
        columnTypes
      );

      // always set commonProps last so that they are not overwritten
      const trackEvent = { ...trackProps, ...commonProps };
      const trackEventMetadata = {
        table: excludeRudderCreatedTableNames(
          utils.safeTableName(
            provider,
            utils.transformColumnName(trackEvent[eventColName])
          )
        ),
        columns: getColumns(provider, trackEvent, columnTypes),
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
        provider,
        utils,
        commonProps,
        message.userProperties,
        columnTypes
      );
      setFromProperties(
        provider,
        utils,
        commonProps,
        message.context ? message.context.traits : {},
        columnTypes
      );
      setFromProperties(
        provider,
        utils,
        commonProps,
        message.traits,
        columnTypes,
        ""
      );

      // set context props
      setFromProperties(
        provider,
        utils,
        commonProps,
        message.context,
        columnTypes,
        "context_"
      );

      const usersEvent = { ...commonProps };
      usersEvent[utils.safeColumnName(provider, "id")] = message.userId;
      usersEvent[
        utils.safeColumnName(provider, "received_at")
      ] = message.receivedAt
        ? new Date(message.receivedAt).toISOString()
        : null;
      columnTypes[utils.safeColumnName(provider, "received_at")] = "datetime";
      const usersMetadata = {
        table: utils.safeTableName(provider, "users"),
        columns: getColumns(provider, usersEvent, columnTypes),
        receivedAt: message.receivedAt
      };
      usersResponse = { metadata: usersMetadata };
      if (_.toString(message.userId).trim() !== "") {
        usersResponse.data = usersEvent;
      }
      responses.push(usersResponse);

      const identifiesEvent = { ...commonProps };
      setFromConfig(
        provider,
        utils,
        identifiesEvent,
        message,
        whDefaultConfigJson,
        columnTypes
      );
      const identifiesMetadata = {
        table: utils.safeTableName(provider, "identifies"),
        columns: getColumns(provider, identifiesEvent, columnTypes),
        receivedAt: message.receivedAt
      };
      responses.push({ metadata: identifiesMetadata, data: identifiesEvent });

      break;
    }
    case "page":
    case "screen": {
      const event = {};
      setFromProperties(
        provider,
        utils,
        event,
        message.properties,
        columnTypes
      );
      // set rudder properties after user set properties to prevent overwriting
      setFromProperties(
        provider,
        utils,
        event,
        message.context,
        columnTypes,
        "context_"
      );
      setFromConfig(
        provider,
        utils,
        event,
        message,
        whDefaultConfigJson,
        columnTypes
      );

      if (eventType === "page") {
        setFromConfig(
          provider,
          utils,
          event,
          message,
          whPageConfigJson,
          columnTypes
        );
      } else if (eventType === "screen") {
        setFromConfig(
          provider,
          utils,
          event,
          message,
          whScreenConfigJson,
          columnTypes
        );
      }

      const metadata = {
        table: utils.safeTableName(provider, `${eventType}s`),
        columns: getColumns(provider, event, columnTypes),
        receivedAt: message.receivedAt
      };
      responses.push({ metadata, data: event });
      break;
    }
    case "group": {
      const event = {};
      setFromProperties(provider, event, message.traits, columnTypes);
      setFromProperties(
        provider,
        utils,
        event,
        message.context,
        columnTypes,
        "context_"
      );
      setFromConfig(
        provider,
        utils,
        event,
        message,
        whDefaultConfigJson,
        columnTypes
      );
      setFromConfig(
        provider,
        utils,
        event,
        message,
        whGroupConfigJson,
        columnTypes
      );

      const metadata = {
        table: utils.safeTableName(provider, "groups"),
        columns: getColumns(provider, event, columnTypes),
        receivedAt: message.receivedAt
      };
      responses.push({ metadata, data: event });
      break;
    }
    case "alias": {
      const event = {};
      setFromProperties(provider, event, message.traits, columnTypes);
      setFromProperties(
        provider,
        utils,
        event,
        message.context,
        columnTypes,
        "context_"
      );
      setFromConfig(
        provider,
        utils,
        event,
        message,
        whDefaultConfigJson,
        columnTypes
      );
      setFromConfig(
        provider,
        utils,
        event,
        message,
        whAliasConfigJson,
        columnTypes
      );

      const metadata = {
        table: utils.safeTableName(provider, "aliases"),
        columns: getColumns(provider, event, columnTypes),
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
