const headerWithWrongAccessToken = {
  Authorization: 'Bearer expiredAccessToken',
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
      url: 'https://rudderstack.my.salesforce_oauth.com/services/data/v50.0/sobjects/Lead/20',
      headers: headerWithWrongAccessToken,
      data: dataValue,
      params: { destination: 'salesforce_oauth' },
    },
    httpRes: {
      data: [{ message: 'Session expired or invalid', errorCode: 'INVALID_SESSION_ID' }],
      status: 401,
    },
  },
];

export const networkCallsData = [...businessMockData];
