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
  Authorization: 'Bearer myToken',
  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  'Pardot-Business-Unit-Id': '0Uv2v000000k9tHCAQ',
  'User-Agent': 'RudderLabs',
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
