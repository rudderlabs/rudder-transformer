const {
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { CustomError } = require("../../util");
const ErrorBuilder = require("../../util/error");
const { GA_ENDPOINT } = require("./config");

/**
 * The response handler to handle responses from Google Analytics(Universal Analytics)
 * **Note**:
 * Currently this is being used to parse responses from deletion API
 *
 * @param {{success: boolean, response: any}} gaResponse
 * @returns
 */
const gaResponseHandler = gaResponse => {
  /**
   * Reference doc to understand the Data-structure of the error response
   * https://developers.google.com/analytics/devguides/config/userdeletion/v3/errors
   */
  const processedDeletionRequest = processAxiosResponse(gaResponse);
  const { response, status } = processedDeletionRequest;
  if (response.error) {
    const isInvalidCredsError = response.error?.errors?.some(errObj => {
      return errObj.reason && errObj.reason === "invalidCredentials";
    });
    if (isInvalidCredsError) {
      throw new ErrorBuilder()
        .setMessage("[GA] invalid credentials")
        .setStatus(500)
        .setDestinationResponse(response)
        .setAuthErrorCategory(REFRESH_TOKEN)
        .build();
    } else {
      throw new ErrorBuilder()
        .setMessage("[GA] Error occurred while completing deletion request")
        .setStatus(status)
        .setDestinationResponse(response)
        .build();
    }
  }
  return { response, status };
};

/**
 * payload must be no longer than 8192 bytes.
 * Ref - https://developers.google.com/analytics/devguides/collection/protocol/v1/reference#using-post
 * we are mimicking the behaviour of go language at server side to calculate the approx length
 * @param {*} finalPayload
 */
const validatePayloadSize = finalPayload => {
  const endpointPathname = `${new URL(GA_ENDPOINT).pathname}?`;
  // stringfy the JSON and remove {, }, " from it as these char do not include in the final payload
  // encodeURIComponent does not encode A-Z a-z 0-9 - _ . ~ ! * ' ( ) where as rudder server encodes ! * ' ( ) and transforms ' '(spaces) to '+'
  let payloadSize = {};
  Object.keys(finalPayload).forEach(keys => {
    if (typeof finalPayload[keys] === "number") {
      // go encodes this in exponential format
      payloadSize[keys] = encodeURIComponent(
        finalPayload[keys].toExponential()
      ).replace(/%20/g, "+");
    } else {
      // replacing ' ' with +
      payloadSize[keys] = encodeURIComponent(finalPayload[keys]).replace(
        /%20/g,
        "+"
      );
    }
  });
  payloadSize =
    endpointPathname.length +
    // remove {, }, " char
    JSON.stringify(payloadSize).replace(/[{}"]/g, "").length +
    // adding the length of these encoded values ! * ' ( ) which go encodes
    JSON.stringify(payloadSize).match(/[!*'()]/g).length * 2;

  if (payloadSize > 8192) {
    throw new CustomError(
      `The size of the payload is ${payloadSize} bytes. The payload data must be no longer than 8192 bytes.`,
      400
    );
  }
};

module.exports = {
  validatePayloadSize,
  gaResponseHandler
};
