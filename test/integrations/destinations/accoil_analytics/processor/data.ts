const apiKeyProd = 'api_key';
const apiKeyStg = 'stg_api_key';

const endpointProd = 'https://in.accoil.com/segment';
const endpointStg = 'https://instaging.accoil.com/segment';

const expectedHeadersProd = {
  'authorization': 'Basic YXBpX2tleTo=',
  'content-type': 'application/json',
};
const expectedHeadersStg = {
  'authorization': 'Basic c3RnX2FwaV9rZXk6',
  'content-type': 'application/json',
};

type Destination = {
  Config: {
    apiKey: string;
  }
  DestinationDefinition: {
    Config: {
      cdkV2Enabled: true,
    }
  }
}

const destination = (apiKey: string): Destination => {
  return {
    Config: {
      apiKey: apiKey,
    },
    DestinationDefinition: {
      Config: {
        cdkV2Enabled: true,
      },
    },
  };
};

const destinationProd = destination(apiKeyProd);

const destinationStg = destination(apiKeyStg);

const metadata = {
  destinationId: 'destId',
  workspaceId: 'wspId',
};

const successfulData = (
  options: {
    description: string,
    destination: Destination,
    message: Record<string, any>,
    endpoint: string,
    response: Record<string, any>,
    expectedHeaders: Record<string, string>
  },
  expectedStatusCode: number = 200
) => {
  return {
    name: 'accoil_analytics',
    description: options.description,
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: options.destination,
            message: options.message,
            metadata: metadata,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                FORM: {},
                JSON_ARRAY: {},
                XML: {},
                JSON: options.response,
              },
              endpoint: options.endpoint,
              files: {},
              params: {},
              type: 'REST',
              version: '1',
              method: 'POST',
              userId: '',
              headers: options.expectedHeaders,
            },
            statusCode: expectedStatusCode,
            metadata: metadata,
          },
        ],
      },
    },
  };
};

const failureData = (
  options: {
    description: string,
    body: [Record<string, any>],
    error: string,
    errorCategory: string,
    errorType: string,
  },
  expectedStatusCode: number = 400
) => {
  return {
    name: 'accoil_analytics',
    description: options.description,
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: options.body,
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            statusCode: expectedStatusCode,
            error: options.error,
            statTags: {
              errorCategory: options.errorCategory,
              errorType: options.errorType,
              destType: 'ACCOIL_ANALYTICS',
              module: 'destination',
              implementation: 'cdkV2',
              destinationId: 'destId',
              workspaceId: 'wspId',
              feature: 'processor',
            },
            metadata: metadata,
          },
        ],
      },
    },
  };
};

const successfulProdData = (
  options: {
    description: string,
    message: Record<string, any>,
    response: Record<string, any>
  },
  expectedStatusCode: number = 200
) => {
  return successfulData({
    ...options,
    destination: destinationProd,
    endpoint: endpointProd,
    expectedHeaders: expectedHeadersProd,
  }, expectedStatusCode);
};

const successfulStgData = (
  options: {
    description: string,
    message: Record<string, any>,
    response: Record<string, any>
  },
  expectedStatusCode: number = 200
) => {
  return successfulData({
    ...options,
    destination: destinationStg,
    endpoint: endpointStg,
    expectedHeaders: expectedHeadersStg,
  }, expectedStatusCode);
};

export const data = [
  // Successful track
  successfulProdData({
    description: 'Successful track event',
    message: {
      userId: '1234567890',
      event: 'Activated',
      type: 'track',
      messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
      properties: {
        email: 'frank@example.com'
      },
      timestamp: '2024-01-23T08:35:17.562Z',
    },
    response: {
      type: 'track',
      event: 'Activated',
      userId: '1234567890',
      timestamp: '2024-01-23T08:35:17.562Z',
    },
  }),
  // Successful identify
  successfulProdData({
    description: 'Successful identify event',
    message: {
      userId: 'bobby',
      type: 'identify',
      traits: {
        email: 'bobby@example.com',
        name: 'Little Bobby',
        role: 'admin',
        createdAt: '2024-01-20T08:35:17.342Z',
        accountStatus: 'trial',
      },
      timestamp: '2024-01-20T08:35:17.342Z',
      originalTimestamp: '2024-01-23T08:35:17.342Z',
      sentAt: '2024-01-23T08:35:35.234Z',
    },
    response: {
      userId: 'bobby',
      type: 'identify',
      traits: {
        email: 'bobby@example.com',
        name: 'Little Bobby',
        role: 'admin',
        createdAt: '2024-01-20T08:35:17.342Z',
        accountStatus: 'trial',
      },
      timestamp: '2024-01-20T08:35:17.342Z',
    },
  }),
  // Successful group
  successfulProdData({
    description: 'Successful group event',
    message: {
      userId: 'bobby',
      groupId: 'bobbygroup',
      type: 'group',
      traits: {
        name: 'Little Bobby Group',
        createdAt: '2024-01-20T08:35:17.342Z',
        status: 'paid',
        mrr: '10.1',
        plan: 'basic',
      },
      timestamp: '2024-01-20T08:35:17.342Z',
      originalTimestamp: '2024-01-23T08:35:17.342Z',
      sentAt: '2024-01-23T08:35:35.234Z',
    },
    response: {
      userId: 'bobby',
      groupId: 'bobbygroup',
      type: 'group',
      traits: {
        name: 'Little Bobby Group',
        createdAt: '2024-01-20T08:35:17.342Z',
        status: 'paid',
        mrr: '10.1',
        plan: 'basic',
      },
      timestamp: '2024-01-20T08:35:17.342Z',
    },
  }),
  // Successful page
  successfulProdData({
    description: 'Successful page event',
    message: {
      userId: 'bobby',
      type: 'page',
      name: 'Account Details',
      traits: {
        name: 'Sub page: Configuration',
      },
      timestamp: '2024-01-20T08:35:17.342Z',
      originalTimestamp: '2024-01-23T08:35:17.342Z',
      sentAt: '2024-01-23T08:35:35.234Z',
    },
    response: {
      userId: 'bobby',
      type: 'page',
      name: 'Account Details',
      timestamp: '2024-01-20T08:35:17.342Z',
    },
  }),
  // Successful screen
  successfulProdData({
    description: 'Successful screen event',
    message: {
      userId: 'bobby',
      type: 'screen',
      name: 'Configuration',
      traits: {
        account: 'Bobby Account',
      },
      timestamp: '2024-01-20T08:35:17.342Z',
      originalTimestamp: '2024-01-23T08:35:17.342Z',
      sentAt: '2024-01-23T08:35:35.234Z',
    },
    response: {
      userId: 'bobby',
      type: 'screen',
      name: 'Configuration',
      timestamp: '2024-01-20T08:35:17.342Z',
    },
  }),
  // Verify sending to staging environment
  successfulStgData({
    description: 'Successful screen event: staging',
    message: {
      userId: 'bobby',
      type: 'screen',
      name: 'Configuration',
      traits: {
        account: 'Bobby Account',
      },
      timestamp: '2024-01-20T08:35:17.342Z',
      originalTimestamp: '2024-01-23T08:35:17.342Z',
      sentAt: '2024-01-23T08:35:35.234Z',
    },
    response: {
      userId: 'bobby',
      type: 'screen',
      name: 'Configuration',
      timestamp: '2024-01-20T08:35:17.342Z',
    },
  }),

  // Verify checking for invalid payloads (eg no apiKey, missing parts of message)
  // Global validation
  failureData({
    description: 'Missing required apiKey in config',
    body: [
      {
        destination: {
          Config: {},
          DestinationDefinition: {
            Config: {
              cdkV2Enabled: true,
            },
          },
        },
        message: {
          userId: '1234567890',
          event: 'Activated',
          type: 'track',
          messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
          properties: {
            email: 'frank@example.com'
          },
          timestamp: '2024-01-23T08:35:17.562Z',
        },
        metadata: metadata,
      },
    ],
    error: 'apiKey must be supplied in destination config: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: apiKey must be supplied in destination config',
    errorCategory: 'dataValidation',
    errorType: 'configuration',
  }),
  failureData({
    description: 'Missing required timestamp in payload',
    body: [
      {
        destination: destinationProd,
        message: {
          userId: '1234567890',
          event: 'Activated',
          type: 'track',
          messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
          properties: {
            email: 'frank@example.com'
          },
        },
        metadata: metadata,
      },
    ],
    error: 'timestamp is required for all calls: Workflow: procWorkflow, Step: validateTimestamp, ChildStep: undefined, OriginalError: timestamp is required for all calls',
    errorCategory: 'dataValidation',
    errorType: 'instrumentation',
  }),
  // Track validation
  failureData({
    description: 'Missing required event in track payload',
    body: [
      {
        destination: destinationProd,
        message: {
          userId: '1234567890',
          type: 'track',
          messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
          properties: {
            email: 'frank@example.com'
          },
          timestamp: '2024-01-23T08:35:17.562Z',
        },
        metadata: metadata,
      },
    ],
    error: 'event is required for track call: Workflow: procWorkflow, Step: validateTrackPayload, ChildStep: undefined, OriginalError: event is required for track call',
    errorCategory: 'dataValidation',
    errorType: 'instrumentation',
  }),
  failureData({
    description: 'Missing required userId in track payload',
    body: [
      {
        destination: destinationProd,
        message: {
          event: 'event',
          type: 'track',
          messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
          properties: {
            email: 'frank@example.com'
          },
          timestamp: '2024-01-23T08:35:17.562Z',
        },
        metadata: metadata,
      },
    ],
    error: 'userId is required for track call: Workflow: procWorkflow, Step: validateTrackPayload, ChildStep: undefined, OriginalError: userId is required for track call',
    errorCategory: 'dataValidation',
    errorType: 'instrumentation',
  }),
  // Page validation
  failureData({
    description: 'Missing required name in page payload',
    body: [
      {
        destination: destinationProd,
        message: {
          userId: 'bobby',
          type: 'page',
          messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
          properties: {
            email: 'frank@example.com'
          },
          timestamp: '2024-01-23T08:35:17.562Z',
        },
        metadata: metadata,
      },
    ],
    error: 'name is required for page call: Workflow: procWorkflow, Step: validatePagePayload, ChildStep: undefined, OriginalError: name is required for page call',
    errorCategory: 'dataValidation',
    errorType: 'instrumentation',
  }),
  failureData({
    description: 'Missing required userId in page payload',
    body: [
      {
        destination: destinationProd,
        message: {
          name: 'Page name',
          type: 'page',
          messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
          properties: {
            email: 'frank@example.com'
          },
          timestamp: '2024-01-23T08:35:17.562Z',
        },
        metadata: metadata,
      },
    ],
    error: 'userId is required for page call: Workflow: procWorkflow, Step: validatePagePayload, ChildStep: undefined, OriginalError: userId is required for page call',
    errorCategory: 'dataValidation',
    errorType: 'instrumentation',
  }),
  // Validate screen
  failureData({
    description: 'Missing required name in screen payload',
    body: [
      {
        destination: destinationProd,
        message: {
          userId: 'bobby',
          type: 'screen',
          messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
          properties: {
            email: 'frank@example.com'
          },
          timestamp: '2024-01-23T08:35:17.562Z',
        },
        metadata: metadata,
      },
    ],
    error: 'name is required for screen call: Workflow: procWorkflow, Step: validateScreenPayload, ChildStep: undefined, OriginalError: name is required for screen call',
    errorCategory: 'dataValidation',
    errorType: 'instrumentation',
  }),
  failureData({
    description: 'Missing required userId in screen payload',
    body: [
      {
        destination: destinationProd,
        message: {
          name: 'screen name',
          type: 'screen',
          messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
          properties: {
            email: 'frank@example.com'
          },
          timestamp: '2024-01-23T08:35:17.562Z',
        },
        metadata: metadata,
      },
    ],
    error: 'userId is required for screen call: Workflow: procWorkflow, Step: validateScreenPayload, ChildStep: undefined, OriginalError: userId is required for screen call',
    errorCategory: 'dataValidation',
    errorType: 'instrumentation',
  }),
  // Identify validate
  failureData({
    description: 'Missing required userId in identify payload',
    body: [
      {
        destination: destinationProd,
        message: {
          type: 'identify',
          messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
          properties: {
            email: 'frank@example.com'
          },
          timestamp: '2024-01-23T08:35:17.562Z',
        },
        metadata: metadata,
      },
    ],
    error: 'userId is required for identify call: Workflow: procWorkflow, Step: validateIdentifyPayload, ChildStep: undefined, OriginalError: userId is required for identify call',
    errorCategory: 'dataValidation',
    errorType: 'instrumentation',
  }),
  // Group validate
  failureData({
    description: 'Missing required userId in group payload',
    body: [
      {
        destination: destinationProd,
        message: {
          type: 'group',
          groupId: 'group1',
          messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
          properties: {
            email: 'frank@example.com'
          },
          timestamp: '2024-01-23T08:35:17.562Z',
        },
        metadata: metadata,
      },
    ],
    error: 'userId is required for group call: Workflow: procWorkflow, Step: validateGroupPayload, ChildStep: undefined, OriginalError: userId is required for group call',
    errorCategory: 'dataValidation',
    errorType: 'instrumentation',
  }),
  failureData({
    description: 'Missing required groupId in group payload',
    body: [
      {
        destination: destinationProd,
        message: {
          userId: 'user',
          type: 'group',
          messageId: '1873f8bd-68f7-40fc-b262-56a245f22862',
          properties: {
            email: 'frank@example.com'
          },
          timestamp: '2024-01-23T08:35:17.562Z',
        },
        metadata: metadata,
      },
    ],
    error: 'groupId is required for group call: Workflow: procWorkflow, Step: validateGroupPayload, ChildStep: undefined, OriginalError: groupId is required for group call',
    errorCategory: 'dataValidation',
    errorType: 'instrumentation',
  }),
];
