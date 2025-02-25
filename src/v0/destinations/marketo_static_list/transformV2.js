const lodash = require('lodash');
const { InstrumentationError, UnauthorizedError } = require('@rudderstack/integrations-lib');
const {
  defaultPostRequestConfig,
  defaultDeleteRequestConfig,
  defaultRequestConfig,
  getSuccessRespEvents,
  isDefinedAndNotNull,
  generateErrorObject,
  getErrorRespEvents,
} = require('../../util');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { MAX_LEAD_IDS_SIZE } = require('./config');
const { getAuthToken } = require('../marketo/transform');
const { formatConfig } = require('../marketo/config');

/**
 * Generates the final response structure to be sent to the destination
 * @param {*} endPoint
 * @param {*} leadIds
 * @param {*} operation
 * @param {*} token
 * @returns batched response
 */
const responseBuilder = (endPoint, leadIds, operation, token) => {
  let updatedEndpoint = endPoint;
  if (leadIds.length > 0) {
    leadIds.forEach((id) => {
      updatedEndpoint = `${updatedEndpoint}id=${id}&`;
    });
  }
  updatedEndpoint = updatedEndpoint.slice(0, -1);
  const response = defaultRequestConfig();
  response.endpoint = updatedEndpoint;
  if (operation === 'insert') {
    response.method = defaultPostRequestConfig.requestMethod;
  } else {
    response.method = defaultDeleteRequestConfig.requestMethod;
  }
  response.headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  return response;
};

/**
 * The function is responsible for building the batched response for a given set of record inputs.
 * @param {*} groupedRecordInputs
 * @param {*} Config
 * @param {*} token
 * @param {*} leadIds
 * @param {*} operation
 * @returns an array of response objects, where each object represents a batched response for a chunk of lead IDs.
 */
const batchResponseBuilder = (listId, Config, token, leadIds, operation) => {
  const { accountId } = Config;
  const endpoint = `https://${accountId}.mktorest.com/rest/v1/lists/${listId}/leads.json?`;
  const response = [];
  const leadIdsChunks = lodash.chunk(leadIds, MAX_LEAD_IDS_SIZE);
  leadIdsChunks.forEach((ids) => {
    response.push(responseBuilder(endpoint, ids, operation, token));
  });
  return response;
};

/**
 * A function that processes a list of grouped record inputs.
 * It iterates through each input and groups the field IDs based on the action.
 * @param {*} groupedRecordInputs
 * @param {*} destination
 * @param {*} listId
 * @returns An array containing the batched responses for the insert and delete actions along with the metadata.
 */
async function processRecordInputs(groupedRecordInputs, destination, listId) {
  const token = await getAuthToken(formatConfig(destination));
  if (!token) {
    throw new UnauthorizedError('Authorization failed');
  }
  const { Config } = destination;

  // iterate through each input and group field id based on action
  const insertFields = [];
  const deleteFields = [];
  const successMetadataForInsert = [];
  const successMetadataForDelete = [];
  const errorMetadata = [];

  groupedRecordInputs.forEach((input) => {
    const { fields, action } = input.message;
    const fieldId = fields?.id;
    if (action === 'insert' && isDefinedAndNotNull(fieldId)) {
      insertFields.push(fieldId);
      successMetadataForInsert.push(input.metadata);
    } else if (action === 'delete' && isDefinedAndNotNull(fieldId)) {
      deleteFields.push(fieldId);
      successMetadataForDelete.push(input.metadata);
    } else {
      errorMetadata.push(input.metadata);
    }
  });
  const deletePayloads = batchResponseBuilder(listId, Config, token, deleteFields, 'delete');

  const deleteResponse = getSuccessRespEvents(
    deletePayloads,
    successMetadataForDelete,
    destination,
    true,
  );

  const insertPayloads = batchResponseBuilder(listId, Config, token, insertFields, 'insert');

  const insertResponse = getSuccessRespEvents(
    insertPayloads,
    successMetadataForInsert,
    destination,
    true,
  );

  const error = new InstrumentationError(
    'Invalid action type or no leadIds found neither to add nor to remove',
  );
  const errorObj = generateErrorObject(error);
  const errorResponseList = errorMetadata.map((metadata) =>
    getErrorRespEvents(metadata, errorObj.status, errorObj.message, errorObj.statTags),
  );
  const finalResponse = [];
  if (deleteResponse.batchedRequest.length > 0) {
    finalResponse.push(deleteResponse);
  }
  if (insertResponse.batchedRequest.length > 0) {
    finalResponse.push(insertResponse);
  }
  if (errorResponseList.length > 0) {
    finalResponse.push(...errorResponseList);
  }
  return finalResponse;
  // return [deleteResponse, insertResponse, ...errorResponseList];
}

module.exports = {
  processRecordInputs,
};
