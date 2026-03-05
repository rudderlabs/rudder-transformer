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
                EMAIL: '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05',
                DOBM: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
                DOBD: '3fdba35f04dc8c462986c992bcf875546257113072a909c162f7e470e581e278',
                DOBY: '7931aa2a1bed855457d1ddf6bc06ab4406a9fba0579045a4d6ff78f9c07c440f',
                PHONE: '3c98400cbfaf690bf3601f538def8ff16f3b3bcd075b028fa28aa44ca09fec22',
                GEN: '252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111',
                FI: '7cfb46258a6f545f77cca49a27ded0bc69a56e16d0dcdf05ec843c0cc322145d',
                MADID: 'ABC',
                ZIP: '69deb728a28faee80ee80d8d5f97a5e2fd65758684f7412e535d19a19095369b',
                ST: '1dc362d22242a898483383061a98f0b41d725190f7bc00a962b6013b36dc2b81',
                COUNTRY: 'fed1d872f6d540f4118582ec694270274e987b12f5dfe2057dddf1e12df2761a',
              },
            ],
            remove: [
              {
                EMAIL: '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05',
                DOBM: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
                DOBD: '3fdba35f04dc8c462986c992bcf875546257113072a909c162f7e470e581e278',
                DOBY: '7931aa2a1bed855457d1ddf6bc06ab4406a9fba0579045a4d6ff78f9c07c440f',
                PHONE: '3c98400cbfaf690bf3601f538def8ff16f3b3bcd075b028fa28aa44ca09fec22',
                GEN: '252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111',
                FI: '7cfb46258a6f545f77cca49a27ded0bc69a56e16d0dcdf05ec843c0cc322145d',
                MADID: 'ABC',
                ZIP: '69deb728a28faee80ee80d8d5f97a5e2fd65758684f7412e535d19a19095369b',
                ST: '1dc362d22242a898483383061a98f0b41d725190f7bc00a962b6013b36dc2b81',
                COUNTRY: 'fed1d872f6d540f4118582ec694270274e987b12f5dfe2057dddf1e12df2761a',
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
                EMAIL: '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05',
                DOBM: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
                DOBD: '3fdba35f04dc8c462986c992bcf875546257113072a909c162f7e470e581e278',
                DOBY: '7931aa2a1bed855457d1ddf6bc06ab4406a9fba0579045a4d6ff78f9c07c440f',
                PHONE: '3c98400cbfaf690bf3601f538def8ff16f3b3bcd075b028fa28aa44ca09fec22',
                GEN: '252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111',
                FI: '7cfb46258a6f545f77cca49a27ded0bc69a56e16d0dcdf05ec843c0cc322145d',
                MADID: 'ABC',
                ZIP: '69deb728a28faee80ee80d8d5f97a5e2fd65758684f7412e535d19a19095369b',
                ST: '1dc362d22242a898483383061a98f0b41d725190f7bc00a962b6013b36dc2b81',
                COUNTRY: 'fed1d872f6d540f4118582ec694270274e987b12f5dfe2057dddf1e12df2761a',
              },
            ],
            remove: [
              {
                EMAIL: '85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05',
                DOBM: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
                DOBD: '3fdba35f04dc8c462986c992bcf875546257113072a909c162f7e470e581e278',
                DOBY: '7931aa2a1bed855457d1ddf6bc06ab4406a9fba0579045a4d6ff78f9c07c440f',
                PHONE: '3c98400cbfaf690bf3601f538def8ff16f3b3bcd075b028fa28aa44ca09fec22',
                GEN: '252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111',
                FI: '7cfb46258a6f545f77cca49a27ded0bc69a56e16d0dcdf05ec843c0cc322145d',
                MADID: 'ABC',
                ZIP: '69deb728a28faee80ee80d8d5f97a5e2fd65758684f7412e535d19a19095369b',
                ST: '1dc362d22242a898483383061a98f0b41d725190f7bc00a962b6013b36dc2b81',
                COUNTRY: 'fed1d872f6d540f4118582ec694270274e987b12f5dfe2057dddf1e12df2761a',
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
