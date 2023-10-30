import { FEATURES } from '../../../../../src/v0/util/tags';

export const data = [
  {
    name: 'vero',
    description: 'Test 0',
    feature: FEATURES.ROUTER,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  authToken: 'testAuthToken',
                },
              },
              metadata: {
                jobId: 1,
              },
              message: {
                context: {
                  traits: {
                    email: 'user001@tech.com',
                  },
                },
                type: 'Identify',
                userId: 'user001',
              },
            },
          ],
          destType: 'vero',
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
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api.getvero.com/api/v2/users/track',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {
                      id: 'user001',
                      email: 'user001@tech.com',
                      data: {},
                      auth_token: 'testAuthToken',
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              destination: {
                Config: {
                  authToken: 'testAuthToken',
                },
              },
              metadata: [
                {
                  jobId: 1,
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
    name: 'vero',
    description: 'Test 1',
    feature: FEATURES.ROUTER,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  authToken: 'testAuthToken',
                },
              },
              metadata: {
                jobId: 2,
              },
              message: {
                context: {
                  traits: {
                    email: 'user002@tech.com',
                  },
                },
                type: 'Identify',
                anonymousId: 'b4ffheww8eisndbdjgdewifewfgerwibderv',
              },
            },
          ],
          destType: 'vero',
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
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api.getvero.com/api/v2/users/track',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {
                      id: 'b4ffheww8eisndbdjgdewifewfgerwibderv',
                      email: 'user002@tech.com',
                      data: {},
                      auth_token: 'testAuthToken',
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              destination: {
                Config: {
                  authToken: 'testAuthToken',
                },
              },
              metadata: [
                {
                  jobId: 2,
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
    name: 'vero',
    description: 'Test 2',
    feature: FEATURES.ROUTER,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  authToken: 'testAuthToken',
                },
              },
              metadata: {
                jobId: 3,
              },
              message: {
                context: {
                  traits: {
                    address: 'Caravela Beach Goa',
                    homwTown: 'Mawsynram',
                    email: 'user005@tech.com',
                  },
                },
                integrations: {
                  vero: {
                    tags: {
                      add: ['a', 'b'],
                    },
                  },
                },
                type: 'Identify',
                userId: 'fprediruser001',
              },
            },
          ],
          destType: 'vero',
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
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api.getvero.com/api/v2/users/track',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {
                      id: 'fprediruser001',
                      email: 'user005@tech.com',
                      data: {
                        address: 'Caravela Beach Goa',
                        homwTown: 'Mawsynram',
                      },
                      auth_token: 'testAuthToken',
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'PUT',
                  endpoint: 'https://api.getvero.com/api/v2/users/tags/edit',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {
                      auth_token: 'testAuthToken',
                      id: 'fprediruser001',
                      add: ['a', 'b'],
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              destination: {
                Config: {
                  authToken: 'testAuthToken',
                },
              },
              metadata: [
                {
                  jobId: 3,
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
    name: 'vero',
    description: 'Test 3',
    feature: FEATURES.ROUTER,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  authToken: 'testAuthToken',
                },
              },
              metadata: {
                jobId: 4,
              },
              message: {
                event: 'Random event with nonexisting userId and email',
                properties: {
                  movieWatched: 3,
                  gamesPlayed: 4,
                  email: 'eventIdn02@sample.com',
                },
                type: 'track',
                userId: 'eventIdn01',
              },
            },
          ],
          destType: 'vero',
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
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://api.getvero.com/api/v2/events/track',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {
                      identity: {
                        id: 'eventIdn01',
                        email: 'eventIdn02@sample.com',
                      },
                      event_name: 'Random event with nonexisting userId and email',
                      data: {
                        movieWatched: 3,
                        gamesPlayed: 4,
                        email: 'eventIdn02@sample.com',
                      },
                      auth_token: 'testAuthToken',
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              destination: {
                Config: {
                  authToken: 'testAuthToken',
                },
              },
              metadata: [
                {
                  jobId: 4,
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
