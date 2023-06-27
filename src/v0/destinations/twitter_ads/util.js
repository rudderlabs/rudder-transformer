const crypto = require('crypto');
const oauth1a = require('oauth-1.0a');

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

module.exports = { getAuthHeaderForRequest };