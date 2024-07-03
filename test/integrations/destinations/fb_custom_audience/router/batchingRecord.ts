import { Destination, RouterTransformationRequest } from '../../../../../src/types';
import { generateMetadata } from '../../../testUtils';

const destination: Destination = {
  Config: {
    accessToken: 'ABC',
    disableFormat: false,
    isHashRequired: true,
    isRaw: false,
    maxUserCount: '2',
    oneTrustCookieCategories: [],
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

export const rETLBatchingRouterRequest: RouterTransformationRequest = {
  input: [
    {
      destination: destination,
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
      metadata: generateMetadata(1),
    },
    {
      destination: destination,
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
      metadata: generateMetadata(2),
    },
    {
      destination: destination,
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
  ],
  destType: 'fb_custom_audience',
};

module.exports = {
  rETLBatchingRouterRequest,
};
