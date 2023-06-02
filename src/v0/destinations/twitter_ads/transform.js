const sha256 = require('sha256');
const crypto = require('crypto');
const oauth1a = require('oauth-1.0a');
const {
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  isDefinedAndNotNull,
  simpleProcessRouterDest,
} = require('../../util');
const { EventType } = require('../../../constants');
const {
  ConfigCategories,
  mappingConfig,
  BASE_URL,
  authHeaderConstant
} = require('./config');

const { InstrumentationError, OAuthSecretError, ConfigurationError } = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');

const getOAuthFields = ({ secret }) => {
  if (!secret) {
    throw new OAuthSecretError('[TWITTER ADS]:: OAuth - access keys not found');
  }
  const oAuthObject = {
    consumerKey: secret.consumerKey,
    consumerSecret: secret.consumerSecret,
    accessToken: secret.accessToken,
    accessTokenSecret: secret.accessTokenSecret
  };
  return oAuthObject;
};

function getAuthHeaderForRequest(request, oAuthObject) {
    const oauth = oauth1a({
      consumer: { key: oAuthObject.consumerKey, secret: oAuthObject.consumerSecret },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, k) {
        return crypto
            .createHmac('sha1', k)
            .update(base_string)
            .digest('base64')
      },
    })

    const authorization = oauth.authorize(request, {
      key: oAuthObject.accessToken,
      secret: oAuthObject.accessTokenSecret,
    });

    return oauth.toHeader(authorization);
}

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
    body: response.body.JSON
  };
  const oAuthObject = getOAuthFields(metadata);
  let authHeader = getAuthHeaderForRequest(request, oAuthObject).Authorization;
  if(message.properties.testModeEnable === true) {
    authHeader = authHeaderConstant;
  }
  response.headers = {
    Authorization: authHeaderConstant,
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
  let eventId = "";

  if (eventNameToIdMappings) {
    eventNameToIdMappings.forEach(obj => {
      if (obj.rudderEventName && obj.rudderEventName.trim() && obj.rudderEventName.trim().toLowerCase() == event.toString().toLowerCase()) {
        eventId = obj.twitterEventId;
      }
    });
  }

  if(!eventId) {
    throw new ConfigurationError(`[TWITTER ADS]: Event - '${event}' do not have a corresponding eventId in configuration. Aborting`);
  }

  return eventId;
}

// process track call
function processTrack(message, metadata, destination) {

  const requestJson = constructPayload(message, mappingConfig[ConfigCategories.TRACK.name]);

  requestJson.event_id = requestJson.event_id || populateEventId(message.event, requestJson, destination);

  requestJson.conversion_time = isDefinedAndNotNull(requestJson.conversion_time)
    ? requestJson.conversion_time : message.timestamp;

  const identifiers = [];

  if (message.properties.email) {
    const obj = {};
    let email = message.properties.email.trim();
    if (email) {
      email = email.toLowerCase();
      obj.hashed_email = sha256(email);
      identifiers.push(obj)
    }
  }

  if (message.properties.phone) {
    const obj = {};
    let phone = message.properties.phone.trim();
    if (phone) {
      obj.hashed_phone_number = sha256(phone);
      identifiers.push(obj)
    }
  }

  if (message.properties.twclid) {
    const obj = {};
    obj.twclid = sha256(message.properties.twclid);
    identifiers.push(obj);
  }

  if (requestJson.contents) {
    const transformedContents = [];
    requestJson.contents.forEach(obj => {
      const transformedObj = {};
      if (obj.id) {
        transformedObj.content_id = obj.id;
      }

      if (obj.groupId) {
        transformedObj.content_group_id = obj.groupId;
      }

      if (obj.name) {
        transformedObj.content_name = obj.name;
      }

      if (obj.price) {
        transformedObj.content_price = parseFloat(obj.price);
      }

      if (obj.type) {
        transformedObj.content_type = obj.type;
      }

      if (obj.quantity) {
        transformedObj.num_items = parseInt(obj.quantity);
      }

      if (Object.keys(transformedObj).length > 0) {
        transformedContents.push(transformedObj);
      }
    });
    requestJson.contents = transformedContents;

    if(transformedContents.length == 0) {
      delete requestJson.contents;
    }
  }

  requestJson.identifiers = identifiers;

  const endpointUrl = prepareUrl(message, destination);

  return buildResponse(
    message,
    requestJson,
    metadata,
    endpointUrl
  );
}

function validateRequest(message) {

  const properties = message.properties;

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
  let response = {};

  if (messageType === EventType.TRACK) {
    response = processTrack(message, metadata, destination);
  } else {
    throw new InstrumentationError(`Message type ${messageType} not supported`);
  }

  return response;
}

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
