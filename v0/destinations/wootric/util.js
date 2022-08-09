const qs = require("qs");
const { httpGET, httpPOST } = require("../../../adapters/network");
const {
  BASE_ENDPOINT,
  VERSION,
  ACCESS_TOKEN_CACHE_TTL_SECONDS
} = require("./config");
const { CustomError } = require("../../util");
const axios = require("axios");
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
    // If the request fails, throwing error.
    if (wootricAuthResponse.success === false) {
      throw new CustomError(
        `[Wootric]:: access token could not be generated due to ${wootricAuthResponse.response.data.error}`,
        400
      );
    }
    return wootricAuthResponse.response?.data?.access_token;
  });
};

const retrieveUserId = async (userId, destination) => {
  try {
    const accessToken = await getAccessToken(destination);
    if (!accessToken) {
      throw new CustomError(`[Wootric]:: access token is not available`, 400);
    }

    const endpoint = `${BASE_ENDPOINT}/${VERSION}/end_users/${userId}?lookup_by_external_id=true`;
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    };

    const userResponse = await httpGET(endpoint, requestOptions);
    // If the request fails, throwing error.
    if (userResponse.success === false) {
      throw new CustomError(
        `[Wootric]:: Unable to retrieve userid due to ${userResponse.response
          ?.data?.error ?? "unkown error"}`,
        400
      );
    }

    return userResponse.response?.data?.id;
  } catch (error) {
    console.debug(`No user found with end user id : ${userId}`);
  }
};

module.exports = { getAccessToken, retrieveUserId };
