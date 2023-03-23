const { defaultRequestConfig } = require('rudder-transformer-cdk/build/utils');
const { WhiteListedTraits } = require('../../../constants');

const {
  constructPayload,
  getFieldValueFromMessage,
  defaultPostRequestConfig,
  extractCustomFields,
  removeUndefinedAndNullValues,
  defaultBatchRequestConfig,
} = require('../../util');

const { BASE_ENDPOINT, MAPPING_CONFIG, CONFIG_CATEGORIES } = require('./config');

// /**
//  * This function is used to check if the user/profile already exists or not, if already exists unique person_id
//  * for that user is getting returned else false is returned.
//  * Docs: https://developers.klaviyo.com/en/reference/get-profile-id
//  * @param {*} message
//  * @param {*} Config
//  * @returns
//  */
// const isProfileExist = async (message, { Config }) => {
//   const { privateApiKey } = Config;
//   const userIdentifiers = {
//     email: getFieldValueFromMessage(message, 'email'),
//     external_id: getFieldValueFromMessage(message, 'userId'),
//     phone_number: getFieldValueFromMessage(message, 'phone'),
//   };

//   // eslint-disable-next-line no-restricted-syntax
//   for (const id in userIdentifiers) {
//     if (isDefinedAndNotNull(userIdentifiers[id])) {
//       // eslint-disable-next-line no-await-in-loop
//       const profileResponse = await httpGET(`${BASE_ENDPOINT}/api/v2/people/search`, {
//         header: {
//           Accept: 'application/json',
//         },
//         params: {
//           api_key: privateApiKey,
//           [id]: userIdentifiers[id],
//         },
//       });
//       const processedProfileResponse = processAxiosResponse(profileResponse);
//       if (processedProfileResponse.status === 200 && processedProfileResponse.response?.id) {
//         return processedProfileResponse.response.id;
//       }
//       if (
//         !(
//           processedProfileResponse.status === 404 &&
//           processedProfileResponse?.response.detail ===
//             'There is no profile matching the given parameters.'
//         )
//       ) {
//         throw new NetworkError(
//           `The lookup call could not be completed with the error:
//           ${JSON.stringify(processedProfileResponse.response)}`,
//           processedProfileResponse.status,
//           {
//             [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(processedProfileResponse.status),
//           },
//           processedProfileResponse,
//         );
//       }
//     }
//   }
//   return false;
// };

/**
 * This function is used for creating response for subscribing users to a particular list.
 * DOCS: https://www.klaviyo.com/docs/api/v2/lists
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
  // if (destination.Config.enforceEmailAsPrimary) {
  //   delete profile.id;
  //   // eslint-disable-next-line no-underscore-dangle
  //   profile._id = getFieldValueFromMessage(message, 'userId');
  // }
  if (
    (traitsInfo?.properties?.consent || consent) &&
    Array.isArray(traitsInfo?.properties?.consent)
  ) {
    const subscribeConsent = traitsInfo.properties.consent || consent;
    const channels = {};
    if (subscribeConsent.includes('email')) {
      channels.email.push('MARKETING');
    }
    if (subscribeConsent.includes('sms')) {
      channels.sms.push('MARKETING');
    }
    subscriptionObj.channels = channels;
  }
  const subscriptions = [subscriptionObj];
  if (traitsInfo.properties.listId) {
    listId = traitsInfo.properties.listId;
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
    'Content-Type': 'application/json',
    Accept: 'application/json',
    revision: '2023-02-22',
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);

  return response;
};

/**
 * This function is used to check if the user needs to be subscribed or not.
 * Building and returning response array for subscribe endpoint (for subscribing)
 * @param {*} message
 * @param {*} traitsInfo
 * @param {*} destination
 * @returns
 */
const checkForSubscribe = (message, traitsInfo, destination) => {
  const responseArray = [];
  if (
    (traitsInfo.properties?.listId || destination.Config?.listId) &&
    traitsInfo.properties?.subscribe === true
  ) {
    const subscribeResponse = subscribeUserToList(message, traitsInfo, destination);
    responseArray.push(subscribeResponse);
  }
  return responseArray;
};

// This function is used for creating and returning customer properties using mapping json
const createCustomerProperties = (message) => {
  let customerProperties = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.PROFILE.name],
  );
  // Extract other K-V property from traits about user custom properties
  customerProperties = extractCustomFields(
    message,
    customerProperties,
    ['traits', 'context.traits'],
    WhiteListedTraits,
  );
  customerProperties = removeUndefinedAndNullValues(customerProperties);
  return customerProperties;
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

  const BATCH_ENDPOINT = `${BASE_ENDPOINT}/api/profile-subscription-bulk-create-jobs/`;

  batchEventResponse.batchedRequest[0].endpoint = BATCH_ENDPOINT;

  batchEventResponse.batchedRequest[0].headers = {
    Authorization: `Klaviyo-API-Key ${destination.Config.privateApiKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    revision: '2023-02-22',
  };

  batchEventResponse = {
    ...batchEventResponse,
    metadata,
    destination,
  };
  return batchEventResponse;
};

module.exports = {
  subscribeUserToList,
  checkForSubscribe,
  createCustomerProperties,
  generateBatchedPaylaodForArray,
};
