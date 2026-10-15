import axios from 'axios';
import { Agent } from 'https';
import { z } from 'zod';
import { pollUntil } from '@rudderstack/integrations-lib/build/live-test';
import { RecordAction } from '../../../../src/types/rudderEvents';
import type { LiveSecret, LiveSpec, RunContext } from '../../live/types';

// Parked until a Marketo sandbox exists (phase 1 has no credentials). Enable it with:
// LIVE_SECRET_MARKETO_AUDIENCE='{"authType":"apiKey",
//   "config":{"accountId":"<munchkin-id>","clientId":"<client-id>","clientSecret":"<client-secret>"},
//   "resourceIds":{"listId":"<static-list-id>","leadId":"<lead-id>","leadEmail":"<that-lead-email>"}}'
// The lead must exist and start outside the static list; every scenario removes it again.
//
// These scenarios settle the spec's live checks: a JSON `input` body on POST and DELETE, the
// result for re-adding a member and removing a non-member, and case-insensitive email lookup.

const agent = new Agent({ keepAlive: false });
const CLEANUP_RESOURCE = 'marketo-audience-membership';
// Far above any lead ID a sandbox will have; Marketo answers `skipped` with 1004 for it.
const UNKNOWN_LEAD_ID = '2147483000';

const membershipSchema = z.object({
  success: z.literal(true),
  result: z.array(z.object({ id: z.number(), status: z.string() })),
});

const resource = (secret: LiveSecret, key: 'listId' | 'leadId' | 'leadEmail'): string => {
  const value = secret.resourceIds?.[key]?.trim();
  if (!value) {
    throw new Error(`MARKETO_AUDIENCE live tests require resourceIds.${key}`);
  }
  return value;
};

const baseUrl = (secret: LiveSecret) => `https://${String(secret.config.accountId)}.mktorest.com`;

// Helper failures are rethrown without the Axios error, which would carry the request and body.
const call = async (ctx: RunContext, method: 'GET' | 'DELETE', path: string, params: object) => {
  const { liveSecret } = ctx;
  try {
    const token = await axios.get<{ access_token: string }>(
      `${baseUrl(liveSecret)}/identity/oauth/token`,
      {
        params: {
          client_id: liveSecret.config.clientId,
          client_secret: liveSecret.config.clientSecret,
          grant_type: 'client_credentials',
        },
        httpsAgent: agent,
        timeout: 15000,
      },
    );
    const response = await axios.request<unknown>({
      method,
      url: `${baseUrl(liveSecret)}${path}`,
      params,
      headers: { Authorization: `Bearer ${token.data.access_token}` },
      httpsAgent: agent,
      timeout: 15000,
    });
    return response.data;
  } catch {
    throw new Error(`MARKETO_AUDIENCE live helper ${method} ${path} failed`);
  }
};

const isMember = async (ctx: RunContext): Promise<boolean> => {
  const listId = resource(ctx.liveSecret, 'listId');
  const body = membershipSchema.parse(
    await call(ctx, 'GET', `/rest/v1/lists/${listId}/leads/ismember.json`, {
      id: resource(ctx.liveSecret, 'leadId'),
    }),
  );
  return body.result[0]?.status === 'memberof';
};

const verifyMembership = (expected: boolean) => async (ctx: RunContext) => {
  const actual = await pollUntil(
    async () => {
      const value = await isMember(ctx);
      return { done: value === expected, value };
    },
    { label: 'MARKETO_AUDIENCE membership', attempts: 6, delayMs: () => 2000, soft: true },
  );
  expect(actual).toBe(expected);
};

const startOutsideList = async (ctx: RunContext) => {
  if (await isMember(ctx)) {
    throw new Error('MARKETO_AUDIENCE live test lead must start outside the static list');
  }
  // Armed only now, so a run never removes a membership it did not create.
  ctx.register({ type: CLEANUP_RESOURCE, id: resource(ctx.liveSecret, 'leadId') });
};

const cleanupMembership = async (ctx: RunContext) => {
  if (!ctx.resources.some((r) => r.type === CLEANUP_RESOURCE)) return;
  const listId = resource(ctx.liveSecret, 'listId');
  await call(ctx, 'DELETE', `/rest/v1/lists/${listId}/leads.json`, {
    id: resource(ctx.liveSecret, 'leadId'),
  });
};

const byLeadId =
  (action: RecordAction, leadId = (ctx: RunContext) => resource(ctx.liveSecret, 'leadId')) =>
  (ctx: RunContext) => ({
    type: 'record',
    action,
    recordId: ctx.identity(`record-${leadId(ctx)}`),
    identifiers: { id: leadId(ctx) },
  });

// Upper-cased on purpose: the lookup lowercases, and Marketo must match case-insensitively.
const byEmail = (action: RecordAction) => (ctx: RunContext) => ({
  type: 'record',
  action,
  recordId: ctx.identity('record-email'),
  identifiers: { id: null, email: resource(ctx.liveSecret, 'leadEmail').toUpperCase() },
});

export const live = {
  enabled: false,
  authType: 'apiKey',
  resolveConfig: (secret) => ({
    rudderAccountId: 'live-marketo-audience-account',
    accountId: secret.config.accountId,
    clientId: secret.config.clientId,
    clientSecret: secret.config.clientSecret,
    connectionMode: { warehouse: 'cloud' },
  }),
  resolveConnection: (secret) => ({
    destination: {
      audienceId: resource(secret, 'listId'),
      createAudience: 'no',
      syncMode: 'mirror',
      identifierMappings: [
        { from: 'MARKETO_LEAD_ID', to: 'id' },
        { from: 'EMAIL', to: 'email' },
      ],
      schemaVersion: '1.1',
      eventType: 'record',
    },
  }),
  scenarios: [
    {
      id: 'marketo-audience-lead-id-add-remove',
      description: 'A lead ID is added and removed, including a repeated add and a repeated remove',
      cleanup: cleanupMembership,
      steps: [
        { stepType: 'action', name: 'lead starts outside the list', run: startOutsideList },
        {
          stepType: 'pipeline',
          name: 'add by lead ID',
          seed: byLeadId(RecordAction.INSERT),
          expectedOutputs: 1,
          expectedProxyRequests: 1,
        },
        { stepType: 'verify', name: 'lead is a member', check: verifyMembership(true) },
        {
          stepType: 'pipeline',
          name: 're-add an existing member',
          seed: byLeadId(RecordAction.UPDATE),
          expectedOutputs: 1,
        },
        {
          stepType: 'pipeline',
          name: 'remove by lead ID',
          seed: byLeadId(RecordAction.DELETE),
          expectedOutputs: 1,
        },
        { stepType: 'verify', name: 'lead is not a member', check: verifyMembership(false) },
        {
          stepType: 'pipeline',
          name: 'remove a non-member',
          seed: byLeadId(RecordAction.DELETE),
          expectedOutputs: 1,
        },
      ],
    },
    {
      id: 'marketo-audience-email-add-remove',
      description: 'An email is looked up case-insensitively, then added and removed',
      cleanup: cleanupMembership,
      steps: [
        { stepType: 'action', name: 'lead starts outside the list', run: startOutsideList },
        {
          stepType: 'pipeline',
          name: 'add by email',
          seed: byEmail(RecordAction.INSERT),
          expectedOutputs: 1,
        },
        { stepType: 'verify', name: 'lead is a member', check: verifyMembership(true) },
        {
          stepType: 'pipeline',
          name: 'remove by email',
          seed: byEmail(RecordAction.DELETE),
          expectedOutputs: 1,
        },
        { stepType: 'verify', name: 'lead is not a member', check: verifyMembership(false) },
      ],
    },
    {
      id: 'marketo-audience-partial-failure',
      description: 'An unknown lead ID fails alone; the known lead in the same request is added',
      cleanup: cleanupMembership,
      steps: [
        { stepType: 'action', name: 'lead starts outside the list', run: startOutsideList },
        {
          stepType: 'pipeline',
          name: 'add a known and an unknown lead in one request',
          seed: (ctx) => [
            byLeadId(RecordAction.INSERT)(ctx),
            byLeadId(RecordAction.INSERT, () => UNKNOWN_LEAD_ID)(ctx),
          ],
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          expectedFailure: { items: [1] },
        },
        { stepType: 'verify', name: 'known lead is a member', check: verifyMembership(true) },
      ],
    },
  ],
} satisfies LiveSpec;

export default live;
