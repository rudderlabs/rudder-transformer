const _ = require("lodash");
const flatten = require("flat");

const { isEmpty, isObject } = require("../../util");
const { EventType } = require("../../../constants");

// processValues:
// 1. removes keys with empty values
// 2. stringifies the values to set them in redis
const processValues = obj => {
  Object.keys(obj).forEach(key => {
    if (isEmpty(obj[key])) {
      // eslint-disable-next-line no-param-reassign
      delete obj[key];
      return;
    }
    const val = obj[key];
    // eslint-disable-next-line no-param-reassign
    obj[key] = _.isArray(val) ? JSON.stringify(val) : _.toString(val);
  });
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

  if (isObject(message.context) && isObject(message.context.traits)) {
    hmap.fields = flatten(message.context.traits, {
      delimiter: ".",
      safe: true
    });
  }

  if (isObject(message.traits)) {
    hmap.fields = Object.assign(
      hmap.fields,
      flatten(message.traits, {
        delimiter: ".",
        safe: true
      })
    );
  }

  if (Object.keys(hmap.fields).length === 0) {
    throw new Error("context or context.traits or traits is empty");
  }

  processValues(hmap.fields);

  const result = {
    message: hmap,
    userId: event.message.userId
  };
  return result;
};

exports.process = process;
