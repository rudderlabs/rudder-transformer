import { z } from 'zod';
import { POSTBACK_URL_ERROR, POSTBACK_URL_PATTERN } from './config';

export const EverflowDestinationConfigSchema = z
  .object({
    postbackUrl: z.string().regex(POSTBACK_URL_PATTERN, POSTBACK_URL_ERROR),
    networkId: z.string().min(1),
    verificationToken: z.string().optional(),
  })
  .passthrough();

export const EverflowMessageSchema = z
  .object({
    type: z.literal('track', {
      required_error: 'Message Type is not present. Aborting message.',
    }),
  })
  .passthrough();

export type EverflowDestinationConfig = z.infer<typeof EverflowDestinationConfigSchema>;
export type EverflowMessage = z.infer<typeof EverflowMessageSchema>;
export type EverflowPostbackPayload = Record<string, never>;
export type EverflowPostbackParams = Record<string, unknown> & {
  nid: string;
  transaction_id: unknown;
  verification_token?: string;
  amount?: number;
  currency?: string;
  coupon_code?: unknown;
  event_id?: unknown;
  adv_event_id?: unknown;
  event_name?: unknown;
  order_id?: unknown;
  email?: unknown;
  user_id?: unknown;
  user_ip?: unknown;
  user_agent?: unknown;
  timestamp?: number;
  idfa?: unknown;
  idfa_md5?: unknown;
  idfa_sha1?: unknown;
  google_aid?: unknown;
  google_aid_md5?: unknown;
  google_aid_sha1?: unknown;
  android_id?: unknown;
  app_id?: unknown;
  oid?: unknown;
  affid?: unknown;
  [key: `adv${number}`]: string | undefined;
};
