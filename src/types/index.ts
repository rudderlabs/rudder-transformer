type TransformationStage = 'processor' | 'router';
type RudderStackEvent = {
  anonymousId: string;
  channel: string;
  context: Context;
  type: MessageType;
  event: string;
  originalTimestamp: string;
  sentAt: string;
  integrations: Record<string, unknown>;
  messageId: string;
  properties: Record<string, unknown>;
  receivedAt: string;
  timestamp: string;
  userId: string;
  request_ip: string;
};

type Context = {
  app: {
    name: string;
    version: string;
    build: string;
    namespace: string;
  };
  campaign: {
    name: string;
    source: string;
    medium: string;
    term: string;
    content: string;
  };
  device: {
    id: string;
    manufacturer: string;
    model: string;
    name: string;
    type: string;
    version: string;
    token: string;
    advertisingId: string;
    adTrackingEnabled: boolean;
    attTrackingStatus: string;
  };
  library: {
    name: string;
    version: string;
  };
  locale: string;
  network: {
    bluetooth: string;
    carrier: string;
    cellular: string;
    wifi: string;
  };
  os: {
    name: string;
    version: string;
  };
  screen: {
    density: number;
    width: number;
    height: number;
  };
  timezone: string;
  traits: Record<string, unknown>;
  userAgent: string;
  ip: string;
  mappedToDestination: boolean;
  page: {
    path: string;
    referrer: string;
    referring_domain: string;
    initial_referrer: string;
    initial_referring_domain: string;
    search: string;
    title: string;
    url: string;
  };
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
    geoSource: string;
  };
};


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

type TransformedOutput = ProcessorTransformationOutput; 

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
  message: RudderStackEvent;
  metadata: Metadata;
  destination: Destination;
  libraries: UserTransformationLibrary[];
};

type RouterTransformationRequestData = {
  request?: Object;
  message: RudderStackEvent;
  metadata: Metadata;
  destination: Destination;
};

type RouterTransformationRequest = {
  input: RouterTransformationRequestData[];
  destType: string;
};

type ProcessorTransformationResponse = {
  output?: ProcessorTransformationOutput | RudderStackEvent;
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
  batch: RudderStackEvent[];
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
  transformedEvent: RudderStackEvent;
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
  rudderDestInfo?: Object;
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
  RudderStackEvent,
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
  ComparatorInput,
  TransformationStage,
  TransformedOutput,
};
