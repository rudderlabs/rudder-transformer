import { ConfigurationError } from '@rudderstack/integrations-lib';
import { z } from 'zod';
import {
  BodyFormat,
  CustomBatchStrategy,
  DestinationIntegration,
  makeRouterInputSchema,
  toTransformError,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import type {
  BatchStrategy,
  TransformedEvent,
  TransformResult,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import { chunkPayloads } from '../../../services/destination/destinationIntegration/chunkPayloads';
import { sandboxedEvaluateHttpBody, sandboxedEvaluateRequestFields } from './templateSandboxClient';
import type {
  RequestFieldExpressions,
  EvaluatedRequestFields,
  RequestFieldResult,
} from './httpTemplateSandbox';
import { requestFieldExpression } from './requestFields';

const mapping = z.object({ to: z.string().min(1), from: z.string() });
const pathParam = z.object({ path: z.string() });
const configSchema = z.object({
  apiUrl: z.string().min(1),
  requestBodyTemplate: z.string().min(1),
  method: z.enum(['POST', 'PUT', 'PATCH', 'GET', 'DELETE']).default('POST'),
  maxBatchSize: z.coerce.number().int().min(1).max(5000).default(5000),
  headers: z.array(mapping).optional(),
  queryParams: z.array(mapping).optional(),
  pathParams: z.array(pathParam).optional(),
  auth: z.enum(['noAuth', 'basicAuth', 'bearerTokenAuth', 'apiKeyAuth']).optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  bearerToken: z.string().optional(),
  apiKeyName: z.string().optional(),
  apiKeyValue: z.string().optional(),
});
const inputSchema = makeRouterInputSchema({
  message: z.record(z.unknown()),
  destinationConfig: configSchema,
});
type Input = z.infer<typeof inputSchema>;
type Body = { message: Record<string, unknown> };
type Config = z.infer<typeof configSchema>;

const mappingKey = (key: string): string => {
  // New v2 config stores bare names; migrated v1 mappings may use dot or bracket notation.
  if (!key.startsWith('$')) return key;
  const match = key.match(/^\$(?:\.(?:'([^']+)'|([\w.-]+))|\['([^']+)']|\["([^"]+)"])$/);
  if (!match) throw new ConfigurationError(`Invalid request field name: ${key}`);
  return match[1] ?? match[2] ?? match[3] ?? match[4];
};

const toExpressions = (config: Config): RequestFieldExpressions => {
  const convert = ({ to, from }: z.infer<typeof mapping>) => ({
    to: mappingKey(to),
    from: requestFieldExpression(from),
  });
  return {
    headers: (config.headers ?? []).map(convert),
    queryParams: (config.queryParams ?? []).map(convert),
    pathParams: (config.pathParams ?? []).map(({ path }) => requestFieldExpression(path)),
  };
};

const NO_FIELDS: RequestFieldResult = {
  ok: true,
  fields: { headers: {}, params: {}, pathParams: [] },
};

const makeEndpoint = (url: string, pathParams: unknown[]): string => {
  const parts = pathParams.map((part) => {
    if (!['string', 'number', 'boolean'].includes(typeof part)) {
      throw new ConfigurationError('Path segment could not be resolved to a scalar');
    }
    return encodeURIComponent(String(part));
  });
  return parts.length > 0 ? `${url.replace(/\/$/, '')}/${parts.join('/')}` : url;
};

const makeAuthHeaders = (config: Config): Record<string, string> => {
  switch (config.auth) {
    case 'basicAuth':
      if (!config.username)
        throw new ConfigurationError('Username is required for Basic Authentication');
      return {
        Authorization: `Basic ${Buffer.from(`${config.username}:${config.password ?? ''}`).toString('base64')}`,
      };
    case 'bearerTokenAuth':
      if (!config.bearerToken)
        throw new ConfigurationError('Token is required for Bearer Token Authentication');
      return { Authorization: `Bearer ${config.bearerToken}` };
    case 'apiKeyAuth':
      if (!config.apiKeyName || !config.apiKeyValue)
        throw new ConfigurationError('API key name and value are required');
      return { [config.apiKeyName]: config.apiKeyValue };
    default:
      return {};
  }
};

class HttpIntegration extends DestinationIntegration<Body, typeof inputSchema> {
  private parsedConfig?: Config;

  private authHeaders: Record<string, string> = {};

  // Request fields are evaluated for the whole batch in one isolate call; transformEvent reads them.
  private fieldResults = new Map<Input, RequestFieldResult>();

  private setupError?: Error;

  private get config(): Config {
    this.parsedConfig ??= configSchema.parse(this.destination.Config);
    return this.parsedConfig;
  }

  async transformEvents(
    inputs: Input[],
    reqMetadata?: NonNullable<unknown>,
  ): Promise<TransformResult<Body>> {
    let expressions: RequestFieldExpressions | undefined;
    try {
      this.authHeaders = makeAuthHeaders(this.config);
      expressions = toExpressions(this.config);
    } catch (error) {
      this.setupError = error as Error;
    }
    // Skip the isolate round-trip (and copying every message into it) when nothing is mapped.
    const { headers = [], queryParams = [], pathParams = [] } = expressions ?? {};
    if (expressions && headers.length + queryParams.length + pathParams.length > 0) {
      const results = await sandboxedEvaluateRequestFields(
        expressions,
        inputs.map(({ message }) => message),
        this.destination.WorkspaceID,
      );
      inputs.forEach((input, i) => this.fieldResults.set(input, results[i]));
    }
    return super.transformEvents(inputs, reqMetadata);
  }

  transformEvent(input: Input): TransformedEvent<Body> {
    if (this.setupError) throw this.setupError;
    const result = this.fieldResults.get(input) ?? NO_FIELDS;
    if (!result.ok)
      throw new ConfigurationError(`Request field evaluation failed: ${result.error}`);
    return this.makeEvent(input.message, result.fields, this.config, this.authHeaders);
  }

  private makeEvent(
    message: Record<string, unknown>,
    fields: EvaluatedRequestFields,
    config: Config,
    authHeaders: Record<string, string>,
  ): TransformedEvent<Body> {
    const headers: Record<string, unknown> = {
      ...authHeaders,
      ...fields.headers,
      'Content-Type': 'application/json',
    };
    for (const [key, value] of Object.entries(headers)) {
      if (typeof value !== 'string')
        throw new ConfigurationError(`Header "${key}" must resolve to a string`);
    }
    return {
      body: { message },
      endpoint: makeEndpoint(config.apiUrl, fields.pathParams),
      endpointPath: '/http',
      method: config.method,
      headers,
      params: Object.fromEntries(
        Object.entries(fields.params).filter(([, value]) => value !== undefined),
      ),
    };
  }

  getBatchStrategy(): BatchStrategy<Body> {
    const { requestBodyTemplate, maxBatchSize } = this.config;
    return new CustomBatchStrategy<Body>(async (payloads) => {
      const chunks = chunkPayloads(payloads, { maxItems: maxBatchSize, wrapBody: () => ({}) });
      const bodies = await sandboxedEvaluateHttpBody(
        requestBodyTemplate,
        chunks.map(({ bodies: items }) => items.map(({ message }) => message)),
        this.destination.WorkspaceID,
      );
      const error = (message: string, jobIds: Set<number>) => ({
        body: {},
        jobIds,
        error: toTransformError(new ConfigurationError(message)),
      });
      return chunks.map((chunk, i) => {
        const result = bodies[i];
        if (!result.ok)
          return error(`Failed to evaluate requestBody template: ${result.error}`, chunk.jobIds);
        const batch = JSON.stringify(result.body);
        if (batch === undefined || result.body === null) {
          return error('Request body template did not produce JSON', chunk.jobIds);
        }
        return { body: { batch }, jobIds: chunk.jobIds };
      });
    }, BodyFormat.JSON_ARRAY);
  }

  getInputSchema() {
    return inputSchema;
  }
}

export const Integration = HttpIntegration;
