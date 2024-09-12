/* eslint-disable @typescript-eslint/naming-convention */
const sha256 = require('sha256');
const lodash = require('lodash');
const jsonSize = require('json-size');
const { OAuthSecretError } = require('@rudderstack/integrations-lib');
const {
  defaultRequestConfig,
  getSuccessRespEvents,
  removeUndefinedAndNullAndEmptyValues,
} = require('../../util');
const { MAX_PAYLOAD_SIZE_IN_BYTES, BASE_URL, MAX_OPERATIONS } = require('./config');
const { getAuthHeaderForRequest } = require('../twitter_ads/util');
const { JSON_MIME_TYPE } = require('../../util/constant');

const getOAuthFields = ({ secret }) => {
  if (!secret) {
    throw new OAuthSecretError('[X Audience]:: OAuth - access keys not found');
  }
  const oAuthObject = {
    consumerKey: secret.consumerKey,
    consumerSecret: secret.consumerSecret,
    accessToken: secret.accessToken,
    accessTokenSecret: secret.accessTokenSecret,
  };
  return oAuthObject;
};

// Docs: https://developer.x.com/en/docs/x-ads-api/audiences/api-reference/custom-audience-user
const buildResponseWithJSON = (payload, config, metadata) => {
  const response = defaultRequestConfig();
  const accountId = Object.values(JSON.parse(config.accountId))[0];
  response.endpoint = BASE_URL.replace(':account_id', accountId).replace(
    ':audience_id',
    config.audienceId,
  );
  response.body.JSON_ARRAY = { batch: JSON.stringify(payload) };
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
      currentBatchedRequest.length >= MAX_OPERATIONS ||
      jsonSize([...currentBatchedRequest, payload]) > MAX_PAYLOAD_SIZE_IN_BYTES
    ) {
      respList.push(
        getSuccessRespEvents(
          buildResponseWithJSON(
            currentBatchedRequest,
            destination.Config || destination.config,
            metadataWithSecret,
          ),
          currentMetadataList,
          destination,
          true,
        ),
      );
      currentBatchedRequest = [payload];
      currentMetadataList = metadataList;
    } else {
      currentBatchedRequest.push(payload);
      currentMetadataList.push(...metadataList);
    }
  });
  // pushing the remainder operation payloads as well
  respList.push(
    getSuccessRespEvents(
      buildResponseWithJSON(
        currentBatchedRequest,
        destination.Config || destination.config,
        metadataWithSecret,
      ),
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
    const { operation_type, params } = eventGroups[group][0].message;
    const { effective_at, expires_at } = params;
    let currentUserList = [];
    let currentMetadata = [];
    eventGroups[group].forEach((event) => {
      const newUsers = event.message.params.users;
      // calculating size before appending the user and metadata list
      if (jsonSize([...currentUserList, ...newUsers]) < MAX_PAYLOAD_SIZE_IN_BYTES) {
        currentUserList.push(...event.message.params.users);
        currentMetadata.push(event.metadata);
      } else {
        operationList.push({
          payload: {
            operation_type,
            params: removeUndefinedAndNullAndEmptyValues({
              effective_at,
              expires_at,
              users: currentUserList,
            }),
          },
          metadataList: currentMetadata,
        });
        currentUserList = event.message.params.users;
        currentMetadata = event.metadata;
      }
    });
    // all the remaining user and metadata list used in one list
    operationList.push({
      payload: {
        operation_type,
        params: removeUndefinedAndNullAndEmptyValues({
          effective_at,
          expires_at,
          users: currentUserList,
        }),
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
const batchEvents = (responseList, destination) => {
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
  return getFinalResponseList(operationObjectList, destination);
};

const getUserDetails = (fields, config) => {
  const { enableHash } = config;
  const { email, phone_number, handle, device_id, twitter_id, partner_user_id } = fields;
  const user = {};
  if (email) {
    const emailList = email.split(',');
    user.email = enableHash ? emailList.map(sha256) : emailList;
  }
  if (phone_number) {
    const phone_numberList = phone_number.split(',');
    user.phone_number = enableHash ? phone_numberList.map(sha256) : phone_numberList;
  }
  if (handle) {
    const handleList = handle.split(',');
    user.handle = enableHash ? handleList.map(sha256) : handleList;
  }
  if (device_id) {
    const device_idList = device_id.split(',');
    user.device_id = enableHash ? device_idList.map(sha256) : device_idList;
  }
  if (twitter_id) {
    const twitter_idList = twitter_id.split(',');
    user.twitter_id = enableHash ? twitter_idList.map(sha256) : twitter_idList;
  }
  if (partner_user_id) {
    user.partner_user_id = partner_user_id.split(',');
  }
  return removeUndefinedAndNullAndEmptyValues(user);
};
module.exports = { getOAuthFields, batchEvents, getUserDetails, buildResponseWithJSON };
