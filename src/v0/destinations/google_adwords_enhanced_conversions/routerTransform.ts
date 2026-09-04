import { z } from 'zod';
import {
  DestinationIntegration,
  TransformedEvent,
  ChunkBatchStrategy,
  makeRouterInputSchema,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import type { BatchStrategy } from '../../../services/destination/destinationIntegration/types';
// `process` (from transform.js) builds the single-event delivery request synchronously and is
// reused here so no transform logic is duplicated.
import { process as transformSingleEvent } from './transform';
import {
  destType,
  getUploadConversionAdjustmentsEndpoint,
  getUploadConversionAdjustmentsEndpointPath,
  MAX_CONVERSION_ADJUSTMENTS_PER_BATCH,
} from './config';
import { gaecDelivery } from './delivery';
import { getConversionActionId } from './utils';
import type { ConversionAdjustment, GaecRouterRequest } from './types';
import { isBatchingFrameworkTransportEnabled } from '../../../constants/destinationIntegrationsMap';
import { getAccessToken } from '../../util';

const gaecInputSchema = makeRouterInputSchema({
  message: z
    .object({
      type: z.string().refine((type) => type.toLowerCase() === 'track', {
        message: 'Message Type is not supported. Only track events are supported.',
      }),
      event: z.string().min(1, 'event is required for track calls'),
    })
    .passthrough(),
});

type GaecBatchInput = z.infer<typeof gaecInputSchema> & GaecRouterRequest;

class GoogleAdwordsEnhancedConversionsIntegration extends DestinationIntegration<
  ConversionAdjustment,
  typeof gaecInputSchema
> {
  // Partial failure on a 2xx, plus body-derived auth categories; see ./delivery.
  static readonly delivery = gaecDelivery;

  /**
   * Async only on the framework-transport path, where the conversion action resource name has to
   * be resolved before the adjustment is complete. The lookup is cache-backed and keyed on
   * (conversion name, customerId), so a batch pays at most one request per distinct conversion
   * name and every later event in the call is a hit.
   *
   * Resolving here rather than at delivery is what lets events with *different* conversion names
   * share a batch: the name no longer has to sit in `params` as a grouping key, and a name that
   * fails to resolve fails only its own job instead of the whole formed request.
   */
  async transformEvent(
    input: z.infer<typeof gaecInputSchema>,
  ): Promise<TransformedEvent<ConversionAdjustment>> {
    // Reuse the existing per-event transform untouched. It returns a delivery request whose
    // body.JSON is `{ conversionAdjustments: [<single adjustment>], partialFailure: true }`.
    const gaecInput = input as GaecBatchInput;
    const result = transformSingleEvent(gaecInput);

    if (!isBatchingFrameworkTransportEnabled(destType, gaecInput.metadata.workspaceId)) {
      return {
        body: result.body.JSON.conversionAdjustments![0],
        endpoint: result.endpoint, // '' — delivery is handled by the networkHandler/proxy
        endpointPath: '/uploadConversionAdjustments',
        method: result.method,
        headers: result.headers,
        // Legacy shape: params carries event (conversion name), customerId, loginCustomerId,
        // subAccount and accessToken, keeping flag-off output byte-identical.
        params: result.params,
      };
    }

    const customerId = result.params.customerId!;
    const conversionAction = await getConversionActionId({
      event: gaecInput.message.event,
      customerId,
      loginCustomerId: result.params.subAccount ? String(result.params.loginCustomerId) : '',
      accessToken: String(getAccessToken(gaecInput.metadata, 'access_token')),
    });

    return {
      body: { ...result.body.JSON.conversionAdjustments![0], conversionAction },
      endpoint: getUploadConversionAdjustmentsEndpoint(customerId),
      endpointPath: getUploadConversionAdjustmentsEndpointPath(customerId),
      method: result.method,
      headers: result.headers,
      params: {},
    };
  }

  getBatchStrategy(): BatchStrategy<ConversionAdjustment> {
    return new ChunkBatchStrategy<ConversionAdjustment>({
      maxItems: MAX_CONVERSION_ADJUSTMENTS_PER_BATCH,
      wrapBody: (bodies) => ({
        conversionAdjustments: bodies,
        partialFailure: true,
      }),
    });
  }

  getInputSchema() {
    return gaecInputSchema;
  }
}

export const Integration = GoogleAdwordsEnhancedConversionsIntegration;
