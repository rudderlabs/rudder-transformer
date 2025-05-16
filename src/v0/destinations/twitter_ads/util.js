const crypto = require('crypto');
const oauth1a = require('oauth-1.0a');
const {
  OAuthSecretError,
  isDefinedAndNotNullAndNotEmpty,
} = require('@rudderstack/integrations-lib');

function getAuthHeaderForRequest(request, oAuthObject) {
  const oauth = oauth1a({
    consumer: { key: oAuthObject.consumerKey, secret: oAuthObject.consumerSecret },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, k) {
      return crypto.createHmac('sha1', k).update(base_string).digest('base64');
    },
  });

  const authorization = oauth.authorize(request, {
    key: oAuthObject.accessToken,
    secret: oAuthObject.accessTokenSecret,
  });

  return oauth.toHeader(authorization);
}

function getOAuthFields({ secret }, destinationType) {
  if (!secret) {
    throw new OAuthSecretError(`[${destinationType}]:: OAuth - secret not found`);
  }
  const requiredFields = ['consumerKey', 'consumerSecret', 'accessToken', 'accessTokenSecret'];

  requiredFields.forEach((field) => {
    if (!isDefinedAndNotNullAndNotEmpty(secret[field])) {
      throw new OAuthSecretError(`[${destinationType}]:: OAuth - ${field} not found`);
    }
  });
  const oAuthObject = {
    consumerKey: secret.consumerKey,
    consumerSecret: secret.consumerSecret,
    accessToken: secret.accessToken,
    accessTokenSecret: secret.accessTokenSecret,
  };
  return oAuthObject;
}

module.exports = { getAuthHeaderForRequest, getOAuthFields };
