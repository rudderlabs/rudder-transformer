const lodash = require('lodash');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const logger = require('../../../logger');
const {
  returnArrayOfSubarrays,
  constructPayload,
  getValueFromMessage,
  simpleProcessRouterDest,
  getAccessToken,
} = require('../../util');

const { populateConsentFromConfig } = require('../../util/googleUtils');
const { offlineDataJobsMapping, consentConfigMap } = require('./config');
const { processRecordInputs } = require('./recordTransform');
const { populateIdentifiers, responseBuilder } = require('./util');

function extraKeysPresent(dictionary, keyList) {
  // eslint-disable-next-line no-restricted-syntax
  for (const key in dictionary) {
    if (!keyList.includes(key)) {
      return true;
    }
  }
  return false;
}

/**
 * This function helps to create different operations by breaking the
 * userIdentiFier Array in chunks of 20.
 * Logics: Here for add/remove type lists, we are creating create/remove operations by
 * breaking the userIdentiFier array in chunks of 20 and putting them inside one
 * create/remove object each chunk.
 * @param {rudder event message} message
 * @param {rudder event destination} destination
 * @returns
 */
const createPayload = (message, destination) => {
  const { listData } = message.properties;
  const properties = ['add', 'remove'];

  let outputPayloads = {};
  const typeOfOperation = Object.keys(listData);
  typeOfOperation.forEach((key) => {
    if (properties.includes(key)) {
      const userIdentifiersList = populateIdentifiers(listData[key], destination);
      if (userIdentifiersList.length === 0) {
        logger.info(
          `Google_adwords_remarketing_list]:: No attributes are present in the '${key}' property.`,
        );
        return;
      }

      const outputPayload = constructPayload(message, offlineDataJobsMapping);
      outputPayload.operations = [];
      // breaking the userIdentiFier array in chunks of 20
      const userIdentifierChunks = returnArrayOfSubarrays(userIdentifiersList, 20);
      // putting each chunk in different create/remove operations
      switch (key) {
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
    } else {
      logger.info(`listData "${key}" is not valid. Supported types are "add" and "remove"`);
    }
  });

  return outputPayloads;
};

const processEvent = async (metadata, message, destination) => {
  const response = [];
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }
  if (!message.properties) {
    throw new InstrumentationError('Message properties is not present. Aborting message.');
  }
  if (!message.properties.listData) {
    throw new InstrumentationError('listData is not present inside properties. Aborting message.');
  }
  if (message.type.toLowerCase() === 'audiencelist') {
    const createdPayload = createPayload(message, destination);

    if (Object.keys(createdPayload).length === 0) {
      throw new InstrumentationError(
        "Neither 'add' nor 'remove' property is present inside 'listData' or there are no attributes inside 'add' or 'remove' properties matching with the schema fields. Aborting message.",
      );
    }

    const accessToken = getAccessToken(metadata, 'access_token');
    const developerToken = getValueFromMessage(metadata, 'secret.developer_token');

    Object.values(createdPayload).forEach((data) => {
      const consentObj = populateConsentFromConfig(destination.Config, consentConfigMap);
      response.push(
        responseBuilder(accessToken, developerToken, data, destination, message, consentObj),
      );
    });
    return response;
  }

  throw new InstrumentationError(`Message Type ${message.type} not supported.`);
};

const process = async (event) => processEvent(event.metadata, event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = [];
  const groupedInputs = lodash.groupBy(inputs, (input) => input.message.type?.toLowerCase());
  let transformedRecordEvent = [];
  let transformedAudienceEvent = [];

  const eventTypes = ['record', 'audiencelist'];
  if (extraKeysPresent(groupedInputs, eventTypes)) {
    throw new ConfigurationError('unsupported events present in the event');
  }

  if (groupedInputs.record) {
    transformedRecordEvent = await processRecordInputs(groupedInputs.record, reqMetadata);
  }

  if (groupedInputs.audiencelist) {
    transformedAudienceEvent = await simpleProcessRouterDest(
      groupedInputs.audiencelist,
      process,
      reqMetadata,
    );
  }

  respList.push(...transformedRecordEvent, ...transformedAudienceEvent);
  return respList;
};

module.exports = { process, processRouterDest };
