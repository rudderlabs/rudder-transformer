import { Connection, Destination, RouterTransformationRequest } from '../../../../../src/types';
import { VDM_V2_SCHEMA_VERSION } from '../../../../../src/v0/util/constant';
import { generateGoogleOAuthMetadata } from '../../../testUtils';

const destination: Destination = {
  Config: {
    rudderAccountId: '258Yea7usSKNpbkIaesL9oJ9iYw',
    audienceId: '7090784486',
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

const destination2: Destination = {
  Config: {
    rudderAccountId: '258Yea7usSKNpbkIaesL9oJ9iYw',
    audienceId: '7090784486',
    customerId: '7693729833',
    loginCustomerId: '',
    subAccount: false,
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

const connection1: Connection = {
  sourceId: '2MUWghI7u85n91dd1qzGyswpZan',
  destinationId: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
  enabled: true,
  config: {
    destination: {
      schemaVersion: VDM_V2_SCHEMA_VERSION,
      isHashRequired: true,
      typeOfList: 'General',
      audienceId: '7090784486',
    },
  },
};

const connection2: Connection = {
  sourceId: '2MUWghI7u85n91dd1qzGyswpZan',
  destinationId: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
  enabled: true,
  config: {
    destination: {
      schemaVersion: VDM_V2_SCHEMA_VERSION,
      isHashRequired: true,
      typeOfList: 'userID',
      audienceId: '7090784486',
      personalizationConsent: 'GRANTED',
      userDataConsent: 'GRANTED',
    },
  },
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

export const rETLRecordRouterRequestVDMv2General: RouterTransformationRequest = {
  input: [
    {
      destination: destination2,
      connection: connection1,
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
        identifiers: {
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
  ],
  destType: 'google_adwords_remarketing_lists',
};

export const rETLRecordRouterRequestVDMv2UserId: RouterTransformationRequest = {
  input: [
    {
      destination: destination2,
      connection: connection2,
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
        identifiers: {
          email: 'test@abc.com',
          phone: '@09876543210',
          firstName: 'test',
          lastName: 'rudderlabs',
          country: 'US',
          postalCode: '1245',
          thirdPartyUserId: 'useri1234',
        },
        type: 'record',
      },
      metadata: generateGoogleOAuthMetadata(2),
    },
  ],
  destType: 'google_adwords_remarketing_lists',
};

export const eventStreamRecordRouterRequest: RouterTransformationRequest = {
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
  ],
  destType: 'google_adwords_remarketing_lists',
};

export const rETLRecordRouterRequestVDMv1: RouterTransformationRequest = {
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
          vdm: {
            version: 'v1',
          },
          mappedToDestination: true,
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

export const rETLRecordRouterRequestForVDMV2Flow: RouterTransformationRequest = {
  input: rETLRecordRouterRequest.input.map((event) => {
    event.connection = {
      config: { destination: { schemaVersion: '1.1', ...event.destination.Config } },
      sourceId: 'randomSourceId',
      destinationId: 'randomDestinationId',
      enabled: true,
    };
    event.message.identifiers = event.message.fields;
    return event;
  }),

  destType: 'google_adwords_remarketing_lists',
};
