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
} = require('./config');

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

module.exports = {
  populateIdentifiers,
  responseBuilder,
};
