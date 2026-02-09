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
