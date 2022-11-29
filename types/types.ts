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
  message: ObjectType;
  metadata: Metadata;
  destination: Destination;
  libraries: ObjectType;
};

type RouterData = {
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

type ProxyResponse = {
  status: number;
  message: string;
  destinationResponse: ObjectType;
  statTags: Object;
  authErrorCategory?: string;
};

export {
  ObjectType,
  Metadata,
  ProcessorRequest,
  ProcessorResponse,
  RouterRequest,
  RouterData,
  RouterResponse,
  TransformationDefaultResponse,
  ProxyResponse
};
