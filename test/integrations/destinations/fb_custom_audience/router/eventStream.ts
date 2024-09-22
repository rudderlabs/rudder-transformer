import { Destination, RouterTransformationRequest } from '../../../../../src/types';
import { generateMetadata } from '../../../testUtils';

export const esDestinationAudience: Destination = {
  Config: {
    accessToken: 'ABC',
    userSchema: [
      'EMAIL',
      'DOBM',
      'DOBD',
      'DOBY',
      'PHONE',
      'GEN',
      'FI',
      'MADID',
      'ZIP',
      'ST',
      'COUNTRY',
    ],
    isHashRequired: false,
    disableFormat: false,
    audienceId: 'aud1',
    isRaw: true,
    type: 'NA',
    subType: 'ANYTHING',
  },
  Enabled: true,
  Transformations: [],
  IsProcessorEnabled: true,
  ID: '123',
  Name: 'fb_custom_audience',
  DestinationDefinition: {
    ID: '123',
    Name: 'fb_custom_audience',
    DisplayName: 'fb_custom_audience',
    Config: {},
  },
  WorkspaceID: '123',
};

export const eventStreamAudienceListRouterRequest: RouterTransformationRequest = {
  input: [
    {
      message: {
        userId: 'user 1',
        anonymousId: 'anon-id-new',
        event: 'event1',
        type: 'audiencelist',
        properties: {
          listData: {
            add: [
              {
                EMAIL: 'shrouti@abc.com',
                DOBM: '2',
                DOBD: '13',
                DOBY: '2013',
                PHONE: '@09432457768',
                GEN: 'f',
                FI: 'Ms.',
                MADID: 'ABC',
                ZIP: 'ZIP ',
                ST: '123abc ',
                COUNTRY: 'IN',
              },
            ],
            remove: [
              {
                EMAIL: 'shrouti@abc.com',
                DOBM: '2',
                DOBD: '13',
                DOBY: '2013',
                PHONE: '@09432457768',
                GEN: 'f',
                FI: 'Ms.',
                MADID: 'ABC',
                ZIP: 'ZIP ',
                ST: '123abc ',
                COUNTRY: 'IN',
              },
            ],
          },
        },
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        timestamp: '2020-02-02T00:23:09.544Z',
      },
      metadata: generateMetadata(1),
      destination: esDestinationAudience,
    },
    {
      message: {
        userId: 'user 1',
        anonymousId: 'anon-id-new',
        event: 'event1',
        type: 'audiencelist',
        properties: {
          listData: {
            add: [
              {
                EMAIL: 'shrouti@abc.com',
                DOBM: '2',
                DOBD: '13',
                DOBY: '2013',
                PHONE: '@09432457768',
                GEN: 'f',
                FI: 'Ms.',
                MADID: 'ABC',
                ZIP: 'ZIP ',
                ST: '123abc ',
                COUNTRY: 'IN',
              },
            ],
            remove: [
              {
                EMAIL: 'shrouti@abc.com',
                DOBM: '2',
                DOBD: '13',
                DOBY: '2013',
                PHONE: '@09432457768',
                GEN: 'f',
                FI: 'Ms.',
                MADID: 'ABC',
                ZIP: 'ZIP ',
                ST: '123abc ',
                COUNTRY: 'IN',
              },
            ],
          },
        },
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        timestamp: '2020-02-02T00:23:09.544Z',
      },
      metadata: generateMetadata(2),
      destination: esDestinationAudience,
      request: { query: {} },
    },
  ],
  destType: 'fb_custom_audience',
};

export const esDestinationRecord: Destination = {
  Config: {
    accessToken: 'ABC',
    userSchema: ['EMAIL', 'FI'],
    isHashRequired: true,
    disableFormat: false,
    audienceId: '23848494844100489',
    isRaw: false,
    type: 'NA',
    subType: 'NA',
  },
  Enabled: true,
  Transformations: [],
  IsProcessorEnabled: true,
  ID: '123',
  Name: 'fb_custom_audience',
  DestinationDefinition: {
    ID: '123',
    Name: 'fb_custom_audience',
    DisplayName: 'fb_custom_audience',
    Config: {},
  },
  WorkspaceID: '123',
};
export const eventStreamRecordV1RouterRequest: RouterTransformationRequest = {
  input: [
    {
      destination: esDestinationRecord,
      message: {
        action: 'insert',
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
      destination: esDestinationRecord,
      message: {
        action: 'update',
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
      destination: esDestinationRecord,
      message: {
        action: 'delete',
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
      destination: esDestinationRecord,
      message: {
        action: 'delete',
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
      destination: esDestinationRecord,
      message: {
        action: 'update',
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
      destination: esDestinationRecord,
      message: {
        action: 'update',
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
      destination: esDestinationRecord,
      message: {
        action: 'lol',
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
