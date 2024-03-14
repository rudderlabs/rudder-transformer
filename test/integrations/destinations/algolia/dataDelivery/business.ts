import { ProxyV1TestData } from '../../../testTypes';
import {
  generateMetadata,
  generateProxyV0Payload,
  generateProxyV1Payload,
} from '../../../testUtils';
import { commonRequestParameters } from './constant';

const pardotResponseRogerEmail = {
  '@attributes': { stat: 'ok', version: 1 },
  prospect: {
    id: 123435,
    campaign_id: 42213,
    salutation: null,
    first_name: 'Roger_12',
    last_name: 'Federer_12',
    email: 'Roger_12@federer.io',
    password: null,
    company: null,
    website: 'https://rudderstack.com',
    job_title: null,
    department: null,
    country: 'AU',
    address_one: null,
    address_two: null,
    city: null,
    state: null,
    territory: null,
    zip: null,
    phone: null,
    fax: null,
    source: null,
    annual_revenue: null,
    employees: null,
    industry: null,
    years_in_business: null,
    comments: null,
    notes: null,
    score: 14,
    grade: null,
    last_activity_at: null,
    recent_interaction: 'Never active.',
    crm_lead_fid: '00Q6r000002LKhTPVR',
    crm_contact_fid: null,
    crm_owner_fid: '00G2v000004WYXaEAO',
    crm_account_fid: null,
    salesforce_fid: '00Q6r000002LKhTPVR',
    crm_last_sync: '2022-01-21 18:47:37',
    crm_url: 'https://testcompany.my.salesforce.com/00Q6r000002LKhTPVR',
    is_do_not_email: null,
    is_do_not_call: null,
    opted_out: null,
    is_reviewed: 1,
    is_starred: null,
    created_at: '2022-01-21 18:21:46',
    updated_at: '2022-01-21 18:48:41',
    campaign: { id: 42113, name: 'Test', crm_fid: '7012y000000MNOCLL4' },
    assigned_to: {
      user: {
        id: 38443703,
        email: 'test_rudderstack@testcompany.com',
        first_name: 'Rudderstack',
        last_name: 'User',
        job_title: null,
        role: 'Administrator',
        account: 489853,
        created_at: '2021-02-26 06:25:17',
        updated_at: '2021-02-26 06:25:17',
      },
    },
    Are_you_shipping_large_fragile_or_bulky_items: false,
    Calendly: false,
    Country_Code: 'AU',
    Currency: 'AUD',
    Inventory_or_Warehouse_Management_System: false,
    Lead_Status: 'New',
    Marketing_Stage: 'SAL',
    Record_Type_ID: 'TestCompany Lead',
    profile: {
      id: 304,
      name: 'Default',
      profile_criteria: [
        { id: 1500, name: 'Shipping Volume', matches: 'Unknown' },
        { id: 1502, name: 'Industry', matches: 'Unknown' },
        { id: 1506, name: 'Job Title', matches: 'Unknown' },
        { id: 1508, name: 'Department', matches: 'Unknown' },
      ],
    },
    visitors: null,
    visitor_activities: null,
    lists: null,
  },
};

export const testScenariosForV0API = [
  {
    id: 'algolia_v0_bussiness_scenario_1',
    name: 'algolia',
    description: '[Proxy v0 API] :: algolia all valid events no batching',
    successCriteria: 'Proper response from destination is received',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint: 'https://insights.algolia.io/1/events',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message:
              '[Generic Response Handler] Request for destination: algolia Processed Successfully',
            destinationResponse: {
              response: {
                message: 'OK',
                status: 200,
              },
              status: 200,
            },
          },
        },
      },
    },
  },
  {
    id: 'algolia_v0_bussiness_scenario_1',
    name: 'algolia',
    description: '[Proxy v0 API] :: algolia all valid events with batching batching',
    successCriteria: 'Proper response from destination is received',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint: 'https://insights.algolia.io/1/events',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message:
              '[Generic Response Handler] Request for destination: algolia Processed Successfully',
            destinationResponse: {
              response: {
                message: 'OK',
                status: 200,
              },
              status: 200,
            },
          },
        },
      },
    },
  },
];

export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'algolia_v1_bussiness_scenario_1',
    name: 'algolia',
    description: '[Proxy v1 API] :: pardot email type upsert',
    successCriteria: 'Proper response from destination is received',
    scenario: 'business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          ...commonRequestParameters,
          endpoint:
            'https://pi.pardot.com/api/prospect/version/4/do/upsert/email/Roger_12@waltair.io',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 201,
            message: 'Request Processed Successfully',
            response: [
              {
                statusCode: 201,
                metadata: generateMetadata(1),
                error: JSON.stringify('{}'),
              },
            ],
          },
        },
      },
    },
  },
];
