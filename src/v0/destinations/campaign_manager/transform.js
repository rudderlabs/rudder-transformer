const { InstrumentationError } = require('@rudderstack/integrations-lib');
const lodash = require('lodash');
const { EventType } = require('../../../constants');
const {
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultBatchRequestConfig,
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  isDefinedAndNotNull,
  checkInvalidRtTfEvents,
  handleRtTfSingleEventError,
  getAccessToken,
} = require('../../util');

const {
  ConfigCategories,
  mappingConfig,
  BASE_URL,
  EncryptionEntityType,
  EncryptionSource,
  MAX_BATCH_CONVERSATIONS_SIZE,
} = require('./config');

const { convertToMicroseconds } = require('./util');
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

  requestJson.timestampMicros = convertToMicroseconds(requestJson.timestampMicros).toString();

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

const generateBatch = (eventKind, events) => {
  const batchRequestObject = defaultBatchRequestConfig();
  const conversions = [];
  let encryptionInfo = {};
  const metadata = [];
  // extracting destination, message from the first event in a batch
  const { destination, message } = events[0];
  // Batch event into dest batch structure
  events.forEach((ev) => {
    conversions.push(...ev.message.body.JSON.conversions);
    metadata.push(ev.metadata);
    if (ev.message.body.JSON.encryptionInfo) {
      encryptionInfo = ev.message.body.JSON.encryptionInfo;
    }
  });

  batchRequestObject.batchedRequest.body.JSON = {
    kind: eventKind,
    conversions,
  };

  if (Object.keys(encryptionInfo).length > 0) {
    batchRequestObject.batchedRequest.body.JSON.encryptionInfo = encryptionInfo;
  }

  batchRequestObject.batchedRequest.endpoint = message.endpoint;

  batchRequestObject.batchedRequest.headers = message.headers;

  return {
    ...batchRequestObject,
    metadata,
    destination,
  };
};

const batchEvents = (eventChunksArray) => {
  const batchedResponseList = [];

  // group batchInsert and batchUpdate payloads
  const groupedEventChunks = lodash.groupBy(
    eventChunksArray,
    (event) => event.message.body.JSON.kind,
  );
  Object.keys(groupedEventChunks).forEach((eventKind) => {
    // eventChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
    const eventChunks = lodash.chunk(groupedEventChunks[eventKind], MAX_BATCH_CONVERSATIONS_SIZE);
    eventChunks.forEach((chunk) => {
      const batchEventResponse = generateBatch(eventKind, chunk);
      batchedResponseList.push(
        getSuccessRespEvents(
          batchEventResponse.batchedRequest,
          batchEventResponse.metadata,
          batchEventResponse.destination,
          true,
        ),
      );
    });
  });
  return batchedResponseList;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const errorRespEvents = checkInvalidRtTfEvents(inputs);
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }

  const batchErrorRespList = [];
  const eventChunksArray = [];
  const { destination } = inputs[0];
  await Promise.all(
    inputs.map(async (event) => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          eventChunksArray.push({
            message: event.message,
            metadata: event.metadata,
            destination,
          });
        } else {
          // if not transformed
          const proccessedRespList = process(event);
          const transformedPayload = {
            message: proccessedRespList,
            metadata: event.metadata,
            destination,
          };
          eventChunksArray.push(transformedPayload);
        }
      } catch (error) {
        const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
        batchErrorRespList.push(errRespEvent);
      }
    }),
  );

  let batchResponseList = [];
  if (eventChunksArray.length > 0) {
    batchResponseList = batchEvents(eventChunksArray);
  }

  return [...batchResponseList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
