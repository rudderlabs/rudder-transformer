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
  flattenJson,
} = require('../../util');
const { separateReservedAndRestMetadata } = require('./util');
const { InstrumentationError } = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');

function getCompanyAttribute(company) {
  const companiesList = [];
  if (company.name || company.id) {
    const customAttributes = {};
    Object.keys(company).forEach((key) => {
      // the key is not in ReservedCompanyProperties
      if (!ReservedCompanyProperties.includes(key)) {
        const val = company[key];
        if (val !== Object(val)) {
          customAttributes[key] = val;
        } else {
          customAttributes[key] = JSON.stringify(val);
        }
      }
    });

    companiesList.push({
      company_id: company.id || md5(company.name),
      custom_attributes: removeUndefinedAndNullValues(customAttributes),
      name: company.name,
      industry: company.industry,
    });
  }
  return companiesList;
}

function validateIdentify(message, payload, config) {
  const finalPayload = payload;

  finalPayload.update_last_request_at =
    config.updateLastRequestAt !== undefined ? config.updateLastRequestAt : true;
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
      finalPayload.custom_attributes = flattenJson(finalPayload.custom_attributes);
    }

    return finalPayload;
  }
  throw new InstrumentationError('Either of `email` or `userId` is required for Identify call');
}

function validateTrack(payload) {
  if (!payload.user_id && !payload.email) {
    throw new InstrumentationError('Either of `email` or `userId` is required for Track call');
  }
  // pass only string, number, boolean properties
  if (payload.metadata) {
    // reserved metadata contains JSON objects that does not requires flattening
    const { reservedMetadata, restMetadata } = separateReservedAndRestMetadata(payload.metadata);
    return { ...payload, metadata: { ...reservedMetadata, ...flattenJson(restMetadata) } };
  }

  return payload;
}

const checkIfEmailOrUserIdPresent = (message, Config) => {
  const { context, anonymousId } = message;
  let { userId } = message;
  if (Config.sendAnonymousId && !userId) {
    userId = anonymousId;
  }
  return !!(userId || context.traits?.email);
};

function attachUserAndCompany(message, Config) {
  const email = message.context?.traits?.email;
  const { userId, anonymousId, traits, groupId } = message;
  const requestBody = {};
  if (userId) {
    requestBody.user_id = userId;
  }
  if (Config.sendAnonymousId && !userId) {
    requestBody.user_id = anonymousId;
  }
  if (email) {
    requestBody.email = email;
  }
  const companyObj = {
    company_id: groupId,
  };
  if (traits?.name) {
    companyObj.name = traits.name;
  }
  requestBody.companies = [companyObj];
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = ConfigCategory.IDENTIFY.endpoint;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Bearer ${Config.apiKey}`,
    Accept: JSON_MIME_TYPE,
    'Intercom-Version': '1.4',
  };
  response.body.JSON = requestBody;
  return response;
}

function buildCustomAttributes(message, payload) {
  const finalPayload = payload;
  const { traits } = message;
  const customAttributes = {};
  const companyReservedKeys = [
    'remoteCreatedAt',
    'monthlySpend',
    'industry',
    'website',
    'size',
    'plan',
    'name',
  ];

  if (traits) {
    Object.keys(traits).forEach((key) => {
      if (!companyReservedKeys.includes(key) && key !== 'userId') {
        customAttributes[key] = traits[key];
      }
    });
  }

  if (Object.keys(customAttributes).length > 0) {
    finalPayload.custom_attributes = flattenJson(customAttributes);
  }

  return finalPayload;
}

function validateAndBuildResponse(message, payload, category, destination) {
  const respList = [];
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = category.endpoint;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Bearer ${destination.Config.apiKey}`,
    Accept: JSON_MIME_TYPE,
    'Intercom-Version': '1.4',
  };
  response.userId = message.anonymousId;
  const messageType = message.type.toLowerCase();
  switch (messageType) {
    case EventType.IDENTIFY:
      response.body.JSON = removeUndefinedAndNullValues(
        validateIdentify(message, payload, destination.Config),
      );
      break;
    case EventType.TRACK:
      response.body.JSON = removeUndefinedAndNullValues(validateTrack(payload));
      break;
    case EventType.GROUP: {
      response.body.JSON = removeUndefinedAndNullValues(buildCustomAttributes(message, payload));
      respList.push(response);
      if (checkIfEmailOrUserIdPresent(message, destination.Config)) {
        const attachUserAndCompanyResponse = attachUserAndCompany(message, destination.Config);
        attachUserAndCompanyResponse.userId = message.anonymousId;
        respList.push(attachUserAndCompanyResponse);
      }
      break;
    }
    default:
      throw new InstrumentationError(`Message type ${messageType} not supported`);
  }

  return messageType === EventType.GROUP ? respList : response;
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
  if (category !== ConfigCategory.GROUP && sendAnonymousId && !payload.user_id) {
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
