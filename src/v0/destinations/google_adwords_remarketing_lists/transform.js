const sha256 = require('sha256');
const get = require('get-value');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
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
  getDestinationExternalIDInfoForRetl,
  getAccessToken,
} = require('../../util');

const { populateConsentForGoogleDestinations } = require('../../util/googleUtils');

const {
  offlineDataJobsMapping,
  addressInfoMapping,
  BASE_ENDPOINT,
  attributeMapping,
  hashAttributes,
  TYPEOFLIST,
} = require('./config');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { MappedToDestinationKey } = require('../../../constants');

const hashEncrypt = (object) => {
  Object.keys(object).forEach((key) => {
    if (hashAttributes.includes(key) && object[key]) {
      // eslint-disable-next-line no-param-reassign
      object[key] = sha256(object[key]);
    }
  });
};

/**
 * This function is used for building the response. It create a default rudder response
 * and populate headers, params and body.JSON
 * @param {*} metadata
 * @param {*} body
 * @param {*} param2
 * @returns
 */
const responseBuilder = (metadata, body, { Config }, message, consentBlock) => {
  const payload = body;
  const response = defaultRequestConfig();
  const filteredCustomerId = removeHyphens(Config.customerId);
  response.endpoint = `${BASE_ENDPOINT}/${filteredCustomerId}/offlineUserDataJobs`;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  const accessToken = getAccessToken(metadata, 'access_token');
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

    Object.values(createdPayload).forEach((data) => {
      const consentObj = populateConsentForGoogleDestinations(destination.Config);
      response.push(responseBuilder(metadata, data, destination, message, consentObj));
    });
    return response;
  }

  throw new InstrumentationError(`Message Type ${message.type} not supported.`);
};

const process = async (event) => processEvent(event.metadata, event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
