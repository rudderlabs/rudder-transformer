const { isFeatureEnabled } = require('@rudderlabs/featureflag-sdk-node');
const { getXMLPayload } = require('../../../cdk/v2/destinations/http/utils');
const { EventType } = require('../../../constants');
const { getFieldValueFromMessage, flattenJson } = require('../../util');

const JSON = 'JSON';
const XML = 'XML';
const FORM = 'FORM';

const ContentTypeConstants = {
  'application/json': JSON,
  'application/xml': XML,
  'text/xml': XML,
  'application/x-www-form-urlencoded': FORM,
};

const getFormattedPayload = (headers, payload) => {
  const normalizedHeaders = Object.keys(headers).reduce((acc, key) => {
    acc[key.toLowerCase()] = headers[key];
    return acc;
  }, {});
  const contentType = normalizedHeaders['content-type'];
  const contentTypeSimplified = ContentTypeConstants[contentType] || JSON;

  switch (contentTypeSimplified) {
    case XML:
      return { payload: { payload: getXMLPayload(payload) }, contentTypeSimplified };
    case FORM:
      return { payload: flattenJson(payload), contentTypeSimplified };
    default:
      return { payload, contentTypeSimplified };
  }
};

const getPropertyParams = (message) => {
  if (message.type === EventType.IDENTIFY) {
    return flattenJson(getFieldValueFromMessage(message, 'traits'));
  }
  return flattenJson(message.properties);
};

module.exports = {
  getPropertyParams,
  getFormattedPayload,
  isFeatureEnabled,
};
