/* eslint-disable no-plusplus */
const FormData = require('form-data');
const fs = require('fs');
const {
  getAccessToken,
  getMarketoFilePath,
  handleFileUploadResponse,
  getFieldSchemaMap,
} = require('./util');
const { isHttpStatusSuccess, hydrateStatusForServer } = require('../../util');
const { MARKETO_FILE_SIZE, UPLOAD_FILE } = require('./config');
const {
  getHashFromArray,
  removeUndefinedAndNullValues,
  isDefinedAndNotNullAndNotEmpty,
} = require('../../util');
const { handleHttpRequest } = require('../../../adapters/network');
const {
  NetworkError,
  ConfigurationError,
  RetryableError,
  TransformationError,
} = require('../../util/errorTypes');
const { client } = require('../../../util/errorNotifier');
const stats = require('../../../util/stats');

const fetchFieldSchemaNames = async (config, accessToken) => {
  const fieldSchemaMapping = await getFieldSchemaMap(accessToken, config.munchkinId);
  if (Object.keys(fieldSchemaMapping).length > 0) {
    const fieldSchemaNames = Object.keys(fieldSchemaMapping);
    return { fieldSchemaNames };
  }
  throw new RetryableError('Failed to fetch Marketo Field Schema', 500, fieldSchemaMapping);
};

const getHeaderFields = (config, fieldSchemaNames) => {
  const { columnFieldsMapping } = config;

  columnFieldsMapping.forEach((colField) => {
    if (!fieldSchemaNames.includes(colField.to)) {
      throw new ConfigurationError(
        `The field ${colField.to} is not present in Marketo Field Schema. Aborting`,
      );
    }
  });
  const columnField = getHashFromArray(columnFieldsMapping, 'to', 'from', false);
  return Object.keys(columnField);
};
/**
 * Processes input data to create a CSV file and returns the file data along with successful and unsuccessful job IDs.
 * The file name is made unique with combination of UUID and current timestamp to avoid any overrides. It also has a
 * maximum size limit of 10MB . The events that could be accomodated inside the file is marked as successful and the
 * rest are marked as unsuccessful. Also the file is deleted when reading is complete.
 * @param {Array} inputEvents - An array of input events.
 * @param {Object} config - destination config
 * @param {Array} headerArr - An array of header fields.
 * @returns {Object} - An object containing the file stream, successful job IDs, and unsuccessful job IDs.
 */
const getFileData = async (inputEvents, config, headerArr) => {
  const input = inputEvents;
  const messageArr = [];
  let startTime;
  let endTime;
  let requestTime;
  startTime = Date.now();

  input.forEach((i) => {
    const inputData = i;
    const jobId = inputData.metadata.job_id;
    const data = {};
    data[jobId] = inputData.message;
    messageArr.push(data);
  });

  if (isDefinedAndNotNullAndNotEmpty(config.deDuplicationField)) {
    // dedup starts
    // Time Complexity = O(n2)
    const dedupMap = new Map();
    // iterating input and storing the occurences of messages
    // with same dedup property received from config
    // Example: dedup-property = email
    // k (key)            v (index of occurence in input)
    // user@email         [4,7,9]
    // user2@email        [2,3]
    // user3@email        [1]
    input.forEach((element, index) => {
      const indexAr = dedupMap.get(element.message[config.deDuplicationField]) || [];
      indexAr.push(index);
      dedupMap.set(element.message[config.deDuplicationField], indexAr);
      return dedupMap;
    });
    // 1. iterating dedupMap
    // 2. storing the duplicate occurences in dupValues arr
    // 3. iterating dupValues arr, and mapping each property on firstBorn
    // 4. as dupValues arr is sorted hence the firstBorn will inherit properties of last occurence (most updated one)
    // 5. store firstBorn to first occurence in input as it should get the highest priority
    dedupMap.forEach((indexes) => {
      let firstBorn = {};
      indexes.forEach((idx) => {
        headerArr.forEach((headerStr) => {
          // if duplicate item has defined property to offer we take it else old one remains
          firstBorn[headerStr] = input[idx].message[headerStr] || firstBorn[headerStr];
        });
      });
      firstBorn = removeUndefinedAndNullValues(firstBorn);
      input[indexes[0]].message = firstBorn;
    });
    // dedup ends
  }

  const csv = [];
  csv.push(headerArr.toString());
  endTime = Date.now();
  requestTime = endTime - startTime;
  stats.histogram('marketo_bulk_upload_create_header_time', requestTime);
  const unsuccessfulJobs = [];
  const successfulJobs = [];
  const MARKETO_FILE_PATH = getMarketoFilePath();
  startTime = Date.now();
  messageArr.forEach((row) => {
    const csvSize = JSON.stringify(csv); // stringify and remove all "stringification" extra data
    const response = headerArr
      .map((fieldName) => JSON.stringify(Object.values(row)[0][fieldName], ''))
      .join(',');
    if (csvSize.length <= MARKETO_FILE_SIZE) {
      csv.push(response);
      successfulJobs.push(Object.keys(row)[0]);
    } else {
      unsuccessfulJobs.push(Object.keys(row)[0]);
    }
  });
  endTime = Date.now();
  requestTime = endTime - startTime;
  stats.histogram('marketo_bulk_upload_create_csvloop_time', requestTime);
  const fileSize = Buffer.from(csv.join('\n')).length;
  if (csv.length > 1) {
    startTime = Date.now();
    fs.writeFileSync(MARKETO_FILE_PATH, csv.join('\n'));
    const readStream = fs.readFileSync(MARKETO_FILE_PATH);
    fs.unlinkSync(MARKETO_FILE_PATH);
    endTime = Date.now();
    requestTime = endTime - startTime;
    stats.histogram('marketo_bulk_upload_create_file_time', requestTime);
    stats.histogram('marketo_bulk_upload_upload_file_size', fileSize);

    return { readStream, successfulJobs, unsuccessfulJobs };
  }
  return { successfulJobs, unsuccessfulJobs };
};

const getImportID = async (input, config, accessToken, csvHeader) => {
  let readStream;
  let successfulJobs;
  let unsuccessfulJobs;
  try {
    ({ readStream, successfulJobs, unsuccessfulJobs } = await getFileData(
      input,
      config,
      csvHeader,
    ));
  } catch (err) {
    client.notify(err, `Marketo File Upload: Error while creating file: ${err.message}`, {
      config,
      csvHeader,
    });
    throw new TransformationError(
      `Marketo File Upload: Error while creating file: ${err.message}`,
      500,
    );
  }

  const formReq = new FormData();
  const { munchkinId, deDuplicationField } = config;
  // create file for multipart form
  if (readStream) {
    formReq.append('format', 'csv');
    formReq.append('file', readStream, 'marketo_bulk_upload.csv');
    formReq.append('access_token', accessToken);
    // Upload data received from server as files to marketo
    // DOC: https://developers.marketo.com/rest-api/bulk-import/bulk-lead-import/#import_file
    const requestOptions = {
      headers: {
        ...formReq.getHeaders(),
      },
    };
    if (isDefinedAndNotNullAndNotEmpty(deDuplicationField)) {
      requestOptions.params = {
        lookupField: deDuplicationField,
      };
    }
    const startTime = Date.now();
    const { processedResponse: resp } = await handleHttpRequest(
      'post',
      `https://${munchkinId}.mktorest.com/bulk/v1/leads.json`,
      formReq,
      requestOptions,
      {
        destType: 'marketo_bulk_upload',
        feature: 'transformation',
      },
    );
    const endTime = Date.now();
    const requestTime = endTime - startTime;
    stats.counter('marketo_bulk_upload_upload_file_succJobs', successfulJobs.length);
    stats.counter('marketo_bulk_upload_upload_file_unsuccJobs', unsuccessfulJobs.length);
    if (!isHttpStatusSuccess(resp.status)) {
      throw new NetworkError(
        'Unable to upload file',
        hydrateStatusForServer(resp.status, 'During fetching poll status'),
      );
    }
    return handleFileUploadResponse(resp, successfulJobs, unsuccessfulJobs, requestTime, config);
  }
  return { importId: null, successfulJobs, unsuccessfulJobs };
};

/**
 *
 * @param {*} input
 * @param {*} config
 * @returns returns the final response of fileUpload.js
 */
const responseHandler = async (input, config) => {
  const accessToken = await getAccessToken(config);
  /**
  {
    "importId" : <some-id>,
    "pollURL" : <some-url-to-poll-status>,
  }
  */
  const { fieldSchemaNames } = await fetchFieldSchemaNames(config, accessToken);
  const headerForCsv = getHeaderFields(config, fieldSchemaNames);
  if (Object.keys(headerForCsv).length === 0) {
    throw new ConfigurationError(
      'Faulty configuration. Please map your traits to Marketo column fields',
    );
  }
  const { importId, successfulJobs, unsuccessfulJobs } = await getImportID(
    input,
    config,
    accessToken,
    headerForCsv,
  );

  // if upload is successful
  if (importId) {
    const csvHeader = headerForCsv.toString();
    const metadata = { successfulJobs, unsuccessfulJobs, csvHeader };
    const response = {
      statusCode: 200,
      importId,
      metadata
    };
    return response;
  }
  // if importId is returned null
  stats.increment(UPLOAD_FILE, {
    status: 500,
    state: 'Retryable',
  });
  return {
    statusCode: 500,
    FailedReason: '[Marketo File upload]: No import id received',
  };
};
const processFileData = async (event) => {
  const { input, config } = event;
  const resp = await responseHandler(input, config);
  return resp;
};

module.exports = { processFileData };
