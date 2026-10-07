import axios from 'axios';
import { Agent } from 'https';
import { z } from 'zod';
import { pollUntil } from '@rudderstack/integrations-lib/build/live-test';
import { RecordAction } from '../../../../src/types/rudderEvents';
import { HUBSPOT_API_BASE, isSafeListId } from '../../../../src/v0/destinations/hs_audience/config';
import { normalizeContactId } from '../../../../src/v0/destinations/hs_audience/utils';
import type { LiveSecret, LiveSpec, RunContext } from '../../live/types';

const hsAgent = new Agent({ keepAlive: false });
const CLEANUP_RESOURCE = 'hs-audience-membership';
const membershipPageSchema = z.object({
  results: z.array(z.object({ recordId: z.string().min(1) })),
  paging: z.object({ next: z.object({ after: z.string().min(1) }).optional() }).optional(),
});

const tokenFromSecret = (secret: LiveSecret): string => {
  const token = secret.config.accessToken;
  if (typeof token !== 'string' || !token.trim()) {
    throw new Error('HS_AUDIENCE live tests require config.accessToken');
  }
  return token.trim();
};

const listIdFromSecret = (secret: LiveSecret): string => {
  const listId = secret.resourceIds?.listId?.trim();
  if (!listId || !isSafeListId(listId)) {
    throw new Error('HS_AUDIENCE live tests require a valid resourceIds.listId');
  }
  return listId;
};

const contactIdFromSecret = (secret: LiveSecret): string => {
  const contactId = normalizeContactId(secret.resourceIds?.contactId);
  if (!contactId.ok) {
    throw new Error('HS_AUDIENCE live tests require a valid resourceIds.contactId');
  }
  return contactId.id;
};

// Convert helper failures before Axios errors can expose headers or partner bodies.
const request = async (
  ctx: RunContext,
  method: 'GET' | 'PUT',
  path: string,
  params?: Record<string, string | number>,
  data?: object,
): Promise<unknown> => {
  let response;
  try {
    response = await axios.request<unknown>({
      method,
      url: `${HUBSPOT_API_BASE}${path}`,
      headers: {
        Authorization: `Bearer ${tokenFromSecret(ctx.liveSecret)}`,
        'Content-Type': 'application/json',
        Connection: 'close',
      },
      httpsAgent: hsAgent,
      timeout: 15000,
      validateStatus: () => true,
      params,
      data,
    });
  } catch {
    throw new Error('HS_AUDIENCE live helper request failed');
  }
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`HS_AUDIENCE live helper returned HTTP ${response.status}`);
  }
  return response.data;
};

const hasMembership = async (ctx: RunContext): Promise<boolean> => {
  const listId = encodeURIComponent(listIdFromSecret(ctx.liveSecret));
  const contactId = contactIdFromSecret(ctx.liveSecret);
  const seenCursors = new Set<string>();
  let after: string | undefined;
  do {
    // Pages must be read in order; a later page may contain the test contact.
    // eslint-disable-next-line no-await-in-loop
    const body = await request(ctx, 'GET', `/crm/v3/lists/${listId}/memberships`, {
      limit: 100,
      ...(after ? { after } : {}),
    });
    const page = membershipPageSchema.safeParse(body);
    if (!page.success) {
      throw new Error('HS_AUDIENCE live membership read returned an unexpected shape');
    }
    if (page.data.results.some((member) => member.recordId === contactId)) {
      return true;
    }
    after = page.data.paging?.next?.after;
    if (after && seenCursors.has(after)) {
      throw new Error('HS_AUDIENCE live membership pagination repeated a cursor');
    }
    if (after) seenCursors.add(after);
  } while (after);
  return false;
};

const verifyMembership = async (ctx: RunContext, expected: boolean): Promise<void> => {
  const actual = await pollUntil(
    async () => {
      const value = await hasMembership(ctx);
      return { done: value === expected, value };
    },
    { label: 'HS_AUDIENCE membership read-back', attempts: 8, delayMs: () => 1000, soft: true },
  );
  expect(actual).toBe(expected);
};

const cleanupMembership = async (ctx: RunContext): Promise<void> => {
  if (!ctx.resources.some((resource) => resource.type === CLEANUP_RESOURCE)) return;
  const listId = encodeURIComponent(listIdFromSecret(ctx.liveSecret));
  await request(ctx, 'PUT', `/crm/v3/lists/${listId}/memberships/add-and-remove`, undefined, {
    recordIdsToAdd: [],
    recordIdsToRemove: [contactIdFromSecret(ctx.liveSecret)],
  });
  await verifyMembership(ctx, false);
};

const recordSeed = (action: RecordAction) => (ctx: RunContext) => ({
  type: 'record',
  action,
  recordId: ctx.identity('record'),
  identifiers: { hs_object_id: contactIdFromSecret(ctx.liveSecret) },
});

export const live = {
  enabled: true,
  authType: 'apiKey',
  resolveConfig: (secret) => ({ accessToken: tokenFromSecret(secret) }),
  resolveConnection: (secret) => ({
    destination: {
      audienceId: listIdFromSecret(secret),
      createAudience: 'no',
      syncMode: 'mirror',
      identifierMappings: [{ from: 'contact_id', to: 'hs_object_id' }],
    },
  }),
  scenarios: [
    {
      id: 'hs-audience-membership-add-remove',
      description: 'An existing contact is added to a static list and then removed',
      cleanup: cleanupMembership,
      steps: [
        {
          stepType: 'action',
          name: 'validate sandbox resources and initially absent membership',
          run: async (ctx) => {
            const listId = encodeURIComponent(listIdFromSecret(ctx.liveSecret));
            const list = await request(ctx, 'GET', `/crm/v3/lists/${listId}`);
            const eligibleList = z.object({
              list: z.object({
                objectTypeId: z.literal('0-1'),
                processingType: z.enum(['MANUAL', 'SNAPSHOT']),
              }),
            });
            if (!eligibleList.safeParse(list).success) {
              throw new Error('HS_AUDIENCE live tests require a static contact list');
            }
            const contactId = contactIdFromSecret(ctx.liveSecret);
            await request(ctx, 'GET', `/crm/v3/objects/contacts/${encodeURIComponent(contactId)}`);
            if (await hasMembership(ctx)) {
              throw new Error('HS_AUDIENCE live test contact must initially be outside the list');
            }
            // Arm cleanup only after proving this run cannot remove an existing membership.
            ctx.register({ type: CLEANUP_RESOURCE, id: contactId });
          },
        },
        {
          stepType: 'pipeline',
          name: 'insert contact membership',
          seed: recordSeed(RecordAction.INSERT),
          expectedOutputs: 1,
          expectedProxyRequests: 1,
        },
        {
          stepType: 'verify',
          name: 'verify contact is on the list',
          check: (ctx) => verifyMembership(ctx, true),
        },
        {
          stepType: 'pipeline',
          name: 'delete contact membership',
          seed: recordSeed(RecordAction.DELETE),
          expectedOutputs: 1,
          expectedProxyRequests: 1,
        },
        {
          stepType: 'verify',
          name: 'verify contact is outside the list',
          check: (ctx) => verifyMembership(ctx, false),
        },
      ],
    },
  ],
} satisfies LiveSpec;

export default live;
