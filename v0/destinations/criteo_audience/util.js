const { CustomError, isDefinedAndNotNullAndNotEmpty } = require("../../util");

const { ACCESS_TOKEN_CACHE_TTL } = require("./config.js");

const Cache = require("../../util/cache");
const { httpPOST, getFormData } = require("../../../adapters/network");

const ACCESS_TOKEN_CACHE = new Cache(ACCESS_TOKEN_CACHE_TTL);

const getAccessToken = async destination => {
  const { clientId, clientSecret } = destination.Config;
  const accessTokenKey = destination.ID;

  /**
   * The access token expires around every one hour. Cache is used here to check if the access token is present in the cache
   * it is taken from cache else a post call is made to get the access token.
   * Reference - https://developer.yahooinc.com/dsp/api/docs/authentication/vmdn-auth-overview.html#:~:text=the%20success%20message.-,Generate%20the%20Access%20Token,-%C2%B6
   */
  return ACCESS_TOKEN_CACHE.get(accessTokenKey, async () => {
    const formData = getFormData({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials"
    });
    const request = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      url: "https://api.criteo.com/oauth2/token"
    };
    const criteoAuthorizationResponse = await httpPOST(
      request.url,
      formData,
      request.headers
    );
    // If the request fails, throwing error.
    if (criteoAuthorizationResponse.success === false) {
      throw new CustomError(
        `[Criteo_Audience]:: access token could not be gnerated due to ${criteoAuthorizationResponse.response.data.error}`,
        400
      );
    }
    return {
      value: criteoAuthorizationResponse.response?.data?.access_token,
      age: criteoAuthorizationResponse.response?.data?.expires_in
    };
  });
};

const populateIdentifiers = (audienceList, audienceType) => {
  const identifiers = [];
  audienceList.forEach(userTraits => {
    const traits = Object.keys(userTraits);
    if (!traits.includes(audienceType)) {
      throw new CustomError(
        `[Criteo_Audience]:: Required property for ${audienceType} type audience is not available in an object`,
        400
      );
    }
    identifiers.push(userTraits[audienceType]);
  });
  return identifiers;
};

const populateAttributes = (audienceList, operationType, Config) => {
  const { audienceType, gumCallerId } = Config;
  const attributes = {};
  attributes.operation = operationType;
  attributes.identifierType = audienceType;
  attributes.identifiers = populateIdentifiers(audienceList, audienceType);
  attributes.internalIdentifiers = false;
  if (audienceType === "gum") {
    if (!isDefinedAndNotNullAndNotEmpty(gumCallerId)) {
      throw new CustomError(
        `[Criteo_Audience]:: gumCallerId is required for audience type ${audienceType}`,
        400
      );
    } else {
      attributes.gumCallerId = gumCallerId;
    }
  }
  return attributes;
};

const populateData = (audienceList, operationType, Config) => {
  const data = {};
  data.type = "ContactlistAmendment";
  data.attributes = populateAttributes(audienceList, operationType, Config);
  return data;
};

const preparePayload = (audienceList, operationType, Config) => {
  const payload = {};
  payload.data = populateData(audienceList, operationType, Config);
  return payload;
};

module.exports = {
  getAccessToken,
  preparePayload
};
