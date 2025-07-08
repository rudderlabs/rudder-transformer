/**
 * Auto-migrated and optimized test cases
 * Generated on: 2025-06-25T12:04:21.653Z
 */

import { RouterStreamTestData } from '../../../testTypes';
import { generateMetadata } from '../../../testUtils';

export const data: RouterStreamTestData[] = [
  {
    id: 'router-1750853061652',
    name: 'googlesheets',
    description: 'Successful transformation of multiple events',
    scenario: 'Default router scenario',
    successCriteria: 'Router test should pass successfully',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  ip: '0.0.0.0',
                  os: {
                    name: 'OS-X',
                    version: '19.02.3',
                  },
                  screen: {
                    density: 2,
                  },
                  traits: {
                    userId: 'sheetuser001',
                    firstName: 'James',
                    lastName: 'Doe',
                    address: {
                      city: 'Kolkata',
                      country: 'India',
                      postalCode: '789003',
                      state: 'WB',
                    },
                  },
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: 'anon_id',
                type: 'identify',
                traits: {
                  anonymousId: 'anon_id',
                  email: 'jamesDoe@gmail.com',
                  name: 'James Doe',
                  phone: '92374162212',
                  gender: 'M',
                  employed: true,
                  birthday: '1614775793',
                  education: 'Science',
                  graduate: true,
                  married: true,
                  customerType: 'Prime',
                  custom_tags: ['Test_User', 'Interested_User', 'DIY_Hobby'],
                  custom_mappings: {
                    Office: 'Trastkiv',
                    Country: 'Russia',
                  },
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 789223,
                    state: 'WB',
                    street: '',
                  },
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: generateMetadata(1, 'u1'),
              destination: {
                ID: 'default-destination-id',
                Name: 'Default Destination',
                DestinationDefinition: {
                  ID: 'default-dest-def-id',
                  Name: 'Default Destination Definition',
                  DisplayName: 'Default Display Name',
                  Config: {},
                },
                Config: {
                  credentials: '{ sheets credentials }',
                  eventKeyMap: [
                    {
                      from: 'firstName',
                      to: 'First Name',
                    },
                    {
                      from: 'lastName',
                      to: 'Last Name',
                    },
                    {
                      from: 'birthday',
                      to: 'Birthday',
                    },
                    {
                      from: 'address.city',
                      to: 'City',
                    },
                    {
                      from: 'address.country',
                      to: 'Country',
                    },
                    {
                      from: 'revenue',
                      to: 'Revenue',
                    },
                    {
                      from: 'offer',
                      to: 'Offer',
                    },
                    {
                      from: 'title',
                      to: 'Title Page',
                    },
                    {
                      from: 'Cart Value',
                      to: 'Cart Value',
                    },
                    {
                      from: 'revenue',
                      to: 'Revenue',
                    },
                    {
                      from: 'context.app.build',
                      to: 'App Build',
                    },
                    {
                      from: 'context.app.name',
                      to: 'App Name',
                    },
                    {
                      from: 'context.library.name',
                      to: 'Library Name',
                    },
                    {
                      from: 'context.ip',
                      to: 'IP',
                    },
                  ],
                  sheetId: 'rudder_sheet_id',
                  sheetName: 'rudder_sheet',
                },
                Enabled: true,
                WorkspaceID: 'default-workspace',
                Transformations: [],
                RevisionID: 'default-revision',
                IsProcessorEnabled: true,
                IsConnectionEnabled: true,
              },
            },
            {
              message: {
                type: 'track',
                userId: 'userTest004',
                event: 'Added to Cart',
                properties: {
                  name: 'HomePage',
                  revenue: 5.99,
                  value: 5.5,
                  offer: 'Discount',
                  Sale: false,
                },
                context: {
                  ip: '14.5.67.21',
                  app: {
                    build: '1',
                    name: 'RudderAndroidClient',
                    namespace: 'com.rudderstack.demo.android',
                    version: '1.0',
                  },
                  device: {
                    id: '7e32188a4dab669f',
                    manufacturer: 'Google',
                    model: 'Android SDK built for x86',
                    name: 'generic_x86',
                    type: 'android',
                  },
                  library: {
                    name: 'com.rudderstack.android.sdk.core',
                    version: '0.1.4',
                  },
                  locale: 'en-US',
                  network: {
                    carrier: 'Android',
                    bluetooth: false,
                    cellular: true,
                    wifi: true,
                  },
                  os: {
                    name: 'Android',
                    version: '9',
                  },
                  screen: {
                    density: 420,
                    height: 1794,
                    width: 1080,
                  },
                  timezone: 'Asia/Kolkata',
                },
                timestamp: '2020-02-02T00:23:09.544Z',
              },
              metadata: generateMetadata(2, 'u1'),
              destination: {
                ID: 'default-destination-id',
                Name: 'Default Destination',
                DestinationDefinition: {
                  ID: 'default-dest-def-id',
                  Name: 'Default Destination Definition',
                  DisplayName: 'Default Display Name',
                  Config: {},
                },
                Config: {
                  credentials: '{ sheets credentials }',
                  eventKeyMap: [
                    {
                      from: 'firstName',
                      to: 'First Name',
                    },
                    {
                      from: 'lastName',
                      to: 'Last Name',
                    },
                    {
                      from: 'birthday',
                      to: 'Birthday',
                    },
                    {
                      from: 'address.city',
                      to: 'City',
                    },
                    {
                      from: 'address.country',
                      to: 'Country',
                    },
                    {
                      from: 'revenue',
                      to: 'Revenue',
                    },
                    {
                      from: 'offer',
                      to: 'Offer',
                    },
                    {
                      from: 'title',
                      to: 'Title Page',
                    },
                    {
                      from: 'Cart Value',
                      to: 'Cart Value',
                    },
                    {
                      from: 'revenue',
                      to: 'Revenue',
                    },
                    {
                      from: 'context.app.build',
                      to: 'App Build',
                    },
                    {
                      from: 'context.app.name',
                      to: 'App Name',
                    },
                    {
                      from: 'context.library.name',
                      to: 'Library Name',
                    },
                    {
                      from: 'context.ip',
                      to: 'IP',
                    },
                  ],
                  sheetId: 'rudder_sheet_id',
                  sheetName: 'rudder_sheet',
                },
                Enabled: true,
                WorkspaceID: 'default-workspace',
                Transformations: [],
                RevisionID: 'default-revision',
                IsProcessorEnabled: true,
                IsConnectionEnabled: true,
              },
            },
          ],
          destType: 'googlesheets',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                batch: [
                  {
                    message: {
                      '0': {
                        attributeKey: 'messageId',
                        attributeValue: '84e26acc-56a5-4835-8233-591137fca468',
                      },
                      '1': {
                        attributeKey: 'First Name',
                        attributeValue: 'James',
                      },
                      '2': {
                        attributeKey: 'Last Name',
                        attributeValue: 'Doe',
                      },
                      '3': {
                        attributeKey: 'Birthday',
                        attributeValue: '1614775793',
                      },
                      '4': {
                        attributeKey: 'City',
                        attributeValue: 'kolkata',
                      },
                      '5': {
                        attributeKey: 'Country',
                        attributeValue: 'India',
                      },
                      '6': {
                        attributeKey: 'Revenue',
                        attributeValue: '',
                      },
                      '7': {
                        attributeKey: 'Offer',
                        attributeValue: '',
                      },
                      '8': {
                        attributeKey: 'Title Page',
                        attributeValue: '',
                      },
                      '9': {
                        attributeKey: 'Cart Value',
                        attributeValue: '',
                      },
                      '10': {
                        attributeKey: 'Revenue',
                        attributeValue: '',
                      },
                      '11': {
                        attributeKey: 'App Build',
                        attributeValue: '1.0.0',
                      },
                      '12': {
                        attributeKey: 'App Name',
                        attributeValue: 'RudderLabs JavaScript SDK',
                      },
                      '13': {
                        attributeKey: 'Library Name',
                        attributeValue: 'RudderLabs JavaScript SDK',
                      },
                      '14': {
                        attributeKey: 'IP',
                        attributeValue: '0.0.0.0',
                      },
                    },
                  },
                  {
                    message: {
                      '0': {
                        attributeKey: 'messageId',
                        attributeValue: '',
                      },
                      '1': {
                        attributeKey: 'First Name',
                        attributeValue: '',
                      },
                      '2': {
                        attributeKey: 'Last Name',
                        attributeValue: '',
                      },
                      '3': {
                        attributeKey: 'Birthday',
                        attributeValue: '',
                      },
                      '4': {
                        attributeKey: 'City',
                        attributeValue: '',
                      },
                      '5': {
                        attributeKey: 'Country',
                        attributeValue: '',
                      },
                      '6': {
                        attributeKey: 'Revenue',
                        attributeValue: 5.99,
                      },
                      '7': {
                        attributeKey: 'Offer',
                        attributeValue: 'Discount',
                      },
                      '8': {
                        attributeKey: 'Title Page',
                        attributeValue: '',
                      },
                      '9': {
                        attributeKey: 'Cart Value',
                        attributeValue: '',
                      },
                      '10': {
                        attributeKey: 'Revenue',
                        attributeValue: 5.99,
                      },
                      '11': {
                        attributeKey: 'App Build',
                        attributeValue: '1',
                      },
                      '12': {
                        attributeKey: 'App Name',
                        attributeValue: 'RudderAndroidClient',
                      },
                      '13': {
                        attributeKey: 'Library Name',
                        attributeValue: 'com.rudderstack.android.sdk.core',
                      },
                      '14': {
                        attributeKey: 'IP',
                        attributeValue: '14.5.67.21',
                      },
                    },
                  },
                ],
                spreadSheetId: 'rudder_sheet_id',
                spreadSheet: 'rudder_sheet',
              },
              metadata: [generateMetadata(1, 'u1'), generateMetadata(2, 'u1')],
              statusCode: 200,
              destination: {
                ID: 'default-destination-id',
                Name: 'Default Destination',
                DestinationDefinition: {
                  ID: 'default-dest-def-id',
                  Name: 'Default Destination Definition',
                  DisplayName: 'Default Display Name',
                  Config: {},
                },
                Config: {
                  credentials: '{ sheets credentials }',
                  eventKeyMap: [
                    {
                      from: 'firstName',
                      to: 'First Name',
                    },
                    {
                      from: 'lastName',
                      to: 'Last Name',
                    },
                    {
                      from: 'birthday',
                      to: 'Birthday',
                    },
                    {
                      from: 'address.city',
                      to: 'City',
                    },
                    {
                      from: 'address.country',
                      to: 'Country',
                    },
                    {
                      from: 'revenue',
                      to: 'Revenue',
                    },
                    {
                      from: 'offer',
                      to: 'Offer',
                    },
                    {
                      from: 'title',
                      to: 'Title Page',
                    },
                    {
                      from: 'Cart Value',
                      to: 'Cart Value',
                    },
                    {
                      from: 'revenue',
                      to: 'Revenue',
                    },
                    {
                      from: 'context.app.build',
                      to: 'App Build',
                    },
                    {
                      from: 'context.app.name',
                      to: 'App Name',
                    },
                    {
                      from: 'context.library.name',
                      to: 'Library Name',
                    },
                    {
                      from: 'context.ip',
                      to: 'IP',
                    },
                  ],
                  sheetId: 'rudder_sheet_id',
                  sheetName: 'rudder_sheet',
                },
                Enabled: true,
                WorkspaceID: 'default-workspace',
                Transformations: [],
                RevisionID: 'default-revision',
                IsProcessorEnabled: true,
                IsConnectionEnabled: true,
              },
              batched: true,
            },
          ],
        },
      },
    },
  },
  {
    id: 'router-17508530616522323',
    scenario: 'Event with error scenario - missing sheetName configuration',
    successCriteria: 'Router tests should pass successfully',
    name: 'googlesheets',
    description: 'Event with error scenario - missing sheetName configuration',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  ip: '0.0.0.0',
                  os: {
                    name: 'OS-X',
                    version: '19.02.3',
                  },
                  screen: {
                    density: 2,
                  },
                  traits: {
                    userId: 'sheetuser001',
                    firstName: 'James',
                    lastName: 'Doe',
                    address: {
                      city: 'Kolkata',
                      country: 'India',
                      postalCode: '789003',
                      state: 'WB',
                    },
                  },
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: 'anon_id',
                type: 'identify',
                traits: {
                  anonymousId: 'anon_id',
                  email: 'jamesDoe@gmail.com',
                  name: 'James Doe',
                  phone: '92374162212',
                  gender: 'M',
                  employed: true,
                  birthday: '1614775793',
                  education: 'Science',
                  graduate: true,
                  married: true,
                  customerType: 'Prime',
                  custom_tags: ['Test_User', 'Interested_User', 'DIY_Hobby'],
                  custom_mappings: {
                    Office: 'Trastkiv',
                    Country: 'Russia',
                  },
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 789223,
                    state: 'WB',
                    street: '',
                  },
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
              metadata: generateMetadata(1, 'u1'),
              destination: {
                ID: 'default-destination-id',
                Name: 'Default Destination',
                DestinationDefinition: {
                  ID: 'default-dest-def-id',
                  Name: 'Default Destination Definition',
                  DisplayName: 'Default Display Name',
                  Config: {},
                },
                Config: {
                  credentials: '{ sheets credentials }',
                  eventKeyMap: [
                    {
                      from: 'firstName',
                      to: 'First Name',
                    },
                    {
                      from: 'lastName',
                      to: 'Last Name',
                    },
                    {
                      from: 'birthday',
                      to: 'Birthday',
                    },
                    {
                      from: 'address.city',
                      to: 'City',
                    },
                    {
                      from: 'address.country',
                      to: 'Country',
                    },
                    {
                      from: 'revenue',
                      to: 'Revenue',
                    },
                    {
                      from: 'offer',
                      to: 'Offer',
                    },
                    {
                      from: 'title',
                      to: 'Title Page',
                    },
                    {
                      from: 'Cart Value',
                      to: 'Cart Value',
                    },
                    {
                      from: 'revenue',
                      to: 'Revenue',
                    },
                    {
                      from: 'context.app.build',
                      to: 'App Build',
                    },
                    {
                      from: 'context.app.name',
                      to: 'App Name',
                    },
                    {
                      from: 'context.library.name',
                      to: 'Library Name',
                    },
                    {
                      from: 'context.ip',
                      to: 'IP',
                    },
                  ],
                  sheetId: 'rudder_sheet_id',
                  // sheetName: 'rudder_sheet',
                },
                Enabled: true,
                WorkspaceID: 'default-workspace',
                Transformations: [],
                RevisionID: 'default-revision',
                IsProcessorEnabled: true,
                IsConnectionEnabled: true,
              },
            },
            {
              message: {
                type: 'track',
                userId: 'userTest004',
                event: 'Added to Cart',
                properties: {
                  name: 'HomePage',
                  revenue: 5.99,
                  value: 5.5,
                  offer: 'Discount',
                  Sale: false,
                },
                context: {
                  ip: '14.5.67.21',
                  app: {
                    build: '1',
                    name: 'RudderAndroidClient',
                    namespace: 'com.rudderstack.demo.android',
                    version: '1.0',
                  },
                  device: {
                    id: '7e32188a4dab669f',
                    manufacturer: 'Google',
                    model: 'Android SDK built for x86',
                    name: 'generic_x86',
                    type: 'android',
                  },
                  library: {
                    name: 'com.rudderstack.android.sdk.core',
                    version: '0.1.4',
                  },
                  locale: 'en-US',
                  network: {
                    carrier: 'Android',
                    bluetooth: false,
                    cellular: true,
                    wifi: true,
                  },
                  os: {
                    name: 'Android',
                    version: '9',
                  },
                  screen: {
                    density: 420,
                    height: 1794,
                    width: 1080,
                  },
                  timezone: 'Asia/Kolkata',
                },
                timestamp: '2020-02-02T00:23:09.544Z',
              },
              metadata: generateMetadata(2, 'u1'),
              destination: {
                ID: 'default-destination-id',
                Name: 'Default Destination',
                DestinationDefinition: {
                  ID: 'default-dest-def-id',
                  Name: 'Default Destination Definition',
                  DisplayName: 'Default Display Name',
                  Config: {},
                },
                Config: {
                  credentials: '{ sheets credentials }',
                  eventKeyMap: [
                    {
                      from: 'firstName',
                      to: 'First Name',
                    },
                    {
                      from: 'lastName',
                      to: 'Last Name',
                    },
                    {
                      from: 'birthday',
                      to: 'Birthday',
                    },
                    {
                      from: 'address.city',
                      to: 'City',
                    },
                    {
                      from: 'address.country',
                      to: 'Country',
                    },
                    {
                      from: 'revenue',
                      to: 'Revenue',
                    },
                    {
                      from: 'offer',
                      to: 'Offer',
                    },
                    {
                      from: 'title',
                      to: 'Title Page',
                    },
                    {
                      from: 'Cart Value',
                      to: 'Cart Value',
                    },
                    {
                      from: 'revenue',
                      to: 'Revenue',
                    },
                    {
                      from: 'context.app.build',
                      to: 'App Build',
                    },
                    {
                      from: 'context.app.name',
                      to: 'App Name',
                    },
                    {
                      from: 'context.library.name',
                      to: 'Library Name',
                    },
                    {
                      from: 'context.ip',
                      to: 'IP',
                    },
                  ],
                  sheetId: 'rudder_sheet_id',
                  sheetName: 'rudder_sheet',
                },
                Enabled: true,
                WorkspaceID: 'default-workspace',
                Transformations: [],
                RevisionID: 'default-revision',
                IsProcessorEnabled: true,
                IsConnectionEnabled: true,
              },
            },
          ],
          destType: 'googlesheets',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [generateMetadata(1, 'u1')],
              batched: false,
              statusCode: 400,
              error: 'No Spread Sheet set for this event',
              statTags: {
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
                errorCategory: 'dataValidation',
                errorType: 'configuration',
                destType: 'GOOGLESHEETS',
                module: 'destination',
                implementation: 'native',
                feature: 'router',
              },
              destination: {
                ID: 'default-destination-id',
                Name: 'Default Destination',
                DestinationDefinition: {
                  ID: 'default-dest-def-id',
                  Name: 'Default Destination Definition',
                  DisplayName: 'Default Display Name',
                  Config: {},
                },
                Config: {
                  credentials: '{ sheets credentials }',
                  eventKeyMap: [
                    {
                      from: 'firstName',
                      to: 'First Name',
                    },
                    {
                      from: 'lastName',
                      to: 'Last Name',
                    },
                    {
                      from: 'birthday',
                      to: 'Birthday',
                    },
                    {
                      from: 'address.city',
                      to: 'City',
                    },
                    {
                      from: 'address.country',
                      to: 'Country',
                    },
                    {
                      from: 'revenue',
                      to: 'Revenue',
                    },
                    {
                      from: 'offer',
                      to: 'Offer',
                    },
                    {
                      from: 'title',
                      to: 'Title Page',
                    },
                    {
                      from: 'Cart Value',
                      to: 'Cart Value',
                    },
                    {
                      from: 'revenue',
                      to: 'Revenue',
                    },
                    {
                      from: 'context.app.build',
                      to: 'App Build',
                    },
                    {
                      from: 'context.app.name',
                      to: 'App Name',
                    },
                    {
                      from: 'context.library.name',
                      to: 'Library Name',
                    },
                    {
                      from: 'context.ip',
                      to: 'IP',
                    },
                  ],
                  sheetId: 'rudder_sheet_id',
                  // sheetName: 'rudder_sheet',
                },
                Enabled: true,
                WorkspaceID: 'default-workspace',
                Transformations: [],
                RevisionID: 'default-revision',
                IsProcessorEnabled: true,
                IsConnectionEnabled: true,
              },
            },
            {
              batchedRequest: {
                batch: [
                  {
                    message: {
                      '0': {
                        attributeKey: 'messageId',
                        attributeValue: '',
                      },
                      '1': {
                        attributeKey: 'First Name',
                        attributeValue: '',
                      },
                      '2': {
                        attributeKey: 'Last Name',
                        attributeValue: '',
                      },
                      '3': {
                        attributeKey: 'Birthday',
                        attributeValue: '',
                      },
                      '4': {
                        attributeKey: 'City',
                        attributeValue: '',
                      },
                      '5': {
                        attributeKey: 'Country',
                        attributeValue: '',
                      },
                      '6': {
                        attributeKey: 'Revenue',
                        attributeValue: 5.99,
                      },
                      '7': {
                        attributeKey: 'Offer',
                        attributeValue: 'Discount',
                      },
                      '8': {
                        attributeKey: 'Title Page',
                        attributeValue: '',
                      },
                      '9': {
                        attributeKey: 'Cart Value',
                        attributeValue: '',
                      },
                      '10': {
                        attributeKey: 'Revenue',
                        attributeValue: 5.99,
                      },
                      '11': {
                        attributeKey: 'App Build',
                        attributeValue: '1',
                      },
                      '12': {
                        attributeKey: 'App Name',
                        attributeValue: 'RudderAndroidClient',
                      },
                      '13': {
                        attributeKey: 'Library Name',
                        attributeValue: 'com.rudderstack.android.sdk.core',
                      },
                      '14': {
                        attributeKey: 'IP',
                        attributeValue: '14.5.67.21',
                      },
                    },
                  },
                ],
                spreadSheetId: 'rudder_sheet_id',
                spreadSheet: 'rudder_sheet',
              },
              metadata: [generateMetadata(2, 'u1')],
              batched: true,
              statusCode: 200,
              destination: {
                ID: 'default-destination-id',
                Name: 'Default Destination',
                DestinationDefinition: {
                  ID: 'default-dest-def-id',
                  Name: 'Default Destination Definition',
                  DisplayName: 'Default Display Name',
                  Config: {},
                },
                Config: {
                  credentials: '{ sheets credentials }',
                  eventKeyMap: [
                    {
                      from: 'firstName',
                      to: 'First Name',
                    },
                    {
                      from: 'lastName',
                      to: 'Last Name',
                    },
                    {
                      from: 'birthday',
                      to: 'Birthday',
                    },
                    {
                      from: 'address.city',
                      to: 'City',
                    },
                    {
                      from: 'address.country',
                      to: 'Country',
                    },
                    {
                      from: 'revenue',
                      to: 'Revenue',
                    },
                    {
                      from: 'offer',
                      to: 'Offer',
                    },
                    {
                      from: 'title',
                      to: 'Title Page',
                    },
                    {
                      from: 'Cart Value',
                      to: 'Cart Value',
                    },
                    {
                      from: 'revenue',
                      to: 'Revenue',
                    },
                    {
                      from: 'context.app.build',
                      to: 'App Build',
                    },
                    {
                      from: 'context.app.name',
                      to: 'App Name',
                    },
                    {
                      from: 'context.library.name',
                      to: 'Library Name',
                    },
                    {
                      from: 'context.ip',
                      to: 'IP',
                    },
                  ],
                  sheetId: 'rudder_sheet_id',
                  sheetName: 'rudder_sheet',
                },
                Enabled: true,
                WorkspaceID: 'default-workspace',
                Transformations: [],
                RevisionID: 'default-revision',
                IsProcessorEnabled: true,
                IsConnectionEnabled: true,
              },
            },
          ],
        },
      },
    },
  },
];
