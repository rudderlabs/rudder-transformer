import { Connection, Destination, RouterTransformationRequest } from '../../../../../src/types';
import { VDM_V2_SCHEMA_VERSION } from '../../../../../src/v0/util/constant';
import { generateMetadata } from '../../../testUtils';

const destination: Destination = {
  Config: {
    accessToken: 'ABC',
    disableFormat: false,
    isHashRequired: true,
    isRaw: false,
    oneTrustCookieCategories: [],
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

export const rETLRecordV2RouterRequest: RouterTransformationRequest = {
  input: [
    {
      destination: destination,
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
      destination: destination,
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
      destination: destination,
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
      metadata: generateMetadata(3),
    },
  ],
  destType: 'fb_custom_audience',
};

module.exports = {
  rETLRecordV2RouterRequest,
};
