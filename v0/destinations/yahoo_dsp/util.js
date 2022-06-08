const qs = require("qs");
const sha256 = require("sha256");
const { generateJWTToken } = require("../../../util/jwtTokenGenerator");
const {  httpPOST } = require("../../../adapters/network");
const { CustomError, isDefinedAndNotNullAndNotEmpty } = require("../../util");

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
let seedList = [];
let outputPayload = {};


/**
 * This function is used to check if there is any common value in keys and poiLocationType array. This is done to check
 * if any of the required location type is present in the input or not. 
 * @param {*} keys
 * @param {*} poiLocationType
 * @returns 
 */
function isCommonElement(keys, poiLocationType) {
  return keys.some(item => poiLocationType.includes(item))
}


/**
 *
 * @param {*} audienceList  - It is the list of audience to be added in the form of array". eg.
 * [
 *   {"email": "abc@email.com"},
 *   {"email": "abc@email.com"},
 *   {"email": "abc@email.com"}
 * ]
 * @param {*} Config
 * @returns The function returns an array of Audience List provided by the user like "email", "deviceId", "ipAddress".
 * eg.[
 * "251014dafc651f68edac7",
 * "afbc34416ac6e7fbb9734",
 * "42cbe7eebb412bbcd5b56",
 * "379b4653a40878da7a584"
 * ]
 */
const populateIdentifiers = (audienceList, Config) => {
  const seedList = [];
  const { audienceType } = Config;
  const { hashRequired } = Config;
  let listType;
  if (isDefinedAndNotNullAndNotEmpty(audienceList)) {
    // traversing through every userTraits in the add array for the traits to be added.
    audienceList.forEach(userTraits => {
      // storing keys of an object inside the add array.
      const keys = Object.keys(userTraits);
      // checking for the audience type the user wants to add is present in the input or not.
      if(!keys.includes(audienceType)){
        // throwing error if the audience type the user wants to add is not present in the input.
        throw new CustomError(
          `[Yahoo_DSP]:: Required property for ${audienceType} type audience is not available in an object`,
          400
        );
      }
      // here, hashing the data if is not hashed and pushing in the seedList array.
      if (hashRequired) {
        seedList.push(sha256(userTraits[audienceType]));
      } else {
        seedList.push(userTraits[audienceType]);
      }
    });
  }
  return seedList;
};

/**
 * This function is used to create the output Payload.
 * @param {*} audienceList - It is the list of audience to be added in the form of array". eg.
 * [
 *   {"email": "abc@email.com"},
 *   {"email": "abc@email.com"},
 *   {"email": "abc@email.com"}
 * ]
 * @param {*} Config 
 * @returns 
 */
const createPayload = (audienceList, Config) => {
  const accountId = Config.accountId;
  let seedList = [];
   // Populating Seed List that conains audience list to be updated
  seedList = populateIdentifiers(audienceList, Config);
  // throwing the error if nothing is present in the seedList
  if (seedList.length === 0) {
    throw new CustomError(
      `[Yahoo_DSP]:: No attributes are present in the '${key}' property.`,
      400
    );
  }
  // Creating outputPayload
  outputPayload = { ...outputPayload, accountId, seedList };
  return outputPayload;
};

/**
 * 
 * @param {*} audienceList - It is the list of audience to be added in the form of array". eg.
 * [
 *   {"email": "abc@email.com"},
 *   {"email": "abc@email.com"},
 *   {"email": "abc@email.com"}
 * ]
 * @param {*} audienceType - it is the type of audience to be updated
 * @returns 
 */
const populateIncludes = (audienceList, audienceType) => {
  audienceList.forEach(userTraits => {
    const keys = Object.keys(userTraits);
    if(!isCommonElement(keys, poiLocationType)){
      throw new CustomError(
        `[Yahoo_DSP]:: Required property for ${audienceType} type audience is not available in an object`,
        400
      );
    }
    if (userTraits.includeChains) {
      if (!includes.chains) {
        includes.chains = [];
      }
      includes.chains.push(userTraits.includeChains);
    }
    if (userTraits.includeWoeids) {
      if (!includes.woeids) {
        includes.woeids = [];
      }
      includes.woeids.push(userTraits.includeWoeids);
    }
    if (userTraits.includeGids) {
      if (!includes.gids) {
        includes.gids = [];
      }
      includes.gids.push(userTraits.includeGids);
    }
    if (userTraits.includeCategories) {
      if (!includes.categories) {
        includes.categories = [];
      }
      includes.categories.push(userTraits.includeCategories);
    }
  });
  return includes;
};

/**
 * 
 * @param {*} audienceList - It is the list of audience to be added in the form of array". eg.
 * [
 *   {"email": "abc@email.com"},
 *   {"email": "abc@email.com"},
 *   {"email": "abc@email.com"}
 * ]
 * @param {*} audienceType - it is the type of audience to be updated
 * @returns 
 */
const populateExcludes = (audienceList, audienceType) => {
  audienceList.forEach(userTraits => {
    const keys = Object.keys(userTraits);
    if(!isCommonElement(keys, poiLocationType)){
      throw new CustomError(
        `[Yahoo_DSP]:: Required property for ${audienceType} type audience is not available in an object`,
        400
      );
    }
    if (userTraits.excludeChains) {
      if (!excludes.chains) {
        excludes.chains = [];
      }
      excludes.chains.push(userTraits.excludeChains);
    }
    if (userTraits.excludeWoeids) {
      if (!excludes.woeids) {
        excludes.woeids = [];
      }
      excludes.woeids.push(userTraits.excludeWoeids);
    }
    if (userTraits.excludeGids) {
      if (!excludes.gids) {
        excludes.gids = [];
      }
      excludes.gids.push(userTraits.excludeGids);
    }
    if (userTraits.excludeCategories) {
      if (!excludes.categories) {
        excludes.categories = [];
      }
      excludes.categories.push(userTraits.excludeCategories);
    }
  });
  return excludes;
};

/**
 * The funciton here is used to generate acccess token using POST call which needs some parameters like clientId, clientSecret which is being
 * taken from destination.Config and JWT token (generated using jwtTokenGenerator which is inside common util folder).
 * @param {*} destination
 * @returns
 */
const getAccessToken = async destination => {
  const { clientId, clientSecret } = destination.Config;
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
    if (response.success === false) {
      throw new CustomError(
        `[Yahoo_DSP]:: access token could not be gnerated due to ${response.response.response.data.error}`,
        400
      );
    }
    return response.response?.data?.access_token;
  });
};

module.exports = {
  getAccessToken,
  populateIncludes,
  populateExcludes,
  createPayload
};
