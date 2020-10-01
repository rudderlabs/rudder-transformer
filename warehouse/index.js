const get = require("get-value");
const _ = require("lodash");

const v0 = require("./v0/util");
const v1 = require("./v1/util");

const whDefaultColumnMapping = require("./config/WHDefaultConfig.json");
const whTrackColumnMapping = require("./config/WHTrackConfig.json");
const whPageColumnMapping = require("./config/WHPageConfig.json");
const whScreenColumnMapping = require("./config/WHScreenConfig.json");
const whGroupColumnMapping = require("./config/WHGroupConfig.json");
const whAliasColumnMapping = require("./config/WHAliasConfig.json");

const minTimeInMs = Date.parse("0001-01-01T00:00:00Z");
const maxTimeInMs = Date.parse("9999-12-31T23:59:59.999Z");

const isObject = value => {
  const type = typeof value;
  return (
    value != null &&
    (type === "object" || type === "function") &&
    !Array.isArray(value)
  );
};

const isBlank = value => {
  return _.isEmpty(_.toString(value));
};

// https://www.myintervals.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
// make sure to disable prettier for regex expression
// prettier-ignore
const timestampRegex = new RegExp(
  // eslint-disable-next-line no-useless-escape
  /^([\+-]?\d{4})((-)((0[1-9]|1[0-2])(-([12]\d|0[1-9]|3[01])))([T\s]((([01]\d|2[0-3])((:)[0-5]\d))([\:]\d+)?)?(:[0-5]\d([\.]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)$/
);

function validTimestamp(input) {
  if (timestampRegex.test(input)) {
    // check if date value lies in between min time and max time. if not then it's not a valid timestamp
    const dateInMs = Date.parse(new Date(input).toISOString());
    if (minTimeInMs <= dateInMs && dateInMs <= maxTimeInMs) {
      return true;
    }
  }
  return false;
}

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
  if (
    options.getDataTypeOverride &&
    typeof options.getDataTypeOverride === "function"
  ) {
    return options.getDataTypeOverride(val, options) || "string";
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

/*
  setDataFromColumnMappingAndComputeColumnTypes takes in input object and 
    1. reads columnMapping and adds corresponding data from message to output object
    2. computes and sets the datatype of the added data to output in columnTypes object

  Note: this function mutates output, columnTypes args for sake of perf
    
  eg.
  input = {messageId: "m1", anonymousId: "a1"}
  output = {}
  columnMapping = {messageId: "id", anonymousId: "anonymous_id"}
  columnTypes = {}
  options = {}

  setDataFromColumnMappingAndComputeColumnTypes(utils, output, input, configJson, columnTypes, options)

  ----After in-place edit, the objects mutate to----

  output = {id: "m1", anonymous_id: "a1"}
  columnTypes = {id: "string", anonymous_id: "string"}
*/

function setDataFromColumnMappingAndComputeColumnTypes(
  utils,
  output,
  input,
  columnMapping,
  columnTypes,
  options
) {
  Object.keys(columnMapping).forEach(key => {
    let val = get(input, key);
    // do not set column if val is null/empty
    if (isBlank(val)) {
      return;
    }
    const datatype = getDataType(val, options);
    if (datatype === "datetime") {
      val = new Date(val).toISOString();
    }
    const prop = columnMapping[key];
    const columnName = utils.safeColumnName(options.provider, prop);
    // eslint-disable-next-line no-param-reassign
    output[columnName] = val;
    // eslint-disable-next-line no-param-reassign
    columnTypes[columnName] = datatype;
  });
}

/*
  setDataFromInputAndComputeColumnTypes takes in input object and 
    1. adds the key/values in input (recursively in case of keys with value of type object) to output object (prefix is added to all keys)
    2. computes and sets the datatype of the added data to output in columnTypes object

  Note: this function mutates output, columnTypes args for sake of perf

  eg.
  output = {}
  input = { library: { name: 'rudder-sdk-ruby-sync', version: '1.0.6' } }
  columnTypes = {}
  options = {}
  prefix = "context_"

  setDataFromInputAndComputeColumnTypes(utils, output, input, columnTypes, options, prefix)

  ----After in-place edit, the objects mutate to----

  output = {context_library_name: 'rudder-sdk-ruby-sync', context_library_version: '1.0.6'}
  columnTypes = {context_library_name: 'string', context_library_version: 'string'}

*/

function setDataFromInputAndComputeColumnTypes(
  utils,
  output,
  input,
  columnTypes,
  options,
  prefix = ""
) {
  if (!input) return;
  Object.keys(input).forEach(key => {
    if (isObject(input[key])) {
      setDataFromInputAndComputeColumnTypes(
        utils,
        output,
        input[key],
        columnTypes,
        options,
        `${prefix + key}_`
      );
    } else {
      let val = input[key];
      // do not set column if val is null/empty
      if (isBlank(val)) {
        return;
      }
      const datatype = getDataType(val, options);
      if (datatype === "datetime") {
        val = new Date(val).toISOString();
      }
      let safeKey = utils.transformColumnName(prefix + key);
      if (safeKey !== "") {
        safeKey = utils.safeColumnName(options.provider, safeKey);
        // eslint-disable-next-line no-param-reassign
        output[safeKey] = val;
        // eslint-disable-next-line no-param-reassign
        columnTypes[safeKey] = datatype;
      }
    }
  });
}

function getColumns(options, obj, columnTypes) {
  const columns = {};
  const uuidTS = options.provider === "snowflake" ? "UUID_TS" : "uuid_ts";
  columns[uuidTS] = "datetime";
  // add loaded_at for bq to be segment compatible
  if (options.provider === "bq") {
    const loadedAt = "loaded_at";
    columns[loadedAt] = "datetime";
  }
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

/*
  Examples:

  1. track event
  input: {
    "message": {
      "type": "track",
      "event": "Example Event",
      "sentAt": "2020-08-24T20:19:05.560Z",
      "userId": "fec930b2-ab00-4b9d-a912-ed48ab5a5b52",
      "context": {
        "library": {
          "name": "rudder-sdk-ruby-sync",
          "version": "1.0.6"
        }
      },
      "messageId": "e8e5d7e7-d9e2-4f49-833b-5b01bafa3933",
      "timestamp": "2020-08-24T20:19:05.560Z",
      "properties": {
        "id": true,
        "is_anonymous_user": true,
        "score": 5
      },
      "anonymousId": "26508834-c290-4354-9303-11c9b339a58a",
      "integrations": {
        "All": true
      }
    }
  }
  output: [
    {
      "output": {
        "metadata": {
          "table": "tracks",
          "columns": {
            "uuid_ts": "datetime",
            "context_library_name": "string",
            "context_library_version": "string",
            "event_text": "string",
            "id": "string",
            "anonymous_id": "string",
            "user_id": "string",
            "sent_at": "datetime",
            "timestamp": "datetime",
            "event": "string"
          }
        },
        "data": {
          "context_library_name": "rudder-sdk-ruby-sync",
          "context_library_version": "1.0.6",
          "event_text": "Example Event",
          "id": "e8e5d7e7-d9e2-4f49-833b-5b01bafa3933",
          "anonymous_id": "26508834-c290-4354-9303-11c9b339a58a",
          "user_id": "fec930b2-ab00-4b9d-a912-ed48ab5a5b52",
          "sent_at": "2020-08-24T20:19:05.560Z",
          "timestamp": "2020-08-24T20:19:05.560Z",
          "event": "example_event"
        }
    },
    "statusCode": 200
    },
    {
      "output": {
        "metadata": {
          "table": "example_event",
          "columns": {
            "uuid_ts": "datetime",
            "id": "string",
            "is_anonymous_user": "boolean",
            "score": "int",
            "context_library_name": "string",
            "context_library_version": "string",
            "event_text": "string",
            "anonymous_id": "string",
            "user_id": "string",
            "sent_at": "datetime",
            "timestamp": "datetime",
            "event": "string"
          }
        },
        "data": {
          "id": "e8e5d7e7-d9e2-4f49-833b-5b01bafa3933",
          "is_anonymous_user": true,
          "score": 5,
          "context_library_name": "rudder-sdk-ruby-sync",
          "context_library_version": "1.0.6",
          "event_text": "Example Event",
          "anonymous_id": "26508834-c290-4354-9303-11c9b339a58a",
          "user_id": "fec930b2-ab00-4b9d-a912-ed48ab5a5b52",
          "sent_at": "2020-08-24T20:19:05.560Z",
          "timestamp": "2020-08-24T20:19:05.560Z",
          "event": "example_event"
        }
      },
      "statusCode": 200
    }

  ]

  2.identify event
  input: {
    "message": {
      "type": "identify",
      "channel": "web",
      "context": {
        "app": {
          "build": "1.0.0"
        }
      },
      "request_ip": "1.1.1.1",
      "anonymousId": "26508834-c290-4354-9303-11c9b339a58a",
      "userId": "fec930b2-ab00-4b9d-a912-ed48ab5a5b52",
      "traits": {
        "name": "srikanth",
        "email": "srikanth@rudderlabs.com",
        "userId": "u1"
      },
      "sentAt": "2006-01-02T15:04:05.000Z07:00"
    }
  }

  output: [
    {
      "output": {
        "metadata": {
          "table": "identifies",
          "columns": {
            "uuid_ts": "datetime",
            "name": "string",
            "email": "string",
            "context_app_build": "string",
            "_user_id": "string",
            "anonymous_id": "string",
            "user_id": "string",
            "context_ip": "string",
            "sent_at": "string",
            "channel": "string"
          }
        },
        "data": {
          "name": "srikanth",
          "email": "srikanth@rudderlabs.com",
          "context_app_build": "1.0.0",
          "_user_id": "u1",
          "anonymous_id": "26508834-c290-4354-9303-11c9b339a58a",
          "user_id": "fec930b2-ab00-4b9d-a912-ed48ab5a5b52",
          "context_ip": "1.1.1.1",
          "sent_at": "2006-01-02T15:04:05.000Z07:00",
          "channel": "web"
        }
      },
      "statusCode": 200
    },
    {
      "output": {
        "metadata": {
          "table": "users",
          "columns": {
            "uuid_ts": "datetime",
            "name": "string",
            "email": "string",
            "context_app_build": "string",
            "_user_id": "string",
            "id": "string",
            "received_at": "datetime"
          }
        },
        "data": {
          "name": "srikanth",
          "email": "srikanth@rudderlabs.com",
          "context_app_build": "1.0.0",
          "_user_id": "u1",
          "id": "fec930b2-ab00-4b9d-a912-ed48ab5a5b52",
          "received_at": "2020-08-25T07:21:48.481Z"
        }
      },
      "statusCode": 200
    }
  ]
*/
function processWarehouseMessage(message, options) {
  const utils = getVersionedUtils(options.whSchemaVersion);
  const responses = [];
  const eventType = message.type.toLowerCase();
  // store columnTypes as each column is set, so as not to call getDataType again
  switch (eventType) {
    case "track": {
      // set properties common to both tracks and event table
      const commonProps = {};
      const commonColumnTypes = {};

      setDataFromInputAndComputeColumnTypes(
        utils,
        commonProps,
        message.context,
        commonColumnTypes,
        options,
        "context_"
      );

      setDataFromColumnMappingAndComputeColumnTypes(
        utils,
        commonProps,
        message,
        whTrackColumnMapping,
        commonColumnTypes,
        options
      );
      setDataFromColumnMappingAndComputeColumnTypes(
        utils,
        commonProps,
        message,
        whDefaultColumnMapping,
        commonColumnTypes,
        options
      );

      // -----start: tracks table------

      const tracksColumnTypes = {};
      // set event column based on event_text in the tracks table
      const eventColName = utils.safeColumnName(options.provider, "event");
      commonProps[eventColName] = utils.transformTableName(
        commonProps[utils.safeColumnName(options.provider, "event_text")]
      );
      tracksColumnTypes[eventColName] = "string";

      // shallow copy is sufficient since it does not contains nested objects
      const tracksEvent = { ...commonProps };
      const tracksMetadata = {
        table: utils.safeTableName(options.provider, "tracks"),
        columns: getColumns(options, tracksEvent, {
          ...tracksColumnTypes,
          ...commonColumnTypes
        }), // override tracksColumnTypes with columnTypes from commonColumnTypes
        receivedAt: message.receivedAt
      };
      responses.push({
        metadata: tracksMetadata,
        data: tracksEvent
      });

      // -----end: tracks table------

      // -----start: event table------

      // do not create event table in case of empty event name (after utils.transformColumnName)
      if (_.toString(tracksEvent[eventColName]).trim() === "") {
        break;
      }
      const trackProps = {};
      const eventTableColumnTypes = {};

      setDataFromInputAndComputeColumnTypes(
        utils,
        trackProps,
        message.properties,
        eventTableColumnTypes,
        options
      );
      setDataFromInputAndComputeColumnTypes(
        utils,
        trackProps,
        message.userProperties,
        eventTableColumnTypes,
        options
      );
      // always set commonProps last so that they are not overwritten
      const eventTableEvent = { ...trackProps, ...commonProps };
      const eventTableMetadata = {
        table: excludeRudderCreatedTableNames(
          utils.safeTableName(
            options.provider,
            utils.transformColumnName(eventTableEvent[eventColName])
          )
        ),
        columns: getColumns(options, eventTableEvent, {
          ...eventTableColumnTypes,
          ...commonColumnTypes
        }), // override tracksColumnTypes with columnTypes from commonColumnTypes
        receivedAt: message.receivedAt
      };
      responses.push({
        metadata: eventTableMetadata,
        data: eventTableEvent
      });
      // -----end: event table------

      break;
    }
    case "identify": {
      // set properties common to both identifies and users table
      const commonProps = {};
      const commonColumnTypes = {};
      setDataFromInputAndComputeColumnTypes(
        utils,
        commonProps,
        message.userProperties,
        commonColumnTypes,
        options
      );
      setDataFromInputAndComputeColumnTypes(
        utils,
        commonProps,
        message.context ? message.context.traits : {},
        commonColumnTypes,
        options
      );
      setDataFromInputAndComputeColumnTypes(
        utils,
        commonProps,
        message.traits,
        commonColumnTypes,
        options,
        ""
      );

      // set context props
      setDataFromInputAndComputeColumnTypes(
        utils,
        commonProps,
        message.context,
        commonColumnTypes,
        options,
        "context_"
      );

      // TODO: create a list of reserved keywords and append underscore for all in setDataFromInputAndComputeColumnTypes
      const userIdColumn = utils.safeColumnName(options.provider, "user_id");
      if (_.has(commonProps, userIdColumn)) {
        const newUserIdColumn = `_${userIdColumn}`;
        commonProps[newUserIdColumn] = commonProps[userIdColumn];
        delete commonProps[userIdColumn];
        commonColumnTypes[newUserIdColumn] = commonColumnTypes[userIdColumn];
        delete commonColumnTypes[userIdColumn];
      }

      // -----start: identifies table------
      const identifiesEvent = { ...commonProps };
      const identifiesColumnTypes = {};
      setDataFromColumnMappingAndComputeColumnTypes(
        utils,
        identifiesEvent,
        message,
        whDefaultColumnMapping,
        identifiesColumnTypes,
        options
      );
      const identifiesMetadata = {
        table: utils.safeTableName(options.provider, "identifies"),
        columns: getColumns(options, identifiesEvent, {
          ...commonColumnTypes,
          ...identifiesColumnTypes
        }), // override commonColumnTypes with columnTypes from setDataFromColumnMappingAndComputeColumnTypes
        receivedAt: message.receivedAt
      };
      responses.push({
        metadata: identifiesMetadata,
        data: identifiesEvent
      });
      // -----end: identifies table------

      // -----start: users table------
      // do not create a user record if userId is not present in payload
      if (_.toString(message.userId).trim() === "") {
        break;
      }
      const usersEvent = { ...commonProps };
      const usersColumnTypes = {};
      // set id
      usersEvent[utils.safeColumnName(options.provider, "id")] = message.userId;
      usersColumnTypes[utils.safeColumnName(options.provider, "id")] = "string";
      // set received_at
      usersEvent[
        utils.safeColumnName(options.provider, "received_at")
      ] = message.receivedAt
        ? new Date(message.receivedAt).toISOString()
        : new Date().toISOString();
      usersColumnTypes[utils.safeColumnName(options.provider, "received_at")] =
        "datetime";

      const usersMetadata = {
        table: utils.safeTableName(options.provider, "users"),
        columns: getColumns(options, usersEvent, {
          ...commonColumnTypes,
          ...usersColumnTypes
        }), // override commonColumnTypes with columnTypes from setDataFromColumnMappingAndComputeColumnTypes
        receivedAt: message.receivedAt
      };
      responses.push({
        metadata: usersMetadata,
        data: usersEvent
      });
      // -----end: users table------

      break;
    }
    case "page":
    case "screen": {
      const event = {};
      const columnTypes = {};
      setDataFromInputAndComputeColumnTypes(
        utils,
        event,
        message.properties,
        columnTypes,
        options
      );
      // set rudder properties after user set properties to prevent overwriting
      setDataFromInputAndComputeColumnTypes(
        utils,
        event,
        message.context,
        columnTypes,
        options,
        "context_"
      );
      setDataFromColumnMappingAndComputeColumnTypes(
        utils,
        event,
        message,
        whDefaultColumnMapping,
        columnTypes,
        options
      );

      if (eventType === "page") {
        setDataFromColumnMappingAndComputeColumnTypes(
          utils,
          event,
          message,
          whPageColumnMapping,
          columnTypes,
          options
        );
      } else if (eventType === "screen") {
        setDataFromColumnMappingAndComputeColumnTypes(
          utils,
          event,
          message,
          whScreenColumnMapping,
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
      const columnTypes = {};
      setDataFromInputAndComputeColumnTypes(
        utils,
        event,
        message.traits,
        columnTypes,
        options
      );
      setDataFromInputAndComputeColumnTypes(
        utils,
        event,
        message.context,
        columnTypes,
        options,
        "context_"
      );
      setDataFromColumnMappingAndComputeColumnTypes(
        utils,
        event,
        message,
        whDefaultColumnMapping,
        columnTypes,
        options
      );
      setDataFromColumnMappingAndComputeColumnTypes(
        utils,
        event,
        message,
        whGroupColumnMapping,
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
      const columnTypes = {};
      setDataFromInputAndComputeColumnTypes(
        utils,
        event,
        message.traits,
        columnTypes,
        options
      );
      setDataFromInputAndComputeColumnTypes(
        utils,
        event,
        message.context,
        columnTypes,
        options,
        "context_"
      );
      setDataFromColumnMappingAndComputeColumnTypes(
        utils,
        event,
        message,
        whDefaultColumnMapping,
        columnTypes,
        options
      );
      setDataFromColumnMappingAndComputeColumnTypes(
        utils,
        event,
        message,
        whAliasColumnMapping,
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
