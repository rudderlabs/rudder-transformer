const dataDeliveryMocksData = [
  {
    httpReq: {
      url: 'https://rest.iad-03.braze.com/users/identify/test1',
      data: {
        aliases_to_identify: [
          {
            external_id: 'gabi_userId_45',
            user_alias: { alias_label: 'rudder_id', alias_name: 'gabi_anonId_45' },
          },
        ],
      },
      params: { destination: 'braze' },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer api_key',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: { data: { aliases_processed: 1, message: 'success' }, status: 201 },
  },
  {
    httpReq: {
      url: 'https://rest.iad-03.braze.com/users/identify/test2',
      data: {
        aliases_to_identify: [
          {
            external_id: 'gabi_userId_45',
            user_alias: { alias_label: 'rudder_id', alias_name: 'gabi_anonId_45' },
          },
        ],
      },
      params: { destination: 'braze' },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer api_key',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: { data: { message: 'success', errors: ['minor error message'] }, status: 201 },
  },
  {
    httpReq: {
      url: 'https://rest.iad-03.braze.com/users/identify/test3',
      data: {
        aliases_to_identify: [
          {
            external_id: 'gabi_userId_45',
            user_alias: { alias_label: 'rudder_id', alias_name: 'gabi_anonId_45' },
          },
        ],
      },
      params: { destination: 'braze' },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer api_key',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: { message: 'fatal error message', errors: ['minor error message'] },
      status: 201,
    },
  },
  {
    httpReq: {
      url: 'https://rest.iad-03.braze.com/users/identify/test4',
      data: {
        aliases_to_identify: [
          {
            external_id: 'gabi_userId_45',
            user_alias: { alias_label: 'rudder_id', alias_name: 'gabi_anonId_45' },
          },
        ],
      },
      params: { destination: 'braze' },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer api_key',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: { data: '', status: 201 },
  },
  {
    httpReq: {
      url: 'https://rest.iad-03.braze.com/users/identify/test5',
      data: {
        aliases_to_identify: [
          {
            external_id: 'gabi_userId_45',
            user_alias: { alias_label: 'rudder_id', alias_name: 'gabi_anonId_45' },
          },
        ],
      },
      params: { destination: 'braze' },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer api_key',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {},
  },
  {
    httpReq: {
      url: 'https://rest.iad-03.braze.com/users/identify/test7',
      data: {
        aliases_to_identify: [
          {
            external_id: 'gabi_userId_45',
            user_alias: { alias_label: 'rudder_id', alias_name: 'gabi_anonId_45' },
          },
        ],
      },
      params: { destination: 'braze' },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer api_key',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: { response: {} },
  },
];

const deleteNwData = [
  {
    httpReq: {
      method: 'post',
      url: 'https://rest.iad-03.braze.com/users/delete',
      data: {
        external_ids: [
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
        ],
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 1234',
      },
    },
    httpRes: {
      data: {
        code: 400,
        message: 'Bad Req',
        status: 'Fail Case',
      },
      status: 400,
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://rest.iad-03.braze.com/users/delete',
      data: {
        external_ids: [
          'test_user_id10',
          'user_sdk2',
          'test_user_id18',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
          'test_user_id',
          'user_sdk2',
        ],
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 1234',
      },
    },
    httpRes: {
      status: 200,
      statusText: 'OK',
      data: {
        deleted: 50,
        message: 'success',
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://rest.iad-03.braze.com/users/delete',
      data: { external_ids: ['test_user_id51'] },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 1234',
      },
    },
    httpRes: {
      status: 200,
      statusText: 'OK',
      data: {
        ' message': {
          deleted: '1',
          message: 'success',
        },
      },
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://rest.iad-03.braze.com/users/delete',
      data: {
        externalIds: ['test_user_id'],
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 1234',
      },
    },
    httpRes: {
      status: 200,
      statusText: 'OK',
      data: {
        ' message': {
          deleted: 1,
          message: 'success',
        },
      },
    },
  },
  {
    httpReq: {
      url: 'https://rest.iad-03.braze.com/users/identify/testV1',
      data: {
        aliases_to_identify: [
          {
            external_id: 'gabi_userId_45',
            user_alias: { alias_label: 'rudder_id', alias_name: 'gabi_anonId_45' },
          },
        ],
      },
      params: { destination: 'braze' },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer api_key',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        code: 400,
        message: 'Bad Req',
        status: 'Fail Case',
      },
      status: 401,
    },
  },
  {
    httpReq: {
      url: 'https://rest.iad-03.braze.com/users/track/testV1',
      data: {
        partner: 'RudderStack',
        attributes: [
          {
            email: '123@a.com',
            city: 'Disney',
            country: 'USA',
            firstname: 'Mickey',
            external_id: '456345345',
          },
          {
            email: '123@a.com',
            city: 'Disney',
            country: 'USA',
            firstname: 'Mickey',
            external_id: '456345345',
          },
          {
            email: '123@a.com',
            city: 'Disney',
            country: 'USA',
            firstname: 'Mickey',
            external_id: '456345345',
          },
        ],
      },
      params: { destination: 'braze' },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer api_key',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: '{"message":"Valid data must be provided in the \'attributes\', \'events\', or \'purchases\' fields.","errors":[{"type":"The value provided for the \'email\' field is not a valid email.","input_array":"attributes","index":0},{"type":"The value provided for the \'email\' field is not a valid email.","input_array":"attributes","index":1}]}',
      status: 401,
    },
  },
  {
    httpReq: {
      method: 'post',
      data: {
        external_ids: ['braze_test_user', 'user@50'],
        user_aliases: [
          { alias_name: '77e278c9-e984-4cdd-950c-cd0b61befd03', alias_label: 'rudder_id' },
          { alias_name: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca', alias_label: 'rudder_id' },
        ],
      },
      headers: { Authorization: 'Bearer dummyApiKey' },
      url: 'https://rest.iad-03.braze.com/users/export/ids',
    },
    httpRes: {
      data: {
        users: [
          {
            created_at: '2023-03-17T20:51:58.297Z',
            external_id: 'braze_test_user',
            user_aliases: [],
            appboy_id: '6414d2ee33326e3354e3040b',
            braze_id: '6414d2ee33326e3354e3040b',
            first_name: 'Jackson',
            last_name: 'Miranda',
            random_bucket: 8134,
            email: 'jackson24miranda@gmail.com',
            custom_attributes: {
              pwa: false,
              is_registered: true,
              last_identify: 'GOOGLE_SIGN_IN',
              account_region: 'ON',
              is_pickup_selected: 'false',
              has_tradein_attempt: false,
              custom_obj_attr: {
                key1: 'value1',
                key2: 'value2',
                key3: 'value3',
              },
              custom_arr: [1, 2, 'str1'],
            },
            custom_events: [
              {
                name: 'Sign In Completed',
                first: '2023-03-10T18:36:05.028Z',
                last: '2023-03-10T18:36:05.028Z',
                count: 2,
              },
            ],
            total_revenue: 0,
            push_subscribe: 'subscribed',
            email_subscribe: 'subscribed',
          },
        ],
      },
      message: 'success',
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://rest.iad-01.braze.com/users/identify',
    },
    httpRes: {
      response: {},
      message: 'success',
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://rest.iad-03.braze.com/users/identify',
    },
    httpRes: {
      response: {},
      message: 'success',
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://rest.iad-03.braze.com/users/track/testV1',
      data: {
        partner: 'RudderStack',
        attributes: [
          {
            email: '123@a.com',
            city: 'Disney',
            country: 'USA',
            firstname: 'Mickey',
            external_id: '456345345',
          },
          {
            email: '123@a.com',
            city: 'Disney',
            country: 'USA',
            firstname: 'Mickey',
            external_id: '456345345',
          },
          {
            email: '123@a.com',
            city: 'Disney',
            country: 'USA',
            firstname: 'Mickey',
            external_id: '456345345',
          },
        ],
      },
      params: { destination: 'braze' },
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer api_key',
        'Content-Type': 'application/json',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: '{"message":"Valid data must be provided in the \'attributes\', \'events\', or \'purchases\' fields.","errors":[{"type":"The value provided for the \'email\' field is not a valid email.","input_array":"attributes","index":0},{"type":"The value provided for the \'email\' field is not a valid email.","input_array":"attributes","index":1}]}',
      status: 401,
    },
  },
];
export const networkCallsData = [...deleteNwData, ...dataDeliveryMocksData];
