import { getBatchedRequest } from '../../../testUtils';

const destination = {
  ID: '1i3Em7GMU9xVEiDlZUN8c88BMS9',
  Name: 'ADJ',
  DestinationDefinition: {
    ID: '1i3DeZo6eSUKrS3KzDUqjbBPCDJ',
    Name: 'ADJ',
    DisplayName: 'Adjust',
    Config: {
      destConfig: {
        android: ['useNativeSDK'],
        defaultConfig: ['appToken', 'customMappings', 'delay', 'environment'],
        ios: ['useNativeSDK'],
        reactnative: ['useNativeSDK'],
      },
      excludeKeys: [],
      includeKeys: ['appToken', 'customMappings', 'delay'],
      supportedSourceTypes: ['android', 'ios', 'reactnative', 'cloud'],
    },
  },
  Config: {
    appToken: 'testAppToken',
    customMappings: [
      { from: 'Application Installed', to: '3fdmll' },
      { from: 'First Investment', to: 'testEventToken' },
    ],
    environment: true,
  },
  Enabled: true,
  Transformations: [],
  IsProcessorEnabled: true,
};

export const data = [
  {
    name: 'adj',
    description: 'Test 0', //TODO: we need a better description
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                context: {
                  device: {
                    adTrackingEnabled: true,
                    advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    type: 'Android',
                    attTrackingStatus: 3,
                  },
                  traits: { anonymousId: '21e13f4bc7ceddad' },
                },
                event: 'First Investment',
                properties: {
                  currency: 'EUR',
                  key1: 'value1',
                  key2: 'value2',
                  key3: { k4: 'v4', k5: { k6: 'v6' } },
                  key5: [{ k: 'v1' }, { k: 'v2' }],
                  revenue: 20.37566,
                },
                request_ip: '[::1]',
                type: 'track',
              },
              metadata: { jobId: 2, userId: 'u1' },
              destination: destination,
            },
          ],
          destType: 'adj',
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
              batchedRequest: getBatchedRequest({
                endpoint: 'https://s2s.adjust.com/event',
                headers: { Accept: '*/*' },
                params: {
                  callback_params:
                    '{"key1":"value1","key2":"value2","key3.k4":"v4","key3.k5.k6":"v6","key5[0].k":"v1","key5[1].k":"v2"}',
                  revenue: 20.38,
                  android_id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  gps_adid: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  att_status: 3,
                  tracking_enabled: true,
                  currency: 'EUR',
                  s2s: 1,
                  ip_address: '[::1]',
                  app_token: 'testAppToken',
                  event_token: 'testEventToken',
                  environment: 'production',
                },
                userId: '21e13f4bc7ceddad',
              }),
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: destination,
            },
          ],
        },
      },
    },
  },
  {
    name: 'adj',
    description: 'Test 1', //TODO: we need a better description
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                anonymousId: '21e13f4bc7ceddad',
                context: {
                  device: {
                    adTrackingEnabled: true,
                    advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    manufacturer: 'Google',
                    model: 'AOSP on IA Emulator',
                    name: 'generic_x86_arm',
                    type: 'ios',
                    attTrackingStatus: 3,
                  },
                  traits: { anonymousId: '21e13f4bc7ceddad' },
                },
                event: 'First Investment',
                properties: {
                  currency: 'EUR',
                  key1: 'value1',
                  key2: 'value2',
                  key3: { k4: 'v4', k5: { k6: 'v6' } },
                  key5: [{ k: 'v1' }, { k: 'v2' }],
                  revenue: 20.37566,
                },
                request_ip: '[::1]',
                type: 'track',
              },
              metadata: { jobId: 2, userId: 'u1' },
              destination: destination,
            },
          ],
          destType: 'adj',
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
              batchedRequest: getBatchedRequest({
                endpoint: 'https://s2s.adjust.com/event',
                headers: { Accept: '*/*' },
                params: {
                  callback_params:
                    '{"key1":"value1","key2":"value2","key3.k4":"v4","key3.k5.k6":"v6","key5[0].k":"v1","key5[1].k":"v2"}',
                  revenue: 20.38,
                  idfv: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  idfa: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                  att_status: 3,
                  tracking_enabled: true,
                  currency: 'EUR',
                  s2s: 1,
                  ip_address: '[::1]',
                  app_token: 'testAppToken',
                  event_token: 'testEventToken',
                  environment: 'production',
                },
                userId: '21e13f4bc7ceddad',
              }),
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: destination,
            },
          ],
        },
      },
    },
  },
];
