const { InstrumentationError } = require('../../util/errorTypes');
const { GA_ENDPOINT } = require('./config');

/**
 * payload must be no longer than 8192 bytes.
 * Ref - https://developers.google.com/analytics/devguides/collection/protocol/v1/reference#using-post
 * we are mimicking the behaviour of go language at server side to calculate the approx length
 * @param {*} finalPayload
 */
const validatePayloadSize = (finalPayload) => {
  const endpointPathname = `${new URL(GA_ENDPOINT).pathname}?`;
  // stringfy the JSON and remove {, }, " from it as these char do not include in the final payload
  // encodeURIComponent does not encode A-Z a-z 0-9 - _ . ~ ! * ' ( ) where as rudder server encodes ! * ' ( ) and transforms ' '(spaces) to '+'
  let payloadSize = {};
  Object.keys(finalPayload).forEach((keys) => {
    if (typeof finalPayload[keys] === 'number') {
      // go encodes this in exponential format
      payloadSize[keys] = encodeURIComponent(finalPayload[keys].toExponential()).replace(
        /%20/g,
        '+',
      );
    } else {
      // replacing ' ' with +
      payloadSize[keys] = encodeURIComponent(finalPayload[keys]).replace(/%20/g, '+');
    }
  });
  payloadSize =
    endpointPathname.length +
    // remove {, }, " char
    JSON.stringify(payloadSize).replace(/["{}]/g, '').length +
    // adding the length of these encoded values ! * ' ( ) which go encodes
    JSON.stringify(payloadSize).match(/[!'()*]/g).length * 2;

  if (payloadSize > 8192) {
    throw new InstrumentationError(
      `The size of the payload is ${payloadSize} bytes. The payload data must be no longer than 8192 bytes.`,
    );
  }
};

const setContextualFields = (payload, message, params) => {
  const rawPayload = { ...payload };
  if (message.context) {
    const { campaign, userAgent, locale, app, screen } = message.context;
    rawPayload.ua = params.ua || userAgent;
    rawPayload.ul = params.ul || locale;
    if (app) {
      rawPayload.an = params.an || app.name;
      rawPayload.av = params.av || app.version;
      rawPayload.aiid = params.aiid || app.namespace;
    }
    if (campaign) {
      const { name, source, medium, content, term, campaignId } = campaign;
      rawPayload.cn = params.cn || name;
      rawPayload.cs = params.cs || source;
      rawPayload.cm = params.cm || medium;
      rawPayload.cc = params.cc || content;
      rawPayload.ck = params.ck || term;
      rawPayload.ci = campaignId;
    }

    if (screen) {
      const { width, height } = screen;
      if (width && height) {
        rawPayload.sr = `${width}x${height}`;
      }

      const { innerWidth, innerHeight } = screen;
      if (innerWidth && innerHeight) {
        rawPayload.vp = `${innerWidth}x${innerHeight}`;
      }
    }
  }

  return rawPayload;
};

module.exports = {
  validatePayloadSize,
  setContextualFields,
};
