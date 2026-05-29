import { z } from 'zod';
import { HashingType } from '../../util/audienceUtils';
import type { Connection, Destination } from '../../../types/controlPlaneConfig';
import type { Metadata, RecordAction, RudderRecordV2 } from '../../../types/rudderEvents';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
import type { AUTHENTICATION_TYPES } from './constants';

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

const parseTemplateActionConfigSchema = actionConfigSchema
  .partial()
  .extend({ requestBody: actionConfigSchema.shape.requestBody });

const parseTemplateUpdateActionConfigSchema = z.union([
  parseTemplateActionConfigSchema.extend({ useInsertConfig: z.boolean().optional() }),
  z.object({ useInsertConfig: z.literal(true) }),
]);

export const actionsSchema = z.object({
  insert: actionConfigSchema.optional(),
  update: updateActionConfigSchema.optional(),
  delete: actionConfigSchema.optional(),
});

export const parseTemplateActionsSchema = z.object({
  insert: parseTemplateActionConfigSchema.optional(),
  update: parseTemplateUpdateActionConfigSchema.optional(),
  delete: parseTemplateActionConfigSchema.optional(),
});

export type HttpMethod = z.infer<typeof actionConfigSchema>['method'];
export type ActionFieldConfig = z.infer<typeof actionFieldConfigSchema>;
export type ActionConfig = z.infer<typeof actionConfigSchema>;
export type UpdateActionConfig = z.infer<typeof updateActionConfigSchema>;

export type CustomAudienceHeader = {
  key: string;
  value: string;
};

export type CustomAudienceDestConfig = {
  baseUrl: string;
  authenticationType: AuthenticationType;
  headers?: CustomAudienceHeader[];
  actions: z.infer<typeof actionsSchema>;
  basicAuthUserName?: string;
  basicAuthPassword?: string;
  bearerToken?: string;
  apiKeyName?: string;
  apiKeyValue?: string;
};

export type CustomMapping = {
  /** The literal value to inject (not a field reference) */
  from: string;
  /** The target field name on the record */
  to: string;
};

export type CustomAudienceConnectionDestConfig = {
  audienceId: string;
  isHashRequired: boolean;
  customMappings?: CustomMapping[];
};

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
