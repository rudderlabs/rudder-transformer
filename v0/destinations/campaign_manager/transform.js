const { EventType } = require("../../../constants");

const {
  constructPayload,
  defaultRequestConfig,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  defaultPostRequestConfig
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
function buildResponse(requestJson, metadata, endpointUrl) {
  const response = defaultRequestConfig();
  response.endpoint = endpointUrl;
  response.headers = {
    Authorization: `Bearer ${getAccessToken(metadata)}`,
    "Content-Type": "application/json"
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON.kind =
    requestJson.messageType === "batchinsert"
      ? "dfareporting#conversionsBatchInsertRequest"
      : "dfareporting#conversionsBatchInsertRequest";
  response.body.JSON.encryptionInfo = requestJson.encryptionInfo;
  delete requestJson.kind;
  delete requestJson.encryptionInfo;
  response.body.JSON.conversions = [requestJson];
  return response;
}

function prepareUrl(message) {
  return `${BASE_URL}/${message.properties.profileId}/conversions/${message.properties.requestType}`;
}

// process track call
function processTrack(message, metadata, destination) {
  const requestJson = constructPayload(
    message,
    mappingConfig[ConfigCategories.TRACK.name]
  );
  requestJson.limitAdTracking =
    requestJson.limitAdTracking || destination.limitAdTracking;
  requestJson.treatmentForUnderage =
    requestJson.treatmentForUnderage || destination.treatmentForUnderage;
  requestJson.childDirectedTreatment =
    requestJson.childDirectedTreatment || destination.childDirectedTreatment;
  requestJson.nonPersonalizedAd =
    requestJson.nonPersonalizedAd || destination.nonPersonalizedAd;
  const endpointUrl = prepareUrl(message);
  return buildResponse(requestJson, metadata, endpointUrl);
}

function validateRequest(message) {
  if (
    !message.properties.encryptedUserId &&
    !message.properties.dclid &&
    !message.properties.encryptedUserIdCandidates &&
    !message.properties.gclid &&
    !message.properties.matchId &&
    !message.properties.mobileDeviceId
  ) {
    throw new CustomError(
      "[CAMPAIGN MANAGER (DCM)]: One of encryptedUserId, dclid, encryptedUserIdCandidates, gclid" +
        "matchId, mobileDeviceId is mandatory.",
      400
    );
  }

  if (
    message.properties.requestType !== "batchinsert" &&
    message.properties.requestType !== "batchupdate"
  ) {
    throw new CustomError(
      "[CAMPAIGN MANAGER (DCM)]: properties.kind must be one of batchinsert or batchupdate.",
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

  if (!message.properties.profileId) {
    throw new CustomError(
      "[CAMPAIGN MANAGER (DCM)]: properties.profileID is a required field. Aborting Message.",
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
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
