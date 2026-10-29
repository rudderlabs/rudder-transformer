import { z } from 'zod';
import { HashingType } from '../../util/audienceUtils';
import { makeRouterInputSchema } from '../../../services/destination/destinationIntegration/destinationIntegration';
import type { Connection, Destination } from '../../../types/controlPlaneConfig';
import { RecordAction, type Metadata, type RudderRecordV2 } from '../../../types/rudderEvents';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';

export type Action = `${RecordAction}`;

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
    authenticationEnabled: z.boolean().optional(),
    headers: z.array(customAudienceHeaderSchema).optional(),
    actions: actionsSchema,
  })
  .passthrough();

export type CustomAudienceDestConfig = z.infer<typeof CustomAudienceDestConfigSchema>;

export const CustomAudienceDeliveryAccountSchema = z
  .object({
    options: z.record(z.unknown()).nullish(),
    secret: z.record(z.unknown()).nullish(),
    accountDefinitionName: z.string().nullish(),
  })
  .passthrough();

export type ParsedCustomAudienceDeliveryAccount = z.infer<
  typeof CustomAudienceDeliveryAccountSchema
>;

export type CustomAudienceDeliveryAccount = ParsedCustomAudienceDeliveryAccount;

export type CustomAudienceAuthMetadata = {
  isPreview?: true;
  secret?: { accessToken?: string };
};

export type CustomAudienceAccountAuthHandler = (
  account: ParsedCustomAudienceDeliveryAccount,
  metadata?: CustomAudienceAuthMetadata,
) => Record<string, string>;

export const customMappingSchema = z.object({
  from: z.string().min(1, 'Custom mapping "from" value must be non-empty'),
  to: z.string().min(1, 'Custom mapping "to" value must be non-empty'),
});

export type CustomMapping = z.infer<typeof customMappingSchema>;

export const CustomAudienceConnectionDestConfigSchema = z
  .object({
    // Optional on purpose. A connection only needs an audienceId when the
    // destination's action templates actually reference it — an endpoint
    // carrying `{{connection.audienceId}}`, or a requestBody reading
    // `$$.connection.audienceId`. Templates that never reference it would
    // otherwise have to carry a placeholder value to pass validation.
    // resolveEndpoint raises the error when an endpoint does reference it.
    audienceId: z.string().optional(),
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

export type CustomAudienceDestination = Destination<
  CustomAudienceDestConfig,
  CustomAudienceDeliveryAccount | null
>;

export type CustomAudienceConnection = Connection<{
  destination: CustomAudienceConnectionDestConfig;
}>;

export type CustomAudienceRouterRequest = RouterTransformationRequestData<
  RudderRecordV2,
  CustomAudienceDestination,
  CustomAudienceConnection,
  Metadata
>;

export const customAudienceInputSchema = makeRouterInputSchema({
  destinationConfig: CustomAudienceDestConfigSchema,
  message: z
    .object({
      type: z.literal('record'),
      action: z.nativeEnum(RecordAction),
      identifiers: z.record(z.unknown()),
    })
    .passthrough(),
  connectionConfig: z.object({ destination: CustomAudienceConnectionDestConfigSchema }),
});

export type CustomAudienceRouterInput = z.infer<typeof customAudienceInputSchema> & {
  metadata?: CustomAudienceAuthMetadata;
};
