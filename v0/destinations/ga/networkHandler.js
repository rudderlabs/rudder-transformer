const {
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const ErrorBuilder = require("../../util/error");

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
    if (isInvalidCredsError || response?.error?.status === "UNAUTHENTICATED") {
      throw new ErrorBuilder()
        .setMessage("[GA] invalid credentials")
        .setStatus(500)
        .setDestinationResponse(response)
        .setAuthErrorCategory(REFRESH_TOKEN)
        .build();
    }
    throw new ErrorBuilder()
      .setMessage(
        `[GA] Error occurred while completing deletion request: ${response.error?.message}`
      )
      .setStatus(status)
      .setDestinationResponse(response)
      .build();
  }
  return { response, status };
};

module.exports = {
  gaResponseHandler
};
