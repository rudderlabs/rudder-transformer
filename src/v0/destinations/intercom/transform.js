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
} = require('../../util');
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

function attachUserAndCompany(message, Config) {
  const email = message.context?.traits?.email;
  const { userId } = message;
  if (!userId && !email) {
    return false;
  }
  const requestBody = {};
  if (userId) {
    requestBody.user_id = userId;
  }
  if (email) {
    requestBody.email = email;
  }
  const companyObj = {
    company_id: message.groupId,
  };
  if (message.traits?.name) {
    companyObj.name = message.traits.name;
  }
  requestBody.companies = [companyObj];
  let response = defaultRequestConfig();
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
  const { traits } = message;
  const customAttributes = {};
  const companyReservedKeys = [
      "remoteCreatedAt",
      "monthlySpend",
      "industry",
      "website",
      "size",
      "plan",
      "name"
  ];

  if (traits) {
    Object.keys(traits).forEach((key) => {
      if (!companyReservedKeys.includes(key) && key !== "userId") {
        customAttributes[key] = traits[key];
      }
    })
  }

  if (Object.keys(customAttributes).length > 0) {
    payload.custom_attributes = customAttributes;
  }
}

function validateAndBuildResponse(message, payload, category, destination) {
  const respList = [];
  let response = defaultRequestConfig();
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
      response.body.JSON = removeUndefinedAndNullValues(validateIdentify(message, payload));
      break;
    case EventType.TRACK:
      response.body.JSON = removeUndefinedAndNullValues(validateTrack(message, payload));
      break;
    case EventType.GROUP: {
      buildCustomAttributes(message, payload);
      response.body.JSON = removeUndefinedAndNullValues(payload);
      respList.push(response);
      const attachUserAndCompanyResponse =
          attachUserAndCompany(message, destination.Config);
      if (attachUserAndCompanyResponse) {
        attachUserAndCompanyResponse.userId = message.anonymousId;
        respList.push(attachUserAndCompanyResponse);
      }
      break;
    }
    default:
      throw new InstrumentationError(`Message type ${messageType} not supported`);
  }

  return (messageType === EventType.GROUP) ? respList : response;
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
