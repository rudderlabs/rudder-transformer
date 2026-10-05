import { z } from 'zod';
import { ROKT_INTEGRATION_ID } from './config';

const requiredConfigString = z
  .string()
  .min(1)
  .refine((value) => value.trim().length > 0, 'Required configuration value cannot be blank');

export const RoktDestinationConfigSchema = z
  .object({
    apiEndpoint: requiredConfigString,
    serverToServerKey: requiredConfigString,
    serverToServerSecret: requiredConfigString,
  })
  .passthrough();

const UNSUPPORTED_MESSAGE_TYPE =
  'Unsupported message type. ROKT supports track, page, screen, and identify.';

export const RoktMessageSchema = z
  .object({
    type: z.enum(['track', 'page', 'screen', 'identify'], {
      errorMap: (_issue, ctx) => ({
        message:
          ctx.data === undefined
            ? 'Message Type is not present. Aborting message.'
            : UNSUPPORTED_MESSAGE_TYPE,
      }),
    }),
    userId: z.union([z.string(), z.number()]).transform(String).nullish(),
  })
  .passthrough();

export type RoktUserIdentities = {
  email?: string;
  customerid?: string;
  other2?: string;
};

export type RoktUserAttributes = Partial<
  Record<
    | 'firstname'
    | 'firstnamesha256'
    | 'lastname'
    | 'lastnamesha256'
    | 'mobile'
    | 'mobilesha256'
    | 'age'
    | 'dob'
    | 'gender'
    | 'city'
    | 'state'
    | 'zip'
    | 'title'
    | 'language'
    | 'value'
    | 'predictedltv',
    unknown
  >
>;

export type RoktDeviceInfo = {
  http_header_user_agent?: unknown;
  ios_advertising_id?: unknown;
  android_advertising_id?: unknown;
};

export type RoktConversion = {
  event_type: 'custom_event';
  data: {
    event_name: 'conversion';
    custom_event_type: 'transaction';
    timestamp_unixtime_ms?: number;
    source_message_id?: string;
    custom_attributes: {
      conversiontype?: unknown;
      confirmationref?: unknown;
      amount?: string;
      currency?: unknown;
      screen_name?: unknown;
      url?: unknown;
    };
  };
};

export type RoktBatch = {
  schema_version: 2;
  environment: 'production';
  user_identities: RoktUserIdentities;
  ip?: unknown;
  user_attributes?: RoktUserAttributes;
  device_info?: RoktDeviceInfo;
  integration_attributes?: {
    [ROKT_INTEGRATION_ID]: { passbackconversiontrackingid: string };
  };
  events?: [RoktConversion];
};
