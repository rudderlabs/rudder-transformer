const sha256 = require('sha256');

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

const {
  InstrumentationError,
  OAuthSecretError,
  ConfigurationError,
} = require('../../util/errorTypes');
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

function populateContents(requestJson) {
  const reqJson = { ...requestJson };
  if (reqJson.contents) {
    const transformedContents = requestJson.contents
      .map((obj) => ({
        ...(obj.id && { content_id: obj.id }),
        ...(obj.groupId && { content_group_id: obj.groupId }),
        ...(obj.name && { content_name: obj.name }),
        ...(obj.price && { content_price: parseFloat(obj.price) }),
        ...(obj.type && { content_type: obj.type }),
        ...(obj.quantity && { num_items: parseInt(obj.quantity, 10) }),
      }))
      .filter((tfObj) => Object.keys(tfObj).length > 0);
    if (transformedContents.length > 0) {
      reqJson.contents = transformedContents;
    }
  }
  return reqJson;
}

// process track call
function processTrack(message, metadata, destination) {
  let requestJson = constructPayload(message, mappingConfig[ConfigCategories.TRACK.name]);

  requestJson.event_id =
    requestJson.event_id || populateEventId(message.event, requestJson, destination);

  requestJson.conversion_time = isDefinedAndNotNull(requestJson.conversion_time)
    ? requestJson.conversion_time
    : message.timestamp;

  const identifiers = [];

  if (message.properties.email) {
    let email = message.properties.email.trim();
    if (email) {
      email = email.toLowerCase();
      identifiers.push({ hashed_email: sha256(email) });
    }
  }

  if (message.properties.phone) {
    const phone = message.properties.phone.trim();
    if (phone) {
      identifiers.push({ hashed_phone_number: sha256(phone) });
    }
  }

  if (message.properties.twclid) {
    identifiers.push({ twclid: message.properties.twclid });
  }

  requestJson = populateContents(requestJson);

  requestJson.identifiers = identifiers;

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

  if (!properties.email && !properties.phone && !properties.twclid) {
    throw new InstrumentationError(
      '[TWITTER ADS]: one of twclid, phone or email must be present in properties.',
    );
  }
}

function process(event) {
  const { message, metadata, destination } = event;

  validateRequest(message);

  const messageType = message.type?.toLowerCase();

  if (messageType === EventType.TRACK) {
    return processTrack(message, metadata, destination);
  }

  throw new InstrumentationError(`Message type ${messageType} not supported`);
}

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
