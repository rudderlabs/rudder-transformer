import { destType, headers, properties, endpoint } from './common';

export const networkCallsData = [
  {
    httpReq: {
      url: endpoint,
      data: {
        commands: [
          {
            name: 'customers',
            data: {
              customer_ids: {
                cookie: '97c46c81-3140-456d-b2a9-690d70aaca35',
              },
              update_timestamp: 1709405952,
              properties: {
                email: 'test@example.com',
                first_name: 'John',
                last_name: 'Doe',
                phone: '1234567890',
                city: 'New York',
                country: 'USA',
                address: {
                  city: 'New York',
                  country: 'USA',
                  pinCode: '123456',
                },
              },
            },
          },
          {
            name: 'customers',
            data: {
              customer_ids: {},
            },
          },
        ],
      },
      params: { destination: destType },
      headers,
      method: 'POST',
    },
    httpRes: {
      data: {
        results: [
          {
            success: true,
          },
          {
            success: false,
            errors: ['At least one id should be specified.'],
          },
        ],
        start_time: 1710771351.9885373,
        end_time: 1710771351.9891083,
        success: true,
      },
      status: 200,
      statusText: 'Ok',
    },
  },
  {
    httpReq: {
      url: endpoint,
      data: {
        commands: [
          {
            name: 'customers/events',
            data: {
              customer_ids: {
                cookie: '97c46c81-3140-456d-b2a9-690d70aaca35',
              },
              timestamp: 1709566376,
              properties,
              event_type: 'test_event',
            },
          },
          {
            name: 'customers',
            data: {
              customer_ids: {
                cookie: '97c46c81-3140-456d-b2a9-690d70aaca35',
              },
              update_timestamp: 1709405952,
              properties: {
                email: 'test@example.com',
                first_name: 'John',
                last_name: 'Doe',
                phone: '1234567890',
                city: 'New York',
                country: 'USA',
                address: {
                  city: 'New York',
                  country: 'USA',
                  pinCode: '123456',
                },
              },
            },
          },
        ],
      },
      params: { destination: destType },
      headers,
      method: 'POST',
    },
    httpRes: {
      data: {
        results: [
          {
            success: true,
          },
          {
            success: true,
          },
        ],
        start_time: 1710771351.9885373,
        end_time: 1710771351.9891083,
        success: true,
      },
      status: 200,
      statusText: 'Ok',
    },
  },
];
