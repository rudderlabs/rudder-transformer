/* eslint-disable no-console */
const _ = require("lodash");
const { EventType } = require("../../../constants");
const {
  CustomError,
  getErrorRespEvents,
  defaultBatchRequestConfig,
  getSuccessRespEvents
} = require("../../util");
const { MAX_ROWS_PER_REQUEST } = require("./config");

const getInsertIdColValue = (properties, insertIdCol) => {
  if (
    insertIdCol &&
    properties[insertIdCol] &&
    (typeof properties[insertIdCol] === "string" ||
      typeof properties[insertIdCol] === "number")
  ) {
    return `${properties[insertIdCol]}`;
  }
  return null;
};

const process = async event => {
  const { message } = event;
  const { properties, type } = message;
  // EventType validation
  if (type !== EventType.TRACK) {
    throw new CustomError(`Message Type not supported: ${type}`, 400);
  }
  if (!properties || typeof properties !== "object") {
    throw new CustomError("Invalid payload for the destination", 400);
  }
  const {
    destination: {
      Config: { datasetId, tableId, projectId, insertId: insertIdColumn }
    }
  } = event;
  const propInsertId = getInsertIdColValue(properties, insertIdColumn);
  const props = { ...properties };
  if (propInsertId) {
    props.insertId = propInsertId;
  }

  return {
    datasetId,
    tableId,
    projectId,
    properties: { ...props }
  };
};

const batchEvents = eventsChunk => {
  const batchedResponseList = [];

  // arrayChunks = [[e1,e2, ..batchSize], [e1,e2, ..batchSize], ...]
  const arrayChunks = _.chunk(eventsChunk, MAX_ROWS_PER_REQUEST);

  // list of chunks [ [..], [..] ]
  arrayChunks.forEach(chunk => {
    const batchResponseList = [];
    const metadata = [];

    let batchEventResponse = defaultBatchRequestConfig();
    const { message, destination } = chunk[0];

    // Batch event into dest batch structure
    chunk.forEach(ev => {
      // Pixel code must be added above "batch": [..]
      batchResponseList.push(ev.message.properties);
      metadata.push(ev.metadata);
    });

    batchEventResponse.batchedRequest = {
      datasetId: message.datasetId,
      tableId: message.tableId,
      projectId: message.projectId,
      properties: batchResponseList
    };

    batchEventResponse = {
      ...batchEventResponse,
      metadata,
      destination
    };

    batchedResponseList.push(
      getSuccessRespEvents(
        batchEventResponse.batchedRequest,
        batchEventResponse.metadata,
        batchEventResponse.destination,
        true
      )
    );
  });

  return batchedResponseList;
};

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const eventsChunk = []; // temporary variable to divide payload into chunks
  const errorRespList = [];
  await Promise.all(
    inputs.map(async event => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          eventsChunk.push(event);
        } else {
          // if not transformed
          let response = await process(event);
          response = Array.isArray(response) ? response : [response];
          response.forEach(res => {
            eventsChunk.push({
              message: res,
              metadata: event.metadata,
              destination: event.destination
            });
          });
        }
      } catch (error) {
        errorRespList.push(
          getErrorRespEvents(
            [event.metadata],
            error.response ? error.response.status : 400,
            error.message || "Error occurred while processing payload."
          )
        );
      }
    })
  );

  let batchedResponseList = [];
  if (eventsChunk.length) {
    batchedResponseList = batchEvents(eventsChunk);
  }
  return [...batchedResponseList, ...errorRespList];
};

module.exports = { process, processRouterDest };
