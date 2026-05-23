import { ProxyMetdata, ProxyV1Request } from '../../../types';
import type { IterableBulkApiResponse } from '../iterable/types';

// Re-export the shared bulk response shape so this destination's strategy
// works against the same response type the existing iterable utils produce.
// FailedUpdates is intentionally NOT re-exported because it is not exported
// from the iterable destination's types module — its shape is reachable via
// `GeneralApiResponse['failedUpdates']` if a consumer needs it.
export type { IterableBulkApiResponse, GeneralApiResponse } from '../iterable/types';

// Per-subscriber payload shape emitted by the v0 transform layer. Each subscriber
// has EXACTLY ONE identifier (email XOR userId) — enforced at transform time.
export type IterableSubscriber = { email: string } | { userId: string };

export type IterableAudienceRequestBody = {
  listId: string | number;
  subscribers: IterableSubscriber[];
  // Only present on /api/lists/unsubscribe responses.
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
