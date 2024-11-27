const get = require('get-value');
const sha256 = require('sha256');
const { ConfigurationError } = require('@rudderstack/integrations-lib');
const {
  isDefinedAndNotNullAndNotEmpty,
  constructPayload,
  defaultRequestConfig,
  removeHyphens,
  removeUndefinedAndNullValues,
  getDestinationExternalIDInfoForRetl,
} = require('../../util');
const logger = require('../../../logger');
const { MappedToDestinationKey } = require('../../../constants');
const { JSON_MIME_TYPE } = require('../../util/constant');
const {
  addressInfoMapping,
  attributeMapping,
  TYPEOFLIST,
  BASE_ENDPOINT,
  hashAttributes,
  ADDRESS_INFO_ATTRIBUTES,
} = require('./config');

const hashEncrypt = (object) => {
  Object.keys(object).forEach((key) => {
    if (hashAttributes.includes(key) && object[key]) {
      // eslint-disable-next-line no-param-reassign
      object[key] = sha256(object[key]);
    }
  });
};

const responseBuilder = (
  accessToken,
  developerToken,
  body,
  { Config },
  audienceId,
  consentBlock,
) => {
  const payload = body;
  const response = defaultRequestConfig();
  const filteredCustomerId = removeHyphens(Config.customerId);
  response.endpoint = `${BASE_ENDPOINT}/${filteredCustomerId}/offlineUserDataJobs`;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  if (!isDefinedAndNotNullAndNotEmpty(audienceId)) {
    throw new ConfigurationError('List ID is a mandatory field');
  }
  response.params = {
    listId: audienceId,
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

/**
 * This function helps creates an array with proper mapping for userIdentiFier.
 * Logics: Here we are creating an array with all the attributes provided in the add/remove array
 * inside listData.
 * @param {Array} attributeArray rudder event message properties listData add
 * @param {string} typeOfList
 * @param {Array<string>} userSchema
 * @param {boolean} isHashRequired
 * @returns
 */
const populateIdentifiers = (attributeArray, typeOfList, userSchema, isHashRequired) => {
  const userIdentifier = [];
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

const populateIdentifiersForRecordEvent = (
  identifiersArray,
  typeOfList,
  userSchema,
  isHashRequired,
) => {
  const userIdentifiers = [];

  if (isDefinedAndNotNullAndNotEmpty(identifiersArray)) {
    // traversing through every element in the add array
    identifiersArray.forEach((identifiers) => {
      if (isHashRequired) {
        hashEncrypt(identifiers);
      }
      if (TYPEOFLIST[typeOfList] && identifiers[TYPEOFLIST[typeOfList]]) {
        userIdentifiers.push({ [TYPEOFLIST[typeOfList]]: identifiers[TYPEOFLIST[typeOfList]] });
      } else {
        Object.entries(attributeMapping).forEach(([key, mappedKey]) => {
          if (identifiers[key] && userSchema.includes(key))
            userIdentifiers.push({ [mappedKey]: identifiers[key] });
        });
        const addressInfo = constructPayload(identifiers, addressInfoMapping);
        if (
          isDefinedAndNotNullAndNotEmpty(addressInfo) &&
          (userSchema.includes('addressInfo') ||
            userSchema.some((schema) => ADDRESS_INFO_ATTRIBUTES.includes(schema)))
        )
          userIdentifiers.push({ addressInfo });
      }
    });
  }
  return userIdentifiers;
};

const getOperationAudienceId = (audienceId, message) => {
  let operationAudienceId = audienceId;
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (!operationAudienceId && mappedToDestination) {
    const { objectType } = getDestinationExternalIDInfoForRetl(
      message,
      'GOOGLE_ADWORDS_REMARKETING_LISTS',
    );
    operationAudienceId = objectType;
  }
  return operationAudienceId;
};

module.exports = {
  populateIdentifiers,
  responseBuilder,
  getOperationAudienceId,
  populateIdentifiersForRecordEvent,
};
