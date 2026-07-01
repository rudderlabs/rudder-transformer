import { z } from 'zod';
import { HashingType } from '../../util/audienceUtils';
import type { Connection, Destination } from '../../../types/controlPlaneConfig';
import type { Metadata, RecordAction, RudderRecordV2 } from '../../../types/rudderEvents';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
import { AUTHENTICATION_TYPES } from './constants';

export type Action = `${RecordAction}`;

export type AuthenticationType = (typeof AUTHENTICATION_TYPES)[keyof typeof AUTHENTICATION_TYPES];

export const actionFieldConfigSchema = z.object({
  name: z.string(),
  isRequired: z.boolean(),
  hashType: z.nativeEnum(HashingType),
  isCustom: z.boolean(),
});

export const actionConfigSchema = z.object({
  endpoint: z.string(),
  method: z.enum(['POST', 'PUT', 'PATCH', 'GET', 'DELETE']),
  requestBody: z.string(),
  batchSize: z.number(),
  fields: z.array(actionFieldConfigSchema),
});

const updateActionConfigSchema = z.union([
  actionConfigSchema.extend({ useInsertConfig: z.boolean().optional() }),
  z.object({ useInsertConfig: z.literal(true) }),
]);

export const actionsSchema = z.object({
  insert: actionConfigSchema.optional(),
  update: updateActionConfigSchema.optional(),
  delete: actionConfigSchema.optional(),
});

export type HttpMethod = z.infer<typeof actionConfigSchema>['method'];
export type ActionFieldConfig = z.infer<typeof actionFieldConfigSchema>;
export type ActionConfig = z.infer<typeof actionConfigSchema>;
export type UpdateActionConfig = z.infer<typeof updateActionConfigSchema>;

export const customAudienceHeaderSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export type CustomAudienceHeader = z.infer<typeof customAudienceHeaderSchema>;

export const CustomAudienceDestConfigSchema = z
  .object({
    baseUrl: z.string(),
    authenticationType: z.enum(
      Object.values(AUTHENTICATION_TYPES) as [AuthenticationType, ...AuthenticationType[]],
    ),
    headers: z.array(customAudienceHeaderSchema).optional(),
    actions: actionsSchema,
    basicAuthUserName: z.string().optional(),
    basicAuthPassword: z.string().optional(),
    bearerToken: z.string().optional(),
    apiKeyName: z.string().optional(),
    apiKeyValue: z.string().optional(),
  })
  .passthrough();

export type CustomAudienceDestConfig = z.infer<typeof CustomAudienceDestConfigSchema>;

export const customMappingSchema = z.object({
  from: z.string().min(1, 'Custom mapping "from" value must be non-empty'),
  to: z.string().min(1, 'Custom mapping "to" value must be non-empty'),
});

export type CustomMapping = z.infer<typeof customMappingSchema>;

export const CustomAudienceConnectionDestConfigSchema = z
  .object({
    audienceId: z.string(),
    isHashRequired: z.boolean(),
    customMappings: z.array(customMappingSchema).optional(),
  })
  .passthrough();

export type CustomAudienceConnectionDestConfig = z.infer<
  typeof CustomAudienceConnectionDestConfigSchema
>;

export type CustomAudienceItemBody = {
  record: Record<string, string>;
};

export type CustomAudienceDestination = Destination<CustomAudienceDestConfig>;

export type CustomAudienceConnection = Connection<{
  destination: CustomAudienceConnectionDestConfig;
}>;

export type CustomAudienceRouterRequest = RouterTransformationRequestData<
  RudderRecordV2,
  CustomAudienceDestination,
  CustomAudienceConnection,
  Metadata
>;
