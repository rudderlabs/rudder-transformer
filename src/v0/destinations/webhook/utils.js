const { getXMLPayload, getFORMPayload } = require('../../../cdk/v2/destinations/http/utils');
const { EventType } = require('../../../constants');
const { getFieldValueFromMessage, flattenJson } = require('../../util');
const { isFeatureEnabled, setDefaultTraits } = require('feature-flag-sdk')


const JSON = 'JSON',
  XML = 'XML',
  FORM = 'FORM';

const ContentTypeConstants = {
  'application/json': JSON,
  'application/xml': XML,
  'text/xml': XML,
  'application/x-www-form-urlencoded': FORM
}

const isFormattedBodyFeatureEnabled = async (workspaceId) => {
  return await isFeatureEnabled(workspaceId, 'dest_transformer_webhook_form_support');
}

const getFormatedPayload = (headers, payload) => {
  const normalizedHeaders = Object.keys(headers).reduce((acc, key) => {
    acc[key.toLowerCase()] = headers[key];
    return acc;
  }, {});
  const contentType = normalizedHeaders['content-type'];
  const contentTypeSimplified = ContentTypeConstants[contentType] || JSON;

  switch (contentTypeSimplified) {
    case XML:
      return { payload: getXMLPayload(payload), contentTypeSimplified };
    case FORM:
      return { payload: getFORMPayload(payload), contentTypeSimplified };
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
  getFormatedPayload,
  isFormattedBodyFeatureEnabled,
  ContentTypeConstants
};
