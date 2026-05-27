import { HashingType } from '../../util/audienceUtils';
import type { Connection, Destination } from '../../../types/controlPlaneConfig';
import type { Metadata, RecordAction, RudderRecordV2 } from '../../../types/rudderEvents';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
import type { AUTHENTICATION_TYPES } from './constants';

export type Action = `${RecordAction}`;

export type AuthenticationType = (typeof AUTHENTICATION_TYPES)[keyof typeof AUTHENTICATION_TYPES];

export type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'GET' | 'DELETE';

export type ActionFieldConfig = {
  name: string;
  isRequired: boolean;
  hashType: HashingType;
  isCustom: boolean;
};

export type ActionConfig = {
  endpoint: string;
  method: HttpMethod;
  requestBody: string;
  batchSize: number;
  fields: ActionFieldConfig[];
};

export type UpdateActionConfig = ActionConfig & {
  useInsertConfig?: boolean;
};

export type CustomAudienceHeader = {
  key: string;
  value: string;
};

export type CustomAudienceDestConfig = {
  baseUrl: string;
  authenticationType: AuthenticationType;
  headers?: CustomAudienceHeader[];
  actions: {
    insert?: ActionConfig;
    update?: UpdateActionConfig;
    delete?: ActionConfig;
  };
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
