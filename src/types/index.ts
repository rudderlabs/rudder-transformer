type ProcessorTransformationOutput = {
  version: string;
  type: string;
  method: string;
  endpoint: string;
  userId: string;
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
  body?: {
    JSON?: Record<string, unknown>;
    JSON_ARRAY?: Record<string, unknown>;
    XML?: Record<string, unknown>;
    FORM?: Record<string, unknown>;
  };
  files?: Record<string, unknown>;
  metadata?: Metadata;
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

type UserTransformationInput = {
  VersionID: string;
  ID: string;
  Config: Object;
};

type DestinationDefinition = {
  ID: string;
  Name: string;
  DisplayName: string;
  Config: Object;
};

type Destination = {
  ID: string;
  Name: string;
  DestinationDefinition: DestinationDefinition;
  Config: Object;
  Enabled: boolean;
  WorkspaceID: string;
  Transformations: UserTransformationInput[];
  RevisionID?: string;
};

type UserTransformationLibrary = {
  VersionID: string;
};

type ProcessorTransformationRequest = {
  request?: Object;
  message: Object;
  metadata: Metadata;
  destination: Destination;
  libraries: UserTransformationLibrary[];
};

type RouterTransformationRequestData = {
  request?: Object;
  message: Object;
  metadata: Metadata;
  destination: Destination;
};

type RouterTransformationRequest = {
  input: RouterTransformationRequestData[];
  destType: string;
};

type ProcessorTransformationResponse = {
  output?: ProcessorTransformationOutput | RudderMessage;
  metadata: Metadata;
  statusCode: number;
  error?: string;
  statTags: Object;
};

type RouterTransformationResponse = {
  batchedRequest?: ProcessorTransformationOutput;
  metadata: Metadata[];
  destination: Destination;
  batched: boolean;
  statusCode: number;
  error: string;
  statTags: Object;
};

type SourceTransformationOutput = {
  batch: RudderMessage[];
};

type SourceTransformationResponse = {
  output: SourceTransformationOutput;
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

enum MessageType {
  IDENTIFY = 'identify',
  TRACK = 'track',
  PAGE = 'page',
  SCREEN = 'screen',
  GROUP = 'group',
  ALIAS = 'alias',
  AUDIENCE_LIST = 'audiencelist',
}

type RudderMessage = {
  userId?: string;
  anonymousId: string;
  type: MessageType;
  channel: string;
  context: Object;
  originalTimestamp: Date;
  sentAt: Date;
  timestamp: Date;
  event?: string;
  integrations?: Object;
  messageId: string;
  properties?: Object;
  traits?: Object;
};

type ErrorDetailer = {
  module: string;
  implementation: string;
  feature: string;
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
};

type MetaTransferObject = {
  metadatas?: Metadata[];
  metadata?: Metadata;
  errorDetails: ErrorDetailer;
  errorContext: string;
};

type UserTransformationResponse = {
  transformedEvent: RudderMessage;
  metadata: Metadata;
  error: Object;
};

type UserTransformationServiceResponse = {
  transformedEvents: ProcessorTransformationResponse[];
  retryStatus: number;
};

type UserDeletionRequest = {
  userAttributes: any[];
  config: Object;
  destType: string;
  jobId: string;
};

type UserDeletionResponse = {
  statusCode: number;
  error?: string;
  status?: string;
  authErrorCategory: any;
  statTags: Object;
};

type ComparatorInput = {
  events: ProcessorTransformationRequest[] | RouterTransformationRequestData[];
  destination: string;
  version: string;
  requestMetadata: Object;
  feature: string;
};

export {
  Metadata,
  UserTransformationLibrary,
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  RouterTransformationRequest,
  RouterTransformationRequestData,
  RouterTransformationResponse,
  RudderMessage,
  ProcessorTransformationOutput,
  SourceTransformationResponse,
  DeliveryResponse,
  ErrorDetailer,
  UserTransformationResponse,
  UserTransformationServiceResponse,
  MetaTransferObject,
  UserDeletionRequest,
  UserDeletionResponse,
  Destination,
  ComparatorInput
};
