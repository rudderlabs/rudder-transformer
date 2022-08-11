const qs = require("qs");
const { httpGET, httpPOST } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const {
  BASE_ENDPOINT,
  VERSION,
  ACCESS_TOKEN_CACHE_TTL_SECONDS
} = require("./config");
const {
  CustomError,
  constructPayload,
  isDefinedAndNotNullAndNotEmpty
} = require("../../util");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const Cache = require("../../util/cache");

const ACCESS_TOKEN_CACHE = new Cache(ACCESS_TOKEN_CACHE_TTL_SECONDS);

const getAccessToken = async destination => {
  const { username, password, accountToken } = destination.Config;
  const accessTokenKey = destination.ID;

  return ACCESS_TOKEN_CACHE.get(accessTokenKey, async () => {
    const request = {
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      url: `${BASE_ENDPOINT}/oauth/token?account_token=${accountToken}`,
      data: qs.stringify({
        grant_type: "password",
        username,
        password
      }),
      method: "POST"
    };
    const wootricAuthResponse = await httpPOST(
      request.url,
      request.data,
      request.header
    );
    const processedAuthRespone = processAxiosResponse(wootricAuthResponse);
    // If the request fails, throwing error.
    if (processedAuthRespone.status !== 200) {
      throw new CustomError(
        `[Wootric]:: access token could not be generated due to ${JSON.stringify(
          processedAuthRespone.response
        )}`,
        processedAuthRespone.status
      );
    }
    return processedAuthRespone.response?.access_token;
  });
};

const retrieveUserId = async (userId, destination) => {
  const accessToken = await getAccessToken(destination);
  try {
    const endpoint = `${BASE_ENDPOINT}/${VERSION}/end_users/${userId}?lookup_by_external_id=true`;
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    };

    const userResponse = await httpGET(endpoint, requestOptions);
    const processedUserResponse = processAxiosResponse(userResponse);

    // If the request fails, throwing error.
    if (processedUserResponse.status !== 200) {
      throw new CustomError(
        `[Wootric]:: Unable to retrieve userid due to ${JSON.stringify(
          processedUserResponse.response
        )}`,
        processedUserResponse.status
      );
    }

    return processedUserResponse.response?.id;
  } catch (error) {
    console.debug(`No user found with end user id : ${userId}`);
  }
};

const flattenedPayload = (payload, destKey) => {
  if (payload.properties) {
    Object.entries(payload.properties).forEach(([key, value]) => {
      payload[`${destKey}[${key}]`] = `${value}`;
    });
    delete payload.properties;
  }
};

const validateIdentifyPayload = payload => {
  if (
    !isDefinedAndNotNullAndNotEmpty(payload.email) &&
    !isDefinedAndNotNullAndNotEmpty(payload.phone_number)
  ) {
    throw new CustomError(
      "email/phone number are missing. At least one parameter must be provided",
      400
    );
  }
};

const formatIdentifyPayload = payload => {
  if (payload.last_surveyed) {
    payload.last_surveyed = `${payload.last_surveyed}`;
  }
  if (payload.external_created_at) {
    payload.external_created_at = `${payload.external_created_at}`;
  }
};

const formatTrackPayload = payload => {
  if (payload.created_at) {
    payload.created_at = `${payload.created_at}`;
  }
};

const createUserPayloadBuilder = message => {
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_USER.name]
  );
  const endpoint = CONFIG_CATEGORIES.CREATE_USER.endpoint;
  const method = "POST";
  return { payload, endpoint, method };
};

const updateUserPayloadBuilder = message => {
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.UPDATE_USER.name]
  );
  const endpoint = CONFIG_CATEGORIES.UPDATE_USER.endpoint;
  const method = "PUT";
  return { payload, endpoint, method };
};

const createResponsePayloadBuilder = message => {
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_RESPONSE.name]
  );
  const endpoint = CONFIG_CATEGORIES.CREATE_RESPONSE.endpoint;
  const method = "POST";
  return { payload, endpoint, method };
};

const createDeclinePayloadBuilder = message => {
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_DECLINE.name]
  );
  const endpoint = CONFIG_CATEGORIES.CREATE_DECLINE.endpoint;
  const method = "POST";
  return { payload, endpoint, method };
};

module.exports = {
  getAccessToken,
  retrieveUserId,
  flattenedPayload,
  validateIdentifyPayload,
  formatIdentifyPayload,
  formatTrackPayload,
  createUserPayloadBuilder,
  updateUserPayloadBuilder,
  createResponsePayloadBuilder,
  createDeclinePayloadBuilder
};
