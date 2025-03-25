import utils from '../../../../src/v0/util';

const defaultMockFns = () => {
  jest.spyOn(utils, 'generateUUID').mockReturnValue('dummy-anonymous-id-0-0');
};

export const data = [
  {
    name: 'facebook_lead_ads',
    description: 'facebook lead ads with facebook_lead_id',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                available_at_this_time: ['2025-02-01T00:00:00+0530'],
                city: ['Bengaluru'],
                conditional_question_1: ['Sweatshirt'],
                conditional_question_2: ['Black'],
                conditional_question_3: ['Medium'],
                country: ['IN'],
                created_time: ['02/01/2025 10:20'],
                date_of_birth: ['01/01/2000'],
                facebook_lead_id: ['3960271960958574'],
                first_name: ['Dummy'],
                last_name: ['Name'],
                military_status: ['na'],
                phone_number: ['+910123456789'],
                post_code: [200000],
                relationship_status: ['na'],
                'short_answer_ques_1?': ['dummy short answer'],
                state: ['Dummy State'],
                street_address: ['Dummy Street'],
                'test_ques_1?': ['test ques'],
              }),
            },
            source: {},
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
                    integration: {
                      name: 'FacebookLeadAds',
                    },
                    library: {
                      name: 'unknown',
                      version: 'unknown',
                    },
                    traits: {
                      address: {
                        city: 'Bengaluru',
                        country: 'IN',
                        postalCode: 200000,
                        state: 'Dummy State',
                        street: 'Dummy Street',
                      },
                      available_at_this_time: '2025-02-01T00:00:00+0530',
                      birthday: '01/01/2000',
                      city: 'Bengaluru',
                      conditional_question_1: 'Sweatshirt',
                      conditional_question_2: 'Black',
                      conditional_question_3: 'Medium',
                      country: 'IN',
                      created_time: '02/01/2025 10:20',
                      date_of_birth: '01/01/2000',
                      facebook_lead_id: '3960271960958574',
                      firstName: 'Dummy',
                      first_name: 'Dummy',
                      lastName: 'Name',
                      last_name: 'Name',
                      military_status: 'na',
                      phone: '+910123456789',
                      phone_number: '+910123456789',
                      post_code: 200000,
                      relationship_status: 'na',
                      'short_answer_ques_1?': 'dummy short answer',
                      state: 'Dummy State',
                      street_address: 'Dummy Street',
                      'test_ques_1?': 'test ques',
                    },
                  },
                  integrations: {
                    FacebookLeadAds: false,
                  },
                  originalTimestamp: '2025-02-01T10:20:00.000Z',
                  type: 'identify',
                  userId: '3960271960958574',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'facebook_lead_ads',
    description: 'facebook lead ads with valid created_time',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                available_at_this_time: ['2025-02-01T00:00:00+0530'],
                city: ['Bengaluru'],
                conditional_question_1: ['Sweatshirt'],
                conditional_question_2: ['Black'],
                conditional_question_3: ['Medium'],
                country: ['IN'],
                created_time: ['02/01/2025 10:20'],
                date_of_birth: ['01/01/2000'],
                facebook_lead_id: ['3960271960958574'],
                first_name: ['Dummy'],
                id: ['3960271960958574'],
                last_name: ['Name'],
                military_status: ['na'],
                phone_number: ['+910123456789'],
                post_code: ['200000'],
                relationship_status: ['na'],
                'short_answer_ques_1?': ['dummy short answer'],
                state: ['Dummy State'],
                street_address: ['Dummy Street'],
                'test_ques_1?': ['test ques'],
              }),
            },
            source: {},
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
                    integration: {
                      name: 'FacebookLeadAds',
                    },
                    library: {
                      name: 'unknown',
                      version: 'unknown',
                    },
                    traits: {
                      address: {
                        city: 'Bengaluru',
                        country: 'IN',
                        postalCode: '200000',
                        state: 'Dummy State',
                        street: 'Dummy Street',
                      },
                      available_at_this_time: '2025-02-01T00:00:00+0530',
                      birthday: '01/01/2000',
                      city: 'Bengaluru',
                      conditional_question_1: 'Sweatshirt',
                      conditional_question_2: 'Black',
                      conditional_question_3: 'Medium',
                      country: 'IN',
                      created_time: '02/01/2025 10:20',
                      date_of_birth: '01/01/2000',
                      facebook_lead_id: '3960271960958574',
                      firstName: 'Dummy',
                      first_name: 'Dummy',
                      id: '3960271960958574',
                      lastName: 'Name',
                      last_name: 'Name',
                      military_status: 'na',
                      phone: '+910123456789',
                      phone_number: '+910123456789',
                      post_code: '200000',
                      relationship_status: 'na',
                      'short_answer_ques_1?': 'dummy short answer',
                      state: 'Dummy State',
                      street_address: 'Dummy Street',
                      'test_ques_1?': 'test ques',
                    },
                  },
                  integrations: {
                    FacebookLeadAds: false,
                  },
                  originalTimestamp: '2025-02-01T10:20:00.000Z',
                  type: 'identify',
                  userId: '3960271960958574',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'facebook_lead_ads',
    description: 'facebook lead ads without userId',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                available_at_this_time: ['2025-02-01T00:00:00+0530'],
                city: ['Bengaluru'],
                conditional_question_1: ['Sweatshirt'],
                conditional_question_2: ['Black'],
                conditional_question_3: ['Medium'],
                country: ['IN'],
                created_time: ['02/01/2025 10:20'],
                date_of_birth: ['01/01/2000'],
                first_name: ['Dummy'],
                last_name: ['Name'],
                military_status: ['na'],
                phone_number: ['+910123456789'],
                post_code: ['200000'],
                relationship_status: ['na'],
                'short_answer_ques_1?': ['dummy short answer'],
                state: ['Dummy State'],
                street_address: ['Dummy Street'],
                'test_ques_1?': ['test ques'],
              }),
            },
            source: {},
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
                    integration: {
                      name: 'FacebookLeadAds',
                    },
                    library: {
                      name: 'unknown',
                      version: 'unknown',
                    },
                    traits: {
                      address: {
                        city: 'Bengaluru',
                        country: 'IN',
                        postalCode: '200000',
                        state: 'Dummy State',
                        street: 'Dummy Street',
                      },
                      available_at_this_time: '2025-02-01T00:00:00+0530',
                      birthday: '01/01/2000',
                      city: 'Bengaluru',
                      conditional_question_1: 'Sweatshirt',
                      conditional_question_2: 'Black',
                      conditional_question_3: 'Medium',
                      country: 'IN',
                      created_time: '02/01/2025 10:20',
                      date_of_birth: '01/01/2000',
                      firstName: 'Dummy',
                      first_name: 'Dummy',
                      lastName: 'Name',
                      last_name: 'Name',
                      military_status: 'na',
                      phone: '+910123456789',
                      phone_number: '+910123456789',
                      post_code: '200000',
                      relationship_status: 'na',
                      'short_answer_ques_1?': 'dummy short answer',
                      state: 'Dummy State',
                      street_address: 'Dummy Street',
                      'test_ques_1?': 'test ques',
                    },
                  },
                  integrations: {
                    FacebookLeadAds: false,
                  },
                  originalTimestamp: '2025-02-01T10:20:00.000Z',
                  anonymousId: 'dummy-anonymous-id-0-0',
                  type: 'identify',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'facebook_lead_ads',
    description: 'facebook lead ads with invalid created_time',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                available_at_this_time: ['2025-02-01T00:00:00+0530'],
                city: ['Bengaluru'],
                conditional_question_1: ['Sweatshirt'],
                conditional_question_2: ['Black'],
                conditional_question_3: ['Medium'],
                country: ['IN'],
                created_time: ['02/01/2025 invalid 10:20'],
                date_of_birth: ['01/01/2000'],
                facebook_lead_id: ['3960271960958574'],
                first_name: ['Dummy'],
                id: ['3960271960958574'],
                last_name: ['Name'],
                military_status: ['na'],
                phone_number: ['+910123456789'],
                post_code: ['200000'],
                relationship_status: ['na'],
                'short_answer_ques_1?': ['dummy short answer'],
                state: ['Dummy State'],
                street_address: ['Dummy Street'],
                'test_ques_1?': ['test ques'],
              }),
            },
            source: {},
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
                    integration: {
                      name: 'FacebookLeadAds',
                    },
                    library: {
                      name: 'unknown',
                      version: 'unknown',
                    },
                    traits: {
                      address: {
                        city: 'Bengaluru',
                        country: 'IN',
                        postalCode: '200000',
                        state: 'Dummy State',
                        street: 'Dummy Street',
                      },
                      available_at_this_time: '2025-02-01T00:00:00+0530',
                      birthday: '01/01/2000',
                      city: 'Bengaluru',
                      conditional_question_1: 'Sweatshirt',
                      conditional_question_2: 'Black',
                      conditional_question_3: 'Medium',
                      country: 'IN',
                      created_time: '02/01/2025 invalid 10:20',
                      date_of_birth: '01/01/2000',
                      facebook_lead_id: '3960271960958574',
                      firstName: 'Dummy',
                      first_name: 'Dummy',
                      id: '3960271960958574',
                      lastName: 'Name',
                      last_name: 'Name',
                      military_status: 'na',
                      phone: '+910123456789',
                      phone_number: '+910123456789',
                      post_code: '200000',
                      relationship_status: 'na',
                      'short_answer_ques_1?': 'dummy short answer',
                      state: 'Dummy State',
                      street_address: 'Dummy Street',
                      'test_ques_1?': 'test ques',
                    },
                  },
                  integrations: {
                    FacebookLeadAds: false,
                  },
                  type: 'identify',
                  userId: '3960271960958574',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'facebook_lead_ads',
    description: 'facebook lead ads with unavailable/null created_time',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                available_at_this_time: ['2025-02-01T00:00:00+0530'],
                city: ['Bengaluru'],
                conditional_question_1: ['Sweatshirt'],
                conditional_question_2: ['Black'],
                conditional_question_3: ['Medium'],
                country: ['IN'],
                date_of_birth: ['01/01/2000'],
                facebook_lead_id: ['3960271960958574'],
                first_name: ['Dummy'],
                id: ['3960271960958574'],
                last_name: ['Name'],
                military_status: ['na'],
                phone_number: ['+910123456789'],
                post_code: ['200000'],
                relationship_status: ['na'],
                'short_answer_ques_1?': ['dummy short answer'],
                state: ['Dummy State'],
                street_address: ['Dummy Street'],
                'test_ques_1?': ['test ques'],
              }),
            },
            source: {},
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
                    integration: {
                      name: 'FacebookLeadAds',
                    },
                    library: {
                      name: 'unknown',
                      version: 'unknown',
                    },
                    traits: {
                      address: {
                        city: 'Bengaluru',
                        country: 'IN',
                        postalCode: '200000',
                        state: 'Dummy State',
                        street: 'Dummy Street',
                      },
                      available_at_this_time: '2025-02-01T00:00:00+0530',
                      birthday: '01/01/2000',
                      city: 'Bengaluru',
                      conditional_question_1: 'Sweatshirt',
                      conditional_question_2: 'Black',
                      conditional_question_3: 'Medium',
                      country: 'IN',
                      date_of_birth: '01/01/2000',
                      facebook_lead_id: '3960271960958574',
                      firstName: 'Dummy',
                      first_name: 'Dummy',
                      id: '3960271960958574',
                      lastName: 'Name',
                      last_name: 'Name',
                      military_status: 'na',
                      phone: '+910123456789',
                      phone_number: '+910123456789',
                      post_code: '200000',
                      relationship_status: 'na',
                      'short_answer_ques_1?': 'dummy short answer',
                      state: 'Dummy State',
                      street_address: 'Dummy Street',
                      'test_ques_1?': 'test ques',
                    },
                  },
                  integrations: {
                    FacebookLeadAds: false,
                  },
                  type: 'identify',
                  userId: '3960271960958574',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'facebook_lead_ads',
    description: 'facebook lead ads with null payload',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify(null),
            },
            source: {},
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'input event must have at least one field',
            statTags: {
              destinationId: 'Non determinable',
              errorCategory: 'transformation',
              implementation: 'native',
              module: 'source',
              srcType: 'facebook_lead_ads',
              workspaceId: 'Non determinable',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_lead_ads',
    description: 'facebook lead ads with empty payload',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({}),
            },
            source: {},
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'input event must have at least one field',
            statTags: {
              destinationId: 'Non determinable',
              errorCategory: 'transformation',
              implementation: 'native',
              module: 'source',
              srcType: 'facebook_lead_ads',
              workspaceId: 'Non determinable',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
].map((tc) => ({
  ...tc,
  mockFns: () => {
    defaultMockFns();
  },
}));
