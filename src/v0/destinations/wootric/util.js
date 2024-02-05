const qs = require('qs');
const { InstrumentationError, NetworkError } = require('@rudderstack/integrations-lib');
const { httpGET, httpPOST } = require('../../../adapters/network');
const {
  getDynamicErrorType,
  processAxiosResponse,
} = require('../../../adapters/utils/networkUtils');
const { BASE_ENDPOINT, VERSION, ACCESS_TOKEN_CACHE_TTL_SECONDS } = require('./config');
const { constructPayload, isDefinedAndNotNullAndNotEmpty } = require('../../util');
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require('./config');
const Cache = require('../../util/cache');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');

const ACCESS_TOKEN_CACHE = new Cache(ACCESS_TOKEN_CACHE_TTL_SECONDS);

/**
 * Returns access token using axios call with parameters (username, password, accountToken taken from destination.Config)
 * ref: https://docs.wootric.com/api/#authentication
 * @param {*} destination
 * @returns
 */
const getAccessToken = async (destination) => {
  const { username, password, accountToken } = destination.Config;
  const accessTokenKey = destination.ID;

  /**
   * The access token expires around every 2 hour. Cache is used here to check if the access token is present in the cache
   * it is taken from cache using {destination Id} else a post call is made to get the access token.
   * ref: https://docs.wootric.com/api/#authentication
   */
  return ACCESS_TOKEN_CACHE.get(accessTokenKey, async () => {
    const request = {
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: JSON_MIME_TYPE,
      },
      url: `${BASE_ENDPOINT}/oauth/token?account_token=${accountToken}`,
      data: qs.stringify({
        grant_type: 'password',
        username,
        password,
      }),
      method: 'POST',
    };
    const wootricAuthResponse = await httpPOST(request.url, request.data, request.header, {
      destType: 'wootric',
      feature: 'transformation',
      endpointPath: `/oauth/token`,
    });
    const processedAuthResponse = processAxiosResponse(wootricAuthResponse);
    // If the request fails, throwing error.
    if (processedAuthResponse.status !== 200) {
      throw new NetworkError(
        `Access token could not be generated due to ${JSON.stringify(
          processedAuthResponse.response,
        )}`,
        processedAuthResponse.status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(processedAuthResponse.status),
        },
        processedAuthResponse,
      );
    }
    return processedAuthResponse.response?.access_token;
  });
};

/**
 * Returns wootric user details of existing user using Wootric end user Id (context.externalId.0.id).
 * If context.externalId.0.id is not present in request then Returns wootric user details using Wootric external_id (userId).
 * ref: https://docs.wootric.com/api/#get-a-specific-end-user-by-id
 * ref: https://docs.wootric.com/api/#get-a-specific-end-user-by-external-id
 * @param {*} endUserId
 * @param {*} externalId
 * @param {*} accessToken
 * @returns
 */

const retrieveUserDetails = async (endUserId, externalId, accessToken) => {
  let endpoint;
  if (isDefinedAndNotNullAndNotEmpty(endUserId)) {
    endpoint = `${BASE_ENDPOINT}/${VERSION}/end_users/${endUserId}`;
  } else if (isDefinedAndNotNullAndNotEmpty(externalId)) {
    endpoint = `${BASE_ENDPOINT}/${VERSION}/end_users/${externalId}?lookup_by_external_id=true`;
  } else {
    throw new InstrumentationError(
      'wootricEndUserId/userId are missing. At least one parameter must be provided',
    );
  }

  const requestOptions = {
    headers: {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const userResponse = await httpGET(endpoint, requestOptions, {
    destType: 'wootric',
    feature: 'transformation',
    endpointPath: `/v1/end_users/`,
  });
  const processedUserResponse = processAxiosResponse(userResponse);

  if (processedUserResponse.status === 200) {
    return processedUserResponse.response;
  }

  if (processedUserResponse.status !== 404) {
    throw new NetworkError(
      `Unable to retrieve userId due to ${JSON.stringify(processedUserResponse.response)}`,
      processedUserResponse.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(processedUserResponse.status),
      },
      processedUserResponse,
    );
  }

  // for status code 404 (user not found)
  return null;
};

/**
 * Validates Create User Payload
 * @param {*} email
 * @param {*} phone
 */
const validateCreateUserPayload = (userId, email, phone) => {
  // for creating a user userId is mandatory.
  if (!isDefinedAndNotNullAndNotEmpty(userId)) {
    throw new InstrumentationError('userId is missing');
  }

  if (!isDefinedAndNotNullAndNotEmpty(email) && !isDefinedAndNotNullAndNotEmpty(phone)) {
    throw new InstrumentationError(
      'email/phone number are missing. At least one parameter must be provided',
      400,
    );
  }
};

/**
 * Returns 'Create User' payload
 * @param {*} message
 * @returns
 */
const createUserPayloadBuilder = (message) => {
  const payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_USER.name]);
  const { endpoint } = CONFIG_CATEGORIES.CREATE_USER;
  const method = 'POST';
  validateCreateUserPayload(payload.external_id, payload.email, payload.phone_number);
  return { payload, endpoint, method };
};

/**
 * Builds Payload properties
 * @param {*} payload
 * @param {*} userDetails
 * @returns
 */
const buildPayloadProperties = (payload, userDetails) => {
  // Appending existing user properties with payload properties
  let payloadProperties = {};
  if (
    isDefinedAndNotNullAndNotEmpty(payload.properties) &&
    isDefinedAndNotNullAndNotEmpty(userDetails.properties)
  ) {
    payloadProperties = {
      ...userDetails.properties,
      ...payload.properties,
    };
  }
  return payloadProperties;
};

/**
 * Returns 'Update User' payload
 * @param {*} message
 * @returns
 */
const updateUserPayloadBuilder = (message, userDetails) => {
  const payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.UPDATE_USER.name]);
  payload.properties = buildPayloadProperties(payload, userDetails);
  const { endpoint } = CONFIG_CATEGORIES.UPDATE_USER;
  const method = 'PUT';
  delete payload.external_id;
  return { payload, endpoint, method };
};

/**
 * Validates score
 * @param {*} score
 */
const validateScore = (score) => {
  if (!(score >= 0 && score <= 10)) {
    throw new InstrumentationError('Invalid Score');
  }
};

/**
 * Returns 'Creates Response' payload
 * @param {*} message
 * @returns
 */
const createResponsePayloadBuilder = (message, userDetails) => {
  const payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_RESPONSE.name]);
  payload.properties = buildPayloadProperties(payload, userDetails);
  const { endpoint } = CONFIG_CATEGORIES.CREATE_RESPONSE;
  const method = 'POST';
  validateScore(payload.score);
  return { payload, endpoint, method };
};

/**
 * Returns 'Creates Decline' payload
 * @param {*} message
 * @returns
 */
const createDeclinePayloadBuilder = (message, userDetails) => {
  const payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_DECLINE.name]);
  payload.properties = buildPayloadProperties(payload, userDetails);
  const { endpoint } = CONFIG_CATEGORIES.CREATE_DECLINE;
  const method = 'POST';
  return { payload, endpoint, method };
};

/**
 * Flattens properties field in payload
 * e.g :- properties[name] = Demo User, end_user[properties][revenue_amount] = 5000
 * ref: https://docs.wootric.com/api/#create-end-user
 * ref: https://docs.wootric.com/api/#create-response
 * @param {*} payload
 * @param {*} destKey
 */
const flattenProperties = (payload, destKey) => {
  const rawProperties = {};
  if (isDefinedAndNotNullAndNotEmpty(payload.properties)) {
    Object.entries(payload.properties).forEach(([key, value]) => {
      rawProperties[`${destKey}[${key}]`] = `${value}`;
    });
  }
  return rawProperties;
};

/**
 * Stringy the Identify payload last_surveyed and external_created_at properties.
 * @param {*} payload
 */
const stringifyIdentifyPayloadTimeStamps = (payload) => {
  const rawPayload = { ...payload };
  if (rawPayload.last_surveyed) {
    rawPayload.last_surveyed = `${rawPayload.last_surveyed}`;
  }
  if (rawPayload.external_created_at) {
    rawPayload.external_created_at = `${rawPayload.external_created_at}`;
  }
  return rawPayload;
};

/**
 * Stringy the Track payload created_at property.
 * @param {*} payload
 */
const stringifyTrackPayloadTimeStamps = (payload) => {
  const rawPayload = { ...payload };
  if (rawPayload.created_at) {
    rawPayload.created_at = `${payload.created_at}`;
  }
  return rawPayload;
};

module.exports = {
  getAccessToken,
  retrieveUserDetails,
  flattenProperties,
  stringifyIdentifyPayloadTimeStamps,
  stringifyTrackPayloadTimeStamps,
  createUserPayloadBuilder,
  updateUserPayloadBuilder,
  createResponsePayloadBuilder,
  createDeclinePayloadBuilder,
};
