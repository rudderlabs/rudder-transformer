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

const retrieveUserId = async (userId, accessToken) => {
  const endpoint = `${BASE_ENDPOINT}/${VERSION}/end_users/${userId}?lookup_by_external_id=true`;
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    }
  };

  const userResponse = await httpGET(endpoint, requestOptions);
  const processedUserResponse = processAxiosResponse(userResponse);

  if (processedUserResponse.status === 200) {
    return processedUserResponse.response?.id;
  }

  if (processedUserResponse.status !== 404) {
    throw new CustomError(
      `[Wootric]:: Unable to retrieve userid due to ${JSON.stringify(
        processedUserResponse.response
      )}`,
      processedUserResponse.status
    );
  }
};

const userLookupByEmail = async (email, accessToken) => {
  if (isDefinedAndNotNullAndNotEmpty(email)) {
    const endpoint = `${BASE_ENDPOINT}/${VERSION}/end_users/${email}?lookup_by_email=true`;
    return await userLookupResponseBuilder(endpoint, accessToken);
  }
};

const userLookupByPhone = async (phone, accessToken) => {
  if (isDefinedAndNotNullAndNotEmpty(phone)) {
    const endpoint = `${BASE_ENDPOINT}/${VERSION}/end_users/phone_number/${phone}`;
    return await userLookupResponseBuilder(endpoint, accessToken);
  }
};

const userLookupResponseBuilder = async (endpoint, accessToken) => {
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    }
  };
  const lookupResponse = await httpGET(endpoint, requestOptions);
  return processAxiosResponse(lookupResponse);
};

const createUserPayloadBuilder = message => {
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_USER.name]
  );
  const endpoint = CONFIG_CATEGORIES.CREATE_USER.endpoint;
  const method = "POST";
  validateEmailAndPhone(payload.email, payload.phone_number);
  return { payload, endpoint, method };
};

const updateUserPayloadBuilder = message => {
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.UPDATE_USER.name]
  );
  const endpoint = CONFIG_CATEGORIES.UPDATE_USER.endpoint;
  const method = "PUT";
  delete payload.external_id;
  return { payload, endpoint, method };
};

const createResponsePayloadBuilder = message => {
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_RESPONSE.name]
  );
  const endpoint = CONFIG_CATEGORIES.CREATE_RESPONSE.endpoint;
  const method = "POST";
  validateScore(payload.score);
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

const flattenPayload = (payload, destKey) => {
  if (payload.properties) {
    Object.entries(payload.properties).forEach(([key, value]) => {
      payload[`${destKey}[${key}]`] = `${value}`;
    });
    delete payload.properties;
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

const validateEmailAndPhone = (email, phone) => {
  if (
    !isDefinedAndNotNullAndNotEmpty(email) &&
    !isDefinedAndNotNullAndNotEmpty(phone)
  ) {
    throw new CustomError(
      "email/phone number are missing. At least one parameter must be provided",
      400
    );
  }
};

const checkExistingEmailAndPhone = async (
  email,
  phone,
  external_id,
  accessToken
) => {
  let lookupResponse;
  lookupResponse = await userLookupByEmail(email, accessToken);
  if (
    lookupResponse?.status === 200 &&
    lookupResponse?.response?.external_id !== external_id
  ) {
    throw new CustomError("Email has already been taken", 400);
  }
  lookupResponse = await userLookupByPhone(phone, accessToken);

  if (
    lookupResponse?.status === 200 &&
    lookupResponse?.response?.external_id !== external_id
  ) {
    throw new CustomError("Phone number has already been taken", 400);
  }
};

const validateScore = score => {
  if (!(score >= 0 && score <= 10)) {
    throw new CustomError("Invalid Score", 400);
  }
};

module.exports = {
  getAccessToken,
  retrieveUserId,
  flattenPayload,
  formatIdentifyPayload,
  formatTrackPayload,
  createUserPayloadBuilder,
  updateUserPayloadBuilder,
  createResponsePayloadBuilder,
  createDeclinePayloadBuilder,
  checkExistingEmailAndPhone
};
