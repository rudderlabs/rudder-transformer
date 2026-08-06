/**
 * Delivery handling for the CustomerIO v2 batch API.
 *
 * The `/v2/batch` endpoint answers a partially-failed batch with HTTP 207 and an `errors` array
 * whose entries carry `batch_index` — an index into the `batch` array that was posted, not into
 * the job list. 207 is a 2xx, so without this entry the framework would read a partially-failed
 * batch as a plain success. Keyed on the exact status rather than '2xx' because only 207 carries
 * `errors`. Everything else — plain success, every failure status — is left to the framework.
 *
 * NOTE: `src/v1/destinations/customerio/networkHandler.ts` keeps its own copy of this logic while
 * customerio is pre-GA, because workspaces not enrolled in the batching framework still transform
 * through the legacy `processRouterDest` and are delivered by that handler. Both are deleted
 * together when customerio reaches GA.
 */
import {
  abort,
  perItem,
  success,
  type StatusOverrideMap,
} from '../../../../services/destination/nativeBatching/batchDestination';

type CustomerIOError = {
  batch_index: number;
  reason?: string;
  field?: string;
  message?: string;
};

export const customerIOStatusOverrides: StatusOverrideMap = {
  207: (ctx) => {
    const items = (ctx.request.body?.JSON as { batch?: unknown[] })?.batch ?? [];
    const rawErrors = (ctx.response as { errors?: unknown })?.errors;

    const failedByIndex = new Map<number, string>();
    if (Array.isArray(rawErrors)) {
      for (const raw of rawErrors) {
        const error = raw as CustomerIOError;
        // Anything without a numeric batch_index cannot be attributed, so ignore it rather than
        // guess — a mis-keyed entry would fail the wrong event.
        if (typeof error?.batch_index === 'number') {
          const parts = [
            error.reason ? `reason: ${error.reason}` : undefined,
            error.field ? `field: ${error.field}` : undefined,
            error.message ? `message: ${error.message}` : undefined,
          ].filter(Boolean);
          failedByIndex.set(
            error.batch_index,
            parts.length > 0 ? parts.join(', ') : 'Unknown error from CustomerIO',
          );
        }
      }
    }

    return perItem(
      items.map((_item, index) => {
        const reason = failedByIndex.get(index);
        return reason ? abort(reason) : success();
      }),
    );
  },
};
