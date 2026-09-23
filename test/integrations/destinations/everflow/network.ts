import { endpoint } from './common';

const request = (transactionId: string) => ({
  method: 'GET',
  url: endpoint,
  params: { nid: 'network-1', transaction_id: transactionId },
});

export const networkCallsData = [
  {
    description: 'Everflow accepted conversion',
    httpReq: request('accepted'),
    httpRes: { status: 200, data: '' },
  },
  {
    description: 'Everflow rejected conversion with an empty 204 response',
    httpReq: request('rejected-204'),
    httpRes: { status: 204, data: '' },
  },
  {
    description: 'Everflow failure with a string response body',
    httpReq: request('string-failure'),
    httpRes: { status: 400, data: 'Invalid transaction ID' },
  },
  {
    description: 'Everflow failure with an object response body',
    httpReq: request('object-failure'),
    httpRes: { status: 400, data: { code: 12, error: 'Invalid transaction ID' } },
  },
  {
    description: 'Everflow failure with an empty response body',
    httpReq: request('empty-failure'),
    httpRes: { status: 400, data: '' },
  },
];
