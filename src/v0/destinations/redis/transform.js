const _ = require('lodash');
const flatten = require('flat');

const { isEmpty, isObject } = require('../../util');
const { EventType } = require('../../../constants');
const { InstrumentationError } = require('../../util/errorTypes');

// processValues:
// 1. removes keys with empty values or still an object(empty) after flattening
// 2. stringifies the values to set them in redis
const processValues = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || isObject(obj[key])) {
      // eslint-disable-next-line no-param-reassign
      delete obj[key];
      return;
    }
    const val = obj[key];
    // eslint-disable-next-line no-param-reassign
    obj[key] = _.isArray(val) ? JSON.stringify(val) : _.toString(val);
  });
};

const process = (event) => {
  const { message, destination } = event;
  const messageType = message && message.type && message.type.toLowerCase();

  if (messageType !== EventType.IDENTIFY) {
    return [];
  }

  if (isEmpty(message.userId)) {
    throw new InstrumentationError('Blank userId passed in identify event');
  }

  const { prefix } = destination.Config;
  const keyPrefix = isEmpty(prefix) ? '' : `${prefix.trim()}:`;

  const hmap = {
    key: `${keyPrefix}user:${_.toString(message.userId)}`,
    fields: {},
  };

  if (isObject(message.context) && isObject(message.context.traits)) {
    hmap.fields = flatten(message.context.traits, {
      delimiter: '.',
      safe: true,
    });
  }

  if (isObject(message.traits)) {
    hmap.fields = Object.assign(
      hmap.fields,
      flatten(message.traits, {
        delimiter: '.',
        safe: true,
      }),
    );
  }

  processValues(hmap.fields);

  if (Object.keys(hmap.fields).length === 0) {
    throw new InstrumentationError('context or context.traits or traits is empty');
  }

  const result = {
    message: hmap,
    userId: message.userId,
  };
  return result;
};

exports.process = process;
