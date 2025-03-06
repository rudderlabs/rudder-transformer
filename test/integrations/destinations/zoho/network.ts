import { destType } from './common';

export const networkCallsData = [
  {
    httpReq: {
      url: 'https://www.zohoapis.in/crm/v6/Leads/upsert',
      data: {
        duplicate_check_fields: ['Email'],
        data: [
          {
            Email: 'subscribed@eewrfrd.com',
            First_Name: 'subcribed',
            Last_Name: ' User',
          },
        ],
        $append_values: {},
        trigger: ['workflow'],
      },
      params: { destination: destType },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Zoho-oauthtoken dummy-key',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        data: [
          {
            code: 'SUCCESS',
            duplicate_field: null,
            action: 'insert',
            details: {
              Modified_Time: '2024-07-16T09:39:27+05:30',
              Modified_By: {
                name: 'Dummy-User',
                id: '724445000000323001',
              },
              Created_Time: '2024-07-16T09:39:27+05:30',
              id: '724445000000424003',
              Created_By: {
                name: 'Dummy-User',
                id: '724445000000323001',
              },
              $approval_state: 'approved',
            },
            message: 'record added',
            status: 'success',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://www.zohoapis.in/crm/v6/Wrong/upsert',
      data: {
        duplicate_check_fields: ['Email'],
        data: [
          {
            Email: 'subscribed@eewrfrd.com',
            First_Name: 'subcribed',
            Last_Name: ' User',
          },
        ],
        $append_values: {},
        trigger: ['workflow'],
      },
      params: { destination: destType },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Zoho-oauthtoken dummy-key',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        code: 'INVALID_MODULE',
        details: {
          resource_path_index: 0,
        },
        message: 'the module name given seems to be invalid',
        status: 'error',
      },
      status: 400,
      statusText: 'Bad Request',
    },
  },
  {
    httpReq: {
      url: 'https://www.zohoapis.in/crm/v6/Leads/upsert',
      data: {
        duplicate_check_fields: ['Email'],
        data: [
          {
            Email: 'subscribed@eewrfrd.com',
            First_Name: 'subcribed',
            Last_Name: ' User',
          },
        ],
        $append_values: {},
        trigger: ['workflow'],
      },
      params: { destination: destType },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Zoho-oauthtoken wrong-token',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        code: 'INVALID_TOKEN',
        details: {},
        message: 'invalid oauth token',
        status: 'error',
      },
      status: 401,
      statusText: 'Bad Request',
    },
  },
  {
    httpReq: {
      url: 'https://www.zohoapis.in/crm/v6/Leads/upsert',
      data: {
        duplicate_check_fields: ['Email'],
        data: [
          {
            Email: 'subscribed@eewrfrd.com',
            First_Name: 'subcribed',
            Last_Name: ' User',
          },
          {
            Email: 'subscribed@eewrfrd.com',
            First_Name: 'subcribed',
            Last_Name: ' User',
          },
          {
            Random: 'subscribed@eewrfrd.com',
          },
        ],
        $append_values: {},
        trigger: ['workflow'],
      },
      params: { destination: destType },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Zoho-oauthtoken dummy-key',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        data: [
          {
            code: 'SUCCESS',
            duplicate_field: 'Email',
            action: 'update',
            details: {
              Modified_Time: '2024-07-16T15:01:02+05:30',
              Modified_By: {
                name: 'dummy-user',
                id: '724445000000323001',
              },
              Created_Time: '2024-07-16T09:39:27+05:30',
              id: '724445000000424003',
              Created_By: {
                name: 'dummy-user',
                id: '724445000000323001',
              },
            },
            message: 'record updated',
            status: 'success',
          },
          {
            code: 'SUCCESS',
            duplicate_field: 'Email',
            action: 'update',
            details: {
              Modified_Time: '2024-07-16T15:01:02+05:30',
              Modified_By: {
                name: 'dummy-user',
                id: '724445000000323001',
              },
              Created_Time: '2024-07-16T09:39:27+05:30',
              id: '724445000000424003',
              Created_By: {
                name: 'dummy-user',
                id: '724445000000323001',
              },
            },
            message: 'record updated',
            status: 'success',
          },
          {
            code: 'MANDATORY_NOT_FOUND',
            details: {
              api_name: 'Last_Name',
              json_path: '$.data[2].Last_Name',
            },
            message: 'required field not found',
            status: 'error',
          },
        ],
        // },
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://www.zohoapis.in/crm/v6/coql',
      headers: {
        Authorization: 'Zoho-oauthtoken correct-access-token',
      },
      data: {
        select_query: "SELECT id FROM Leads WHERE Email = 'tobedeleted@gmail.com'",
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        data: [
          {
            id: '<RECORD_ID_1>',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://www.zohoapis.in/crm/v6/coql',
      headers: {
        Authorization: 'Zoho-oauthtoken correct-access-token',
      },
      data: {
        select_query: "SELECT id FROM Leads WHERE Email = 'tobedeleted2@gmail.com'",
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        data: [
          {
            id: '<RECORD_ID_2>',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://www.zohoapis.in/crm/v6/coql',
      headers: {
        Authorization: 'Zoho-oauthtoken correct-access-token',
      },
      data: {
        select_query: "SELECT id FROM Leads WHERE Email = 'tobedeleted3@gmail.com'",
      },
      method: 'POST',
    },
    httpRes: {
      data: '',
      status: 204,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://www.zohoapis.in/crm/v6/coql',
      headers: {
        Authorization: 'Zoho-oauthtoken expired-access-token',
      },
      data: {
        select_query: "SELECT id FROM Leads WHERE Email = 'tobedeleted3@gmail.com'",
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        code: 'INVALID_TOKEN',
        details: {},
        message: 'invalid oauth token',
        status: 'error',
      },
      status: 401,
      statusText: 'Bad Request',
    },
  },
  {
    httpReq: {
      url: 'https://www.zohoapis.in/crm/v6/coql',
      headers: {
        Authorization: 'Zoho-oauthtoken correct-access-token',
      },
      data: {
        select_query:
          "SELECT id FROM Leads WHERE ((Email = 'tobedeleted2@gmail.com' AND First_Name = 'subcribed2') AND Last_Name = ' User2')",
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        data: [
          {
            id: '<RECORD_ID_2>',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://www.zohoapis.in/crm/v6/coql',
      headers: {
        Authorization: 'Zoho-oauthtoken correct-access-token',
      },
      data: {
        select_query: "SELECT id FROM Contacts WHERE Email = 'tobedeleted2@gmail.com'",
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        data: [
          {
            id: '<RECORD_ID_2>',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
];
