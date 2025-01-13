import { ProxyV1TestData } from '../../../testTypes';
import {
  generateMetadata,
  generateProxyV0Payload,
  generateProxyV1Payload,
} from '../../../testUtils';
import { commonRequestParameters, retryStatTags } from './constant';

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

const pardotResponseWalterEmail = {
  '@attributes': { stat: 'ok', version: 1 },
  prospect: {
    id: 123435,
    campaign_id: 42213,
    salutation: null,
    first_name: 'Roger_12',
    last_name: 'Federer_12',
    email: 'Roger_12@waltair.io',
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
    crm_lead_fid: null,
    crm_contact_fid: null,
    crm_owner_fid: '00G2v000004WYXaEAO',
    crm_account_fid: null,
    salesforce_fid: null,
    crm_last_sync: null,
    crm_url: null,
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

export const businessV0TestScenarios = [
  {
    id: 'pardot_v0_bussiness_scenario_1',
    name: 'pardot',
    description: '[Proxy v0 API] :: pardot email upsert',
    successCriteria: 'Proper response from destination is received',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
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
            destinationResponse: {
              response: pardotResponseWalterEmail,
              status: 201,
            },
          },
        },
      },
    },
  },
  {
    id: 'pardot_v0_bussiness_scenario_2',
    name: 'pardot',
    description: '[Proxy v0 API] :: pardot fid type upsert',
    successCriteria: 'Proper response from destination is received',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...commonRequestParameters,
          endpoint: 'https://pi.pardot.com/api/prospect/version/4/do/upsert/fid/00Q6r000002LKhTPVR',
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
            message: 'Request Processed Successfully',
            destinationResponse: {
              response: pardotResponseRogerEmail,
              status: 200,
            },
          },
        },
      },
    },
  },
];

export const businessV1TestScenarios: ProxyV1TestData[] = [
  {
    id: 'pardot_v1_bussiness_scenario_1',
    name: 'pardot',
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
                error: JSON.stringify(pardotResponseWalterEmail),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'pardot_v1_bussiness_scenario_2',
    name: 'pardot',
    description: '[Proxy v1 API] :: pardot fid type upsert',
    successCriteria: 'Proper response from destination is received',
    scenario: 'business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          ...commonRequestParameters,
          endpoint: 'https://pi.pardot.com/api/prospect/version/4/do/upsert/fid/00Q6r000002LKhTPVR',
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
            message: 'Request Processed Successfully',
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(1),
                error: JSON.stringify(pardotResponseRogerEmail),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'pardot_v1_Business_scenario_2',
    name: 'pardot',
    description: '[Proxy v1 API] :: Response with other retryable codes',
    successCriteria: 'the proxy should return 500 with retryable tag',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          ...commonRequestParameters,
          endpoint:
            'https://pi.pardot.com/api/prospect/version/4/do/upsert/email/rolex_waltair@test.com',
          params: {
            destination: 'pardot',
          },
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            response: [
              {
                error:
                  'Unable to verify Salesforce connector during Pardot response transformation',
                statusCode: 500,
                metadata: generateMetadata(1),
              },
            ],
            statTags: retryStatTags,
            message: 'Unable to verify Salesforce connector during Pardot response transformation',
            status: 500,
          },
        },
      },
    },
  },
];
