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
      url: 'https://www.zohoapis.in/crm/v6/Leads/search?criteria=(Email:equals:tobedeleted3%40gmail.com)and(First_Name:equals:subcribed3)and(Last_Name:equals:%20User3)',
      headers: {
        Authorization: 'Zoho-oauthtoken correct-access-token',
      },
      method: 'GET',
    },
    httpRes: {
      data: {
        data: '',
      },
      status: 204,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://www.zohoapis.in/crm/v6/Leads/search?criteria=(Email:equals:tobedeleted%40gmail.com)and(First_Name:equals:subcribed)and(Last_Name:equals:%20User)',
      headers: {
        Authorization: 'Zoho-oauthtoken correct-access-token',
      },
      method: 'GET',
    },
    httpRes: {
      data: {
        data: [
          {
            Owner: {
              name: 'dummy-user',
              id: '724445000000323001',
              email: 'dummy@gmail.com',
            },
            Company: null,
            Email: 'tobedeleted@gmail.com',
            $currency_symbol: '$',
            $field_states: null,
            $sharing_permission: 'full_access',
            Last_Activity_Time: '2024-07-18T23:55:42+05:30',
            Industry: null,
            Unsubscribed_Mode: null,
            $process_flow: false,
            Street: null,
            Zip_Code: null,
            id: '<RECORD_ID_1>',
            $approval: {
              delegate: false,
              approve: false,
              reject: false,
              resubmit: false,
            },
            Created_Time: '2024-07-18T19:34:50+05:30',
            $editable: true,
            City: null,
            No_of_Employees: null,
            Converted_Account: null,
            State: null,
            Country: null,
            Created_By: {
              name: 'dummy-user',
              id: '724445000000323001',
              email: 'dummy@gmail.com',
            },
            $zia_owner_assignment: 'owner_recommendation_unavailable',
            Annual_Revenue: null,
            Secondary_Email: null,
            Description: null,
            Rating: null,
            $review_process: {
              approve: false,
              reject: false,
              resubmit: false,
            },
            Website: null,
            Twitter: null,
            Salutation: null,
            First_Name: 'subcribed',
            Full_Name: 'subcribed User',
            Lead_Status: null,
            Record_Image: null,
            Modified_By: {
              name: 'dummy-user',
              id: '724445000000323001',
              email: 'dummy@gmail.com',
            },
            Converted_Deal: null,
            $review: null,
            Lead_Conversion_Time: null,
            Skype_ID: null,
            Phone: null,
            Email_Opt_Out: false,
            $zia_visions: null,
            Designation: null,
            Modified_Time: '2024-07-18T23:55:42+05:30',
            $converted_detail: {},
            Unsubscribed_Time: null,
            Converted_Contact: null,
            Mobile: null,
            $orchestration: null,
            Last_Name: 'User',
            $in_merge: false,
            Lead_Source: null,
            Fax: null,
            $approval_state: 'approved',
            $pathfinder: null,
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      url: 'https://www.zohoapis.in/crm/v6/Leads/search?criteria=(Email:equals:tobedeleted2%40gmail.com)and(First_Name:equals:subcribed2)and(Last_Name:equals:%20User2)',
      headers: {
        Authorization: 'Zoho-oauthtoken correct-access-token',
      },
      method: 'GET',
    },
    httpRes: {
      data: {
        data: [
          {
            Owner: {
              name: 'dummy-user',
              id: '724445000000323001',
              email: 'dummy@gmail.com',
            },
            Company: null,
            Email: 'tobedeleted2@gmail.com',
            $currency_symbol: '$',
            $field_states: null,
            $sharing_permission: 'full_access',
            Last_Activity_Time: '2024-07-18T23:55:42+05:30',
            Industry: null,
            Unsubscribed_Mode: null,
            $process_flow: false,
            Street: null,
            Zip_Code: null,
            id: '<RECORD_ID_2>',
            $approval: {
              delegate: false,
              approve: false,
              reject: false,
              resubmit: false,
            },
            Created_Time: '2024-07-18T19:34:50+05:30',
            $editable: true,
            City: null,
            No_of_Employees: null,
            Converted_Account: null,
            State: null,
            Country: null,
            Created_By: {
              name: 'dummy-user',
              id: '724445000000323001',
              email: 'dummy@gmail.com',
            },
            $zia_owner_assignment: 'owner_recommendation_unavailable',
            Annual_Revenue: null,
            Secondary_Email: null,
            Description: null,
            Rating: null,
            $review_process: {
              approve: false,
              reject: false,
              resubmit: false,
            },
            Website: null,
            Twitter: null,
            Salutation: null,
            First_Name: 'subcribed2',
            Full_Name: 'subcribed2 User',
            Lead_Status: null,
            Record_Image: null,
            Modified_By: {
              name: 'dummy-user',
              id: '724445000000323001',
              email: 'dummy@gmail.com',
            },
            Converted_Deal: null,
            $review: null,
            Lead_Conversion_Time: null,
            Skype_ID: null,
            Phone: null,
            Email_Opt_Out: false,
            $zia_visions: null,
            Designation: null,
            Modified_Time: '2024-07-18T23:55:42+05:30',
            $converted_detail: {},
            Unsubscribed_Time: null,
            Converted_Contact: null,
            Mobile: null,
            $orchestration: null,
            Last_Name: 'User2',
            $in_merge: false,
            Lead_Source: null,
            Fax: null,
            $approval_state: 'approved',
            $pathfinder: null,
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
];
