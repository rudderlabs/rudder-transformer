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
const HttpDestinationConfigSchema = z
  .object({
    apiUrl: z.string().min(1),
    requestBodyTemplate: z.string().min(1),
    method: z.enum(['POST', 'PUT', 'PATCH', 'GET', 'DELETE']).optional(),
    maxBatchSize: z.coerce.number().int().min(1).max(MAX_BATCH_SIZE).optional(),
    headers: z.array(mapping).optional(),
    queryParams: z.array(mapping).optional(),
    pathParams: z.array(z.object({ path: z.string() })).optional(),
    auth: z.enum(['noAuth', 'basicAuth', 'bearerTokenAuth', 'apiKeyAuth']).optional(),
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
    if (config.auth === 'basicAuth') {
      require('username', 'Username is required for Basic Authentication');
    } else if (config.auth === 'bearerTokenAuth') {
      require('bearerToken', 'Token is required for Bearer Token Authentication');
    } else if (config.auth === 'apiKeyAuth') {
      require('apiKeyName', 'API key name is required');
      require('apiKeyValue', 'API key value is required');
    }
  });

export const HttpInputSchema = makeRouterInputSchema({
  message: z.record(z.unknown()),
  destinationConfig: HttpDestinationConfigSchema,
});

export type HttpDestinationConfig = z.infer<typeof HttpDestinationConfigSchema>;
export type HttpInput = z.infer<typeof HttpInputSchema>;
export type HttpBody = { message: Record<string, unknown> };
