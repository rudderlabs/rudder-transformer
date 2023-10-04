const lodash = require('lodash');
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
    obj[key] = lodash.isArray(val) ? JSON.stringify(val) : lodash.toString(val);
  });
};

const isSubEventTypeProfiles = (message) => {
  // check if profiles_model, profiles_entity, profiles_id_type are present in message.context.sources
  const { context } = message;
  if (!context?.sources) {
    return false;
  }
  const { sources } = context;
  return sources.profiles_entity && sources.profiles_id_type && sources.profiles_model;
};

const transformSubEventTypeProfiles = (message, workspaceId, destinationId) => {
  // form the hash
  const hash = `${workspaceId}:${destinationId}:${message.context.sources.profiles_entity}:${message.context.sources.profiles_id_type}:${message.userId}`;
  const key = `${message.context.sources.profiles_model}`;
  const value = JSON.stringify(message.traits);
  return {
    message: {
      hash,
      key,
      value,
    },
    userId: message.userId,
  };
};

const process = (event) => {
  const { message, destination, metadata } = event;
  const messageType = message && message.type && message.type.toLowerCase();

  if (messageType !== EventType.IDENTIFY) {
    return [];
  }

  if (isEmpty(message.userId)) {
    throw new InstrumentationError('Blank userId passed in identify event');
  }

  const { prefix } = destination.Config;
  const destinationId = destination.ID;
  const keyPrefix = isEmpty(prefix) ? '' : `${prefix.trim()}:`;

  if (isSubEventTypeProfiles(message)) {
    const { workspaceId } = metadata;
    return transformSubEventTypeProfiles(message, workspaceId, destinationId);
  }

  const hmap = {
    key: `${keyPrefix}user:${lodash.toString(message.userId)}`,
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
