export const headerBlockWithCorrectAccessToken = {
  'Content-Type': 'application/json',
  Authorization: 'dummy-key',
};

export const contactPayload = {
  phone_number: '+919433127939',
  first_name: 'john',
  last_name: 'Doe',
};

// MOCK DATA
const businessMockData = [
  {
    description:
      'Mock response from destination depicting request with a correct contact payload but with wrong contact list',
    httpReq: {
      method: 'POST',
      url: 'https://rest.clicksend.com/v3/lists/wrong-id/contacts',
      headers: headerBlockWithCorrectAccessToken,
      data: contactPayload,
    },
    httpRes: {
      data: {
        http_code: 403,
        response_code: 'FORBIDDEN',
        response_msg:
          "Resource not found or you don't have the permissions to access this resource.",
        data: null,
      },
      status: 403,
    },
  },
  {
    description:
      'Mock response from destination depicting request with a correct contact payload but with wrong contact list while updating contact',
    httpReq: {
      method: 'PUT',
      url: 'https://rest.clicksend.com/v3/lists/<wrong-id>/contacts/<right-id>',
      headers: headerBlockWithCorrectAccessToken,
      data: contactPayload,
    },
    httpRes: {
      data: {
        http_code: 404,
        response_code: 'NOT_FOUND',
        response_msg: 'Contact record not found.',
        data: null,
      },
      status: 404,
    },
  },
  {
    description:
      'Mock response from destination depicting request with a correct contact payload but with wrong contact list',
    httpReq: {
      method: 'PUT',
      url: 'https://rest.clicksend.com/v3/lists/<right-id>/contacts/<wrong-id>',
      headers: headerBlockWithCorrectAccessToken,
      data: contactPayload,
    },
    httpRes: {
      data: {
        http_code: 404,
        response_code: 'NOT_FOUND',
        response_msg: 'Contact record not found.',
        data: null,
      },
      status: 404,
    },
  },
  {
    description:
      'Mock response from destination depicting request with a correct contact payload but with wrong contact list',
    httpReq: {
      method: 'POST',
      url: 'https://rest.clicksend.com/v3/lists/<right-id>/contacts/<right-id>',
      headers: headerBlockWithCorrectAccessToken,
      data: { ...contactPayload, address_line_1: { city: 'kolkata' } },
    },
    httpRes: {
      data: {
        http_code: 400,
        response_code: 400,
        response_msg:
          'preg_replace(): Parameter mismatch, pattern is a string while replacement is an array',
        data: null,
      },
      status: 400,
    },
  },
  {
    description:
      'Mock response from destination depicting request with a correct contact payload but with wrong contact list',
    httpReq: {
      method: 'POST',
      url: 'https://rest.clicksend.com/v3/sms-campaigns/send',
      headers: headerBlockWithCorrectAccessToken,
      data: {
        list_id: 'wrong-id',
        name: 'My Campaign 1',
        body: 'This is my new campaign message.',
      },
    },
    httpRes: {
      data: {
        http_code: 404,
        response_code: 'NOT_FOUND',
        response_msg: 'Your list is not found.',
        data: null,
      },
      status: 404,
    },
  },
  {
    description:
      'Mock response from destination depicting request with a correct contact payload but with wrong contact list',
    httpReq: {
      method: 'POST',
      url: 'https://rest.clicksend.com/v3/sms/send',
      headers: headerBlockWithCorrectAccessToken,
      data: {
        messages: [
          {
            body: 'test message, please ignore',
            to: '+919XXXXXXX8',
            from: '+9182XXXXXX8',
          },
          {
            body: 'test message, please ignore',
            to: '+919XXXXXXX9',
            from: '+9182XXXXXX8',
          },
          {
            body: 'test message, please ignore',
            to: '+919XXXXXXX0',
            from: '+9182XXXXXX8',
          },
          {
            body: 'test message, please ignore',
            to: '+919XXXXXXX7',
            from: '+9182XXXXXX8',
          },
        ],
      },
    },
    httpRes: {
      data: {
        http_code: 200,
        response_code: 'SUCCESS',
        response_msg: 'Messages queued for delivery.',
        data: {
          total_price: 15.41,
          total_count: 4,
          queued_count: 2,
          messages: [
            {
              direction: 'out',
              date: 1718728461,
              to: '+919XXXXXXX8',
              body: 'test message, please ignore',
              from: '+61447254068',
              schedule: 1718728461,
              message_id: '1EF2D909-D81A-65FA-BEC7-33227BD3AB16',
              message_parts: 1,
              message_price: '7.7050',
              from_email: null,
              list_id: null,
              custom_string: '',
              contact_id: null,
              user_id: 518988,
              subaccount_id: 589721,
              is_shared_system_number: false,
              country: 'IN',
              carrier: 'BSNL MOBILE',
              status: 'SUCCESS',
            },
            {
              direction: 'out',
              date: 1718728461,
              to: '+919XXXXXXX9',
              body: 'test message, please ignore',
              from: '+61447254068',
              schedule: 1718728461,
              message_id: '1EF2D909-D8C4-6D02-9EF0-1575A27E0783',
              message_parts: 1,
              message_price: '7.7050',
              from_email: null,
              list_id: null,
              custom_string: '',
              contact_id: null,
              user_id: 518988,
              subaccount_id: 589721,
              is_shared_system_number: false,
              country: 'IN',
              carrier: 'BSNL MOBILE',
              status: 'SUCCESS',
            },
            {
              to: '+614XXXXXX7',
              body: 'test message, please ignore',
              from: '+61447238703',
              schedule: '',
              message_id: '1EF2D909-D8CB-6684-AFF9-DDE3218AE055',
              message_parts: 0,
              message_price: '0.0000',
              custom_string: '',
              is_shared_system_number: true,
              country: 'AU',
              carrier: 'Optus',
              status: 'COUNTRY_NOT_ENABLED',
            },
            {
              to: '+614XXXXXXX2',
              body: 'test message, please ignore',
              from: '+61447268001',
              schedule: '',
              message_id: '1EF2D909-D8D2-645C-A69F-57D016B5E549',
              message_parts: 0,
              message_price: '0.0000',
              custom_string: '',
              is_shared_system_number: true,
              country: 'AU',
              carrier: 'Optus',
              status: 'COUNTRY_NOT_ENABLED',
            },
          ],
          _currency: {
            currency_name_short: 'INR',
            currency_prefix_d: '₹',
            currency_prefix_c: '¢',
            currency_name_long: 'Indian Rupees',
          },
          blocked_count: 2,
        },
      },
      status: 200,
    },
  },
];

export const networkCallsData = [...businessMockData];
