export const retryStatTags = {
  destType: 'PARDOT',
  errorCategory: 'network',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  errorType: 'retryable',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
};
const commonHeaders = {
  'X-Algolia-API-Key': 'dummyApiKey',
  'X-Algolia-Application-Id': 'O2YARRI15I',
};

export const commonRequestParameters = {
  headers: commonHeaders,
  FORM: {
    first_name: 'Roger12',
    last_name: 'Federer12',
    website: 'https://rudderstack.com',
    score: 14,
    campaign_id: 42213,
  },
};
