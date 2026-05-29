import { z, ZodType } from 'zod';
import { InstrumentationError, PlatformError } from '@rudderstack/integrations-lib';
import {
  BatchDestination,
  CustomBatchStrategy,
  TransformedEvent,
} from '../../../services/destination/nativeBatching/batchDestination';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
import { chunkPayloads } from '../../../services/destination/nativeBatching/chunkPayloads';
import type { Connection, Destination } from '../../../types/controlPlaneConfig';
import { EVENT_TYPES } from '../../util/recordUtils';
import { sandboxedEvaluateTemplate } from './template/templateSandboxClient';
import {
  buildRequestHeaders,
  injectCustomMappings,
  lookupActionConfig,
  processFields,
  resolveEndpoint,
  resolveBatchGroupKey,
} from './utils';
import type {
  Action,
  CustomAudienceConnectionDestConfig,
  CustomAudienceDestConfig,
  CustomAudienceRouterRequest,
} from './types';

class CustomAudienceIntegration extends BatchDestination<
  Record<string, string>,
  CustomAudienceDestConfig,
  { destination: CustomAudienceConnectionDestConfig }
> {
  // Endpoint depends only on action.endpoint + connection (constant per request),
  // so resolve once per configured action — not once per event.
  private readonly endpointByAction: Partial<Record<Action, string>>;

  private readonly headers: Record<string, string>;

  constructor(
    destination: Destination<CustomAudienceDestConfig>,
    connection?: Connection<{ destination: CustomAudienceConnectionDestConfig }>,
  ) {
    super(destination, connection);
    if (!this.connection) {
      throw new InstrumentationError('Connection config is required for custom_audience');
    }
    this.headers = buildRequestHeaders(destination.Config);
    this.endpointByAction = this.buildEndpointsByAction();
  }

  private get connectionConfig(): CustomAudienceConnectionDestConfig {
    return this.connection!.config.destination;
  }

  private buildEndpointsByAction(): Partial<Record<Action, string>> {
    return Object.fromEntries(
      Object.keys(this.destination.Config.actions).map((action) => [
        action,
        resolveEndpoint(
          lookupActionConfig(action as Action, this.destination.Config.actions).endpoint,
          this.destination.Config.baseUrl,
          this.connectionConfig,
        ),
      ]),
    ) as Partial<Record<Action, string>>;
  }

  transformEvent(input: CustomAudienceRouterRequest): TransformedEvent<Record<string, string>> {
    const { message } = input;
    const actionConfig = lookupActionConfig(message.action, this.destination.Config.actions);
    const fieldsWithCustomMappings = injectCustomMappings(
      message.identifiers!,
      this.connectionConfig.customMappings,
      actionConfig.fields,
    );
    const record = processFields(
      fieldsWithCustomMappings,
      actionConfig,
      {
        id: this.destination.ID,
        type: this.destination.DestinationDefinition.Name,
        workspaceId: this.destination.WorkspaceID,
      },
      this.connectionConfig.isHashRequired,
    );

    return {
      body: record,
      endpoint: this.endpointByAction[message.action]!,
      method: actionConfig.method,
      headers: this.headers,
      // Keep actions separated unless update explicitly aliases to insert.
      // This key must match the config used later for requestBody/batchSize.
      internalGroupKey: resolveBatchGroupKey(message.action, this.destination.Config.actions),
    };
  }

  getBatchStrategy(): BatchStrategy<Record<string, string>> {
    const { Config, WorkspaceID: workspaceId } = this.destination;
    const { connectionConfig } = this;

    return new CustomBatchStrategy<Record<string, string>>(async (payloads) => {
      const action = payloads[0].internalGroupKey as Action;
      const actionConfig = lookupActionConfig(action, Config.actions);

      // Chunk outside the isolate so the existing native-batching split logic
      // is reused. Each chunk's records are passed through to the isolate
      // together with the (untrusted) requestBody template.
      const chunks = chunkPayloads(payloads, {
        maxItems: actionConfig.batchSize,
        // No maxPayloadSize, so wrapBody is never called for size estimation.
        wrapBody: () => {
          throw new Error('wrapBody should not be called without maxPayloadSize');
        },
      });
      const bodies = await sandboxedEvaluateTemplate(
        actionConfig.requestBody,
        chunks.map((chunk) => chunk.bodies),
        connectionConfig,
        workspaceId,
      );
      if (bodies.length !== chunks.length) {
        throw new PlatformError(
          `Template evaluation returned ${bodies.length} request bodies but expected ${chunks.length}`,
          500,
        );
      }

      return chunks.map((chunk, i) => ({
        body: bodies[i],
        jobIds: chunk.jobIds,
      }));
    });
  }

  getInputSchema(): ZodType {
    return z
      .object({
        message: z
          .object({
            type: z.literal('record'),
            action: z.enum([EVENT_TYPES.INSERT, EVENT_TYPES.UPDATE, EVENT_TYPES.DELETE]),
            identifiers: z.record(z.unknown()),
          })
          .passthrough(),
        connection: z
          .object({
            config: z.object({
              destination: z
                .object({
                  customMappings: z
                    .array(
                      z.object({
                        from: z.string().min(1, 'Custom mapping "from" value must be non-empty'),
                        to: z.string().min(1, 'Custom mapping "to" value must be non-empty'),
                      }),
                    )
                    .optional(),
                })
                .passthrough(),
            }),
          })
          .passthrough(),
      })
      .passthrough();
  }
}

export const Integration = CustomAudienceIntegration;
