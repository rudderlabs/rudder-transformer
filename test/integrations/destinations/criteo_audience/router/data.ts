export const data = [
  {
    name: 'criteo_audience',
    description: 'Event Stream test cases',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                  clientSecret: 'sjhdkhfrz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFR4rXQg',
                  audienceId: '34893',
                  audienceType: 'email',
                },
                ID: 'iwehr83843',
              },
              metadata: { secret: { accessToken: 'success_access_token' }, jobId: 1, userId: 'u1' },
              message: {
                userId: 'user 1',
                type: 'audiencelist',
                properties: {
                  listData: {
                    add: [
                      {
                        madid: 'sample_madid',
                        email: 'alex@email.com',
                        identityLink: 'text.com',
                        gum: 'sdjfds',
                      },
                      {
                        madid: 'sample_madid_1',
                        email: 'amy@email.com',
                        identityLink: 'yahoo.com',
                        gum: 'sdjfds',
                      },
                      {
                        madid: 'sample_madid_2',
                        email: 'van@email.com',
                        identityLink: 'abc.com',
                        gum: 'sdjfds',
                      },
                    ],
                  },
                },
                context: { ip: '14.5.67.21', library: { name: 'http' } },
                timestamp: '2020-02-02T00:23:09.544Z',
              },
            },
            {
              destination: {
                Config: {
                  clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                  clientSecret: 'sjhdkhfrz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFR4rXQg',
                  audienceId: '34893',
                  audienceType: 'madid',
                },
                ID: 'iwehr83843',
              },
              metadata: { secret: { accessToken: 'success_access_token' }, jobId: 2, userId: 'u1' },
              message: {
                userId: 'user 1',
                type: 'audiencelist',
                properties: {
                  listData: {
                    add: [
                      {
                        madid: 'sample_madid',
                        email: 'alex@email.com',
                        identityLink: 'text.com',
                        gum: 'sdjfds',
                      },
                      {
                        madid: 'sample_madid_1',
                        email: 'amy@email.com',
                        identityLink: 'yahoo.com',
                        gum: 'sdjfds',
                      },
                      {
                        madid: 'sample_madid_2',
                        email: 'van@email.com',
                        identityLink: 'abc.com',
                        gum: 'sdjfds',
                      },
                    ],
                    remove: [
                      {
                        madid: 'sample_madid',
                        email: 'alex@email.com',
                        identityLink: 'text.com',
                        gum: 'sdjfds',
                      },
                    ],
                  },
                },
                context: { ip: '14.5.67.21' },
                timestamp: '2020-02-02T00:23:09.544Z',
              },
            },
          ],
          destType: 'criteo_audience',
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
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'PATCH',
                  endpoint: 'https://api.criteo.com/2022-10/audiences/34893/contactlist',
                  headers: {
                    Authorization: 'Bearer success_access_token',
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                  },
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'ContactlistAmendment',
                        attributes: {
                          operation: 'add',
                          identifierType: 'email',
                          identifiers: ['alex@email.com', 'amy@email.com', 'van@email.com'],
                          internalIdentifiers: false,
                        },
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                { jobId: 1, secret: { accessToken: 'success_access_token' }, userId: 'u1' },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                  clientSecret: 'sjhdkhfrz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFR4rXQg',
                  audienceId: '34893',
                  audienceType: 'email',
                },
                ID: 'iwehr83843',
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'PATCH',
                  endpoint: 'https://api.criteo.com/2022-10/audiences/34893/contactlist',
                  headers: {
                    Authorization: 'Bearer success_access_token',
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                  },
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'ContactlistAmendment',
                        attributes: {
                          operation: 'add',
                          identifierType: 'madid',
                          identifiers: ['sample_madid', 'sample_madid_1', 'sample_madid_2'],
                          internalIdentifiers: false,
                        },
                      },
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
                  method: 'PATCH',
                  endpoint: 'https://api.criteo.com/2022-10/audiences/34893/contactlist',
                  headers: {
                    Authorization: 'Bearer success_access_token',
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                  },
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'ContactlistAmendment',
                        attributes: {
                          operation: 'remove',
                          identifierType: 'madid',
                          identifiers: ['sample_madid'],
                          internalIdentifiers: false,
                        },
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                { jobId: 2, secret: { accessToken: 'success_access_token' }, userId: 'u1' },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                  clientSecret: 'sjhdkhfrz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFR4rXQg',
                  audienceId: '34893',
                  audienceType: 'madid',
                },
                ID: 'iwehr83843',
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'criteo_audience',
    description: 'Retl test cases',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              "destination": {
                "Config": {
                  "clientId": "abcdef8-f49-4cd6-b4c5-958b3d66d431",
                  "clientSecret": "sjhdkhfrz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFR4rXQg",
                  "audienceId": "34893",
                  "audienceType": "email"
                },
                "ID": "iwehr83843"
              },
              "metadata": {
                "secret": {
                  "accessToken": "success_access_token"
                },
                "jobId": 1
              },
              "message": {
                "userId": "user 1",
                "type": "audiencelist",
                "properties": {
                  "listData": {
                    "add": [
                      {
                        "madid": "sample_madid",
                        "email": "alex@email.com",
                        "identityLink": "text.com",
                        "gum": "sdjfds"
                      },
                      {
                        "madid": "sample_madid_1",
                        "email": "amy@email.com",
                        "identityLink": "yahoo.com",
                        "gum": "sdjfds"
                      },
                      {
                        "madid": "sample_madid_2",
                        "email": "van@email.com",
                        "identityLink": "abc.com",
                        "gum": "sdjfds"
                      }
                    ]
                  }
                },
                "context": {
                  "externalId": [
                    {
                      "type": "CRITEO_AUDIENCE-23848494844100489",
                      "identifierType": "EMAIL"
                    }
                  ],
                  "mappedToDestination": "true",
                  "sources": {
                    "job_run_id": "cgiiurt8um7k7n5dq480",
                    "task_run_id": "cgiiurt8um7k7n5dq48g",
                    "job_id": "2MUWghI7u85n91dd1qzGyswpZan",
                    "version": "895/merge"
                  }
                },
                "timestamp": "2020-02-02T00:23:09.544Z"
              }
            },
            {
              "destination": {
                "Config": {
                  "clientId": "abcdef8-f49-4cd6-b4c5-958b3d66d431",
                  "clientSecret": "sjhdkhfrz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFR4rXQg",
                  "audienceType": "email",
                  "warehouse-adAccountId": "123"
                },
                "ID": "iwehr83843"
              },
              "metadata": {
                "secret": {
                  "accessToken": "success_access_token"
                },
                "jobId": 1
              },
              "message": {
                "userId": "user 1",
                "type": "audiencelist",
                "properties": {
                  "listData": {
                    "add": [
                      {
                        "madid": "sample_madid",
                        "email": "alex@email.com",
                        "identityLink": "text.com",
                        "gum": "sdjfds"
                      },
                      {
                        "madid": "sample_madid_1",
                        "email": "amy@email.com",
                        "identityLink": "yahoo.com",
                        "gum": "sdjfds"
                      },
                      {
                        "madid": "sample_madid_2",
                        "email": "van@email.com",
                        "identityLink": "abc.com",
                        "gum": "sdjfds"
                      }
                    ]
                  }
                },
                "context": {
                  "externalId": [
                    {
                      "type": "CRITEO_AUDIENCE-23848494844100489",
                      "identifierType": "EMAIL"
                    }
                  ],
                  "mappedToDestination": "true",
                  "sources": {
                    "job_run_id": "cgiiurt8um7k7n5dq480",
                    "task_run_id": "cgiiurt8um7k7n5dq48g",
                    "job_id": "2MUWghI7u85n91dd1qzGyswpZan",
                    "version": "895/merge"
                  }
                },
                "timestamp": "2020-02-02T00:23:09.544Z"
              }
            }
          ],
          destType: 'criteo_audience',
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
              "batchedRequest": [
                {
                  "version": "1",
                  "type": "REST",
                  "method": "PATCH",
                  "endpoint": "https://api.criteo.com/2022-10/audiences/34893/contactlist",
                  "headers": {
                    "Authorization": "Bearer success_access_token",
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                  },
                  "params": {},
                  "body": {
                    "JSON": {
                      "data": {
                        "type": "ContactlistAmendment",
                        "attributes": {
                          "operation": "add",
                          "identifierType": "email",
                          "identifiers": ["alex@email.com", "amy@email.com", "van@email.com"],
                          "internalIdentifiers": false
                        }
                      }
                    },
                    "JSON_ARRAY": {},
                    "XML": {},
                    "FORM": {}
                  },
                  "files": {}
                }
              ],
              "metadata": [
                {
                  "jobId": 1,
                  "secret": {
                    "accessToken": "success_access_token"
                  }
                }
              ],
              "batched": false,
              "statusCode": 200,
              "destination": {
                "Config": {
                  "clientId": "abcdef8-f49-4cd6-b4c5-958b3d66d431",
                  "clientSecret": "sjhdkhfrz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFR4rXQg",
                  "audienceId": "34893",
                  "audienceType": "email"
                },
                "ID": "iwehr83843"
              }
            },
            {
              "batchedRequest": [
                {
                  "version": "1",
                  "type": "REST",
                  "method": "PATCH",
                  "endpoint": "https://api.criteo.com/2022-10/audiences/23848494844100489/contactlist",
                  "headers": {
                    "Authorization": "Bearer success_access_token",
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                  },
                  "params": {},
                  "body": {
                    "JSON": {
                      "data": {
                        "type": "ContactlistAmendment",
                        "attributes": {
                          "operation": "add",
                          "identifierType": "email",
                          "identifiers": ["alex@email.com", "amy@email.com", "van@email.com"],
                          "internalIdentifiers": false
                        }
                      }
                    },
                    "JSON_ARRAY": {},
                    "XML": {},
                    "FORM": {}
                  },
                  "files": {}
                }
              ],
              "metadata": [
                {
                  "jobId": 1,
                  "secret": {
                    "accessToken": "success_access_token"
                  }
                }
              ],
              "batched": false,
              "statusCode": 200,
              "destination": {
                "Config": {
                  "clientId": "abcdef8-f49-4cd6-b4c5-958b3d66d431",
                  "clientSecret": "sjhdkhfrz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFR4rXQg",
                  "warehouse-adAccountId": "123",
                  "audienceType": "email"
                },
                "ID": "iwehr83843"
              }
            }
          ],
        },
      },
    },
  }
];
