/* eslint-disable @typescript-eslint/naming-convention */
const sha256 = require('sha256');
const AmazonAdsFormatter = require('amazon-dsp-formatter');
const lodash = require('lodash');
const { ConfigurationError, OAuthSecretError } = require('@rudderstack/integrations-lib');
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  getSuccessRespEvents,
  removeUndefinedAndNullAndEmptyValues,
  getAccessToken,
} = require('../../util');

const buildResponseWithUsers = (users, action, config, jobIdList, secret) => {
  const { audienceId } = config;
  if (!audienceId) {
    throw new ConfigurationError('[AMAZON AUDIENCE]: Audience Id not found');
  }
  getAccessToken({ secret }, 'accessToken');
  if (!secret?.clientId) {
    throw new OAuthSecretError(
      'OAuth - Client Id not found. This might be a platform issue. Please contact RudderStack support for assistance.',
    );
  }
  const jobIdHash = sha256(String(jobIdList));
  const externalId = `Rudderstack_${jobIdHash}`;
  const response = defaultRequestConfig();
  response.endpoint = '';
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    'Amazon-Advertising-API-ClientId': `${secret.clientId}`,
    'Content-Type': 'application/json',
    Authorization: `Bearer ${secret.accessToken}`,
  };
  response.body.JSON = {
    createUsers: {
      records: [
        {
          hashedRecords: users,
          externalId,
        },
      ],
    },
    associateUsers: {
      patches: [
        {
          op: action,
          path: `/EXTERNAL_USER_ID-${externalId}/audiences`,
          value: [audienceId],
        },
      ],
    },
  };
  return response;
};

/**
 * This function groups the response list based upon `operation`
 * @param {*} respList
 * @returns object
 */
const groupResponsesUsingOperation = (respList) => {
  const eventGroups = lodash.groupBy(respList, (item) => item.message.action);
  return eventGroups;
};

/**
 * Input: [{
    message: {
      users: {}
      action
    },
  },
  metadata,
  destination,
}]
 * @param {*} responseList 
 */
const batchEvents = (responseList, destination) => {
  const { secret } = responseList[0].metadata;
  const eventGroups = groupResponsesUsingOperation(responseList);
  const respList = [];
  const opList = ['remove', 'add'];
  opList.forEach((op) => {
    if (eventGroups?.[op]) {
      const { userList, jobIdList, metadataList } = eventGroups[op].reduce(
        (acc, event) => ({
          userList: acc.userList.concat(event.message.user),
          jobIdList: acc.jobIdList.concat(event.metadata.jobId),
          metadataList: acc.metadataList.concat(event.metadata),
        }),
        { userList: [], metadataList: [], jobIdList: [] },
      );
      respList.push(
        getSuccessRespEvents(
          buildResponseWithUsers(
            userList,
            op,
            destination.config || destination.Config,
            jobIdList,
            secret,
          ),
          metadataList,
          destination,
          true,
        ),
      );
    }
  });
  return respList;
};

/**
 * This function fetches the user details and
 * hash them after normalizing if enable hash is turned on in config
 * @param {*} fields
 * @param {*} config
 * @returns
 */
const getUserDetails = (fields, config) => {
  const { enableHash } = config;
  const {
    email,
    phone: phone_number,
    firstName,
    lastName,
    address,
    country,
    city,
    state,
    postalCode,
  } = fields;
  if (!enableHash) {
    return removeUndefinedAndNullAndEmptyValues({
      email,
      phone: phone_number,
      firstName,
      lastName,
      address,
      country,
      city,
      state,
      postalCode,
    });
  }
  // Since all fields are optional hence notusing formatRecord function from formatter but doing it for every parameter
  const formatter = new AmazonAdsFormatter();
  const user = {
    email: sha256(formatter.formatEmail(email)),
    firstName: sha256(formatter.formatName(firstName)),
    lastName: sha256(formatter.formatName(lastName)),
    city: sha256(formatter.formatCity(city)),
    state: sha256(formatter.formatState(state, country)),
    postalCode: sha256(formatter.formatPostal(postalCode)),
  };
  // formating guidelines https://advertising.amazon.com/help/GCCXMZYCK4RXWS6C
  if (country) {
    const country_code = formatter.formatCountry(country);
    user.country = sha256(country_code);
    if (phone_number) {
      user.phone = sha256(formatter.formatPhone(phone_number, country_code));
    }
  }
  if (address) {
    const formatted_address =
      address
        ?.normalize('NFD')
        ?.replace(/[\u0300-\u036f]/g, '')
        ?.trim()
        ?.toLowerCase()
        .replace(/[^\dA-Za-z]/g, '') || undefined;
    user.address = sha256(formatter.formatAddress(formatted_address, country));
  }
  return removeUndefinedAndNullAndEmptyValues(user);
};

module.exports = { batchEvents, getUserDetails, buildResponseWithUsers };
