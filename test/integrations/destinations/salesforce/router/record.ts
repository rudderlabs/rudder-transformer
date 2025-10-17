import { Connection, Destination, RouterTransformationRequest } from '../../../../../src/types';
import { generateMetadata } from '../../../testUtils';

const emptyHeaders = {};
const emptyParams = {};
const emptyBodyFormats = {
  JSON_ARRAY: {},
  XML: {},
  FORM: {},
};
const emptyFiles = {};
const jsonHeaders = {
  'Content-Type': 'application/json',
};

const destination: Destination = {
  Config: {
    rudderAccountId: 'test-account-123',
  },
  ID: 'salesforce-dest-id',
  Name: 'SALESFORCE_BULK_UPLOAD',
  Enabled: true,
  WorkspaceID: 'test-workspace-id',
  DestinationDefinition: {
    ID: 'salesforce-def-id',
    Name: 'SALESFORCE_BULK_UPLOAD',
    DisplayName: 'Salesforce Bulk Upload',
    Config: {},
  },
  Transformations: [],
  IsConnectionEnabled: true,
  IsProcessorEnabled: true,
};

// VDM v1 flow - uses context.mappedToDestination
export const vdmV1RecordRequest: RouterTransformationRequest = {
  input: [
    {
      destination,
      message: {
        type: 'record',
        action: 'insert',
        fields: {
          Email: 'test1@example.com',
          FirstName: 'John',
          LastName: 'Doe',
          Company: 'Acme Corp',
        },
        context: {
          mappedToDestination: true,
          externalId: [
            {
              type: 'Salesforce-Contact',
              id: 'test1@example.com',
              identifierType: 'Email',
            },
          ],
        },
        recordId: '1',
      },
      metadata: generateMetadata(1),
    },
    {
      destination,
      message: {
        type: 'record',
        action: 'insert',
        fields: {
          Email: 'test2@example.com',
          FirstName: 'Jane',
          LastName: 'Smith',
          Company: 'Beta Inc',
        },
        context: {
          mappedToDestination: true,
          externalId: [
            {
              type: 'Salesforce-Contact',
              id: 'test2@example.com',
              identifierType: 'Email',
            },
          ],
        },
        recordId: '2',
      },
      metadata: generateMetadata(2),
    },
  ],
  destType: 'salesforce_bulk_upload',
};

export const vdmV1RecordOutput = {
  response: {
    status: 200,
    body: [
      {
        output: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: '/bulk',
          headers: emptyHeaders,
          params: emptyParams,
          body: {
            JSON: {
              Email: 'test1@example.com',
              FirstName: 'John',
              LastName: 'Doe',
              Company: 'Acme Corp',
              rudderOperation: 'insert',
            },
            ...emptyBodyFormats,
          },
          files: emptyFiles,
        },
        metadata: {
          destinationId: 'salesforce-dest-id',
          workspaceId: 'test-workspace-id',
          jobId: 1,
        },
        statusCode: 200,
      },
      {
        output: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: '/bulk',
          headers: emptyHeaders,
          params: emptyParams,
          body: {
            JSON: {
              Email: 'test2@example.com',
              FirstName: 'Jane',
              LastName: 'Smith',
              Company: 'Beta Inc',
              rudderOperation: 'insert',
            },
            ...emptyBodyFormats,
          },
          files: emptyFiles,
        },
        metadata: {
          destinationId: 'salesforce-dest-id',
          workspaceId: 'test-workspace-id',
          jobId: 2,
        },
        statusCode: 200,
      },
    ],
  },
};

// VDM v2 flow - uses connection.config.destination
const connectionV2: Connection = {
  sourceId: 'warehouse-source-id',
  destinationId: 'salesforce-dest-id',
  enabled: true,
  config: {
    destination: {
      rudderAccountId: 'test-account-456',
      operation: 'insert',
    },
  },
};

export const vdmV2RecordRequest: RouterTransformationRequest = {
  input: [
    {
      destination,
      connection: connectionV2,
      message: {
        type: 'record',
        action: 'insert',
        fields: {
          Email: 'vdm2test@example.com',
          FirstName: 'VDM',
          LastName: 'Two',
        },
        identifiers: {
          email: 'vdm2test@example.com',
        },
        recordId: '3',
      },
      metadata: generateMetadata(3),
    },
  ],
  destType: 'salesforce_bulk_upload',
};

export const vdmV2RecordOutput = {
  response: {
    status: 200,
    body: [
      {
        output: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: '/bulk',
          headers: jsonHeaders,
          params: emptyParams,
          body: {
            JSON: {
              Email: 'vdm2test@example.com',
              FirstName: 'VDM',
              LastName: 'Two',
              email: 'vdm2test@example.com',
              rudderOperation: 'insert',
            },
            ...emptyBodyFormats,
          },
          files: emptyFiles,
        },
        metadata: {
          destinationId: 'salesforce-dest-id',
          workspaceId: 'test-workspace-id',
          jobId: 3,
        },
        statusCode: 200,
      },
    ],
  },
};

// VDM v2 with multiple operations - tests separate batching
export const vdmV2MultiOperationRequest: RouterTransformationRequest = {
  input: [
    {
      destination,
      connection: connectionV2,
      message: {
        type: 'record',
        action: 'insert',
        fields: {
          Email: 'insert1@example.com',
          FirstName: 'Insert',
          LastName: 'One',
        },
        identifiers: {
          email: 'insert1@example.com',
        },
        recordId: '4',
      },
      metadata: generateMetadata(4),
    },
    {
      destination,
      connection: connectionV2,
      message: {
        type: 'record',
        action: 'update',
        fields: {
          Email: 'update1@example.com',
          FirstName: 'Update',
          LastName: 'One',
        },
        identifiers: {
          email: 'update1@example.com',
        },
        recordId: '5',
      },
      metadata: generateMetadata(5),
    },
    {
      destination,
      connection: connectionV2,
      message: {
        type: 'record',
        action: 'delete',
        fields: {
          Email: 'delete1@example.com',
          FirstName: 'Delete',
          LastName: 'One',
        },
        identifiers: {
          email: 'delete1@example.com',
        },
        recordId: '6',
      },
      metadata: generateMetadata(6),
    },
  ],
  destType: 'salesforce_bulk_upload',
};

export const vdmV2MultiOperationOutput = {
  response: {
    status: 200,
    body: [
      // Batch 1: Delete operations (processed first)
      {
        batchedRequest: [
          {
            version: '1',
            type: 'REST',
            method: 'POST',
            endpoint: '/bulk',
            headers: jsonHeaders,
            params: emptyParams,
            body: {
              JSON: {
                Email: 'delete1@example.com',
                FirstName: 'Delete',
                LastName: 'One',
                email: 'delete1@example.com',
                rudderOperation: 'delete',
              },
              ...emptyBodyFormats,
            },
            files: emptyFiles,
          },
        ],
        metadata: [
          {
            destinationId: 'salesforce-dest-id',
            workspaceId: 'test-workspace-id',
            jobId: 6,
          },
        ],
        batched: true,
        statusCode: 200,
        destination,
      },
      // Batch 2: Insert operations
      {
        batchedRequest: [
          {
            version: '1',
            type: 'REST',
            method: 'POST',
            endpoint: '/bulk',
            headers: jsonHeaders,
            params: emptyParams,
            body: {
              JSON: {
                Email: 'insert1@example.com',
                FirstName: 'Insert',
                LastName: 'One',
                email: 'insert1@example.com',
                rudderOperation: 'insert',
              },
              ...emptyBodyFormats,
            },
            files: emptyFiles,
          },
        ],
        metadata: [
          {
            destinationId: 'salesforce-dest-id',
            workspaceId: 'test-workspace-id',
            jobId: 4,
          },
        ],
        batched: true,
        statusCode: 200,
        destination,
      },
      // Batch 3: Update operations
      {
        batchedRequest: [
          {
            version: '1',
            type: 'REST',
            method: 'POST',
            endpoint: '/bulk',
            headers: jsonHeaders,
            params: emptyParams,
            body: {
              JSON: {
                Email: 'update1@example.com',
                FirstName: 'Update',
                LastName: 'One',
                email: 'update1@example.com',
                rudderOperation: 'update',
              },
              ...emptyBodyFormats,
            },
            files: emptyFiles,
          },
        ],
        metadata: [
          {
            destinationId: 'salesforce-dest-id',
            workspaceId: 'test-workspace-id',
            jobId: 5,
          },
        ],
        batched: true,
        statusCode: 200,
        destination,
      },
    ],
  },
};

// Test data export
export const data = [
  {
    name: 'salesforce_bulk_upload',
    description: 'VDM v1 record event transformation',
    module: 'router',
    version: 'v0',
    input: vdmV1RecordRequest,
    output: vdmV1RecordOutput,
  },
  {
    name: 'salesforce_bulk_upload',
    description: 'VDM v2 record event transformation',
    module: 'router',
    version: 'v0',
    input: vdmV2RecordRequest,
    output: vdmV2RecordOutput,
  },
  {
    name: 'salesforce_bulk_upload',
    description: 'VDM v2 with multiple operations - separate batches',
    module: 'router',
    version: 'v0',
    input: vdmV2MultiOperationRequest,
    output: vdmV2MultiOperationOutput,
  },
];
