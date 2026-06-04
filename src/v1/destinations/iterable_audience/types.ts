import { ProxyMetdata, ProxyV1Request } from '../../../types';
import type { IterableBulkApiResponse } from '../iterable/types';

// Re-export the shared bulk response shape so this destination's strategy
// works against the same response type the existing iterable utils produce.
// FailedUpdates is intentionally NOT re-exported because it is not exported
// from the iterable destination's types module — its shape is reachable via
// `IterableBulkApiResponse['response']['failedUpdates']` if a consumer needs it.
export type { IterableBulkApiResponse } from '../iterable/types';

// Per-subscriber payload shape emitted by the v0 transform layer. A subscriber
// carries at least one identifier; hybrid projects may send both `email` and
// `userId` for the same row.
export type IterableSubscriber =
  | { email: string; userId?: string }
  | { email?: string; userId: string };

export type IterableAudienceRequestBody = {
  listId: string | number;
  subscribers: IterableSubscriber[];
  // Only present on outgoing /api/lists/unsubscribe REQUESTS — set to
  // `false` so Iterable removes the user from this list without unsubscribing
  // them from every channel. Absent on /api/lists/subscribe requests.
  channelUnsubscribe?: boolean;
};

export type IterableAudienceProxyInput = {
  destinationResponse: IterableBulkApiResponse;
  rudderJobMetadata: ProxyMetdata[];
  destType: string;
  destinationRequest: ProxyV1Request & {
    body: {
      JSON: IterableAudienceRequestBody;
    };
  };
};
