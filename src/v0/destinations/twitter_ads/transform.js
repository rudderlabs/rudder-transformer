const { EventType } = require('../../../constants');
const sha256 = require('sha256');
const {
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  isDefinedAndNotNull,
  simpleProcessRouterDest,
} = require('../../util');

const {
  ConfigCategories,
  mappingConfig,
  BASE_URL
} = require('./config');

const { InstrumentationError, OAuthSecretError } = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');

const getOAuthFields = ({ secret }) => {
  if (!secret) {
    throw new OAuthSecretError('[TWITTER ADS]:: OAuth - access keys not found');
  }
  const oAuthObject = {
    CONSUMERKEY: secret.consumer_key ,
    CONSUMERSECRET: secret.consumer_secret ,
    TOKENKEY: secret.oauth_access_token ,
    TOKENSECRET: secret.oauth_access_token_secret
  };
  return oAuthObject;
};

const crypto = require('crypto');
const oauth1a = require('oauth-1.0a');

function getAuthHeaderForRequest(request, oAuthObject) {
    const oauth = oauth1a({
      consumer: { key: oAuthObject.CONSUMERKEY, secret: oAuthObject.CONSUMERSECRET },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64')
      },
    })

    const authorization = oauth.authorize(request, {
      key: oAuthObject.TOKENKEY,
      secret: oAuthObject.TOKENSECRET,
    });

    return oauth.toHeader(authorization);
}

// build final response
function buildResponse(requestJson, metadata, endpointUrl) {
  const response = defaultRequestConfig();
  response.endpoint = endpointUrl;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON.conversions = [removeUndefinedAndNullValues(requestJson)];
  const request = {
    url: response.endpoint,
    method: response.method,
    body: response.body.JSON
  };
  const oAuthObject = getOAuthFields(metadata);
  response.headers = {
    Authorization: getAuthHeaderForRequest(request, oAuthObject).Authorization,
    'Content-Type': JSON_MIME_TYPE,
  };
  return response;
}

function prepareUrl(message, destination) {
  const pixelId = message.properties.pixelId
    ? message.properties.pixelId : destination.Config.pixelId;
  return `${BASE_URL}/${pixelId}`;
}

// process track call
function processTrack(message, metadata, destination) {

  const requestJson = constructPayload(message, mappingConfig[ConfigCategories.TRACK.name]);

  requestJson.event_id = isDefinedAndNotNull(requestJson.event_id)
    ? requestJson.event_id : destination.Config.eventId;

  requestJson.conversion_time = isDefinedAndNotNull(requestJson.conversion_time)
    ? requestJson.conversion_time : new Date().toISOString();

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
    obj.twclid = sha256(twclid);
    identifiers.push(obj);
  }

  requestJson.identifiers = identifiers;

  const endpointUrl = prepareUrl(message, destination);

  return buildResponse(
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
