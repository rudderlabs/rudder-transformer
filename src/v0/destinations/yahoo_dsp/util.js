const qs = require("qs");
const sha256 = require("sha256");
const { generateJWTToken } = require("../../../util/jwtTokenGenerator");
const { httpPOST } = require("../../../adapters/network");
const { isDefinedAndNotNullAndNotEmpty } = require("../../util");
const { getDynamicErrorType } = require("../../../adapters/utils/networkUtils");
const {
  ACCESS_TOKEN_CACHE_TTL,
  AUDIENCE_ATTRIBUTE,
  DSP_SUPPORTED_OPERATION
} = require("./config.js");
const Cache = require("../../util/cache");
const { InstrumentationError, NetworkError } = require("../../util/errorTypes");
const tags = require("../../util/tags");

const ACCESS_TOKEN_CACHE = new Cache(ACCESS_TOKEN_CACHE_TTL);

const getUnixTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};

/**
 *
 * @param {*} audienceList  - It is the list of audience to be added in the form of array". eg.
 * [
 *   {"email": "abc@email.com"},
 *   {"email": "abc@email.com"},
 *   {"email": "abc@email.com"}
 * ]
 * @param {*} Config
 * @returns The function returns a hashed array of Audience List provided by the user like "email", "deviceId", "ipAddress".
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
  const audienceAttribute = AUDIENCE_ATTRIBUTE[audienceType];

  if (isDefinedAndNotNullAndNotEmpty(audienceList)) {
    // traversing through every userTraits in the add array for the traits to be added.
    audienceList.forEach(userTraits => {
      // storing keys of an object inside the add array.
      const traits = Object.keys(userTraits);
      // checking for the audience type the user wants to add is present in the input or not.
      if (!traits.includes(audienceAttribute)) {
        // throwing error if the audience type the user wants to add is not present in the input.
        throw new InstrumentationError(
          `Required property for ${audienceAttribute} type audience is not available in an object`
        );
      }
      // here, hashing the data if is not hashed and pushing in the seedList array.
      if (hashRequired) {
        seedList.push(sha256(userTraits[audienceAttribute]));
      } else {
        seedList.push(userTraits[audienceAttribute]);
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
 * @returns {*} a created payload {dspListPayload) object updated with the required data
 */
const createPayload = (audienceList, Config) => {
  let dspListPayload = {};
  let seedList = [];
  const { accountId } = Config;

  // Populating Seed List that conains audience list to be updated
  seedList = populateIdentifiers(audienceList, Config);
  // throwing the error if nothing is present in the seedList
  if (seedList.length === 0) {
    throw new InstrumentationError(
      `No attributes are present in the '${DSP_SUPPORTED_OPERATION}' property`
    );
  }
  // Creating dspListPayload
  dspListPayload = { accountId, seedList };
  return dspListPayload;
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
   * Reference - https://developer.yahooinc.com/dsp/api/docs/authentication/vmdn-auth-overview.html#:~:text=the%20success%20message.-,Generate%20the%20Access%20Token,-%C2%B6
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
      exp: getUnixTimestamp() + 3600,
      iat: getUnixTimestamp()
    };

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
        client_assertion: generateJWTToken(header, data, clientSecret)
      }),
      method: "POST"
    };
    const dspAuthorisationData = await httpPOST(
      request.url,
      request.data,
      request.header
    );
    // If the request fails, throwing error.
    if (dspAuthorisationData.success === false) {
      const status = dspAuthorisationData?.response?.status || 400;
      throw new NetworkError(
        `Access token could not be gnerated due to ${dspAuthorisationData.response.data.error}`,
        status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status)
        },
        dspAuthorisationData
      );
    }
    return dspAuthorisationData.response?.data?.access_token;
  });
};

module.exports = {
  getAccessToken,
  createPayload
};
