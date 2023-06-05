/* eslint-disable camelcase */
const _ = require('lodash');
const get = require('get-value');
const stats = require('../../../util/stats');
const { handleHttpRequest } = require('../../../adapters/network');
const {
  getDestinationExternalID,
  getFieldValueFromMessage,
  removeUndefinedAndNullValues,
  isDefinedAndNotNull,
  isDefinedAndNotNullAndNotEmpty,
  defaultRequestConfig,
  isHttpStatusSuccess,
} = require('../../util');
const {
  BRAZE_NON_BILLABLE_ATTRIBUTES,
  CustomAttributeOperationTypes,
  getTrackEndPoint,
} = require('./config');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { isObject } = require('../../util');
const { removeUndefinedValues } = require('../../util');

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

const CustomAttributeOperationUtil = {
  customAttributeUpdateOperation(key, data, traits, mergeObjectsUpdateOperation) {
    data[key] = {};
    const opsResultArray = [];
    for (let i = 0; i < traits[key][CustomAttributeOperationTypes.UPDATE].length; i += 1) {
      const myObj = {
        $identifier_key: traits[key][CustomAttributeOperationTypes.UPDATE][i].identifier,
        $identifier_value:
          traits[key][CustomAttributeOperationTypes.UPDATE][i][
            traits[key][CustomAttributeOperationTypes.UPDATE][i].identifier
          ],
      };

      delete traits[key][CustomAttributeOperationTypes.UPDATE][i][
        traits[key][CustomAttributeOperationTypes.UPDATE][i].identifier
      ];
      delete traits[key][CustomAttributeOperationTypes.UPDATE][i].identifier;
      myObj.$new_object = {};
      Object.keys(traits[key][CustomAttributeOperationTypes.UPDATE][i]).forEach((subKey) => {
        myObj.$new_object[subKey] = traits[key][CustomAttributeOperationTypes.UPDATE][i][subKey];
      });
      opsResultArray.push(myObj);
    }
    // eslint-disable-next-line no-underscore-dangle
    data._merge_objects = isDefinedAndNotNull(mergeObjectsUpdateOperation)
      ? mergeObjectsUpdateOperation
      : false;
    data[key][`$${CustomAttributeOperationTypes.UPDATE}`] = opsResultArray;
  },

  customAttributeRemoveOperation(key, data, traits) {
    const opsResultArray = [];
    for (let i = 0; i < traits[key][CustomAttributeOperationTypes.REMOVE].length; i += 1) {
      const myObj = {
        $identifier_key: traits[key][CustomAttributeOperationTypes.REMOVE][i].identifier,
        $identifier_value:
          traits[key][CustomAttributeOperationTypes.REMOVE][i][
            traits[key][CustomAttributeOperationTypes.REMOVE][i].identifier
          ],
      };
      opsResultArray.push(myObj);
    }
    data[key][`$${CustomAttributeOperationTypes.REMOVE}`] = opsResultArray;
  },

  customAttributeAddOperation(key, data, traits) {
    data[key][`$${CustomAttributeOperationTypes.ADD}`] =
      traits[key][CustomAttributeOperationTypes.ADD];
  },
};

const BrazeDedupUtility = {
  prepareInputForDedup(inputs) {
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
      }
      if (userId) {
        externalIds.push(userId);
      }
      if (anonymousId) {
        aliasIds.push(anonymousId);
      }
    }
    const externalIdsToQuery = Array.from(new Set(externalIds));
    const aliasIdsToQuery = Array.from(new Set(aliasIds));
    return { externalIdsToQuery, aliasIdsToQuery };
  },

  prepareChunksForDedup(externalIdsToQuery, aliasIdsToQuery) {
    const identifiers = [];
    if (externalIdsToQuery.length > 0) {
      externalIdsToQuery.forEach((externalId) => {
        identifiers.push({
          external_id: externalId,
        });
      });
    }
    if (aliasIdsToQuery.length > 0) {
      aliasIdsToQuery.forEach((aliasId) => {
        identifiers.push({
          alias_name: aliasId,
          alias_label: 'rudder_id',
        });
      });
    }
    const identfierChunks = _.chunk(identifiers, 50);
    return identfierChunks;
  },

  async doApiLookup(identfierChunks, destination) {
    return Promise.all(
      identfierChunks.map(async (ids) => {
        const externalIdentifiers = ids.filter((id) => id.external_id);
        const aliasIdentifiers = ids.filter((id) => id.alias_name !== undefined);

        const { processedResponse: lookUpResponse } = await handleHttpRequest(
          'post',
          `${getEndpointFromConfig(destination)}/users/export/ids`,
          {
            external_ids: externalIdentifiers.map((extId) => extId.external_id),
            user_aliases: aliasIdentifiers,
          },
          {
            headers: {
              Authorization: `Bearer ${destination.Config.restApiKey}`,
            },
            timeout: 10 * 1000,
          },
        );
        stats.counter('braze_lookup_failure_count', 1, {
          http_status: lookUpResponse.status,
          destination_id: destination.ID,
        });
        const { users } = lookUpResponse.response;

        return users;
      }),
    );
  },

  /**
   * Looks up multiple users in Braze and returns the user objects
   * uses the external_id field and the alias_name field to lookup users
   *
   * @param {*} inputs router transform input events array
   * @returns {Promise<Array>} array of braze user objects
   */
  async doLookup(inputs) {
    const lookupStartTime = new Date();
    const { destination } = inputs[0];
    const { externalIdsToQuery, aliasIdsToQuery } = this.prepareInputForDedup(inputs);
    const identfierChunks = this.prepareChunksForDedup(externalIdsToQuery, aliasIdsToQuery);
    const chunkedUserData = await this.doApiLookup(identfierChunks, destination);
    stats.timing('braze_lookup_time', lookupStartTime, {
      destination_id: destination.Config.destinationId,
    });
    stats.histogram('braze_lookup_count', chunkedUserData.length, {
      destination_id: destination.Config.destinationId,
    });
    stats.histogram('braze_lookup_user_count', externalIdsToQuery.length + aliasIdsToQuery.length, {
      destination_id: destination.Config.destinationId,
    });
    return _.flatMap(chunkedUserData);
  },

  /**
   * Updates the user store with the user objects
   *
   * @param {*} store
   * @param {*} users
   * @param {*} destinationId
   */
  updateUserStore(store, users, destinationId) {
    if (isDefinedAndNotNull(users) && Array.isArray(users)) {
      users.forEach((user) => {
        if (user?.external_id) {
          stats.counter('braze_user_store_update_count', 1, {
            identifier_type: 'external_id',
            destination_id: destinationId,
          });
          store.set(user.external_id, user);
        } else if (user?.user_aliases) {
          user.user_aliases.forEach((alias) => {
            if (alias.alias_label === 'rudder_id') {
              store.set(alias.alias_name, user);
            }
            stats.counter('braze_user_store_update_count', 1, {
              identifier_type: 'alias_name',
              destination_id: destinationId,
            });
          });
        }
      });
    }
  },

  /**
   * Returns the user object from the store
   * if the user object is not present in the store, it returns undefined
   *
   * @param {*} store
   * @param {*} identifier
   * @returns {Object | undefined} user object from the store
   */
  getUserDataFromStore(store, identifier) {
    return store.get(identifier);
  },

  /**
   * Deduplicates the user object with the user object from the store
   * returns original user object if the user object is not present in the store
   *
   * @param {*} userData
   * @param {*} store
   * @returns {Object} user object with deduplicated custom attributes
   */
  deduplicate(userData, store) {
    const excludeKeys = ['external_id', 'user_alias', 'appboy_id', 'braze_id', 'custom_events'];
    const { external_id, user_alias } = userData;
    let storedUserData =
      this.getUserDataFromStore(store, external_id) ||
      this.getUserDataFromStore(store, user_alias?.alias_name);

    if (!storedUserData) {
      store.set(external_id || user_alias, userData);
      return userData;
    }
    const customAttributes = storedUserData?.custom_attributes;
    storedUserData = { ...storedUserData, ...customAttributes };
    delete storedUserData.custom_attributes;
    let deduplicatedUserData = {};
    const keys = Object.keys(userData)
      .filter((key) => !excludeKeys.includes(key))
      .filter((key) => !BRAZE_NON_BILLABLE_ATTRIBUTES.includes(key))
      .filter((key) => {
        if (isObject(userData[key])) {
          return !(
            Object.keys(userData[key]).includes('$add') ||
            Object.keys(userData[key]).includes('$update') ||
            Object.keys(userData[key]).includes('$remove')
          );
        }
        return true;
      });

    if (keys.length === 0) {
      return null;
    }

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
    return removeUndefinedValues(deduplicatedUserData);
  },
};

/**
 * Deduplicates the user object with the user object from the store
 * returns original user object if the user object is not present in the store
 * if user is duplicate, it returns null
 *
 * @param {*} userStore
 * @param {*} payload
 * @param {*} destinationId
 * @returns
 */
const processDeduplication = (userStore, payload, destinationId) => {
  const dedupedAttributePayload = BrazeDedupUtility.deduplicate(payload, userStore);
  if (
    isDefinedAndNotNullAndNotEmpty(dedupedAttributePayload) &&
    Object.keys(dedupedAttributePayload).some((key) => !['external_id', 'user_alias'].includes(key))
  ) {
    stats.increment('braze_deduped_users_count', { destinationId });
    return dedupedAttributePayload;
  }
  stats.increment('braze_dedup_and_drop_count', { destinationId });
  return null;
};

const processBatch = (transformedEvents) => {
  const { destination } = transformedEvents[0];
  const attributesArray = [];
  const eventsArray = [];
  const purchaseArray = [];
  const successMetadata = [];
  const failureResponses = [];
  for (const transformedEvent of transformedEvents) {
    if (!isHttpStatusSuccess(transformedEvent?.statusCode)) {
      failureResponses.push(transformedEvent);
    } else if (transformedEvent?.batchedRequest?.body?.JSON) {
      const { attributes, events, purchases } = transformedEvent.batchedRequest.body.JSON;
      if (Array.isArray(attributes)) {
        attributesArray.push(...attributes);
      }
      if (Array.isArray(events)) {
        eventsArray.push(...events);
      }
      if (Array.isArray(purchases)) {
        purchaseArray.push(...purchases);
      }
      successMetadata.push(...transformedEvent.metadata);
    }
  }
  const attributeArrayChunks = _.chunk(attributesArray, 75);
  const eventsArrayChunks = _.chunk(eventsArray, 75);
  const purchaseArrayChunks = _.chunk(purchaseArray, 75);

  const maxNumberOfRequest = Math.max(
    attributeArrayChunks.length,
    eventsArrayChunks.length,
    purchaseArrayChunks.length,
  );
  const responseArray = [];
  const headers = {
    'Content-Type': JSON_MIME_TYPE,
    Accept: JSON_MIME_TYPE,
    Authorization: `Bearer ${destination.Config.restApiKey}`,
  };
  const endpoint = getTrackEndPoint(getEndpointFromConfig(destination));
  for (let i = 0; i < maxNumberOfRequest; i += 1) {
    const attributes = attributeArrayChunks[i];
    const events = eventsArrayChunks[i];
    const purchases = purchaseArrayChunks[i];
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.body.JSON = removeUndefinedAndNullValues({
      partner: 'RudderStack',
      attributes,
      events,
      purchases,
    });
    responseArray.push({
      ...response,
      headers,
    });
  }
  const finalResponse = [];
  if (successMetadata.length > 0) {
    finalResponse.push({
      batchedRequest: responseArray,
      metadata: successMetadata,
      batched: true,
      statusCode: 200,
      destination,
    });
  }
  if (failureResponses.length > 0) {
    finalResponse.push(...failureResponses);
  }

  return finalResponse;
};

module.exports = {
  BrazeDedupUtility,
  CustomAttributeOperationUtil,
  getEndpointFromConfig,
  processDeduplication,
  processBatch,
};
