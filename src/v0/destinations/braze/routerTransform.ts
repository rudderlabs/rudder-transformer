import { z } from 'zod';
import {
  RouterIntegration,
  BatchTransformResult,
  GroupedSuccessEvents,
  PostTransformResult,
  chunkGroup,
} from '../../../services/destination/routerIntegration';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
import type { Destination } from '../../../types/controlPlaneConfig';
import type {
  BrazeUserAttributes,
  BrazeEvent,
  BrazePurchase,
  BrazeSubscriptionGroup,
  BrazeMergeUpdate,
  BrazeDestination,
  BrazeUser,
  BrazeIdentifyCall,
} from './types';
import {
  BrazeDedupUtility,
  getEndpointFromConfig,
  batchForTrackAPI,
  batchForTrackAPIV2,
  isWorkspaceOnMauPlan,
  combineSubscriptionGroups,
} from './util';
import { removeUndefinedAndNullValues } from '../../util';
import {
  getTrackEndPoint,
  getSubscriptionGroupEndPoint,
  getAliasMergeEndPoint,
  BRAZE_PARTNER_NAME,
  ALIAS_BRAZE_MAX_REQ_COUNT,
  SUBSCRIPTION_BRAZE_MAX_REQ_COUNT,
} from './config';
import { processBatchedIdentify } from './identityResolutionUtils';
import { process } from './transform';
import logger from '../../../logger';

// ---------------------------------------------------------------------------
// Payload types per endpoint
// ---------------------------------------------------------------------------

type BrazeTrackContribution = {
  kind: 'track';
  attributes?: BrazeUserAttributes[];
  events?: BrazeEvent[];
  purchases?: BrazePurchase[];
};

type BrazeSubscriptionContribution = {
  kind: 'subscription';
  group: BrazeSubscriptionGroup;
};

type BrazeMergeContribution = {
  kind: 'merge';
  update: BrazeMergeUpdate;
};

type BrazePayloadItem =
  | BrazeTrackContribution
  | BrazeSubscriptionContribution
  | BrazeMergeContribution;

// ---------------------------------------------------------------------------
// BrazeIntegration
// ---------------------------------------------------------------------------

class BrazeIntegration extends RouterIntegration<BrazePayloadItem> {
  // Cached per-batch dedup state (reset on each batchTransform call)
  private userStore = new Map<string, BrazeUser>();

  private failedLookupIdentifiers = new Set<string>();

  async batchTransform(
    inputs: RouterTransformationRequestData[],
  ): Promise<BatchTransformResult<BrazePayloadItem>> {
    const { destination } = inputs[0];
    const brazeDest = destination as unknown as BrazeDestination;

    // Reset per-batch state
    this.userStore = new Map();
    this.failedLookupIdentifiers = new Set();

    // 1. Bulk dedup lookup (async, before any per-event transform)
    if (brazeDest.Config.supportDedup) {
      try {
        const lookupResult = await BrazeDedupUtility.doLookup(inputs as never);
        if (lookupResult) {
          BrazeDedupUtility.updateUserStore(this.userStore, lookupResult.users, brazeDest.ID);
          this.failedLookupIdentifiers = lookupResult.failedIdentifiers ?? new Set();
        }
      } catch (err) {
        logger.error('[Braze] dedup lookup failed', err);
      }
    }

    // 2. Per-event transformation (parallel — userStore is read-only at this point)
    const identifyCallsArray: BrazeIdentifyCall[] = [];
    const processParams = {
      userStore: this.userStore,
      failedLookupIdentifiers: this.failedLookupIdentifiers,
      identifyCallsArray,
    };

    const perEventResults = await Promise.all(
      inputs.map(async (input) => {
        const jobId = String(input.metadata.jobId);
        try {
          const result = await process(input as never, processParams, {});
          return { jobId, result, error: null };
        } catch (err: unknown) {
          const e = err as { message?: string; status?: number; statTags?: Record<string, unknown> };
          return {
            jobId,
            result: null,
            error: { message: e.message ?? String(err), status: e.status ?? 400, statTags: e.statTags },
          };
        }
      }),
    );

    // 3. Identity resolution batch (must complete before returning)
    if (identifyCallsArray.length > 0) {
      await processBatchedIdentify(identifyCallsArray, brazeDest.ID);
    }

    // 4. Classify results into endpoint buckets
    const trackPayloads: BrazePayloadItem[] = [];
    const trackJobIds: string[] = [];
    const subscriptionPayloads: BrazePayloadItem[] = [];
    const subscriptionJobIds: string[] = [];
    const mergePayloads: BrazePayloadItem[] = [];
    const mergeJobIds: string[] = [];
    const errorEvents: { error: string; statusCode: number; jobId: string; statTags?: Record<string, unknown> }[] = [];

    for (const { jobId, result, error } of perEventResults) {
      if (error || !result) {
        errorEvents.push({
          jobId,
          error: error?.message ?? 'Unknown error',
          statusCode: error?.status ?? 400,
          ...(error?.statTags ? { statTags: error.statTags } : {}),
        });
        // eslint-disable-next-line no-continue
        continue;
      }
      const json = result.body?.JSON as Record<string, unknown> | undefined;
      // eslint-disable-next-line no-continue
      if (!json) continue;

      if (Array.isArray(json.subscription_groups)) {
        for (const group of json.subscription_groups as BrazeSubscriptionGroup[]) {
          subscriptionPayloads.push({ kind: 'subscription', group });
          subscriptionJobIds.push(jobId);
        }
      } else if (Array.isArray(json.merge_updates)) {
        for (const update of json.merge_updates as BrazeMergeUpdate[]) {
          mergePayloads.push({ kind: 'merge', update });
          mergeJobIds.push(jobId);
        }
      } else {
        trackPayloads.push({
          kind: 'track',
          attributes: json.attributes as BrazeUserAttributes[] | undefined,
          events: json.events as BrazeEvent[] | undefined,
          purchases: json.purchases as BrazePurchase[] | undefined,
        });
        trackJobIds.push(jobId);
      }
    }

    // 5. Build grouped events
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${brazeDest.Config.restApiKey}`,
    };
    const baseUrl = getEndpointFromConfig(brazeDest);
    const groupedEvents: GroupedSuccessEvents<BrazePayloadItem>[] = [];

    if (trackPayloads.length > 0) {
      groupedEvents.push({
        endpoint: getTrackEndPoint(baseUrl).endpoint,
        method: 'POST',
        headers,
        payloads: trackPayloads,
        jobIds: trackJobIds,
      });
    }
    if (subscriptionPayloads.length > 0) {
      groupedEvents.push({
        endpoint: getSubscriptionGroupEndPoint(baseUrl).endpoint,
        method: 'POST',
        headers,
        payloads: subscriptionPayloads,
        jobIds: subscriptionJobIds,
      });
    }
    if (mergePayloads.length > 0) {
      groupedEvents.push({
        endpoint: getAliasMergeEndPoint(baseUrl).endpoint,
        method: 'POST',
        headers,
        payloads: mergePayloads,
        jobIds: mergeJobIds,
      });
    }

    return { groupedEvents, errorEvents };
  }

  postTransform(
    group: GroupedSuccessEvents<BrazePayloadItem>,
    destination: Destination,
  ): PostTransformResult[] {
    const brazeDest = destination as unknown as BrazeDestination;
    const baseUrl = getEndpointFromConfig(brazeDest);

    // Subscription groups — chunk at 25
    if (group.endpoint === getSubscriptionGroupEndPoint(baseUrl).endpoint) {
      return chunkGroup(group, {
        payloadHierarchyPath: 'subscription_groups',
        maxChunkSize: SUBSCRIPTION_BRAZE_MAX_REQ_COUNT,
      }).map((chunk) => ({
        batchRequest: {
          body: {
            subscription_groups: combineSubscriptionGroups(
              (chunk.payloads as BrazeSubscriptionContribution[]).map((p) => p.group),
            ),
          },
          endpoint: chunk.endpoint,
          method: chunk.method,
          headers: chunk.headers,
        },
        jobIds: chunk.jobIds,
      }));
    }

    // Merge updates — chunk at 50
    if (group.endpoint === getAliasMergeEndPoint(baseUrl).endpoint) {
      return chunkGroup(group, {
        payloadHierarchyPath: 'merge_updates',
        maxChunkSize: ALIAS_BRAZE_MAX_REQ_COUNT,
      }).map((chunk) => ({
        batchRequest: {
          body: removeUndefinedAndNullValues({
            merge_updates: (chunk.payloads as BrazeMergeContribution[]).map((p) => p.update),
          }),
          endpoint: chunk.endpoint,
          method: chunk.method,
          headers: chunk.headers,
        },
        jobIds: chunk.jobIds,
      }));
    }

    // Track endpoint — V1/V2 algorithm
    const trackItems = group.payloads as BrazeTrackContribution[];
    const attributesArray: BrazeUserAttributes[] = trackItems.flatMap((p) => p.attributes ?? []);
    const eventsArray: BrazeEvent[] = trackItems.flatMap((p) => p.events ?? []);
    const purchasesArray: BrazePurchase[] = trackItems.flatMap((p) => p.purchases ?? []);

    const workspaceId = (destination as unknown as { WorkspaceID?: string }).WorkspaceID ?? '';
    const trackChunks = isWorkspaceOnMauPlan(workspaceId)
      ? batchForTrackAPIV2(attributesArray, eventsArray, purchasesArray)
      : batchForTrackAPI(attributesArray, eventsArray, purchasesArray);

    // Track chunks can't be perfectly re-aligned to individual jobIds since V1/V2
    // reorders by externalId. All track jobIds are associated with every chunk,
    // matching the existing processBatch() behavior.
    return trackChunks.map((chunk) => {
      const body: Record<string, unknown> = { partner: BRAZE_PARTNER_NAME };
      if (chunk.attributes.length > 0) body.attributes = chunk.attributes;
      if (chunk.events.length > 0) body.events = chunk.events;
      if (chunk.purchases.length > 0) body.purchases = chunk.purchases;
      return {
        batchRequest: {
          body,
          endpoint: group.endpoint,
          method: group.method,
          headers: group.headers,
        },
        jobIds: group.jobIds,
      };
    });
  }

  getIntegrationSchema() {
    return z
      .object({
        message: z
          .object({
            type: z.enum(['track', 'page', 'screen', 'identify', 'group', 'alias']),
          })
          .passthrough()
          .refine(
            (m: Record<string, unknown>) =>
              m.userId || m.anonymousId || (m.context as Record<string, unknown>)?.externalId,
            'userId, anonymousId, or externalId is required',
          ),
      })
      .passthrough();
  }
}

export const integration = new BrazeIntegration();
