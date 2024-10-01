/* eslint-disable @typescript-eslint/naming-convention */
const sha256 = require('sha256');
const path = require('path');
const fs = require('fs');
const { phone } = require('phone');
const lodash = require('lodash');
const { ConfigurationError, OAuthSecretError } = require('@rudderstack/integrations-lib');
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  getSuccessRespEvents,
  removeUndefinedAndNullAndEmptyValues,
  isDefinedAndNotNull,
} = require('../../util');

const buildResponseWithUsers = (users, action, config, jobIdList, secret) => {
  const { audienceId } = config;
  if (!audienceId) {
    throw new ConfigurationError('[AMAZON AUDIENCE]: Audience Id not found');
  }
  if (!secret?.accessToken) {
    throw new OAuthSecretError('OAuth - access token not found');
  }
  if (!secret?.clientId) {
    throw new OAuthSecretError('OAuth - Client Id not found');
  }
  const externalId = `Rudderstack_${sha256(`${jobIdList}`)}`;
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
    city,
    state,
    postalCode,
  } = fields;
  const user = {};
  // formating guidelines https://advertising.amazon.com/help/GCCXMZYCK4RXWS6C
  // using undefined as fallback so in case properties are not string
  if (email) {
    const em =
      email
        ?.replace(/[^\d.@A-Za-z-]/g, '')
        ?.trim()
        ?.toLowerCase() || undefined;
    user.email = enableHash ? sha256(em) : em;
  }
  if (phone_number) {
    const updated_phone_number = phone(phone_number);
    if (updated_phone_number.isValid) {
      user.phone = enableHash
        ? sha256(updated_phone_number.phoneNumber)
        : updated_phone_number.phoneNumber;
    }
  }
  if (state) {
    const st = getState(state);
    user.state = enableHash ? sha256(st) : st;
  }
  if (city) {
    const ct =
      city
        ?.replace(/[^\dA-Za-z]/g, '')
        ?.trim()
        ?.toLowerCase() || undefined;
    user.city = enableHash ? sha256(ct) : ct;
  }
  if (firstName) {
    const fn =
      firstName
        ?.replace(/[^\dA-Za-z]/g, '')
        ?.trim()
        ?.toLowerCase() || undefined;
    user.firstName = enableHash ? sha256(fn) : fn;
  }
  if (lastName) {
    const ln =
      lastName
        ?.replace(/[^\dA-Za-z]/g, '')
        ?.trim()
        ?.toLowerCase() || undefined;
    user.lastName = enableHash ? sha256(ln) : ln;
  }
  if (address) {
    const add = getAddress(address);
    user.address = enableHash ? sha256(add) : add;
  }
  if (postalCode) {
    const zip =
      postalCode
        ?.replace(/[^\dA-Za-z]/g, '')
        ?.trim()
        ?.toLowerCase()
        ?.substring(0, postalCode.length - 4) || undefined;
    user.postalCode = enableHash ? sha256(zip) : zip;
  }

  return removeUndefinedAndNullAndEmptyValues(user);
};

/* removing extra whitespaces, non alphanumeric char, accents and 
doing lowercasing of the result string
*/
const getAddress = (add) => {
  const address =
    add
      ?.normalize('NFD')
      ?.replace(/[\u0300-\u036f]/g, '')
      ?.trim()
      ?.toLowerCase()
      .replace(/[^\dA-Za-z]/g, '') || undefined;
  if (!isDefinedAndNotNull(address)) return undefined;
  const addressKeys = address.split(',');
  const addressMap = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, './data/addressMap.json'), 'utf-8'),
  );
  let updated_address = '';
  addressKeys.forEach((key) => {
    updated_address += addressMap[key] || key;
  });
  return updated_address;
};

/* removing extra whitespaces, non alphanumeric char, accents and 
doing lowercasing of the result string
*/
const getState = (st) => {
  const state =
    st
      ?.replace(/[^\dA-Za-z]/g, '')
      ?.trim()
      ?.toLowerCase() || undefined;
  if (!isDefinedAndNotNull(state)) return undefined;
  const stateMap = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, './data/statesMap.json'), 'utf-8'),
  );
  return stateMap[state] || state;
};
module.exports = { batchEvents, getUserDetails, buildResponseWithUsers };
