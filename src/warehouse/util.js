const _ = require('lodash');
const get = require('get-value');

const v0 = require('./v0/util');
const v1 = require('./v1/util');
const { PlatformError } = require('../v0/util/errorTypes');

const minTimeInMs = Date.parse('0001-01-01T00:00:00Z');
const maxTimeInMs = Date.parse('9999-12-31T23:59:59.999Z');

const sourceCategoriesToUseRecordId = ['cloud', 'singer-protocol'];

const isObject = (value) => {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function') && !Array.isArray(value);
};

const isValidJsonPathKey = (eventType, key, val, level, jsonKeys = {}) => {
  return eventType === 'track' && jsonKeys[key] === level;
};

const isBlank = (value) => {
  return _.isEmpty(_.toString(value));
};
/*
 * input => ["a", "b.c"]
 * output => { "a": 0, "b_c": 1}
 */
const getKeysFromJsonPaths = (jsonPaths) => {
  const jsonKeys = {};
  jsonPaths.forEach((jsonPath) => {
    if (jsonPath.trim()) {
      const paths = jsonPath.trim().split('.');
      jsonKeys[paths.join('_')] = paths.length - 1;
    }
  });
  return jsonKeys;
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

function getVersionedUtils(schemaVersion) {
  switch (schemaVersion) {
    case 'v0':
      return v0;
    case 'v1':
      return v1;
    default:
      return v1;
  }
}

function isRudderSourcesEvent(event) {
  return event.channel === 'sources' || event.CHANNEL === 'sources';
}

const getCloudRecordID = (message, fallbackValue) => {
  if (get(message, 'context.sources.version')) {
    const { recordId } = message;
    if (typeof recordId === 'object' || isBlank(recordId)) {
      throw new PlatformError('recordId cannot be empty for cloud sources events');
    }
    return recordId;
  }
  return fallbackValue || null;
};

const getRecordIDForExtract = message => {
  const { recordId } = message;
  if (typeof recordId === "object" || isBlank(recordId)) {
    throw new Error("recordId cannot be empty for cloud sources events");
  }
  return recordId;
};

module.exports = {
  isObject,
  isBlank,
  isValidJsonPathKey,
  getKeysFromJsonPaths,
  timestampRegex,
  validTimestamp,
  getVersionedUtils,
  isRudderSourcesEvent,
  sourceCategoriesToUseRecordId,
  getCloudRecordID,
  getRecordIDForExtract
};
