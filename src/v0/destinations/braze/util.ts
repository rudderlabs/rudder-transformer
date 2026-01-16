/* eslint-disable no-param-reassign, @typescript-eslint/naming-convention */
import _ from 'lodash';
import get from 'get-value';
import { InstrumentationError, isDefined } from '@rudderstack/integrations-lib';
import logger from '../../../logger';
import stats from '../../../util/stats';
import { handleHttpRequest } from '../../../adapters/network';
import {
  getDestinationExternalID,
  getFieldValueFromMessage,
  removeUndefinedAndNullValues,
  isDefinedAndNotNull,
  isDefinedAndNotNullAndNotEmpty,
  defaultRequestConfig,
  isHttpStatusSuccess,
  isObject,
  removeUndefinedValues,
  getIntegrationsObj,
} from '../../util';
import {
  BRAZE_NON_BILLABLE_ATTRIBUTES,
  TRACK_BRAZE_MAX_EXTERNAL_ID_COUNT,
  CustomAttributeOperationTypes,
  getTrackEndPoint,
  getSubscriptionGroupEndPoint,
  getAliasMergeEndPoint,
  SUBSCRIPTION_BRAZE_MAX_REQ_COUNT,
  ALIAS_BRAZE_MAX_REQ_COUNT,
  TRACK_BRAZE_MAX_REQ_COUNT,
  BRAZE_PURCHASE_STANDARD_PROPERTIES,
  DESTINATION,
} from './config';
import { JSON_MIME_TYPE, HTTP_STATUS_CODES } from '../../util/constant';
import {
  BrazeDestination,
  BrazeRouterRequest,
  BrazeBatchHeaders,
  BrazeTransformedEvent,
  BrazeBatchResponse,
  BrazeBatchRequest,
  BrazeSubscriptionGroup,
  BrazeAliasToIdentify,
  BrazeUserExportResponse,
  BrazeUser,
  BrazeUserAttributes,
} from './types';
import type { Metadata } from '../../../types';

const formatGender = (gender: unknown) => {
  if (typeof gender !== 'string') {
    return null;
  }

  // few possible cases of woman
  if (['woman', 'female', 'w', 'f'].includes(gender.toLowerCase())) {
    return 'F';
  }

  // few possible cases of man
  if (['man', 'male', 'm'].includes(gender.toLowerCase())) {
    return 'M';
  }

  // few possible cases of other
  if (['other', 'o'].includes(gender.toLowerCase())) {
    return 'O';
  }

  return null;
};

const getEndpointFromConfig = (destination: BrazeDestination) => {
  if (!destination.Config?.dataCenter || typeof destination.Config.dataCenter !== 'string') {
    throw new InstrumentationError('Invalid Data Center: valid values are EU, US, AU');
  }

  // Ref: https://www.braze.com/docs/user_guide/administrative/access_braze/braze_instances
  const [dataCenterRegion, dataCenterNumber] = destination.Config.dataCenter
    .trim()
    .toLowerCase()
    .split('-');

  switch (dataCenterRegion) {
    case 'eu':
      return `https://rest.fra-${dataCenterNumber}.braze.eu`;
    case 'us':
      return `https://rest.iad-${dataCenterNumber}.braze.com`;
    case 'au':
      return `https://rest.au-${dataCenterNumber}.braze.com`;
    default:
      throw new InstrumentationError(
        `Invalid Data Center: ${destination.Config.dataCenter}, valid values are EU, US, AU`,
      );
  }
};

// Merges external_ids, emails, and phones for entries with the same subscription_group_id and subscription_state
const combineSubscriptionGroups = (subscriptionGroups: BrazeSubscriptionGroup[]) => {
  const uniqueGroups: Record<string, BrazeSubscriptionGroup> = {};

  subscriptionGroups.forEach((group) => {
    const key = `${group.subscription_group_id}-${group.subscription_state}`;
    if (!uniqueGroups[key]) {
      uniqueGroups[key] = {
        ...group,
        external_ids: [...(group.external_ids || [])],
        emails: [...(group.emails || [])],
        phones: [...(group.phones || [])],
      };
    } else {
      const ug = uniqueGroups[key];
      ug.external_ids?.push(...(group.external_ids || []));
      ug.emails?.push(...(group.emails || []));
      ug.phones?.push(...(group.phones || []));
    }
  });

  return Object.values(uniqueGroups).map((group) => {
    const result: Record<string, unknown> = {
      subscription_group_id: group.subscription_group_id,
      subscription_state: group.subscription_state,
    };
    if (group.emails?.length) {
      result.emails = [...new Set(group.emails)];
    }
    if (group.phones?.length) {
      result.phones = [...new Set(group.phones)];
    }
    if (group.external_ids?.length) {
      result.external_ids = [...new Set(group.external_ids)];
    }
    return result;
  });
};

const CustomAttributeOperationUtil = {
  customAttributeUpdateOperation(
    key: string,
    data: Record<string, unknown>,
    traits: unknown,
    mergeObjectsUpdateOperation: unknown,
  ) {
    data[key] = {};
    const t = traits as Record<string, unknown>;
    const updateArray = t[key]?.[CustomAttributeOperationTypes.UPDATE] as unknown[];
    const opsResultArray: unknown[] = [];
    for (const arrayItem of updateArray) {
      const item = arrayItem as Record<string, unknown>;
      const myObj: Record<string, unknown> = {
        $identifier_key: item.identifier,
        $identifier_value: item[item.identifier as string],
      };

      delete item[item.identifier as string];
      delete item.identifier;
      myObj.$new_object = {};
      Object.keys(item).forEach((subKey) => {
        (myObj.$new_object as Record<string, unknown>)[subKey] = item[subKey];
      });
      opsResultArray.push(myObj);
    }
    // eslint-disable-next-line no-underscore-dangle
    data._merge_objects = isDefinedAndNotNull(mergeObjectsUpdateOperation)
      ? mergeObjectsUpdateOperation
      : false;
    (data[key] as Record<string, unknown>)[`$${CustomAttributeOperationTypes.UPDATE}`] =
      opsResultArray;
  },

  customAttributeRemoveOperation(key: string, data: Record<string, unknown>, traits: unknown) {
    const t = traits as Record<string, unknown>;
    const removeArray = t[key]?.[CustomAttributeOperationTypes.REMOVE] as unknown[];
    const opsResultArray: unknown[] = [];
    for (const arrayItem of removeArray) {
      const item = arrayItem as Record<string, unknown>;
      const myObj: Record<string, unknown> = {
        $identifier_key: item.identifier,
        $identifier_value: item[item.identifier as string],
      };
      opsResultArray.push(myObj);
    }
    (data[key] as Record<string, unknown>)[`$${CustomAttributeOperationTypes.REMOVE}`] =
      opsResultArray;
  },

  customAttributeAddOperation(
    key: string,
    data: Record<string, unknown>,
    traits: Record<string, unknown>,
  ) {
    (data[key] as Record<string, unknown>)[`$${CustomAttributeOperationTypes.ADD}`] =
      traits[key]?.[CustomAttributeOperationTypes.ADD];
  },
};

const BrazeDedupUtility = {
  prepareInputForDedup(inputs: BrazeRouterRequest[]) {
    const externalIds: string[] = [];
    const aliasIds: string[] = [];
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

  prepareChunksForDedup(externalIdsToQuery: string[], aliasIdsToQuery: string[]) {
    const identifiers: BrazeAliasToIdentify[] = [];
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
  getFieldsToExport() {
    return [
      'created_at',
      'custom_attributes',
      'dob',
      'email',
      'first_name',
      'gender',
      'home_city',
      'last_name',
      'phone',
      'time_zone',
      'external_id',
      'user_aliases',
      // 'country' and 'language' not needed because it is not billable so we don't use it
    ];
  },
  async doApiLookup(
    identfierChunks: BrazeAliasToIdentify[][],
    context: { destination: BrazeDestination; metadata: Record<string, unknown> },
  ): Promise<
    Array<{
      users: BrazeUser[];
      failedIdentifiers: string[];
    }>
  > {
    const { destination, metadata } = context;
    return Promise.all(
      identfierChunks.map(async (ids) => {
        const externalIdentifiers = ids.filter((id) => id.external_id);
        const aliasIdentifiers = ids.filter((id) => id.alias_name !== undefined);
        const fieldsToExport = this.getFieldsToExport();
        const { processedResponse: lookUpResponse } = await handleHttpRequest(
          'post',
          `${getEndpointFromConfig(destination)}/users/export/ids`,
          {
            external_ids: externalIdentifiers.map((extId) => extId.external_id),
            user_aliases: aliasIdentifiers,
            fields_to_export: fieldsToExport,
          },
          {
            headers: {
              Authorization: `Bearer ${destination.Config.restApiKey}`,
            },
            timeout: 10 * 1000,
          },
          {
            destType: 'braze',
            feature: 'transformation',
            requestMethod: 'POST',
            module: 'router',
            endpointPath: '/users/export/ids',
            metadata,
          },
        );

        // Track failed lookups and collect failed identifiers for non-2xx responses
        if (!isHttpStatusSuccess(lookUpResponse.status)) {
          // Collect failed identifiers (external_ids and alias_names)
          const failedIdentifiers = [
            ...externalIdentifiers.map((id) => id.external_id),
            ...aliasIdentifiers.map((id) => id.alias_name),
          ].filter((id): id is string => id !== undefined);
          stats.histogram('braze_lookup_failure_identifiers', failedIdentifiers.length, {
            http_status: lookUpResponse.status,
            destination_id: destination.ID,
          });
          return { users: [], failedIdentifiers };
        }
        stats.histogram(
          'braze_lookup_success_identifiers',
          externalIdentifiers.length + aliasIdentifiers.length,
          {
            destination_id: destination.ID,
          },
        );
        const { users } = lookUpResponse.response as BrazeUserExportResponse;
        return { users: users || [], failedIdentifiers: [] };
      }),
    );
  },

  /**
   * Looks up multiple users in Braze and returns the user objects
   * uses the external_id field and the alias_name field to lookup users
   *
   * @param {*} inputs router transform input events array
   * @returns {Promise<{users: Array, failedIdentifiers: Set}>} object containing user objects and failed identifiers
   */
  async doLookup(
    inputs: BrazeRouterRequest[],
  ): Promise<{ users: BrazeUser[]; failedIdentifiers: Set<string> }> {
    const lookupStartTime = new Date();
    const { destination, metadata } = inputs[0];
    const { externalIdsToQuery, aliasIdsToQuery } = this.prepareInputForDedup(inputs);
    const identfierChunks: BrazeAliasToIdentify[][] = this.prepareChunksForDedup(
      externalIdsToQuery,
      aliasIdsToQuery,
    );
    const chunkedResults = await this.doApiLookup(identfierChunks, { destination, metadata });

    // Collect all users and failed identifiers from all chunks
    const allUsers: BrazeUser[] = [];
    const failedIdentifiers = new Set<string>();
    chunkedResults.forEach((result) => {
      if (result.users) {
        allUsers.push(...result.users);
      }
      if (result.failedIdentifiers) {
        result.failedIdentifiers.forEach((id: string) => failedIdentifiers.add(id));
      }
    });

    stats.timing('braze_lookup_time', lookupStartTime, {
      destination_id: destination.ID,
    });
    stats.histogram('braze_lookup_count', chunkedResults.length, {
      destination_id: destination.ID,
    });
    stats.histogram('braze_lookup_user_count', externalIdsToQuery.length + aliasIdsToQuery.length, {
      destination_id: destination.ID,
    });
    return { users: allUsers, failedIdentifiers };
  },

  /**
   * Updates the user store with the user objects
   *
   * @param store - Map storing user data by identifier
   * @param users - Array of Braze users from API response
   * @param destinationId - Destination ID for stats tracking
   */
  updateUserStore(store: Map<string, BrazeUser>, users: BrazeUser[], destinationId: string) {
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
            if (alias.alias_label === 'rudder_id' && alias.alias_name) {
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
   * @param store - Map storing user data by identifier
   * @param identifier - User identifier (external_id or alias_name)
   * @returns User object from the store or undefined
   */
  getUserDataFromStore(store: Map<string, unknown>, identifier: unknown) {
    return store.get(identifier as string);
  },

  /**
   * Deduplicates the user object with the user object from the store
   * returns original user object if the user object is not present in the store
   *
   * @param userData - User attributes to deduplicate
   * @param store - Map storing user data by identifier
   * @returns Deduplicated user object or null if no changes
   */
  deduplicate(userData: unknown, store: Map<string, unknown>) {
    const excludeKeys = new Set([
      'external_id',
      'user_alias',
      'appboy_id',
      'braze_id',
      'custom_events',
    ]);
    const ud = userData as {
      external_id?: string;
      user_alias?: { alias_name?: string };
      [key: string]: unknown;
    };
    const { external_id, user_alias } = ud;
    let storedUserData =
      this.getUserDataFromStore(store, external_id) ||
      this.getUserDataFromStore(store, user_alias?.alias_name);

    if (!storedUserData) {
      store.set((external_id || user_alias) as string, userData);
      return userData;
    }
    const customAttributes = (storedUserData as { custom_attributes?: unknown }).custom_attributes;
    storedUserData = { ...(storedUserData as object), ...(customAttributes as object) };
    delete (storedUserData as { custom_attributes?: unknown }).custom_attributes;
    let deduplicatedUserData: Record<string, unknown> = {};
    const keys = Object.keys(ud)
      .filter((key) => !excludeKeys.has(key))
      .filter((key) => !BRAZE_NON_BILLABLE_ATTRIBUTES.includes(key))
      .filter((key) => {
        if (isObject(ud[key])) {
          return !(
            Object.keys(ud[key] as object).includes('$add') ||
            Object.keys(ud[key] as object).includes('$update') ||
            Object.keys(ud[key] as object).includes('$remove')
          );
        }
        return true;
      });

    if (keys.length > 0) {
      keys.forEach((key) => {
        const sud = storedUserData as Record<string, unknown>;
        // ref: https://www.braze.com/docs/user_guide/data_and_analytics/custom_data/custom_attributes/#adding-descriptions
        // null is a valid value in braze for unsetting, so we need to compare the values only if the key is present in the stored user data
        // in case of keys having null values only compare if the key is present in the stored user data
        if (ud[key] === null) {
          if (isDefinedAndNotNull(sud[key])) {
            deduplicatedUserData[key] = ud[key];
          }
        } else if (!_.isEqual(ud[key], sud[key])) {
          deduplicatedUserData[key] = ud[key];
        }
      });
    }

    // add non billable attributes back to the deduplicated user object
    BRAZE_NON_BILLABLE_ATTRIBUTES.forEach((key) => {
      if (isDefined(ud[key])) {
        deduplicatedUserData[key] = ud[key];
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
    const identifier = external_id || user_alias?.alias_name;
    store.set(identifier as string, { ...(storedUserData as object), ...deduplicatedUserData });

    return removeUndefinedValues(deduplicatedUserData) as BrazeUserAttributes;
  },
};

/**
 * Deduplicates the user object with the user object from the store
 * returns original user object if the user object is not present in the store
 * if user is duplicate, it returns null
 *
 * @param userStore - Map storing user data by identifier
 * @param payload - User attributes payload to deduplicate
 * @param destinationId - Destination ID for stats tracking
 * @param failedLookupIdentifiers - Set of identifiers that failed to lookup due to API failure
 * @returns Deduplicated payload or null if duplicate
 */
const processDeduplication = (
  userStore: Map<string, unknown>,
  payload: unknown,
  destinationId: string,
  failedLookupIdentifiers: Set<string>,
) => {
  // Check if this event's identifier failed to lookup due to API failure
  const p = payload as {
    external_id?: string;
    user_alias?: { alias_name?: string };
  };
  const identifier = p.external_id || p.user_alias?.alias_name;
  if (failedLookupIdentifiers && identifier && failedLookupIdentifiers.has(identifier)) {
    stats.increment('braze_dedup_skipped_due_to_lookup_failure_count', {
      destination_id: destinationId,
    });
  }

  const dedupedAttributePayload = BrazeDedupUtility.deduplicate(payload, userStore);
  if (
    isDefinedAndNotNullAndNotEmpty(dedupedAttributePayload) &&
    Object.keys(dedupedAttributePayload as object).some(
      (key) => !['external_id', 'user_alias'].includes(key),
    )
  ) {
    stats.increment('braze_deduped_users_count', { destination_id: destinationId });
    return dedupedAttributePayload;
  }
  stats.increment('braze_dedup_and_drop_count', { destination_id: destinationId });
  return null;
};

function prepareGroupAndAliasBatch(
  arrayChunks: unknown[][],
  responseArray: unknown[],
  destination: BrazeDestination,
  type: string,
) {
  const headers = {
    'Content-Type': JSON_MIME_TYPE,
    Accept: JSON_MIME_TYPE,
    Authorization: `Bearer ${destination.Config.restApiKey}`,
  };

  for (const chunk of arrayChunks) {
    const response = defaultRequestConfig();
    if (type === 'merge') {
      const { endpoint, path } = getAliasMergeEndPoint(getEndpointFromConfig(destination));
      response.endpoint = endpoint;
      response.endpointPath = path;
      const merge_updates = chunk;
      response.body.JSON = removeUndefinedAndNullValues({
        merge_updates,
      });
    } else if (type === 'subscription') {
      const { endpoint, path } = getSubscriptionGroupEndPoint(getEndpointFromConfig(destination));
      response.endpoint = endpoint;
      response.endpointPath = path;
      const subscription_groups = chunk as BrazeSubscriptionGroup[];
      // maketool transformed event
      logger.info(`braze subscription chunk ${JSON.stringify(subscription_groups)}`);

      stats.gauge('braze_batch_subscription_size', subscription_groups.length, {
        destination_id: destination.ID,
      });

      // Deduplicate the subscription groups before constructing the response body
      const deduplicatedSubscriptionGroups = combineSubscriptionGroups(subscription_groups);

      stats.gauge('braze_batch_subscription_combined_size', deduplicatedSubscriptionGroups.length, {
        destination_id: destination.ID,
      });

      response.body.JSON = removeUndefinedAndNullValues({
        subscription_groups: deduplicatedSubscriptionGroups,
      });
    }
    responseArray.push({
      ...response,
      headers,
    });
  }
}

const createTrackChunk = () => ({
  attributes: [] as unknown[],
  events: [] as unknown[],
  purchases: [] as unknown[],
  externalIds: new Set<string>(),
});

const batchForTrackAPI = (
  attributesArray: unknown[],
  eventsArray: unknown[],
  purchasesArray: unknown[],
) => {
  const allItems: { data: unknown; type: string; externalId: string }[] = [];
  const maxLength = Math.max(attributesArray.length, eventsArray.length, purchasesArray.length);

  const addItem = (item: unknown, type: string) => {
    if (item) {
      allItems.push({
        data: item,
        type,
        externalId: (item as { external_id: string }).external_id,
      });
    }
  };

  const canAddToChunk = (
    item: { type: string; externalId: string },
    chunk: {
      externalIds: Set<string>;
      attributes: unknown[];
      events: unknown[];
      purchases: unknown[];
    },
  ) => {
    const { type, externalId } = item;
    return (
      (chunk.externalIds.has(externalId) ||
        chunk.externalIds.size < TRACK_BRAZE_MAX_EXTERNAL_ID_COUNT) &&
      chunk[type].length < TRACK_BRAZE_MAX_REQ_COUNT
    );
  };

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < maxLength; i++) {
    addItem(attributesArray[i], 'attributes');
    addItem(eventsArray[i], 'events');
    addItem(purchasesArray[i], 'purchases');
  }
  const sortedItems = _.sortBy(allItems, 'externalId');
  let currentChunk = createTrackChunk();
  const trackChunks: ReturnType<typeof createTrackChunk>[] = [];
  for (const item of sortedItems) {
    if (canAddToChunk(item, currentChunk)) {
      currentChunk[item.type].push(item.data);
      currentChunk.externalIds.add(item.externalId);
    } else {
      trackChunks.push(currentChunk);
      currentChunk = createTrackChunk();
      currentChunk[item.type].push(item.data);
      currentChunk.externalIds.add(item.externalId);
    }
  }
  if (currentChunk.externalIds.size > 0) {
    trackChunks.push(currentChunk);
  }
  return trackChunks;
};

const cleanTrackChunk = (chunk: {
  attributes: unknown[];
  events: unknown[];
  purchases: unknown[];
}) => {
  const { attributes, events, purchases } = chunk;
  const cleanChunk: Record<string, unknown> = {};
  if (attributes.length > 0) {
    cleanChunk.attributes = attributes;
  }
  if (events.length > 0) {
    cleanChunk.events = events;
  }
  if (purchases.length > 0) {
    cleanChunk.purchases = purchases;
  }
  return cleanChunk;
};

const addTrackStats = (
  chunk: { attributes?: unknown[]; events?: unknown[]; purchases?: unknown[] },
  destination: BrazeDestination,
) => {
  const { attributes, events, purchases } = chunk;
  if (attributes) {
    stats.histogram('braze_batch_attributes_pack_size', attributes.length, {
      destination_id: destination.ID,
    });
  }
  if (events) {
    stats.histogram('braze_batch_events_pack_size', events.length, {
      destination_id: destination.ID,
    });
  }
  if (purchases) {
    stats.histogram('braze_batch_purchase_pack_size', purchases.length, {
      destination_id: destination.ID,
    });
  }
};

const processBatch = (transformedEvents: BrazeTransformedEvent[]) => {
  const { destination } = transformedEvents[0];
  const dest = destination;
  const attributesArray: unknown[] = [];
  const eventsArray: unknown[] = [];
  const purchaseArray: unknown[] = [];
  const successMetadata: Partial<Metadata>[] = [];
  const failureResponses: BrazeTransformedEvent[] = [];
  const filteredResponses: BrazeTransformedEvent[] = [];
  const subscriptionsArray: unknown[] = [];
  const mergeUsersArray: unknown[] = [];
  for (const transformedEvent of transformedEvents) {
    if (!isHttpStatusSuccess(transformedEvent.statusCode)) {
      failureResponses.push(transformedEvent);
    } else if (transformedEvent.statusCode === HTTP_STATUS_CODES.FILTER_EVENTS) {
      filteredResponses.push(transformedEvent);
    } else if (transformedEvent.batchedRequest?.body?.JSON) {
      const { attributes, events, purchases, subscription_groups, merge_updates } =
        transformedEvent.batchedRequest.body.JSON;
      if (Array.isArray(attributes)) {
        attributesArray.push(...attributes);
      }
      if (Array.isArray(events)) {
        eventsArray.push(...events);
      }
      if (Array.isArray(purchases)) {
        purchaseArray.push(...purchases);
      }

      if (Array.isArray(subscription_groups)) {
        subscriptionsArray.push(...subscription_groups);
      }

      if (Array.isArray(merge_updates)) {
        mergeUsersArray.push(...merge_updates);
      }

      if (transformedEvent.metadata) {
        successMetadata.push(...transformedEvent.metadata);
      }
    }
  }
  const trackChunks = batchForTrackAPI(attributesArray, eventsArray, purchaseArray);
  const subscriptionArrayChunks = _.chunk(subscriptionsArray, SUBSCRIPTION_BRAZE_MAX_REQ_COUNT);
  const mergeUsersArrayChunks = _.chunk(mergeUsersArray, ALIAS_BRAZE_MAX_REQ_COUNT);

  const responseArray: BrazeBatchRequest[] = [];
  const finalResponse: BrazeBatchResponse[] = [];
  const headers: BrazeBatchHeaders = {
    'Content-Type': JSON_MIME_TYPE,
    Accept: JSON_MIME_TYPE,
    Authorization: `Bearer ${dest.Config.restApiKey}`,
  };

  const { endpoint, path } = getTrackEndPoint(getEndpointFromConfig(destination));
  for (const chunk of trackChunks) {
    const cleanedChunk = cleanTrackChunk(chunk);
    const { attributes, events, purchases } = cleanedChunk;
    addTrackStats(chunk, destination);

    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.endpointPath = path;
    response.body.JSON = {
      partner: 'RudderStack',
      attributes,
      events,
      purchases,
    };
    responseArray.push({
      ...response,
      headers,
    });
  }

  prepareGroupAndAliasBatch(subscriptionArrayChunks, responseArray, destination, 'subscription');
  prepareGroupAndAliasBatch(mergeUsersArrayChunks, responseArray, destination, 'merge');

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

  if (filteredResponses.length > 0) {
    finalResponse.push(...filteredResponses);
  }

  return finalResponse;
};

/**
 *
 * @param {*} payload
 * @param {*} message
 * @returns payload along with appId that is supposed to be passed by the user via
 * integrations object.
 * format will be as below:
 *  "integrations": {
                "All": true,
                "braze": {
                    "appId": "123"
                }
            }
    Ref: https://www.braze.com/docs/api/identifier_types/?tab=app%20ids
 */
const addAppId = (payload: unknown, message: unknown) => {
  const integrationsObj = getIntegrationsObj(message, DESTINATION.toUpperCase() as any);
  if (integrationsObj?.appId) {
    const { appId: appIdValue } = integrationsObj;
    return {
      ...(payload as object),
      app_id: String(appIdValue),
    };
  }
  return { ...(payload as object) };
};

function setExternalId(payload: unknown, message: unknown) {
  const p = payload as Record<string, unknown>;
  const externalId =
    getDestinationExternalID(message, 'brazeExternalId') || (message as { userId?: string }).userId;
  if (externalId) {
    p.external_id = externalId;
  }
  return p;
}

function setAliasObject(payload: unknown, message: unknown) {
  const p = payload as Record<string, unknown>;
  const integrationsObj = getIntegrationsObj(message, DESTINATION.toUpperCase() as any);
  if (
    isDefinedAndNotNull(integrationsObj?.alias?.alias_name) &&
    isDefinedAndNotNull(integrationsObj?.alias?.alias_label)
  ) {
    const { alias_name, alias_label } = integrationsObj.alias;
    p.user_alias = {
      alias_name,
      alias_label,
    };
  } else if ((message as { anonymousId?: string }).anonymousId) {
    p.user_alias = {
      alias_name: (message as { anonymousId: string }).anonymousId,
      alias_label: 'rudder_id',
    };
  }
  return p;
}

function setExternalIdOrAliasObject(payload: unknown, message: unknown) {
  const userId = getFieldValueFromMessage(message, 'userIdOnly');
  if (userId || getDestinationExternalID(message, 'brazeExternalId')) {
    return setExternalId(payload, message);
  }

  // eslint-disable-next-line no-underscore-dangle
  (payload as Record<string, unknown>)._update_existing_only = false;
  return setAliasObject(payload, message);
}

function addMandatoryPurchaseProperties(
  productId: string,
  price: number,
  currencyCode: string,
  quantity: number,
  timestamp: unknown,
) {
  return {
    product_id: productId,
    price,
    currency: currencyCode,
    quantity,
    time: timestamp,
  };
}

function getPurchaseObjs(message: unknown, config: unknown) {
  // ref:https://www.braze.com/docs/api/objects_filters/purchase_object/
  const validateForPurchaseEvent = () => {
    const m = message as { properties?: unknown };
    const { properties } = m;
    const timestamp = getFieldValueFromMessage(message, 'timestamp');
    if (!properties) {
      throw new InstrumentationError(
        'Invalid Order Completed event: Properties object is missing in the message',
      );
    }
    const { currency: currencyCode } = properties as { currency?: string };
    let { products } = properties as { products?: unknown[] };
    if (!products) {
      throw new InstrumentationError(
        'Invalid Order Completed event: Products array is missing in the message',
      );
    }

    if (!Array.isArray(products)) {
      throw new InstrumentationError('Invalid Order Completed event: Products is not an array');
    }

    products = products.filter((product) => isDefinedAndNotNull(product));
    if (products.length === 0) {
      throw new InstrumentationError('Invalid Order Completed event: Products array is empty');
    }

    if (!timestamp) {
      throw new InstrumentationError(
        'Invalid Order Completed event: Timestamp is missing in the message',
      );
    }

    products.forEach((product) => {
      const p = product as {
        product_id?: unknown;
        sku?: unknown;
        price?: unknown;
        quantity?: unknown;
        currency?: unknown;
      };
      const productId = p.product_id || p.sku;
      const { price, quantity, currency: prodCurrencyCode } = p;
      if (!isDefinedAndNotNull(productId)) {
        throw new InstrumentationError(
          `Invalid Order Completed event: Product Id is missing for product at index: ${products.indexOf(
            product,
          )}`,
        );
      }
      if (!isDefinedAndNotNull(price)) {
        throw new InstrumentationError(
          `Invalid Order Completed event: Price is missing for product at index: ${products.indexOf(
            product,
          )}`,
        );
      }
      if (Number.isNaN(price)) {
        throw new InstrumentationError(
          `Invalid Order Completed event: Price is not a number for product at index: ${products.indexOf(
            product,
          )}`,
        );
      }
      if (!isDefinedAndNotNull(quantity)) {
        throw new InstrumentationError(
          `Invalid Order Completed event: Quantity is missing for product at index: ${products.indexOf(
            product,
          )}`,
        );
      }
      if (Number.isNaN(quantity)) {
        throw new InstrumentationError(
          `Invalid Order Completed event: Quantity is not a number for product at index: ${products.indexOf(
            product,
          )}`,
        );
      }
      if (!isDefinedAndNotNull(currencyCode) && !isDefinedAndNotNull(prodCurrencyCode)) {
        throw new InstrumentationError(
          `Invalid Order Completed event: Message properties and product at index: ${products.indexOf(
            product,
          )} is missing currency`,
        );
      }
    });
  };
  validateForPurchaseEvent();

  const m = message as { properties: { products: unknown[]; currency?: string } };
  const { products, currency: currencyCode } = m.properties;
  const timestamp = getFieldValueFromMessage(message, 'timestamp');
  const purchaseObjs: unknown[] = [];

  // we have to make a separate purchase object for each product
  products.forEach((product) => {
    const p = product as {
      product_id?: unknown;
      sku?: unknown;
      price: string;
      quantity: string;
      currency?: string;
      [key: string]: unknown;
    };
    const productId = p.product_id || p.sku;
    const { price, quantity, currency: prodCur } = p;
    let purchaseObj: Record<string, unknown> = addMandatoryPurchaseProperties(
      String(productId),
      Number.parseFloat(price),
      currencyCode || prodCur || '',
      Number.parseInt(quantity, 10),
      timestamp,
    ) as Record<string, unknown>;
    const extraProperties = _.omit(p, BRAZE_PURCHASE_STANDARD_PROPERTIES);
    const c = config as { sendPurchaseEventWithExtraProperties?: boolean };
    if (Object.keys(extraProperties).length > 0 && c.sendPurchaseEventWithExtraProperties) {
      purchaseObj = { ...purchaseObj, properties: extraProperties };
    }
    purchaseObj = setExternalIdOrAliasObject(purchaseObj, message) as Record<string, unknown>;
    purchaseObjs.push(purchaseObj);
  });

  return purchaseObjs;
}

const collectStatsForAliasFailure = (brazeResponse: unknown, destinationId: string) => {
  /**
   * Braze Response for Alias failure
   * {
   * "aliases_processed": 0,
   * "message": "success",
   * "errors": [
   *     {
   *         "type": "'external_id' is required",
   *         "input_array": "user_identifiers",
   *         "index": 0
   *     }
   *   ]
   * }
   */

  /**
   * Braze Response for Alias success
   * {
   *   "aliases_processed": 1,
   *   "message": "success"
   *   }
   */

  // Should not happen but still checking for unhandled exceptions
  if (!isDefinedAndNotNull(brazeResponse)) {
    return;
  }
  const { aliases_processed: aliasesProcessed } = brazeResponse as { aliases_processed?: number };
  if (aliasesProcessed === 0) {
    stats.increment('braze_alias_failure_count', { destination_id: destinationId });
  }
};

const collectStatsForAliasMissConfigurations = (destinationId: string) => {
  stats.increment('braze_alias_missconfigured_count', { destination_id: destinationId });
};

function handleReservedProperties(props: unknown) {
  if (typeof props !== 'object') {
    throw new InstrumentationError('Invalid event properties');
  }
  // remove reserved keys from custom event properties
  const reserved = ['time', 'event_name'];

  return _.omit(props, reserved);
}

export {
  BrazeDedupUtility,
  CustomAttributeOperationUtil,
  getEndpointFromConfig,
  processDeduplication,
  processBatch,
  addAppId,
  formatGender,
  getPurchaseObjs,
  setExternalIdOrAliasObject,
  setExternalId,
  setAliasObject,
  addMandatoryPurchaseProperties,
  collectStatsForAliasFailure,
  collectStatsForAliasMissConfigurations,
  handleReservedProperties,
  combineSubscriptionGroups,
  batchForTrackAPI,
};
