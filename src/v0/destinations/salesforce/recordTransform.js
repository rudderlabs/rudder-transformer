const {
  InstrumentationError,
  groupByInBatches,
  mapInBatches,
} = require('@rudderstack/integrations-lib');
const {
  isEventSentByVDMV1Flow,
  isEventSentByVDMV2Flow,
  getSuccessRespEvents,
  defaultRequestConfig,
} = require('../../util');
const { getErrorResponse, createFinalResponse } = require('../../util/recordUtils');
const { JSON_MIME_TYPE } = require('../../util/constant');

/**
 * Process records for a specific action and return response
 * @param {Array} actionRecords - Records for this action
 * @param {Object} destination - Destination config
 * @param {string} operation - Operation type (insert, update, delete)
 * @returns {Object|null} - Response for this action or null if no records
 */
async function processRecordsForAction(actionRecords, destination, operation) {
  if (!actionRecords || actionRecords.length === 0) {
    return null;
  }

  const responses = [];
  const metadata = [];

  await mapInBatches(actionRecords, async (record) => {
    const { message } = record;

    const response = defaultRequestConfig();
    response.body.JSON = message.fields || message.traits || {};
    response.endpoint = '/bulk';
    response.body.JSON.rudderOperation = operation;

    responses.push(response);
    metadata.push(record.metadata);
  });

  return getSuccessRespEvents(responses, metadata, destination, true);
}

/**
 * Process record events for VDM v1 flow
 */
async function processVDMV1RecordEvents(groupedRecordInputs) {
  const { destination } = groupedRecordInputs[0];

  const groupedByAction = await groupByInBatches(groupedRecordInputs, (record) =>
    record.message.action?.toLowerCase(),
  );

  const actions = Object.keys(groupedByAction).filter((key) => key && key !== 'undefined');
  const hasActions = actions.some((action) => action !== 'undefined');

  if (!hasActions) {
    const responses = [];
    const metadata = [];

    await mapInBatches(groupedRecordInputs, async (record) => {
      const { message } = record;

      const response = defaultRequestConfig();
      response.body.JSON = message.fields || message.traits || {};
      response.endpoint = '/bulk';

      responses.push(response);
      metadata.push(record.metadata);
    });

    return getSuccessRespEvents(responses, metadata, destination, true);
  }

  const deleteResponse = await processRecordsForAction(
    groupedByAction.delete,
    destination,
    'delete',
  );
  const insertResponse = await processRecordsForAction(
    groupedByAction.insert,
    destination,
    'insert',
  );
  const updateResponse = await processRecordsForAction(
    groupedByAction.update,
    destination,
    'update',
  );

  const errorResponse = getErrorResponse(groupedByAction);

  const finalResponse = createFinalResponse(
    deleteResponse,
    insertResponse,
    updateResponse,
    errorResponse,
  );

  if (finalResponse.length === 0) {
    throw new InstrumentationError(
      'Missing valid parameters, unable to generate transformed payload',
    );
  }

  return finalResponse;
}

/**
 * Process records for a specific action (VDM v2) and return response
 * @param {Array} actionRecords - Records for this action
 * @param {Object} destination - Destination config
 * @param {string} operation - Operation type (insert, update, delete)
 * @returns {Object|null} - Response for this action or null if no records
 */
async function processRecordsForActionV2(actionRecords, destination, operation) {
  if (!actionRecords || actionRecords.length === 0) {
    return null;
  }

  const responses = [];
  const metadata = [];

  await mapInBatches(actionRecords, async (record) => {
    const { message: recordMessage } = record;

    const payload = recordMessage.fields || {};

    if (recordMessage.identifiers) {
      for (const key of Object.keys(recordMessage.identifiers)) {
        if (payload[key] === undefined) {
          payload[key] = recordMessage.identifiers[key];
        }
      }
    }

    payload.rudderOperation = operation;

    const response = defaultRequestConfig();
    response.body.JSON = payload;
    response.endpoint = '/bulk';
    response.method = 'POST';
    response.headers = {
      'Content-Type': JSON_MIME_TYPE,
    };

    responses.push(response);
    metadata.push(record.metadata);
  });

  return getSuccessRespEvents(responses, metadata, destination, true);
}

/**
 * Process record events for VDM v2 flow
 */
async function processVDMV2RecordEvents(groupedRecordInputs) {
  const { connection, destination } = groupedRecordInputs[0];
  const destinationConfig = connection?.config?.destination;

  if (!destinationConfig) {
    throw new InstrumentationError('VDM v2: connection.config.destination is required');
  }

  const groupedByAction = await groupByInBatches(groupedRecordInputs, (record) =>
    record.message.action?.toLowerCase(),
  );

  const deleteResponse = await processRecordsForActionV2(
    groupedByAction.delete,
    destination,
    'delete',
  );
  const insertResponse = await processRecordsForActionV2(
    groupedByAction.insert,
    destination,
    'insert',
  );
  const updateResponse = await processRecordsForActionV2(
    groupedByAction.update,
    destination,
    'update',
  );

  const errorResponse = getErrorResponse(groupedByAction);

  const finalResponse = createFinalResponse(
    deleteResponse,
    insertResponse,
    updateResponse,
    errorResponse,
  );

  if (finalResponse.length === 0) {
    throw new InstrumentationError(
      'Missing valid parameters, unable to generate transformed payload',
    );
  }

  return finalResponse;
}

async function processRecordInputs(groupedRecordInputs) {
  if (!groupedRecordInputs || groupedRecordInputs.length === 0) {
    throw new InstrumentationError('No record inputs to process');
  }

  const event = groupedRecordInputs[0];

  if (isEventSentByVDMV1Flow(event)) {
    return processVDMV1RecordEvents(groupedRecordInputs);
  }

  if (isEventSentByVDMV2Flow(event)) {
    return processVDMV2RecordEvents(groupedRecordInputs);
  }

  return processVDMV1RecordEvents(groupedRecordInputs);
}

module.exports = {
  processRecordInputs,
};
