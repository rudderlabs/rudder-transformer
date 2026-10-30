const sha256 = require('sha256');

const {
  InstrumentationError,
  ConfigurationError,
  isDefinedNotNullNotEmpty,
} = require('@rudderstack/integrations-lib');
const {
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  isDefinedAndNotNull,
  getType,
  simpleProcessRouterDest,
} = require('../../util');
const { EventType } = require('../../../constants');
const { ConfigCategories, mappingConfig, BASE_URL } = require('./config');

const { JSON_MIME_TYPE } = require('../../util/constant');
const { getAuthHeaderForRequest, getOAuthFields } = require('./util');

const SCALAR_TYPES = ['string', 'number', 'bigint', 'boolean'];

// Omits empty identifiers and rejects populated non-scalar values as invalid event data.
const toTrimmedIdentifier = (value, fieldName) => {
  if (!isDefinedNotNullNotEmpty(value)) {
    return undefined;
  }
  if (!SCALAR_TYPES.includes(typeof value)) {
    throw new InstrumentationError(
      `[TWITTER ADS]: properties.${fieldName} must be a string, number, bigint or boolean, received ${getType(value)}. Aborting message`,
    );
  }
  return String(value).trim();
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

  const oAuthObject = getOAuthFields(metadata, 'TWITTER ADS');
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
    const eventObj = eventNameToIdMappings.find((obj) => {
      const name = obj.rudderEventName;
      return (
        isDefinedNotNullNotEmpty(name) &&
        SCALAR_TYPES.includes(typeof name) &&
        String(name).trim().toLowerCase() === event?.toString().toLowerCase()
      );
    });
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
  const { contents, ...rest } = requestJson;

  if (!Array.isArray(contents)) return requestJson;

  const transformedContents = contents
    .map(({ id, groupId, name, price, type, quantity }) => {
      const transformed = {};
      if (id) {
        transformed.content_id = id;
      }
      if (groupId) {
        transformed.content_group_id = groupId;
      }
      if (name) {
        transformed.content_name = name;
      }
      if (type) {
        transformed.content_type = type;
      }
      if (price && Number.isFinite(parseFloat(price))) {
        const parsedPrice = parseFloat(price);
        // content_price should be a string
        transformed.content_price = Number.isInteger(parsedPrice)
          ? parsedPrice.toFixed(2)
          : parsedPrice.toString();
      }
      if (quantity && Number.isFinite(parseInt(quantity, 10))) {
        transformed.num_items = parseInt(quantity, 10);
      }
      return Object.keys(transformed).length > 0 ? transformed : null;
    })
    .filter(Boolean); // Removes null entries

  return transformedContents.length > 0 ? { ...rest, contents: transformedContents } : rest;
}

// Separate identifier creation logic for better maintainability
function createIdentifiers(properties) {
  if (!properties) {
    throw new InstrumentationError(
      '[TWITTER ADS]: properties must be present in event. Aborting message',
    );
  }
  const identifiers = [];
  const { email, phone, twclid, ip_address: ipAddress, user_agent: userAgent } = properties;

  const trimmedEmail = toTrimmedIdentifier(email, 'email');
  const trimmedPhone = toTrimmedIdentifier(phone, 'phone');
  const trimmedIp = toTrimmedIdentifier(ipAddress, 'ip_address');
  const trimmedUserAgent = toTrimmedIdentifier(userAgent, 'user_agent');

  if (trimmedEmail) {
    identifiers.push({ hashed_email: sha256(trimmedEmail.toLowerCase()) });
  }
  if (trimmedPhone) {
    identifiers.push({ hashed_phone_number: sha256(trimmedPhone) });
  }
  // Validate the click ID but keep existing nonblank string values unchanged.
  const trimmedTwclid = toTrimmedIdentifier(twclid, 'twclid');
  if (trimmedTwclid) {
    identifiers.push({ twclid: typeof twclid === 'string' ? twclid : trimmedTwclid });
  }

  // Handle IP and user agent
  // ip_address or/and user_agent is required to be
  // passed in conjunction with another identifier
  // ref: https://developer.x.com/en/docs/x-ads-api/measurement/web-conversions/api-reference/conversions
  if (trimmedIp && trimmedUserAgent) {
    identifiers.push({
      ip_address: trimmedIp,
      user_agent: trimmedUserAgent,
    });
  } else {
    if (identifiers.length === 0) {
      throw new InstrumentationError(
        '[TWITTER ADS]: one of twclid, phone, email or ip_address with user_agent must be present in properties.',
      );
    }
    if (trimmedIp) {
      identifiers[0].ip_address = trimmedIp;
    }
    if (trimmedUserAgent) {
      identifiers[0].user_agent = trimmedUserAgent;
    }
  }

  return identifiers;
}

// process track call
function processTrack(message, metadata, destination) {
  const identifiers = createIdentifiers(message.properties);
  let requestJson = constructPayload(message, mappingConfig[ConfigCategories.TRACK.name]);
  requestJson.identifiers = identifiers;

  // Populate required fields
  requestJson.event_id =
    requestJson.event_id || populateEventId(message.event, requestJson, destination);

  requestJson.conversion_time = isDefinedAndNotNull(requestJson.conversion_time)
    ? requestJson.conversion_time
    : message.timestamp;

  // Add identifiers and transform contents
  requestJson = populateContents(requestJson);

  const endpointUrl = prepareUrl(message, destination);
  return buildResponse(message, requestJson, metadata, endpointUrl);
}

function process(event) {
  const { message, metadata, destination } = event;

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
