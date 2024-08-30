/* eslint-disable @typescript-eslint/naming-convention */
const lodash = require('lodash');
const jsonSize = require('json-size');
const { InstrumentationError, OAuthSecretError } = require('@rudderstack/integrations-lib');
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  getSuccessRespEvents,
} = require('../../util');
const { BASE_URL, MAX_PAYLOAD_SIZE_IN_BYTES, MAX_OPERATIONS } = require('./config');
const { getAuthHeaderForRequest } = require('../twitter_ads/util');
const { JSON_MIME_TYPE } = require('../../util/constant');

const validateRequest = (message) => {
  if (message.type !== 'record') {
    throw new InstrumentationError(`[X AUDIENCE]: ${message.type} is not supported`);
  }
};
const getOAuthFields = ({ secret }) => {
  if (!secret) {
    throw new OAuthSecretError('[TWITTER ADS]:: OAuth - access keys not found');
  }
  const oAuthObject = {
    consumerKey: secret.consumerKey,
    consumerSecret: secret.consumerSecret,
    accessToken: secret.accessToken,
    accessTokenSecret: secret.accessTokenSecret,
  };
  return oAuthObject;
};

const buildResponseWithJSON = (JSON, config, metadata) => {
  const response = defaultRequestConfig();
  response.endpoint = BASE_URL.replace(':account_id', config.accountId).replace(
    ':custom_audience_id',
    config.customAudienceId,
  );
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = JSON;
  // required to be in accordance with oauth package
  const request = {
    url: response.endpoint,
    method: response.method,
    body: response.body.JSON,
  };

  const oAuthObject = getOAuthFields(metadata);
  const authHeader = getAuthHeaderForRequest(request, oAuthObject).Authorization;
  response.headers = {
    Authorization: authHeader,
    'Content-Type': JSON_MIME_TYPE,
  };
  return response;
};

/**
 * This fucntion groups the response list based upoin 3 fields that are
 * 1. operation_type
 * 2. effective_at
 * 3. expires_at
 * @param {*} respList
 * @returns object
 */
const groupResponsesUsingOperationAndTime = (respList) => {
  const eventGroups = lodash.groupBy(respList, (item) => [
    item.message.operation_type,
    item.message.params.effective_at,
    item.message.params.expires_at,
  ]);
  return eventGroups;
};
/**
 * This function groups the operation object list based upon max sized or batch size allowed
 * and returns the final batched request
 * @param {*} operationObjectList
 */
const getFinalResponseList = (operationObjectList, destination) => {
  const respList = [];
  let currentMetadataList = [];
  let currentBatchedRequest = [];
  let metadataWithSecret; // used for authentication purposes
  operationObjectList.forEach((operationObject) => {
    const { payload, metadataList } = operationObject;
    metadataWithSecret = { secret: metadataList[0].secret };
    if (
      currentBatchedRequest.length > MAX_OPERATIONS ||
      jsonSize([...currentBatchedRequest, payload]) > MAX_PAYLOAD_SIZE_IN_BYTES
    ) {
      respList.push(
        getSuccessRespEvents(
          buildResponseWithJSON(currentBatchedRequest, destination.config, metadataWithSecret),
          currentMetadataList,
          destination,
          true,
        ),
      );
      currentBatchedRequest = [operationObject];
      currentMetadataList = metadataList;
    } else {
      currentBatchedRequest.push(payload);
      currentMetadataList.push(...metadataList);
    }
  });
  // pushing the remainder operation payloads as well
  respList.push(
    getSuccessRespEvents(
      buildResponseWithJSON(currentBatchedRequest, destination.config, metadataWithSecret),
      currentMetadataList,
      destination,
      true,
    ),
  );
  return respList;
};

/**
 * This function takes in object containing key as the grouped parameter
 * and values as list of all concerned payloads ( having the same key ).
 * Then it makes the list of operationObject based upon
 * operation and effective and expires time and json size of payload of one object
 * @param {*} eventGroups
 * @returns
 */
const getOperationObjectList = (eventGroups) => {
  const operationList = [];
  Object.keys(eventGroups).forEach((group) => {
    const { operation, params } = group[0].message;
    const { effective_at, expires_at } = params;
    let currentUserList = [];
    let currentMetadata = [];
    group.forEach((event) => {
      const newUsers = event.message.params.users;
      // calculating size before appending the user and metadata list
      if (jsonSize([...currentUserList, ...newUsers]).length > MAX_PAYLOAD_SIZE_IN_BYTES) {
        currentUserList.push(...event.message.params.users);
        currentMetadata.push(event.metadata);
      } else {
        operationList.push({
          payload: {
            operation_type: operation,
            params: {
              effective_at,
              expires_at,
              users: currentUserList,
            },
          },
          metadataList: currentMetadata,
        });
      }
      currentUserList = event.message.params.users;
      currentMetadata = event.metadata;
    });
    // all the remaining user and metadata list used in one list
    operationList.push({
      payload: {
        operation_type: operation,
        params: {
          effective_at,
          expires_at,
          users: currentUserList,
        },
      },
      metadataList: currentMetadata,
    });
  });
  return operationList;
};

/**
 * Input: [{
    message: {
      operation_type: 'Delete',
      params: {
        effective_at,
        expires_at,
        users,
    },
  },
  metadata,
  destination,
        }]
 * @param {*} responseList 
 */
const batchEvents = (responseList) => {
  const eventGroups = groupResponsesUsingOperationAndTime(responseList);
  const operationObjectList = getOperationObjectList(eventGroups);
  /* at this point we will a list of json payloads in the following format 
      operationObjectList = [
        {
          payload:{
            operation_type: 'Delete',
            params: {
              effective_at,
              expires_at,
              users,
          }, 
          metadata:
          [
            {jobId:1}, {jobId:2}
          ]
        }
      ]
  */
  return getFinalResponseList(operationObjectList);
};
module.exports = { validateRequest, buildResponseWithJSON, batchEvents };
