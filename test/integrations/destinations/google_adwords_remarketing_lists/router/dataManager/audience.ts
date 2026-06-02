import { RouterTransformationRequest } from '../../../../../../src/types';
import { generateGoogleOAuthMetadata } from '../../../../testUtils';
import { secret4 } from '../../maskedSecrets';
import { dmDestination } from './record';

const DM_WORKSPACE_ID = 'dm-enabled-workspaceId';

const generateDMGoogleOAuthMetadata = (jobId: number) => ({
  ...generateGoogleOAuthMetadata(jobId),
  workspaceId: DM_WORKSPACE_ID,
  secret: { access_token: secret4 },
});

export const dmAudienceRequest: RouterTransformationRequest = {
  input: [
    {
      metadata: generateDMGoogleOAuthMetadata(1),
      destination: dmDestination,
      message: {
        userId: 'user 1',
        anonymousId: 'anon-id-new',
        event: 'event1',
        type: 'audiencelist',
        properties: {
          listData: {
            add: [
              {
                email: 'test@abc.com',
                phone: '09876543210',
                firstName: 'test',
                lastName: 'rudderlabs',
                country: 'US',
                postalCode: '1245',
              },
            ],
          },
          enablePartialFailure: true,
        },
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        timestamp: '2020-02-02T00:23:09.544Z',
      },
    },
    {
      metadata: generateDMGoogleOAuthMetadata(3),
      destination: dmDestination,
      message: {
        userId: 'user 1',
        anonymousId: 'anon-id-new',
        event: 'event1',
        type: 'audiencelist',
        properties: {
          listData: {
            remove: [
              {
                email: 'test@abc.com',
                phone: '09876543210',
                firstName: 'test',
                lastName: 'rudderlabs',
                country: 'US',
                postalCode: '1245',
              },
            ],
          },
          enablePartialFailure: true,
        },
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        timestamp: '2020-02-02T00:23:09.544Z',
      },
    },
    {
      metadata: generateDMGoogleOAuthMetadata(4),
      destination: dmDestination,
      message: {
        userId: 'user 1',
        anonymousId: 'anon-id-new',
        event: 'event1',
        type: 'audiencelist',
        properties: {
          listData: {
            remove: [
              {
                email: 'test@abc.com',
                phone: '09876543210',
                firstName: 'test',
                lastName: 'rudderlabs',
                country: 'US',
                postalCode: '1245',
              },
            ],
            add: [
              {
                email: 'test@abc.com',
                phone: '09876543210',
                firstName: 'test',
                lastName: 'rudderlabs',
                country: 'US',
                postalCode: '1245',
              },
            ],
          },
          enablePartialFailure: true,
        },
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        timestamp: '2020-02-02T00:23:09.544Z',
      },
    },
  ],
  destType: 'google_adwords_remarketing_lists',
};
