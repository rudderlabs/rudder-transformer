import { ConfigurationError } from '@rudderstack/integrations-lib';
import {
  BodyFormat,
  CustomBatchStrategy,
  DestinationIntegration,
  toTransformError,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import type {
  BatchStrategy,
  TransformedEvent,
  TransformResult,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import { chunkPayloads } from '../../../services/destination/destinationIntegration/chunkPayloads';
import { sandboxedEvaluateHttpBody, sandboxedEvaluateRequestFields } from './templateSandboxClient';
import type { EvaluatedRequestFields, RequestFieldResult } from './httpTemplateSandbox';
import { HttpConfigSchema, HttpInputSchema } from './types';
import type { HttpBody as Body, HttpConfig as Config, HttpInput as Input } from './types';
import { makeAuthHeaders, makeEndpoint, toExpressions } from './utils';

const NO_FIELDS: RequestFieldResult = {
  ok: true,
  fields: { headers: {}, params: {}, pathParams: [] },
};

class HttpIntegration extends DestinationIntegration<Body, typeof HttpInputSchema> {
  private parsedConfig?: Config;

  private authHeaders: Record<string, string> = {};

  // Request fields are evaluated for the whole batch in one isolate call; transformEvent reads them.
  private fieldResults = new Map<Input, RequestFieldResult>();

  private get config(): Config {
    this.parsedConfig ??= HttpConfigSchema.parse(this.destination.Config);
    return this.parsedConfig;
  }

  async transformEvents(
    inputs: Input[],
    reqMetadata?: NonNullable<unknown>,
  ): Promise<TransformResult<Body>> {
    // The input schema has already validated this config for every input.
    this.authHeaders = makeAuthHeaders(this.config);
    const expressions = toExpressions(this.config);
    const { headers, queryParams, pathParams } = expressions;
    // Skip the isolate round-trip (and copying every message into it) when nothing is mapped.
    if (headers.length + queryParams.length + pathParams.length > 0) {
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
    return HttpInputSchema;
  }
}

export const Integration = HttpIntegration;
