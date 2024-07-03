import { Destination, RouterTransformationRequest } from '../../../../../src/types';
import { generateMetadata } from '../../../testUtils';

const destination: Destination = {
  Config: {
    accessToken: 'ABC',
    disableFormat: false,
    isHashRequired: true,
    isRaw: false,
    maxUserCount: '50',
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

export const rETLAudienceRouterRequest: RouterTransformationRequest = {
  input: [
    {
      message: {
        sentAt: '2023-03-30 06:42:55.991938402 +0000 UTC',
        userId: '2MUWghI7u85n91dd1qzGyswpZan-2MUWqbQqvctyfMGqU9QCNadpKNy',
        channel: 'sources',
        messageId: '4d906837-031d-4d34-b97a-62fdf51b4d3a',
        event: 'Add_Audience',
        context: {
          destinationFields: 'EMAIL, FN',
          externalId: [{ type: 'FB_CUSTOM_AUDIENCE-23848494844100489', identifierType: 'EMAIL' }],
          mappedToDestination: 'true',
          sources: {
            job_run_id: 'cgiiurt8um7k7n5dq480',
            task_run_id: 'cgiiurt8um7k7n5dq48g',
            job_id: '2MUWghI7u85n91dd1qzGyswpZan',
            version: '895/merge',
          },
        },
        recordId: '725ad989-6750-4839-b46b-0ddb3b8e5aa2/1/10',
        rudderId: '85c49666-c628-4835-937b-8f1d9ee7a724',
        properties: {
          listData: {
            add: [
              { EMAIL: 'dede@gmail.com', FN: 'vishwa' },
              { EMAIL: 'fchsjjn@gmail.com', FN: 'hskks' },
              { EMAIL: 'fghjnbjk@gmail.com', FN: 'ghfry' },
              { EMAIL: 'gvhjkk@gmail.com', FN: 'hbcwqe' },
              { EMAIL: 'qsdwert@egf.com', FN: 'dsfds' },
              { EMAIL: 'ascscxsaca@com', FN: 'scadscdvcda' },
              { EMAIL: 'abc@gmail.com', FN: 'subscribed' },
              { EMAIL: 'ddwnkl@gmail.com', FN: 'subscribed' },
              { EMAIL: 'subscribed@eewrfrd.com', FN: 'pending' },
              { EMAIL: 'acsdvdf@ddfvf.com', FN: 'pending' },
            ],
          },
        },
        type: 'audienceList',
        anonymousId: '63228b51-394e-4ca2-97a0-427f6187480b',
      },
      destination: destination,
      metadata: generateMetadata(3),
    },
    {
      message: {
        sentAt: '2023-03-30 06:42:55.991938402 +0000 UTC',
        userId: '2MUWghI7u85n91dd1qzGyswpZan-2MUWqbQqvctyfMGqU9QCNadpKNy',
        channel: 'sources',
        messageId: '4d906837-031d-4d34-b97a-62fdf51b4d3a',
        event: 'Add_Audience',
        context: {
          externalId: [{ type: 'FB_CUSTOM_AUDIENCE-23848494844100489', identifierType: 'EMAIL' }],
          mappedToDestination: 'true',
          sources: {
            job_run_id: 'cgiiurt8um7k7n5dq480',
            task_run_id: 'cgiiurt8um7k7n5dq48g',
            job_id: '2MUWghI7u85n91dd1qzGyswpZan',
            version: '895/merge',
          },
        },
        recordId: '725ad989-6750-4839-b46b-0ddb3b8e5aa2/1/10',
        rudderId: '85c49666-c628-4835-937b-8f1d9ee7a724',
        properties: {
          listData: {
            add: [
              { EMAIL: 'dede@gmail.com', FN: 'vishwa' },
              { EMAIL: 'fchsjjn@gmail.com', FN: 'hskks' },
              { EMAIL: 'fghjnbjk@gmail.com', FN: 'ghfry' },
              { EMAIL: 'gvhjkk@gmail.com', FN: 'hbcwqe' },
              { EMAIL: 'qsdwert@egf.com', FN: 'dsfds' },
              { EMAIL: 'ascscxsaca@com', FN: 'scadscdvcda' },
              { EMAIL: 'abc@gmail.com', FN: 'subscribed' },
              { EMAIL: 'ddwnkl@gmail.com', FN: 'subscribed' },
              { EMAIL: 'subscribed@eewrfrd.com', FN: 'pending' },
              { EMAIL: 'acsdvdf@ddfvf.com', FN: 'pending' },
            ],
          },
        },
        type: 'audienceList',
        anonymousId: '63228b51-394e-4ca2-97a0-427f6187480b',
      },
      destination: destination,
      metadata: generateMetadata(4),
    },
  ],
  destType: 'fb_custom_audience',
};

module.exports = {
  rETLAudienceRouterRequest,
};
