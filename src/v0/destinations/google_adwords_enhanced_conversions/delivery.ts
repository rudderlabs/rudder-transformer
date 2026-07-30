/**
 * Delivery handling for Google Ads Enhanced Conversions.
 *
 * Two things are destination-specific:
 *
 * 1. Partial failure arrives on a **2xx** carrying `partialFailureError`, with a positional
 *    `results` array in which an empty entry means that adjustment failed. Keyed on '2xx' rather
 *    than 200 because the check it replaces is `isHttpStatusSuccess(status)`.
 * 2. Google Ads is OAuth-backed, so the auth category is real and is derived from the response
 *    body (2SV-not-enrolled and CUSTOMER_NOT_FOUND mean the grant is gone, not that the token is
 *    stale). The framework never infers auth from a status, so this is declared explicitly.
 *
 * Transport — the SDK-based proxy, the conversionActionId cache and processAxiosResponse — stays
 * in ./networkHandler, which the framework continues to use.
 */
import { isEmptyObject } from '../../util';
import {
  abort,
  authExpired,
  authRevoked,
  perItem,
  success,
  type StatusOverrideMap,
} from '../../../services/destination/nativeBatching/batchDestination';

const { getAuthErrCategory } = require('../../util/googleUtils');
const {
  REFRESH_TOKEN,
  AUTH_STATUS_INACTIVE,
} = require('../../../adapters/networkhandler/authConstants');

export const extractGaecErrorMessage = (response: unknown): string =>
  (response as { error?: { message?: string } })?.error?.message || 'unknown error';

export const gaecStatusOverrides: StatusOverrideMap = {
  '2xx': (ctx, fallback) => {
    const body = ctx.response as
      | { partialFailureError?: { code?: number; message?: string }; results?: unknown[] }
      | undefined;
    const partialFailureError = body?.partialFailureError;

    // code 0 is Google's "no error"; treat it the same as an absent field.
    if (!partialFailureError || partialFailureError.code === 0) return fallback();

    const reason = partialFailureError.message || 'unknown error format';
    const results = Array.isArray(body?.results) ? body.results : [];

    // Indexed off the *posted* adjustments rather than off `results`, matching what customerio and
    // braze_audience do with their own request bodies. This destination is strictly 1:1
    // (routerTransform.ts:44 emits one adjustment per event), so the posted array is the one array
    // guaranteed to be the same length as the job list — which keeps the bridge's attribution
    // guard out of the picture entirely.
    //
    // Reading a missing `results` entry as failed is deliberate and reproduces the legacy handler's
    // `results?.[i] ?? {}`. Google omits or truncates `results` on some partial failures, and the
    // alternative — losing attribution and retrying the batch — would re-upload adjustments Google
    // has already accepted, which come back as duplicate-enhancement failures on every attempt.
    const items = (ctx.request.body?.JSON as { conversionAdjustments?: unknown[] })
      ?.conversionAdjustments;
    const positions = Array.isArray(items) ? items : results;

    return perItem(
      positions.map((_item, index) =>
        isEmptyObject(results[index] ?? {}) ? abort(reason) : success(),
      ),
    );
  },

  '4xx': (ctx, fallback) => {
    const category = getAuthErrCategory({ response: ctx.response, status: ctx.status });
    if (category === REFRESH_TOKEN) return authExpired(extractGaecErrorMessage(ctx.response));
    if (category === AUTH_STATUS_INACTIVE) {
      return authRevoked(extractGaecErrorMessage(ctx.response));
    }
    return fallback();
  },
};
