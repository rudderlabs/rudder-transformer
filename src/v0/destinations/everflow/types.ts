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
