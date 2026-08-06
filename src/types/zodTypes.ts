import { isDefinedAndNotNullAndNotEmpty } from '@rudderstack/integrations-lib';
import { z } from 'zod';
import { isHttpStatusSuccess } from '../v0/util';
import { HTTP_CUSTOM_STATUS_CODES } from '../constants';
import { RudderMessageSchema } from './rudderEvents';

const DestinationRequestBodySchema = z.object({
  JSON: z.unknown().optional(),
  JSON_ARRAY: z.unknown().optional(),
  XML: z.unknown().optional(),
  FORM: z.unknown().optional(),
  GZIP: z.unknown().optional(),
});

const ProcessorTransformationOutputSchema = z.object({
  version: z.string(),
  type: z.string(),
  method: z.string(),
  endpoint: z.string(),
  endpointPath: z.string().optional(),
  userId: z.string().optional(),
  headers: z.record(z.unknown()).optional(),
  params: z.record(z.unknown()).optional(),
  body: DestinationRequestBodySchema.optional(),
  files: z.record(z.unknown()).optional(),
});

const STAT_TAGS_ERROR_MESSAGE = "statTags and error can't be empty when status is not a 2XX";
const DELIVERY_STAT_TAGS_ERROR_MESSAGE = "statTags can't be empty when status is not a 2XX";
const OUTPUT_REQUIRED_FOR_SUCCESS_MESSAGE = "output can't be empty when status is 2XX";

const isFilteredResponse = (statusCode: number | undefined) =>
  statusCode === HTTP_CUSTOM_STATUS_CODES.FILTERED;

const isSuccessfulResponseWithPayload = (statusCode: number | undefined) =>
  statusCode !== undefined && isHttpStatusSuccess(statusCode) && !isFilteredResponse(statusCode);

const commonProcessorSchema = z.object({
  output: ProcessorTransformationOutputSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
  statusCode: z.number(),
  error: z.string().optional(),
  statTags: z.record(z.unknown()).optional(),
});

const commonUserTransformationSchema = commonProcessorSchema.extend({
  output: RudderMessageSchema.optional(),
});

export const ProcessorTransformationResponseSchema = commonProcessorSchema
  .refine(
    (data) => {
      if (!isHttpStatusSuccess(data.statusCode)) {
        return (
          isDefinedAndNotNullAndNotEmpty(data.statTags) ||
          isDefinedAndNotNullAndNotEmpty(data.error)
        );
      }
      return true;
    },
    {
      message: STAT_TAGS_ERROR_MESSAGE,
      path: ['statTags', 'error'], // Pointing out which field is invalid
    },
  )
  .refine(
    (data) => {
      if (isSuccessfulResponseWithPayload(data.statusCode)) {
        return isDefinedAndNotNullAndNotEmpty(data.output);
      }
      return true;
    },
    {
      message: OUTPUT_REQUIRED_FOR_SUCCESS_MESSAGE,
      path: ['output'], // Pointing out which field is invalid
    },
  );

export const ProcessorTransformationResponseListSchema = z.array(
  ProcessorTransformationResponseSchema,
);

const commonRouterSchema = z.object({
  batchedRequest: z.unknown().optional(),
  metadata: z.array(z.unknown()).optional(), // array of metadata
  destination: z.record(z.unknown()).optional(),
  batched: z.boolean().optional(),
  statusCode: z.number().optional(),
  error: z.string().optional(),
  statTags: z.record(z.unknown()).optional(),
});

export const RouterTransformationResponseSchema = commonRouterSchema
  .refine(
    (data) => {
      if (data.statusCode !== undefined && !isHttpStatusSuccess(data.statusCode)) {
        return (
          isDefinedAndNotNullAndNotEmpty(data.statTags) ||
          isDefinedAndNotNullAndNotEmpty(data.error)
        );
      }
      return true;
    },
    {
      message: STAT_TAGS_ERROR_MESSAGE,
      path: ['statTags', 'error'], // Pointing out which field is invalid
    },
  )
  .refine(
    (data) => {
      if (data.statusCode === undefined || isSuccessfulResponseWithPayload(data.statusCode)) {
        return isDefinedAndNotNullAndNotEmpty(data.batchedRequest);
      }
      return true;
    },
    {
      message: "batchedRequest can't be empty when status is 2XX",
      path: ['batchedRequest'], // Pointing out which field is invalid
    },
  );

export const RouterTransformationResponseListSchema = z.array(RouterTransformationResponseSchema);

// Proxy related schemas
export const ProxyMetadataSchema = z.object({
  jobId: z.number(),
  attemptNum: z.number(),
  userId: z.string(),
  sourceId: z.string(),
  destinationId: z.string(),
  workspaceId: z.string(),
  secret: z.record(z.unknown()),
  destInfo: z.record(z.unknown()).optional(),
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
  body: DestinationRequestBodySchema.optional(),
  files: z.record(z.unknown()).optional(),
  metadata: ProxyMetadataSchema,
  destinationConfig: z.record(z.unknown()),
  destinationVersion: z.number().optional(),
});

export const ProxyV1RequestSchema = z.object({
  version: z.string(),
  type: z.string(),
  method: z.string(),
  endpoint: z.string(),
  userId: z.string(),
  headers: z.record(z.unknown()).optional(),
  params: z.record(z.unknown()).optional(),
  body: DestinationRequestBodySchema.optional(),
  files: z.record(z.unknown()).optional(),
  metadata: z.array(ProxyMetadataSchema),
  destinationConfig: z.record(z.unknown()),
  destinationVersion: z.number().optional(),
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

const hasOwnProperty = (data: object, property: string) =>
  Object.prototype.hasOwnProperty.call(data, property);

export const DeliveryV0ResponseSchema = z
  .object({
    status: z.number(),
    message: z.string(),
    destinationResponse: z.unknown().optional(),
    statTags: z.record(z.unknown()).optional(),
    authErrorCategory: z.string().optional(),
  })
  .refine(
    (data) => !isHttpStatusSuccess(data.status) || hasOwnProperty(data, 'destinationResponse'),
    {
      message: "destinationResponse can't be empty when status is 2XX",
      path: ['destinationResponse'],
    },
  );

export const DeliveryV0ResponseSchemaForOauth = z
  .object({
    status: z.number(),
    message: z.string(),
    destinationResponse: z.unknown().optional(),
    statTags: z.record(z.unknown()).optional(),
    authErrorCategory: z.string().optional(),
  })
  .refine(
    (data) => !isHttpStatusSuccess(data.status) || hasOwnProperty(data, 'destinationResponse'),
    {
      message: "destinationResponse can't be empty when status is 2XX",
      path: ['destinationResponse'],
    },
  )
  .refine(validateStatTags, {
    message: DELIVERY_STAT_TAGS_ERROR_MESSAGE,
    path: ['statTags'], // Pointing out which field is invalid
  })
  .refine(validateAuthErrorCategory, {
    message: "authErrorCategory can't be empty when status is not a 2XX",
    path: ['authErrorCategory'], // Pointing out which field is invalid
  });

const DeliveryJobStateSchema = z.object({
  error: z.string(),
  statusCode: z.number(),
  metadata: z.record(z.unknown()),
});

export const DeliveryV1ResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  statTags: z.record(z.unknown()).optional(),
  authErrorCategory: z.string().optional(),
  response: z.array(DeliveryJobStateSchema),
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
    message: DELIVERY_STAT_TAGS_ERROR_MESSAGE,
    path: ['statTags'], // Pointing out which field is invalid
  })
  .refine(validateAuthErrorCategory, {
    message: "authErrorCategory can't be empty when status is not a 2XX",
    path: ['authErrorCategory'], // Pointing out which field is invalid
  });

export const ProcessorStreamingResponseSchema = commonProcessorSchema
  .extend({
    output: z.record(z.unknown()).optional(),
  })
  .refine(
    (data) => {
      if (!isHttpStatusSuccess(data.statusCode)) {
        return (
          isDefinedAndNotNullAndNotEmpty(data.statTags) ||
          isDefinedAndNotNullAndNotEmpty(data.error)
        );
      }
      return true;
    },
    {
      message: STAT_TAGS_ERROR_MESSAGE,
      path: ['statTags', 'error'], // Pointing out which field is invalid
    },
  )
  .refine(
    (data) => {
      if (isSuccessfulResponseWithPayload(data.statusCode)) {
        return isDefinedAndNotNullAndNotEmpty(data.output);
      }
      return true;
    },
    {
      message: OUTPUT_REQUIRED_FOR_SUCCESS_MESSAGE,
      path: ['output'], // Pointing out which field is invalid
    },
  );

export const ProcessorStreamingResponseListSchema = z.array(ProcessorStreamingResponseSchema);

export const RouterStreamingResponseSchema = commonRouterSchema
  .extend({
    batchedRequest: z.record(z.unknown()).optional(),
  })
  .refine(
    (data) => {
      if (data.statusCode !== undefined && !isHttpStatusSuccess(data.statusCode)) {
        return (
          isDefinedAndNotNullAndNotEmpty(data.statTags) ||
          isDefinedAndNotNullAndNotEmpty(data.error)
        );
      }
      return true;
    },
    {
      message: STAT_TAGS_ERROR_MESSAGE,
      path: ['statTags', 'error'], // Pointing out which field is invalid
    },
  )
  .refine(
    (data) => {
      if (data.statusCode === undefined || isSuccessfulResponseWithPayload(data.statusCode)) {
        return isDefinedAndNotNullAndNotEmpty(data.batchedRequest);
      }
      return true;
    },
    {
      message: "batchedRequest can't be empty when status is 2XX",
      path: ['batchedRequest'], // Pointing out which field is invalid
    },
  );

export const RouterStreamingResponseListSchema = z.array(RouterStreamingResponseSchema);

export const ProcessorOrStreamingResponseSchema = z.union([
  ProcessorTransformationResponseSchema,
  ProcessorStreamingResponseSchema,
]);

export const ProcessorOrStreamingResponseListSchema = z.array(ProcessorOrStreamingResponseSchema);

export const RouterOrStreamingResponseSchema = z.union([
  RouterTransformationResponseSchema,
  RouterStreamingResponseSchema,
]);

export const RouterOrStreamingResponseListSchema = z.array(RouterOrStreamingResponseSchema);

export const RouterTransformationResponseOutputSchema = z.object({
  output: RouterOrStreamingResponseListSchema,
});

const SourceTransformationOutputSchema = z.object({
  batch: z.array(z.record(z.unknown())),
});

export const SourceTransformationSuccessResponseSchema = z
  .object({
    output: SourceTransformationOutputSchema.optional(),
    statusCode: z.number().optional(),
    outputToSource: z.record(z.unknown()).optional(),
  })
  .refine(
    (data) => {
      if (data.statusCode !== undefined) {
        return isHttpStatusSuccess(data.statusCode);
      }
      return true;
    },
    {
      message: 'source success statusCode should be 2XX',
      path: ['statusCode'],
    },
  )
  .refine((data) => hasOwnProperty(data, 'output') || hasOwnProperty(data, 'outputToSource'), {
    message: "output or outputToSource can't be empty for source success response",
    path: ['output', 'outputToSource'],
  });

export const SourceTransformationErrorResponseSchema = z
  .object({
    error: z.string(),
    statusCode: z.number(),
    statTags: z.record(z.unknown()),
  })
  .refine((data) => !isHttpStatusSuccess(data.statusCode), {
    message: 'source error statusCode should not be 2XX',
    path: ['statusCode'],
  });

export const SourceTransformationResponseListSchema = z.array(
  z.union([SourceTransformationSuccessResponseSchema, SourceTransformationErrorResponseSchema]),
);

export const DeliveryV0ResponseOutputSchema = z.object({
  output: DeliveryV0ResponseSchema,
});

export const DeliveryV1ResponseOutputSchema = z.object({
  output: DeliveryV1ResponseSchema,
});

export const DeliveryProxyTestSuccessResponseSchema = z
  .object({
    destinationRequestPayload: z.unknown().optional(),
    outputDiff: z.string().optional(),
  })
  .passthrough()
  .refine((data) => hasOwnProperty(data, 'destinationRequestPayload'), {
    message: "destinationRequestPayload can't be empty for proxy test success response",
    path: ['destinationRequestPayload'],
  });

export const DeliveryProxyTestErrorResponseSchema = z
  .object({
    status: z.number(),
    message: z.string(),
    destinationResponse: z.unknown().optional(),
    statTags: z.record(z.unknown()).optional(),
    authErrorCategory: z.string().optional(),
  })
  .passthrough()
  .refine(validateStatTags, {
    message: "statTags can't be empty when status is not a 2XX",
    path: ['statTags'],
  });

export const DeliveryProxyTestResponseOutputSchema = z.object({
  output: z.union([DeliveryProxyTestSuccessResponseSchema, DeliveryProxyTestErrorResponseSchema]),
});

export const UserTransformationResponseSchema = commonUserTransformationSchema
  .refine(
    (data) => {
      if (
        !isHttpStatusSuccess(data.statusCode) &&
        data.statusCode !== HTTP_CUSTOM_STATUS_CODES.FILTERED
      ) {
        return (
          isDefinedAndNotNullAndNotEmpty(data.statTags) ||
          isDefinedAndNotNullAndNotEmpty(data.error)
        );
      }
      return true;
    },
    {
      message: STAT_TAGS_ERROR_MESSAGE,
      path: ['statTags', 'error'],
    },
  )
  .refine(
    (data) => {
      if (
        isHttpStatusSuccess(data.statusCode) &&
        data.statusCode !== HTTP_CUSTOM_STATUS_CODES.FILTERED
      ) {
        return isDefinedAndNotNullAndNotEmpty(data.output);
      }
      return true;
    },
    {
      message: OUTPUT_REQUIRED_FOR_SUCCESS_MESSAGE,
      path: ['output'],
    },
  );

export const UserTransformationResponseListSchema = z.array(UserTransformationResponseSchema);
