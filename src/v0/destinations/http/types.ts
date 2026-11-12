import { z } from 'zod';
import { makeRouterInputSchema } from '../../../services/destination/destinationIntegration/destinationIntegration';

// New v2 config stores bare names; migrated v1 mappings may use dot or bracket notation.
// Returns undefined for a `$`-prefixed key that is not a single field reference.
export const mappingKey = (key: string): string | undefined => {
  if (!key.startsWith('$')) return key;
  const match = key.match(/^\$(?:\.(?:'([^']+)'|([\w.-]+))|\['([^']+)']|\["([^"]+)"])$/);
  return match ? (match[1] ?? match[2] ?? match[3] ?? match[4]) : undefined;
};

const mapping = z.object({
  to: z
    .string()
    .min(1)
    .refine(
      (key) => mappingKey(key) !== undefined,
      (key) => ({
        message: `Invalid request field name: ${key}`,
      }),
    ),
  from: z.string(),
});

export const DEFAULT_METHOD = 'POST';
export const MAX_BATCH_SIZE = 5000;

// Defaults are applied in the router: the framework validates against this schema but hands
// the destination its raw config.
const batchSize = z.coerce.number().int().min(1).max(MAX_BATCH_SIZE);
const pathParams = z.array(z.object({ path: z.string() }));
const mappings = z.array(mapping);

const overrideGroup = z
  .object({
    name: z.string().min(1),
    events: z.array(z.string().min(1)).min(1).max(100),
    pathParams: pathParams.optional(),
    queryParams: mappings.optional(),
    requestBodyTemplate: z.string().min(1).optional(),
    maxBatchSize: batchSize.optional(),
  })
  .refine(
    ({ pathParams: paths, queryParams: queries, requestBodyTemplate, maxBatchSize }) =>
      paths !== undefined ||
      queries !== undefined ||
      requestBodyTemplate !== undefined ||
      maxBatchSize !== undefined,
    'An event override must set at least one request setting',
  );

export const MAX_EVENT_OVERRIDES = 20;
const overrideGroupsSchema = z.array(overrideGroup).max(MAX_EVENT_OVERRIDES).optional();

const HttpDestinationConfigSchema = z
  .object({
    apiUrl: z.string().min(1),
    requestBodyTemplate: z.string().min(1),
    method: z.enum(['POST', 'PUT', 'PATCH', 'GET', 'DELETE']).optional(),
    format: z.enum(['JSON', 'XML', 'FORM']).optional(),
    maxBatchSize: batchSize.optional(),
    headers: mappings.optional(),
    queryParams: mappings.optional(),
    pathParams: pathParams.optional(),
    eventOverrides: overrideGroupsSchema,
    authenticationEnabled: z.boolean().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    bearerToken: z.string().optional(),
    apiKeyName: z.string().optional(),
    apiKeyValue: z.string().optional(),
  })
  .superRefine((config, ctx) => {
    const require = (field: keyof typeof config, message: string) => {
      if (!config[field]) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
    };
    if (!config.authenticationEnabled) return;
    // Same precedence as makeAuthHeaders: username, then bearerToken, then apiKeyName.
    if (config.username || config.bearerToken) return;
    if (config.apiKeyName) {
      require('apiKeyValue', 'API key value is required');
    } else {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['authenticationEnabled'],
        message: 'Authentication is enabled, but no account credentials were found',
      });
    }
  });

export const HttpInputSchema = makeRouterInputSchema({
  message: z.record(z.unknown()),
  destinationConfig: HttpDestinationConfigSchema,
});

export type HttpDestinationConfig = z.infer<typeof HttpDestinationConfigSchema>;
export type HttpInput = z.infer<typeof HttpInputSchema>;
export type HttpBody = Record<string, unknown>;
