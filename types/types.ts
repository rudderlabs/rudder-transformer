type PrimitiveDataObject = string | number | boolean | undefined;

type DataObject = {
  [key: string]:
    | PrimitiveDataObject
    | DataObject
    | (PrimitiveDataObject | DataObject)[];
};

type ObjectType = PrimitiveDataObject | DataObject;

type TransformationDefaultResponse = {
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
  sourceTpConfig: ObjectType;
  mergedTpConfig: ObjectType;
  destinationId: string;
  jobRunId: string;
  jobId: number;
  sourceBatchId: string;
  sourceJobId: string;
  sourceJobRunId: string;
  sourceTaskId: string;
  sourceTaskRunId: string;
  recordId: ObjectType;
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

type Transformation = {
  VersionID: string;
  ID: string;
  Config: ObjectType;
};

type DestinationDefinition = {
  ID: string;
  Name: string;
  DisplayName: string;
  Config: ObjectType;
  ResponseRules: ObjectType;
};

type Destination = {
  ID: string;
  Name: string;
  DestinationDefinition: DestinationDefinition;
  Config: ObjectType;
  Enabled: boolean;
  WorkspaceID: string;
  Transformations: Transformation[];
  RevisionID: string;
};

type ProcessorRequest = {
  request?: ObjectType;
  message: ObjectType;
  metadata: Metadata;
  destination: Destination;
  libraries: ObjectType;
};

type RouterData = {
  request?: ObjectType;
  message: ObjectType;
  metadata: Metadata;
  destination: Destination;
};

type RouterRequest = {
  input: RouterData[];
  destType: string;
};

type ProcessorResponse = {
  output: TransformationDefaultResponse | ObjectType;
  metadata: Metadata;
  statusCode: number;
  error: string;
  statTags: Object;
};

type RouterResponse = {
  batchedRequest: TransformationDefaultResponse | ObjectType;
  metadata: Metadata[];
  destination: Destination;
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
  error: ObjectType;
  statusCode: number;
  outputToSource: ObjectType;
  statTags: ObjectType;
};

type DeliveryResponse = {
  status: number;
  message: string;
  destinationResponse: ObjectType;
  statTags: Object;
  authErrorCategory?: string;
};

type RudderMessage = {
  userId?: string;
  anonymousId: string;
  type: string;
  channel: string;
  context: ObjectType;
  originalTimestamp: Date;
  sentAt: Date;
  event?: string;
  integrations?: ObjectType;
  messageId?: string;
  properties?: ObjectType;
  traits?: ObjectType;
};

type ErrorDetailer = {
  integrationType: string;
  stage: string;
  serverRequestMetadata: ObjectType;
  eventMetadatas: Metadata[];
  destinationInfo: Destination[];
  inputPayload: ObjectType[] | ObjectType;
  errorContext: string;
};
export {
  ObjectType,
  Metadata,
  ProcessorRequest,
  ProcessorResponse,
  RouterRequest,
  RouterData,
  RouterResponse,
  RudderMessage,
  TransformationDefaultResponse,
  SourceTransformResponse,
  DeliveryResponse,
  ErrorDetailer
};
