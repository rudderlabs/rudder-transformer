/* eslint-disable no-console */
const lodash = require('lodash');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const {
  defaultBatchRequestConfig,
  getSuccessRespEvents,
  handleRtTfSingleEventError,
  groupEventsByType,
} = require('../../util');
const { MAX_ROWS_PER_REQUEST, DESTINATION } = require('./config');
const { getRearrangedEvents } = require('./util');

const getInsertIdColValue = (properties, insertIdCol) => {
  if (
    insertIdCol &&
    properties[insertIdCol] &&
    (typeof properties[insertIdCol] === 'string' || typeof properties[insertIdCol] === 'number')
  ) {
    return `${properties[insertIdCol]}`;
  }
  return null;
};

const getBQRow = (properties, insertIdColumn) => {
  const row = { json: { ...properties } };
  const insertId = getInsertIdColValue(properties, insertIdColumn);
  if (insertId) {
    row.insertId = insertId;
  }
  return row;
};

const getBQRRowsFromMessage = (message, insertIdColumn) => {
  if (Array.isArray(message.rows) && message.rows.length > 0) {
    return message.rows;
  }

  if (message.properties && typeof message.properties === 'object') {
    return [getBQRow(message.properties, insertIdColumn)];
  }

  throw new InstrumentationError('Invalid payload for the destination');
};

const process = (event) => {
  const { message } = event;
  const { properties, type } = message;
  // EventType validation
  if (type !== EventType.TRACK) {
    throw new InstrumentationError(`Message Type not supported: ${type}`);
  }
  if (!properties || typeof properties !== 'object') {
    throw new InstrumentationError('Invalid payload for the destination');
  }
  const {
    destination: {
      Config: { datasetId, tableId, projectId, insertId: insertIdColumn },
    },
  } = event;

  return {
    datasetId,
    tableId,
    projectId,
    rows: [getBQRow(properties, insertIdColumn)],
  };
};

const batchEachUserSuccessEvents = (eventsChunk) => {
  const batchedResponseList = [];

  // arrayChunks = [[e1,e2, ..batchSize], [e1,e2, ..batchSize], ...]
  const arrayChunks = lodash.chunk(eventsChunk, MAX_ROWS_PER_REQUEST);

  // list of chunks [ [..], [..] ]
  arrayChunks.forEach((chunk) => {
    const batchResponseList = [];
    const metadata = [];

    let batchEventResponse = defaultBatchRequestConfig();
    const { message, destination } = chunk[0];
    // Batch event into dest batch structure
    chunk.forEach((ev) => {
      batchResponseList.push(ev.message.rows[0]);
      metadata.push(ev.metadata[0]);
    });

    batchEventResponse.batchedRequest = {
      datasetId: message.datasetId,
      tableId: message.tableId,
      projectId: message.projectId,
      rows: batchResponseList,
    };

    batchEventResponse = {
      ...batchEventResponse,
      metadata,
      destination,
    };

    batchedResponseList.push(
      getSuccessRespEvents(
        batchEventResponse.batchedRequest,
        batchEventResponse.metadata,
        batchEventResponse.destination,
        true,
      ),
    );
  });

  return batchedResponseList;
};

const processEachTypedEventList = (
  typedEventList,
  eachTypeSuccessEventList,
  eachTypeErrorEventsList,
) => {
  typedEventList.forEach((event) => {
    try {
      if (event.message.statusCode) {
        // already transformed event
        const insertIdColumn = event.destination?.Config?.insertId;
        const rows = getBQRRowsFromMessage(event.message, insertIdColumn);
        rows.forEach((row) => {
          eachTypeSuccessEventList.push({
            ...event,
            message: {
              ...event.message,
              rows: [row],
            },
          });
        });
      } else {
        // if not transformed
        const response = process(event);
        const transformedEvents = Array.isArray(response) ? response : [response];

        transformedEvents.forEach((res) => {
          eachTypeSuccessEventList.push({
            message: res,
            metadata: event.metadata,
            destination: event.destination,
          });
        });
      }
    } catch (error) {
      const eachUserErrorEvent = handleRtTfSingleEventError(event, error, DESTINATION);
      eachTypeErrorEventsList.push(eachUserErrorEvent);
    }
  });
};

const processRouterDest = (inputs) => {
  const finalResp = [];

  const batchedEvents = groupEventsByType(inputs);

  batchedEvents.forEach((typedEventList) => {
    const eachTypeSuccessEventList = []; // list of events that are transformed successfully
    const eachTypeErrorEventsList = []; // list of events that are errored out
    processEachTypedEventList(typedEventList, eachTypeSuccessEventList, eachTypeErrorEventsList);

    const orderedEventsList = getRearrangedEvents(
      eachTypeSuccessEventList,
      eachTypeErrorEventsList,
    );

    orderedEventsList.forEach((eventList) => {
      // no error event list will have more than one items in the list
      if (eventList[0].error) {
        finalResp.push([...eventList]);
      } else {
        // batch the successful events
        const eachTypeBatchedResponse = batchEachUserSuccessEvents(eventList);
        finalResp.push([...eachTypeBatchedResponse]);
      }
    });
  });

  return finalResp.flat();
};

module.exports = { process, processRouterDest };
