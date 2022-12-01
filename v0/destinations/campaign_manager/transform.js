const { EventType } = require("../../../constants");

const {
  constructPayload,
  defaultRequestConfig,
  CustomError,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  isDefinedAndNotNull,
  simpleProcessRouterDest
} = require("../../util");

const { ConfigCategories, mappingConfig, BASE_URL } = require("./config");
const ErrorBuilder = require("../../util/error");

const getAccessToken = ({ secret }) => {
  if (!secret) {
    throw new ErrorBuilder()
      .setMessage("[CAMPAIGN MANAGER (DCM)]:: OAuth - access token not found")
      .setStatus(500)
      .build();
  }
  return secret.access_token;
};

// build final response
function buildResponse(
  requestJson,
  metadata,
  endpointUrl,
  requestType,
  encryptionInfo
) {
  const response = defaultRequestConfig();
  response.endpoint = endpointUrl;
  response.headers = {
    Authorization: `Bearer ${getAccessToken(metadata)}`,
    "Content-Type": "application/json"
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON.kind =
    requestType === "batchinsert"
      ? "dfareporting#conversionsBatchInsertRequest"
      : "dfareporting#conversionsBatchUpdateRequest";
  if (isDefinedAndNotNull(encryptionInfo)) {
    response.body.JSON.encryptionInfo = encryptionInfo;
  }
  response.body.JSON.conversions = [removeUndefinedAndNullValues(requestJson)];
  return response;
}

function prepareUrl(message, destination) {
  const profileId = message.properties.profileId
    ? Number(message.properties.profileId)
    : Number(destination.Config.profileId);
  return `${BASE_URL}/${profileId}/conversions/${message.properties.requestType}`;
}

// process track call
function processTrack(message, metadata, destination) {
  const requestJson = constructPayload(
    message,
    mappingConfig[ConfigCategories.TRACK.name]
  );
  requestJson.nonPersonalizedAd =
      requestJson.nonPersonalizedAd != null ? requestJson.nonPersonalizedAd : destination.Config.nonPersonalizedAd;
  requestJson.treatmentForUnderage =
      requestJson.treatmentForUnderage != null ? requestJson.treatmentForUnderage : destination.Config.treatmentForUnderage;
  requestJson.childDirectedTreatment =
      requestJson.childDirectedTreatment != null ? requestJson.childDirectedTreatment : destination.Config.childDirectedTreatment;
  requestJson.limitAdTracking =
      requestJson.limitAdTracking != null ? requestJson.limitAdTracking : destination.Config.limitAdTracking;
  // updating these values is not allowed
  if (message.properties.requestType == "batchupdate") {
    delete requestJson.childDirectedTreatment;
    delete requestJson.limitAdTracking;
  }
  requestJson.timestampMicros = requestJson.timestampMicros.toString();
  const endpointUrl = prepareUrl(message, destination);
  return buildResponse(
    requestJson,
    metadata,
    endpointUrl,
    message.properties.requestType,
    message.properties.encryptionInfo
  );
}

function validateRequest(message) {
  if (!message.properties) {
    throw new CustomError(
      "[CAMPAIGN MANAGER (DCM)]: properties must be present in event. Aborting message",
      400
    );
  }

  if (
    message.properties.requestType !== "batchinsert" &&
    message.properties.requestType !== "batchupdate"
  ) {
    throw new CustomError(
      "[CAMPAIGN MANAGER (DCM)]: properties.requestType must be one of batchinsert or batchupdate.",
      400
    );
  }

  if (
    message.properties.encryptedUserId &&
    !message.properties.encryptionInfo
  ) {
    throw new CustomError(
      "[CAMPAIGN MANAGER (DCM)]: encryptionInfo is a required field if encryptedUserId is used.",
      400
    );
  }
}

function process(event) {
  const { message, metadata, destination } = event;

  if (!message.type) {
    throw new CustomError(
      "[CAMPAIGN MANAGER (DCM)]: Message Type missing. Aborting message.",
      400
    );
  }

  validateRequest(message);

  const messageType = message.type.toLowerCase();

  switch (messageType) {
    case EventType.TRACK:
      return processTrack(message, metadata, destination);
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
}

const processRouterDest = async inputs => {
  return simpleProcessRouterDest(
      inputs,
      "CAMPAIGN_MANAGER",
      process
  );
}

module.exports = { process, processRouterDest };
