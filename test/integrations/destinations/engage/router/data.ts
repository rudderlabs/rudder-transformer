export const data = [
  {
    name: 'engage',
    description: 'Successfull Remove Group Call ',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                groupId: '17',
                context: {
                  externalId: [
                    {
                      type: 'engageId',
                      id: '246',
                    },
                  ],
                },
                traits: {
                  lastName: 'garwal',
                  type: 'Segments',
                  operation: 'remove',
                },
                type: 'group',
              },
              destination: {
                Config: {
                  publicKey: '49ur490rjfo34gi04y38r9go',
                  privateKey: 'n89g389yr389fgbef0u2rff',
                  listIds: [
                    {
                      listId: '9834trg3rgy3g08oi9893rgfb',
                    },
                    {
                      listId: 'f39487tyh49go3h093gh2if2f2',
                    },
                  ],
                },
              },
              metadata: {
                jobId: 1,
              },
            },
          ],
          destType: 'engage',
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
                version: '1',
                type: 'REST',
                method: 'DELETE',
                endpoint: 'https://api.engage.so/v1/lists/17/subscribers/246',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization:
                    'Basic NDl1cjQ5MHJqZm8zNGdpMDR5MzhyOWdvOm44OWczODl5cjM4OWZnYmVmMHUycmZm',
                },
                params: {},
                body: {
                  JSON: {
                    subscribed: true,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              destination: {
                Config: {
                  publicKey: '49ur490rjfo34gi04y38r9go',
                  privateKey: 'n89g389yr389fgbef0u2rff',
                  listIds: [
                    {
                      listId: '9834trg3rgy3g08oi9893rgfb',
                    },
                    {
                      listId: 'f39487tyh49go3h093gh2if2f2',
                    },
                  ],
                },
              },
              metadata: [
                {
                  jobId: 1,
                },
              ],
              batched: false,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'engage',
    description: 'Successfull Identify Call with userDi in externalId',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                userId: '1',
                context: {
                  externalId: [
                    {
                      type: 'engageListId',
                      id: '100c983ry8934hf3094yfh348gf1',
                    },
                    {
                      type: 'engageListId',
                      id: '4r40hfio3rbfln',
                    },
                  ],
                },
                originalTimestamp: '2020-09-28T19:53:31.900Z',
                traits: {
                  firstName: 'Test',
                  lastName: 'Rudderlabs',
                  email: 'Test@r.com',
                  hasPurchased: 'yes',
                  address: {
                    Home: {
                      city: 'iudcb',
                    },
                    Office: {
                      abc: 'jbc',
                    },
                  },
                  state: 'Delhi',
                  title: 'Mr',
                },
                timestamp: '2020-09-29T14:50:29.907+05:30',
                type: 'identify',
              },
              destination: {
                Config: {
                  publicKey: '49ur490rjfo34gi04y38r9go',
                  privateKey: 'n89g389yr389fgbef0u2rff',
                  listIds: [
                    {
                      listId: '9834trg3rgy3g08oi9893rgfb',
                    },
                    {
                      listId: 'f39487tyh49go3h093gh2if2f2',
                    },
                  ],
                },
              },
              metadata: {
                jobId: 2,
              },
            },
          ],
          destType: 'engage',
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
                body: {
                  XML: {},
                  FORM: {},
                  JSON: {
                    meta: {
                      abc: 'jbc',
                      city: 'iudcb',
                      state: 'Delhi',
                      title: 'Mr',
                      hasPurchased: 'yes',
                    },
                    email: 'Test@r.com',
                    lists: ['100c983ry8934hf3094yfh348gf1', '4r40hfio3rbfln'],
                    last_name: 'Rudderlabs',
                    created_at: '2020-09-29T14:50:29.907+05:30',
                    first_name: 'Test',
                  },
                  JSON_ARRAY: {},
                },
                type: 'REST',
                files: {},
                method: 'PUT',
                params: {},
                headers: {
                  'Content-Type': 'application/json',
                  Authorization:
                    'Basic NDl1cjQ5MHJqZm8zNGdpMDR5MzhyOWdvOm44OWczODl5cjM4OWZnYmVmMHUycmZm',
                },
                version: '1',
                endpoint: 'https://api.engage.so/v1/users/1',
              },
              destination: {
                Config: {
                  publicKey: '49ur490rjfo34gi04y38r9go',
                  privateKey: 'n89g389yr389fgbef0u2rff',
                  listIds: [
                    {
                      listId: '9834trg3rgy3g08oi9893rgfb',
                    },
                    {
                      listId: 'f39487tyh49go3h093gh2if2f2',
                    },
                  ],
                },
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'engage',
    description: 'Error: engageID is required for remove operation',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: 'user123',
                groupId: '17',
                traits: {
                  lastName: 'garwal',
                  operation: 'remove',
                  email: 'abc@xyz.com',
                },
                type: 'group',
              },
              destination: {
                Config: {
                  publicKey: '49ur490rjfo34gi04y38r9go',
                  privateKey: 'n89g389yr389fgbef0u2rff',
                  listIds: [
                    {
                      listId: '9834trg3rgy3g08oi9893rgfb',
                    },
                    {
                      listId: 'f39487tyh49go3h093gh2if2f2',
                    },
                  ],
                },
              },
              metadata: {
                jobId: 3,
              },
            },
          ],
          destType: 'engage',
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
              metadata: [
                {
                  jobId: 3,
                },
              ],
              destination: {
                Config: {
                  publicKey: '49ur490rjfo34gi04y38r9go',
                  privateKey: 'n89g389yr389fgbef0u2rff',
                  listIds: [
                    {
                      listId: '9834trg3rgy3g08oi9893rgfb',
                    },
                    {
                      listId: 'f39487tyh49go3h093gh2if2f2',
                    },
                  ],
                },
              },
              statTags: {
                errorCategory: 'dataValidation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                destType: 'ENGAGE',
                errorType: 'instrumentation',
              },
              batched: false,
              statusCode: 400,
              error: 'engageID is required for remove operation.',
            },
          ],
        },
      },
    },
  },
];
