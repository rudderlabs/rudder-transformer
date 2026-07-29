/* eslint-disable no-param-reassign, @typescript-eslint/naming-convention */
import _ from 'lodash';
import get from 'get-value';
import { InstrumentationError, isDefined } from '@rudderstack/integrations-lib';
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
  BRAZE_PARTNER_NAME,
  TRACK_BRAZE_MAX_EXTERNAL_ID_COUNT,
  CustomAttributeOperationTypes,
  getTrackEndPoint,
  getSubscriptionGroupEndPoint,
  getAliasMergeEndPoint,
  SUBSCRIPTION_BRAZE_MAX_REQ_COUNT,
  ALIAS_BRAZE_MAX_REQ_COUNT,
  TRACK_BRAZE_MAX_REQ_COUNT,
  TRACK_BRAZE_MAX_ITEM_BYTE_SIZE,
  TRACK_BRAZE_MAX_BATCH_BYTE_SIZE,
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
  BrazeDestInfo,
  BrazeTrackRequestBody,
  BrazeSubscriptionBatchPayload,
  BrazeMergeBatchPayload,
  BrazeSubscriptionGroup,
  BrazeAliasToIdentify,
  BrazeUserExportResponse,
  BrazeUser,
  BrazeUserAttributes,
  BrazeEvent,
  BrazePurchase,
  BrazeDestinationConfig,
  RudderBrazeMessage,
  BrazeMergeUpdate,
} from './types';
import type { Metadata } from '../../../types';

type TrackChunk = {
  attributes: BrazeUserAttributes[];
  events: BrazeEvent[];
  purchases: BrazePurchase[];
  externalIds: Set<string>;
};

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
    traits: Record<string, unknown>,
    mergeObjectsUpdateOperation: unknown,
  ) {
    data[key] = {};
    const updateArray = traits[key]?.[CustomAttributeOperationTypes.UPDATE];
    const opsResultArray: unknown[] = [];
    for (const arrayItem of updateArray) {
      const item = arrayItem;
      const myObj: Record<string, Record<string, unknown>> = {
        $identifier_key: item.identifier,
        $identifier_value: item[item.identifier],
      };

      delete item[item.identifier];
      delete item.identifier;
      myObj.$new_object = {};
      Object.keys(item).forEach((subKey) => {
        myObj.$new_object[subKey] = item[subKey];
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

  customAttributeRemoveOperation(
    key: string,
    data: Record<string, Record<string, unknown>>,
    traits: Record<string, unknown>,
  ) {
    const removeArray = traits[key]?.[CustomAttributeOperationTypes.REMOVE];
    const opsResultArray: unknown[] = [];
    for (const arrayItem of removeArray) {
      const item = arrayItem;
      const myObj: Record<string, unknown> = {
        $identifier_key: item.identifier,
        $identifier_value: item[item.identifier],
      };
      opsResultArray.push(myObj);
    }
    data[key][`$${CustomAttributeOperationTypes.REMOVE}`] = opsResultArray;
  },

  customAttributeAddOperation(
    key: string,
    data: Record<string, Record<string, unknown>>,
    traits: Record<string, unknown>,
  ) {
    data[key][`$${CustomAttributeOperationTypes.ADD}`] =
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
   * @param store - Map storing user data by identifier
   * @param identifier - User identifier (external_id or alias_name)
   * @returns User object from the store or undefined
   */
  getUserDataFromStore(store: Map<string, BrazeUser>, identifier: unknown): BrazeUser | undefined {
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
  deduplicate(userData: BrazeUserAttributes, store: Map<string, BrazeUser>) {
    const excludeKeys = new Set([
      'external_id',
      'user_alias',
      'appboy_id',
      'braze_id',
      'custom_events',
    ]);
    const { external_id, user_alias } = userData;
    let storedUserData =
      this.getUserDataFromStore(store, external_id) ||
      this.getUserDataFromStore(store, user_alias?.alias_name);

    if (!storedUserData) {
      store.set((external_id || user_alias) as string, userData);
      return userData;
    }
    const customAttributes = storedUserData.custom_attributes;
    storedUserData = { ...storedUserData, ...customAttributes };
    delete storedUserData.custom_attributes;
    let deduplicatedUserData: Record<string, unknown> = {};
    const keys = Object.keys(userData)
      .filter((key) => !excludeKeys.has(key))
      .filter((key) => !BRAZE_NON_BILLABLE_ATTRIBUTES.includes(key))
      .filter((key) => {
        if (isObject(userData[key])) {
          return !(
            Object.keys(userData[key] as object).includes('$add') ||
            Object.keys(userData[key] as object).includes('$update') ||
            Object.keys(userData[key] as object).includes('$remove')
          );
        }
        return true;
      });

    if (keys.length > 0) {
      keys.forEach((key) => {
        const sud = storedUserData;
        // ref: https://www.braze.com/docs/user_guide/data_and_analytics/custom_data/custom_attributes/#adding-descriptions
        // null is a valid value in braze for unsetting, so we need to compare the values only if the key is present in the stored user data
        // in case of keys having null values only compare if the key is present in the stored user data
        if (userData[key] === null) {
          if (isDefinedAndNotNull(sud[key])) {
            deduplicatedUserData[key] = userData[key];
          }
        } else if (!_.isEqual(userData[key], sud[key])) {
          deduplicatedUserData[key] = userData[key];
        }
      });
    }

    // add non billable attributes back to the deduplicated user object
    BRAZE_NON_BILLABLE_ATTRIBUTES.forEach((key) => {
      if (isDefined(userData[key])) {
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
    const identifier = external_id || user_alias?.alias_name;
    store.set(identifier as string, { ...storedUserData, ...deduplicatedUserData });

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
  userStore: Map<string, BrazeUser>,
  payload: BrazeUserAttributes,
  destinationId: string,
  failedLookupIdentifiers: Set<string>,
) => {
  // Check if this event's identifier failed to lookup due to API failure
  const identifier = payload.external_id || payload.user_alias?.alias_name;
  if (failedLookupIdentifiers && identifier && failedLookupIdentifiers.has(identifier)) {
    stats.increment('braze_dedup_skipped_due_to_lookup_failure_count', {
      destination_id: destinationId,
    });
  }

  const dedupedAttributePayload = BrazeDedupUtility.deduplicate(payload, userStore);
  if (
    isDefinedAndNotNullAndNotEmpty(dedupedAttributePayload) &&
    Object.keys(dedupedAttributePayload as BrazeUserAttributes).some(
      (key) => !['external_id', 'user_alias'].includes(key),
    )
  ) {
    stats.increment('braze_deduped_users_count', { destination_id: destinationId });
    return dedupedAttributePayload;
  }
  stats.increment('braze_dedup_and_drop_count', { destination_id: destinationId });
  return null;
};

function prepareGroupAndAliasBatch({
  arrayChunks,
  responseArray,
  destination,
  type,
}:
  | {
      arrayChunks: BrazeSubscriptionGroup[][];
      responseArray: unknown[];
      destination: BrazeDestination;
      type: 'subscription';
    }
  | {
      arrayChunks: BrazeMergeUpdate[][];
      responseArray: unknown[];
      destination: BrazeDestination;
      type: 'merge';
    }) {
  const headers = {
    'Content-Type': JSON_MIME_TYPE,
    Accept: JSON_MIME_TYPE,
    Authorization: `Bearer ${destination.Config.restApiKey}`,
  };

  // Type narrowing: Check type BEFORE the loop so TypeScript can narrow arrayChunks
  if (type === 'merge') {
    // TypeScript now knows arrayChunks is BrazeMergeUpdate[][]
    for (const chunk of arrayChunks) {
      const response = defaultRequestConfig();
      const { endpoint, path } = getAliasMergeEndPoint(getEndpointFromConfig(destination));
      response.endpoint = endpoint;
      response.endpointPath = path;
      response.body.JSON = removeUndefinedAndNullValues({
        merge_updates: chunk,
      });
      responseArray.push({
        ...response,
        headers,
      });
    }
  } else {
    // TypeScript now knows arrayChunks is BrazeSubscriptionGroup[][]
    for (const chunk of arrayChunks) {
      const response = defaultRequestConfig();
      const { endpoint, path } = getSubscriptionGroupEndPoint(getEndpointFromConfig(destination));
      response.endpoint = endpoint;
      response.endpointPath = path;

      stats.gauge('braze_batch_subscription_size', chunk.length, {
        destination_id: destination.ID,
      });

      // Deduplicate the subscription groups before constructing the response body
      // No type casting needed - TypeScript knows chunk is BrazeSubscriptionGroup[]
      const deduplicatedSubscriptionGroups = combineSubscriptionGroups(chunk);

      stats.gauge('braze_batch_subscription_combined_size', deduplicatedSubscriptionGroups.length, {
        destination_id: destination.ID,
      });

      response.body.JSON = removeUndefinedAndNullValues({
        subscription_groups: deduplicatedSubscriptionGroups,
      });
      responseArray.push({
        ...response,
        headers,
      });
    }
  }
}

const createTrackChunk = (): TrackChunk => ({
  attributes: [],
  events: [],
  purchases: [],
  externalIds: new Set<string>(),
});

type AllItems = {
  data: BrazeUserAttributes | BrazeEvent | BrazePurchase;
  type: string;
  externalId?: string;
};

const batchForTrackAPI = (
  attributesArray: BrazeUserAttributes[],
  eventsArray: BrazeEvent[],
  purchasesArray: BrazePurchase[],
) => {
  const allItems: AllItems[] = [];
  const maxLength = Math.max(attributesArray.length, eventsArray.length, purchasesArray.length);

  const addItem = (item: AllItems['data'], type: string) => {
    if (item) {
      allItems.push({
        data: item,
        type,
        externalId: item.external_id,
      });
    }
  };

  const canAddToChunk = (
    item: AllItems,
    chunk: {
      externalIds: Set<string>;
      attributes: unknown[];
      events: unknown[];
      purchases: unknown[];
    },
  ) => {
    const { type, externalId } = item;
    return (
      ((externalId && chunk.externalIds.has(externalId)) ||
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
      currentChunk.externalIds.add(item.externalId!);
    } else {
      trackChunks.push(currentChunk);
      currentChunk = createTrackChunk();
      currentChunk[item.type].push(item.data);
      currentChunk.externalIds.add(item.externalId!);
    }
  }
  if (currentChunk.externalIds.size > 0) {
    trackChunks.push(currentChunk);
  }
  return trackChunks;
};

// braze batching as per new MAU plan
const batchForTrackAPIV2 = (
  attributesArray: BrazeUserAttributes[],
  eventsArray: BrazeEvent[],
  purchasesArray: BrazePurchase[],
) => {
  // Collect all items with their types, filtering out null/undefined
  const allItems: AllItems[] = [
    ...attributesArray
      .filter((item) => isDefinedAndNotNull(item))
      .map((item) => ({
        data: item,
        type: 'attributes',
        externalId: item.external_id,
      })),
    ...eventsArray
      .filter((item) => isDefinedAndNotNull(item))
      .map((item) => ({ data: item, type: 'events', externalId: item.external_id })),
    ...purchasesArray
      .filter((item) => isDefinedAndNotNull(item))
      .map((item) => ({
        data: item,
        type: 'purchases',
        externalId: item.external_id,
      })),
  ];

  const sortedItems: AllItems[] = _.sortBy(allItems, 'externalId');
  const trackChunks: ReturnType<typeof createTrackChunk>[] = [];
  let currentChunk = createTrackChunk();

  const getChunkSize = (chunk: ReturnType<typeof createTrackChunk>) =>
    chunk.attributes.length + chunk.events.length + chunk.purchases.length;

  const addItemToChunk = (item: AllItems, chunk: ReturnType<typeof createTrackChunk>) => {
    chunk[item.type].push(item.data);
  };

  for (const item of sortedItems) {
    if (getChunkSize(currentChunk) === TRACK_BRAZE_MAX_REQ_COUNT) {
      trackChunks.push(currentChunk);
      currentChunk = createTrackChunk();
    }
    addItemToChunk(item, currentChunk);
  }

  if (getChunkSize(currentChunk) > 0) {
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
  let totalCount = 0;
  if (attributes) {
    totalCount += attributes.length;
    stats.histogram('braze_batch_attributes_pack_size', attributes.length, {
      destination_id: destination.ID,
    });
  }
  if (events) {
    totalCount += events.length;
    stats.histogram('braze_batch_events_pack_size', events.length, {
      destination_id: destination.ID,
    });
  }
  if (purchases) {
    totalCount += purchases.length;
    stats.histogram('braze_batch_purchase_pack_size', purchases.length, {
      destination_id: destination.ID,
    });
  }
  stats.histogram('braze_batch_total_pack_size', totalCount, {
    destination_id: destination.ID,
  });
};

let mauWorkspaceSkipIds: string | Map<string, boolean> = 'ALL';
if (isDefinedAndNotNull(process.env.DEST_BRAZE_MAU_WORKSPACE_IDS_SKIP_LIST)) {
  const skipList = process.env.DEST_BRAZE_MAU_WORKSPACE_IDS_SKIP_LIST!;
  switch (skipList) {
    case 'ALL':
      mauWorkspaceSkipIds = 'ALL';
      break;
    case 'NONE':
      mauWorkspaceSkipIds = 'NONE';
      break;
    default:
      mauWorkspaceSkipIds = new Map(skipList.split(',').map((s) => [s.trim(), true]));
  }
}

const isWorkspaceOnMauPlan = (workspaceId) => {
  const environmentVariable = mauWorkspaceSkipIds;
  switch (environmentVariable) {
    case 'ALL':
      return false;
    case 'NONE':
      return true;
    default: {
      return !(mauWorkspaceSkipIds as Map<string, boolean>).has(workspaceId);
    }
  }
};

const processBatch = (transformedEvents: BrazeTransformedEvent[]) => {
  const { destination, metadata } = transformedEvents[0];
  const workspaceId = metadata?.[0]?.workspaceId || '';
  const dest = destination;
  const attributesArray: BrazeUserAttributes[] = [];
  const eventsArray: BrazeEvent[] = [];
  const purchaseArray: BrazePurchase[] = [];
  const successMetadata: Partial<Metadata>[] = [];
  const failureResponses: BrazeTransformedEvent[] = [];
  const filteredResponses: BrazeTransformedEvent[] = [];
  const subscriptionsArray: BrazeSubscriptionGroup[] = [];
  const mergeUsersArray: BrazeMergeUpdate[] = [];
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
  const isWorkspaceOnMauPlanFlag = isWorkspaceOnMauPlan(workspaceId);
  const trackChunks = isWorkspaceOnMauPlanFlag
    ? batchForTrackAPIV2(attributesArray, eventsArray, purchaseArray)
    : batchForTrackAPI(attributesArray, eventsArray, purchaseArray);
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

  prepareGroupAndAliasBatch({
    arrayChunks: subscriptionArrayChunks,
    responseArray,
    destination,
    type: 'subscription',
  });
  prepareGroupAndAliasBatch({
    arrayChunks: mergeUsersArrayChunks,
    responseArray,
    destination,
    type: 'merge',
  });

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
// ===========================================================================
// ON-path helpers & processBatchWithDeliveryMapping
// Selected by transform.ts when BRAZE_PER_JOB_DELIVERY_MAPPING_WORKSPACE_IDS enables the workspace.
// Everything above this section is bit-identical to develop.
// ===========================================================================

// ---------------------------------------------------------------------------
// Batching data structures
//
// The batching pipeline flattens every job's contributions into tagged items,
// each carrying a back-pointer to its source job (`sourceJobIndex`) plus its
// pre-computed serialized byte size. A stable sort by (externalId, sourceJob)
// keeps same-user AND same-job items contiguous so `chunkTaggedItems` can add
// an entire job's items atomically to a chunk, preventing cross-chunk straddle.
//
// Each `TaggedTrackChunk` also stores parallel `*SourceJobIndex` arrays so that
// `processBatch` can build the per-metadata `destInfo` positional map
// (attributesIndices / eventsIndices / purchasesIndices) that the v1
// networkHandler uses to correlate Braze's per-item warnings back to
// originating jobs.
// ---------------------------------------------------------------------------

type TaggedItemCommon = {
  externalId?: string;
  sourceJobIndex: number;
  byteSize: number;
};

// Discriminated union so `item.type === 'attributes'` narrows `item.data` to
// `BrazeUserAttributes` (etc.) at every read site — no casts.
type TaggedItem =
  | (TaggedItemCommon & { type: 'attributes'; data: BrazeUserAttributes })
  | (TaggedItemCommon & { type: 'events'; data: BrazeEvent })
  | (TaggedItemCommon & { type: 'purchases'; data: BrazePurchase });

// Contribution shape used by `collectTrackItemsForJob`'s inner helper: the
// per-item data plus its type discriminant. Callers construct one of these
// three shapes at the call site, so TS knows `data`'s type without casts.
type TrackContribution =
  | { type: 'attributes'; data: BrazeUserAttributes }
  | { type: 'events'; data: BrazeEvent }
  | { type: 'purchases'; data: BrazePurchase };

type TaggedTrackChunk = {
  attributes: BrazeUserAttributes[];
  attributesSourceJobIndex: number[];
  events: BrazeEvent[];
  eventsSourceJobIndex: number[];
  purchases: BrazePurchase[];
  purchasesSourceJobIndex: number[];
  externalIds: Set<string>;
  sourceJobIndexes: Set<number>;
  byteSize: number;
};

const computeItemByteSize = (item: unknown): number => Buffer.byteLength(JSON.stringify(item));

const createTaggedTrackChunk = (): TaggedTrackChunk => ({
  attributes: [],
  attributesSourceJobIndex: [],
  events: [],
  eventsSourceJobIndex: [],
  purchases: [],
  purchasesSourceJobIndex: [],
  externalIds: new Set<string>(),
  sourceJobIndexes: new Set<number>(),
  byteSize: 0,
});

// Contiguous same-sourceJobIndex runs in a sorted item list. Because we
// stable-sort by (externalId, sourceJobIndex), items from the same source job
// end up adjacent regardless of type.
const groupBySourceJob = (sortedItems: TaggedItem[]): TaggedItem[][] => {
  const groups: TaggedItem[][] = [];
  if (sortedItems.length === 0) {
    return groups;
  }
  let start = 0;
  for (let i = 1; i <= sortedItems.length; i += 1) {
    if (
      i === sortedItems.length ||
      sortedItems[i].sourceJobIndex !== sortedItems[start].sourceJobIndex
    ) {
      groups.push(sortedItems.slice(start, i));
      start = i;
    }
  }
  return groups;
};

const addGroupToChunk = (chunk: TaggedTrackChunk, group: TaggedItem[]): void => {
  for (const item of group) {
    if (item.type === 'attributes') {
      chunk.attributes.push(item.data);
      chunk.attributesSourceJobIndex.push(item.sourceJobIndex);
    } else if (item.type === 'events') {
      chunk.events.push(item.data);
      chunk.eventsSourceJobIndex.push(item.sourceJobIndex);
    } else {
      chunk.purchases.push(item.data);
      chunk.purchasesSourceJobIndex.push(item.sourceJobIndex);
    }
    if (item.externalId) {
      chunk.externalIds.add(item.externalId);
    }
    chunk.sourceJobIndexes.add(item.sourceJobIndex);
    chunk.byteSize += item.byteSize;
  }
};

// V1 semantics: per-type item cap + externalId cap + byte-size cap.
const groupFitsV1 = (chunk: TaggedTrackChunk, group: TaggedItem[]): boolean => {
  let addAttrs = 0;
  let addEvents = 0;
  let addPurchases = 0;
  let addByteSize = 0;
  const newExternalIds = new Set(chunk.externalIds);
  for (const item of group) {
    if (item.type === 'attributes') addAttrs += 1;
    else if (item.type === 'events') addEvents += 1;
    else addPurchases += 1;
    if (item.externalId) newExternalIds.add(item.externalId);
    addByteSize += item.byteSize;
  }
  return (
    chunk.attributes.length + addAttrs <= TRACK_BRAZE_MAX_REQ_COUNT &&
    chunk.events.length + addEvents <= TRACK_BRAZE_MAX_REQ_COUNT &&
    chunk.purchases.length + addPurchases <= TRACK_BRAZE_MAX_REQ_COUNT &&
    newExternalIds.size <= TRACK_BRAZE_MAX_EXTERNAL_ID_COUNT &&
    chunk.byteSize + addByteSize <= TRACK_BRAZE_MAX_BATCH_BYTE_SIZE
  );
};

// V2 (MAU plan) semantics: total-count cap + byte-size cap.
const groupFitsV2 = (chunk: TaggedTrackChunk, group: TaggedItem[]): boolean => {
  let addByteSize = 0;
  for (const item of group) {
    addByteSize += item.byteSize;
  }
  return (
    chunk.attributes.length + chunk.events.length + chunk.purchases.length + group.length <=
      TRACK_BRAZE_MAX_REQ_COUNT && chunk.byteSize + addByteSize <= TRACK_BRAZE_MAX_BATCH_BYTE_SIZE
  );
};

// Group-preserving, size-aware chunking. Callers are responsible for
// rejecting jobs whose contributions exceed the caps on their own — such a
// group can never fit into an empty chunk. `processBatch` enforces that
// pre-check; the exported wrappers below use per-item sourceJobIndex so no
// group ever exceeds a single item.
const chunkTaggedItems = (items: TaggedItem[], mode: 'v1' | 'v2'): TaggedTrackChunk[] => {
  const sortedItems = _.orderBy(items, ['externalId', 'sourceJobIndex']);
  const groups = groupBySourceJob(sortedItems);
  const chunks: TaggedTrackChunk[] = [];
  let currentChunk = createTaggedTrackChunk();
  const fits = mode === 'v1' ? groupFitsV1 : groupFitsV2;
  for (const group of groups) {
    if (currentChunk.sourceJobIndexes.size > 0 && !fits(currentChunk, group)) {
      chunks.push(currentChunk);
      currentChunk = createTaggedTrackChunk();
    }
    addGroupToChunk(currentChunk, group);
  }
  if (currentChunk.sourceJobIndexes.size > 0) {
    chunks.push(currentChunk);
  }
  return chunks;
};

// Collect tagged /users/track items for a single transformedEvent while
// enforcing per-item and per-job byte-size caps. Returns an error result if
// any cap is breached — caller pushes the event onto failureResponses. The
// track body is passed in already-narrowed by the caller (typically after
// `classifyJobRun` returned a `track` classification), so no cast is needed.
type TrackCollectionResult = { items: TaggedItem[] } | { error: InstrumentationError };

const collectTrackItemsForJob = (
  body: BrazeTrackRequestBody,
  jobIndex: number,
): TrackCollectionResult => {
  const attrArr = Array.isArray(body.attributes) ? body.attributes : [];
  const evtArr = Array.isArray(body.events) ? body.events : [];
  const purArr = Array.isArray(body.purchases) ? body.purchases : [];

  const items: TaggedItem[] = [];
  let totalByteSize = 0;

  const tryAdd = (contribution: TrackContribution): InstrumentationError | null => {
    const byteSize = computeItemByteSize(contribution.data);
    if (byteSize > TRACK_BRAZE_MAX_ITEM_BYTE_SIZE) {
      return new InstrumentationError(
        `[Braze] Single ${contribution.type} item exceeds ${TRACK_BRAZE_MAX_ITEM_BYTE_SIZE} bytes (got ${byteSize})`,
      );
    }
    items.push({
      ...contribution,
      externalId: contribution.data.external_id,
      sourceJobIndex: jobIndex,
      byteSize,
    });
    totalByteSize += byteSize;
    return null;
  };

  for (const attr of attrArr) {
    if (isDefinedAndNotNull(attr)) {
      const err = tryAdd({ type: 'attributes', data: attr });
      if (err) return { error: err };
    }
  }
  for (const evt of evtArr) {
    if (isDefinedAndNotNull(evt)) {
      const err = tryAdd({ type: 'events', data: evt });
      if (err) return { error: err };
    }
  }
  for (const pur of purArr) {
    if (isDefinedAndNotNull(pur)) {
      const err = tryAdd({ type: 'purchases', data: pur });
      if (err) return { error: err };
    }
  }

  // A single job's items must all fit into one chunk to preserve
  // metadata↔chunk ownership (a job can't span two proxy responses). If a
  // job alone exceeds the per-batch caps, no chunking can accommodate it.
  if (items.length > TRACK_BRAZE_MAX_REQ_COUNT) {
    return {
      error: new InstrumentationError(
        `[Braze] Single job contributes ${items.length} track items (max ${TRACK_BRAZE_MAX_REQ_COUNT} per batch)`,
      ),
    };
  }
  if (totalByteSize > TRACK_BRAZE_MAX_BATCH_BYTE_SIZE) {
    return {
      error: new InstrumentationError(
        `[Braze] Single job's track items total ${totalByteSize} bytes (max ${TRACK_BRAZE_MAX_BATCH_BYTE_SIZE} per batch)`,
      ),
    };
  }
  return { items };
};

// Build the per-metadata destInfo positional map for a chunk. Every unique
// sourceJobIndex in the chunk gets one BrazeDestInfo describing where that
// job's items landed within this chunk's attributes[]/events[]/purchases[].
// All three fields are arrays (length 1 for the standard single-contribution
// case; longer for e.g. order-completed contributing multiple purchases).
const buildDestInfoByJob = (chunk: TaggedTrackChunk): Map<number, BrazeDestInfo> => {
  const map = new Map<number, BrazeDestInfo>();
  const record = (
    sji: number,
    key: 'attributesIndices' | 'eventsIndices' | 'purchasesIndices',
    idx: number,
  ) => {
    const info = map.get(sji) ?? {};
    (info[key] ??= []).push(idx);
    map.set(sji, info);
  };
  chunk.attributesSourceJobIndex.forEach((sji, idx) => record(sji, 'attributesIndices', idx));
  chunk.eventsSourceJobIndex.forEach((sji, idx) => record(sji, 'eventsIndices', idx));
  chunk.purchasesSourceJobIndex.forEach((sji, idx) => record(sji, 'purchasesIndices', idx));
  return map;
};

// Build the /users/track HTTP request body for one chunk. Shared by both the
// OFF and ON emission paths — the request shape itself doesn't depend on the
// flag; only the wrapping output structure and metadata do.
const buildTrackRequest = (
  chunk: TaggedTrackChunk,
  destination: BrazeDestination,
  headers: BrazeBatchHeaders,
  trackEndpoint: string,
  trackPath: string,
) => {
  addTrackStats(chunk, destination);
  const request = defaultRequestConfig();
  request.endpoint = trackEndpoint;
  request.endpointPath = trackPath;
  request.body.JSON = { partner: BRAZE_PARTNER_NAME, ...cleanTrackChunk(chunk) };
  return { ...request, headers };
};

// ON path: one BatchRequestOutput per track chunk, with per-metadata destInfo
// positional maps consumed by the v1 networkHandler.
const trackChunkResponse = (
  chunk: TaggedTrackChunk,
  destination: BrazeDestination,
  headers: BrazeBatchHeaders,
  trackEndpoint: string,
  trackPath: string,
  jobMetadata: Partial<Metadata>[][],
) => {
  const destInfoByJob = buildDestInfoByJob(chunk);
  const chunkMetadata: Partial<Metadata>[] = [];
  // Iterate sourceJobIndexes in insertion order (Set preserves it) so the
  // metadata slice ordering is deterministic and stable.
  for (const sji of chunk.sourceJobIndexes) {
    // destInfo carries top-level index-array fields; no per-destination
    // wrapper — Braze is the sole producer AND consumer of these fields.
    const info = destInfoByJob.get(sji) ?? {};
    for (const m of jobMetadata[sji]) {
      chunkMetadata.push({
        ...m,
        destInfo: { ...(m.destInfo ?? {}), ...info },
      });
    }
  }
  return {
    batchedRequest: buildTrackRequest(chunk, destination, headers, trackEndpoint, trackPath),
    metadata: chunkMetadata,
    batched: true,
    statusCode: 200,
    destination,
  };
};

// Collect scoped metadata for a subscription/merge chunk. A single job may
// contribute multiple entries but must be listed once in the chunk's metadata.
// Under the ON path, sub/merge outputs still carry `destInfo: {}` (present-
// but-empty for correlation-shape uniformity across every chunk).
const scopedMetadataForChunk = <T extends { sourceJobIndex: number }>(
  chunk: T[],
  jobMetadata: Partial<Metadata>[][],
  withEmptyDestInfo: boolean,
): Partial<Metadata>[] => {
  const seen = new Set<number>();
  const out: Partial<Metadata>[] = [];
  for (const entry of chunk) {
    if (!seen.has(entry.sourceJobIndex)) {
      seen.add(entry.sourceJobIndex);
      for (const m of jobMetadata[entry.sourceJobIndex]) {
        out.push(withEmptyDestInfo ? { ...m, destInfo: { ...(m.destInfo ?? {}) } } : m);
      }
    }
  }
  return out;
};

const buildSubscriptionRequest = (
  chunk: Array<{ data: BrazeSubscriptionGroup; sourceJobIndex: number }>,
  destination: BrazeDestination,
  headers: BrazeBatchHeaders,
  subEndpoint: string,
  subPath: string,
) => {
  const rawGroups = chunk.map((e) => e.data);
  stats.gauge('braze_batch_subscription_size', rawGroups.length, {
    destination_id: destination.ID,
  });
  const deduplicated = combineSubscriptionGroups(rawGroups);
  stats.gauge('braze_batch_subscription_combined_size', deduplicated.length, {
    destination_id: destination.ID,
  });
  const request = defaultRequestConfig();
  request.endpoint = subEndpoint;
  request.endpointPath = subPath;
  request.body.JSON = removeUndefinedAndNullValues({ subscription_groups: deduplicated });
  return { ...request, headers };
};

const buildMergeRequest = (
  chunk: Array<{ data: BrazeMergeUpdate; sourceJobIndex: number }>,
  headers: BrazeBatchHeaders,
  mergeEndpoint: string,
  mergePath: string,
) => {
  const rawMerges = chunk.map((e) => e.data);
  const request = defaultRequestConfig();
  request.endpoint = mergeEndpoint;
  request.endpointPath = mergePath;
  request.body.JSON = removeUndefinedAndNullValues({ merge_updates: rawMerges });
  return { ...request, headers };
};

// Type predicates narrow an untyped body (whatever `body.JSON` is at runtime)
// to a specific Braze payload shape via `in` narrowing on each shape's
// distinguishing field. Consumers can then read member fields without casts.
const isObjectPayload = (json: unknown): json is Record<string, unknown> =>
  typeof json === 'object' && json !== null;
const isTrackBody = (json: unknown): json is BrazeTrackRequestBody =>
  isObjectPayload(json) && ('attributes' in json || 'events' in json || 'purchases' in json);
const isSubscriptionBody = (json: unknown): json is BrazeSubscriptionBatchPayload =>
  isObjectPayload(json) && 'subscription_groups' in json;
const isMergeBody = (json: unknown): json is BrazeMergeBatchPayload =>
  isObjectPayload(json) && 'merge_updates' in json;

// Discriminated classification result: the run type + the narrowed body. The
// caller can consume `classification.body` without casts.
type JobClassification =
  | { type: 'track'; body: BrazeTrackRequestBody }
  | { type: 'subscription'; body: BrazeSubscriptionBatchPayload }
  | { type: 'merge'; body: BrazeMergeBatchPayload };

// The upstream router transform always produces a body matching one of the
// three Braze payload shapes, so this classifier is total. If the contract
// is ever violated we throw rather than silently drop the job.
const classifyJobRun = (json: unknown): JobClassification => {
  if (isTrackBody(json)) return { type: 'track', body: json };
  if (isSubscriptionBody(json)) return { type: 'subscription', body: json };
  if (isMergeBody(json)) return { type: 'merge', body: json };
  throw new InstrumentationError(
    'Braze processBatchWithDeliveryMapping: body is neither track, subscription, nor merge',
  );
};

// ---------------------------------------------------------------------------
// `processBatchWithDeliveryMapping` (ON path).
//
// Emits one BatchRequestOutput per outgoing HTTP request. Preserves the
// input's insertion-order runs so per-user jobIds stay monotonic across the
// emitted outputs. Track outputs carry per-metadata `destInfo` positional
// maps consumed by the v1 networkHandler; subscription and alias-merge
// outputs carry `destInfo: {}` for correlation-shape uniformity.
//
// Applies always-on batching improvements not present on the OFF path:
// group-preserving chunking (a job's contributions never straddle chunks),
// byte-size caps per item (100 KB) and per batch (4 MB), and up-front
// oversized-job rejection.
//
// Selected by `transform.ts` when `BRAZE_PER_JOB_DELIVERY_MAPPING_WORKSPACE_IDS`
// enables the invocation's workspace.
// ---------------------------------------------------------------------------
const processBatchWithDeliveryMapping = (
  transformedEvents: BrazeTransformedEvent[],
): BrazeBatchResponse[] => {
  const { destination, metadata } = transformedEvents[0];
  const workspaceId = metadata?.[0]?.workspaceId || '';

  const failureResponses: BrazeTransformedEvent[] = [];
  const filteredResponses: BrazeTransformedEvent[] = [];
  const trackItems: TaggedItem[] = [];
  const subItems: Array<{ data: BrazeSubscriptionGroup; sourceJobIndex: number }> = [];
  const mergeItems: Array<{ data: BrazeMergeUpdate; sourceJobIndex: number }> = [];
  const jobMetadata: Partial<Metadata>[][] = Array.from(
    { length: transformedEvents.length },
    () => [],
  );
  transformedEvents.forEach((transformedEvent, jobIndex) => {
    if (!isHttpStatusSuccess(transformedEvent.statusCode)) {
      failureResponses.push(transformedEvent);
      return;
    }
    if (transformedEvent.statusCode === HTTP_STATUS_CODES.FILTER_EVENTS) {
      filteredResponses.push(transformedEvent);
      return;
    }
    const classification = classifyJobRun(transformedEvent.batchedRequest?.body?.JSON);

    if (classification.type === 'track') {
      const collection = collectTrackItemsForJob(classification.body, jobIndex);
      if ('error' in collection) {
        failureResponses.push({
          ...transformedEvent,
          statusCode: 400,
          error: collection.error.message,
          statTags: { errorType: 'aborted', errorCategory: 'dataValidation' },
        });
        return;
      }
      trackItems.push(...collection.items);
    } else if (classification.type === 'subscription') {
      for (const sg of classification.body.subscription_groups ?? []) {
        subItems.push({ data: sg, sourceJobIndex: jobIndex });
      }
    } else {
      for (const mu of classification.body.merge_updates ?? []) {
        mergeItems.push({ data: mu, sourceJobIndex: jobIndex });
      }
    }

    if (transformedEvent.metadata) {
      jobMetadata[jobIndex] = transformedEvent.metadata;
    }
  });

  const isWorkspaceOnMauPlanFlag = isWorkspaceOnMauPlan(workspaceId);
  const headers: BrazeBatchHeaders = {
    'Content-Type': JSON_MIME_TYPE,
    Accept: JSON_MIME_TYPE,
    Authorization: `Bearer ${destination.Config.restApiKey}`,
  };
  const { endpoint: trackEndpoint, path: trackPath } = getTrackEndPoint(
    getEndpointFromConfig(destination),
  );
  const { endpoint: subEndpoint, path: subPath } = getSubscriptionGroupEndPoint(
    getEndpointFromConfig(destination),
  );
  const { endpoint: mergeEndpoint, path: mergePath } = getAliasMergeEndPoint(
    getEndpointFromConfig(destination),
  );

  const finalResponse: BrazeBatchResponse[] = [];
  const trackChunks = chunkTaggedItems(trackItems, isWorkspaceOnMauPlanFlag ? 'v2' : 'v1');
  for (const chunk of trackChunks) {
    finalResponse.push(
      trackChunkResponse(chunk, destination, headers, trackEndpoint, trackPath, jobMetadata),
    );
  }
  const subChunks = _.chunk(subItems, SUBSCRIPTION_BRAZE_MAX_REQ_COUNT);
  for (const chunk of subChunks) {
    finalResponse.push({
      batchedRequest: buildSubscriptionRequest(chunk, destination, headers, subEndpoint, subPath),
      metadata: scopedMetadataForChunk(chunk, jobMetadata, true),
      batched: true,
      statusCode: 200,
      destination,
    });
  }
  const mergeChunks = _.chunk(mergeItems, ALIAS_BRAZE_MAX_REQ_COUNT);
  for (const chunk of mergeChunks) {
    finalResponse.push({
      batchedRequest: buildMergeRequest(chunk, headers, mergeEndpoint, mergePath),
      metadata: scopedMetadataForChunk(chunk, jobMetadata, true),
      batched: true,
      statusCode: 200,
      destination,
    });
  }

  if (failureResponses.length > 0) finalResponse.push(...failureResponses);
  if (filteredResponses.length > 0) finalResponse.push(...filteredResponses);
  return finalResponse;
};
const addAppId = (payload: Record<string, unknown>, message: Record<string, unknown>) => {
  const integrationsObj = getIntegrationsObj(message, DESTINATION.toUpperCase() as any);
  if (integrationsObj?.appId) {
    const { appId: appIdValue } = integrationsObj;
    return {
      ...payload,
      app_id: String(appIdValue),
    };
  }
  return { ...payload };
};

function setExternalId(payload: Record<string, unknown>, message: Record<string, unknown>) {
  const externalId = getDestinationExternalID(message, 'brazeExternalId') || message.userId;
  if (externalId) {
    payload.external_id = externalId;
  }
  return payload;
}

function setAliasObject(payload: Record<string, unknown>, message: RudderBrazeMessage) {
  const integrationsObj = getIntegrationsObj(message, DESTINATION.toUpperCase() as any);
  if (
    isDefinedAndNotNull(integrationsObj?.alias?.alias_name) &&
    isDefinedAndNotNull(integrationsObj?.alias?.alias_label)
  ) {
    const { alias_name, alias_label } = integrationsObj.alias;
    payload.user_alias = {
      alias_name,
      alias_label,
    };
  } else if (message.anonymousId) {
    payload.user_alias = {
      alias_name: message.anonymousId,
      alias_label: 'rudder_id',
    };
  }
  return payload;
}

function setExternalIdOrAliasObject(payload: Record<string, unknown>, message: RudderBrazeMessage) {
  const userId = getFieldValueFromMessage(message, 'userIdOnly');
  if (userId || getDestinationExternalID(message, 'brazeExternalId')) {
    return setExternalId(payload, message);
  }

  // eslint-disable-next-line no-underscore-dangle
  payload._update_existing_only = false;
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

function getPurchaseObjs(message: RudderBrazeMessage, config: BrazeDestinationConfig) {
  // ref:https://www.braze.com/docs/api/objects_filters/purchase_object/
  const validateForPurchaseEvent = () => {
    const { properties } = message;
    const timestamp = getFieldValueFromMessage(message, 'timestamp');
    if (!properties) {
      throw new InstrumentationError(
        'Invalid Order Completed event: Properties object is missing in the message',
      );
    }
    const { currency: currencyCode } = properties;
    let { products } = properties;
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
      const productId = product.product_id || product.sku;
      const { price, quantity, currency: prodCurrencyCode } = product;
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

  // After validation, we know properties exists and has products
  const { products, currency: currencyCode } = message.properties!;
  const timestamp = getFieldValueFromMessage(message, 'timestamp');
  const purchaseObjs: unknown[] = [];

  // we have to make a separate purchase object for each product
  // After validation, products is guaranteed to exist and be a non-empty array
  products!.forEach((product) => {
    const productId = product.product_id || product.sku;
    const { price, quantity, currency: prodCur } = product;
    // Convert to string first to handle any type (number, string, etc.)
    // then parse to ensure correct type for Braze API
    let purchaseObj: Record<string, unknown> = addMandatoryPurchaseProperties(
      String(productId),
      Number.parseFloat(String(price)),
      String(currencyCode || prodCur),
      Number.parseInt(String(quantity), 10),
      timestamp,
    );
    const extraProperties = _.omit(product, BRAZE_PURCHASE_STANDARD_PROPERTIES);
    if (Object.keys(extraProperties).length > 0 && config.sendPurchaseEventWithExtraProperties) {
      purchaseObj = { ...purchaseObj, properties: extraProperties };
    }
    purchaseObj = setExternalIdOrAliasObject(purchaseObj, message);
    purchaseObjs.push(purchaseObj);
  });

  return purchaseObjs;
}

const collectStatsForAliasFailure = (
  brazeResponse: {
    aliases_processed?: number;
  },
  destinationId: string,
) => {
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
  const { aliases_processed: aliasesProcessed } = brazeResponse;
  if (aliasesProcessed === 0) {
    stats.increment('braze_alias_failure_count', { destination_id: destinationId });
  }
};

const collectStatsForAliasMissConfigurations = (destinationId: string) => {
  stats.increment('braze_alias_missconfigured_count', { destination_id: destinationId });
};

function handleReservedProperties(props: Record<string, unknown>): Record<string, unknown> {
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
  processBatchWithDeliveryMapping,
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
  batchForTrackAPIV2,
};
