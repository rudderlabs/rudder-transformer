import { generateMetadata } from '../../../testUtils';
import { destType, destination, properties, runtimeEnvironment } from '../common';

export const track = [
  {
    id: 'Wunderkind-track-test-1',
    name: destType,
    description: 'Track call: custom event srp-screen-view',
    scenario: 'Framework+Business',
    successCriteria:
      'Response should contain the input payload with request level properties mapped from integration object `lambdaRootLevelProperties` field and  event level properties mapping from integration object `extraEventProperties` field and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              event: 'srp-screen-view',
              type: 'track',
              userId: 'test_123',
              context: {
                traits: {
                  firstName: 'john',
                  lastName: 'doe',
                },
              },
              integrations: {
                Wunderkind: {
                  extraEventProperties: {
                    screen_name: 'shopping/vehicle-details',
                    type: 'custom_event',
                    id: '1393f120-53b8-4126-8deb-874c26b5b06d',
                    timestamp_ms: 1703685306737,
                    source_id: 'test-source-id',
                    session_id: 1688982077105114764,
                    name: 'srp-screen-view',
                    custom_event_type: 'other',
                  },
                  lambdaRootLevelProperties: {
                    type: 'event_processing_request',
                    id: 'a2a5575b-d3b0-4a14-96a5-79f8e38b0778',
                    timestamp_ms: 1718893923387,
                    source_id: 'test-source-id',
                    source_channel: 'native',
                    device_application_stamp: 'test-device-application-stamp',
                    user_identities: [
                      {
                        type: 'customer',
                        encoding: 'raw',
                        value: 'eb3f565d-49bd-418c-ae31-801f25da0ce2',
                      },
                      {
                        type: 'email',
                        encoding: 'raw',
                        value: 'johndoe@gmail.com',
                      },
                      {
                        type: 'other',
                        encoding: 'raw',
                        value: '7c2c3abd-62bf-473e-998d-034df0f25ea3',
                      },
                    ],
                    user_attribute_lists: {},
                    runtime_environment: runtimeEnvironment,
                  },
                },
              },
              properties,
            },
            metadata: generateMetadata(1),
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
              payload: JSON.stringify({
                account: {
                  account_id: 'test-account-id',
                  account_settings: { instance_id: 'test-instance-id', key: 'test-api-key' },
                },
                type: 'event_processing_request',
                id: 'a2a5575b-d3b0-4a14-96a5-79f8e38b0778',
                timestamp_ms: 1718893923387,
                source_id: 'test-source-id',
                source_channel: 'native',
                device_application_stamp: 'test-device-application-stamp',
                user_identities: [
                  {
                    type: 'customer',
                    encoding: 'raw',
                    value: 'eb3f565d-49bd-418c-ae31-801f25da0ce2',
                  },
                  { type: 'email', encoding: 'raw', value: 'johndoe@gmail.com' },
                  { type: 'other', encoding: 'raw', value: '7c2c3abd-62bf-473e-998d-034df0f25ea3' },
                ],
                user_attribute_lists: {},
                runtime_environment: runtimeEnvironment,
                user_attributes: { firstName: 'john', lastName: 'doe' },
                events: [
                  {
                    screen_name: 'shopping/vehicle-details',
                    type: 'custom_event',
                    id: '1393f120-53b8-4126-8deb-874c26b5b06d',
                    timestamp_ms: 1703685306737,
                    source_id: 'test-source-id',
                    session_id: 1688982077105115000,
                    name: 'srp-screen-view',
                    custom_event_type: 'other',
                    attributes: properties,
                  },
                ],
              }),
              userId: '',
            },
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'Wunderkind-track-test-2',
    name: destType,
    description: 'Track call: screen_view event',
    scenario: 'Framework+Business',
    successCriteria:
      'Response should contain the input payload with request level properties mapped from integration object `lambdaRootLevelProperties` field and  event level properties mapping from integration object `extraEventProperties` field and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              event: 'screen_view',
              type: 'track',
              userId: 'test_123',
              context: {
                traits: {
                  firstName: 'john',
                  lastName: 'doe',
                },
              },
              integrations: {
                Wunderkind: {
                  extraEventProperties: {
                    type: 'screen_view',
                    id: '1393f120-53b8-4126-8deb-874c26b5b06d',
                    timestamp_ms: 1703685306737,
                    source_id: 'test-source-id',
                    session_id: 1688982077105114764,
                    screen_name: 'shopping/vehicle-details',
                  },
                  lambdaRootLevelProperties: {
                    type: 'event_processing_request',
                    id: 'a2a5575b-d3b0-4a14-96a5-79f8e38b0778',
                    timestamp_ms: 1718893923387,
                    source_id: 'test-source-id',
                    source_channel: 'native',
                    device_application_stamp: 'test-device-application-stamp',
                    user_identities: [
                      {
                        type: 'customer',
                        encoding: 'raw',
                        value: 'eb3f565d-49bd-418c-ae31-801f25da0ce2',
                      },
                      {
                        type: 'email',
                        encoding: 'raw',
                        value: 'johndoe@gmail.com',
                      },
                      {
                        type: 'other',
                        encoding: 'raw',
                        value: '7c2c3abd-62bf-473e-998d-034df0f25ea3',
                      },
                    ],
                    user_attribute_lists: {},
                    runtime_environment: runtimeEnvironment,
                  },
                },
              },
              properties,
            },
            metadata: generateMetadata(1),
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
              payload: JSON.stringify({
                account: {
                  account_id: 'test-account-id',
                  account_settings: {
                    instance_id: 'test-instance-id',
                    key: 'test-api-key',
                  },
                },
                type: 'event_processing_request',
                id: 'a2a5575b-d3b0-4a14-96a5-79f8e38b0778',
                timestamp_ms: 1718893923387,
                source_id: 'test-source-id',
                source_channel: 'native',
                device_application_stamp: 'test-device-application-stamp',
                user_identities: [
                  {
                    type: 'customer',
                    encoding: 'raw',
                    value: 'eb3f565d-49bd-418c-ae31-801f25da0ce2',
                  },
                  {
                    type: 'email',
                    encoding: 'raw',
                    value: 'johndoe@gmail.com',
                  },
                  {
                    type: 'other',
                    encoding: 'raw',
                    value: '7c2c3abd-62bf-473e-998d-034df0f25ea3',
                  },
                ],
                user_attribute_lists: {},
                runtime_environment: runtimeEnvironment,
                user_attributes: {
                  firstName: 'john',
                  lastName: 'doe',
                },
                events: [
                  {
                    type: 'screen_view',
                    id: '1393f120-53b8-4126-8deb-874c26b5b06d',
                    timestamp_ms: 1703685306737,
                    source_id: 'test-source-id',
                    session_id: 1688982077105115000,
                    screen_name: 'shopping/vehicle-details',
                    attributes: properties,
                  },
                ],
              }),
              userId: '',
            },
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
