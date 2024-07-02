import {
  commonInput,
  destination,
  routerInstrumentationErrorStatTags,
  contextWithoutScheduleAndWithContactId,
  commonProperties,
  traitsWithIdentifiers,
} from '../commonConfig';

const commonDestination = {
  ID: 'random_id',
  Name: 'clicksend',
  Config: {
    clicksendPassword: 'dummy',
    clicksendUsername: 'dummy',
    defaultCampaignSchedule: '2',
    defaultCampaignScheduleUnit: 'day',
    defaultSenderId: 'abc@gmail.com',
    defaultSenderPhoneNumber: '+919XXXXXXXX8',
    defaultSource: 'php',
    oneTrustCookieCategories: [
      {
        oneTrustCookieCategory: 'Marketing',
      },
    ],
  },
  DestinationDefinition: {
    Config: {
      cdkV2Enabled: true,
    },
  },
};

export const data = [
  {
    name: 'clicksend',
    id: 'Test 0 - router',
    description: 'Batch calls with all three type of calls as success',
    scenario: 'FrameworkBuisness',
    successCriteria:
      'All events should be transformed successfully but should not be under same batch and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination,
              message: {
                context: contextWithoutScheduleAndWithContactId,
                type: 'track',
                event: 'product purchased',
                userId: 'sajal12',
                channel: 'mobile',
                messageId: 'dummy_msg_id',
                properties: commonProperties,
                anonymousId: 'anon_123',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2021-01-25T15:32:56.409Z',
              },
              metadata: { jobId: 1, userId: 'u1' },
            },
            {
              destination,
              message: {
                context: {
                  traits: traitsWithIdentifiers,
                },
                type: 'track',
                event: 'product purchased',
                userId: 'sajal12',
                channel: 'mobile',
                messageId: 'dummy_msg_id',
                properties: commonProperties,
                anonymousId: 'anon_123',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2021-01-25T15:32:56.409Z',
              },
              metadata: { jobId: 2, userId: 'u2' },
            },
            {
              destination,
              message: {
                type: 'identify',
                ...commonInput,
                context: {
                  ...contextWithoutScheduleAndWithContactId,
                  externalId: [
                    { type: 'CLICKSEND_CONTACT_LIST_ID', id: '123345' },
                    { type: 'CLICKSEND_CONTACT_ID', id: '111' },
                  ],
                },
                userId: 'sajal12',
                traits: traitsWithIdentifiers,
                integrations: {
                  All: true,
                },
                originalTimestamp: '2021-01-25T15:32:56.409Z',
              },
              metadata: { jobId: 3, userId: 'u3' },
            },
          ],
          destType: 'clicksend',
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
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    body: 'abcd',
                    from: 'abc@gmail.com',
                    list_id: 123345,
                    name: 'new campaign',
                    schedule: 1631201576,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://rest.clicksend.com/v3/sms-campaigns/send',
                files: {},
                headers: {
                  Authorization: 'Basic ZHVtbXk6ZHVtbXk=',
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              metadata: [
                {
                  jobId: 1,

                  userId: 'u1',
                },
              ],
              destination: commonDestination,
              statusCode: 200,
            },
            {
              batched: true,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    messages: [
                      {
                        body: 'abcd',
                        custom_string: 'test string',
                        email: 'abc@gmail.com',
                        from: 'abc@gmail.com',
                        from_email: 'dummy@gmail.com',
                        schedule: 1631201576,
                        source: 'php',
                        to: '+9182XXXX068',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://rest.clicksend.com/v3/sms/send',
                files: {},
                headers: {
                  Authorization: 'Basic ZHVtbXk6ZHVtbXk=',
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              metadata: [
                {
                  jobId: 2,

                  userId: 'u2',
                },
              ],
              destination: commonDestination,
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    address_line_1: '{"city":"New York","country":"USA","pinCode":"123456"}',
                    address_line_2: '{"city":"New York","country":"USA","pinCode":"123456"}',
                    city: 'New York',
                    contact_id: '111',
                    email: 'abc@gmail.com',
                    first_name: 'John',
                    last_name: 'Doe',
                    phone_number: '+9182XXXX068',
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://rest.clicksend.com/v3/lists/123345/contacts/111',
                files: {},
                headers: {
                  Authorization: 'Basic ZHVtbXk6ZHVtbXk=',
                  'Content-Type': 'application/json',
                },
                method: 'PUT',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: commonDestination,
              metadata: [
                {
                  jobId: 3,

                  userId: 'u3',
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'clicksend',
    id: 'Test 0 - router',
    description: 'Batch calls with all five type of calls as two successful and one failure',
    scenario: 'FrameworkBuisness',
    successCriteria:
      'All events should be transformed successfully but should not be under same batch and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination,
              message: {
                context: contextWithoutScheduleAndWithContactId,
                type: 'track',
                event: 'product purchased',
                userId: 'sajal12',
                channel: 'mobile',
                messageId: 'dummy_msg_id',
                properties: commonProperties,
                anonymousId: 'anon_123',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2021-01-25T15:32:56.409Z',
              },
              metadata: { jobId: 1, userId: 'u1' },
            },
            {
              destination,
              message: {
                context: {
                  traits: traitsWithIdentifiers,
                },
                type: 'track',
                event: 'product purchased',
                userId: 'sajal12',
                channel: 'mobile',
                messageId: 'dummy_msg_id',
                properties: commonProperties,
                anonymousId: 'anon_123',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2021-01-25T15:32:56.409Z',
              },
              metadata: { jobId: 2, userId: 'u2' },
            },
            {
              destination,
              message: {
                type: 'identify',
                ...commonInput,
                context: {
                  ...contextWithoutScheduleAndWithContactId,
                  externalId: [{ type: 'CLICKSEND_CONTACT_ID', id: '111' }],
                },
                userId: 'sajal12',
                traits: traitsWithIdentifiers,
                integrations: {
                  All: true,
                },
                originalTimestamp: '2021-01-25T15:32:56.409Z',
              },
              metadata: { jobId: 3, userId: 'u3' },
            },
            {
              destination,
              message: {
                context: {
                  traits: traitsWithIdentifiers,
                },
                type: 'track',
                event: 'product purchased',
                userId: 'sajal12',
                channel: 'mobile',
                messageId: 'dummy_msg_id',
                properties: commonProperties,
                anonymousId: 'anon_123',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2021-01-25T15:32:56.409Z',
              },
              metadata: { jobId: 4, userId: 'u4' },
            },
            {
              destination,
              message: {
                context: {
                  traits: traitsWithIdentifiers,
                },
                type: 'track',
                event: 'product purchased',
                userId: 'sajal12',
                channel: 'mobile',
                messageId: 'dummy_msg_id',
                properties: commonProperties,
                anonymousId: 'anon_123',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2021-01-25T15:32:56.409Z',
              },
              metadata: { jobId: 5, userId: 'u5' },
            },
          ],
          destType: 'clicksend',
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
              batched: false,
              destination,
              error: 'externalId does not contain contact list Id of Clicksend. Aborting.',
              metadata: [{ jobId: 3, userId: 'u3' }],
              statTags: routerInstrumentationErrorStatTags,
              statusCode: 400,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    body: 'abcd',
                    from: 'abc@gmail.com',
                    list_id: 123345,
                    name: 'new campaign',
                    schedule: 1631201576,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://rest.clicksend.com/v3/sms-campaigns/send',
                files: {},
                headers: {
                  Authorization: 'Basic ZHVtbXk6ZHVtbXk=',
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              metadata: [
                {
                  jobId: 1,

                  userId: 'u1',
                },
              ],
              destination: commonDestination,
              statusCode: 200,
            },
            {
              batched: true,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {
                    messages: [
                      {
                        body: 'abcd',
                        custom_string: 'test string',
                        email: 'abc@gmail.com',
                        from: 'abc@gmail.com',
                        from_email: 'dummy@gmail.com',
                        schedule: 1631201576,
                        source: 'php',
                        to: '+9182XXXX068',
                      },
                      {
                        body: 'abcd',
                        custom_string: 'test string',
                        email: 'abc@gmail.com',
                        from: 'abc@gmail.com',
                        from_email: 'dummy@gmail.com',
                        schedule: 1631201576,
                        source: 'php',
                        to: '+9182XXXX068',
                      },
                      {
                        body: 'abcd',
                        custom_string: 'test string',
                        email: 'abc@gmail.com',
                        from: 'abc@gmail.com',
                        from_email: 'dummy@gmail.com',
                        schedule: 1631201576,
                        source: 'php',
                        to: '+9182XXXX068',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                endpoint: 'https://rest.clicksend.com/v3/sms/send',
                files: {},
                headers: {
                  Authorization: 'Basic ZHVtbXk6ZHVtbXk=',
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              metadata: [
                {
                  jobId: 2,

                  userId: 'u2',
                },
                {
                  jobId: 4,

                  userId: 'u4',
                },
                {
                  jobId: 5,

                  userId: 'u5',
                },
              ],
              destination: commonDestination,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
