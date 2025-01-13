import {
  destination,
  contextWithoutScheduleAndWithContactId,
  traitsWithoutIdenfiers,
  traitsWithIdentifiers,
  commonInput,
  metadata,
  processInstrumentationErrorStatTags,
  commonIdentifyOutput,
  commonHeader,
  COMMON_CONTACT_DOMAIN,
} from '../commonConfig';
export const identify = [
  {
    id: 'clicksend-test-identify-success-1',
    name: 'clicksend',
    description: 'identify call without externalId with contact list Id',
    scenario: 'Framework+Buisness',
    successCriteria: 'Identify call should fail as external ID is mandatory',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'identify',
              ...commonInput,
              userId: 'sajal12',
              traits: traitsWithIdentifiers,
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
              'externalId does not contain contact list Id of Clicksend. Aborting.: Workflow: procWorkflow, Step: prepareIdentifyPayload, ChildStep: undefined, OriginalError: externalId does not contain contact list Id of Clicksend. Aborting.',
            metadata,
            statTags: processInstrumentationErrorStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'clicksend-test-identify-success-1',
    name: 'clicksend',
    description: 'identify call with externalId with contact list Id',
    scenario: 'Framework+Buisness',
    successCriteria: 'Identify call should be successful',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'identify',
              ...commonInput,
              context: contextWithoutScheduleAndWithContactId,
              userId: 'sajal12',
              traits: traitsWithIdentifiers,
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: `${COMMON_CONTACT_DOMAIN}/123345/contacts`,
              headers: commonHeader,
              params: {},
              body: {
                JSON: commonIdentifyOutput,
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'clicksend-test-identify-success-1',
    name: 'clicksend',
    description: 'identify call without phone, email or fax number',
    scenario: 'Framework+Buisness',
    successCriteria: 'Identify call should fail as one of the above identifier is mandatory',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'identify',
              ...commonInput,
              userId: 'sajal12',
              traits: traitsWithoutIdenfiers,
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
              'Either phone number or email or fax_number is mandatory for contact creation: Workflow: procWorkflow, Step: prepareIdentifyPayload, ChildStep: undefined, OriginalError: Either phone number or email or fax_number is mandatory for contact creation',
            metadata,
            statTags: processInstrumentationErrorStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'clicksend-test-identify-success-1',
    name: 'clicksend',
    description: 'identify call with externalId with contact Id',
    scenario: 'Framework+Buisness',
    successCriteria: 'Identify call to be made to contact update API',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
            output: {
              version: '1',
              type: 'REST',
              method: 'PUT',
              endpoint: `${COMMON_CONTACT_DOMAIN}/123345/contacts/111`,
              headers: commonHeader,
              params: {},
              body: {
                JSON: { ...commonIdentifyOutput, contact_id: '111' },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
  },
];
