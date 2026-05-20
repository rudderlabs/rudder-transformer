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
      Object.entries(this.destination.Config.actions).map(([action, actionConfig]) => [
        action,
        resolveEndpoint(
          actionConfig!.endpoint,
          this.destination.Config.baseUrl,
          this.connectionConfig,
        ),
      ]),
    ) as Partial<Record<Action, string>>;
  }

  transformEvent(input: CustomAudienceRouterRequest): TransformedEvent<Record<string, string>> {
    const { message } = input;
    const actionConfig = lookupActionConfig(message.action, this.destination.Config);
    const fieldsWithCustomMappings = injectCustomMappings(
      message.fields!,
      this.connectionConfig.customMappings,
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
      // Force the framework's composite-key grouping to keep different actions
      // in separate groups, even when their (endpoint, method, headers) match.
      // Each action carries its own requestBody template.
      internalGroupKey: message.action,
    };
  }

  getBatchStrategy(): BatchStrategy<Record<string, string>> {
    const { Config, WorkspaceID: workspaceId } = this.destination;
    const { actions } = Config;
    const { connectionConfig } = this;

    return new CustomBatchStrategy<Record<string, string>>(async (payloads) => {
      const action = payloads[0].internalGroupKey as Action;
      const actionConfig = actions[action]!;

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
            fields: z.record(z.unknown()),
          })
          .passthrough(),
      })
      .passthrough();
  }
}

export const Integration = CustomAudienceIntegration;
