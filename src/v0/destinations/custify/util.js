const get = require('get-value');
const { InstrumentationError, NetworkError } = require('@rudderstack/integrations-lib');
const {
  ConfigCategory,
  MappingConfig,
  ReservedTraitsProperties,
  ReservedCompanyProperties,
} = require('./config');
const { httpPOST } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const {
  getFieldValueFromMessage,
  removeUndefinedAndNullValues,
  constructPayload,
  isHttpStatusSuccess,
} = require('../../util');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');

/**
 *
 * Craete or update company based on the group call parameters
 * @param {*} companyPayload
 * @param {*} Config
 * @api https://docs.custify.com/#tag/Company/paths/~1company/post
 */
const createUpdateCompany = async (companyPayload, Config) => {
  const companyResponse = await httpPOST(
    ConfigCategory.GROUP_COMPANY.endpoint,
    companyPayload,
    {
      headers: {
        'Content-Type': JSON_MIME_TYPE,
        Authorization: `Bearer ${Config.apiKey}`,
      },
    },
    {
      destType: 'custify',
      feature: 'transformation',
    },
  );
  const processedCompanyResponse = processAxiosResponse(companyResponse);
  if (!isHttpStatusSuccess(processedCompanyResponse.status)) {
    const errMessage = JSON.stringify(processedCompanyResponse.response) || '';
    const errorStatus = processedCompanyResponse.status || 500;
    throw new NetworkError(
      `[Group]: failed create/update company details ${errMessage}`,
      errorStatus,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errorStatus),
      },
      companyResponse,
    );
  }
};

const getCompanyAttribute = (companyId, remove = false) => {
  if (companyId) {
    const companiesList = [];
    companiesList.push({
      company_id: companyId,
      remove,
    });
    return companiesList;
  }
  return null;
};

/**
 * This function is used for post processing the user payload
 * the role of this fucntion is to format name and company id
 * also it sets the custom attributes to the user payload
 * @param {*} userPayload
 * @param {*} message
 * @returns {*} userPayload
 */
const postPorcessUserPayload = (userPayload, message) => {
  const finalPayload = userPayload;

  if (!userPayload.user_id && !userPayload.email) {
    throw new InstrumentationError('Email or userId is mandatory');
  }
  if (userPayload.name === undefined || userPayload.name === '') {
    const firstName = getFieldValueFromMessage(message, 'firstName');
    const lastName = getFieldValueFromMessage(message, 'lastName');
    if (firstName && lastName) {
      finalPayload.name = `${firstName} ${lastName}`;
    } else {
      finalPayload.name = firstName || lastName;
    }
  }

  finalPayload.companies = getCompanyAttribute(
    get(finalPayload, 'custom_attributes.company.id') || message.groupId,
    get(finalPayload, 'custom_attributes.company.remove'),
  );

  if (finalPayload.custom_attributes) {
    ReservedTraitsProperties.forEach((trait) => {
      delete finalPayload.custom_attributes[trait];
    });

    Object.keys(finalPayload.custom_attributes).forEach((key) => {
      const val = finalPayload.custom_attributes[key];
      if (typeof val === 'object' || Array.isArray(val)) {
        delete finalPayload.custom_attributes[key];
      }
    });
  }

  return removeUndefinedAndNullValues(finalPayload);
};

/**
 * This function is used to process the identify call
 * @param {*} message
 * @param {*} Config
 * @returns {*} userPayload
 * @api https://docs.custify.com/#tag/People/paths/~1people/post
 */
const processIdentify = (message, { Config }) => {
  const userPayload = constructPayload(message, MappingConfig[ConfigCategory.IDENTIFY.name]);
  const { sendAnonymousId } = Config;
  if (sendAnonymousId && !userPayload.user_id) {
    userPayload.user_id = message.anonymousId;
  }
  return postPorcessUserPayload(userPayload, message);
};

/**
 * This function is used to process the track call
 * it will send an event to the custify along with
 * the properties passed through the track call
 * @param {*} message
 * @param {*} param1
 * @returns {*} eventPayload
 * @api https://docs.custify.com/#tag/Event/paths/~1event/post
 */
const processTrack = (message, { Config }) => {
  const eventPayload = constructPayload(message, MappingConfig[ConfigCategory.TRACK.name]);
  const { sendAnonymousId, deduplicationField, enablededuplication } = Config;
  if (sendAnonymousId && !eventPayload.user_id) {
    eventPayload.user_id = message.anonymousId;
  }
  if (!eventPayload.user_id && !eventPayload.email) {
    throw new InstrumentationError('Email or userId is mandatory');
  }
  const metadata = {};
  const { properties } = message;
  if (properties) {
    eventPayload.company_id =
      properties.organization_id || properties.company_id || properties.companyId;

    Object.keys(properties).forEach((key) => {
      const val = properties[key];
      if (val && typeof val !== 'object' && !Array.isArray(val)) {
        metadata[key] = val;
      }
    });
  }
  if (eventPayload.user_id && !metadata.user_id && !metadata.userId) {
    metadata.user_id = eventPayload.user_id;
  }

  if (enablededuplication) {
    eventPayload.deduplication_id =
      get(message, `${deduplicationField}`) || get(message, 'messageId');
  }

  return removeUndefinedAndNullValues({ ...eventPayload, metadata });
};

/**
 * This function is used to process the group call
 * this function creates or updates the company details
 * based on the groupId passed and maps the user to the company
 * based on the userId passed
 * @param {*} message
 * @param {*} param1
 * @returns {*} userPayload
 * @api https://docs.custify.com/#tag/People/paths/~1people/post
 * @api https://docs.custify.com/#tag/Company/paths/~1company/post
 */
const processGroup = async (message, { Config }) => {
  let companyPayload = constructPayload(message, MappingConfig[ConfigCategory.GROUP_COMPANY.name]);
  if (!companyPayload.company_id) {
    throw new InstrumentationError('groupId Id is mandatory');
  }
  if (companyPayload.custom_attributes) {
    ReservedCompanyProperties.forEach((trait) => {
      delete companyPayload.custom_attributes[trait];
    });

    Object.keys(companyPayload.custom_attributes).forEach((key) => {
      const val = companyPayload.custom_attributes[key];
      if (typeof val === 'object' || Array.isArray(val)) {
        delete companyPayload.custom_attributes[key];
      }
    });
  }
  companyPayload = removeUndefinedAndNullValues(companyPayload);
  await createUpdateCompany(companyPayload, Config);
  const userPayload = constructPayload(message, MappingConfig[ConfigCategory.GROUP_USER.name]);
  const { sendAnonymousId } = Config;
  if (sendAnonymousId && !userPayload.user_id) {
    userPayload.user_id = message.anonymousId;
  }
  const processsedUserPayload = postPorcessUserPayload(userPayload, message);
  return processsedUserPayload;
};

module.exports = {
  createUpdateCompany,
  processIdentify,
  processTrack,
  processGroup,
};
