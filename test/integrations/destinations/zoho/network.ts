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
  {
    httpReq: {
      url: 'https://www.zohoapis.in/crm/v6/coql',
      headers: {
        Authorization: 'Zoho-oauthtoken correct-access-token',
      },
      data: {
        select_query: "SELECT id, Email FROM Contacts WHERE Email in ('tobedeleted2@gmail.com')",
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        data: [
          {
            id: '<RECORD_ID_2>',
            Email: 'tobedeleted2@gmail.com',
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
        select_query:
          "SELECT id, Email FROM Leads WHERE Email in ('tobedeleted@gmail.com', 'tobedeleted2@gmail.com')",
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        data: [
          {
            id: '<RECORD_ID_1>',
            Email: 'tobedeleted@gmail.com',
          },
          {
            id: '<RECORD_ID_2>',
            Email: 'tobedeleted2@gmail.com',
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
        select_query:
          "SELECT id, Email FROM Leads WHERE Email in ('tobedeleted@gmail.com', 'tobedeleted3@gmail.com')",
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        data: [
          {
            id: '<RECORD_ID_1>',
            Email: 'tobedeleted@gmail.com',
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
        Authorization: 'Zoho-oauthtoken expired-access-token',
      },
      data: {
        select_query: "SELECT id, Email FROM Leads WHERE Email in ('tobedeleted3@gmail.com')",
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
        Authorization: 'Zoho-oauthtoken correct-access-token-partial',
      },
      data: {
        select_query:
          "SELECT id, Email, Phone, Company, Website, Lead_Source FROM Leads WHERE ((Email in ('tobedeleted1@gmail.com', 'tobedeleted2@gmail.com', 'tobedeleted3@gmail.com') OR Phone in ('+1234567801', '+1234567802', '+1234567803')) OR ((Company in ('Company One', 'Company Two', 'Company Three') OR Website in ('https://company1.com', 'https://company2.com', 'https://company3.com')) OR Lead_Source in ('Direct', 'Advertisement', 'Referral')))",
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        data: [
          {
            id: '<RECORD_ID_1>',
            Email: 'tobedeleted1@gmail.com',
            Phone: '+1234567801',
            Company: 'Company One',
            Website: 'https://company1.com',
            Lead_Source: 'Direct',
          },
          {
            id: '<RECORD_ID_2>',
            Email: 'tobedeleted2@gmail.com',
            Phone: '+1234567802',
            Company: 'Company Two',
            Website: 'https://company2.com',
            Lead_Source: 'Advertisement',
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
        Authorization: 'Zoho-oauthtoken correct-access-token-partial',
      },
      data: {
        select_query:
          "SELECT id, Email, Phone, Company, Website, Lead_Source FROM Leads WHERE ((Email in ('tobedeleted4@gmail.com', 'tobedeleted5@gmail.com') OR Phone in ('+1234567804', '+1234567805')) OR ((Company in ('Company Four', 'Company Five') OR Website in ('https://company4.com', 'https://company5.com')) OR Lead_Source in ('Social Media', 'Partner')))",
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        data: [
          {
            id: '<RECORD_ID_4>',
            Email: 'tobedeleted4@gmail.com',
            Phone: '+1234567804',
            Company: 'Company Four',
            Website: 'https://company4.com',
            Lead_Source: 'Social Media',
          },
          {
            id: '<RECORD_ID_5>',
            Email: 'tobedeleted5@gmail.com',
            Phone: '+1234567805',
            Company: 'Company Five',
            Website: 'https://company5.com',
            Lead_Source: 'Partner',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
];
