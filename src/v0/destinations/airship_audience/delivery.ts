/**
 * Delivery for AIRSHIP_AUDIENCE. Airship answers one verdict per call, so it covers every job in
 * the request. The framework's classification stands (2xx success, 429 throttled, 5xx retry,
 * other 4xx abort) except for 400:
 *  - 40090 (tag group missing or deactivated) aborts every job: splitting cannot help.
 *  - any other 400 retries each job alone (dontBatch), so a bad row aborts by itself. The
 *    framework turns that into an abort when the batch is already a single job.
 */
import { z } from 'zod';
import {
  retry,
  type DeliveryContext,
  type DeliverySpec,
} from '../../../services/destination/destinationIntegration/destinationIntegration';

const MISSING_TAG_GROUP = 40090;

// Airship's error envelope, e.g. {"ok":false,"error":"Unauthorized","error_code":40101}.
// `details` is never read: it echoes request values (P4 echoes the tag).
const AirshipErrorSchema = z.object({
  error: z.string().min(1),
  error_code: z.number().optional(),
});

const airshipFailureReason = ({
  response,
  status,
}: Pick<DeliveryContext, 'response' | 'status'>) => {
  const parsed = AirshipErrorSchema.safeParse(response);
  if (!parsed.success) return `Airship request failed with status ${status}`;
  const { error, error_code: code } = parsed.data;
  return code === undefined ? `Airship: ${error}` : `Airship ${code}: ${error}`;
};

const errorCodeOf = (response: unknown): number | undefined => {
  const parsed = AirshipErrorSchema.safeParse(response);
  return parsed.success ? parsed.data.error_code : undefined;
};

export const airshipAudienceDelivery: DeliverySpec = {
  statusOverrides: {
    400: (ctx, fallback) =>
      errorCodeOf(ctx.response) === MISSING_TAG_GROUP
        ? fallback()
        : retry(airshipFailureReason(ctx), { dontBatch: true }),
  },
  failureReason: airshipFailureReason,
};
