import { destType, headers, updateEndpoint } from './common';

export const networkCallsData = [
  {
    httpReq: {
      url: updateEndpoint,
      data: [
        {
          item_id: 'test-item-id',
          properties: {
            unprinted: '1',
          },
        },
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
          success: true,
          queued: true,
        },
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
  {
    httpReq: {
      url: updateEndpoint,
      data: [
        {
          item_id: 'test-item-id-1',
          properties: {
            unprinted: '1',
          },
        },
        {
          item_id: 'test-item-id-2',
          properties: {
            unprinted: '2',
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
          success: true,
          queued: true,
        },
        {
          success: true,
          queued: true,
        },
      ],
      status: 200,
      statusText: 'Ok',
    },
  },
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
