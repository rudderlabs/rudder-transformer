import { Destination, RouterTransformationRequest } from '../../../../../src/types';
import { generateMetadata } from '../../../testUtils';

const destination: Destination = {
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
    maxUserCount: '50',
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

export const eventStreamRouterRequest: RouterTransformationRequest = {
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
      destination: destination,
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
      destination: destination,
      request: { query: {} },
    },
  ],
  destType: 'fb_custom_audience',
};

module.exports = {
  eventStreamRouterRequest,
};
