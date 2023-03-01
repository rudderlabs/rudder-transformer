/* eslint-disable no-await-in-loop */
const sha256 = require('sha256');
const logger = require('../../../logger');
const {
  isDefinedAndNotNullAndNotEmpty,
  returnArrayOfSubarrays,
  constructPayload,
  defaultRequestConfig,
  getValueFromMessage,
  removeUndefinedAndNullValues,
  removeHyphens,
  simpleProcessRouterDest,
} = require('../../util');

const { createJob, addUserToJob, getAuthErrCategory } = require('./util');

const { isHttpStatusSuccess } = require('../../util/index');
const {
  InstrumentationError,
  ConfigurationError,
  OAuthSecretError,
  InvalidAuthTokenError,
} = require('../../util/errorTypes');
const {
  offlineDataJobsMapping,
  addressInfoMapping,
  BASE_ENDPOINT,
  attributeMapping,
  hashAttributes,
  TYPEOFLIST,
} = require('./config');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');

const hashEncrypt = (object) => {
  Object.keys(object).forEach((key) => {
    if (hashAttributes.includes(key) && object[key]) {
      // eslint-disable-next-line no-param-reassign
      object[key] = sha256(object[key]);
    }
  });
};

/**
 * Get access token to be bound to the event req headers
 *
 * Note:
 * This method needs to be implemented particular to the destination
 * As the schema that we'd get in `metadata.secret` can be different
 * for different destinations
 *
 * @param {Object} metadata
 * @returns
 */
const getAccessToken = (metadata) => {
  // OAuth for this destination
  const { secret } = metadata;
  // we would need to verify if secret is present and also if the access token field is present in secret
  if (!secret || !secret.access_token) {
    throw new OAuthSecretError('Empty/Invalid access token');
  }
  return secret.access_token;
};

/**
 * This function is used for building the response. It create a default rudder response
 * and populate headers, params and body.JSON
 * @param {*} metadata
 * @param {*} body
 * @param {*} param2
 * @returns
 */
const responseBuilder = (metadata, body, { Config }) => {
  const payload = body;
  const response = defaultRequestConfig();
  const filteredCustomerId = removeHyphens(Config.customerId);
  response.endpoint = `${BASE_ENDPOINT}/${filteredCustomerId}/offlineUserDataJobs`;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  const accessToken = getAccessToken(metadata);
  response.headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'developer-token': getValueFromMessage(metadata, 'secret.developer_token'),
  };
  if (Config.subAccount)
    if (Config.loginCustomerId) {
      const filteredLoginCustomerId = removeHyphens(Config.loginCustomerId);
      response.headers['login-customer-id'] = filteredLoginCustomerId;
    } else throw new ConfigurationError(`loginCustomerId is required as subAccount is true.`);
  return response;
};
/**
 * This function helps creates an array with proper mapping for userIdentiFier.
 * Logics: Here we are creating an array with all the attributes provided in the add/remove array
 * inside listData.
 * @param {rudder event message properties listData add} attributeArray
 * @param {rudder event destination} Config
 * @returns
 */

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

    const responses = Object.values(createdPayload).map((data) =>
      responseBuilder(metadata, data, destination),
    );

    await Promise.all(
      responses.map(async (response) => {
        const { body, method, endpoint, headers } = response;

        // step1: offlineUserDataJobs creation

        const firstResponse = await createJob(
          endpoint,
          removeHyphens(destination.Config.customerId),
          destination.Config.listId,
          headers,
          method,
        );
        if (
          !firstResponse.success &&
          !isHttpStatusSuccess(firstResponse?.response?.response?.status)
        ) {
          const processedResponse = processAxiosResponse(firstResponse);
          const authErrorCategory = getAuthErrCategory(
            processedResponse.status,
            processedResponse.response,
          );
          throw new InvalidAuthTokenError(
            `${processedResponse?.response?.error?.message} during offlineUserDataJobs creation`,
            firstResponse?.response?.response?.status,
            firstResponse,
            authErrorCategory,
          );
        }

        // step2: putting users into the job
        let jobId;
        if (firstResponse?.response?.data?.resourceName) {
          // eslint-disable-next-line prefer-destructuring
          jobId = firstResponse.response.data.resourceName.split('/')[3];
        }
        const secondResponse = await addUserToJob(endpoint, headers, method, jobId, body);
        if (
          !secondResponse.success &&
          !isHttpStatusSuccess(secondResponse?.response?.response?.status)
        ) {
          const processedResponse = processAxiosResponse(secondResponse);
          const authErrorCategory = getAuthErrCategory(
            processedResponse.status,
            processedResponse.response,
          );
          throw new InvalidAuthTokenError(
            `${processedResponse?.response?.error?.message} during adding or removing users to offlineUserDataJobs creation`,
            secondResponse?.response?.response?.status,
            secondResponse,
            authErrorCategory,
          );
        }
        response.endpoint = `${endpoint}/${jobId}:run`;
      }),
    );
    return responses;
  }

  throw new InstrumentationError(`Message Type ${message.type} not supported.`);
};

const process = async (event) => {
  const response = await processEvent(event.metadata, event.message, event.destination);
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
