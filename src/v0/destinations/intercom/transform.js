const md5 = require('md5');
const get = require('get-value');
const { EventType, MappedToDestinationKey } = require('../../../constants');
const {
  ConfigCategory,
  MappingConfig,
  ReservedTraitsProperties,
  ReservedCompanyProperties,
} = require('./config');
const {
  constructPayload,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  addExternalIdToTraits,
  simpleProcessRouterDest,
  isHttpStatusSuccess,
} = require('../../util');
const { InstrumentationError, NetworkError } = require('../../util/errorTypes');
const { httpPOST } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');

function getCompanyAttribute(company) {
  const companiesList = [];
  if (company.name || company.id) {
    const customAttributes = {};
    Object.keys(company).forEach((key) => {
      // the key is not in ReservedCompanyProperties
      if (!ReservedCompanyProperties.includes(key)) {
        const val = company[key];
        if (val) {
          customAttributes[key] = val;
        }
      }
    });

    companiesList.push({
      company_id: company.id || md5(company.name),
      custom_attributes: customAttributes,
      name: company.name,
      industry: company.industry,
    });
  }
  return companiesList;
}

function validateIdentify(message, payload) {
  const finalPayload = payload;

  finalPayload.update_last_request_at = true;
  if (payload.user_id || payload.email) {
    if (payload.name === undefined || payload.name === '') {
      const firstName = getFieldValueFromMessage(message, 'firstName');
      const lastName = getFieldValueFromMessage(message, 'lastName');
      if (firstName && lastName) {
        finalPayload.name = `${firstName} ${lastName}`;
      } else {
        finalPayload.name = firstName || lastName;
      }
    }

    if (get(finalPayload, 'custom_attributes.company')) {
      finalPayload.companies = getCompanyAttribute(finalPayload.custom_attributes.company);
    }

    if (finalPayload.custom_attributes) {
      ReservedTraitsProperties.forEach((trait) => {
        delete finalPayload.custom_attributes[trait];
      });
    }

    return finalPayload;
  }
  throw new InstrumentationError('Email or userId is mandatory');
}

function validateTrack(message, payload) {
  // pass only string, number, boolean properties
  if (payload.user_id || payload.email) {
    const metadata = {};
    if (message.properties) {
      Object.keys(message.properties).forEach((key) => {
        const val = message.properties[key];
        if (val && typeof val !== 'object' && !Array.isArray(val)) {
          metadata[key] = val;
        }
      });
    }
    return { ...payload, metadata };
  }
  throw new InstrumentationError('Email or userId is mandatory');
}

const bindUserAndCompany = async (payload, userId, Config) => {
  if (!userId) {
    return;
  }

  const requestBody = {};
  requestBody.id = userId;
  requestBody.companies = [];
  const companyObj = {};
  companyObj.company_id = payload.company_id;
  companyObj.name = payload.name;
  requestBody.companies.push(companyObj);

  const {endpoint} = ConfigCategory.IDENTIFY;
  const requestData = requestBody;
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Config.apiKey}`,
      Accept: 'application/json',
    },
  };
  const companyResponse = await httpPOST(endpoint, requestData, requestOptions);

  const processedCompanyResponse = processAxiosResponse(companyResponse);
  if (!isHttpStatusSuccess(processedCompanyResponse.status)) {
    const errMessage = JSON.stringify(processedCompanyResponse.response) || '';
    const errorStatus = processedCompanyResponse.status || 500;
    throw new NetworkError(
      `[Group]: failed linking user to company ${errMessage}`,
      errorStatus,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errorStatus),
      },
      companyResponse,
    );
  }
};

async function validateAndBuildResponse(message, payload, category, destination) {
  const messageType = message.type.toLowerCase();
  const response = defaultRequestConfig();
  switch (messageType) {
    case EventType.IDENTIFY:
      response.body.JSON = removeUndefinedAndNullValues(validateIdentify(message, payload));
      break;
    case EventType.TRACK:
      response.body.JSON = removeUndefinedAndNullValues(validateTrack(message, payload));
      break;
    case EventType.GROUP:
      response.body.JSON = removeUndefinedAndNullValues(payload);
      await bindUserAndCompany(payload, message.userId, destination.Config);
      break;
    default:
      throw new InstrumentationError(`Message type ${messageType} not supported`);
  }

  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = category.endpoint;
  response.headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${destination.Config.apiKey}`,
    Accept: 'application/json',
    'Intercom-Version': '1.4',
  };
  response.userId = message.anonymousId;
  return response;
}

function processSingleMessage(message, destination) {
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }
  const { sendAnonymousId } = destination.Config;
  const messageType = message.type.toLowerCase();
  let category;

  switch (messageType) {
    case EventType.IDENTIFY:
      category = ConfigCategory.IDENTIFY;
      break;
    case EventType.TRACK:
      category = ConfigCategory.TRACK;
      break;
    case EventType.GROUP:
      category = ConfigCategory.GROUP;
      break;
    default:
      throw new InstrumentationError(`Message type ${messageType} not supported`);
  }

  // build the response and return
  let payload;
  if (get(message, MappedToDestinationKey)) {
    addExternalIdToTraits(message);
    payload = getFieldValueFromMessage(message, 'traits');
  } else {
    payload = constructPayload(message, MappingConfig[category.name]);
  }
  if (sendAnonymousId && !payload.user_id) {
    payload.user_id = message.anonymousId;
  }
  return validateAndBuildResponse(message, payload, category, destination);
}

function process(event) {
  const response = processSingleMessage(event.message, event.destination);
  return response;
}

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
