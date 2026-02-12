import { z } from 'zod';
import { ACTION_MAP } from './config';

export const TiktokAudienceDestinationSchema = z
  .object({
    Config: z
      .object({
        isHashRequired: z.boolean(),
      })
      .passthrough(),
  })
  .passthrough();

export const TiktokAudienceMessageSchema = z
  .object({
    type: z.enum(['audiencelist'], {
      required_error: 'message Type is not present. Aborting message.',
    }),
    anonymousId: z.string().optional(),
    properties: z
      .object({
        listData: z
          .record(z.array(z.record(z.string(), z.string())))
          .optional()
          .superRefine((val, ctx) => {
            if (!val) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'listData is not present inside properties. Aborting message.',
              });
            }
            for (const key of Object.keys(val ?? {})) {
              if (!Object.keys(ACTION_MAP).includes(key)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: `unsupported action type ${key}. Aborting message.`,
                });
                break;
              }
            }
          }),
      })
      .optional()
      .refine((val) => val !== undefined, {
        message: 'Message properties is not present. Aborting message.',
      }),
    context: z
      .object({
        destinationFields: z.string().optional(),
        externalId: z
          .array(
            z.object({
              type: z.string(),
            }),
          )
          .optional(),
      })
      .optional(),
  })
  .passthrough();

export const TiktokAudienceMetadataSchema = z
  .object({
    secret: z
      .object({
        advertiserIds: z.array(z.string()),
        accessToken: z.string(),
      })
      .passthrough(),
  })
  .passthrough();

export const TiktokAudienceRouterRequestSchema = z
  .object({
    message: TiktokAudienceMessageSchema,
    destination: TiktokAudienceDestinationSchema,
    metadata: TiktokAudienceMetadataSchema,
  })
  .passthrough();

export type TiktokAudienceRequest = z.infer<typeof TiktokAudienceRouterRequestSchema>;
