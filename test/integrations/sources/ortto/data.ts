import utils from '../../../../src/v0/util';

const defaultMockFns = () => {
  jest.spyOn(utils, 'generateUUID').mockReturnValue('97fcd7b2-cc24-47d7-b776-057b7b199513');
};

export const data = [
  {
    name: 'ortto',
    description: 'Simple track call',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            activity: {
              id: '00651b946bfef7e80478efee',
              field_id: 'act::s-all',
              created: '2023-10-03T04:11:23Z',
              attr: {
                'str::is': 'API',
                'str::s-ctx': 'Subscribed via API',
              },
            },
            contact: {
              contact_id: '00651b946baa9be6b2edad00',
              email: 'abhi@example.com',
            },
            id: '00651b946cef87c7af64f4f3',
            time: '2023-10-03T04:11:24.25726779Z',
            webhook_id: '651b8aec8002153e16319fd3',
          },
        ],
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  context: {
                    library: { name: 'unknown', version: 'unknown' },
                    integration: { name: 'ortto' },
                    traits: { email: 'abhi@example.com' },
                    externalId: [
                      {
                        id: '00651b946baa9be6b2edad00',
                        type: 'orttoPersonId',
                      },
                    ],
                  },
                  event: 'Resubscribe globally',
                  integrations: { ortto: false },
                  type: 'track',
                  anonymousId: '97fcd7b2-cc24-47d7-b776-057b7b199513',
                  messageId: '00651b946cef87c7af64f4f3',
                  originalTimestamp: '2023-10-03T04:11:24.000Z',
                  properties: {
                    'activity.id': '00651b946bfef7e80478efee',
                    'activity.created': '2023-10-03T04:11:23Z',
                    'activity.attr.str::is': 'API',
                    'activity.attr.str::s-ctx': 'Subscribed via API',
                    webhook_id: '651b8aec8002153e16319fd3',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'ortto',
    description: 'Simple track call',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            activity: {
              id: '00651b946bfef7e80478efee',
              field_id: 'act::s-all',
              created: '2023-10-03T04:11:23Z',
              attr: {
                'str::is': 'API',
                'str::s-ctx': 'Subscribed via API',
              },
            },
            contact: {
              external_id: 'user_x',
              city: {
                name: 'Kolkata',
                id: 0,
                lat: 37751000,
                lng: -97822000,
              },
              contact_id: '006524f0b8d370050056e400',
              country: {
                name: 'United States',
                id: 6252001,
                lat: 0,
                lng: 0,
              },
              email: 'xyz@email.com',
              first_name: 'Ujjwal',
              last_name: 'Ujjwal',
              birthday: {
                year: 1980,
                month: 3,
                day: 4,
                timezone: 'Australia/Sydney',
              },
              phone_number: {
                c: '91',
                n: '401234567',
              },
            },
            id: '00651b946cef87c7af64f4f3',
            time: '2023-10-03T04:11:24.25726779Z',
            webhook_id: '651b8aec8002153e16319fd3',
          },
        ],
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  userId: 'user_x',
                  context: {
                    externalId: [
                      {
                        id: '006524f0b8d370050056e400',
                        type: 'orttoPersonId',
                      },
                    ],
                    library: { name: 'unknown', version: 'unknown' },
                    integration: { name: 'ortto' },
                    traits: {
                      email: 'xyz@email.com',
                      birthday: '1980-03-04',
                      firstName: 'Ujjwal',
                      lastName: 'Ujjwal',
                      phone: '91401234567',
                      address: {
                        city: 'Kolkata',
                        country: 'United States',
                      },
                    },
                  },
                  event: 'Resubscribe globally',
                  integrations: { ortto: false },
                  type: 'track',
                  messageId: '00651b946cef87c7af64f4f3',
                  originalTimestamp: '2023-10-03T04:11:24.000Z',
                  properties: {
                    'activity.id': '00651b946bfef7e80478efee',
                    'activity.created': '2023-10-03T04:11:23Z',
                    'activity.attr.str::is': 'API',
                    'activity.attr.str::s-ctx': 'Subscribed via API',
                    'contact.birthday.timezone': 'Australia/Sydney',
                    'contact.city.id': 0,
                    'contact.city.lat': 37751000,
                    'contact.city.lng': -97822000,
                    'contact.country.id': 6252001,
                    'contact.country.lat': 0,
                    'contact.country.lng': 0,
                    webhook_id: '651b8aec8002153e16319fd3',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'ortto',
    description: 'Simple track call with unknown field id',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            activity: {
              id: '00651b946bfef7e80478efee',
              field_id: 'act::s-ccc',
              created: '2023-10-03T04:11:23Z',
              attr: {
                'str::is': 'API',
                'str::s-ctx': 'Subscribed via API',
              },
            },
            contact: {
              external_id: 'user_x',
              city: {
                name: 'Kolkata',
                id: 0,
                lat: 37751000,
                lng: -97822000,
              },
              contact_id: '006524f0b8d370050056e400',
              country: {
                name: 'United States',
                id: 6252001,
                lat: 0,
                lng: 0,
              },
              email: 'xyz@email.com',
              first_name: 'Ujjwal',
              last_name: 'Ujjwal',
              birthday: {
                year: 1980,
                month: 3,
                day: 4,
                timezone: 'Australia/Sydney',
              },
              phone_number: {
                c: '91',
                n: '401234567',
              },
            },
            id: '00651b946cef87c7af64f4f3',
            time: '2023-10-03T04:11:24.25726779Z',
            webhook_id: '651b8aec8002153e16319fd3',
          },
        ],
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  userId: 'user_x',
                  context: {
                    externalId: [
                      {
                        id: '006524f0b8d370050056e400',
                        type: 'orttoPersonId',
                      },
                    ],
                    library: { name: 'unknown', version: 'unknown' },
                    integration: { name: 'ortto' },
                    traits: {
                      email: 'xyz@email.com',
                      birthday: '1980-03-04',
                      firstName: 'Ujjwal',
                      lastName: 'Ujjwal',
                      phone: '91401234567',
                      address: {
                        city: 'Kolkata',
                        country: 'United States',
                      },
                    },
                  },
                  event: 'custom event triggered',
                  integrations: { ortto: false },
                  type: 'track',
                  messageId: '00651b946cef87c7af64f4f3',
                  originalTimestamp: '2023-10-03T04:11:24.000Z',
                  properties: {
                    'activity.id': '00651b946bfef7e80478efee',
                    'activity.created': '2023-10-03T04:11:23Z',
                    'activity.attr.str::is': 'API',
                    'activity.attr.str::s-ctx': 'Subscribed via API',
                    'contact.birthday.timezone': 'Australia/Sydney',
                    'contact.city.id': 0,
                    'contact.city.lat': 37751000,
                    'contact.city.lng': -97822000,
                    'contact.country.id': 6252001,
                    'contact.country.lat': 0,
                    'contact.country.lng': 0,
                    webhook_id: '651b8aec8002153e16319fd3',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
];
