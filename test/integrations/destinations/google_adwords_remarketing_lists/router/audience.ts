import { Destination, RouterTransformationRequest } from '../../../../../src/types';
import { generateGoogleOAuthMetadata } from '../../../testUtils';

const destination: Destination = {
  Config: {
    rudderAccountId: '258Yea7usSKNpbkIaesL9oJ9iYw',
    listId: '7090784486',
    customerId: '7693729833',
    loginCustomerId: '',
    subAccount: false,
    userSchema: ['email', 'phone', 'addressInfo'],
    isHashRequired: true,
    typeOfList: 'General',
  },
  ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
  Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
  Enabled: true,
  WorkspaceID: '1TSN08muJTZwH8iCDmnnRt1pmLd',
  DestinationDefinition: {
    ID: '1aIXqM806xAVm92nx07YwKbRrO9',
    Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
    DisplayName: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
    Config: {},
  },
  Transformations: [],
  IsConnectionEnabled: true,
  IsProcessorEnabled: true,
};

export const rETLAudienceRouterRequest: RouterTransformationRequest = {
  input: [
    {
      metadata: generateGoogleOAuthMetadata(1),
      destination: destination,
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
                phone: '@09876543210',
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
      metadata: generateGoogleOAuthMetadata(3),
      destination: destination,
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
                phone: '@09876543210',
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
      metadata: generateGoogleOAuthMetadata(4),
      destination: destination,
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
                phone: '@09876543210',
                firstName: 'test',
                lastName: 'rudderlabs',
                country: 'US',
                postalCode: '1245',
              },
            ],
            add: [
              {
                email: 'test@abc.com',
                phone: '@09876543210',
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

module.exports = {
  rETLAudienceRouterRequest,
};
