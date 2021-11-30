/* eslint-disable no-unused-vars */
const { isHttpStatusSuccess } = require("../../util/index");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const ErrorBuilder = require("../../util/error");
const { getMappingConfig } = require("../../util");
const { proxyRequest } = require("../../../adapters/network");
const {
  getDynamicMeta,
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");

const ConfigCategory = {
  IDENTIFY: {
    name: "BrazeUserAttributesConfig"
  },
  DEFAULT: {
    name: "BrazeUserAttributesConfig"
  }
};

function getIdentifyEndpoint(endPoint) {
  return `${endPoint}/users/identify`;
}

function getTrackEndPoint(endPoint) {
  return `${endPoint}/users/track`;
}

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

const BRAZE_PARTNER_NAME = "RudderStack";

// max requests per batch
// Ref: https://www.braze.com/docs/api/endpoints/user_data/post_user_track/
const TRACK_BRAZE_MAX_REQ_COUNT = 75;
const IDENTIFY_BRAZE_MAX_REQ_COUNT = 50;

const DESTINATION = "braze";

const responseHandler = (destinationResponse, _dest) => {
  const message = `[Braze Response Transform] Request for ${DESTINATION} Processed Successfully`;
  const { response, status } = destinationResponse;
  // if the responsee from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    throw new ErrorBuilder()
      .setStatus(status)
      .setMessage(
        `[Braze Response Transfom] Request failed for ${DESTINATION} with status: ${status}`
      )
      .setDestinationResponse(destinationResponse)
      .isTransformResponseFailure(true)
      .setStatTags({
        destination: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: getDynamicMeta(status)
      })
      .build();
  }
  // application level errors
  if (!!response && response.errors && response.errors.length > 0) {
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage(
        `[Braze Response Transfom] Request failed for ${DESTINATION} with status: ${status}`
      )
      .setDestinationResponse(destinationResponse)
      .isTransformResponseFailure(true)
      .setStatTags({
        destination: DESTINATION,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
        meta: getDynamicMeta(status)
      })
      .build();
  }
  return {
    status,
    message,
    destinationResponse
  };
};

const BrazeNetworkHandler = function() {
  this.responseHandler = responseHandler;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
};

module.exports = {
  ConfigCategory,
  mappingConfig,
  getIdentifyEndpoint,
  getTrackEndPoint,
  BRAZE_PARTNER_NAME,
  TRACK_BRAZE_MAX_REQ_COUNT,
  IDENTIFY_BRAZE_MAX_REQ_COUNT,
  DESTINATION,
  BrazeNetworkHandler
};
