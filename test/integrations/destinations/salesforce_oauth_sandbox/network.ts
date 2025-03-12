import { authHeader1 } from './maskedSecrets';
const headerWithWrongAccessToken = {
  Authorization: authHeader1,
  'Content-Type': 'application/json',
};

const headerWithRightAccessToken = {
  Authorization: authHeader1,
  'Content-Type': 'application/json',
};

const dataValue = {
  Email: 'danis.archurav@sbermarket.ru',
  Company: 'itus.ru',
  LastName: 'Danis',
  FirstName: 'Archurav',
  LeadSource: 'App Signup',
  account_type__c: 'free_trial',
};

const businessMockData = [
  {
    description: 'Mock response from destination depicting an expired access token',
    httpReq: {
      method: 'post',
      url: 'https://rudderstack.my.salesforce_oauth_sandbox.com/services/data/v50.0/sobjects/Lead/20',
      headers: headerWithWrongAccessToken,
      data: dataValue,
      params: { destination: 'salesforce_oauth_sandbox' },
    },
    httpRes: {
      data: [{ message: 'Session expired or invalid', errorCode: 'INVALID_SESSION_ID' }],
      status: 401,
    },
  },
  {
    description:
      'Mock response from destination depicting a valid lead request, with no changed data',
    httpReq: {
      method: 'post',
      url: 'https://rudderstack.my.salesforce.com/services/data/v50.0/sobjects/Lead/existing_unchanged_leadId',
      data: dataValue,
      headers: headerWithRightAccessToken,
    },
    httpRes: {
      data: { statusText: 'No Content' },
      status: 204,
    },
  },
];

export const networkCallsData = [...businessMockData];
