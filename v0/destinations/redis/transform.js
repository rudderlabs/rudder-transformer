const _ = require("lodash");
const get = require("get-value");
const { isEmpty, isObject } = require("../../util");
const { transformColumnName } = require("../../../warehouse/v1/util");
const { EventType } = require("../../../constants");
const { getFirstValidValue } = require("../../../warehouse/config/helpers");

// Set fields in user hash map with same names as in warehouse
// Refer to functions setDataFromInputAndComputeColumnTypes and setDataFromColumnMappingAndComputeColumnTypes
// in warehouse transformer for examples
function setFields(output, input, prefix = "") {
  if (!input || !isObject(input)) return;
  Object.keys(input).forEach(key => {
    if (isObject(input[key])) {
      setFields(output, input[key], `${prefix + key}_`);
    } else {
      const val = input[key];
      // do not set column if val is null/empty
      if (isEmpty(val)) {
        return;
      }
      const safeKey = transformColumnName(prefix + key);
      // eslint-disable-next-line no-param-reassign
      output[safeKey] = _.isArray(val) ? JSON.stringify(val) : _.toString(val);
    }
  });
}

function setFieldsFromMapping(output, input, mapping) {
  if (!isObject(mapping)) return;
  Object.keys(mapping).forEach(key => {
    let val;
    if (_.isFunction(mapping[key])) {
      val = mapping[key](input);
    } else {
      val = get(input, mapping[key]);
    }

    const columnName = transformColumnName(key);
    // do not set column if val is null/empty
    if (isEmpty(val)) {
      // delete in output
      // eslint-disable-next-line no-param-reassign
      delete output[columnName];
      // eslint-disable-next-line no-param-reassign
      return;
    }
    // eslint-disable-next-line no-param-reassign
    output[columnName] = val;
  });
}

const contextIPMapping = {
  context_ip: message =>
    getFirstValidValue(message, ["context.ip", "request_ip"]),
  context_request_ip: "request_ip",
  context_passed_ip: "context.ip"
};

const process = event => {
  const { message, destination } = event;
  const messageType = message && message.type && message.type.toLowerCase();

  if (messageType !== EventType.IDENTIFY) {
    return [];
  }

  if (isEmpty(event.message.userId)) {
    throw new Error("Blank userId passed in identify event");
  }

  const { prefix } = destination.Config;
  const keyPrefix = isEmpty(prefix) ? "" : `${prefix.trim()}:`;

  const hmap = {
    key: `${keyPrefix}user:${_.toString(event.message.userId)}`,
    fields: {}
  };

  setFields(hmap.fields, message.traits);
  setFields(hmap.fields, message.context, "context_");
  // handle special case where additonal logic is need to set context_ip
  setFieldsFromMapping(hmap.fields, message, contextIPMapping);

  const result = {
    message: hmap,
    userId: event.message.userId
  };
  return result;
};

exports.process = process;
