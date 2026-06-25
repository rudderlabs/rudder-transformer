import { z } from 'zod';
import {
  BatchDestination,
  TransformedEvent,
  ChunkBatchStrategy,
} from '../../../services/destination/nativeBatching/batchDestination';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
// `process` (from transform.js) builds the single-event delivery request synchronously and is
// reused here so no transform logic is duplicated.
import { process as transformSingleEvent } from './transform';
import { MAX_CONVERSION_ADJUSTMENTS_PER_BATCH } from './config';

// Each batched item is a single Google Ads conversion adjustment.
type ConversionAdjustment = Record<string, unknown>;

const gaecInputSchema = z
  .object({
    message: z
      .object({
        type: z.string().refine((type) => type.toLowerCase() === 'track', {
          message: 'Message Type is not supported. Only track events are supported.',
        }),
        event: z.string().min(1, 'event is required for track calls'),
      })
      .passthrough(),
  })
  .passthrough();

class GoogleAdwordsEnhancedConversionsIntegration extends BatchDestination<
  ConversionAdjustment,
  typeof gaecInputSchema
> {
  transformEvent(input: z.infer<typeof gaecInputSchema>): TransformedEvent<ConversionAdjustment> {
    // Reuse the existing per-event transform untouched. It returns a delivery request whose
    // body.JSON is `{ conversionAdjustments: [<single adjustment>], partialFailure: true }`.
    const result = transformSingleEvent(input);

    return {
      body: result.body.JSON.conversionAdjustments[0],
      endpoint: result.endpoint, // '' — delivery is handled by the networkHandler/proxy
      endpointPath: '/uploadConversionAdjustments',
      method: result.method,
      headers: result.headers,
      // params carries event (conversion name), customerId, loginCustomerId, subAccount and
      // accessToken — all part of the framework's grouping key, so events only batch together
      // when they target the same conversion action + customer, as the Google Ads API requires.
      params: result.params,
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
