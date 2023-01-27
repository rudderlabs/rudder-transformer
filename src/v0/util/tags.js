const TAG_NAMES = {
  MODULE: 'module',
  IMPLEMENTATION: 'implementation',
  FEATURE: 'feature',
  ERROR_CATEGORY: 'errorCategory',
  ERROR_TYPE: 'errorType',
  META: 'meta',
  DEST_TYPE: 'destType',
  SRC_TYPE: 'srcType',
  CLUSTER: 'cluster',
  NAMESPACE: 'namespace',
  CUSTOMER: 'customer',
  DESTINATION_ID: 'destinationId',
  WORKSPACE_ID: 'workspaceId',
  SOURCE_ID: 'sourceId',
};

const MODULES = {
  SOURCE: 'source',
  DESTINATION: 'destination',
  MISCELLANEOUS: 'miscellaneous',
};

const IMPLEMENTATIONS = {
  NATIVE: 'native',
  CDK_V1: 'cdkV1',
  CDK_V2: 'cdkV2',
};

const FEATURES = {
  PROCESSOR: 'processor',
  ROUTER: 'router',
  BATCH: 'batch',
  DATA_DELIVERY: 'dataDelivery',
  USER_DELETION: 'userDeletion',
};

const ERROR_CATEGORIES = {
  DATA_VALIDATION: 'dataValidation',
  NETWORK: 'network',
  PLATFORM: 'platform',
  TRANSFORMATION: 'transformation',
};

const ERROR_TYPES = {
  INSTRUMENTATION: 'instrumentation',
  CONFIGURATION: 'configuration',
  THROTTLED: 'throttled',
  RETRYABLE: 'retryable',
  ABORTED: 'aborted',
  OAUTH_SECRET: 'oAuthSecret',
  UNSUPPORTED: 'unsupported'
};

const METADATA = {
  INVALID_AUTH_TOKEN: 'invalidAuthToken',
  UNHANDLED_STATUS_CODE: 'unhandledStatusCode',
  INSTRUMENTATION: 'instrumentation',
  UNAUTHORIZED: 'unauthorized',
};

module.exports = {
  TAG_NAMES,
  MODULES,
  IMPLEMENTATIONS,
  FEATURES,
  ERROR_CATEGORIES,
  ERROR_TYPES,
  METADATA,
};
