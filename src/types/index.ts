type TransformedEvent = {
  version: string;
  type: string;
  method: string;
  endpoint: string;
  userId: string;
  headers: Record<string, unknown>;
  params?: Record<string, unknown>;
  body?: {
    JSON?: Record<string, unknown>;
    JSON_ARRAY?: Record<string, unknown>;
    XML?: Record<string, unknown>;
    FORM?: Record<string, unknown>;
  };
  files?: Record<string, unknown>;
  metadata?: Metadata;
  [key: string]: any;
};

type Metadata = {
  sourceId: string;
  workspaceId: string;
  namespace: string;
  instanceId: string;
  sourceType: string;
  sourceCategory: string;
  trackingPlanId: string;
  trackingPlanVersion: number;
  sourceTpConfig: Object;
  mergedTpConfig: Object;
  destinationId: string;
  jobRunId: string;
  jobId: number;
  sourceBatchId: string;
  sourceJobId: string;
  sourceJobRunId: string;
  sourceTaskId: string;
  sourceTaskRunId: string;
  recordId: Object;
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
};

type UserTransformation = {
  VersionID: string;
  ID: string;
  Config: Object;
};

type DestinationDefinition = {
  ID: string;
  Name: string;
  DisplayName: string;
  Config: Object;
  ResponseRules: Object;
};

type Destination = {
  ID: string;
  Name: string;
  DestinationDefinition: DestinationDefinition;
  Config: Object;
  Enabled: boolean;
  WorkspaceID: string;
  Transformations: UserTransformation[];
  RevisionID: string;
};

type Library = {
  VersionID: string;
};

type ProcessorRequest = {
  request?: Object;
  message: Object;
  metadata: Metadata;
  destination: Destination;
  libraries: Library[];
};

type RouterRequestData = {
  request?: Object;
  message: Object;
  metadata: Metadata;
  destination: Destination;
};

type RouterRequest = {
  input: RouterRequestData[];
  destType: string;
};

type ProcessorResponse = {
  output?: TransformedEvent | RudderMessage | Object;
  metadata: Metadata;
  statusCode: number;
  error?: string;
  statTags: Object;
};

type RouterResponse = {
  batchedRequest?: TransformedEvent | Object;
  metadata: Metadata[];
  destination?: Destination;
  batched: boolean;
  statusCode: number;
  error: string;
  statTags: Object;
};

type SourceTransformOutput = {
  batch: RudderMessage[];
};

type SourceTransformResponse = {
  output: SourceTransformOutput;
  error: Object;
  statusCode: number;
  outputToSource: Object;
  statTags: Object;
};

type DeliveryResponse = {
  status: number;
  message: string;
  destinationResponse: Object;
  statTags: Object;
  authErrorCategory?: string;
};

type RudderMessage = {
  userId?: string;
  anonymousId: string;
  type: string;
  channel: string;
  context: Object;
  originalTimestamp: Date;
  sentAt: Date;
  event?: string;
  integrations?: Object;
  messageId?: string;
  properties?: Object;
  traits?: Object;
  [key: string]: any;
};

type ErrorDetailer = {
  module?: string;
  implementation?: string;
  feature?: string;
  errorCategory?: string;
  errorType?: string;
  meta?: string;
  destType?: string;
  srcType?: string;
  cluster?: string;
  customer?: string;
  destinationId?: string;
  workspaceId?: string;
  sourceId?: string;
  context?: string;
};

type MetaTransferObject = {
  metadatas?: Metadata[];
  metadata?: Metadata;
  errorDetails: ErrorDetailer;
};

type UserTransformResponse = {
  transformedEvent: RudderMessage;
  metadata: Metadata;
  error: Object;
};

type UserTransfromServiceResponse = {
  transformedEvents: ProcessorResponse[];
  retryStatus: number;
};

export {
  Metadata,
  Library,
  ProcessorRequest,
  ProcessorResponse,
  RouterRequest,
  RouterRequestData,
  RouterResponse,
  RudderMessage,
  TransformedEvent,
  SourceTransformResponse,
  DeliveryResponse,
  ErrorDetailer,
  UserTransformResponse,
  UserTransfromServiceResponse,
  MetaTransferObject
};
