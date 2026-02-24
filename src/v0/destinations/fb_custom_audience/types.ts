import type {
  Destination,
  Connection,
  DestinationConnectionConfig,
  Metadata,
} from '../../../types';

interface FbCustomAudienceDestinationConfig {
  accessToken: string;
  audienceId: string;
  userSchema: string | string[];
  isHashRequired: boolean;
  disableFormat?: boolean;
  type?: string;
  subType?: string;
  isRaw?: boolean;
  appSecret?: string;
  isValueBasedAudience?: boolean;
}

export type FbCustomAudienceDestination = Destination<FbCustomAudienceDestinationConfig>;

type FbCustomAudienceV2Connection = Connection<
  DestinationConnectionConfig<FbCustomAudienceDestinationConfig>
>;

export interface DataSource {
  type?: string;
  sub_type?: string;
}

export interface FbCustomAudiencePayload {
  schema?: string[];
  data?: unknown[][];
  is_raw?: boolean;
  data_source?: DataSource;
}

export interface PrepareParams {
  access_token: string;
  appsecret_time?: number;
  appsecret_proof?: string;
}

export interface FbCustomAudienceRequestParams extends PrepareParams {
  payload: FbCustomAudiencePayload;
}

export interface WrappedResponse {
  responseField: FbCustomAudienceRequestParams;
  operationCategory: string;
}

export interface RecordPrepareConfig {
  userSchema: string[];
  isHashRequired: boolean;
  disableFormat?: boolean;
  paramsPayload: FbCustomAudiencePayload;
  prepareParams: PrepareParams;
}

export interface FbRecordMessage {
  type?: string;
  action?: string;
  fields?: Record<string, unknown>;
  identifiers?: Record<string, string | number>;
  context?: {
    destinationFields?: {
      mappedSchema: string[] | string;
    };
  };
}

export interface FbRecordEvent {
  destination: FbCustomAudienceDestination;
  message: FbRecordMessage;
  metadata: Metadata;
  connection?: FbCustomAudienceV2Connection;
}
