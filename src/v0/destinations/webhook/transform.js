/* eslint-disable no-nested-ternary */
const get = require('get-value');
const set = require('set-value');
const {
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  defaultPatchRequestConfig,
  defaultGetRequestConfig,
  defaultRequestConfig,
  getFieldValueFromMessage,
  flattenJson,
  isDefinedAndNotNull,
  getHashFromArray,
  simpleProcessRouterDest,
  defaultDeleteRequestConfig,
  getIntegrationsObj,
} = require('../../util');

const { EventType } = require('../../../constants');
const { ConfigurationError } = require('../../util/errorTypes');

const getPropertyParams = (message) => {
  if (message.type === EventType.IDENTIFY) {
    return flattenJson(getFieldValueFromMessage(message, 'traits'));
  }
  return flattenJson(message.properties);
};
const processEvent = (event) => {
  const { DESTINATION, message, destination } = event;

  const integrationsObj = getIntegrationsObj(message, DESTINATION);
  // set context.ip from request_ip if it is missing
  if (!get(message, 'context.ip') && isDefinedAndNotNull(message.request_ip)) {
    set(message, 'context.ip', message.request_ip);
  }
  const response = defaultRequestConfig();
  const url = destination.Config[`${DESTINATION}Url`];
  const method = destination.Config[`${DESTINATION}Method`];
  const { headers } = destination.Config;

  if (url) {
    switch (method) {
      case defaultGetRequestConfig.requestMethod: {
        response.method = defaultGetRequestConfig.requestMethod;
        response.params = getPropertyParams(message);
        break;
      }
      case defaultPutRequestConfig.requestMethod: {
        response.method = defaultPutRequestConfig.requestMethod;
        response.body.JSON = message;
        response.headers = {
          'content-type': 'application/json',
        };
        break;
      }
      case defaultPatchRequestConfig.requestMethod: {
        response.method = defaultPatchRequestConfig.requestMethod;
        response.body.JSON = message;
        response.headers = {
          'content-type': 'application/json',
        };
        break;
      }
      case defaultDeleteRequestConfig.requestMethod: {
        response.method = defaultDeleteRequestConfig.requestMethod;
        response.params = getPropertyParams(message);
        break;
      }
      case defaultPostRequestConfig.requestMethod:
      default: {
        response.method = defaultPostRequestConfig.requestMethod;
        response.body.JSON = message;
        response.headers = {
          'content-type': 'application/json',
        };
        break;
      }
    }
    Object.assign(response.headers, getHashFromArray(headers));
    // ------------------------------------------------
    // This is temporary and just to support dynamic header through user transformation
    // Final goal is to support updating destinaiton config using user transformation
    //
    // We'll deprecate this feature as soon as we release the final feature
    // Sample user transformation for this:
    //
    // export function transformEvent(event, metadata) {
    //   event.header = {
    //     dynamic_header_1: "dynamic_header_value"
    //   };
    //
    //   return event;
    // }
    //
    // ------------------------------------------------
    const { header, anonymousId, fullPath, appendPath } = message;
    if (header) {
      if (typeof header === 'object') {
        Object.keys(header).forEach((key) => {
          const val = header[key];
          if (val && typeof val === 'string') {
            response.headers[key] = val;
          }
        });
      }

      if (response.body.JSON) {
        delete response.body.JSON.header;
      }
    }

    response.userId = anonymousId;
    response.endpoint = url;

    // Similar hack as above for dynamically changing the full url
    // Sample user transformation for this:
    //
    // export function transformEvent(event, metadata) {
    //   event.fullPath = `${subdomain}.rudderstack.com`
    //
    //   return event;
    // }
    if (
      (fullPath && typeof fullPath === 'string') ||
      (integrationsObj && integrationsObj.fullPath && typeof integrationsObj.fullPath === 'string')
    ) {
      response.endpoint = fullPath || integrationsObj.fullPath;
      delete message.fullPath;
    }

    // Similar hack as above to adding dynamic path to base url, probably needs a regex eventually
    // Sample user transformation for this:
    //
    // export function transformEvent(event, metadata) {
    //   event.appendPath = `/path/${var}/search?param=${var2}`
    //
    //   return event;
    // }
    if (
      (appendPath && typeof appendPath === 'string') ||
      (integrationsObj &&
        integrationsObj.appendPath &&
        typeof integrationsObj.appendPath === 'string')
    ) {
      response.endpoint += appendPath || integrationsObj.appendPath;
      delete message.appendPath;
    }

    return response;
  }
  throw new ConfigurationError('Invalid URL in destination config');
};
const DESTINATION = 'webhook';
const process = (event) => {
  const response = processEvent({ ...event, DESTINATION });
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const destNameRichInputs = inputs.map((input) => ({ ...input, DESTINATION }));
  const respList = await simpleProcessRouterDest(destNameRichInputs, processEvent, reqMetadata);
  return respList;
};

module.exports = { processEvent, process, processRouterDest };
