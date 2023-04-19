const get = require('get-value');
const { httpGET } = require('../../../adapters/network');

const { WhiteListedTraits } = require('../../../constants');

const {
  defaultRequestConfig,
  constructPayload,
  getFieldValueFromMessage,
  isDefinedAndNotNull,
  removeUndefinedValues,
  defaultPostRequestConfig,
  extractCustomFields,
  removeUndefinedAndNullValues,
} = require('../../util');

const { BASE_ENDPOINT, LIST_CONF, MAPPING_CONFIG, CONFIG_CATEGORIES } = require('./config');
const {
  getDynamicErrorType,
  processAxiosResponse,
} = require('../../../adapters/utils/networkUtils');
const { NetworkError } = require('../../util/errorTypes');
const tags = require('../../util/tags');

/**
 * This function is used to check if the user/profile already exists or not, if already exists unique person_id
 * for that user is getting returned else false is returned.
 * Docs: https://developers.klaviyo.com/en/reference/get-profile-id
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const isProfileExist = async (message, { Config }) => {
  const { privateApiKey } = Config;
  const userIdentifiers = {
    email: getFieldValueFromMessage(message, 'email'),
    external_id: getFieldValueFromMessage(message, 'userId'),
    phone_number: getFieldValueFromMessage(message, 'phone'),
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const id in userIdentifiers) {
    if (isDefinedAndNotNull(userIdentifiers[id])) {
      // eslint-disable-next-line no-await-in-loop
      const profileResponse = await httpGET(`${BASE_ENDPOINT}/api/v2/people/search`, {
        header: {
          Accept: 'application/json',
        },
        params: {
          api_key: privateApiKey,
          [id]: userIdentifiers[id],
        },
      });
      const processedProfileResponse = processAxiosResponse(profileResponse);
      if (processedProfileResponse.status === 200 && processedProfileResponse.response?.id) {
        return processedProfileResponse.response.id;
      }
      if (
        !(
          processedProfileResponse.status === 404 &&
          processedProfileResponse?.response.detail ===
            'There is no profile matching the given parameters.'
        )
      ) {
        throw new NetworkError(
          `The lookup call could not be completed with the error:
          ${JSON.stringify(processedProfileResponse.response)}`,
          processedProfileResponse.status,
          {
            [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(processedProfileResponse.status),
          },
          processedProfileResponse,
        );
      }
    }
  }
  return false;
};

/**
 * This function is used for creating response for adding members to a specific list
 * and subscribing members to a particular list depending on the condition passed.
 * DOCS: https://www.klaviyo.com/docs/api/v2/lists
 */
const addUserToList = (message, traitsInfo, conf, destination) => {
  // listId from message properties are preferred over Config listId
  let targetUrl = `${BASE_ENDPOINT}/api/v2/list/${
    traitsInfo.properties?.listId || destination.Config.listId
  }`;
  let profile = {
    id: getFieldValueFromMessage(message, 'userId'),
    email: getFieldValueFromMessage(message, 'email'),
    phone_number: getFieldValueFromMessage(message, 'phone'),
  };
  if (destination.Config.enforceEmailAsPrimary) {
    delete profile.id;
    // eslint-disable-next-line no-underscore-dangle
    profile._id = getFieldValueFromMessage(message, 'userId');
  }
  // If func is called as membership func else subscribe func
  if (conf === LIST_CONF.MEMBERSHIP) {
    targetUrl = `${targetUrl}/members`;
  } else {
    // get consent statuses from message if availabe else from dest config
    targetUrl = `${targetUrl}/subscribe`;
    profile.sms_consent = traitsInfo.properties?.smsConsent || destination.Config.smsConsent;
    profile.$consent = traitsInfo.properties?.consent || destination.Config.consent;
  }
  profile = removeUndefinedValues(profile);
  const payload = {
    profiles: [profile],
  };
  const response = defaultRequestConfig();
  response.endpoint = targetUrl;
  response.method = defaultPostRequestConfig.requestMethod;
  response.params = { api_key: destination.Config.privateApiKey };
  response.headers = {
    'Content-Type': 'application/json',
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);

  return response;
};

/**
 * This function is used to check if the user needs to be added to list or needs to be subscribed or not.
 * Building and returning response array for both the members(for adding to the list) and subscribe
 * endpoints (for subscribing)
 * @param {*} message
 * @param {*} traitsInfo
 * @param {*} destination
 * @returns
 */
const checkForMembersAndSubscribe = (message, traitsInfo, destination) => {
  const responseArray = [];
  if (
    (!!destination.Config.listId || !!get(traitsInfo.properties, 'listId')) &&
    destination.Config.privateApiKey
  ) {
    const membersResponse = addUserToList(message, traitsInfo, LIST_CONF.MEMBERSHIP, destination);
    responseArray.push(membersResponse);
    if (get(traitsInfo.properties, 'subscribe') === true) {
      const subscribeResponse = addUserToList(
        message,
        traitsInfo,
        LIST_CONF.SUBSCRIBE,
        destination,
      );
      responseArray.push(subscribeResponse);
    }
  }

  return responseArray;
};

// This function is used for creating and returning customer properties using mapping json
const createCustomerProperties = (message) => {
  let customerProperties = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
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

module.exports = {
  isProfileExist,
  addUserToList,
  checkForMembersAndSubscribe,
  createCustomerProperties,
};
