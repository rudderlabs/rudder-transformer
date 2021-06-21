/* eslint-disable eqeqeq */
const axios = require("axios");
const _ = require("lodash");
const set = require("set-value");
const get = require("get-value");
const { BASE_ENDPOINT } = require("./config");
const { getType, isDefinedAndNotNull, isObject } = require("../../util");

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

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.response = { status: statusCode };
  }
}

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
      throw new CustomError(
        `Error while lookingUp Kustomer ${
          data.data ? JSON.stringify(data.data) : ""
        }`,
        400
      );
    case 404:
      return { userExists: false };
    default:
      throw new CustomError(
        data ? JSON.stringify(data) : "Error while lookingUp Kustomer",
        status || 400
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
    throw new CustomError(err.message, 400);
  }
  return handleResponse(response);
};

module.exports = {
  fetchKustomer,
  handleAdvancedtransformations,
  CustomError
};
