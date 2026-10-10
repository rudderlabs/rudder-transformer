import { z } from 'zod';
import type { DEVICE_PLATFORMS } from './config';

export const PushwooshDestinationConfigSchema = z
  .object({
    appCode: z.string().min(1),
    apiToken: z.string().min(1),
  })
  .passthrough();

export const PushwooshMessageSchema = z
  .object({
    type: z.enum(['track', 'identify'], {
      required_error: 'Message Type is not present. Aborting message.',
    }),
  })
  .passthrough();

export type PushwooshDestinationConfig = z.infer<typeof PushwooshDestinationConfigSchema>;
export type PushwooshMessage = z.infer<typeof PushwooshMessageSchema>;
export type PushwooshMessageType = PushwooshMessage['type'];

export type PushwooshValue = string | number | boolean | (string | number | boolean)[];
export type PushwooshValues = Record<string, PushwooshValue>;

export type PushwooshEvent = {
  user_id: string;
  device_id: string;
  device_platform: (typeof DEVICE_PLATFORMS)[keyof typeof DEVICE_PLATFORMS];
  app_code: string;
  name: string;
  timestamp?: string;
  attributes: PushwooshValues;
};

export type PushwooshSetTagsBody = {
  request: {
    application: string;
    userId: string;
    tags: PushwooshValues;
  };
};

export type PushwooshPayload = PushwooshEvent | PushwooshSetTagsBody;
