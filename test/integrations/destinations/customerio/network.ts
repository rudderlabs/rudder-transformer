export const networkCallsData = [
  {
    httpReq: {
      url: 'https://track.customer.io/api/v2/batch',
      method: 'POST',
      headers: {
        'test-dest-response-key': '200-success',
      },
    },
    httpRes: {
      data: {},
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://track.customer.io/api/v2/batch',
      method: 'POST',
      headers: {
        'test-dest-response-key': '207-partial',
      },
    },
    httpRes: {
      data: { errors: [{ batch_index: 1, reason: 'invalid attribute' }] },
      status: 207,
    },
  },
  {
    httpReq: {
      url: 'https://track.customer.io/api/v2/batch',
      method: 'POST',
      headers: {
        'test-dest-response-key': '400-bad-request',
      },
    },
    httpRes: {
      data: { message: 'Bad Request' },
      status: 400,
    },
  },
  {
    httpReq: {
      url: 'https://track.customer.io/api/v2/batch',
      method: 'POST',
      headers: {
        'test-dest-response-key': '401-unauthorized',
      },
    },
    httpRes: {
      data: { message: 'Unauthorized' },
      status: 401,
    },
  },
];
