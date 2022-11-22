const { EventType } = require("../../../constants");

const {
  constructPayload,
  defaultRequestConfig,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues
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
  response.body.JSON.encryptionInfo = encryptionInfo || {};
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
  requestJson.limitAdTracking =
    requestJson.limitAdTracking || destination.Config.limitAdTracking;
  requestJson.treatmentForUnderage =
    requestJson.treatmentForUnderage || destination.Config.treatmentForUnderage;
  requestJson.childDirectedTreatment =
    requestJson.childDirectedTreatment ||
    destination.Config.childDirectedTreatment;
  requestJson.nonPersonalizedAd =
    requestJson.nonPersonalizedAd || destination.Config.nonPersonalizedAd;
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
