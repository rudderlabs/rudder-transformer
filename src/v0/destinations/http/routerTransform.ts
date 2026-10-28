import { ConfigurationError } from '@rudderstack/integrations-lib';
import lodash from 'lodash';
import {
  BodyFormat,
  ChunkBatchStrategy,
  DestinationIntegration,
  toTransformError,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import type {
  BatchStrategy,
  TransformedEvent,
  TransformResult,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import { removeUndefinedAndNullValues, removeUndefinedValues } from '../../util';
import { groupPayloadsByCompositeKey } from '../../../services/destination/destinationIntegration/processDestinationIntegration';
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
    return this.buildRequestBodies(await super.transformEvents(inputs, reqMetadata));
  }

  /**
   * The body template is evaluated per chunk (`$$.events` is the chunk), so chunks are built here
   * rather than in the batch strategy: a chunk whose template fails then becomes an ordinary
   * per-job transform error, before the framework batches anything.
   */
  private async buildRequestBodies({
    successPayloads,
    errorPayloads,
  }: TransformResult<HttpBody>): Promise<TransformResult<HttpBody>> {
    const { requestBodyTemplate, maxBatchSize = MAX_BATCH_SIZE } = this.destination.Config;
    // Raw config: the control plane sends maxBatchSize as a string.
    const chunks = groupPayloadsByCompositeKey(successPayloads).flatMap((group) =>
      lodash.chunk(group.payloads, Number(maxBatchSize)),
    );
    if (chunks.length === 0) return { successPayloads, errorPayloads };
    const bodies = await sandboxedEvaluateHttpBody(
      requestBodyTemplate,
      chunks.map((chunk) => chunk.map(({ body }) => body)),
      this.destination.WorkspaceID,
    );
    const output: TransformResult<HttpBody> = { successPayloads: [], errorPayloads };
    chunks.forEach((chunk, i) => {
      const result = bodies[i];
      const batch = result.ok ? JSON.stringify(result.body) : undefined;
      let failure: string | undefined;
      if (!result.ok) failure = `Failed to evaluate requestBody template: ${result.error}`;
      else if (batch === undefined || result.body === null)
        failure = 'Request body template did not produce JSON';
      if (failure) {
        const error = toTransformError(new ConfigurationError(failure));
        chunk.forEach(({ jobId }) => output.errorPayloads.push({ ...error, jobId }));
        return;
      }
      // Unique per chunk, so the framework groups exactly this chunk into one request.
      const internalGroupKey = `chunk-${i}`;
      const body = { batch };
      chunk.forEach((payload) =>
        output.successPayloads.push({ ...payload, body, internalGroupKey }),
      );
    });
    return output;
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
    // Like v1, a mapped header whose source is missing is dropped rather than failing the event.
    const mapped = removeUndefinedAndNullValues(fields.headers);
    for (const [key, value] of Object.entries(mapped)) {
      if (typeof value !== 'string')
        throw new ConfigurationError(`Header "${key}" must resolve to a string`);
    }
    return {
      body: message,
      endpoint: makeEndpoint(config.apiUrl, fields.pathParams),
      endpointPath: '/http',
      method: config.method ?? DEFAULT_METHOD,
      headers: { ...makeAuthHeaders(config), ...mapped, 'Content-Type': 'application/json' },
      params: removeUndefinedValues(fields.params),
    };
  }

  getBatchStrategy(): BatchStrategy<HttpBody> {
    // transformEvents built each chunk's body; every payload in a group shares it.
    return new ChunkBatchStrategy<HttpBody>({
      wrapBody: ([body]) => body,
      bodyFormat: BodyFormat.JSON_ARRAY,
    });
  }

  getInputSchema() {
    return HttpInputSchema;
  }
}

export const Integration = HttpIntegration;
