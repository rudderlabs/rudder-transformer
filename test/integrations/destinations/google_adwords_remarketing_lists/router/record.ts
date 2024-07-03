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

export const rETLRecordRouterRequest: RouterTransformationRequest = {
  input: [
    {
      destination: destination,
      message: {
        action: 'insert',
        context: {
          ip: '14.5.67.21',
          library: {
            name: 'http',
          },
        },
        recordId: '2',
        rudderId: '2',
        fields: {
          email: 'test@abc.com',
          phone: '@09876543210',
          firstName: 'test',
          lastName: 'rudderlabs',
          country: 'US',
          postalCode: '1245',
        },
        type: 'record',
      },
      metadata: generateGoogleOAuthMetadata(2),
    },
    {
      destination: destination,
      message: {
        action: 'update',
        context: {
          ip: '14.5.67.21',
          library: {
            name: 'http',
          },
        },
        recordId: '2',
        rudderId: '2',
        fields: {
          email: 'test@abc.com',
          phone: '@09876543210',
          firstName: 'test',
          lastName: 'rudderlabs',
          country: 'US',
          postalCode: '1245',
        },
        type: 'record',
      },
      metadata: generateGoogleOAuthMetadata(4),
    },
    {
      destination: destination,
      message: {
        action: 'delete',
        context: {
          ip: '14.5.67.21',
          library: {
            name: 'http',
          },
        },
        recordId: '2',
        rudderId: '2',
        fields: {
          email: 'test@abc.com',
          phone: '@09876543210',
          firstName: 'test',
          lastName: 'rudderlabs',
          country: 'US',
          postalCode: '1245',
        },
        type: 'record',
      },
      metadata: generateGoogleOAuthMetadata(1),
    },
    {
      destination: destination,
      message: {
        action: 'lol',
        context: {
          ip: '14.5.67.21',
          library: {
            name: 'http',
          },
        },
        recordId: '2',
        rudderId: '2',
        fields: {
          email: 'test@abc.com',
          phone: '@09876543210',
          firstName: 'test',
          lastName: 'rudderlabs',
          country: 'US',
          postalCode: '1245',
        },
        type: 'record',
      },
      metadata: generateGoogleOAuthMetadata(5),
    },
    {
      destination: destination,
      message: {
        action: 'insert',
        context: {
          ip: '14.5.67.21',
          library: {
            name: 'http',
          },
        },
        recordId: '2',
        rudderId: '2',
        fields: {
          email: 'test@abc.com',
          phone: '@09876543210',
          firstName: 'test',
          lastName: 'rudderlabs',
          country: 'US',
          postalCode: '1245',
        },
        type: 'record',
      },
      metadata: generateGoogleOAuthMetadata(3),
    },
  ],
  destType: 'google_adwords_remarketing_lists',
};

module.exports = {
  rETLRecordRouterRequest,
};
