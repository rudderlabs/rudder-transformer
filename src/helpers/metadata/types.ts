import { FixMe } from '../../util/types';

export type AllMetadata = Metadata | ProxyMetdata | Metadata[] | ProxyMetdata[];

export type MetadataT = {
  requestLog(
    m: AllMetadata,
    kindInfo: TransformationKindInfo,
  ): (msg: string, args: Record<string, FixMe>) => void;
  responseLog(
    m: AllMetadata,
    kindInfo: TransformationKindInfo,
  ): (msg: string, args: Record<string, FixMe>) => void;
} & (Metadata | ProxyMetdata | Metadata[] | ProxyMetdata[]);

export interface MetadataI {
  requestLog(msg: string, args: Record<string, FixMe>): void;
  responseLog(msg: string, args: Record<string, FixMe>): void;
}

export type CommonMetadata = {
  sourceId: string;
  destinationId: string;
  workspaceId: string;
  jobId: number;
};

export type Metadata = CommonMetadata & {
  namespace: string;
  instanceId: string;
  sourceType: string;
  sourceCategory: string;
  trackingPlanId: string;
  trackingPlanVersion: number;
  sourceTpConfig: object;
  mergedTpConfig: object;
  jobRunId: string;
  jobId: number;
  sourceBatchId: string;
  sourceJobId: string;
  sourceJobRunId: string;
  sourceTaskId: string;
  sourceTaskRunId: string;
  recordId: object;
  destinationType: string;
  messageId: string;
  oauthAccessToken: string;
  messageIds: string[];
  rudderId: string;
  receivedAt: string;
  eventName: string;
  eventType: string;
  sourceDefinitionId: string;
  destinationDefinitionId: string;
  transformationId: string;
  dontBatch?: boolean;
};

export type ProxyMetdata = CommonMetadata & {
  jobId: number;
  attemptNum: number;
  userId: string;
  secret: Record<string, unknown>;
  destInfo?: Record<string, unknown>;
  omitempty?: Record<string, unknown>;
  dontBatch: boolean;
};

export type TransformationKindInfo = {
  module: string;
  implementation: string;
  feature: string;
};

export type TransformationMeta = CommonMetadata & TransformationKindInfo;

export type RequestInfo = {
  url: string;
  body: FixMe;
  method: string;
};

export type ResponseInfo = {
  responseBody: FixMe;
  status: number;
  responseHeaders: Record<string, FixMe>;
};
