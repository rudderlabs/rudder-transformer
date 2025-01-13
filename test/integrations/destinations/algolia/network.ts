export const networkCallsData = [
  {
    httpReq: {
      url: 'https://insights.algolia.io/1/events',
      data: {
        events: [
          {
            eventName: 'product clicked',
            eventType: 'abc',
            filters: ['field1:hello', 'val1:val2'],
            index: 'products',
            userToken: 'testuserId1',
          },
        ],
      },
      params: {},
      headers: { 'User-Agent': 'RudderLabs' },
      method: 'POST',
    },
    httpRes: {
      data: {
        status: 422,
        message: 'EventType must be one of "click", "conversion" or "view"',
      },
      status: 422,
    },
  },
  {
    httpReq: {
      url: 'https://insights.algolia.io/1/events',
      data: {
        events: [
          {
            eventName: 'product clicked',
            eventType: 'abc',
            filters: ['field1:hello', 'val1:val2'],
            index: 'products',
            userToken: 'testuserId1',
          },
          {
            eventName: 'product clicked',
            eventType: 'click',
            filters: ['field1:hello', 'val1:val2'],
            index: 'products',
            userToken: 'testuserId1',
          },
        ],
      },
      params: {},
      headers: { 'User-Agent': 'RudderLabs' },
      method: 'POST',
    },
    httpRes: {
      data: {
        status: 422,
        message: 'EventType must be one of "click", "conversion" or "view"',
      },
      status: 422,
    },
  },
  {
    httpReq: {
      url: 'https://insights.algolia.io/1/events',
      data: {
        events: [
          {
            eventName: 'product clicked',
            eventType: 'click',
            filters: ['field1:hello', 'val1:val2'],
            index: 'products',
            userToken: 'testuserId1',
          },
          {
            eventName: 'product clicked',
            eventType: 'view',
            filters: ['field1:hello', 'val1:val2'],
            index: 'products',
            userToken: 'testuserId1',
          },
          {
            eventName: 'product clicked',
            eventType: 'abc',
            filters: ['field1:hello', 'val1:val2'],
            index: 'products',
            userToken: 'testuserId1',
          },
        ],
      },
      params: {},
      headers: { 'User-Agent': 'RudderLabs' },
      method: 'POST',
    },
    httpRes: {
      data: {
        status: 422,
        message: 'EventType must be one of "click", "conversion" or "view"',
      },
      status: 422,
    },
  },
  {
    httpReq: {
      url: 'https://insights.algolia.io/1/events',
      method: 'POST',
      headers: {
        'User-Agent': 'RudderLabs',
      },
    },
    httpRes: {
      data: {
        status: 200,
        message: 'OK',
      },
      status: 200,
    },
  },
];
