import utils from '../../../../src/v0/util';
import { commonSourceConfigProperties, commonSourceDefinition } from './common';

const defaultMockFns = () => {
  jest.spyOn(utils, 'generateUUID').mockReturnValue('97fcd7b2-cc24-47d7-b776-057b7b199513');
};

export const data = [
  {
    name: 'braze',
    description: 'event mapping done in UI',
    module: 'source',
    version: 'v1',
    skipGo: 'Custom source config',
    input: {
      request: {
        body: [
          {
            event: {
              events: [
                {
                  event_type: 'users.messages.inappmessage.Click',
                  properties: {
                    device_model: 'samsung',
                  },
                  user: {
                    user_id: 'user_id',
                    external_user_id: 'externalUserId',
                  },
                },
              ],
            },
            source: {
              ID: '2hgvYyU5TYaFvVzBge6tF2UKoeG',
              OriginalID: '',
              Name: 'Braze source',
              SourceDefinition: commonSourceDefinition,
              Config: {
                customMapping: [
                  {
                    from: 'users.messages.inappmessage.Click',
                    to: 'In-App Message Clicked',
                  },
                ],
              },
              ...commonSourceConfigProperties,
            },
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
                  anonymousId: 'user_id',
                  context: {
                    device: {
                      model: 'samsung',
                    },
                    integration: {
                      name: 'Braze',
                    },
                    library: {
                      name: 'unknown',
                      version: 'unknown',
                    },
                  },
                  event: 'In-App Message Clicked',
                  integrations: {
                    Braze: false,
                  },
                  type: 'track',
                  userId: 'externalUserId',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'The event is not mapped in the UI',
    module: 'source',
    version: 'v1',

    input: {
      request: {
        body: [
          {
            event: {
              events: [
                {
                  event_type: 'users.messages.inappmessage.Click',
                  properties: {
                    device_model: 'samsung',
                  },
                  user: {
                    user_id: 'user_id',
                    external_user_id: 'externalUserId',
                  },
                },
              ],
            },
            source: {
              ID: '2hgvYyU5TYaFvVzBge6tF2UKoeG',
              OriginalID: '',
              Name: 'Braze source',
              SourceDefinition: commonSourceDefinition,
              Config: {
                customMapping: [
                  {
                    from: 'randomEvent',
                    to: 'In-App Message Clicked',
                  },
                ],
              },
              ...commonSourceConfigProperties,
            },
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
                  anonymousId: 'user_id',
                  context: {
                    device: {
                      model: 'samsung',
                    },
                    integration: {
                      name: 'Braze',
                    },
                    library: {
                      name: 'unknown',
                      version: 'unknown',
                    },
                  },
                  event: 'users.messages.inappmessage.Click',
                  integrations: {
                    Braze: false,
                  },
                  type: 'track',
                  userId: 'externalUserId',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'users.messages.inappmessage.Click event',
    module: 'source',
    version: 'v1',

    input: {
      request: {
        body: [
          {
            event: {
              events: [
                {
                  event_type: 'users.messages.inappmessage.Click',
                  id: 'a1234567-89ab-cdef-0123-456789abcdef',
                  time: 1607988752,
                  user: {
                    user_id: '0123456789abcdef01234567',
                    external_user_id: 'user_id',
                    device_id: 'fedcba87-6543-210f-edc-ba9876543210',
                    timezone: 'America/Chicago',
                  },
                  properties: {
                    app_id: '01234567-89ab-cdef-0123-456789abcdef',
                    campaign_id: '11234567-89ab-cdef-0123-456789abcdef',
                    campaign_name: 'Test Campaign',
                    message_variation_id: 'c1234567-89ab-cdef-0123-456789abcdef',
                    platform: 'android',
                    os_version: 'Android (N)',
                    device_model: 'Nexus 5X',
                    button_id: '0',
                    send_id: 'f123456789abcdef01234567',
                  },
                },
              ],
            },
            source: {
              ID: '2hgvYyU5TYaFvVzBge6tF2UKoeG',
              OriginalID: '',
              Name: 'Braze source',
              SourceDefinition: commonSourceDefinition,
              Config: {
                customMapping: [
                  {
                    from: 'randomEvent',
                    to: 'In-App Message Clicked',
                  },
                ],
              },
              ...commonSourceConfigProperties,
            },
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
                    integration: { name: 'Braze' },
                    device: {
                      id: 'fedcba87-6543-210f-edc-ba9876543210',
                      model: 'Nexus 5X',
                    },
                    timezone: 'America/Chicago',
                    os: { version: 'Android (N)', name: 'android' },
                  },
                  integrations: { Braze: false },
                  type: 'track',
                  event: 'users.messages.inappmessage.Click',
                  messageId: 'a1234567-89ab-cdef-0123-456789abcdef',
                  anonymousId: '0123456789abcdef01234567',
                  userId: 'user_id',
                  properties: {
                    app_id: '01234567-89ab-cdef-0123-456789abcdef',
                    campaign_id: '11234567-89ab-cdef-0123-456789abcdef',
                    campaign_name: 'Test Campaign',
                    message_variation_id: 'c1234567-89ab-cdef-0123-456789abcdef',
                    button_id: '0',
                    send_id: 'f123456789abcdef01234567',
                  },
                  timestamp: '2020-12-14T23:32:32.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'users.messages.pushnotification.Send event',
    module: 'source',
    version: 'v1',

    input: {
      request: {
        body: [
          {
            event: {
              events: [
                {
                  event_type: 'users.messages.pushnotification.Send',
                  id: 'a1234567-89ab-cdef-0123-456789abcdef',
                  time: 1477502783,
                  user: {
                    user_id: '0123456789abcdef01234567',
                    external_user_id: 'user_id',
                    device_id: 'fedcba87-6543-210f-edc-ba9876543210',
                    timezone: 'America/Chicago',
                  },
                  properties: {
                    app_id: '01234567-89ab-cdef-0123-456789abcdef',
                    platform: 'ios',
                    campaign_id: '11234567-89ab-cdef-0123-456789abcdef',
                    campaign_name: 'Test Campaign',
                    message_variation_id: 'c1234567-89ab-cdef-0123-456789abcdef',
                    send_id: 'f123456789abcdef01234567',
                    dispatch_id: '01234567-89ab-cdef-0123-456789abcdef',
                  },
                },
              ],
            },
            source: {
              ID: '2hgvYyU5TYaFvVzBge6tF2UKoeG',
              OriginalID: '',
              Name: 'Braze source',
              SourceDefinition: commonSourceDefinition,
              Config: {
                customMapping: [
                  {
                    from: 'randomEvent',
                    to: 'In-App Message Clicked',
                  },
                ],
              },
              ...commonSourceConfigProperties,
            },
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
                    integration: { name: 'Braze' },
                    device: { id: 'fedcba87-6543-210f-edc-ba9876543210' },
                    timezone: 'America/Chicago',
                    os: { name: 'ios' },
                  },
                  integrations: { Braze: false },
                  type: 'track',
                  event: 'users.messages.pushnotification.Send',
                  messageId: 'a1234567-89ab-cdef-0123-456789abcdef',
                  anonymousId: '0123456789abcdef01234567',
                  userId: 'user_id',
                  properties: {
                    app_id: '01234567-89ab-cdef-0123-456789abcdef',
                    campaign_id: '11234567-89ab-cdef-0123-456789abcdef',
                    campaign_name: 'Test Campaign',
                    message_variation_id: 'c1234567-89ab-cdef-0123-456789abcdef',
                    send_id: 'f123456789abcdef01234567',
                    dispatch_id: '01234567-89ab-cdef-0123-456789abcdef',
                  },
                  timestamp: '2016-10-26T17:26:23.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'users.messages.email.Open event',
    module: 'source',
    version: 'v1',

    input: {
      request: {
        body: [
          {
            event: {
              events: [
                {
                  event_type: 'users.messages.email.Open',
                  id: 'a1234567-89ab-cdef-0123-456789abcdef',
                  time: 1477502783,
                  user: {
                    user_id: '0123456789abcdef01234567',
                    external_user_id: 'user_id',
                    timezone: 'America/Chicago',
                  },
                  properties: {
                    campaign_id: '11234567-89ab-cdef-0123-456789abcdef',
                    campaign_name: 'Test Campaign',
                    dispatch_id: '12345qwert',
                    message_variation_id: 'c1234567-89ab-cdef-0123-456789abcdef',
                    email_address: 'test@test.com',
                    send_id: 'f123456789abcdef01234567',
                    user_agent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
                  },
                },
              ],
            },
            source: {
              ID: '2hgvYyU5TYaFvVzBge6tF2UKoeG',
              OriginalID: '',
              Name: 'Braze source',
              SourceDefinition: commonSourceDefinition,
              Config: {
                customMapping: [
                  {
                    from: 'randomEvent',
                    to: 'In-App Message Clicked',
                  },
                ],
              },
              ...commonSourceConfigProperties,
            },
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
                    integration: { name: 'Braze' },
                    timezone: 'America/Chicago',
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
                  },
                  integrations: { Braze: false },
                  type: 'track',
                  event: 'users.messages.email.Open',
                  messageId: 'a1234567-89ab-cdef-0123-456789abcdef',
                  anonymousId: '0123456789abcdef01234567',
                  userId: 'user_id',
                  traits: { email: 'test@test.com' },
                  properties: {
                    campaign_id: '11234567-89ab-cdef-0123-456789abcdef',
                    campaign_name: 'Test Campaign',
                    dispatch_id: '12345qwert',
                    message_variation_id: 'c1234567-89ab-cdef-0123-456789abcdef',
                    send_id: 'f123456789abcdef01234567',
                  },
                  timestamp: '2016-10-26T17:26:23.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'users.messages.sms.Delivery send',
    module: 'source',
    version: 'v1',

    input: {
      request: {
        body: [
          {
            event: {
              events: [
                {
                  event_type: 'users.messages.sms.Delivery',
                  id: 'a1234567-89ab-cdef-0123-456789abcdef',
                  time: 1477502783,
                  user: {
                    user_id: '0123456789abcdef01234567',
                    external_user_id: 'user_id',
                    timezone: 'America/Chicago',
                  },
                  properties: {
                    campaign_id: '11234567-89ab-cdef-0123-456789abcdef',
                    campaign_name: 'Test Campaign',
                    dispatch_id: '12345qwert',
                    message_variation_id: 'c1234567-89ab-cdef-0123-456789abcdef',
                    to_phone_number: '+16462345678',
                    subscription_group_id: '41234567-89ab-cdef-0123-456789abcdef',
                    from_phone_number: '+12123470922',
                  },
                },
              ],
            },
            source: {
              ID: '2hgvYyU5TYaFvVzBge6tF2UKoeG',
              OriginalID: '',
              Name: 'Braze source',
              SourceDefinition: commonSourceDefinition,
              Config: {
                customMapping: [
                  {
                    from: 'randomEvent',
                    to: 'In-App Message Clicked',
                  },
                ],
              },
              ...commonSourceConfigProperties,
            },
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
                    timezone: 'America/Chicago',
                    integration: { name: 'Braze' },
                  },
                  integrations: { Braze: false },
                  type: 'track',
                  event: 'users.messages.sms.Delivery',
                  messageId: 'a1234567-89ab-cdef-0123-456789abcdef',
                  anonymousId: '0123456789abcdef01234567',
                  userId: 'user_id',
                  traits: { phone: '+16462345678' },
                  properties: {
                    campaign_id: '11234567-89ab-cdef-0123-456789abcdef',
                    campaign_name: 'Test Campaign',
                    dispatch_id: '12345qwert',
                    message_variation_id: 'c1234567-89ab-cdef-0123-456789abcdef',
                    subscription_group_id: '41234567-89ab-cdef-0123-456789abcdef',
                    from_phone_number: '+12123470922',
                  },
                  timestamp: '2016-10-26T17:26:23.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'users.messages.inappmessage.Click event',
    module: 'source',
    version: 'v1',

    input: {
      request: {
        body: [
          {
            event: {
              events: [
                {
                  event_type: 'users.messages.inappmessage.Click',
                  id: 'a1234567-89ab-cdef-0123-456789abcdef',
                  time: 1477502783,
                  user: {
                    user_id: '0123456789abcdef01234567',
                    external_user_id: 'user_id',
                    device_id: 'fedcba87-6543-210f-edc-ba9876543210',
                    timezone: 'America/Chicago',
                  },
                  properties: {
                    app_id: '01234567-89ab-cdef-0123-456789abcdef',
                    canvas_id: '11234567-89ab-cdef-0123-456789abcdef',
                    canvas_name: 'My Cool Campaign',
                    canvas_variation_id: '31234567-89ab-cdef-0123-456789abcdef',
                    canvas_step_id: '41234567-89ab-cdef-0123-456789abcdef',
                    platform: 'android',
                    os_version: 'Android (N)',
                    device_model: 'Nexus 5X',
                    button_id: '0',
                    send_id: 'f123456789abcdef01234567',
                  },
                },
              ],
            },
            source: {
              ID: '2hgvYyU5TYaFvVzBge6tF2UKoeG',
              OriginalID: '',
              Name: 'Braze source',
              SourceDefinition: commonSourceDefinition,
              Config: {
                customMapping: [
                  {
                    from: 'randomEvent',
                    to: 'In-App Message Clicked',
                  },
                ],
              },
              ...commonSourceConfigProperties,
            },
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
                    integration: { name: 'Braze' },
                    device: {
                      id: 'fedcba87-6543-210f-edc-ba9876543210',
                      model: 'Nexus 5X',
                    },
                    timezone: 'America/Chicago',
                    os: { version: 'Android (N)', name: 'android' },
                  },
                  integrations: { Braze: false },
                  type: 'track',
                  event: 'users.messages.inappmessage.Click',
                  messageId: 'a1234567-89ab-cdef-0123-456789abcdef',
                  anonymousId: '0123456789abcdef01234567',
                  userId: 'user_id',
                  properties: {
                    app_id: '01234567-89ab-cdef-0123-456789abcdef',
                    canvas_id: '11234567-89ab-cdef-0123-456789abcdef',
                    canvas_name: 'My Cool Campaign',
                    canvas_variation_id: '31234567-89ab-cdef-0123-456789abcdef',
                    canvas_step_id: '41234567-89ab-cdef-0123-456789abcdef',
                    button_id: '0',
                    send_id: 'f123456789abcdef01234567',
                  },
                  timestamp: '2016-10-26T17:26:23.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'users.messages.pushnotification.Send event',
    module: 'source',
    version: 'v1',

    input: {
      request: {
        body: [
          {
            event: {
              events: [
                {
                  event_type: 'users.messages.pushnotification.Send',
                  id: 'a1234567-89ab-cdef-0123-456789abcdef',
                  time: 1477502783,
                  user: {
                    user_id: '0123456789abcdef01234567',
                    external_user_id: 'user_id',
                    device_id: 'fedcba87-6543-210f-edc-ba9876543210',
                    timezone: 'America/Chicago',
                  },
                  properties: {
                    app_id: '01234567-89ab-cdef-0123-456789abcdef',
                    platform: 'ios',
                    canvas_id: '11234567-89ab-cdef-0123-456789abcdef',
                    canvas_name: 'My Cool Campaign',
                    canvas_variation_id: '31234567-89ab-cdef-0123-456789abcdef',
                    canvas_step_id: '41234567-89ab-cdef-0123-456789abcdef',
                    send_id: 'f123456789abcdef01234567',
                    dispatch_id: '01234567-89ab-cdef-0123-456789abcdef',
                  },
                },
              ],
            },
            source: {
              ID: '2hgvYyU5TYaFvVzBge6tF2UKoeG',
              OriginalID: '',
              Name: 'Braze source',
              SourceDefinition: commonSourceDefinition,
              Config: {
                customMapping: [
                  {
                    from: 'randomEvent',
                    to: 'In-App Message Clicked',
                  },
                ],
              },
              ...commonSourceConfigProperties,
            },
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
                    integration: { name: 'Braze' },
                    device: { id: 'fedcba87-6543-210f-edc-ba9876543210' },
                    timezone: 'America/Chicago',
                    os: { name: 'ios' },
                  },
                  integrations: { Braze: false },
                  type: 'track',
                  event: 'users.messages.pushnotification.Send',
                  messageId: 'a1234567-89ab-cdef-0123-456789abcdef',
                  anonymousId: '0123456789abcdef01234567',
                  userId: 'user_id',
                  properties: {
                    app_id: '01234567-89ab-cdef-0123-456789abcdef',
                    canvas_id: '11234567-89ab-cdef-0123-456789abcdef',
                    canvas_name: 'My Cool Campaign',
                    canvas_variation_id: '31234567-89ab-cdef-0123-456789abcdef',
                    canvas_step_id: '41234567-89ab-cdef-0123-456789abcdef',
                    send_id: 'f123456789abcdef01234567',
                    dispatch_id: '01234567-89ab-cdef-0123-456789abcdef',
                  },
                  timestamp: '2016-10-26T17:26:23.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'users.messages.email.Open event',
    module: 'source',
    version: 'v1',

    input: {
      request: {
        body: [
          {
            event: {
              events: [
                {
                  event_type: 'users.messages.email.Open',
                  id: 'a1234567-89ab-cdef-0123-456789abcdef',
                  time: 1477502783,
                  user: {
                    user_id: '0123456789abcdef01234567',
                    external_user_id: 'user_id',
                    timezone: 'America/Chicago',
                  },
                  properties: {
                    canvas_id: '11234567-89ab-cdef-0123-456789abcdef',
                    canvas_name: 'My Cool Canvas',
                    canvas_variation_id: '31234567-89ab-cdef-0123-456789abcdef',
                    canvas_step_id: '41234567-89ab-cdef-0123-456789abcdef',
                    dispatch_id: '12345qwert',
                    email_address: 'test@test.com',
                    send_id: 'f123456789abcdef01234567',
                    user_agent:
                      'Mozilla/5.0(Macintosh;IntelMacOSX10_13_5)AppleWebKit/537.36(KHTML,likeGecko)Chrome/67.0.3396.99Safari/537.36',
                  },
                },
              ],
            },
            source: {
              ID: '2hgvYyU5TYaFvVzBge6tF2UKoeG',
              OriginalID: '',
              Name: 'Braze source',
              SourceDefinition: commonSourceDefinition,
              Config: {
                customMapping: [
                  {
                    from: 'randomEvent',
                    to: 'In-App Message Clicked',
                  },
                ],
              },
              ...commonSourceConfigProperties,
            },
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
                    integration: { name: 'Braze' },
                    timezone: 'America/Chicago',
                    userAgent:
                      'Mozilla/5.0(Macintosh;IntelMacOSX10_13_5)AppleWebKit/537.36(KHTML,likeGecko)Chrome/67.0.3396.99Safari/537.36',
                  },
                  integrations: { Braze: false },
                  type: 'track',
                  event: 'users.messages.email.Open',
                  messageId: 'a1234567-89ab-cdef-0123-456789abcdef',
                  anonymousId: '0123456789abcdef01234567',
                  userId: 'user_id',
                  traits: { email: 'test@test.com' },
                  properties: {
                    canvas_id: '11234567-89ab-cdef-0123-456789abcdef',
                    canvas_name: 'My Cool Canvas',
                    canvas_variation_id: '31234567-89ab-cdef-0123-456789abcdef',
                    canvas_step_id: '41234567-89ab-cdef-0123-456789abcdef',
                    dispatch_id: '12345qwert',
                    send_id: 'f123456789abcdef01234567',
                  },
                  timestamp: '2016-10-26T17:26:23.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'users.messages.sms.Delivery event',
    module: 'source',
    version: 'v1',

    input: {
      request: {
        body: [
          {
            event: {
              events: [
                {
                  event_type: 'users.messages.sms.Delivery',
                  id: 'a1234567-89ab-cdef-0123-456789abcdef',
                  time: 1477502783,
                  user: {
                    user_id: '0123456789abcdef01234567',
                    external_user_id: 'user_id',
                    timezone: 'America/Chicago',
                  },
                  properties: {
                    canvas_id: '11234567-89ab-cdef-0123-456789abcdef',
                    canvas_name: 'MyCoolCanvas',
                    canvas_variation_id: '31234567-89ab-cdef-0123-456789abcdef',
                    canvas_step_id: '41234567-89ab-cdef-0123-456789abcdef',
                    dispatch_id: '12345qwert',
                    to_phone_number: '+16462345678',
                    subscription_group_id: '41234567-89ab-cdef-0123-456789abcdef',
                    from_phone_number: '+12123470922',
                  },
                },
              ],
            },
            source: {
              ID: '2hgvYyU5TYaFvVzBge6tF2UKoeG',
              OriginalID: '',
              Name: 'Braze source',
              SourceDefinition: commonSourceDefinition,
              Config: {
                customMapping: [
                  {
                    from: 'randomEvent',
                    to: 'In-App Message Clicked',
                  },
                ],
              },
              ...commonSourceConfigProperties,
            },
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
                    timezone: 'America/Chicago',
                    integration: { name: 'Braze' },
                  },
                  integrations: { Braze: false },
                  type: 'track',
                  event: 'users.messages.sms.Delivery',
                  messageId: 'a1234567-89ab-cdef-0123-456789abcdef',
                  anonymousId: '0123456789abcdef01234567',
                  userId: 'user_id',
                  traits: { phone: '+16462345678' },
                  properties: {
                    canvas_id: '11234567-89ab-cdef-0123-456789abcdef',
                    canvas_name: 'MyCoolCanvas',
                    canvas_variation_id: '31234567-89ab-cdef-0123-456789abcdef',
                    canvas_step_id: '41234567-89ab-cdef-0123-456789abcdef',
                    dispatch_id: '12345qwert',
                    subscription_group_id: '41234567-89ab-cdef-0123-456789abcdef',
                    from_phone_number: '+12123470922',
                  },
                  timestamp: '2016-10-26T17:26:23.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'users.behaviors.CustomEvent any custom event',
    module: 'source',
    version: 'v1',

    input: {
      request: {
        body: [
          {
            event: {
              events: [
                {
                  event_type: 'users.behaviors.CustomEvent',
                  id: 'a1234567-89ab-cdef-0123-456789abcdef',
                  time: 1477502783,
                  user: {
                    user_id: '0123456789abcdef01234567',
                    external_user_id: 'user_id',
                    device_id: 'fedcba87-6543-210f-edc-ba9876543210',
                    timezone: 'America/Chicago',
                  },
                  properties: {
                    app_id: '01234567-89ab-cdef-0123-456789abcdef',
                    platform: 'ios',
                    os_version: 'iOS10.3.1',
                    device_model: 'iPhone7Plus',
                    name: 'customeventname',
                    ad_id: '01234567-89ab-cdef-0123-456789abcdef',
                    ad_id_type: 'roku_ad_id',
                    ad_tracking_enabled: true,
                    custom_properties: {
                      stringpropertyname: 'a',
                      numberpropertyname: 1,
                      listpropertyname: ['a', 'b'],
                    },
                  },
                },
              ],
            },
            source: {
              ID: '2hgvYyU5TYaFvVzBge6tF2UKoeG',
              OriginalID: '',
              Name: 'Braze source',
              SourceDefinition: commonSourceDefinition,
              Config: {
                customMapping: [
                  {
                    from: 'randomEvent',
                    to: 'In-App Message Clicked',
                  },
                ],
              },
              ...commonSourceConfigProperties,
            },
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
                    integration: { name: 'Braze' },
                    device: {
                      id: 'fedcba87-6543-210f-edc-ba9876543210',
                      model: 'iPhone7Plus',
                      advertisingId: '01234567-89ab-cdef-0123-456789abcdef',
                      adTrackingEnabled: true,
                    },
                    timezone: 'America/Chicago',
                    os: { version: 'iOS10.3.1', name: 'ios' },
                  },
                  integrations: { Braze: false },
                  type: 'track',
                  event: 'users.behaviors.CustomEvent',
                  messageId: 'a1234567-89ab-cdef-0123-456789abcdef',
                  anonymousId: '0123456789abcdef01234567',
                  userId: 'user_id',
                  properties: {
                    app_id: '01234567-89ab-cdef-0123-456789abcdef',
                    name: 'customeventname',
                    ad_id_type: 'roku_ad_id',
                    custom_properties: {
                      stringpropertyname: 'a',
                      numberpropertyname: 1,
                      listpropertyname: ['a', 'b'],
                    },
                  },
                  timestamp: '2016-10-26T17:26:23.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'users.behaviors.Purchase event',
    module: 'source',
    version: 'v1',

    input: {
      request: {
        body: [
          {
            event: {
              events: [
                {
                  event_type: 'users.behaviors.Purchase',
                  id: 'a1234567-89ab-cdef-0123-456789abcdef',
                  time: 1477502783,
                  user: {
                    user_id: '0123456789abcdef01234567',
                    external_user_id: 'user_id',
                    device_id: 'fedcba87-6543-210f-edc-ba9876543210',
                    timezone: 'America/Chicago',
                  },
                  properties: {
                    app_id: '01234567-89ab-cdef-0123-456789abcdef',
                    platform: 'ios',
                    os_version: 'iOS10.3.1',
                    device_model: 'iPhone7Plus',
                    product_id: '1234',
                    price: 12.34,
                    currency: 'AED',
                    ad_id: '01234567-89ab-cdef-0123-456789abcdef',
                    ad_id_type: 'roku_ad_id',
                    ad_tracking_enabled: true,
                    purchase_properties: {
                      stringpropertyname: 'a',
                      numberpropertyname: 1,
                      listpropertyname: ['a', 'b'],
                    },
                  },
                },
              ],
            },
            source: {
              ID: '2hgvYyU5TYaFvVzBge6tF2UKoeG',
              OriginalID: '',
              Name: 'Braze source',
              SourceDefinition: commonSourceDefinition,
              Config: {
                customMapping: [
                  {
                    from: 'randomEvent',
                    to: 'In-App Message Clicked',
                  },
                ],
              },
              ...commonSourceConfigProperties,
            },
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
                    integration: { name: 'Braze' },
                    device: {
                      id: 'fedcba87-6543-210f-edc-ba9876543210',
                      model: 'iPhone7Plus',
                      advertisingId: '01234567-89ab-cdef-0123-456789abcdef',
                      adTrackingEnabled: true,
                    },
                    timezone: 'America/Chicago',
                    os: { version: 'iOS10.3.1', name: 'ios' },
                  },
                  integrations: { Braze: false },
                  type: 'track',
                  event: 'users.behaviors.Purchase',
                  messageId: 'a1234567-89ab-cdef-0123-456789abcdef',
                  anonymousId: '0123456789abcdef01234567',
                  userId: 'user_id',
                  properties: {
                    app_id: '01234567-89ab-cdef-0123-456789abcdef',
                    product_id: '1234',
                    price: 12.34,
                    currency: 'AED',
                    ad_id_type: 'roku_ad_id',
                    purchase_properties: {
                      stringpropertyname: 'a',
                      numberpropertyname: 1,
                      listpropertyname: ['a', 'b'],
                    },
                  },
                  timestamp: '2016-10-26T17:26:23.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'users.behaviors.app.SessionStart event',
    module: 'source',
    version: 'v1',

    input: {
      request: {
        body: [
          {
            event: {
              events: [
                {
                  event_type: 'users.behaviors.app.SessionStart',
                  id: 'a1234567-89ab-cdef-0123-456789abcdef',
                  time: 1477502783,
                  user: {
                    user_id: '0123456789abcdef01234567',
                    external_user_id: 'user_id',
                    device_id: 'fedcba87-6543-210f-edc-ba9876543210',
                  },
                  properties: {
                    app_id: '01234567-89ab-cdef-0123-456789abcdef',
                    platform: 'ios',
                    os_version: 'iOS10.3.1',
                    device_model: 'iPhone7Plus',
                    session_id: 'b1234567-89ab-cdef-0123-456789abcdef',
                  },
                },
              ],
            },
            source: {
              ID: '2hgvYyU5TYaFvVzBge6tF2UKoeG',
              OriginalID: '',
              Name: 'Braze source',
              SourceDefinition: commonSourceDefinition,
              Config: {
                customMapping: [
                  {
                    from: 'randomEvent',
                    to: 'In-App Message Clicked',
                  },
                ],
              },
              ...commonSourceConfigProperties,
            },
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
                    integration: { name: 'Braze' },
                    device: {
                      id: 'fedcba87-6543-210f-edc-ba9876543210',
                      model: 'iPhone7Plus',
                    },
                    os: { version: 'iOS10.3.1', name: 'ios' },
                  },
                  integrations: { Braze: false },
                  type: 'track',
                  event: 'users.behaviors.app.SessionStart',
                  messageId: 'a1234567-89ab-cdef-0123-456789abcdef',
                  anonymousId: '0123456789abcdef01234567',
                  userId: 'user_id',
                  properties: {
                    app_id: '01234567-89ab-cdef-0123-456789abcdef',
                    session_id: 'b1234567-89ab-cdef-0123-456789abcdef',
                  },
                  timestamp: '2016-10-26T17:26:23.000Z',
                },
              ],
            },
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
