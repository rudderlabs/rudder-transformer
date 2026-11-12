import { ConfigurationError } from '@rudderstack/integrations-lib';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
import stats from '../../../util/stats';
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
import { DEFAULT_METHOD, HttpInputSchema, MAX_BATCH_SIZE, overrideGroupsSchema } from './types';
import type { HttpBody, HttpDestinationConfig, HttpInput } from './types';
import {
  effectiveConfig,
  makeAuthHeaders,
  makeEndpoint,
  resolveOverrideGroup,
  toExpressions,
} from './utils';
// shortcut: move these shared serializers into src/v0/destinations/http/ when v1 retires.
import { metadataHeaders, prepareBody, sanitizeKey } from '../../../cdk/v2/destinations/http/utils';

const NO_FIELDS: RequestFieldResult = {
  ok: true,
  fields: { headers: {}, params: {}, pathParams: [] },
};

const groupKey = (index?: number): string =>
  index === undefined ? 'default' : `override:${index}`;

const groupIndexFromKey = (key: string | undefined): number | undefined =>
  key?.startsWith('override:') ? Number(key.slice('override:'.length)) : undefined;

class HttpIntegration extends DestinationIntegration<HttpBody, typeof HttpInputSchema> {
  // Request fields are evaluated once per override partition; transformEvent reads the results.
  private fieldResults = new Map<HttpInput, RequestFieldResult>();

  private groupIndices = new Map<HttpInput, number | undefined>();

  recordCallMetrics(
    inputs: RouterTransformationRequestData[],
    tags: { destType: string; workspaceId: string; destinationId: string },
  ): void {
    // Config is unvalidated here; reject malformed groups only for matching metrics, not routing.
    const rawConfig: unknown = this.destination.Config;
    const rawGroups =
      rawConfig !== null && typeof rawConfig === 'object' && !Array.isArray(rawConfig)
        ? (rawConfig as Record<string, unknown>).eventOverrides
        : undefined;
    const parsedGroups = overrideGroupsSchema.safeParse(rawGroups);
    const groups = parsedGroups.success ? parsedGroups.data : undefined;
    let matched = 0;
    let unmatched = 0;
    for (const { message } of inputs) {
      if (message?.type === 'track') {
        if (resolveOverrideGroup(message, groups) === undefined) unmatched += 1;
        else matched += 1;
      }
    }
    stats.counter('http_event_override_events', matched, { ...tags, matched: 'true' });
    stats.counter('http_event_override_events', unmatched, { ...tags, matched: 'false' });
  }

  async transformEvents(
    inputs: HttpInput[],
    reqMetadata?: NonNullable<unknown>,
  ): Promise<TransformResult<HttpBody>> {
    const partitions = new Map<number | undefined, HttpInput[]>();
    for (const input of inputs) {
      const index = resolveOverrideGroup(input.message, this.destination.Config.eventOverrides);
      this.groupIndices.set(input, index);
      const partition = partitions.get(index) ?? [];
      partition.push(input);
      partitions.set(index, partition);
    }
    // Bound per-call isolate work: each partition copies its inputs into the same workspace heap.
    for (const [index, partition] of partitions) {
      const config = effectiveConfig(
        this.destination.Config,
        index === undefined ? undefined : this.destination.Config.eventOverrides?.[index as number],
      );
      const expressions = toExpressions(config);
      const { headers, queryParams, pathParams } = expressions;
      // Skip the isolate round-trip when nothing is mapped in this partition.
      if (headers.length + queryParams.length + pathParams.length > 0) {
        // eslint-disable-next-line no-await-in-loop -- evaluations must not overlap on one isolate
        const results = await sandboxedEvaluateRequestFields(
          expressions,
          partition.map(({ message }) => message),
          this.destination.WorkspaceID,
        );
        partition.forEach((input, i) => this.fieldResults.set(input, results[i]));
      }
    }
    return super.transformEvents(inputs, reqMetadata);
  }

  transformEvent(input: HttpInput): TransformedEvent<HttpBody> {
    const index = this.groupIndices.get(input);
    const group =
      index === undefined ? undefined : this.destination.Config.eventOverrides?.[index as number];
    const result = this.fieldResults.get(input) ?? NO_FIELDS;
    if (!result.ok)
      throw new ConfigurationError(
        `${group ? `Event override "${group.name}": ` : ''}Request field evaluation failed: ${result.error}`,
      );
    return this.makeEvent(
      input.message,
      result.fields,
      effectiveConfig(this.destination.Config, group),
      index,
    );
  }

  private makeEvent(
    message: Record<string, unknown>,
    fields: EvaluatedRequestFields,
    config: HttpDestinationConfig,
    groupIndex?: number,
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
      // Group separation is required even at the same URL: body templates and batch sizes can differ.
      internalGroupKey: groupKey(groupIndex),
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
    const { Config, WorkspaceID } = this.destination;
    const { format = BodyFormat.JSON, eventOverrides } = Config;
    return new CustomBatchStrategy<HttpBody>(
      async (payloads) => {
        const index = groupIndexFromKey(payloads[0].internalGroupKey);
        const { requestBodyTemplate, maxBatchSize } = effectiveConfig(
          Config,
          index === undefined ? undefined : eventOverrides?.[index as number],
        );
        // Raw config: the control plane sends maxBatchSize as a string.
        // FORM is always single-event, even when a stale config supplies maxBatchSize.
        const chunks = chunkPayloads(payloads, {
          maxItems: format === BodyFormat.FORM ? 1 : Number(maxBatchSize ?? MAX_BATCH_SIZE),
          wrapBody: () => ({}),
        });
        const bodies = await sandboxedEvaluateHttpBody(
          requestBodyTemplate,
          chunks.map((chunk) => chunk.bodies),
          WorkspaceID,
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
          if (format === BodyFormat.JSON) {
            const batch = JSON.stringify(result.body);
            if (batch === undefined || result.body === null) {
              return error('Request body template did not produce JSON', chunk.jobIds);
            }
            return { body: { batch }, jobIds: chunk.jobIds };
          }
          if (!isObject(result.body))
            return error(
              'Request body template must produce an object for XML/FORM format',
              chunk.jobIds,
            );
          const body = result.body as Record<string, unknown>;
          if (format === BodyFormat.FORM)
            return { body: prepareBody(body, format), jobIds: chunk.jobIds };
          // v2 has no xmlRootKey: the template's single top-level key is the root element.
          const [root, ...extra] = Object.keys(body);
          if (!root || extra.length > 0 || !isObject(body[root]))
            return error(
              'Request body template must produce exactly one top-level key holding an object for XML format; that key becomes the root element',
              chunk.jobIds,
            );
          return {
            body: prepareBody(body[root] as Record<string, unknown>, format, sanitizeKey(root)),
            jobIds: chunk.jobIds,
          };
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
