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
import { DEFAULT_METHOD, HttpInputSchema, MAX_BATCH_SIZE } from './types';
import type { HttpBody, HttpDestinationConfig, HttpInput } from './types';
import { makeAuthHeaders, makeEndpoint, toExpressions } from './utils';

const NO_FIELDS: RequestFieldResult = {
  ok: true,
  fields: { headers: {}, params: {}, pathParams: [] },
};

class HttpIntegration extends DestinationIntegration<HttpBody, typeof HttpInputSchema> {
  // Request fields are evaluated for the whole batch in one isolate call; transformEvent reads them.
  private fieldResults = new Map<HttpInput, RequestFieldResult>();

  async transformEvents(
    inputs: HttpInput[],
    reqMetadata?: NonNullable<unknown>,
  ): Promise<TransformResult<HttpBody>> {
    const expressions = toExpressions(this.destination.Config);
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

  transformEvent(input: HttpInput): TransformedEvent<HttpBody> {
    const result = this.fieldResults.get(input) ?? NO_FIELDS;
    if (!result.ok)
      throw new ConfigurationError(`Request field evaluation failed: ${result.error}`);
    return this.makeEvent(input.message, result.fields, this.destination.Config);
  }

  private makeEvent(
    message: Record<string, unknown>,
    fields: EvaluatedRequestFields,
    config: HttpDestinationConfig,
  ): TransformedEvent<HttpBody> {
    const headers: Record<string, unknown> = {
      ...makeAuthHeaders(config),
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
      method: config.method ?? DEFAULT_METHOD,
      headers,
      params: Object.fromEntries(
        Object.entries(fields.params).filter(([, value]) => value !== undefined),
      ),
    };
  }

  getBatchStrategy(): BatchStrategy<HttpBody> {
    const { requestBodyTemplate, maxBatchSize = MAX_BATCH_SIZE } = this.destination.Config;
    return new CustomBatchStrategy<HttpBody>(async (payloads) => {
      // Raw config: the control plane sends maxBatchSize as a string.
      const chunks = chunkPayloads(payloads, {
        maxItems: Number(maxBatchSize),
        wrapBody: () => ({}),
      });
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
