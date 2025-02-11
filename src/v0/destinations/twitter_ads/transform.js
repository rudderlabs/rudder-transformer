const sha256 = require('sha256');

const {
  InstrumentationError,
  OAuthSecretError,
  ConfigurationError,
} = require('@rudderstack/integrations-lib');
const {
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  isDefinedAndNotNull,
  simpleProcessRouterDest,
} = require('../../util');
const { EventType } = require('../../../constants');
const { ConfigCategories, mappingConfig, BASE_URL } = require('./config');

const { JSON_MIME_TYPE } = require('../../util/constant');
const { getAuthHeaderForRequest } = require('./util');

const getOAuthFields = ({ secret }) => {
  if (!secret) {
    throw new OAuthSecretError('[TWITTER ADS]:: OAuth - access keys not found');
  }
  const oAuthObject = {
    consumerKey: secret.consumerKey,
    consumerSecret: secret.consumerSecret,
    accessToken: secret.accessToken,
    accessTokenSecret: secret.accessTokenSecret,
  };
  return oAuthObject;
};

// build final response
function buildResponse(message, requestJson, metadata, endpointUrl) {
  const response = defaultRequestConfig();
  response.endpoint = endpointUrl;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON.conversions = [removeUndefinedAndNullValues(requestJson)];
  // required to be in accordance with oauth package
  const request = {
    url: response.endpoint,
    method: response.method,
    body: response.body.JSON,
  };

  const oAuthObject = getOAuthFields(metadata);
  const authHeader = getAuthHeaderForRequest(request, oAuthObject).Authorization;
  response.headers = {
    Authorization: authHeader,
    'Content-Type': JSON_MIME_TYPE,
  };
  return response;
}

function prepareUrl(message, destination) {
  const pixelId = message.properties.pixelId || destination.Config.pixelId;
  return `${BASE_URL}/${pixelId}`;
}

function populateEventId(event, requestJson, destination) {
  const eventNameToIdMappings = destination.Config.twitterAdsEventNames;
  let eventId = '';

  if (eventNameToIdMappings) {
    const eventObj = eventNameToIdMappings.find(
      (obj) => obj.rudderEventName?.trim().toLowerCase() === event?.toString().toLowerCase(),
    );
    eventId = eventObj?.twitterEventId;
  }

  if (!eventId) {
    throw new ConfigurationError(
      `[TWITTER ADS]: Event - '${event}' do not have a corresponding eventId in configuration. Aborting`,
    );
  }

  return eventId;
}

// Separate identifier creation logic for better maintainability
function createIdentifiers(properties) {
  const identifiers = [];
  const { email, phone, twclid, ip_address: ipAddress, user_agent: userAgent } = properties;

  // Handle email
  if (email?.trim()) {
    identifiers.push({
      hashed_email: sha256(email.trim().toLowerCase()),
    });
  }

  // Handle phone
  if (phone?.trim()) {
    identifiers.push({
      hashed_phone_number: sha256(phone.trim()),
    });
  }

  // Handle twclid
  if (twclid) {
    identifiers.push({ twclid });
  }

  // Handle IP and user agent
  const trimmedIp = ipAddress?.trim();
  const trimmedUserAgent = userAgent?.trim();
  // ip_address or/and user_agent is required to be
  // passed in conjunction with another identifier
  // ref: https://developer.x.com/en/docs/x-ads-api/measurement/web-conversions/api-reference/conversions
  if (trimmedIp && trimmedUserAgent) {
    identifiers.push({
      ip_address: trimmedIp,
      user_agent: trimmedUserAgent,
    });
  } else if (identifiers.length > 0) {
    if (trimmedIp) {
      identifiers[0].ip_address = trimmedIp;
    }
    if (trimmedUserAgent) {
      identifiers[0].user_agent = trimmedUserAgent;
    }
  }

  return identifiers;
}

// Simplified content transformation
function transformContent(content) {
  const mappings = {
    id: 'content_id',
    groupId: 'content_group_id',
    name: 'content_name',
    type: 'content_type',
  };

  const transformed = Object.entries(mappings).reduce((acc, [key, newKey]) => {
    if (content[key]) {
      acc[newKey] = content[key];
    }
    return acc;
  }, {});

  if (content.price) {
    transformed.content_price = parseFloat(content.price);
  }

  if (content.quantity) {
    transformed.num_items = parseInt(content.quantity, 10);
  }

  return Object.keys(transformed).length > 0 ? transformed : null;
}

function populateContents(requestJson) {
  if (!requestJson.contents) return requestJson;

  const transformedContents = requestJson.contents.map(transformContent).filter(Boolean);

  return {
    ...requestJson,
    ...(transformedContents.length > 0 && { contents: transformedContents }),
  };
}

// process track call
function processTrack(message, metadata, destination) {
  let requestJson = constructPayload(message, mappingConfig[ConfigCategories.TRACK.name]);

  // Populate required fields
  requestJson.event_id =
    requestJson.event_id || populateEventId(message.event, requestJson, destination);

  requestJson.conversion_time = isDefinedAndNotNull(requestJson.conversion_time)
    ? requestJson.conversion_time
    : message.timestamp;

  // Add identifiers and transform contents
  requestJson.identifiers = createIdentifiers(message.properties);
  requestJson = populateContents(requestJson);

  const endpointUrl = prepareUrl(message, destination);
  return buildResponse(message, requestJson, metadata, endpointUrl);
}

function validateRequest(message) {
  const { properties } = message;

  if (!properties) {
    throw new InstrumentationError(
      '[TWITTER ADS]: properties must be present in event. Aborting message',
    );
  }

  if (
    !properties.email &&
    !properties.phone &&
    !properties.twclid &&
    !(properties.ip_address && properties.user_agent)
  ) {
    throw new InstrumentationError(
      '[TWITTER ADS]: one of twclid, phone, email or ip_address with user_agent must be present in properties.',
    );
  }
}

function process(event) {
  const { message, metadata, destination } = event;

  validateRequest(message);

  const messageType = message.type?.toLowerCase();

  if (messageType !== EventType.TRACK) {
    throw new InstrumentationError(`Message type ${messageType} not supported`);
  }
  return processTrack(message, metadata, destination);
}

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
