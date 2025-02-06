import { Connection, Destination, RouterTransformationRequest } from '../../../../../src/types';
import { VDM_V2_SCHEMA_VERSION } from '../../../../../src/v0/util/constant';
import { generateMetadata } from '../../../testUtils';

const destinationV2: Destination = {
  Config: {
    accessToken: 'ABC',
    disableFormat: false,
    isHashRequired: true,
    isRaw: false,
    skipVerify: false,
    subType: 'NA',
    type: 'NA',
  },
  ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
  Name: 'FB_CUSTOM_AUDIENCE',
  Enabled: true,
  WorkspaceID: '1TSN08muJTZwH8iCDmnnRt1pmLd',
  DestinationDefinition: {
    ID: '1aIXqM806xAVm92nx07YwKbRrO9',
    Name: 'FB_CUSTOM_AUDIENCE',
    DisplayName: 'FB_CUSTOM_AUDIENCE',
    Config: {},
  },
  Transformations: [],
  IsConnectionEnabled: true,
  IsProcessorEnabled: true,
};

const connection: Connection = {
  sourceId: '2MUWghI7u85n91dd1qzGyswpZan',
  destinationId: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
  enabled: true,
  config: {
    destination: {
      schemaVersion: VDM_V2_SCHEMA_VERSION,
      disableFormat: false,
      isHashRequired: true,
      isRaw: false,
      subType: 'NA',
      type: 'NA',
      audienceId: '23848494844100489',
    },
  },
};

const missingAudienceIDConnection: Connection = {
  sourceId: '2MUWghI7u85n91dd1qzGyswpZan',
  destinationId: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
  enabled: true,
  config: {
    destination: {
      schemaVersion: VDM_V2_SCHEMA_VERSION,
    },
  },
};

export const rETLRecordV2RouterRequest: RouterTransformationRequest = {
  input: [
    {
      destination: destinationV2,
      connection: connection,
      message: {
        action: 'insert',
        context: {
          sources: {
            job_run_id: 'cgiiurt8um7k7n5dq480',
            task_run_id: 'cgiiurt8um7k7n5dq48g',
            job_id: '2MUWghI7u85n91dd1qzGyswpZan',
            version: '895/merge',
          },
        },
        recordId: '2',
        rudderId: '2',
        identifiers: {
          EMAIL: 'subscribed@eewrfrd.com',
          FI: 'ghui',
        },
        type: 'record',
      },
      metadata: generateMetadata(1),
    },
    {
      destination: destinationV2,
      connection: connection,
      message: {
        action: 'insert',
        context: {
          sources: {
            job_run_id: 'cgiiurt8um7k7n5dq480',
            task_run_id: 'cgiiurt8um7k7n5dq48g',
            job_id: '2MUWghI7u85n91dd1qzGyswpZan',
            version: '895/merge',
          },
        },
        recordId: '2',
        rudderId: '2',
        identifiers: {
          EMAIL: 'subscribed@eewrfrd.com',
          FI: 'ghui',
        },
        type: 'record',
      },
      metadata: generateMetadata(2),
    },
    {
      destination: destinationV2,
      connection: connection,
      message: {
        action: 'insert',
        context: {
          sources: {
            job_run_id: 'cgiiurt8um7k7n5dq480',
            task_run_id: 'cgiiurt8um7k7n5dq48g',
            job_id: '2MUWghI7u85n91dd1qzGyswpZan',
            version: '895/merge',
          },
        },
        recordId: '3',
        rudderId: '3',
        identifiers: {
          EMAIL: 'subscribed@eewrfrd.com',
          FI: 'ghui',
        },
        type: 'record',
      },
      metadata: generateMetadata(3),
    },
    {
      destination: destinationV2,
      connection: connection,
      message: {
        action: 'insert',
        context: {
          sources: {
            job_run_id: 'cgiiurt8um7k7n5dq480',
            task_run_id: 'cgiiurt8um7k7n5dq48g',
            job_id: '2MUWghI7u85n91dd1qzGyswpZan',
            version: '895/merge',
          },
        },
        recordId: '4',
        rudderId: '4',
        identifiers: {
          EMAIL: null,
          FI: null,
        },
        type: 'record',
      },
      metadata: generateMetadata(4),
    },
  ],
  destType: 'fb_custom_audience',
};

export const rETLRecordV2RouterInvalidRequest: RouterTransformationRequest = {
  input: [
    {
      destination: destinationV2,
      connection: missingAudienceIDConnection,
      message: {
        action: 'insert',
        context: {
          sources: {
            job_run_id: 'cgiiurt8um7k7n5dq480',
            task_run_id: 'cgiiurt8um7k7n5dq48g',
            job_id: '2MUWghI7u85n91dd1qzGyswpZan',
            version: '895/merge',
          },
        },
        recordId: '2',
        rudderId: '2',
        identifiers: {
          EMAIL: 'subscribed@eewrfrd.com',
          FI: 'ghui',
        },
        type: 'record',
      },
      metadata: generateMetadata(1),
    },
  ],
  destType: 'fb_custom_audience',
};

export const destinationV1: Destination = {
  Config: {
    accessToken: 'ABC',
    appSecret: 'dummySecret',
    disableFormat: false,
    isHashRequired: true,
    isRaw: false,
    skipVerify: false,
    subType: 'NA',
    type: 'NA',
    userSchema: ['EMAIL'],
  },
  ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
  Name: 'FB_CUSTOM_AUDIENCE',
  Enabled: true,
  WorkspaceID: '1TSN08muJTZwH8iCDmnnRt1pmLd',
  DestinationDefinition: {
    ID: '1aIXqM806xAVm92nx07YwKbRrO9',
    Name: 'FB_CUSTOM_AUDIENCE',
    DisplayName: 'FB_CUSTOM_AUDIENCE',
    Config: {},
  },
  Transformations: [],
  IsConnectionEnabled: true,
  IsProcessorEnabled: true,
};

export const rETLRecordV1RouterRequest: RouterTransformationRequest = {
  input: [
    {
      destination: destinationV1,
      message: {
        action: 'insert',
        context: {
          destinationFields: 'EMAIL, FI',
          externalId: [
            {
              type: 'FB_CUSTOM_AUDIENCE-23848494844100489',
              identifierType: 'EMAIL',
            },
          ],
          mappedToDestination: 'true',
          sources: {
            job_run_id: 'cgiiurt8um7k7n5dq480',
            task_run_id: 'cgiiurt8um7k7n5dq48g',
            job_id: '2MUWghI7u85n91dd1qzGyswpZan',
            version: '895/merge',
          },
        },
        recordId: '2',
        rudderId: '2',
        fields: {
          EMAIL: 'subscribed@eewrfrd.com',
          FI: 'ghui',
        },
        type: 'record',
      },
      metadata: generateMetadata(3),
    },
    {
      destination: destinationV1,
      message: {
        action: 'update',
        context: {
          destinationFields: 'EMAIL, FI',
          externalId: [
            {
              type: 'FB_CUSTOM_AUDIENCE-23848494844100489',
              identifierType: 'EMAIL',
            },
          ],
          mappedToDestination: 'true',
          sources: {
            job_run_id: 'cgiiurt8um7k7n5dq480',
            task_run_id: 'cgiiurt8um7k7n5dq48g',
            job_id: '2MUWghI7u85n91dd1qzGyswpZan',
            version: '895/merge',
          },
        },
        recordId: '2',
        rudderId: '2',
        fields: {
          EMAIL: 'subscribed@eewrfrd.com',
          FI: 'ghui',
        },
        type: 'record',
      },
      metadata: generateMetadata(4),
    },
    {
      destination: destinationV1,
      message: {
        action: 'delete',
        context: {
          destinationFields: 'EMAIL, FI',
          externalId: [
            {
              type: 'FB_CUSTOM_AUDIENCE-23848494844100489',
              identifierType: 'EMAIL',
            },
          ],
          mappedToDestination: 'true',
          sources: {
            job_run_id: 'cgiiurt8um7k7n5dq480',
            task_run_id: 'cgiiurt8um7k7n5dq48g',
            job_id: '2MUWghI7u85n91dd1qzGyswpZan',
            version: '895/merge',
          },
        },
        recordId: '2',
        rudderId: '2',
        fields: {
          EMAIL: 'subscribed@eewrfrd.com',
          FI: 'ghui',
        },
        type: 'record',
      },
      metadata: generateMetadata(1),
    },
    {
      destination: destinationV1,
      message: {
        action: 'delete',
        context: {
          destinationFields: 'EMAIL, FI',
          externalId: [
            {
              type: 'FB_CUSTOM_AUDIENCE-23848494844100489',
              identifierType: 'EMAIL',
            },
          ],
          mappedToDestination: 'true',
          sources: {
            job_run_id: 'cgiiurt8um7k7n5dq480',
            task_run_id: 'cgiiurt8um7k7n5dq48g',
            job_id: '2MUWghI7u85n91dd1qzGyswpZan',
            version: '895/merge',
          },
        },
        recordId: '2',
        rudderId: '2',
        fields: {
          EMAIL: 'subscribed@eewrfrd.com',
          FI: 'ghui',
        },
        type: 'record',
      },
      metadata: generateMetadata(2),
    },
    {
      destination: destinationV1,
      message: {
        action: 'update',
        context: {
          destinationFields: 'EMAIL, FI',
          externalId: [
            {
              type: 'FB_CUSTOM_AUDIENCE-23848494844100489',
              identifierType: 'EMAIL',
            },
          ],
          mappedToDestination: 'true',
          sources: {
            job_run_id: 'cgiiurt8um7k7n5dq480',
            task_run_id: 'cgiiurt8um7k7n5dq48g',
            job_id: '2MUWghI7u85n91dd1qzGyswpZan',
            version: '895/merge',
          },
        },
        recordId: '2',
        rudderId: '2',
        fields: {
          EMAIL: 'subscribed@eewrfrd.com',
          FI: 'ghui',
        },
        type: 'record',
      },
      metadata: generateMetadata(5),
    },
    {
      destination: destinationV1,
      message: {
        action: 'update',
        context: {
          destinationFields: 'EMAIL, FI',
          externalId: [
            {
              type: 'FB_CUSTOM_AUDIENCE-23848494844100489',
              identifierType: 'EMAIL',
            },
          ],
          mappedToDestination: 'true',
          sources: {
            job_run_id: 'cgiiurt8um7k7n5dq480',
            task_run_id: 'cgiiurt8um7k7n5dq48g',
            job_id: '2MUWghI7u85n91dd1qzGyswpZan',
            version: '895/merge',
          },
        },
        recordId: '2',
        rudderId: '2',
        fields: {
          EMAIL: 'subscribed@eewrfrd.com',
          FI: 'ghui',
        },
        type: 'record',
      },
      metadata: generateMetadata(6),
    },
    {
      destination: destinationV1,
      message: {
        action: 'lol',
        context: {
          destinationFields: 'EMAIL, FI',
          externalId: [
            {
              type: 'FB_CUSTOM_AUDIENCE-23848494844100489',
              identifierType: 'EMAIL',
            },
          ],
          mappedToDestination: 'true',
          sources: {
            job_run_id: 'cgiiurt8um7k7n5dq480',
            task_run_id: 'cgiiurt8um7k7n5dq48g',
            job_id: '2MUWghI7u85n91dd1qzGyswpZan',
            version: '895/merge',
          },
        },
        recordId: '2',
        rudderId: '2',
        fields: {
          EMAIL: 'subscribed@eewrfrd.com',
          FI: 'ghui',
        },
        type: 'record',
      },
      metadata: generateMetadata(7),
    },
  ],
  destType: 'fb_custom_audience',
};
