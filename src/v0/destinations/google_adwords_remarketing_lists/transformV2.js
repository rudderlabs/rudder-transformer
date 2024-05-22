/* eslint-disable no-const-assign */
const lodash = require('lodash');
const sha256 = require('sha256');
const get = require('get-value');
const {
  ConfigurationError,
  InstrumentationError,
  getErrorRespEvents,
} = require('@rudderstack/integrations-lib');
const {
  getValueFromMessage,
  getAccessToken,
  isDefinedAndNotNullAndNotEmpty,
  constructPayload,
  returnArrayOfSubarrays,
  defaultRequestConfig,
  removeHyphens,
  removeUndefinedAndNullValues,
  getDestinationExternalIDInfoForRetl,
  getSuccessRespEvents,
  generateErrorObject,
} = require('../../util');
const logger = require('../../../logger');
const { populateConsentFromConfig } = require('../../util/googleUtils');
const { MappedToDestinationKey } = require('../../../constants');
const { JSON_MIME_TYPE } = require('../../util/constant');

const {
  offlineDataJobsMapping,
  addressInfoMapping,
  attributeMapping,
  hashAttributes,
  TYPEOFLIST,
  consentConfigMap,
  BASE_ENDPOINT,
} = require('./config');

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

const hashEncrypt = (object) => {
  Object.keys(object).forEach((key) => {
    if (hashAttributes.includes(key) && object[key]) {
      // eslint-disable-next-line no-param-reassign
      object[key] = sha256(object[key]);
    }
  });
};

const responseBuilder = (accessToken, developerToken, body, { Config }, message, consentBlock) => {
  const payload = body;
  const response = defaultRequestConfig();
  const filteredCustomerId = removeHyphens(Config.customerId);
  response.endpoint = `${BASE_ENDPOINT}/${filteredCustomerId}/offlineUserDataJobs`;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  let operationAudienceId = Config.audienceId || Config.listId;
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (!operationAudienceId && mappedToDestination) {
    const { objectType } = getDestinationExternalIDInfoForRetl(
      message,
      'GOOGLE_ADWORDS_REMARKETING_LISTS',
    );
    operationAudienceId = objectType;
  }
  if (!isDefinedAndNotNullAndNotEmpty(operationAudienceId)) {
    throw new ConfigurationError('List ID is a mandatory field');
  }
  response.params = {
    listId: operationAudienceId,
    customerId: filteredCustomerId,
    consent: consentBlock,
  };
  response.headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': JSON_MIME_TYPE,
    'developer-token': developerToken,
  };
  if (Config.subAccount)
    if (Config.loginCustomerId) {
      const filteredLoginCustomerId = removeHyphens(Config.loginCustomerId);
      response.headers['login-customer-id'] = filteredLoginCustomerId;
    } else throw new ConfigurationError(`loginCustomerId is required as subAccount is true.`);
  return response;
};

const populateIdentifiers = (attributeArray, { Config }) => {
  const userIdentifier = [];
  const { typeOfList } = Config;
  const { isHashRequired, userSchema } = Config;
  let attribute;
  if (TYPEOFLIST[typeOfList]) {
    attribute = TYPEOFLIST[typeOfList];
  } else {
    attribute = userSchema;
  }
  if (isDefinedAndNotNullAndNotEmpty(attributeArray)) {
    // traversing through every element in the add array
    attributeArray.forEach((element, index) => {
      if (isHashRequired) {
        hashEncrypt(element);
      }
      // checking if the attribute is an array or not for generic type list
      if (!Array.isArray(attribute)) {
        if (element[attribute]) {
          userIdentifier.push({ [attribute]: element[attribute] });
        } else {
          logger.info(` ${attribute} is not present in index:`, index);
        }
      } else {
        attribute.forEach((attributeElement, index2) => {
          if (attributeElement === 'addressInfo') {
            const addressInfo = constructPayload(element, addressInfoMapping);
            // checking if addressInfo object is empty or not.
            if (isDefinedAndNotNullAndNotEmpty(addressInfo)) userIdentifier.push({ addressInfo });
          } else if (element[`${attributeElement}`]) {
            userIdentifier.push({
              [`${attributeMapping[attributeElement]}`]: element[`${attributeElement}`],
            });
          } else {
            logger.info(` ${attribute[index2]} is not present in index:`, index);
          }
        });
      }
    });
  }
  return userIdentifier;
};

const processRecordEventArray = (
  records,
  message,
  destination,
  accessToken,
  developerToken,
  operationType,
) => {
  let outputPayloads = {};
  // ** only send it if identifier > 0

  const fieldsArray = [];
  const metadata = [];
  records.forEach((record) => {
    fieldsArray.push(record.message.fields);
    metadata.push(record.metadata);
  });

  const userIdentifiersList = populateIdentifiers(fieldsArray, destination);

  const outputPayload = constructPayload(message, offlineDataJobsMapping);
  outputPayload.operations = [];
  // breaking the userIdentiFier array in chunks of 20
  const userIdentifierChunks = returnArrayOfSubarrays(userIdentifiersList, 20);
  // putting each chunk in different create/remove operations
  switch (operationType) {
    case 'add':
      // for add operation
      userIdentifierChunks.forEach((element) => {
        const operations = {
          create: {},
        };
        operations.create.userIdentifiers = element;
        outputPayload.operations.push(operations);
      });
      outputPayloads = { ...outputPayloads, create: outputPayload };
      break;
    case 'remove':
      // for remove operation
      userIdentifierChunks.forEach((element) => {
        const operations = {
          remove: {},
        };
        operations.remove.userIdentifiers = element;
        outputPayload.operations.push(operations);
      });
      outputPayloads = { ...outputPayloads, remove: outputPayload };
      break;
    default:
  }

  const toSendEvents = [];
  Object.values(outputPayloads).forEach((data) => {
    const consentObj = populateConsentFromConfig(destination.Config, consentConfigMap);
    toSendEvents.push(
      responseBuilder(accessToken, developerToken, data, destination, message, consentObj),
    );
  });

  const successResponse = getSuccessRespEvents(toSendEvents, metadata, destination, true);

  return successResponse;
};

async function processRecordInputs(groupedRecordInputs) {
  const { destination } = groupedRecordInputs[0];
  const { message } = groupedRecordInputs[0];

  const { metadata } = groupedRecordInputs[0];
  const accessToken = getAccessToken(metadata, 'access_token');
  const developerToken = getValueFromMessage(metadata, 'secret.developer_token');

  const groupedRecordsByAction = lodash.groupBy(groupedRecordInputs, (record) =>
    record.message.action?.toLowerCase(),
  );

  const finalResponse = [];

  let insertResponse;
  let deleteResponse;
  let updateResponse;

  if (groupedRecordsByAction.delete) {
    deleteResponse = processRecordEventArray(
      groupedRecordsByAction.delete,
      message,
      destination,
      accessToken,
      developerToken,
      'remove',
    );
  }

  if (groupedRecordsByAction.insert) {
    insertResponse = processRecordEventArray(
      groupedRecordsByAction.insert,
      message,
      destination,
      accessToken,
      developerToken,
      'add',
    );
  }

  if (groupedRecordsByAction.update) {
    updateResponse = processRecordEventArray(
      groupedRecordsByAction.update,
      message,
      destination,
      accessToken,
      developerToken,
      'add',
    );
  }

  const eventTypes = ['update', 'insert', 'delete'];
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
  processRecordInputs,
  populateIdentifiers,
  responseBuilder,
};
