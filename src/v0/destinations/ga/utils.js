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

module.exports = {
  validatePayloadSize,
};
