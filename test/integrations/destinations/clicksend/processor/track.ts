import {
  destination,
  commonProperties,
  metadata,
  contextWithoutScheduleAndWithContactId,
  SMS_CAMPAIGN_ENDPOINT,
  commonHeader,
  processInstrumentationErrorStatTags,
  traitsWithoutIdenfiers,
  traitsWithIdentifiers,
  SMS_SEND_ENDPOINT,
} from '../commonConfig';
import { transformResultBuilder } from '../../../testUtils';
export const track = [
  {
    id: 'clicksend-test-track-success-1',
    name: 'clicksend',
    description:
      'Track call containing CLICKSEND_CONTACT_LIST_ID as externalID and all mappings available',
    scenario: 'Framework+Buisness',
    successCriteria:
      'It will trigger sms campaign for that entire list. Also, scheduling is updated based on configuration',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
            metadata,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            output: transformResultBuilder({
              method: 'POST',
              endpoint: SMS_CAMPAIGN_ENDPOINT,
              headers: commonHeader,
              JSON: {
                list_id: 123345,
                body: 'abcd',
                from: 'abc@gmail.com',
                name: 'new campaign',
                schedule: 1611761576,
              },
              userId: '',
            }),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'clicksend-test-track-success-2',
    name: 'clicksend',
    description:
      'Track call containing CLICKSEND_CONTACT_LIST_ID as externalID and one of mandatory fields absent',
    scenario: 'Framework+Buisness',
    successCriteria:
      'as list Id, name, body and from fields are required ones to trigger event, hence it will fail',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              context: contextWithoutScheduleAndWithContactId,
              type: 'track',
              event: 'product purchased',
              userId: 'sajal12',
              channel: 'mobile',
              messageId: 'dummy_msg_id',
              properties: { ...commonProperties, name: '' },
              anonymousId: 'anon_123',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            },
            metadata,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'All of contact list Id, name, body and from are required to trigger an sms campaign: Workflow: procWorkflow, Step: prepareTrackPayload, ChildStep: sendSmsCampaignPayload, OriginalError: All of contact list Id, name, body and from are required to trigger an sms campaign',
            metadata,
            statTags: processInstrumentationErrorStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'clicksend-test-track-success-3',
    name: 'clicksend',
    description:
      'Track call containing CLICKSEND_CONTACT_LIST_ID as externalID and list ID is sent as a boolean',
    scenario: 'Framework+Buisness',
    successCriteria: 'It should fail, as list Id must be an integer',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              context: {
                ...contextWithoutScheduleAndWithContactId,
                externalId: [{ type: 'CLICKSEND_CONTACT_LIST_ID', id: true }],
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
            metadata,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'list_id must be an integer: Workflow: procWorkflow, Step: prepareTrackPayload, ChildStep: sendSmsCampaignPayload, OriginalError: list_id must be an integer',
            metadata,
            statTags: processInstrumentationErrorStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'clicksend-test-track-success-4',
    name: 'clicksend',
    description:
      'Track call not containing CLICKSEND_CONTACT_LIST_ID as externalID and all mappings available',
    scenario: 'Framework+Buisness',
    successCriteria:
      'It will trigger sms send call for that phone number. Also, scheduling is updated based on configuration',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
            metadata,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata,
            output: transformResultBuilder({
              method: 'POST',
              endpoint: SMS_SEND_ENDPOINT,
              headers: commonHeader,
              JSON: {
                email: 'abc@gmail.com',
                body: 'abcd',
                from: 'abc@gmail.com',
                from_email: 'dummy@gmail.com',
                custom_string: 'test string',
                schedule: 1611761576,
                source: 'php',
                to: '+9182XXXX068',
              },
              userId: '',
            }),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'clicksend-test-track-success-5',
    name: 'clicksend',
    description:
      'Track call not containing CLICKSEND_CONTACT_LIST_ID as externalID and mandatory identifiers missing',
    scenario: 'Framework+Buisness',
    successCriteria: 'It will not trigger sms send call and fail with error',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              context: {
                traits: traitsWithoutIdenfiers,
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
            metadata,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'all of sender email, phone and body needs to be present for track call: Workflow: procWorkflow, Step: prepareTrackPayload, ChildStep: sendSmsCampaignPayload, OriginalError: all of sender email, phone and body needs to be present for track call',
            metadata,
            statTags: processInstrumentationErrorStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
];
