import { z } from 'zod';
import { makeRouterInputSchema } from '../../../services/destination/destinationIntegration/destinationIntegration';
import { getDestinationVersion } from '../../../util/utils';
import { OAUTH_ACCOUNT_DEFINITION } from './frameworkConfig';

const config = z
  .object({
    domain: z.string().regex(/^[\da-z](?:[\da-z-]*[\da-z])?$/i, 'Invalid Zendesk subdomain'),
    email: z.string().optional(),
    apiToken: z.string().optional(),
    rudderAccountId: z.string().optional(),
    createUsersAsVerified: z.boolean().optional(),
    sendGroupCallsWithoutUserId: z.boolean().optional(),
    removeUsersFromOrganization: z.boolean().optional(),
    searchByExternalId: z.boolean().optional(),
    sourceName: z.string().optional(),
  })
  .passthrough();

export const zendeskInputSchema = makeRouterInputSchema({
  destinationConfig: config,
  message: z.object({ type: z.enum(['identify', 'group', 'track']) }).passthrough(),
}).superRefine((input, ctx) => {
  const { Config, version, deliveryAccount } = input.destination as typeof input.destination & {
    version?: number;
    deliveryAccount?: { id?: string; accountDefinitionName?: string };
  };
  const metadata = input as typeof input & { metadata?: { secret?: { accessToken?: string } } };
  if (getDestinationVersion(version) >= 2) {
    if (
      !Config.rudderAccountId ||
      !deliveryAccount ||
      deliveryAccount.accountDefinitionName !== OAUTH_ACCOUNT_DEFINITION ||
      deliveryAccount.id !== Config.rudderAccountId
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['destination', 'Config', 'rudderAccountId'],
        message: 'Zendesk v2 requires a linked OAuth account',
      });
    }
    if (
      typeof metadata.metadata?.secret?.accessToken !== 'string' ||
      metadata.metadata.secret.accessToken.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['destination', 'Config', 'rudderAccountId'],
        message: 'Zendesk OAuth access token is unavailable',
      });
    }
  } else if (!Config.email || !Config.apiToken) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['destination', 'Config'],
      message: 'Zendesk email and API token are required',
    });
  }
});

export type ZendeskInput = z.infer<typeof zendeskInputSchema> & {
  destination: { ID: string; version?: number };
  metadata: { jobId?: number; secret?: { accessToken?: string } };
};
export type ZendeskMessage = ZendeskInput['message'] & {
  userId?: string;
  groupId?: string;
  event?: string;
  properties?: Record<string, unknown>;
  traits?: Record<string, any>;
  context?: { traits?: Record<string, any> };
};
