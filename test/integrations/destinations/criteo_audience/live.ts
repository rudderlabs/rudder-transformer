import axios from 'axios';
import { Agent } from 'https';
import { BASE_ENDPOINT } from '../../../../src/v0/destinations/criteo_audience/config';
import { LiveScenario, LiveSpec, RunContext } from '../../live/types';

const criteoAgent = new Agent({ keepAlive: false });

type IdentifierType = 'email' | 'madid' | 'identityLink';

// resourceIds key holding the dedicated Contact List audience id for each identifier type.
const AUDIENCE_ID_KEY: Record<IdentifierType, string> = {
  email: 'email-audience-id',
  madid: 'madid-audience-id',
  identityLink: 'identity-link-audience-id',
};

const accessTokenOf = (ctx: RunContext): string | undefined => ctx.liveSecret.secret?.accessToken;

const audienceIdForType = (ctx: RunContext, type: IdentifierType): string | undefined =>
  ctx.liveSecret.resourceIds?.[AUDIENCE_ID_KEY[type]];

const emailIdentifiers = (ctx: RunContext): string[] => [ctx.email('a'), ctx.email('b')];
const madidIdentifiers = (ctx: RunContext): string[] => [
  ctx.identity('madid-1'),
  ctx.identity('madid-2'),
];
const identityLinkIdentifiers = (ctx: RunContext): string[] => [
  ctx.identity('identitylink-1'),
  ctx.identity('identitylink-2'),
];

const listEntries = (type: IdentifierType, values: string[]) =>
  values.map((value) => ({ [type]: value }));

// Direct Criteo contactlist PATCH used only for teardown; best-effort.
const patchContactList = async (
  ctx: RunContext,
  audienceId: string,
  attributes: Record<string, unknown>,
): Promise<void> => {
  await axios.request({
    method: 'PATCH',
    url: `${BASE_ENDPOINT}audiences/${audienceId}/contactlist`,
    headers: {
      Authorization: `Bearer ${accessTokenOf(ctx)}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    data: { data: { type: 'ContactlistAmendment', attributes } },
    httpsAgent: criteoAgent,
    timeout: 15000,
    validateStatus: () => true,
  });
};

const cleanupRemove =
  (
    type: IdentifierType,
    identifiers: (ctx: RunContext) => string[],
    extraAttributes: Record<string, unknown> = {},
  ) =>
  async (ctx: RunContext): Promise<void> => {
    const audienceId = audienceIdForType(ctx, type);
    if (!audienceId || !accessTokenOf(ctx)) {
      return;
    }
    await patchContactList(ctx, audienceId, {
      operation: 'remove',
      identifierType: type,
      internalIdentifiers: false,
      identifiers: identifiers(ctx),
      ...extraAttributes,
    });
  };

const audienceListSeed = (
  ctx: RunContext,
  listData: Record<string, unknown>,
  context: Record<string, unknown> = {},
): Record<string, unknown> => ({
  type: 'audiencelist',
  userId: ctx.identity('user'),
  timestamp: ctx.now(),
  context: { library: { name: 'rudder-live-integration-test' }, ...context },
  properties: { listData },
});

const scenarios: LiveScenario[] = [
  {
    id: 'criteo-audience-add-email',
    description: 'Event-stream audiencelist adds email identifiers to the email audience (add)',
    cleanup: cleanupRemove('email', emailIdentifiers),
    steps: [
      {
        stepType: 'pipeline',
        name: 'add email identifiers',
        expectedOutputs: 1,
        expectedProxyRequests: 1,
        seed: (ctx) => audienceListSeed(ctx, { add: listEntries('email', emailIdentifiers(ctx)) }),
      },
    ],
  },
  {
    id: 'criteo-audience-add-remove-madid',
    description:
      'Event-stream audiencelist with both add and remove for madid -> two amendments (operation fan-out)',
    configOverride: (base, secret) => ({
      ...base,
      audienceType: 'madid',
      audienceId: secret.resourceIds?.[AUDIENCE_ID_KEY.madid],
    }),
    cleanup: cleanupRemove('madid', madidIdentifiers),
    steps: [
      {
        stepType: 'pipeline',
        name: 'add and remove madid identifiers',
        expectedOutputs: 1,
        expectedProxyRequests: 2,
        seed: (ctx) =>
          audienceListSeed(ctx, {
            add: listEntries('madid', madidIdentifiers(ctx)),
            remove: listEntries('madid', [madidIdentifiers(ctx)[0]]),
          }),
      },
    ],
  },
  {
    id: 'criteo-audience-add-identitylink',
    description:
      'Event-stream audiencelist adds identityLink identifiers (audienceType=identityLink)',
    configOverride: (base, secret) => ({
      ...base,
      audienceType: 'identityLink',
      audienceId: secret.resourceIds?.[AUDIENCE_ID_KEY.identityLink],
    }),
    cleanup: cleanupRemove('identityLink', identityLinkIdentifiers),
    steps: [
      {
        stepType: 'pipeline',
        name: 'add identityLink identifiers',
        expectedOutputs: 1,
        expectedProxyRequests: 1,
        seed: (ctx) =>
          audienceListSeed(ctx, { add: listEntries('identityLink', identityLinkIdentifiers(ctx)) }),
      },
    ],
  },
  {
    id: 'criteo-audience-retl-email',
    description:
      'RETL (mappedToDestination) resolves the audience id from context.externalId (CRITEO_AUDIENCE-<id>) and delivers',
    // RETL resolves the audience id from externalId, so drop audienceId from Config.
    configOverride: (base) => {
      const next = { ...base };
      delete next.audienceId;
      return next;
    },
    cleanup: cleanupRemove('email', emailIdentifiers),
    steps: [
      {
        stepType: 'pipeline',
        name: 'retl add email identifiers',
        expectedOutputs: 1,
        expectedProxyRequests: 1,
        seed: (ctx) =>
          audienceListSeed(
            ctx,
            { add: listEntries('email', emailIdentifiers(ctx)) },
            {
              mappedToDestination: 'true',
              externalId: [
                {
                  type: `CRITEO_AUDIENCE-${audienceIdForType(ctx, 'email')}`,
                  identifierType: 'EMAIL',
                },
              ],
              sources: {
                job_run_id: ctx.runId,
                task_run_id: ctx.runId,
                job_id: `live-${ctx.runId}`,
                version: 'live',
              },
            },
          ),
      },
    ],
  },
];

export const live: LiveSpec = {
  enabled: true,
  authType: 'oauth',
  resolveConfig: (s) => ({
    audienceType: 'email',
    audienceId: s.resourceIds?.[AUDIENCE_ID_KEY.email],
    ...s.config,
  }),
  scenarios,
};

export default live;
