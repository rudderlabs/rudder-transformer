const { EventType } = require('../../../constants');

const {
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  isDefinedAndNotNull,
  simpleProcessRouterDest,
  getAccessToken,
} = require('../../util');

const {
  ConfigCategories,
  mappingConfig,
  BASE_URL,
  EncryptionEntityType,
  EncryptionSource,
} = require('./config');

const { InstrumentationError } = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

// build final response
function buildResponse(requestJson, metadata, endpointUrl, requestType, encryptionInfo) {
  const response = defaultRequestConfig();
  response.endpoint = endpointUrl;
  response.headers = {
    Authorization: `Bearer ${getAccessToken(metadata, 'access_token')}`,
    'Content-Type': JSON_MIME_TYPE,
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
  const { properties } = message;
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
  if (properties.requestType === 'batchupdate') {
    delete requestJson.childDirectedTreatment;
    delete requestJson.limitAdTracking;
  }
  requestJson.timestampMicros = requestJson.timestampMicros.toString();
  const encryptionInfo = {};
  // prepare encrptionInfo if encryptedUserId or encryptedUserIdCandidates is given
  if (properties.encryptedUserId || properties.encryptedUserIdCandidates) {
    if (EncryptionEntityType.includes(properties.encryptionEntityType)) {
      encryptionInfo.encryptionEntityType = properties.encryptionEntityType;
    }
    if (EncryptionSource.includes(properties.encryptionSource)) {
      encryptionInfo.encryptionSource = properties.encryptionSource;
    }

    encryptionInfo.encryptionEntityId = properties.encryptionEntityId;

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

  // const customFloodlightVariable = {};

  // if (properties.customVariableType && properties.customVariableValue) {
  //   customFloodlightVariable.type = properties.customVariableType;
  //   customFloodlightVariable.value = properties.customVariableValue;
  //   customFloodlightVariable.kind = "dfareporting#customFloodlightVariable";
  //   requestJson.customVariables = [customFloodlightVariable];
  // }

  const endpointUrl = prepareUrl(message, destination);
  return buildResponse(requestJson, metadata, endpointUrl, properties.requestType, encryptionInfo);
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

  if (
    !response.body.JSON.conversions[0].gclid &&
    !response.body.JSON.conversions[0].matchId &&
    !response.body.JSON.conversions[0].dclid &&
    !response.body.JSON.conversions[0].encryptedUserId &&
    !response.body.JSON.conversions[0].encryptedUserIdCandidates &&
    !response.body.JSON.conversions[0].mobileDeviceId &&
    !response.body.JSON.conversions[0].impressionId
  ) {
    throw new InstrumentationError(
      '[CAMPAIGN MANAGER (DCM)]: Atleast one of encryptedUserId,encryptedUserIdCandidates, matchId, mobileDeviceId, gclid, dclid, impressionId.',
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

  if (messageType === EventType.TRACK) {
    response = processTrack(message, metadata, destination);
  } else {
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
