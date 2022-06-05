const qs = require("qs");
const { generateJWTToken } = require("../../../util/jwtTokenGenerator");
const { httpSend } = require("../../../adapters/network");

const getUnixTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};

const getAccessToken = async Config => {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  const data = {
    aud: "https://id.b2b.yahooinc.com/identity/oauth2/access_token?realm=dsp",
    sub: Config.clientId,
    iss: Config.clientId,
    exp: getUnixTimestamp(),
    iat: getUnixTimestamp() + 3600
  };
  const secret = Config.clientSecret;

  const request = {
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    url: "https://id.b2b.yahooinc.com/identity/oauth2/access_token",
    data: qs.stringify({
      grant_type: "client_credentials",
      scope: "dsp-api-access",
      realm: "dsp",
      client_assertion_type:
        "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      client_assertion: generateJWTToken(header, data, secret)
    }),
    method: "POST"
  };
  const response = await httpSend(request);
  return response.data.ccess_token;
};

const ProxyRequest = async request => {
  const { body, method, endpoint, headers } = request;

  //   const accessToken = await getAccessToken(method, headers);

  set(body.JSON);
  const requestBody = { url: endpoint, data: body.JSON, headers, method };
  const response = await httpSend(requestBody);
  return response;
};

class networkHandler {
  constructor() {
    this.proxy = ProxyRequest;
    this.responseHandler = responseHandler;
    this.processAxiosResponse = processAxiosResponse;
  }
}
module.exports = { networkHandler, getAccessToken };
