/* eslint-disable no-plusplus */
const FormData = require('form-data');
const fs = require('fs');
const {
  getAccessToken,
  ABORTABLE_CODES,
  THROTTLED_CODES,
  MARKETO_FILE_SIZE,
  getMarketoFilePath,
  UPLOAD_FILE,
} = require('./util');
const {
  getHashFromArray,
  removeUndefinedAndNullValues,
  isDefinedAndNotNullAndNotEmpty,
} = require('../../util');
const { httpPOST, httpGET } = require('../../../adapters/network');
const {
  RetryableError,
  AbortedError,
  ThrottledError,
  NetworkError,
  ConfigurationError,
} = require('../../util/errorTypes');
const tags = require('../../util/tags');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const stats = require('../../../util/stats');

const fetchFieldSchema = async (config) => {
  let fieldArr = [];
  const fieldSchemaNames = [];
  const accessToken = await getAccessToken(config);
  const fieldSchemaMapping = await httpGET(
    `https://${config.munchkinId}.mktorest.com/rest/v1/leads/describe2.json`,
    {
      params: {
        access_token: accessToken,
      },
    },
    {
      destType: 'marketo_bulk_upload',
      feature: 'transformation',
    },
  );
  if (
    fieldSchemaMapping &&
    fieldSchemaMapping.success &&
    fieldSchemaMapping.response.data &&
    fieldSchemaMapping.response.data.result.length > 0 &&
    fieldSchemaMapping.response.data.result[0]
  ) {
    fieldArr =
      fieldSchemaMapping.response.data.result &&
      Array.isArray(fieldSchemaMapping.response.data.result)
        ? fieldSchemaMapping.response.data.result[0].fields
        : [];
    fieldArr.forEach((field) => {
      fieldSchemaNames.push(field.name);
    });
  } else if (fieldSchemaMapping.response.error) {
    const status = fieldSchemaMapping?.response?.status || 400;
    throw new NetworkError(
      `${fieldSchemaMapping.response.error}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      fieldSchemaMapping,
    );
  } else {
    throw new AbortedError('Failed to fetch Marketo Field Schema', 400, fieldSchemaMapping);
  }
  return { fieldSchemaNames, accessToken };
};

const getHeaderFields = (config, fieldSchemaNames) => {
  const { columnFieldsMapping } = config;

  columnFieldsMapping.forEach((colField) => {
    if (fieldSchemaNames) {
      if (!fieldSchemaNames.includes(colField.to)) {
        throw new ConfigurationError(
          `The field ${colField.to} is not present in Marketo Field Schema. Aborting`,
        );
      }
    } else {
      throw new ConfigurationError('Marketo Field Schema is Empty. Aborting');
    }
  });
  const columnField = getHashFromArray(columnFieldsMapping, 'to', 'from', false);
  return Object.keys(columnField);
};

const getFileData = async (inputEvents, config, fieldSchemaNames) => {
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

  const headerArr = getHeaderFields(config, fieldSchemaNames);

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
    input.map((element, index) => {
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

  if (Object.keys(headerArr).length === 0) {
    throw new ConfigurationError('Header fields not present');
  }
  const csv = [];
  csv.push(headerArr.toString());
  endTime = Date.now();
  requestTime = endTime - startTime;
  stats.gauge('marketo_bulk_upload_create_header_time', requestTime);
  const unsuccessfulJobs = [];
  const successfulJobs = [];
  const MARKETO_FILE_PATH = getMarketoFilePath();
  startTime = Date.now();
  messageArr.map((row) => {
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
    return response;
  });
  endTime = Date.now();
  requestTime = endTime - startTime;
  stats.gauge('marketo_bulk_upload_create_csvloop_time', requestTime);
  const fileSize = Buffer.from(csv.join('\n')).length;
  if (csv.length > 1) {
    startTime = Date.now();
    fs.writeFileSync(MARKETO_FILE_PATH, csv.join('\n'));
    const readStream = fs.createReadStream(MARKETO_FILE_PATH);
    fs.unlinkSync(MARKETO_FILE_PATH);
    endTime = Date.now();
    requestTime = endTime - startTime;
    stats.gauge('marketo_bulk_upload_create_file_time', requestTime);
    stats.gauge('marketo_bulk_upload_upload_file_size', fileSize);

    return { readStream, successfulJobs, unsuccessfulJobs };
  }
  return { successfulJobs, unsuccessfulJobs };
};

const getImportID = async (input, config, fieldSchemaNames, accessToken) => {
  const { readStream, successfulJobs, unsuccessfulJobs } = await getFileData(
    input,
    config,
    fieldSchemaNames,
  );
  const FILE_UPLOAD_ERR_MSG = 'Could not upload file';
  try {
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
      const resp = await httpPOST(
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
      stats.gauge('marketo_bulk_upload_upload_file_succJobs', successfulJobs.length);
      stats.gauge('marketo_bulk_upload_upload_file_unsuccJobs', unsuccessfulJobs.length);
      if (resp.success) {
        /**
         *
          {
              "requestId": "d01f#15d672f8560",
              "result": [
                  {
                      "batchId": 3404,
                      "importId": "3404",
                      "status": "Queued"
                  }
              ],
              "success": true
          }
        */
        if (
          resp.response &&
          resp.response.data.success &&
          resp.response.data.result.length > 0 &&
          resp.response.data.result[0] &&
          resp.response.data.result[0].importId
        ) {
          const { importId } = await resp.response.data.result[0];
          stats.gauge('marketo_bulk_upload_upload_file_time', requestTime);

          stats.increment(UPLOAD_FILE, {
            status: 200,
            state: 'Success',
          });
          return { importId, successfulJobs, unsuccessfulJobs };
        }
        if (resp.response && resp.response.data) {
          if (
            resp.response.data.errors[0] &&
            resp.response.data.errors[0].message ===
              'There are 10 imports currently being processed. Please try again later'
          ) {
            stats.increment(UPLOAD_FILE, {
              status: 500,
              state: 'Retryable',
            });
            throw new RetryableError(
              resp.response.data.errors[0].message || FILE_UPLOAD_ERR_MSG,
              500,
              { successfulJobs, unsuccessfulJobs },
            );
          }
          if (
            resp.response.data.errors[0] &&
            ((resp.response.data.errors[0].code >= 1000 &&
              resp.response.data.errors[0].code <= 1077) ||
              ABORTABLE_CODES.indexOf(resp.response.data.errors[0].code))
          ) {
            if (resp.response.data.errors[0].message === 'Empty file') {
              stats.increment(UPLOAD_FILE, {
                status: 500,
                state: 'Retryable',
              });
              throw new RetryableError(
                resp.response.data.errors[0].message || FILE_UPLOAD_ERR_MSG,
                500,
                { successfulJobs, unsuccessfulJobs },
              );
            }

            stats.increment(UPLOAD_FILE, {
              status: 400,
              state: 'Abortable',
            });
            throw new AbortedError(
              resp.response.data.errors[0].message || FILE_UPLOAD_ERR_MSG,
              400,
              { successfulJobs, unsuccessfulJobs },
            );
          } else if (THROTTLED_CODES.indexOf(resp.response.data.errors[0].code)) {
            stats.increment(UPLOAD_FILE, {
              status: 500,
              state: 'Retryable',
            });
            throw new ThrottledError(resp.response.response.statusText || FILE_UPLOAD_ERR_MSG, {
              successfulJobs,
              unsuccessfulJobs,
            });
          }
          stats.increment(UPLOAD_FILE, {
            status: 500,
            state: 'Retryable',
          });
          throw new RetryableError(resp.response.response.statusText || FILE_UPLOAD_ERR_MSG, 500, {
            successfulJobs,
            unsuccessfulJobs,
          });
        }
      }
    }
    return { successfulJobs, unsuccessfulJobs };
  } catch (err) {
    // TODO check the tags
    stats.increment(UPLOAD_FILE, {
      status: err.response?.status || 400,
      errorMessage: err.message || FILE_UPLOAD_ERR_MSG,
    });
    const status = err.response?.status || 400;
    throw new NetworkError(
      err.message || FILE_UPLOAD_ERR_MSG,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      { successfulJobs, unsuccessfulJobs },
    );
  }
};

const responseHandler = async (input, config) => {
  /**
  {
    "importId" : <some-id>,
    "pollURL" : <some-url-to-poll-status>,
  }
  */
  const { fieldSchemaNames, accessToken } = await fetchFieldSchema(config);
  const { importId, successfulJobs, unsuccessfulJobs } = await getImportID(
    input,
    config,
    fieldSchemaNames,
    accessToken,
  );
  if (importId) {
    const response = {
      statusCode: 200,
      importId,
      pollURL: '/pollStatus',
    };
    const csvHeader = getHeaderFields(config, fieldSchemaNames).toString();
    response.metadata = { successfulJobs, unsuccessfulJobs, csvHeader };
    return response;
  }

  stats.increment(UPLOAD_FILE, {
    status: 500,
    state: 'Retryable',
  });
  throw new RetryableError('No import id received', 500, {
    successfulJobs,
    unsuccessfulJobs,
  });
};
const processFileData = async (event) => {
  const { input, config } = event;
  const resp = await responseHandler(input, config);
  return resp;
};

module.exports = { processFileData };
