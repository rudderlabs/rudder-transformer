import { z } from 'zod';

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

const SUPPORTED_MESSAGE_TYPES = ['track', 'page', 'screen', 'identify'] as const;

export const RoktMessageSchema = z
  .object({
    type: z
      .string({
        required_error: 'Message Type is not present. Aborting message.',
        invalid_type_error:
          'Unsupported message type. ROKT supports track, page, screen, and identify.',
      })
      .refine(
        (type): type is (typeof SUPPORTED_MESSAGE_TYPES)[number] =>
          SUPPORTED_MESSAGE_TYPES.includes(type as (typeof SUPPORTED_MESSAGE_TYPES)[number]),
        'Unsupported message type. ROKT supports track, page, screen, and identify.',
      ),
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
    '1277': { passbackconversiontrackingid: string };
  };
  events?: [RoktConversion];
};
