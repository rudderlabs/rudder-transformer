const lodash = require('lodash');
const {
  defaultPostRequestConfig,
  defaultDeleteRequestConfig,
  getDestinationExternalID,
  defaultRequestConfig,
  getSuccessRespEvents,
} = require('../../util');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { MAX_LEAD_IDS_SIZE } = require('./config');
const { InstrumentationError } = require('../../util/errorTypes');

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
const batchResponseBuilder = (groupedRecordInputs, Config, token, leadIds, operation) => {
  const { accountId, staticListId } = Config;
  const { message } = groupedRecordInputs[0];
  const listId = getDestinationExternalID(message, 'MARKETO_STATIC_LIST-leadId') || staticListId;
  const endpoint = `https://${accountId}.mktorest.com/rest/v1/lists/${listId}/leads.json?`;
  if (!listId) {
    throw new InstrumentationError('No static listId is provided');
  }
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
 * @returns An array containing the batched responses for the insert and delete actions along with the metadata.
 */
function processRecordInputs(groupedRecordInputs) {
  // iterate through each input and group field id based on action
  const insertFields = [];
  const deleteFields = [];
  const finalMetadata = [];
  const { Config } = groupedRecordInputs[0].destination;
  groupedRecordInputs.forEach((input) => {
    const { fields, action } = input.message;
    const fieldsId = fields.id;
    if (action === 'insert') {
      insertFields.push(fieldsId);
      finalMetadata.push(input.metadata);
    } else if (action === 'delete') {
      deleteFields.push(fieldsId);
      finalMetadata.push(input.metadata);
    }
  });
  const deleteResponse = batchResponseBuilder(
    groupedRecordInputs,
    Config,
    groupedRecordInputs[0].token,
    deleteFields,
    'delete',
  );
  const insertResponse = batchResponseBuilder(
    groupedRecordInputs,
    Config,
    groupedRecordInputs[0].token,
    insertFields,
    'insert',
  );
  const batchedResponse = [...deleteResponse, ...insertResponse];
  return getSuccessRespEvents(batchedResponse, finalMetadata, groupedRecordInputs[0].destination);
}

module.exports = {
  processRecordInputs,
};
