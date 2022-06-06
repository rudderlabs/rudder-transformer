const qs = require("qs");
const { generateJWTToken } = require("../../../util/jwtTokenGenerator");
const { httpSend } = require("../../../adapters/network");
const { CustomError } = require("../../util");

const { ACCESS_TOKEN_CACHE_TTL } = require("./config.js");
const Cache = require("../../util/cache");

const accessTokenCache = new Cache(ACCESS_TOKEN_CACHE_TTL);

const getUnixTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};

const poiLocationType = [
  "includeChains",
  "includeWoeids",
  "includeCategories",
  "includeGids",
  "excludeChains",
  "excludeWoeids",
  "excludeCategories",
  "excludeGids"
];
let listType;
const includes = {};
const excludes = {};

const populateIncludes = (list, audienceType) => {
  list.forEach(element => {
    const keys = Object.keys(element);
    keys.forEach(elementKey => {
      if (poiLocationType.includes(elementKey)) {
        listType = audienceType;
      }
    });
    if (!listType) {
      throw new CustomError(`Audience type ${audienceType} not provided`, 400);
    }
    if (element.includeChains) {
      if (!includes.chains) {
        includes.chains = [];
      }
      includes.chains.push(element.includeChains);
    }
    if (element.includeWoeids) {
      if (!includes.woeids) {
        includes.woeids = [];
      }
      includes.woeids.push(element.includeWoeids);
    }
    if (element.includeGids) {
      if (!includes.gids) {
        includes.gids = [];
      }
      includes.gids.push(element.includeGids);
    }
    if (element.includeCategories) {
      if (!includes.categories) {
        includes.categories = [];
      }
      includes.categories.push(element.includeCategories);
    }
  });
  return includes;
};

const populateExcludes = (list, audienceType) => {
  list.forEach(element => {
    const keys = Object.keys(element);
    keys.forEach(elementKey => {
      if (poiLocationType.includes(elementKey)) {
        listType = audienceType;
      }
    });
    if (!listType) {
      throw new CustomError(`Audience type ${audienceType} not provided`, 400);
    }
    if (element.excludeChains) {
      if (!excludes.chains) {
        excludes.chains = [];
      }
      excludes.chains.push(element.excludeChains);
    }
    if (element.excludeWoeids) {
      if (!excludes.woeids) {
        excludes.woeids = [];
      }
      excludes.woeids.push(element.excludeWoeids);
    }
    if (element.excludeGids) {
      if (!excludes.gids) {
        excludes.gids = [];
      }
      excludes.gids.push(element.excludeGids);
    }
    if (element.excludeCategories) {
      if (!excludes.categories) {
        excludes.categories = [];
      }
      excludes.categories.push(element.categories);
    }
  });
  return excludes;
};

const getAccessToken = async params => {
  const accessTokenKey = params.destinationId;
  return accessTokenCache.get(accessTokenKey, async () => {
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

    return response.response?.data?.access_token;
  });
};

const ProxyRequest = async request => {
  const { body, method, endpoint, headers, params } = request;

  const accessToken = await getAccessToken(params);

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
module.exports = {
  networkHandler,
  getAccessToken,
  populateIncludes,
  populateExcludes
};
