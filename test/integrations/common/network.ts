export const networkCallsData = [
  {
    description: 'Mock response depicting SERVICE NOT AVAILABLE error',
    httpReq: {
      method: 'post',
      url: 'https://random_test_url/test_for_service_not_available',
    },
    httpRes: {
      data: {
        error: {
          message: 'Service Unavailable',
          description:
            'The server is currently unable to handle the request due to temporary overloading or maintenance of the server. Please try again later.',
        },
      },
      status: 503,
    },
  },
  {
    description: 'Mock response depicting INTERNAL SERVER ERROR error with post method',
    httpReq: {
      method: 'post',
      url: 'https://random_test_url/test_for_internal_server_error',
    },
    httpRes: {
      data: 'Internal Server Error',
      status: 500,
    },
  },
  {
    description: 'Mock response depicting INTERNAL SERVER ERROR error with patch method',
    httpReq: {
      method: 'post',
      url: 'https://random_test_url/test_for_internal_server_error',
    },
    httpRes: {
      data: 'Internal Server Error',
      status: 500,
    },
  },
  {
    description: 'Mock response depicting GATEWAY TIME OUT error',
    httpReq: {
      method: 'post',
      url: 'https://random_test_url/test_for_gateway_time_out',
    },
    httpRes: {
      data: 'Gateway Timeout',
      status: 504,
    },
  },
  {
    description: 'Mock response depicting null response',
    httpReq: {
      method: 'post',
      url: 'https://random_test_url/test_for_null_response',
    },
    httpRes: {
      data: null,
      status: 500,
    },
  },
  {
    description: 'Mock response depicting null and no status',
    httpReq: {
      method: 'post',
      url: 'https://random_test_url/test_for_null_and_no_status',
    },
    httpRes: {
      data: null,
    },
  },
  {
    description: 'Mock response depicting TOO MANY REQUESTS error with patch method',
    httpReq: {
      method: 'patch',
      url: 'https://random_test_url/test_for_too_many_requests',
    },
    httpRes: {
      data: {},
      status: 429,
    },
  },
  {
    description: 'Mock response depicting DNS lookup failure error',
    httpReq: {
      method: 'post',
      url: 'https://random_test_url/dns_lookup_failure',
    },
    httpRes: {
      data: {},
      status: 400,
    },
  },
];
