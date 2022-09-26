const {
  prepareProxyRequest,
  httpGET,
  httpPOST
} = require("../../../adapters/network");
const { isHttpStatusSuccess } = require("../../util/index");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const ErrorBuilder = require("../../util/error");
const {
  DISABLE_DEST,
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");

const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");

const BASE_ENDPOINT = "https://accounts.snapchat.com/login/oauth2";

const getCode = async (clientId, redirectUri) => {
  const scope = "snapchat-marketing-api";
  const endpoint = `${BASE_ENDPOINT}/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  const requestOptions = {
    client_id: `${clientId}`,
    redirect_uri: `${redirectUri}`,
    response_type: "code",
    scope: `${scope}`
  };
  const response = await httpGET(endpoint, requestOptions);
  return response;
};

const getRefreshToken = async (clientId, clientSecret, refreshToken) => {
  const grantType = "refresh_token";
  const endpoint = `${BASE_ENDPOINT}/access_token`;
  const payload = {
    client_id: `${clientId}`,
    client_secret: `${clientSecret}`,
    grant_type: `${grantType}`,
    refresh_token: `${refreshToken}`
  };
  const response = await httpPOST(endpoint, payload, {});
  return response;
};

const getAccessToken = async (clientId, clientSecret, code, redirectUri) => {
  const grantType = "authorization_code";
  const endpoint = `${BASE_ENDPOINT}/access_token`;
  const payload = {
    client_id: `${clientId}`,
    client_secret: `${clientSecret}`,
    code: `${code}`,
    grant_type: `${grantType}`,
    redirect_uri: `${redirectUri}`
  };
  const response = await httpPOST(endpoint, payload, {});
  return response;
};

/**
 * This function is responsible for making the three steps required for uploding
 * data to customer list.
 * @param {*} request
 * @returns
 */
const scaAudienceProxyRequest = async request => {
  // step1: get code

  // 1. how to get clientId, redirectUri and scope?
  const firstResponse = await getCode(clientId, redirectUri);
  if (
    !firstResponse.success &&
    !isHttpStatusSuccess(firstResponse.response.response.status)
  ) {
    return firstResponse;
  }

  // 2. how to extract code?
  //   const code=firstResponse.code;

  // step2: get access token
  const secondResponse = await getAccessToken(
    clientId,
    clientSecret,
    code,
    redirectUri
  );
  // console.log(JSON.stringify(secondResponse.response.response));
  if (
    !secondResponse.success &&
    !isHttpStatusSuccess(secondResponse.response.response.status)
  ) {
    return secondResponse;
  }

  // 3. how to extract access token, refresh token
  // const accessToken=secondResponse.access_token;
  // const refreshToken=secondResponse.refresh_token;

  // step3: get refresh access token
  const thirdResponse = await getRefreshToken(
    clientId,
    clientSecret,
    refreshToken
  );
  return thirdResponse;
};

/**
 * This function helps to detarmine type of error occured. According to the response
 * we set authErrorCategory to take decision if we need to refresh the access_token
 * or need to disable the destination.
 * @param {*} code
 * @param {*} response
 * @returns
 */
const getAuthErrCategory = (code, response) => {
  switch (code) {
    case 401:
      if (!response.error.details) return REFRESH_TOKEN;
      return "";
    case 403: // Access Denied
      return DISABLE_DEST;
    default:
      return "";
  }
};

const scaAudienceRespHandler = (destResponse, stageMsg) => {
  const { status, response } = destResponse;
  // const respAttributes = response["@attributes"] || null;
  // const { stat, err_code: errorCode } = respAttributes;

  throw new ErrorBuilder()
    .setStatus(status)
    .setDestinationResponse(response)
    .setMessage(
      `snapchat_custom_audience: ${response.error.message} ${stageMsg}`
    )
    .setAuthErrorCategory(getAuthErrCategory(status, response))
    .build();
};

const responseHandler = destinationResponse => {
  const message = `[snapchat_custom_audience Response Handler] - Request Processed Successfully`;
  const { status } = destinationResponse;
  if (isHttpStatusSuccess(status)) {
    // Mostly any error will not have a status of 2xx
    return {
      status,
      message,
      destinationResponse
    };
  }
  // else successfully return status, message and original destination response
  scaAudienceRespHandler(
    destinationResponse,
    "during snapchat_custom_audience response transformation",
    TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM
  );
};

const networkHandler = function() {
  this.proxy = scaAudienceProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.prepareProxy = prepareProxyRequest;
  this.responseHandler = responseHandler;
};
module.exports = { networkHandler };
