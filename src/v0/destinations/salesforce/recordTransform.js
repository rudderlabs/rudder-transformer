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
 * Process record events for VDM v1 flow
 * Uses context.mappedToDestination and destination.Config
 */
async function processVDMV1RecordEvents(groupedRecordInputs) {
  const responses = [];
  const metadata = [];

  await mapInBatches(groupedRecordInputs, async (record) => {
    const { message, destination } = record;

    // For VDM v1, fields are already in the message structure
    // Transform handles field mapping via existing Salesforce logic
    const response = defaultRequestConfig();
    response.body.JSON = message.fields || message.traits || {};
    response.endpoint = '/bulk'; // Placeholder - actual endpoint handled by bulk uploader

    responses.push(response);
    metadata.push(record.metadata);
  });

  return getSuccessRespEvents(responses, metadata, groupedRecordInputs[0].destination, true);
}

/**
 * Process record events for VDM v2 flow
 * Uses connection.config.destination and message.identifiers
 */
async function processVDMV2RecordEvents(groupedRecordInputs) {
  const { connection, message } = groupedRecordInputs[0];
  const destinationConfig = connection?.config?.destination;

  if (!destinationConfig) {
    throw new InstrumentationError('VDM v2: connection.config.destination is required');
  }

  // Derive user schema from identifiers
  const userSchema = message?.identifiers ? Object.keys(message.identifiers) : [];

  // Group records by action (insert, update, delete)
  const groupedByAction = await groupByInBatches(groupedRecordInputs, (record) =>
    record.message.action?.toLowerCase(),
  );

  const responses = [];
  const metadata = [];

  // Process each action type in parallel
  await Promise.all(
    ['insert', 'update', 'delete'].map(async (action) => {
      const actionRecords = groupedByAction[action];
      if (!actionRecords) return;

      await mapInBatches(actionRecords, async (record) => {
        const { message: recordMessage } = record;

        // Build Salesforce payload from fields
        const payload = recordMessage.fields || {};

        // Add identifiers to payload if not already present
        if (recordMessage.identifiers) {
          Object.keys(recordMessage.identifiers).forEach((key) => {
            if (payload[key] === undefined) {
              payload[key] = recordMessage.identifiers[key];
            }
          });
        }

        const response = defaultRequestConfig();
        response.body.JSON = payload;
        response.endpoint = '/bulk'; // Placeholder
        response.method = 'POST';
        response.headers = {
          'Content-Type': JSON_MIME_TYPE,
        };

        responses.push(response);
        metadata.push(record.metadata);
      });
    }),
  );

  return getSuccessRespEvents(responses, metadata, groupedRecordInputs[0].destination, true);
}

/**
 * Main entry point for processing record events
 * Detects VDM v1, VDM v2, or event stream flow
 */
async function processRecordInputs(groupedRecordInputs) {
  if (!groupedRecordInputs || groupedRecordInputs.length === 0) {
    throw new InstrumentationError('No record inputs to process');
  }

  const event = groupedRecordInputs[0];

  // Detect flow type and route accordingly
  if (isEventSentByVDMV1Flow(event)) {
    return processVDMV1RecordEvents(groupedRecordInputs);
  }

  if (isEventSentByVDMV2Flow(event)) {
    return processVDMV2RecordEvents(groupedRecordInputs);
  }

  // Fallback to VDM v1 for event stream record events
  // (Salesforce doesn't have a separate event stream record flow)
  return processVDMV1RecordEvents(groupedRecordInputs);
}

module.exports = {
  processRecordInputs,
};
