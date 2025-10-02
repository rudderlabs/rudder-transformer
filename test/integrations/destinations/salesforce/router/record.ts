import { Connection, Destination, RouterTransformationRequest } from '../../../../../src/types';

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
      metadata: {
        destinationId: 'salesforce-dest-id',
        workspaceId: 'test-workspace-id',
        jobId: 1,
      },
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
      metadata: {
        destinationId: 'salesforce-dest-id',
        workspaceId: 'test-workspace-id',
        jobId: 2,
      },
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
          headers: {},
          params: {},
          body: {
            JSON: {
              Email: 'test1@example.com',
              FirstName: 'John',
              LastName: 'Doe',
              Company: 'Acme Corp',
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
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
          headers: {},
          params: {},
          body: {
            JSON: {
              Email: 'test2@example.com',
              FirstName: 'Jane',
              LastName: 'Smith',
              Company: 'Beta Inc',
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
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
      metadata: {
        destinationId: 'salesforce-dest-id',
        workspaceId: 'test-workspace-id',
        jobId: 3,
      },
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
          headers: {
            'Content-Type': 'application/json',
          },
          params: {},
          body: {
            JSON: {
              Email: 'vdm2test@example.com',
              FirstName: 'VDM',
              LastName: 'Two',
              email: 'vdm2test@example.com',
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
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
];

