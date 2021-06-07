const _ = require("lodash");
const flatten = require("flat");

const {
  isEmpty,
  isObject,
  getErrorRespEvents,
  getSuccessRespEvents,
  CustomError
} = require("../../util");
const { EventType } = require("../../../constants");

// processValues:
// 1. removes keys with empty values or still an object(empty) after flattening
// 2. stringifies the values to set them in redis
const processValues = obj => {
  Object.keys(obj).forEach(key => {
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

const process = event => {
  const { message, destination } = event;
  const messageType = message && message.type && message.type.toLowerCase();

  if (messageType !== EventType.IDENTIFY) {
    return [];
  }

  if (isEmpty(event.message.userId)) {
    throw new CustomError("Blank userId passed in identify event", 400);
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

  processValues(hmap.fields);

  if (Object.keys(hmap.fields).length === 0) {
    throw new CustomError("context or context.traits or traits is empty", 400);
  }

  const result = {
    message: hmap,
    userId: event.message.userId
  };
  return result;
};
const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
