const { defaultRequestConfig } = require('rudder-transformer-cdk/build/utils');
const lodash = require('lodash');
const { WhiteListedTraits } = require('../../../constants');

const {
  constructPayload,
  getFieldValueFromMessage,
  defaultPostRequestConfig,
  extractCustomFields,
  removeUndefinedAndNullValues,
  defaultBatchRequestConfig,
  getSuccessRespEvents,
  defaultPatchRequestConfig,
} = require('../../util');
const tags = require('../../util/tags');
const { handleHttpRequest } = require('../../../adapters/network');
const { JSON_MIME_TYPE, HTTP_STATUS_CODES } = require('../../util/constant');
const { NetworkError, InstrumentationError } = require('../../util/errorTypes');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const { client: errNotificationClient } = require('../../../util/errorNotifier');
const { BASE_ENDPOINT, MAPPING_CONFIG, CONFIG_CATEGORIES, MAX_BATCH_SIZE } = require('./config');

const REVISION_CONSTANT = '2023-02-22';

/**
 * This function calls the create user endpoint ref: https://developers.klaviyo.com/en/reference/create_profile
 * If the user doesn't exist, it creates a profile for the user and return 201 status code and the response which contains all the profile data
 * and profileId.
 * If the user already exists, it return 409 status code and a response which contains the profileId for that existing user, which can be used to
 * update the profile
 * @param {*} endpoint
 * @param {*} payload
 * @param {*} requestOptions
 * @returns
 */
const getIdFromNewOrExistingProfile = async (endpoint, payload, requestOptions) => {
  let response;
  let profileId;
  const endpointPath = '/api/profiles';
  const { processedResponse: resp } = await handleHttpRequest(
    'post',
    endpoint,
    payload,
    requestOptions,
    {
      destType: 'klaviyo',
      feature: 'transformation',
      endpointPath,
    },
  );

  /**
   * 201 - profile is created with updated payload no need to update it again (suppress event with 299 status code)
   * 409 - profile is already exist, it needs to get updated
   */
  if (resp.status === HTTP_STATUS_CODES.CREATED) {
    profileId = resp.response?.data?.id;
    const { data } = resp.response;
    response = { id: data.id, attributes: data.attributes };
  } else if (resp.status === HTTP_STATUS_CODES.CONFLICT) {
    const { errors } = resp.response;
    profileId = errors?.[0]?.meta?.duplicate_profile_id;
  }

  if (profileId) {
    return { profileId, response, statusCode: resp.status };
  }

  let statusCode = resp.status;
  if (resp.status === 201 || resp.status === 409) {
    // retryable error if the profile id is not found in the response
    errNotificationClient.notify(
      new Error('Klaviyo: ProfileId not found'),
      'Profile Id not Found in the response',
      JSON.stringify(resp.response),
    );
    statusCode = 500;
  }

  throw new NetworkError(
    `Failed to create user due to ${JSON.stringify(resp.response)}`,
    statusCode,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(statusCode),
    },
    `${JSON.stringify(resp.response)}`,
  );
};

/**
 * Update profile response builder
 * @param {*} payload
 * @param {*} profileId
 * @param {*} category
 * @param {*} privateApiKey
 * @returns
 */
const profileUpdateResponseBuilder = (payload, profileId, category, privateApiKey) => {
  const updatedPayload = payload;
  const identifyResponse = defaultRequestConfig();
  updatedPayload.data.id = profileId;
  identifyResponse.endpoint = `${BASE_ENDPOINT}${category.apiUrl}/${profileId}`;
  identifyResponse.method = defaultPatchRequestConfig.requestMethod;
  identifyResponse.headers = {
    Authorization: `Klaviyo-API-Key ${privateApiKey}`,
    'Content-Type': JSON_MIME_TYPE,
    Accept: JSON_MIME_TYPE,
    revision: REVISION_CONSTANT,
  };
  identifyResponse.body.JSON = removeUndefinedAndNullValues(payload);
  return identifyResponse;
};

/**
 * This function is used for creating response for subscribing users to a particular list.
 * DOCS: https://developers.klaviyo.com/en/v2023-02-22/reference/subscribe_profiles
 */
const subscribeUserToList = (message, traitsInfo, destination) => {
  // listId from message properties are preferred over Config listId
  const { privateApiKey, consent } = destination.Config;
  let { listId } = destination.Config;
  const targetUrl = `${BASE_ENDPOINT}/api/profile-subscription-bulk-create-jobs`;
  const subscriptionObj = {
    email: getFieldValueFromMessage(message, 'email'),
    phone_number: getFieldValueFromMessage(message, 'phone'),
  };

  if (traitsInfo?.properties?.consent || consent) {
    const subscribeConsent = traitsInfo?.properties?.consent || consent;
    const channels = {};

    let subscribeConsentArr = subscribeConsent;
    if (!Array.isArray(subscribeConsentArr)) {
      subscribeConsentArr = [subscribeConsent];
    }

    if (subscribeConsentArr.includes('email')) {
      channels.email = ['MARKETING'];
    }
    if (subscribeConsentArr.includes('sms')) {
      channels.sms = ['MARKETING'];
    }
    subscriptionObj.channels = channels;
  }
  const subscriptions = [removeUndefinedAndNullValues(subscriptionObj)];
  if (traitsInfo?.properties?.listId) {
    listId = traitsInfo.properties.listId;
  }
  if (message.type === 'group') {
    listId = message.groupId;
  }
  const attributes = {
    list_id: listId,
    subscriptions,
  };
  const data = {
    type: 'profile-subscription-bulk-create-job',
    attributes,
  };
  const payload = { data };
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = targetUrl;
  response.headers = {
    Authorization: `Klaviyo-API-Key ${privateApiKey}`,
    'Content-Type': JSON_MIME_TYPE,
    Accept: JSON_MIME_TYPE,
    revision: REVISION_CONSTANT,
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);

  return response;
};

// This function is used for creating and returning customer properties using mapping json
const createCustomerProperties = (message, Config) => {
  const { enforceEmailAsPrimary } = Config;
  let customerProperties = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.PROFILE.name],
  );
  if (!enforceEmailAsPrimary) {
    customerProperties.$id = getFieldValueFromMessage(message, 'userId');
  } else {
    if (!customerProperties.$email && !customerProperties.$phone_number) {
      throw new InstrumentationError('None of email and phone are present in the payload');
    }
    customerProperties = {
      ...customerProperties,
      _id: getFieldValueFromMessage(message, 'userId'),
    };
  }
  customerProperties = removeUndefinedAndNullValues(customerProperties);
  return customerProperties;
};

const populateCustomFieldsFromTraits = (message) => {
  // Extract other K-V property from traits about user custom properties
  let customProperties = {};
  customProperties = extractCustomFields(
    message,
    customProperties,
    ['traits', 'context.traits'],
    WhiteListedTraits,
  );
  return customProperties;
};

const generateBatchedPaylaodForArray = (events) => {
  let batchEventResponse = defaultBatchRequestConfig();
  const batchResponseList = [];
  const metadata = [];
  // extracting destination from the first event in a batch
  const { destination } = events[0];
  // Batch event into dest batch structure
  events.forEach((ev, index) => {
    if (index === 0) {
      batchResponseList.push(ev.message.body.JSON);
    } else {
      batchResponseList[0].data.attributes.subscriptions.push(
        ...ev.message.body.JSON.data.attributes.subscriptions,
      );
    }
    metadata.push(ev.metadata);
  });

  batchEventResponse.batchedRequest = Object.values(batchEventResponse);
  batchEventResponse.batchedRequest[0].body.JSON = {
    data: batchResponseList[0].data,
  };

  const BATCH_ENDPOINT = `${BASE_ENDPOINT}/api/profile-subscription-bulk-create-jobs`;

  batchEventResponse.batchedRequest[0].endpoint = BATCH_ENDPOINT;

  batchEventResponse.batchedRequest[0].headers = {
    Authorization: `Klaviyo-API-Key ${destination.Config.privateApiKey}`,
    'Content-Type': JSON_MIME_TYPE,
    Accept: JSON_MIME_TYPE,
    revision: REVISION_CONSTANT,
  };

  batchEventResponse = {
    ...batchEventResponse,
    metadata,
    destination,
  };
  return batchEventResponse;
};

/**
 * It takes list of subscribe responses and groups them on the basis of listId
 * @param {*} subscribeResponseList
 * @returns
 */
const groupSubscribeResponsesUsingListId = (subscribeResponseList) => {
  const subscribeEventGroups = lodash.groupBy(
    subscribeResponseList,
    (event) => event.message.body.JSON.data.attributes.list_id,
  );
  return subscribeEventGroups;
};

const getBatchedResponseList = (subscribeEventGroups, identifyResponseList) => {
  let batchedResponseList = [];
  Object.keys(subscribeEventGroups).forEach((listId) => {
    // eventChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
    const eventChunks = lodash.chunk(subscribeEventGroups[listId], MAX_BATCH_SIZE);
    const batchedResponse = eventChunks.map((chunk) => {
      const batchEventResponse = generateBatchedPaylaodForArray(chunk);
      return getSuccessRespEvents(
        batchEventResponse.batchedRequest,
        batchEventResponse.metadata,
        batchEventResponse.destination,
        true,
      );
    });
    batchedResponseList = [...batchedResponseList, ...batchedResponse];
  });

  if (identifyResponseList.length > 0) {
    identifyResponseList.forEach((response) => {
      batchedResponseList[0].batchedRequest.push(response);
    });
  }

  return batchedResponseList;
};

const batchSubscribeEvents = (subscribeRespList) => {
  const identifyResponseList = [];
  subscribeRespList.forEach((event) => {
    const processedEvent = event;
    // for group and identify events (it will contain only subscribe response)
    if (processedEvent.message.length === 2) {
      // the array will contain one update profile reponse and one subscribe reponse
      identifyResponseList.push(event.message[0]);
      [processedEvent.message] = event.message.slice(1);
    } else {
      // for group events (it will contain only subscribe response)
      [processedEvent.message] = event.message.slice(0);
    }
  });

  const subscribeEventGroups = groupSubscribeResponsesUsingListId(subscribeRespList);

  const batchedResponseList = getBatchedResponseList(subscribeEventGroups, identifyResponseList);

  return batchedResponseList;
};

module.exports = {
  subscribeUserToList,
  createCustomerProperties,
  populateCustomFieldsFromTraits,
  generateBatchedPaylaodForArray,
  batchSubscribeEvents,
  profileUpdateResponseBuilder,
  getIdFromNewOrExistingProfile,
};
