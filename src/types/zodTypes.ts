import { z } from 'zod';
import { isDefinedAndNotNullAndNotEmpty } from '@rudderstack/integrations-lib';
import { isHttpStatusSuccess } from '../v0/util';

export const ProxyMetadataSchema = z.object({
  jobId: z.number(),
  attemptNum: z.number(),
  userId: z.string(),
  sourceId: z.string(),
  destinationId: z.string(),
  workspaceId: z.string(),
  secret: z.record(z.unknown()),
  destInfo: z.object({}).optional(),
  omitempty: z.record(z.unknown()).optional(),
  dontBatch: z.boolean(),
});

export const ProxyV0RequestSchema = z.object({
  version: z.string(),
  type: z.string(),
  method: z.string(),
  endpoint: z.string(),
  userId: z.string(),
  headers: z.record(z.unknown()).optional(),
  params: z.record(z.unknown()).optional(),
  body: z
    .object({
      JSON: z.record(z.unknown()).optional(),
      JSON_ARRAY: z.record(z.unknown()).optional(),
      XML: z.record(z.unknown()).optional(),
      FORM: z.record(z.unknown()).optional(),
    })
    .optional(),
  files: z.record(z.unknown()).optional(),
  metadata: ProxyMetadataSchema,
});

export const ProxyV1RequestSchema = z.object({
  version: z.string(),
  type: z.string(),
  method: z.string(),
  endpoint: z.string(),
  userId: z.string(),
  headers: z.record(z.unknown()).optional(),
  params: z.record(z.unknown()).optional(),
  body: z
    .object({
      JSON: z.record(z.unknown()).optional(),
      JSON_ARRAY: z.record(z.unknown()).optional(),
      XML: z.record(z.unknown()).optional(),
      FORM: z.record(z.unknown()).optional(),
    })
    .optional(),
  files: z.record(z.unknown()).optional(),
  metadata: z.array(ProxyMetadataSchema),
  destinationConfig: z.record(z.unknown()),
});

const validateStatTags = (data: any) => {
  if (!isHttpStatusSuccess(data.status)) {
    return isDefinedAndNotNullAndNotEmpty(data.statTags);
  }
  return true;
};

const validateAuthErrorCategory = (data: any) => {
  if (!isHttpStatusSuccess(data.status)) {
    return isDefinedAndNotNullAndNotEmpty(data.authErrorCategory);
  }
  return true;
};

export const DeliveryV0ResponseSchema = z
  .object({
    status: z.number(),
    message: z.string(),
    destinationResponse: z.unknown(),
    statTags: z.record(z.unknown()).optional(),
    authErrorCategory: z.string().optional(),
  })
  .refine(validateStatTags, {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    message: "statTags can't be empty when status is not a 2XX",
    path: ['statTags'], // Pointing out which field is invalid
  });

export const DeliveryV0ResponseSchemaForOauth = z
  .object({
    status: z.number(),
    message: z.string(),
    destinationResponse: z.unknown(),
    statTags: z.record(z.unknown()).optional(),
    authErrorCategory: z.string().optional(),
  })
  .refine(validateStatTags, {
    message: "statTags can't be empty when status is not a 2XX",
    path: ['statTags'], // Pointing out which field is invalid
  })
  .refine(validateAuthErrorCategory, {
    message: "authErrorCategory can't be empty when status is not a 2XX",
    path: ['authErrorCategory'], // Pointing out which field is invalid
  });

const DeliveryJobStateSchema = z.object({
  error: z.string(),
  statusCode: z.number(),
  metadata: ProxyMetadataSchema,
});

export const DeliveryV1ResponseSchema = z
  .object({
    status: z.number(),
    message: z.string(),
    statTags: z.record(z.unknown()).optional(),
    authErrorCategory: z.string().optional(),
    response: z.array(DeliveryJobStateSchema),
  })
  .refine(validateStatTags, {
    message: "statTags can't be empty when status is not a 2XX",
    path: ['statTags'], // Pointing out which field is invalid
  });

export const DeliveryV1ResponseSchemaForOauth = z
  .object({
    status: z.number(),
    message: z.string(),
    statTags: z.record(z.unknown()).optional(),
    authErrorCategory: z.string().optional(),
    response: z.array(DeliveryJobStateSchema),
  })
  .refine(validateStatTags, {
    message: "statTags can't be empty when status is not a 2XX",
    path: ['statTags'], // Pointing out which field is invalid
  })
  .refine(validateAuthErrorCategory, {
    message: "authErrorCategory can't be empty when status is not a 2XX",
    path: ['authErrorCategory'], // Pointing out which field is invalid
  });
