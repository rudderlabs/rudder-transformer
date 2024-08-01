import crypto from 'crypto';

const buf = Buffer.from('5398e214ae99c2e50afb709a3bc423f9', 'hex');

export const mockFns = (_) => {
  // @ts-ignore
  jest.spyOn(Date.prototype, 'toISOString').mockReturnValueOnce('2023-10-14T00:00:00.000Z');
  // @ts-ignore
  jest.spyOn(crypto, 'randomBytes').mockReturnValue(buf);
};

const comonHeader = {
  Accept: 'application/json',
  'Content-Type': 'application/json',

  'X-WSSE':
    'UsernameToken Username="dummy", PasswordDigest="MjEzMDY5ZmI3NjMwNzE1N2M1ZTI5MWMzMzI3ODQxNDU2YWM4NTI3YQ==", Nonce="5398e214ae99c2e50afb709a3bc423f9", Created="2023-10-14T00:00:00.000Z"',
};

export const data = [
  {
    name: 'emarsys',
    description: 'Test 1 : Track call custom identifier mapped from destination config ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {},
            message: {
              event: 'Order Completed',
              anonymousId: 'anonId06',
              channel: 'web',
              context: {
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                traits: {
                  email: 'abc@gmail.com',
                  lastName: 'Doe',
                  firstName: 'John',
                },
              },
              integrations: {
                All: true,
                EMARSYS: {
                  trigger_id: 'EVENT_TRIGGER_ID',
                },
              },
              properties: {
                company: 'testComp',
                data: {
                  section_group1: [
                    {
                      section_variable1: 'some_value',
                      section_variable2: 'another_value',
                    },
                    {
                      section_variable1: 'yet_another_value',
                      section_variable2: 'one_more_value',
                    },
                  ],
                  global: {
                    global_variable1: 'global_value',
                    global_variable2: 'another_global_value',
                  },
                },
                attachment: [
                  {
                    filename: 'example.pdf',
                    data: 'ZXhhbXBsZQo=',
                  },
                ],
              },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2023-07-06T11:59:02.402+05:30',
              type: 'track',
              userId: 'userId06',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                discardEmptyProperties: true,
                emersysUsername: 'dummy',
                emersysUserSecret: 'dummy',
                emersysCustomIdentifier: '3',
                defaultContactList: 'dummy',
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                ],
                fieldMapping: [
                  {
                    rudderProperty: 'email',
                    emersysProperty: '3',
                  },
                ],
                oneTrustCookieCategories: [
                  {
                    oneTrustCookieCategory: 'Marketing',
                  },
                ],
              },
            },
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
              endpoint: 'https://api.emarsys.net/api/v2/event/purchase/trigger',
              headers: comonHeader,
              params: {},
              body: {
                JSON: {
                  eventType: 'track',
                  destinationPayload: {
                    payload: {
                      key_id: '3',
                      external_id: 'abc@gmail.com',
                      trigger_id: 'EVENT_TRIGGER_ID',
                      data: {
                        section_group1: [
                          {
                            section_variable1: 'some_value',
                            section_variable2: 'another_value',
                          },
                          {
                            section_variable1: 'yet_another_value',
                            section_variable2: 'one_more_value',
                          },
                        ],
                        global: {
                          global_variable1: 'global_value',
                          global_variable2: 'another_global_value',
                        },
                      },
                      attachment: [
                        {
                          filename: 'example.pdf',
                          data: 'ZXhhbXBsZQo=',
                        },
                      ],
                      event_time: '2023-07-06T11:59:02.402+05:30',
                    },
                    eventId: 'purchase',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {},
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'emarsys',
    description:
      'Test 2 : Track call custom identifier mapped from destination config with custom field',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {},
            message: {
              event: 'Order Completed',
              anonymousId: 'anonId06',
              channel: 'web',
              context: {
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                traits: {
                  email: 'abc@gmail.com',
                  lastName: 'Doe',
                  firstName: 'John',
                  custom_field: 'value',
                },
              },
              integrations: {
                All: true,
                EMARSYS: {
                  trigger_id: 'EVENT_TRIGGER_ID',
                  customIdentifierId: 'custom_id',
                },
              },
              properties: {
                company: 'testComp',
                data: {
                  section_group1: [
                    {
                      section_variable1: 'some_value',
                      section_variable2: 'another_value',
                    },
                    {
                      section_variable1: 'yet_another_value',
                      section_variable2: 'one_more_value',
                    },
                  ],
                  global: {
                    global_variable1: 'global_value',
                    global_variable2: 'another_global_value',
                  },
                },
                attachment: [
                  {
                    filename: 'example.pdf',
                    data: 'ZXhhbXBsZQo=',
                  },
                ],
              },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2023-07-06T11:59:02.402+05:30',
              type: 'track',
              userId: 'userId06',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                discardEmptyProperties: true,
                emersysUsername: 'dummy',
                emersysUserSecret: 'dummy',
                emersysCustomIdentifier: '3',
                defaultContactList: 'dummy',
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                ],
                fieldMapping: [
                  {
                    rudderProperty: 'email',
                    emersysProperty: '3',
                  },
                  {
                    rudderProperty: 'custom_field',
                    emersysProperty: 'custom_id',
                  },
                ],
                oneTrustCookieCategories: [
                  {
                    oneTrustCookieCategory: 'Marketing',
                  },
                ],
              },
            },
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
              endpoint: 'https://api.emarsys.net/api/v2/event/purchase/trigger',
              headers: comonHeader,
              params: {},
              body: {
                JSON: {
                  eventType: 'track',
                  destinationPayload: {
                    payload: {
                      key_id: 'custom_id',
                      external_id: 'value',
                      trigger_id: 'EVENT_TRIGGER_ID',
                      data: {
                        section_group1: [
                          {
                            section_variable1: 'some_value',
                            section_variable2: 'another_value',
                          },
                          {
                            section_variable1: 'yet_another_value',
                            section_variable2: 'one_more_value',
                          },
                        ],
                        global: {
                          global_variable1: 'global_value',
                          global_variable2: 'another_global_value',
                        },
                      },
                      attachment: [
                        {
                          filename: 'example.pdf',
                          data: 'ZXhhbXBsZQo=',
                        },
                      ],
                      event_time: '2023-07-06T11:59:02.402+05:30',
                    },
                    eventId: 'purchase',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {},
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'emarsys',
    description: 'Test 3: Track call with trigger id mapped from integrations object',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {},
            message: {
              event: 'Order Completed',
              anonymousId: 'anonId06',
              channel: 'web',
              context: {
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                traits: {
                  email: 'abc@gmail.com',
                  lastName: 'Doe',
                  firstName: 'John',
                  custom_field: 'value',
                },
              },
              integrations: {
                All: true,
                EMARSYS: {
                  trigger_id: 'EVENT_TRIGGER_ID',
                },
              },
              properties: {
                company: 'testComp',
                data: {
                  section_group1: [
                    {
                      section_variable1: 'some_value',
                      section_variable2: 'another_value',
                    },
                    {
                      section_variable1: 'yet_another_value',
                      section_variable2: 'one_more_value',
                    },
                  ],
                  global: {
                    global_variable1: 'global_value',
                    global_variable2: 'another_global_value',
                  },
                },
                attachment: [
                  {
                    filename: 'example.pdf',
                    data: 'ZXhhbXBsZQo=',
                  },
                ],
              },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2023-07-06T11:59:02.402+05:30',
              type: 'track',
              userId: 'userId06',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                discardEmptyProperties: true,
                emersysUsername: 'dummy',
                emersysUserSecret: 'dummy',
                emersysCustomIdentifier: '',
                defaultContactList: 'dummy',
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                ],
                fieldMapping: [
                  {
                    rudderProperty: 'email',
                    emersysProperty: '3',
                  },
                  {
                    rudderProperty: 'custom_field',
                    emersysProperty: 'custom_id',
                  },
                ],
                oneTrustCookieCategories: [
                  {
                    oneTrustCookieCategory: 'Marketing',
                  },
                ],
              },
            },
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
              endpoint: 'https://api.emarsys.net/api/v2/event/purchase/trigger',
              headers: comonHeader,
              params: {},
              body: {
                JSON: {
                  eventType: 'track',
                  destinationPayload: {
                    payload: {
                      key_id: 3,
                      external_id: 'abc@gmail.com',
                      trigger_id: 'EVENT_TRIGGER_ID',
                      data: {
                        section_group1: [
                          {
                            section_variable1: 'some_value',
                            section_variable2: 'another_value',
                          },
                          {
                            section_variable1: 'yet_another_value',
                            section_variable2: 'one_more_value',
                          },
                        ],
                        global: {
                          global_variable1: 'global_value',
                          global_variable2: 'another_global_value',
                        },
                      },
                      attachment: [
                        {
                          filename: 'example.pdf',
                          data: 'ZXhhbXBsZQo=',
                        },
                      ],
                      event_time: '2023-07-06T11:59:02.402+05:30',
                    },
                    eventId: 'purchase',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {},
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'emarsys',
    description: 'Test 4 : group call with default external id email ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {},
            message: {
              anonymousId: 'anonId06',
              channel: 'web',
              context: {
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                traits: {
                  email: 'abc@gmail.com',
                  lastName: 'Doe',
                  firstName: 'John',
                },
              },
              integrations: {
                All: true,
              },
              traits: {
                company: 'testComp',
              },
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2023-07-06T11:59:02.402+05:30',
              type: 'group',
              userId: 'userId06',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                discardEmptyProperties: true,
                emersysUsername: 'dummy',
                emersysUserSecret: 'dummy',
                emersysCustomIdentifier: '',
                defaultContactList: 'dummy',
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                ],
                fieldMapping: [
                  {
                    rudderProperty: 'email',
                    emersysProperty: '3',
                  },
                  {
                    rudderProperty: 'custom_field',
                    emersysProperty: 'custom_id',
                  },
                ],
                oneTrustCookieCategories: [
                  {
                    oneTrustCookieCategory: 'Marketing',
                  },
                ],
              },
            },
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
              endpoint: 'https://api.emarsys.net/api/v2/contactlist/dummy/add',
              headers: comonHeader,
              params: {},
              body: {
                JSON: {
                  eventType: 'group',
                  destinationPayload: {
                    payload: {
                      key_id: 3,
                      external_ids: ['abc@gmail.com'],
                    },
                    contactListId: 'dummy',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {},
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'emarsys',
    description: 'Test 5 : group call, custom identifier id mapped from integration object',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {},
            message: {
              anonymousId: 'anonId06',
              channel: 'web',
              context: {
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                traits: {
                  email: 'abc@gmail.com',
                  lastName: 'Doe',
                  firstName: 'John',
                  custom_field: 'value',
                },
              },
              integrations: {
                All: true,
                EMARSYS: {
                  customIdentifierId: 'custom_id',
                },
              },
              traits: {
                company: 'testComp',
              },
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2023-07-06T11:59:02.402+05:30',
              type: 'group',
              userId: 'userId06',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                discardEmptyProperties: true,
                emersysUsername: 'dummy',
                emersysUserSecret: 'dummy',
                emersysCustomIdentifier: '',
                defaultContactList: 'dummy',
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                ],
                fieldMapping: [
                  {
                    rudderProperty: 'email',
                    emersysProperty: '3',
                  },
                  {
                    rudderProperty: 'custom_field',
                    emersysProperty: 'custom_id',
                  },
                ],
                oneTrustCookieCategories: [
                  {
                    oneTrustCookieCategory: 'Marketing',
                  },
                ],
              },
            },
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
              endpoint: 'https://api.emarsys.net/api/v2/contactlist/dummy/add',
              headers: comonHeader,
              params: {},
              body: {
                JSON: {
                  eventType: 'group',
                  destinationPayload: {
                    payload: {
                      key_id: 'custom_id',
                      external_ids: ['value'],
                    },
                    contactListId: 'dummy',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {},
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'emarsys',
    description: 'Test 6 : custom identifier mapped from destination config',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {},
            message: {
              anonymousId: 'anonId06',
              channel: 'web',
              context: {
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                traits: {
                  email: 'abc@gmail.com',
                  lastName: 'Doe',
                  firstName: 'John',
                  custom_field: 'value',
                },
              },
              integrations: {
                All: true,
              },
              traits: {
                company: 'testComp',
              },
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2023-07-06T11:59:02.402+05:30',
              type: 'group',
              userId: 'userId06',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                discardEmptyProperties: true,
                emersysUsername: 'dummy',
                emersysUserSecret: 'dummy',
                emersysCustomIdentifier: '2',
                defaultContactList: 'dummy',
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                ],
                fieldMapping: [
                  {
                    rudderProperty: 'email',
                    emersysProperty: '3',
                  },
                  {
                    rudderProperty: 'lastName',
                    emersysProperty: '2',
                  },
                ],
                oneTrustCookieCategories: [
                  {
                    oneTrustCookieCategory: 'Marketing',
                  },
                ],
              },
            },
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
              endpoint: 'https://api.emarsys.net/api/v2/contactlist/dummy/add',
              headers: comonHeader,
              params: {},
              body: {
                JSON: {
                  eventType: 'group',
                  destinationPayload: {
                    payload: {
                      key_id: '2',
                      external_ids: ['Doe'],
                    },
                    contactListId: 'dummy',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {},
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'emarsys',
    description: 'Test 7 : Identify call with contact list id mapped from integrations objects',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {},
            message: {
              channel: 'web',
              context: {
                traits: {
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
                  'custom-field': 'value',
                },
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              event: 'product list viewed',
              userId: 'testuserId1',
              integrations: {
                All: true,
                EMARSYS: {
                  contactListId: 123,
                },
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                discardEmptyProperties: true,
                emersysUsername: 'dummy',
                emersysUserSecret: 'dummy',
                emersysCustomIdentifier: '2',
                defaultContactList: 'dummy',
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                ],
                fieldMapping: [
                  {
                    rudderProperty: 'email',
                    emersysProperty: '3',
                  },
                  {
                    rudderProperty: 'lastName',
                    emersysProperty: '2',
                  },
                  {
                    rudderProperty: 'custom-field',
                    emersysProperty: 'custom_id',
                  },
                ],
                oneTrustCookieCategories: [
                  {
                    oneTrustCookieCategory: 'Marketing',
                  },
                ],
              },
            },
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
              endpoint: 'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1',
              headers: comonHeader,
              params: {},
              body: {
                JSON: {
                  eventType: 'identify',
                  destinationPayload: {
                    key_id: '2',
                    contacts: [
                      {
                        '2': 'one',
                        '3': 'testone@gmail.com',
                        custom_id: 'value',
                      },
                    ],
                    contact_list_id: 123,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {},
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'emarsys',
    description: 'Test 8 : identify call customIdentifierId mapped from integration object',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {},
            message: {
              channel: 'web',
              context: {
                traits: {
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
                  'custom-field': 'value',
                },
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: 'testuserId1',
              integrations: {
                All: true,
                EMARSYS: {
                  customIdentifierId: '1',
                },
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                discardEmptyProperties: true,
                emersysUsername: 'dummy',
                emersysUserSecret: 'dummy',
                emersysCustomIdentifier: '2',
                defaultContactList: 'dummy',
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                ],
                fieldMapping: [
                  {
                    rudderProperty: 'email',
                    emersysProperty: '3',
                  },
                  {
                    rudderProperty: 'lastName',
                    emersysProperty: '2',
                  },
                  {
                    rudderProperty: 'firstName',
                    emersysProperty: '1',
                  },
                  {
                    rudderProperty: 'custom-field',
                    emersysProperty: 'custom_id',
                  },
                ],
                oneTrustCookieCategories: [
                  {
                    oneTrustCookieCategory: 'Marketing',
                  },
                ],
              },
            },
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
              endpoint: 'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1',
              headers: comonHeader,
              params: {},
              body: {
                JSON: {
                  eventType: 'identify',
                  destinationPayload: {
                    key_id: '1',
                    contacts: [
                      {
                        '1': 'test',
                        '2': 'one',
                        '3': 'testone@gmail.com',
                        custom_id: 'value',
                      },
                    ],
                    contact_list_id: 'dummy',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {},
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'emarsys',
    description: 'Test 9 : custom identifier mapped from default email value',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {},
            message: {
              channel: 'web',
              context: {
                traits: {
                  email: 'testone@gmail.com',
                  firstName: 'test',
                  lastName: 'one',
                  'custom-field': 'value',
                },
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: 'testuserId1',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                discardEmptyProperties: true,
                emersysUsername: 'dummy',
                emersysUserSecret: 'dummy',
                emersysCustomIdentifier: '',
                defaultContactList: 'dummy',
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                ],
                fieldMapping: [
                  {
                    rudderProperty: 'email',
                    emersysProperty: '3',
                  },
                  {
                    rudderProperty: 'lastName',
                    emersysProperty: '2',
                  },
                  {
                    rudderProperty: 'firstName',
                    emersysProperty: '1',
                  },
                  {
                    rudderProperty: 'custom-field',
                    emersysProperty: 'custom_id',
                  },
                ],
                oneTrustCookieCategories: [
                  {
                    oneTrustCookieCategory: 'Marketing',
                  },
                ],
              },
            },
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
              endpoint: 'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1',
              headers: comonHeader,
              params: {},
              body: {
                JSON: {
                  eventType: 'identify',
                  destinationPayload: {
                    key_id: 3,
                    contacts: [
                      {
                        '1': 'test',
                        '2': 'one',
                        '3': 'testone@gmail.com',
                        custom_id: 'value',
                      },
                    ],
                    contact_list_id: 'dummy',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {},
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'emarsys',
    description: 'Test 10 : identify call error for not finding custom identifier',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {},
            message: {
              channel: 'web',
              context: {
                traits: {
                  firstName: 'test',
                  lastName: 'one',
                  'custom-field': 'value',
                },
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: 'testuserId1',
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                discardEmptyProperties: true,
                emersysUsername: 'dummy',
                emersysUserSecret: 'dummy',
                emersysCustomIdentifier: '',
                defaultContactList: 'dummy',
                eventsMapping: [
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                  {
                    from: 'Order Completed',
                    to: 'purchase',
                  },
                ],
                fieldMapping: [
                  {
                    rudderProperty: 'email',
                    emersysProperty: '3',
                  },
                  {
                    rudderProperty: 'lastName',
                    emersysProperty: '2',
                  },
                  {
                    rudderProperty: 'firstName',
                    emersysProperty: '1',
                  },
                  {
                    rudderProperty: 'custom-field',
                    emersysProperty: 'custom_id',
                  },
                ],
                oneTrustCookieCategories: [
                  {
                    oneTrustCookieCategory: 'Marketing',
                  },
                ],
              },
            },
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
              'Either configured custom contact identifier value or default identifier email value is missing: Workflow: procWorkflow, Step: preparePayloadForIdentify, ChildStep: undefined, OriginalError: Either configured custom contact identifier value or default identifier email value is missing',
            metadata: {},
            statTags: {
              destType: 'EMARSYS',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'emarsys',
    description: 'Test 11 : Track call with no event mapping field should fail',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            metadata: {},
            message: {
              event: 'Order Completed',
              anonymousId: 'anonId06',
              channel: 'web',
              context: {
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
                traits: {
                  email: 'abc@gmail.com',
                  lastName: 'Doe',
                  firstName: 'John',
                },
              },
              integrations: {
                All: true,
                EMARSYS: {
                  trigger_id: 'EVENT_TRIGGER_ID',
                },
              },
              properties: {
                company: 'testComp',
                data: {
                  section_group1: [
                    {
                      section_variable1: 'some_value',
                      section_variable2: 'another_value',
                    },
                    {
                      section_variable1: 'yet_another_value',
                      section_variable2: 'one_more_value',
                    },
                  ],
                  global: {
                    global_variable1: 'global_value',
                    global_variable2: 'another_global_value',
                  },
                },
                attachment: [
                  {
                    filename: 'example.pdf',
                    data: 'ZXhhbXBsZQo=',
                  },
                ],
              },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2023-07-06T11:59:02.402+05:30',
              type: 'track',
              userId: 'userId06',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                  excludeKeys: [],
                  includeKeys: [],
                },
              },
              Config: {
                discardEmptyProperties: true,
                emersysUsername: 'dummy',
                emersysUserSecret: 'dummy',
                emersysCustomIdentifier: '3',
                defaultContactList: 'dummy',
                fieldMapping: [
                  {
                    rudderProperty: 'email',
                    emersysProperty: '3',
                  },
                ],
                oneTrustCookieCategories: [
                  {
                    oneTrustCookieCategory: 'Marketing',
                  },
                ],
              },
            },
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
              'Order Completed is not mapped to any Emersys external event. Aborting: Workflow: procWorkflow, Step: preparePayloadForTrack, ChildStep: undefined, OriginalError: Order Completed is not mapped to any Emersys external event. Aborting',
            metadata: {},
            statTags: {
              destType: 'EMARSYS',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
].map((d) => ({ ...d, mockFns }));
