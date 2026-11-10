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
import { isObject, removeUndefinedAndNullValues, removeUndefinedValues } from '../../util';
import { chunkPayloads } from '../../../services/destination/destinationIntegration/chunkPayloads';
import { sandboxedEvaluateHttpBody, sandboxedEvaluateRequestFields } from './templateSandboxClient';
import type { EvaluatedRequestFields, RequestFieldResult } from './httpTemplateSandbox';
import { DEFAULT_METHOD, HttpInputSchema, MAX_BATCH_SIZE } from './types';
import type { HttpBody, HttpDestinationConfig, HttpInput } from './types';
import { makeAuthHeaders, makeEndpoint, toExpressions } from './utils';
// shortcut: move these shared serializers into src/v0/destinations/http/ when v1 retires.
import { metadataHeaders, prepareBody, sanitizeKey } from '../../../cdk/v2/destinations/http/utils';

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
      headers: {
        ...makeAuthHeaders(config),
        ...mapped,
        ...metadataHeaders(config.format ?? BodyFormat.JSON),
      },
      params: removeUndefinedValues(fields.params),
    };
  }

  getBatchStrategy(): BatchStrategy<HttpBody> {
    const { requestBodyTemplate, maxBatchSize, format = BodyFormat.JSON } = this.destination.Config;
    return new CustomBatchStrategy<HttpBody>(
      async (payloads) => {
        // FORM is always single-event, even when a stale config supplies maxBatchSize.
        const chunks = chunkPayloads(payloads, {
          maxItems: format === BodyFormat.FORM ? 1 : Number(maxBatchSize ?? MAX_BATCH_SIZE),
          wrapBody: () => ({}),
        });
        const bodies = await sandboxedEvaluateHttpBody(
          requestBodyTemplate,
          chunks.map((chunk) => chunk.bodies),
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
          if (format !== BodyFormat.JSON) {
            if (!isObject(result.body))
              return error(
                'Request body template must produce an object for XML/FORM format',
                chunk.jobIds,
              );
            const body = result.body as Record<string, unknown>;
            if (format === BodyFormat.FORM)
              return { body: prepareBody(body, format) as HttpBody, jobIds: chunk.jobIds };
            // v2 has no xmlRootKey: the template's single top-level key is the root element.
            const [root, ...extra] = Object.keys(body);
            if (!root || extra.length > 0 || !isObject(body[root]))
              return error(
                'Request body template must produce exactly one top-level key holding an object for XML format; that key becomes the root element',
                chunk.jobIds,
              );
            return {
              body: prepareBody(
                body[root] as Record<string, unknown>,
                format,
                sanitizeKey(root),
              ) as HttpBody,
              jobIds: chunk.jobIds,
            };
          }
          const batch = JSON.stringify(result.body);
          if (batch === undefined || result.body === null) {
            return error('Request body template did not produce JSON', chunk.jobIds);
          }
          return { body: { batch }, jobIds: chunk.jobIds };
        });
      },
      format === BodyFormat.JSON ? BodyFormat.JSON_ARRAY : BodyFormat[format],
    );
  }

  getInputSchema() {
    return HttpInputSchema;
  }
}

export const Integration = HttpIntegration;
