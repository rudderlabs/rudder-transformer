const { httpPOST } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');

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

class BrazeDedupUtility {
  static doLookup(inputs) {
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

    const lookUpResponse = httpPOST(
      `${getEndpointFromConfig(inputs[0].destination.Config)}/users/lookup/external_ids`,
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
    const { users } = processedLookUpResponse;

    return users;
  }

  static enrichUserStore(users, store) {
    users.forEach((user) => {
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
  }

  static getUserDataFromStore(inputUserData, store) {
    const { external_id, user_alias } = inputUserData;
    let storedUserData;
    if (external_id) {
      storedUserData = store.get(external_id);
    } else {
      const rudderIdAlias = user_alias.find((alias) => alias.alias_label === 'rudder_id');
      storedUserData = store.get(rudderIdAlias.alias_name);
    }
    return storedUserData;
  }

  static deduplicate(userData, store) {
    const storedUserData = this.getUserDataFromStore(userData, store);
    const { external_id, user_alias } = userData;
    let deduplicatedUserData = {};
    if (storedUserData) {
      Object.keys(userData)
        .filter((key) => key !== 'external_id' || key !== 'user_alias')
        .forEach((key) => {
          if (userData[key] !== storedUserData[key]) {
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
      const identifier =
        external_id || user_alias.find((alias) => alias.alias_label === 'rudder_id').alias_name;
      store.set(identifier, { ...storedUserData, ...deduplicatedUserData });
      return deduplicatedUserData;
    } else {
      return userData;
    }
  }
}

module.exports = {
  getEndpointFromConfig,
  BrazeDedupUtility,
};
