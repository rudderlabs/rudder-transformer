const data = [
  {
    name: 'pipedream',
    description: 'Dynamic Header and Append Header',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                },
                network: { carrier: 'Banglalink' },
                os: { name: 'android', version: '8.1.0' },
                traits: {
                  address: { city: 'Dhaka', country: 'Bangladesh' },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: { All: true },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                additional_bet_index: 0,
                battle_id: 'N/A',
                featureGameType: 'N/A',
                win_amount: 0,
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              header: {
                dynamic_header_key_string: 'dynamic_header_value_string',
                dynamic_header_key_num: 10,
                dynamic_header_key_object: { k1: 'v1' },
              },
              appendPath: '/product/search?string=value',
            },
            destination: {
              Config: {
                pipedreamUrl: 'http://6b0e6a60.ngrok.io',
                headers: [
                  { from: '', to: '' },
                  { from: 'test2', to: 'value2' },
                ],
              },
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                JSON: {
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  context: {
                    device: {
                      id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                      manufacturer: 'Xiaomi',
                      model: 'Redmi 6',
                      name: 'xiaomi',
                    },
                    network: { carrier: 'Banglalink' },
                    os: { name: 'android', version: '8.1.0' },
                    traits: {
                      address: { city: 'Dhaka', country: 'Bangladesh' },
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                  },
                  event: 'spin_result',
                  integrations: { All: true },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
                    additional_bet_index: 0,
                    battle_id: 'N/A',
                    featureGameType: 'N/A',
                    win_amount: 0,
                  },
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'http://6b0e6a60.ngrok.io/product/search?string=value',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
                dynamic_header_key_string: 'dynamic_header_value_string',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'POST',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'pipedream',
    description: 'Dynamic Header',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                },
                network: { carrier: 'Banglalink' },
                os: { name: 'android', version: '8.1.0' },
                traits: {
                  address: { city: 'Dhaka', country: 'Bangladesh' },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: { All: true },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                additional_bet_index: 0,
                battle_id: 'N/A',
                featureGameType: 'N/A',
                win_amount: 0,
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              header: {
                dynamic_header_key_string: 'dynamic_header_value_string',
                dynamic_header_key_num: 10,
                dynamic_header_key_object: { k1: 'v1' },
              },
            },
            destination: {
              Config: {
                pipedreamUrl: 'http://6b0e6a60.ngrok.io',
                pipedreamMethod: 'PUT',
                headers: [
                  { from: '', to: '' },
                  { from: 'test2', to: 'value2' },
                ],
              },
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                JSON: {
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  context: {
                    device: {
                      id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                      manufacturer: 'Xiaomi',
                      model: 'Redmi 6',
                      name: 'xiaomi',
                    },
                    network: { carrier: 'Banglalink' },
                    os: { name: 'android', version: '8.1.0' },
                    traits: {
                      address: { city: 'Dhaka', country: 'Bangladesh' },
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                  },
                  event: 'spin_result',
                  integrations: { All: true },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
                    additional_bet_index: 0,
                    battle_id: 'N/A',
                    featureGameType: 'N/A',
                    win_amount: 0,
                  },
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                },
                FORM: {},
              },
              files: {},
              endpoint: 'http://6b0e6a60.ngrok.io',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
                dynamic_header_key_string: 'dynamic_header_value_string',
              },
              version: '1',
              params: {},
              type: 'REST',
              method: 'PUT',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
module.exports = {
  data,
};
