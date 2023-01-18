const { EventType } = require('../../../constants');

const {
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  isDefinedAndNotNull,
  simpleProcessRouterDest,
} = require('../../util');

const {
  ConfigCategories,
  mappingConfig,
  BASE_URL,
  EncryptionEntityType,
  EncryptionSource,
} = require('./config');

const { InstrumentationError, OAuthSecretError } = require('../../util/errorTypes');

const getAccessToken = ({ secret }) => {
  if (!secret) {
    throw new OAuthSecretError('[CAMPAIGN MANAGER (DCM)]:: OAuth - access token not found');
  }
  return secret.access_token;
};

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

// build final response
function buildResponse(requestJson, metadata, endpointUrl, requestType, encryptionInfo) {
  const response = defaultRequestConfig();
  response.endpoint = endpointUrl;
  response.headers = {
    Authorization: `Bearer ${getAccessToken(metadata)}`,
    'Content-Type': 'application/json',
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON.kind =
    requestType === 'batchinsert'
      ? 'dfareporting#conversionsBatchInsertRequest'
      : 'dfareporting#conversionsBatchUpdateRequest';
  if (!isEmptyObject(encryptionInfo)) {
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
  const requestJson = constructPayload(message, mappingConfig[ConfigCategories.TRACK.name]);
  requestJson.nonPersonalizedAd = isDefinedAndNotNull(requestJson.nonPersonalizedAd)
    ? requestJson.nonPersonalizedAd
    : destination.Config.nonPersonalizedAd;
  requestJson.treatmentForUnderage = isDefinedAndNotNull(requestJson.treatmentForUnderage)
    ? requestJson.treatmentForUnderage
    : destination.Config.treatmentForUnderage;
  requestJson.childDirectedTreatment = isDefinedAndNotNull(requestJson.childDirectedTreatment)
    ? requestJson.childDirectedTreatment
    : destination.Config.childDirectedTreatment;
  requestJson.limitAdTracking = isDefinedAndNotNull(requestJson.limitAdTracking)
    ? requestJson.limitAdTracking
    : destination.Config.limitAdTracking;
  // updating these values is not allowed
  if (message.properties.requestType === 'batchupdate') {
    delete requestJson.childDirectedTreatment;
    delete requestJson.limitAdTracking;
  }
  requestJson.timestampMicros = requestJson.timestampMicros.toString();

  const encryptionInfo = {};
  // prepare encrptionInfo if encryptedUserId or encryptedUserIdCandidates is given
  if (message.properties.encryptedUserId || message.properties.encryptedUserIdCandidates) {
    if (EncryptionEntityType.includes(message.properties.encryptionEntityType)) {
      encryptionInfo.encryptionEntityType = message.properties.encryptionEntityType;
    }
    if (EncryptionSource.includes(message.properties.encryptionSource)) {
      encryptionInfo.encryptionSource = message.properties.encryptionSource;
    }

    encryptionInfo.encryptionEntityId = message.properties.encryptionEntityId;

    if (
      isDefinedAndNotNull(encryptionInfo.encryptionSource) &&
      isDefinedAndNotNull(encryptionInfo.encryptionEntityType) &&
      isDefinedAndNotNull(encryptionInfo.encryptionEntityId)
    ) {
      encryptionInfo.kind = 'dfareporting#encryptionInfo';
    } else {
      throw new InstrumentationError(
        '[CAMPAIGN MANAGER (DCM)]: If encryptedUserId or encryptedUserIdCandidates is used, provide proper values for ' +
          'properties.encryptionEntityType , properties.encryptionSource and properties.encryptionEntityId',
      );
    }
  }

  const endpointUrl = prepareUrl(message, destination);
  return buildResponse(
    requestJson,
    metadata,
    endpointUrl,
    message.properties.requestType,
    encryptionInfo,
  );
}

function validateRequest(message) {
  if (!message.properties) {
    throw new InstrumentationError(
      '[CAMPAIGN MANAGER (DCM)]: properties must be present in event. Aborting message',
    );
  }

  if (
    message.properties.requestType !== 'batchinsert' &&
    message.properties.requestType !== 'batchupdate'
  ) {
    throw new InstrumentationError(
      '[CAMPAIGN MANAGER (DCM)]: properties.requestType must be one of batchinsert or batchupdate.',
    );
  }
}

function postValidateRequest(response) {
  if (
    (response.body.JSON.conversions[0].encryptedUserId ||
      response.body.JSON.conversions[0].encryptedUserIdCandidates) &&
    !response.body.JSON.encryptionInfo
  ) {
    throw new InstrumentationError(
      '[CAMPAIGN MANAGER (DCM)]: encryptionInfo is a required field if encryptedUserId or encryptedUserIdCandidates is used.',
    );
  }

  let count = 0;

  if (response.body.JSON.conversions[0].gclid) {
    count += 1;
  }

  if (response.body.JSON.conversions[0].dclid) {
    count += 1;
  }

  if (response.body.JSON.conversions[0].encryptedUserId) {
    count += 1;
  }

  if (response.body.JSON.conversions[0].encryptedUserIdCandidates) {
    count += 1;
  }

  if (response.body.JSON.conversions[0].mobileDeviceId) {
    count += 1;
  }

  if (response.body.JSON.conversions[0].impressionId) {
    count += 1;
  }

  if (count !== 1) {
    throw new InstrumentationError(
      '[CAMPAIGN MANAGER (DCM)]: For CM360 we need one of encryptedUserId,encryptedUserIdCandidates, matchId, mobileDeviceId, gclid, dclid, impressionId.',
    );
  }
}

function process(event) {
  const { message, metadata, destination } = event;

  if (!message.type) {
    throw new InstrumentationError(
      '[CAMPAIGN MANAGER (DCM)]: Message Type missing. Aborting message.',
    );
  }

  validateRequest(message);

  const messageType = message.type.toLowerCase();
  let response = {};

  switch (messageType) {
    case EventType.TRACK:
      response = processTrack(message, metadata, destination);
      break;
    default:
      throw new InstrumentationError(`Message type ${messageType} not supported`);
  }
  postValidateRequest(response);
  return response;
}

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
