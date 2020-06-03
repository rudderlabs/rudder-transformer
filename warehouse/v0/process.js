const get = require("get-value");

const whDefaultConfigJson = require("../config/WHDefaultConfig.json");
const whTrackConfigJson = require("../config/WHTrackConfig.json");
const whPageConfigJson = require("../config/WHPageConfig.json");
const whScreenConfigJson = require("../config/WHScreenConfig.json");
const whGroupConfigJson = require("../config/WHGroupConfig.json");
const whAliasConfigJson = require("../config/WHAliasConfig.json");
const reservedANSIKeywordsMap = require("../config/ReservedKeywords.json");

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

const toSnakeCase = str => {
  if (!str) return "";
  return String(str)
    .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, "")
    .replace(/([a-z])([A-Z])/g, (m, a, b) => a + "_" + b.toLowerCase())
    .replace(/[^A-Za-z0-9]+|_+/g, "_")
    .toLowerCase();
};

const isObject = value => {
  var type = typeof value;
  return (
    value != null &&
    (type == "object" || type == "function") &&
    !Array.isArray(value)
  );
};

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

const toSafeDBString = str => {
  if (parseInt(str[0]) > 0) str = `_${str}`;
  str = str.replace(/[^a-zA-Z0-9_]+/g, "");
  return str.substr(0, 127);
};

function safeTableName(provider, name = "") {
  let tableName = name;
  if (tableName === "") {
    tableName = "STRINGEMPTY";
  }
  if (provider === "snowflake") {
    tableName = tableName.toUpperCase();
  }
  if (provider === "postgres") {
    tableName = tableName.toLowerCase();
  }
  if (
    reservedANSIKeywordsMap[provider.toUpperCase()][tableName.toUpperCase()]
  ) {
    tableName = "_" + tableName;
  }
  return tableName;
}

function safeColumnName(provider, name = "") {
  let columnName = name;
  if (columnName === "") {
    columnName = "STRINGEMPTY";
  }
  if (provider === "snowflake") {
    columnName = columnName.toUpperCase();
  }
  if (provider === "postgres") {
    columnName = columnName.toLowerCase();
  }
  if (
    reservedANSIKeywordsMap[provider.toUpperCase()][columnName.toUpperCase()]
  ) {
    columnName = "_" + columnName;
  }
  return columnName;
}

function transformTableName(name = "") {
  return toSnakeCase(name);
}

function transformColumnName(name = "") {
  return toSafeDBString(name);
}

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

function setFromConfig(provider, resp, input, configJson, columnTypes) {
  Object.keys(configJson).forEach(key => {
    let val = get(input, key);
    if (val !== undefined || val !== null) {
      datatype = getDataType(val);
      if (datatype === "datetime") {
        val = new Date(val).toISOString();
      }
      const prop = configJson[key];
      const columnName = safeColumnName(provider, prop);
      resp[columnName] = val;
      columnTypes[columnName] = datatype;
    }
  });
}

function setFromProperties(provider, resp, input, columnTypes, prefix = "") {
  if (!input) return;
  Object.keys(input).forEach(key => {
    if (isObject(input[key])) {
      setFromProperties(
        provider,
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
      safeKey = transformColumnName(prefix + key);
      if (safeKey != "") {
        safeKey = safeColumnName(provider, safeKey);
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

function processWarehouseMessage(provider, message) {
  const responses = [];
  const eventType = message.type.toLowerCase();
  // store columnTypes as each column is set, so as not to call getDataType again
  const columnTypes = {};
  switch (eventType) {
    case "track": {
      const commonProps = {};
      setFromProperties(
        provider,
        commonProps,
        message.context,
        columnTypes,
        "context_"
      );
      setFromConfig(
        provider,
        commonProps,
        message,
        whTrackConfigJson,
        columnTypes
      );
      setFromConfig(
        provider,
        commonProps,
        message,
        whDefaultConfigJson,
        columnTypes
      );

      // set event column based on event_text in the tracks table
      const eventColName = safeColumnName(provider, "event");
      commonProps[eventColName] = transformTableName(
        commonProps[safeColumnName(provider, "event_text")]
      );
      columnTypes[eventColName] = "string";

      // shallow copy is sufficient since it does not contains nested objects
      const tracksEvent = { ...commonProps };
      const tracksMetadata = {
        table: safeTableName(provider, "tracks"),
        columns: getColumns(provider, tracksEvent, columnTypes),
        receivedAt: message.receivedAt
      };
      responses.push({
        metadata: tracksMetadata,
        data: tracksEvent
      });

      // do not create event table in case of empty event name (after transformColumnName)
      if (tracksEvent[eventColName] === "") {
        break;
      }

      const trackProps = {};
      setFromProperties(provider, trackProps, message.properties, columnTypes);
      setFromProperties(
        provider,
        trackProps,
        message.userProperties,
        columnTypes
      );

      // always set commonProps last so that they are not overwritten
      const trackEvent = { ...trackProps, ...commonProps };
      const trackEventMetadata = {
        table: excludeRudderCreatedTableNames(
          safeTableName(provider, transformColumnName(trackEvent[eventColName]))
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
        commonProps,
        message.userProperties,
        columnTypes
      );
      setFromProperties(
        provider,
        commonProps,
        message.context ? message.context.traits : {},
        columnTypes
      );
      setFromProperties(provider, commonProps, message.traits, columnTypes, "");

      // set context props
      setFromProperties(
        provider,
        commonProps,
        message.context,
        columnTypes,
        "context_"
      );

      const usersEvent = { ...commonProps };
      usersEvent[safeColumnName(provider, "id")] = message.userId;
      usersEvent[safeColumnName(provider, "received_at")] = message.receivedAt
        ? new Date(message.receivedAt).toISOString()
        : null;
      columnTypes[safeColumnName(provider, "received_at")] = "datetime";
      const usersMetadata = {
        table: safeTableName(provider, "users"),
        columns: getColumns(provider, usersEvent, columnTypes),
        receivedAt: message.receivedAt
      };
      responses.push({ metadata: usersMetadata, data: usersEvent });

      const identifiesEvent = { ...commonProps };
      setFromConfig(
        provider,
        identifiesEvent,
        message,
        whDefaultConfigJson,
        columnTypes
      );
      const identifiesMetadata = {
        table: safeTableName(provider, "identifies"),
        columns: getColumns(provider, identifiesEvent, columnTypes),
        receivedAt: message.receivedAt
      };
      responses.push({ metadata: identifiesMetadata, data: identifiesEvent });

      break;
    }
    case "page":
    case "screen": {
      const event = {};
      setFromProperties(provider, event, message.properties, columnTypes);
      // set rudder properties after user set properties to prevent overwriting
      setFromProperties(
        provider,
        event,
        message.context,
        columnTypes,
        "context_"
      );
      setFromConfig(provider, event, message, whDefaultConfigJson, columnTypes);

      if (eventType === "page") {
        setFromConfig(provider, event, message, whPageConfigJson, columnTypes);
      } else if (eventType === "screen") {
        setFromConfig(
          provider,
          event,
          message,
          whScreenConfigJson,
          columnTypes
        );
      }

      const metadata = {
        table: safeTableName(provider, `${eventType}s`),
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
        event,
        message.context,
        columnTypes,
        "context_"
      );
      setFromConfig(provider, event, message, whDefaultConfigJson, columnTypes);
      setFromConfig(provider, event, message, whGroupConfigJson, columnTypes);

      const metadata = {
        table: safeTableName(provider, "groups"),
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
        event,
        message.context,
        columnTypes,
        "context_"
      );
      setFromConfig(provider, event, message, whDefaultConfigJson, columnTypes);
      setFromConfig(provider, event, message, whAliasConfigJson, columnTypes);

      const metadata = {
        table: safeTableName(provider, "aliases"),
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

module.exports = processWarehouseMessage;
