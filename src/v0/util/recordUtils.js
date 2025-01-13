const { InstrumentationError, getErrorRespEvents } = require('@rudderstack/integrations-lib');
const { generateErrorObject } = require('./index');

const eventTypes = ['update', 'insert', 'delete'];

function getErrorMetaData(inputs, acceptedOperations) {
  const metadata = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key in inputs) {
    if (!acceptedOperations.includes(key)) {
      inputs[key].forEach((input) => {
        metadata.push(input.metadata);
      });
    }
  }
  return metadata;
}

function getErrorResponse(groupedRecordsByAction) {
  const errorMetaData = [];
  const errorMetaDataObject = getErrorMetaData(groupedRecordsByAction, eventTypes);
  if (errorMetaDataObject.length > 0) {
    errorMetaData.push(errorMetaDataObject);
  }

  const error = new InstrumentationError('Invalid action type in record event');
  const errorObj = generateErrorObject(error);
  const errorResponseList = errorMetaData.map((data) =>
    getErrorRespEvents(data, errorObj.status, errorObj.message, errorObj.statTags),
  );

  return errorResponseList;
}

function createFinalResponse(deleteResponse, insertResponse, updateResponse, errorResponseList) {
  const finalResponse = [];
  if (deleteResponse && deleteResponse.batchedRequest.length > 0) {
    finalResponse.push(deleteResponse);
  }
  if (insertResponse && insertResponse.batchedRequest.length > 0) {
    finalResponse.push(insertResponse);
  }
  if (updateResponse && updateResponse.batchedRequest.length > 0) {
    finalResponse.push(updateResponse);
  }
  if (errorResponseList.length > 0) {
    finalResponse.push(...errorResponseList);
  }
  return finalResponse;
}

module.exports = {
  getErrorResponse,
  createFinalResponse,
};
