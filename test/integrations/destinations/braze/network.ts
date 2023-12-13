const dataDeliveryMocksData = [
  {
    httpReq: {
      url: 'https://api.amplitude.com/2/httpapi/test5',
      data: {
        api_key: 'c9d8a13b8bcab46a547f7be5200c483d',
        events: [
          {
            app_name: 'Rudder-CleverTap_Example',
            app_version: '1.0',
            time: 1619006730330,
            user_id: 'gabi_userId_45',
            user_properties: {
              Residence: 'Shibuya',
              city: 'Tokyo',
              country: 'JP',
              email: 'gabi29@gmail.com',
              gender: 'M',
              name: 'User2 Gabi2',
              organization: 'Company',
              region: 'ABC',
              title: 'Owner',
              zip: '100-0001',
            },
          },
        ],
        options: { min_id_length: 1 },
      },
      params: { destination: 'any' },
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'RudderLabs' },
      method: 'POST',
    },
    httpRes: { response: {} },
  },
  {
    httpReq: {
      url: 'https://api.amplitude.com/2/httpapi/test6',
      data: {
        api_key: 'c9d8a13b8bcab46a547f7be5200c483d',
        events: [
          {
            app_name: 'Rudder-CleverTap_Example',
            app_version: '1.0',
            time: 1619006730330,
            user_id: 'gabi_userId_45',
            user_properties: {
              Residence: 'Shibuya',
              city: 'Tokyo',
              country: 'JP',
              email: 'gabi29@gmail.com',
              gender: 'M',
              name: 'User2 Gabi2',
              organization: 'Company',
              region: 'ABC',
              title: 'Owner',
              zip: '100-0001',
            },
          },
        ],
        options: { min_id_length: 1 },
      },
      params: { destination: 'any' },
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'RudderLabs' },
      method: 'POST',
    },
    httpRes: {},
  },
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
];
export const networkCallsData = [...deleteNwData, ...dataDeliveryMocksData];
