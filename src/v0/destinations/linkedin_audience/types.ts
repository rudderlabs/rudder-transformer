import { z } from 'zod';
import { ACTION_RECORD_MAP } from './config';

const LinkedinAudienceConnectionSchema = z
  .object({
    config: z
      .object({
        destination: z
          .object({
            audienceId: z.union([z.string(), z.number()], {
              required_error: 'audienceId is not present. Aborting',
            }),
            audienceType: z.enum(['user', 'company'], {
              required_error: 'audienceType is not present. Aborting',
            }),
            isHashRequired: z.boolean(),
          })
          .passthrough(),
      })
      .passthrough(),
  })
  .passthrough();

const LinkedinAudienceMessageSchema = z
  .object({
    type: z.enum(['record'], {
      required_error: 'message Type is not present. Aborting message.',
    }),
    action: z.enum(['insert', 'delete', 'update'], {
      required_error: 'action is not present. Aborting message.',
    }),
    identifiers: z.record(z.string(), z.string().nullable(), {
      required_error: 'identifiers is not present. Aborting message.',
    }),
    fields: z.record(z.string(), z.string().nullable(), {
      required_error: 'fields is not present. Aborting message.',
    }),
  })
  .passthrough();

const LinkedinAudienceMetadataSchema = z
  .object({
    workspaceId: z.string(),
    secret: z
      .object({
        accessToken: z.string({
          required_error:
            'Access Token is not present. This might be a platform issue. Please contact RudderStack support for assistance.',
        }),
      })
      .passthrough(),
  })
  .passthrough();

const LinkedinAudienceDestinationSchema = z
  .object({
    ID: z.string(),
  })
  .passthrough();

export const LinkedinAudienceRouterRequestSchema = z
  .object({
    message: LinkedinAudienceMessageSchema,
    connection: LinkedinAudienceConnectionSchema,
    metadata: LinkedinAudienceMetadataSchema,
    destination: LinkedinAudienceDestinationSchema,
  })
  .passthrough();

export type LinkedinAudienceRecordRequest = z.infer<typeof LinkedinAudienceRouterRequestSchema>;

export type LinkedinAudienceUserPayload = {
  action: (typeof ACTION_RECORD_MAP)[keyof typeof ACTION_RECORD_MAP];
  userIds: { idType: string; idValue: string }[];
};

export type LinkedinAudienceCompanyPayload = {
  action: (typeof ACTION_RECORD_MAP)[keyof typeof ACTION_RECORD_MAP];
};

export type LinkedinAudiencePayload = {
  payload: LinkedinAudienceUserPayload | LinkedinAudienceCompanyPayload;
  event: LinkedinAudienceRecordRequest;
};

export type LinkedinAudienceConfigParams = {
  audienceType: string;
  audienceId: string | number;
  accessToken: string;
  isHashRequired: boolean;
};
