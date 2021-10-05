/* eslint-disable no-param-reassign */
const get = require("get-value");
const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");

const {
  isObject,
  isBlank,
  validTimestamp,
  getVersionedUtils,
  isRudderSourcesEvent
} = require("./util");
const { getMergeRuleEvent } = require("./identity");

const whDefaultColumnMappingRules = require("./config/WHDefaultConfig.js");
const whTrackColumnMappingRules = require("./config/WHTrackConfig.js");
const whTracksTableColumnMappingRules = require("./config/WHTracksTableConfig.js");
const whTrackEventTableColumnMappingRules = require("./config/WHTrackEventTableConfig.js");
const whUserColumnMappingRules = require("./config/WHUserConfig.js");
const whPageColumnMappingRules = require("./config/WHPageConfig.js");
const whScreenColumnMappingRules = require("./config/WHScreenConfig.js");
const whGroupColumnMappingRules = require("./config/WHGroupConfig.js");
const whAliasColumnMappingRules = require("./config/WHAliasConfig.js");

const maxColumnsInEvent = parseInt(
  process.env.WH_MAX_COLUMNS_IN_EVENT || "200",
  10
);

const WH_POPULATE_SRC_DEST_INFO_IN_CONTEXT = process.env.WH_POPULATE_SRC_DEST_INFO_IN_CONTEXT || true;

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

const rudderReservedColums = {
  track: {
    ...whDefaultColumnMappingRules,
    ...whTrackColumnMappingRules,
    ...whTracksTableColumnMappingRules,
    ...whTrackEventTableColumnMappingRules
  },
  identify: { ...whDefaultColumnMappingRules, ...whUserColumnMappingRules },
  page: { ...whDefaultColumnMappingRules, ...whPageColumnMappingRules },
  screen: { ...whDefaultColumnMappingRules, ...whScreenColumnMappingRules },
  group: { ...whDefaultColumnMappingRules, ...whGroupColumnMappingRules },
  alias: { ...whDefaultColumnMappingRules, ...whAliasColumnMappingRules }
};

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

  eg.1
  input = {messageId: "m1", anonymousId: "a1"}
  output = {}
  columnMapping = {messageId: "id", anonymousId: "anonymous_id"}
  columnTypes = {}
  options = {}

  setDataFromColumnMappingAndComputeColumnTypes(utils, output, input, configJson, columnTypes, options)

  ----After in-place edit, the objects mutate to----

  output = {id: "m1", anonymous_id: "a1"}
  columnTypes = {id: "string", anonymous_id: "string"}
  the data type of an key from columnMapping shouldn't be object. if its, then the column is dropped
*/

function setDataFromColumnMappingAndComputeColumnTypes(
  utils,
  output,
  input,
  columnMapping,
  columnTypes,
  options
) {
  if (!isObject(columnMapping)) return;
  Object.keys(columnMapping).forEach(key => {
    const valInMap = columnMapping[key];
    let val;
    if (_.isFunction(valInMap)) {
      val = valInMap(input, options);
    } else {
      val = get(input, valInMap);
    }

    const columnName = utils.safeColumnName(options.provider, key);
    // do not set column if val is null/empty/object
    if (typeof val === "object" || isBlank(val)) {
      // delete in output and columnTypes, so as to remove if we user
      // has set property with same name
      // eslint-disable-next-line no-param-reassign
      delete output[columnName];
      // eslint-disable-next-line no-param-reassign
      delete columnTypes[columnName];
      return;
    }
    const datatype = getDataType(val, options);
    if (datatype === "datetime") {
      val = new Date(val).toISOString();
    }
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
  eventType,
  output,
  input,
  columnTypes,
  options,
  prefix = "",
  level = 0
) {
  if (!input || !isObject(input)) return;
  Object.keys(input).forEach(key => {
    if (
      isObject(input[key]) &&
      (options.sourceCategory !== "cloud" || level < 3)
    ) {
      setDataFromInputAndComputeColumnTypes(
        utils,
        eventType,
        output,
        input[key],
        columnTypes,
        options,
        `${prefix + key}_`,
        level + 1
      );
    } else {
      let val = input[key];
      // do not set column if val is null/empty
      if (isBlank(val)) {
        return;
      }
      if (
        options.sourceCategory === "cloud" &&
        level >= 3 &&
        isObject(input[key])
      ) {
        val = JSON.stringify(val);
      }

      const datatype = getDataType(val, options);
      if (datatype === "datetime") {
        val = new Date(val).toISOString();
      }
      let safeKey = utils.transformColumnName(options.provider, prefix + key);
      if (safeKey !== "") {
        safeKey = utils.safeColumnName(options.provider, safeKey);
        // remove rudder reserved columns name if set by user
        if (
          rudderReservedColums[eventType] &&
          rudderReservedColums[eventType][safeKey.toLowerCase()]
        ) {
          return;
        }
        // eslint-disable-next-line no-param-reassign
        output[safeKey] = val;
        // eslint-disable-next-line no-param-reassign
        columnTypes[safeKey] = datatype;
      }
    }
  });
}

/*
 * uuid_ts and loaded_at datatypes are passed from here to create appropriate columns.
 * Corresponding values are inserted when loading into the warehouse
 */
function getColumns(options, event, columnTypes) {
  const columns = {};
  const uuidTS = options.provider === "snowflake" ? "UUID_TS" : "uuid_ts";
  columns[uuidTS] = "datetime";
  // add loaded_at for bq to be segment compatible
  if (options.provider === "bq") {
    const loadedAt = "loaded_at";
    columns[loadedAt] = "datetime";
  }
  Object.keys(event).forEach(key => {
    columns[key] = columnTypes[key] || getDataType(event[key], options);
  });
  /*
   1) throw error if too many columns in an event just in case to avoid creating too many columns in warehouse due to a spurious event
   2) if the events are coming from rudder-sources, ignore the column limit as the event columns are controlled by user
  */
  if (
    Object.keys(columns).length > maxColumnsInEvent &&
    !isRudderSourcesEvent(event) && options.provider !== "s3_datalake"
  ) {
    throw new Error(
      `${options.provider} transfomer: Too many columns outputted from the event`
    );
  }
  return columns;
}

const fullEventColumnTypeByProvider = {
  snowflake: "json",
  rs: "text",
  bq: "string",
  postgres: "json",
  mssql: "json",
  azure_synapse: "json",
  clickhouse: "string",
  s3_datalake: "string"
};

function storeRudderEvent(utils, message, output, columnTypes, options) {
  if (options.whStoreEvent === true) {
    const colName = utils.safeColumnName(options.provider, "rudder_event");
    // eslint-disable-next-line no-param-reassign
    output[colName] = JSON.stringify(message);
    // eslint-disable-next-line no-param-reassign
    columnTypes[colName] = fullEventColumnTypeByProvider[options.provider];
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

/*
* Adds source and destination specific information into context
* */
function enhanceContextWithSourceDestInfo(message, metadata) {
  if (!WH_POPULATE_SRC_DEST_INFO_IN_CONTEXT) {
    return;
  }
  if (!metadata) {
    return;
  }
  context = message.context || {};
  context.sourceId = metadata.sourceId;
  context.sourceType = metadata.sourceType;
  context.destinationId = metadata.destinationId;
  context.destinationType = metadata.destinationType;

  message.context = context
}

function processWarehouseMessage(message, options) {
  const utils = getVersionedUtils(options.whSchemaVersion);
  options.utils = utils;

  const responses = [];
  const eventType = message.type.toLowerCase();

  if (isBlank(message.messageId)) {
    const randomID = uuidv4();
    message.messageId = `auto-${randomID}`;
  }

  // Adding source and destination specific information.
  enhanceContextWithSourceDestInfo(message, options.metadata)

  if (isBlank(message.receivedAt) || !validTimestamp(message.receivedAt)) {
    message.receivedAt =
      options.metadata && options.metadata.receivedAt
        ? options.metadata.receivedAt
        : new Date().toISOString();
  }

  // store columnTypes as each column is set, so as not to call getDataType again
  switch (eventType) {
    case "track": {
      // set properties common to both tracks and event table
      const commonProps = {};
      const commonColumnTypes = {};

      setDataFromInputAndComputeColumnTypes(
        utils,
        eventType,
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
        whTrackColumnMappingRules,
        commonColumnTypes,
        options
      );
      setDataFromColumnMappingAndComputeColumnTypes(
        utils,
        commonProps,
        message,
        whDefaultColumnMappingRules,
        commonColumnTypes,
        options
      );

      // set event column based on event_text in the tracks table
      const eventColName = utils.safeColumnName(options.provider, "event");
      commonProps[eventColName] = utils.transformTableName(
        commonProps[utils.safeColumnName(options.provider, "event_text")]
      );
      commonColumnTypes[eventColName] = "string";

      // -----start: tracks table------
      const tracksColumnTypes = {};
      // shallow copy is sufficient since it does not contains nested objects
      const tracksEvent = { ...commonProps };
      setDataFromColumnMappingAndComputeColumnTypes(
        utils,
        tracksEvent,
        message,
        whTracksTableColumnMappingRules,
        tracksColumnTypes,
        options
      );
      storeRudderEvent(utils, message, tracksEvent, tracksColumnTypes, options);
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
        eventType,
        trackProps,
        message.properties,
        eventTableColumnTypes,
        options
      );
      setDataFromInputAndComputeColumnTypes(
        utils,
        eventType,
        trackProps,
        message.userProperties,
        eventTableColumnTypes,
        options
      );
      setDataFromColumnMappingAndComputeColumnTypes(
        utils,
        commonProps,
        message,
        whTrackEventTableColumnMappingRules,
        commonColumnTypes,
        options
      );

      // always set commonProps last so that they are not overwritten
      const eventTableEvent = {
        ...trackProps,
        ...commonProps
      };
      const eventTableMetadata = {
        table: excludeRudderCreatedTableNames(
          utils.safeTableName(
            options.provider,
            utils.transformColumnName(
              options.provider,
              eventTableEvent[eventColName]
            )
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

      // -----start: identity_merge_rules table------
      const mergeRuleEvent = getMergeRuleEvent(message, eventType, options);
      if (mergeRuleEvent) {
        responses.push(mergeRuleEvent);
      }
      // -----end: identity_merge_rules table------

      break;
    }
    case "identify": {
      // set properties common to both identifies and users table
      const commonProps = {};
      const commonColumnTypes = {};
      setDataFromInputAndComputeColumnTypes(
        utils,
        eventType,
        commonProps,
        message.userProperties,
        commonColumnTypes,
        options
      );
      setDataFromInputAndComputeColumnTypes(
        utils,
        eventType,
        commonProps,
        message.context ? message.context.traits : {},
        commonColumnTypes,
        options
      );
      setDataFromInputAndComputeColumnTypes(
        utils,
        eventType,
        commonProps,
        message.traits,
        commonColumnTypes,
        options,
        ""
      );

      // set context props
      setDataFromInputAndComputeColumnTypes(
        utils,
        eventType,
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
        whDefaultColumnMappingRules,
        identifiesColumnTypes,
        options
      );
      storeRudderEvent(
        utils,
        message,
        identifiesEvent,
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

      // -----start: identity_merge_rules table------
      const mergeRuleEvent = getMergeRuleEvent(message, eventType, options);
      if (mergeRuleEvent) {
        responses.push(mergeRuleEvent);
      }
      // -----end: identity_merge_rules table------

      // -----start: users table------
      // do not create a user record if userId is not present in payload
      if (_.toString(message.userId).trim() === "") {
        break;
      }
      const usersEvent = { ...commonProps };
      const usersColumnTypes = {};
      setDataFromColumnMappingAndComputeColumnTypes(
        utils,
        usersEvent,
        message,
        whUserColumnMappingRules,
        usersColumnTypes,
        options
      );
      // set id
      usersEvent[utils.safeColumnName(options.provider, "id")] = message.userId;
      usersColumnTypes[
        utils.safeColumnName(options.provider, "id")
      ] = getDataType(message.userId, options);
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
        eventType,
        event,
        message.properties,
        columnTypes,
        options
      );
      // set rudder properties after user set properties to prevent overwriting
      setDataFromInputAndComputeColumnTypes(
        utils,
        eventType,
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
        whDefaultColumnMappingRules,
        columnTypes,
        options
      );
      storeRudderEvent(utils, message, event, columnTypes, options);

      if (eventType === "page") {
        setDataFromColumnMappingAndComputeColumnTypes(
          utils,
          event,
          message,
          whPageColumnMappingRules,
          columnTypes,
          options
        );
      } else if (eventType === "screen") {
        setDataFromColumnMappingAndComputeColumnTypes(
          utils,
          event,
          message,
          whScreenColumnMappingRules,
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

      // -----start: identity_merge_rules table------
      const mergeRuleEvent = getMergeRuleEvent(message, eventType, options);
      if (mergeRuleEvent) {
        responses.push(mergeRuleEvent);
      }
      // -----end: identity_merge_rules table------

      break;
    }
    case "group": {
      const event = {};
      const columnTypes = {};
      setDataFromInputAndComputeColumnTypes(
        utils,
        eventType,
        event,
        message.traits,
        columnTypes,
        options
      );
      setDataFromInputAndComputeColumnTypes(
        utils,
        eventType,
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
        whDefaultColumnMappingRules,
        columnTypes,
        options
      );
      setDataFromColumnMappingAndComputeColumnTypes(
        utils,
        event,
        message,
        whGroupColumnMappingRules,
        columnTypes,
        options
      );
      storeRudderEvent(utils, message, event, columnTypes, options);

      const metadata = {
        table: utils.safeTableName(options.provider, "groups"),
        columns: getColumns(options, event, columnTypes),
        receivedAt: message.receivedAt
      };
      responses.push({ metadata, data: event });

      // -----start: identity_merge_rules table------
      const mergeRuleEvent = getMergeRuleEvent(message, eventType, options);
      if (mergeRuleEvent) {
        responses.push(mergeRuleEvent);
      }
      // -----end: identity_merge_rules table------

      break;
    }
    case "alias": {
      const event = {};
      const columnTypes = {};
      setDataFromInputAndComputeColumnTypes(
        utils,
        eventType,
        event,
        message.traits,
        columnTypes,
        options
      );
      setDataFromInputAndComputeColumnTypes(
        utils,
        eventType,
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
        whDefaultColumnMappingRules,
        columnTypes,
        options
      );
      setDataFromColumnMappingAndComputeColumnTypes(
        utils,
        event,
        message,
        whAliasColumnMappingRules,
        columnTypes,
        options
      );
      storeRudderEvent(utils, message, event, columnTypes, options);

      const metadata = {
        table: utils.safeTableName(options.provider, "aliases"),
        columns: getColumns(options, event, columnTypes),
        receivedAt: message.receivedAt
      };
      responses.push({ metadata, data: event });

      // -----start: identity_merge_rules table------
      const mergeRuleEvent = getMergeRuleEvent(message, eventType, options);
      if (mergeRuleEvent) {
        responses.push(mergeRuleEvent);
      }
      // -----end: identity_merge_rules table------

      break;
    }
    case "merge": {
      const mergeRuleEvent = getMergeRuleEvent(message, eventType, options);
      if (mergeRuleEvent) {
        responses.push(mergeRuleEvent);
      }
      break;
    }
    default:
      throw new Error("Unknown event type", eventType);
  }
  return responses;
}

module.exports = {
  processWarehouseMessage,
  fullEventColumnTypeByProvider,
  getDataType
};
