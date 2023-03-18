/* eslint-disable camelcase */
const _ = require('lodash');
const get = require('get-value');
const { httpPOST } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const {
  getDestinationExternalID,
  getFieldValueFromMessage,
  removeUndefinedAndNullValues,
} = require('../../util');
const { BRAZE_NON_BILLABLE_ATTRIBUTES } = require('./config');

const getEndpointFromConfig = (destination) => {
  // Init -- mostly for test cases
  let endpoint = 'https://rest.fra-01.braze.eu';

  // Ref: https://www.braze.com/docs/user_guide/administrative/access_braze/braze_instances
  if (destination.Config.dataCenter) {
    const dataCenterArr = destination.Config.dataCenter.trim().split('-');
    if (dataCenterArr[0].toLowerCase() === 'eu') {
      endpoint = `https://rest.fra-${dataCenterArr[1]}.braze.eu`;
    } else {
      endpoint = `https://rest.iad-${dataCenterArr[1]}.braze.com`;
    }
  }
  return endpoint;
};

const BrazeDedupUtility = {
  async doLookup(inputs) {
    const externalIds = [];
    const aliasIds = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const input of inputs) {
      const { message } = input;
      const brazeExternalId = getDestinationExternalID(message, 'brazeExternalId');
      const userId = getFieldValueFromMessage(message, 'userIdOnly');
      const anonymousId = get(message, 'anonymousId');
      if (brazeExternalId) {
        externalIds.push(brazeExternalId);
      } else if (userId) {
        externalIds.push(userId);
      } else if (anonymousId) {
        aliasIds.push(anonymousId);
      }
    }

    const lookUpResponse = await httpPOST(
      `${getEndpointFromConfig(inputs[0].destination)}/users/export/ids`,
      {
        external_ids: externalIds,
        user_aliases: aliasIds.map((aliasId) => ({
          alias_name: aliasId,
          alias_label: 'rudder_id',
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${inputs[0].destination.Config.restApiKey}`,
        },
      },
    );
    const processedLookUpResponse = processAxiosResponse(lookUpResponse);
    const { users } = processedLookUpResponse.response;

    return users;
  },

  enrichUserStore(users, store) {
    users?.forEach((user) => {
      if (user.external_id) {
        store.set(user.external_id, user);
      } else if (user.user_aliases) {
        user.user_aliases.forEach((alias) => {
          if (alias.alias_label === 'rudder_id') {
            store.set(alias.alias_name, user);
          }
        });
      }
    });
  },

  getUserDataFromStore(inputUserData, store) {
    const { external_id, user_alias } = inputUserData;
    let storedUserData;
    if (external_id) {
      storedUserData = store.get(external_id);
    } else if (user_alias) {
      const rudderIdAlias = user_alias.alias_name;
      storedUserData = store.get(rudderIdAlias.alias_name);
    }
    return storedUserData;
  },

  deduplicate(userData, store) {
    const excludeKeys = ['external_id', 'user_alias', 'appboy_id', 'braze_id', 'custom_events'];
    let storedUserData = this.getUserDataFromStore(userData, store);
    if (storedUserData) {
      const customAttributes = storedUserData?.custom_attributes;
      storedUserData = { ...storedUserData, ...customAttributes };
      delete storedUserData.custom_attributes;
      const { external_id, user_alias } = userData;
      let deduplicatedUserData = {};
      const keys = Object.keys(userData)
        .filter((key) => !excludeKeys.includes(key))
        .filter((key) => !BRAZE_NON_BILLABLE_ATTRIBUTES.includes(key))
        .filter(
          (key) =>
            !(
              Object.keys(userData[key]).includes('$add') ||
              Object.keys(userData[key]).includes('$update') ||
              Object.keys(userData[key]).includes('$remove')
            ),
        );

      keys.forEach((key) => {
        if (!_.isEqual(userData[key], storedUserData[key])) {
          deduplicatedUserData[key] = userData[key];
        }
      });

      if (Object.keys(deduplicatedUserData).length === 0) {
        return null;
      }
      deduplicatedUserData = {
        ...deduplicatedUserData,
        external_id,
        user_alias,
      };
      const identifier = external_id || user_alias.alias_name;
      store.set(identifier, { ...storedUserData, ...deduplicatedUserData });
      return removeUndefinedAndNullValues(deduplicatedUserData);
    }
    return userData;
  },
};

module.exports = {
  getEndpointFromConfig,
  BrazeDedupUtility,
};
