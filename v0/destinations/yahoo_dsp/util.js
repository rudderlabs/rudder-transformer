const qs = require("qs");
const { generateJWTToken } = require("../../../util/jwtTokenGenerator");
const { httpSend, httpPOST } = require("../../../adapters/network");
const { CustomError } = require("../../util");

const { ACCESS_TOKEN_CACHE_TTL } = require("./config.js");
const Cache = require("../../util/cache");

const ACCESS_TOKEN_CACHE = new Cache(ACCESS_TOKEN_CACHE_TTL);

const getUnixTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};

/**
 * There are four location types which are stored in the poiLocationType error. These are ["chains", "woeids", "gids", "categories"].
 * The ones to be added in includes Object will be taken from audienceType with include as Prefix. The ones to be added in excludes 
 * Object will be taken from audienceType with exclude as Prefix.   
 */
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

// updating includes 
const populateIncludes = (audienceList, audienceType) => {
  audienceList.forEach(element => {
    const audieceListkeys = Object.keys(element);
    audieceListkeys.forEach(elementKey => {
      if (poiLocationType.includes(elementKey)) {
        listType = audienceType;
      }
    });
    if (!listType) {
      throw new CustomError(`[Yahoo_DSP]:: Required property for ${audienceType} type audience is not available in an object`, 400);
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

// updating excludes
const populateExcludes = (audienceList, audienceType) => {
  audienceList.forEach(element => {
    const audienceListKeys = Object.keys(element);
    audienceListKeys.forEach(elementKey => {
      if (poiLocationType.includes(elementKey)) {
        listType = audienceType;
      }
    });
    if (!listType) {
      throw new CustomError(`[Yahoo_DSP]:: Required property for ${audienceType} type audience is not available in an object`, 400);
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
      excludes.categories.push(element.excludeCategories);
    }
  });
  return excludes;
};

/**
 * The funciton here is used to generate acccess token using POST call which needs some parameters like clientId, clientSecret which is being
 * taken from destination.Config and JWT token (generated using jwtTokenGenerator).
 * @param {*} destination 
 * @returns 
 */
const getAccessToken = async destination => {
  const {clientId, clientSecret} = destination.Config;
  const accessTokenKey = destination.ID;

  /**
   * The access token expires around every one hour. Cache is used here to check if the access token is present in the cache
   * it is taken from cache else a post call is made to get the access token.
   */
  return ACCESS_TOKEN_CACHE.get(accessTokenKey, async () => {
    const header = {
      alg: "HS256",
      typ: "JWT"
    };

    const data = {
      aud: "https://id.b2b.yahooinc.com/identity/oauth2/access_token?realm=dsp",
      sub: clientId,
      iss: clientId,
      exp: getUnixTimestamp(),
      iat: getUnixTimestamp() + 3600
    };
    const secret = clientSecret;

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
           // Here, generateJWTToken is used to get JWT required for genrating access token.
        client_assertion: generateJWTToken(header, data, secret)
      }),
      method: "POST"
    };
    const response = await httpPOST(request.url, request.data, request.header);
    // If the request fails, throwing error.
    if(response.success === false){
      throw new CustomError(`[Yahoo_DSP]:: access token could not be gnerated due to ${response.response.response.data.error}`,400);
    }
    return response.response?.data?.access_token
  });
};

module.exports = {
  getAccessToken,
  populateIncludes,
  populateExcludes
};
