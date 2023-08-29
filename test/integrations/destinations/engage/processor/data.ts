export const data = [
  {
    name: 'engage',
    description: '[IDENTIFY]: Neither externalId or userId is given.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '1',
              traits: {
                firstName: 'test',
                lastName: 'doe',
                email: 'test@r.com',
                hasPurchased: 'yes',
              },
              type: 'identify',
            },
            destination: {
              Config: {
                publicKey: '49ur490rjfo34gi04y38r9go',
                privateKey: 'n89g389yr389fgbef0u2rff',
              },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Neither externalId nor userId is available',
            statTags: {
              destType: 'ENGAGE',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'engage',
    description: '[IDENTIFY]: Create a new User with Metadata and lists from externalId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: '1',
              context: {
                externalId: [
                  { type: 'engageListId', id: '100c983ry8934hf3094yfh348gf1' },
                  { type: 'engageListId', id: '4r40hfio3rbfln' },
                ],
              },
              originalTimestamp: '2020-09-28T19:53:31.900Z',
              traits: {
                firstName: 'test',
                lastName: 'doe',
                email: 'test@r.com',
                hasPurchased: 'yes',
                address: { Home: { city: 'iudcb' }, Office: { abc: 'jbc' } },
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
                  { listId: '9834trg3rgy3g08oi9893rgfb' },
                  { listId: 'f39487tyh49go3h093gh2if2f2' },
                ],
              },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
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
                  email: 'test@r.com',
                  lists: ['100c983ry8934hf3094yfh348gf1', '4r40hfio3rbfln'],
                  last_name: 'doe',
                  created_at: '2020-09-29T14:50:29.907+05:30',
                  first_name: 'test',
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'engage',
    description: '[IDENTIFY]: Update a User with UID and lists from Config',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: '1',
              context: {},
              originalTimestamp: '2020-09-28T19:53:31.900Z',
              traits: {
                firstName: 'test',
                lastName: 'doe',
                email: 'abc@xyz.com',
                hasPurchased: 'yes',
                address: { Home: { city: 'iudcb' }, Office: { abc: 'jbc' } },
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
                  { listId: '9834trg3rgy3g08oi9893rgfb' },
                  { listId: 'f39487tyh49go3h093gh2if2f2' },
                ],
              },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
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
                  email: 'abc@xyz.com',
                  lists: ['9834trg3rgy3g08oi9893rgfb', 'f39487tyh49go3h093gh2if2f2'],
                  last_name: 'doe',
                  created_at: '2020-09-29T14:50:29.907+05:30',
                  first_name: 'test',
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'engage',
    description: '[IDENTIFY]: Update a User with userId inside traits and no listIds.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 3131,
              originalTimestamp: '2020-09-28T19:53:31.900Z',
              traits: {
                userId: '1',
                firstName: 'test',
                lastName: 'doe',
                email: 'test@r.com',
                hasPurchased: 'yes',
                address: { Home: { city: 'iudcb' }, Office: { abc: 'jbc' } },
                state: 'Lucknow',
                title: 'Mr',
              },
              timestamp: '2020-09-29T14:50:29.907+05:30',
              type: 'identify',
            },
            destination: {
              Config: {
                publicKey: '49ur490rjfo34gi04y38r9go',
                privateKey: 'n89g389yr389fgbef0u2rff',
              },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  meta: {
                    abc: 'jbc',
                    city: 'iudcb',
                    state: 'Lucknow',
                    title: 'Mr',
                    userId: '1',
                    hasPurchased: 'yes',
                  },
                  email: 'test@r.com',
                  last_name: 'doe',
                  created_at: '2020-09-29T14:50:29.907+05:30',
                  first_name: 'test',
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'engage',
    description: '[TRACK]: Send an Event with userId inside externalID.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 3131,
              context: { externalId: [{ type: 'engageId', id: '1' }] },
              originalTimestamp: '2020-09-28T19:53:31.900Z',
              event: 'First Investment',
              properties: { currency: 'EUR', revenue: 20.37566 },
              type: 'track',
            },
            destination: {
              Config: {
                publicKey: '49ur490rjfo34gi04y38r9go',
                privateKey: 'n89g389yr389fgbef0u2rff',
              },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  event: 'First Investment',
                  timestamp: '2020-09-28T19:53:31.900Z',
                  properties: { revenue: 20.37566, currency: 'EUR' },
                },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                'Content-Type': 'application/json',
                Authorization:
                  'Basic NDl1cjQ5MHJqZm8zNGdpMDR5MzhyOWdvOm44OWczODl5cjM4OWZnYmVmMHUycmZm',
              },
              version: '1',
              endpoint: 'https://api.engage.so/v1/users/1/events',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'engage',
    description:
      '[PAGE]: Send an Event with userId not inside externalID and no originalTimestamp and properties.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: { userId: 1, name: 'Contact Customer Care', category: 'Help', type: 'page' },
            destination: {
              Config: {
                publicKey: '49ur490rjfo34gi04y38r9go',
                privateKey: 'n89g389yr389fgbef0u2rff',
              },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                XML: {},
                FORM: {},
                JSON: { event: 'Viewed Help Contact Custom Page', properties: {} },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                'Content-Type': 'application/json',
                Authorization:
                  'Basic NDl1cjQ5MHJqZm8zNGdpMDR5MzhyOWdvOm44OWczODl5cjM4OWZnYmVmMHUycmZm',
              },
              version: '1',
              endpoint: 'https://api.engage.so/v1/users/1/events',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'engage',
    description:
      '[ GROUP ]: Group user with list with engageID given inside externalId and operation not given.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'user123',
              groupId: '17',
              context: {
                traits: { subscriberStatus: 'false' },
                externalId: [{ type: 'engageId', id: '246' }],
              },
              traits: { lastName: 'garwal' },
              type: 'group',
            },
            destination: {
              Config: {
                publicKey: '49ur490rjfo34gi04y38r9go',
                privateKey: 'n89g389yr389fgbef0u2rff',
                listIds: [
                  { listId: '9834trg3rgy3g08oi9893rgfb' },
                  { listId: 'f39487tyh49go3h093gh2if2f2' },
                ],
              },
            },
          },
        ],
        method: 'POST',
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
              endpoint: 'https://api.engage.so/v1/lists/17/subscribers/246',
              headers: {
                'Content-Type': 'application/json',
                Authorization:
                  'Basic NDl1cjQ5MHJqZm8zNGdpMDR5MzhyOWdvOm44OWczODl5cjM4OWZnYmVmMHUycmZm',
              },
              params: {},
              body: { JSON: { subscribed: 'false' }, JSON_ARRAY: {}, XML: {}, FORM: {} },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'engage',
    description: '[ GROUP ]:No ExternalId and operation as remove.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              groupId: '17',
              traits: { lastName: 'garwal', operation: 'remove', email: 'abc@xyz.com' },
              type: 'group',
            },
            destination: {
              Config: {
                publicKey: '49ur490rjfo34gi04y38r9go',
                privateKey: 'n89g389yr389fgbef0u2rff',
                listIds: [
                  { listId: '9834trg3rgy3g08oi9893rgfb' },
                  { listId: 'f39487tyh49go3h093gh2if2f2' },
                ],
              },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'engageID is required for remove operation.',
            statTags: {
              destType: 'ENGAGE',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'engage',
    description: '[ GROUP ]: Create or update user with payload and link it with list.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              groupId: '17',
              traits: {
                lastName: 'Agarwal',
                firstName: 'Lalu',
                email: 'lalu@xyz.com',
                phone: '634189314',
                customField: 'customValue',
              },
              type: 'group',
            },
            destination: {
              Config: {
                publicKey: '49ur490rjfo34gi04y38r9go',
                privateKey: 'n89g389yr389fgbef0u2rff',
                listIds: [
                  { listId: '9834trg3rgy3g08oi9893rgfb' },
                  { listId: 'f39487tyh49go3h093gh2if2f2' },
                ],
              },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  meta: { customField: 'customValue' },
                  email: 'lalu@xyz.com',
                  number: '634189314',
                  last_name: 'Agarwal',
                  first_name: 'Lalu',
                  subscribed: true,
                },
                JSON_ARRAY: {},
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                'Content-Type': 'application/json',
                Authorization:
                  'Basic NDl1cjQ5MHJqZm8zNGdpMDR5MzhyOWdvOm44OWczODl5cjM4OWZnYmVmMHUycmZm',
              },
              version: '1',
              endpoint: 'https://api.engage.so/v1/lists/17/subscribers',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'engage',
    description: '[ GROUP ]: Remove user from List with externalID.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            anonymousId: 3,
            message: {
              context: { externalId: [{ type: 'engageId', id: '1' }] },
              userId: 'user123',
              groupId: '17',
              traits: { operation: 'remove' },
              type: 'group',
            },
            destination: {
              Config: {
                publicKey: '49ur490rjfo34gi04y38r9go',
                privateKey: 'n89g389yr389fgbef0u2rff',
                listIds: [
                  { listId: '9834trg3rgy3g08oi9893rgfb' },
                  { listId: 'f39487tyh49go3h093gh2if2f2' },
                ],
              },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: { XML: {}, FORM: {}, JSON: { subscribed: true }, JSON_ARRAY: {} },
              type: 'REST',
              files: {},
              method: 'DELETE',
              params: {},
              headers: {
                'Content-Type': 'application/json',
                Authorization:
                  'Basic NDl1cjQ5MHJqZm8zNGdpMDR5MzhyOWdvOm44OWczODl5cjM4OWZnYmVmMHUycmZm',
              },
              version: '1',
              endpoint: 'https://api.engage.so/v1/lists/17/subscribers/1',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
