import { ConfigurationError, PlatformError } from '@rudderstack/integrations-lib';
import { z } from 'zod';
import {
  BodyFormat,
  CustomBatchStrategy,
  DestinationIntegration,
  makeRouterInputSchema,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import type {
  BatchStrategy,
  TransformedEvent,
  TransformResult,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import { chunkPayloads } from '../../../services/destination/destinationIntegration/chunkPayloads';
import { generateErrorObject } from '../../util';
import {
  sandboxedEvaluateHttpBody,
  sandboxedEvaluateRequestFields,
} from '../custom_audience/template/templateSandboxClient';
import type {
  RequestFieldExpressions,
  EvaluatedRequestFields,
} from '../custom_audience/template/templateEngineSandbox';
import { requestFieldExpression } from './requestFields';
import { ERROR_MESSAGES } from '../custom_audience/constants';

const mapping = z.object({ to: z.string().min(1), from: z.string() });
const pathParam = z.object({ path: z.string() });
const configSchema = z.object({
  apiUrl: z.string().min(1),
  requestBodyTemplate: z.string().min(1),
  method: z.enum(['POST', 'PUT', 'PATCH', 'GET', 'DELETE']).default('POST'),
  maxBatchSize: z.coerce.number().int().min(1).max(5000).default(100),
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
type RouterInput = Input & { metadata?: { jobId?: number } };

const mappingKey = (key: string): string => {
  // New v2 config stores bare names; migrated v1 mappings may use dot or bracket notation.
  if (!key.startsWith('$')) return key;
  const match = key.match(/^\$(?:\.(?:'([^']+)'|([\w.-]+))|\['([^']+)']|\["([^"]+)"])$/);
  if (!match) throw new ConfigurationError(`Invalid request field name: ${key}`);
  return match[1] ?? match[2] ?? match[3] ?? match[4];
};

const toExpressions = (config: z.infer<typeof configSchema>): RequestFieldExpressions => {
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

const makeEndpoint = (url: string, pathParams: unknown[]): string => {
  const parts = pathParams.map((part) => {
    if (!['string', 'number', 'boolean'].includes(typeof part)) {
      throw new ConfigurationError('Path segment could not be resolved to a scalar');
    }
    return encodeURIComponent(String(part));
  });
  return parts.length > 0 ? `${url.replace(/\/$/, '')}/${parts.join('/')}` : url;
};

const makeAuthHeaders = (config: z.infer<typeof configSchema>): Record<string, string> => {
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

const toTransformError = (error: unknown) => {
  const err = generateErrorObject(error);
  return { error: err.message, statusCode: err.status, statTags: err.statTags };
};

class HttpIntegration extends DestinationIntegration<Body, typeof inputSchema> {
  // Unreachable: transformEvents is overridden to evaluate request fields for the whole batch.
  transformEvent(): never {
    throw new PlatformError('HTTP v2 transforms events in batch via transformEvents', 500);
  }

  private makeEvent(
    message: Record<string, unknown>,
    fields: EvaluatedRequestFields,
    config: z.infer<typeof configSchema>,
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

  async transformEvents(inputs: RouterInput[]): Promise<TransformResult<Body>> {
    let config: z.infer<typeof configSchema>;
    let authHeaders: Record<string, string>;
    let expressions: RequestFieldExpressions;
    try {
      config = configSchema.parse(this.destination.Config);
      authHeaders = makeAuthHeaders(config);
      expressions = toExpressions(config);
    } catch (error) {
      const err = toTransformError(error);
      return {
        successPayloads: [],
        errorPayloads: inputs.map(({ metadata }) => ({ jobId: metadata?.jobId ?? 0, ...err })),
      };
    }
    const { headers, queryParams, pathParams } = expressions;
    // Skip the isolate round-trip (and copying every message into it) when nothing is mapped.
    const results =
      headers.length + queryParams.length + pathParams.length > 0
        ? await sandboxedEvaluateRequestFields(
            expressions,
            inputs.map(({ message }) => message),
            this.destination.WorkspaceID,
          )
        : inputs.map(() => ({
            ok: true as const,
            fields: { headers: {}, params: {}, pathParams: [] },
          }));
    if (results.length !== inputs.length)
      throw new PlatformError('Request fields returned an unexpected number of results', 500);
    const output: TransformResult<Body> = { successPayloads: [], errorPayloads: [] };
    results.forEach((result, i) => {
      const jobId = inputs[i].metadata?.jobId ?? 0;
      try {
        if (!result.ok)
          throw new ConfigurationError(`Request field evaluation failed: ${result.error}`);
        output.successPayloads.push({
          ...this.makeEvent(inputs[i].message, result.fields, config, authHeaders),
          jobId,
        });
      } catch (error) {
        output.errorPayloads.push({ jobId, ...toTransformError(error) });
      }
    });
    return output;
  }

  getBatchStrategy(): BatchStrategy<Body> {
    const { requestBodyTemplate, maxBatchSize } = configSchema.parse(this.destination.Config);
    return new CustomBatchStrategy<Body>(async (payloads) => {
      const chunks = chunkPayloads(payloads, { maxItems: maxBatchSize, wrapBody: () => ({}) });
      const bodies = await sandboxedEvaluateHttpBody(
        requestBodyTemplate,
        chunks.map(({ bodies: items }) => items.map(({ message }) => message)),
        this.destination.WorkspaceID,
      );
      if (bodies.length !== chunks.length)
        throw new PlatformError('Template returned an unexpected number of bodies', 500);
      const error = (message: string, jobIds: Set<number>) => ({
        body: {},
        jobIds,
        error: toTransformError(new ConfigurationError(message)),
      });
      return chunks.map((chunk, i) => {
        const result = bodies[i];
        if (!result.ok)
          return error(ERROR_MESSAGES.TEMPLATE_EVALUATION_FAILED(result.error), chunk.jobIds);
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
