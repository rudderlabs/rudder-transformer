import { z } from 'zod';
import {
  abort,
  defaultFailureReason,
  retry,
  type DeliveryContext,
  type DeliverySpec,
  type StatusOverride,
  type StatusOverrideMap,
} from '../../../services/destination/destinationIntegration/destinationIntegration';

// post-events: `{"message":"unauthorized"}` for auth/app-code failures.
const MessageErrorSchema = z.object({ message: z.string().min(1) });
// post-events: the request body failed to decode — one malformed event rejects the whole batch.
const EventDecodeErrorSchema = z.object({
  action: z.literal('post event'),
  status: z.literal('failure'),
  error: z.object({ message: z.string() }),
});
// setTags (legacy JSON API): `{"status_code":210,"status_message":"...","response":null}`.
const LegacyApiErrorSchema = z.object({
  status_code: z.number(),
  status_message: z.string(),
});

const pushwooshFailureReason = ({ response, status }: DeliveryContext): string => {
  const decodeError = EventDecodeErrorSchema.safeParse(response);
  if (decodeError.success) {
    return `Pushwoosh rejected the events batch: ${decodeError.data.error.message}`;
  }
  const messageError = MessageErrorSchema.safeParse(response);
  if (messageError.success) {
    return messageError.data.message;
  }
  const legacyError = LegacyApiErrorSchema.safeParse(response);
  if (legacyError.success) {
    const { status_code: code, status_message: message } = legacyError.data;
    return `${message || 'Pushwoosh request failed'} (status_code: ${code})`;
  }
  return defaultFailureReason(status);
};

// The legacy JSON API may report an application error inside an HTTP 200 body.
const legacyBodyVerdict: StatusOverride = (ctx, fallback) => {
  const legacy = LegacyApiErrorSchema.safeParse(ctx.response);
  if (!legacy.success || legacy.data.status_code === 200) {
    return fallback();
  }
  const reason = pushwooshFailureReason(ctx);
  return legacy.data.status_code >= 500 ? retry(reason) : abort(reason);
};

const statusOverrides: StatusOverrideMap = {
  200: legacyBodyVerdict,
  // A decode failure names no event, so isolate the batch; other 400s are config errors and abort.
  400: (ctx, fallback) =>
    EventDecodeErrorSchema.safeParse(ctx.response).success
      ? retry(pushwooshFailureReason(ctx), { dontBatch: true })
      : fallback(),
};

export const pushwooshDelivery: DeliverySpec = {
  statusOverrides,
  failureReason: pushwooshFailureReason,
};
