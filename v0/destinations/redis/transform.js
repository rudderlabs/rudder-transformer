const _ = require("lodash");
const { isEmpty, isObject } = require("../../util");
const { transformColumnName } = require("../../../warehouse/v1/util");
const { EventType } = require("../../../constants");

/*
  setKeys takes in input object and 
  adds the key/values in input (recursively in case of keys with value of type object) to output object (prefix is added to all keys)

  Note: this function mutates output arg for sake of perf
  eg.
  output = {}
  input = { library: { name: 'rudder-sdk-ruby-sync', version: '1.0.6' } }
  prefix = "context_"

  setKeys(utils, output, input, columnTypes, options, prefix)

  ----After in-place edit, the objects mutate to----

  output = {context_library_name: 'rudder-sdk-ruby-sync', context_library_version: '1.0.6'}

*/
function setKeys(output, input, prefix = "") {
  if (!input || !isObject(input)) return;
  Object.keys(input).forEach(key => {
    if (isObject(input[key])) {
      setKeys(output, input[key], `${prefix + key}_`);
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
  const keyPrefix = isEmpty(prefix) ? "" : `${transformColumnName(prefix)}:`;

  const hmap = {
    key: `${keyPrefix}user:${_.toString(event.message.userId)}`,
    fields: {}
  };

  setKeys(hmap.fields, message.context, "context_");
  setKeys(hmap.fields, message.traits);

  const result = {
    message: hmap,
    userId: event.message.userId
  };
  return result;
};

exports.process = process;
