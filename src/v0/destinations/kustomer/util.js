/* eslint-disable eqeqeq */
const axios = require("axios");
const _ = require("lodash");
const set = require("set-value");
const get = require("get-value");
const { BASE_ENDPOINT } = require("./config");
const { getType, isDefinedAndNotNull, isObject } = require("../../util");
const { getDynamicErrorType } = require("../../../adapters/utils/networkUtils");
const { NetworkError, AbortedError } = require("../../util/errorTypes");
const tags = require("../../util/tags");

/**
 * RegExp to test a string for a ISO 8601 Date spec
 *  YYYY
 *  YYYY-MM
 *  YYYY-MM-DD
 *  YYYY-MM-DDThh:mmTZD
 *  YYYY-MM-DDThh:mm:ssTZD
 *  YYYY-MM-DDThh:mm:ss.sTZD
 * @see: https://www.w3.org/TR/NOTE-datetime
 * @type {RegExp}
 */
const ISO_8601 = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;

// Handles for Number type fields
const transformNumberField = fieldName => {
  const typeDelim = "";
  const transformedFieldName = fieldName.trim().replace(/\s+/g, "-");
  if (_.endsWith(transformedFieldName, "Num")) {
    return transformedFieldName;
  }
  return `${transformedFieldName}${typeDelim}Num`;
};
// handles for Date type fields
const transformDateField = fieldName => {
  const typeDelim = "";
  const transformedFieldName = fieldName.trim().replace(/\s+/g, "-");
  if (_.endsWith(transformedFieldName, "At")) {
    return transformedFieldName;
  }
  return `${transformedFieldName}${typeDelim}At`;
};
// handle boolen values
const transformBooleanValue = value => {
  const transformedFieldValue = `${value}`;
  return transformedFieldValue;
};
// handle array values
const transformArrayValue = arrValue => {
  const transformedArrayValue = arrValue.map(x => JSON.stringify(x)).join(",");
  return transformedArrayValue;
};
// handle object value
const transformedObjectValue = objValue => {
  const transformedObjectVal = JSON.stringify(objValue);
  return transformedObjectVal;
};
// handles other type fields
const transformField = fieldName => {
  const transformedFieldName = fieldName.trim().replace(/\s+/g, "-");
  return transformedFieldName;
};

const handleAdvancedtransformations = event => {
  let cloneEvent = _.cloneDeep(event);
  const transformedMeta = {};
  let eventName = get(cloneEvent, "name");
  const { meta } = cloneEvent;

  // Handles event name
  // This will handle for event names = "Order Completed", "  Order Completed ", "Order   Completed" etc
  if (isDefinedAndNotNull(eventName)) {
    eventName = eventName.trim().replace(/\s+/g, "-");
    cloneEvent = set(cloneEvent, "name", eventName);
  }

  if (isDefinedAndNotNull(meta) && isObject(meta)) {
    Object.keys(meta).forEach(propKey => {
      if (getType(meta[propKey]) == "number") {
        transformedMeta[transformNumberField(propKey)] = meta[propKey];
      } else if (ISO_8601.test(meta[propKey])) {
        transformedMeta[transformDateField(propKey)] = meta[propKey];
      } else if (getType(meta[propKey]) == "boolean") {
        transformedMeta[transformField(propKey)] = transformBooleanValue(
          meta[propKey]
        );
      } else if (getType(meta[propKey]) == "array") {
        transformedMeta[transformField(propKey)] = transformArrayValue(
          meta[propKey]
        );
      } else if (getType(meta[propKey]) == "object") {
        transformedMeta[transformField(propKey)] = transformedObjectValue(
          meta[propKey]
        );
      } else {
        transformedMeta[transformField(propKey)] = meta[propKey];
      }
    });
  }

  cloneEvent = set(cloneEvent, "meta", transformedMeta);

  return cloneEvent;
};

const handleResponse = response => {
  const { status, data } = response;
  switch (status) {
    case 200:
      if (data && data.data && data.data.id) {
        return {
          userExists: true,
          targetUrl: `${BASE_ENDPOINT}/v1/customers/${data.data.id}?replace=false`
        };
      }
      throw new NetworkError(
        `Error while lookingUp Kustomer ${
          data.data ? JSON.stringify(data.data) : ""
        }`,
        status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status)
        },
        response
      );
    case 404:
      return { userExists: false };
    default:
      throw new NetworkError(
        data ? JSON.stringify(data) : "Error while lookingUp Kustomer",
        status || 400,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status || 400)
        },
        response
      );
  }
};

const fetchKustomer = async (url, destination) => {
  let response;
  try {
    response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${destination.Config.apiKey}`
      }
    });
  } catch (err) {
    if (err.response) {
      return handleResponse(err.response);
    }
    throw new AbortedError(err.message);
  }
  return handleResponse(response);
};

module.exports = {
  fetchKustomer,
  handleAdvancedtransformations
};
