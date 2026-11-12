import { ConfigurationError } from '@rudderstack/integrations-lib';
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
import type { PayloadChunk } from '../../../services/destination/destinationIntegration/chunkPayloads';
import { groupPayloadsByCompositeKey } from '../../../services/destination/destinationIntegration/processDestinationIntegration';
import { sandboxedEvaluateHttpBody, sandboxedEvaluateRequestFields } from './templateSandboxClient';
import type {
  EvaluatedRequestFields,
  HttpBodyJob,
  HttpBodyResult,
  RequestFieldResult,
} from './httpTemplateSandbox';
import { DEFAULT_METHOD, HttpInputSchema, MAX_BATCH_SIZE } from './types';
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

type HttpPayload = TransformResult<HttpBody>['successPayloads'][number];

const chunkKey = ({ jobIds }: PayloadChunk<HttpBody>): string => [...jobIds].join(',');

class HttpIntegration extends DestinationIntegration<HttpBody, typeof HttpInputSchema> {
  // Request fields are evaluated in one isolate call per transformEvents; transformEvent reads them.
  private fieldResults = new Map<HttpInput, RequestFieldResult>();

  // Request groups from every transformEvents call, so the first batch call can evaluate every
  // body in one isolate call. Results are keyed by chunk job IDs, which identify a chunk exactly.
  private pendingGroups: HttpPayload[][] = [];

  private bodyResults = new Map<string, HttpBodyResult>();

  private overrideAt(index?: number) {
    return index === undefined
      ? undefined
      : this.destination.Config.eventOverrides?.[index as number];
  }

  async transformEvents(
    inputs: HttpInput[],
    reqMetadata?: NonNullable<unknown>,
  ): Promise<TransformResult<HttpBody>> {
    const { ID: destinationId, WorkspaceID: workspaceId, Config } = this.destination;
    const partitions = new Map<number | undefined, HttpInput[]>();
    let matched = 0;
    let unmatched = 0;
    for (const input of inputs) {
      const index = resolveOverrideGroup(input.message, Config.eventOverrides);
      if (index !== undefined) matched += 1;
      else if (input.message.type === 'track') unmatched += 1;
      const group = this.overrideAt(index);
      // Groups that change no request fields share the default evaluation.
      const fieldsIndex =
        group?.pathParams !== undefined || group?.queryParams !== undefined ? index : undefined;
      const partition = partitions.get(fieldsIndex) ?? [];
      partition.push(input);
      partitions.set(fieldsIndex, partition);
    }
    const tags = { destType: 'HTTP', workspaceId, destinationId };
    stats.counter('http_event_override_events', matched, { ...tags, matched: 'true' });
    stats.counter('http_event_override_events', unmatched, { ...tags, matched: 'false' });
    const jobs = [...partitions]
      .map(([index, partition]) => ({
        partition,
        expressions: toExpressions(effectiveConfig(Config, this.overrideAt(index))),
      }))
      // Skip partitions with nothing mapped, and the isolate round-trip when none remain.
      .filter(
        ({ expressions: { headers, queryParams, pathParams } }) =>
          headers.length + queryParams.length + pathParams.length > 0,
      );
    if (jobs.length > 0) {
      const results = await sandboxedEvaluateRequestFields(
        jobs.map(({ expressions, partition }) => [
          expressions,
          partition.map(({ message }) => message),
        ]),
        workspaceId,
      );
      jobs.forEach(({ partition }, j) =>
        partition.forEach((input, i) => this.fieldResults.set(input, results[j][i])),
      );
    }
    const result = await super.transformEvents(inputs, reqMetadata);
    // Group exactly as the framework will: one call's payloads together (dontBatch calls hold one).
    this.pendingGroups.push(
      ...groupPayloadsByCompositeKey(result.successPayloads).map(({ payloads }) => payloads),
    );
    return result;
  }

  transformEvent(input: HttpInput): TransformedEvent<HttpBody> {
    const index = resolveOverrideGroup(input.message, this.destination.Config.eventOverrides);
    const group = this.overrideAt(index);
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

  private chunkGroup(payloads: HttpPayload[]) {
    const { Config } = this.destination;
    const { requestBodyTemplate, maxBatchSize } = effectiveConfig(
      Config,
      this.overrideAt(groupIndexFromKey(payloads[0].internalGroupKey)),
    );
    // Raw config: the control plane sends maxBatchSize as a string.
    // FORM is always single-event, even when a stale config supplies maxBatchSize.
    const chunks = chunkPayloads(payloads, {
      maxItems: Config.format === BodyFormat.FORM ? 1 : Number(maxBatchSize ?? MAX_BATCH_SIZE),
      wrapBody: () => ({}),
    });
    return { template: requestBodyTemplate, chunks };
  }

  // Evaluates, in one isolate call, every chunk of these groups that has no result yet.
  private async evaluateBodies(groups: HttpPayload[][]): Promise<void> {
    const pending = groups
      .map((payloads) => this.chunkGroup(payloads))
      .map(({ template, chunks }) => ({
        template,
        chunks: chunks.filter((chunk) => !this.bodyResults.has(chunkKey(chunk))),
      }))
      .filter(({ chunks }) => chunks.length > 0);
    if (pending.length === 0) return;
    const results = await sandboxedEvaluateHttpBody(
      pending.map(({ template, chunks }): HttpBodyJob => [template, chunks.map((c) => c.bodies)]),
      this.destination.WorkspaceID,
    );
    pending.forEach(({ chunks }, j) =>
      chunks.forEach((chunk, i) => this.bodyResults.set(chunkKey(chunk), results[j][i])),
    );
  }

  getBatchStrategy(): BatchStrategy<HttpBody> {
    const { format = BodyFormat.JSON } = this.destination.Config;
    return new CustomBatchStrategy<HttpBody>(
      async (payloads) => {
        // A re-batched group (fewer jobs after a failure elsewhere) has new chunks; they are
        // evaluated here instead of being found in the results.
        await this.evaluateBodies([...this.pendingGroups.splice(0), payloads]);
        const { chunks } = this.chunkGroup(payloads);
        const bodies = chunks.map((chunk) => this.bodyResults.get(chunkKey(chunk))!);
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
