import { destType, headers, updateEndpoint } from './common';

export const networkCallsData = [
  {
    httpReq: {
      url: updateEndpoint,
      data: [
        {
          item_id: 'test-item-id-faulty',
          properties: {
            unprinted1: '1',
          },
        },
      ],
      params: { destination: destType },
      headers,
      method: 'POST',
    },
    httpRes: {
      data: [
        {
          success: false,
          queued: false,
          errors: {
            properties: ['Fields [unprinted1] are not properly defined.'],
          },
        },
      ],
      status: 200,
      statusText: 'Ok',
    },
  },
];
