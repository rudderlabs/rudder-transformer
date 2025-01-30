const method = 'POST';
const url = 'https://api.customer.io/v1/customers?limit=3';
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer test-app-api-key`,
};

export const networkCallsData = [
  {
    httpReq: {
      method,
      url,
      data: {
        filter: {
          or: [
            {
              attribute: {
                field: 'id',
                operator: 'eq',
                value: 'test-id-1',
              },
            },
            {
              attribute: {
                field: 'id',
                operator: 'eq',
                value: 'test-id-2',
              },
            },
            {
              attribute: {
                field: 'id',
                operator: 'eq',
                value: 'test-id-3',
              },
            },
          ],
        },
      },
      headers,
    },
    httpRes: {
      data: {
        identifiers: [
          {
            cio_id: 'caed0a000001',
            id: 'test-id-1',
            email: 'test@gmail.com',
          },
          {
            cio_id: 'caed0a000102',
            id: 'test-id-2',
            email: null,
          },
          {
            cio_id: 'caed0a000203',
            id: 'test-id-3',
            email: null,
          },
        ],
        ids: ['test-id-1', 'test-id-2', 'test-id-3'],
        next: '',
      },
      status: 200,
    },
  },
  {
    httpReq: {
      method,
      url,
      data: {
        filter: {
          or: [
            {
              attribute: {
                field: 'id',
                operator: 'eq',
                value: 'test-id-4',
              },
            },
            {
              attribute: {
                field: 'id',
                operator: 'eq',
                value: 'test-id-5',
              },
            },
            {
              attribute: {
                field: 'id',
                operator: 'eq',
                value: 'test-id-6',
              },
            },
          ],
        },
      },
      headers,
    },
    httpRes: {
      data: {
        identifiers: [
          {
            cio_id: 'caed0a000001',
            id: 'test-id-4',
            email: 'test@gmail.com',
          },
          {
            cio_id: 'caed0a000001',
            id: 'test-id-5',
            email: 'test@gmail.com',
          },
          {
            cio_id: 'caed0a000102',
            id: 'test-id-6',
            email: null,
          },
        ],
        ids: ['test-id-4', 'test-id-5', 'test-id-6'],
        next: '',
      },
      status: 200,
    },
  },
  {
    httpReq: {
      method,
      url,
      data: {
        filter: {
          or: [
            {
              attribute: {
                field: 'id',
                operator: 'eq',
                value: 'test-id-7',
              },
            },
            {
              attribute: {
                field: 'id',
                operator: 'eq',
                value: 'test-id-8',
              },
            },
            {
              attribute: {
                field: 'id',
                operator: 'eq',
                value: 'test-id-9',
              },
            },
          ],
        },
      },
      headers,
    },
    httpRes: {
      data: {
        errors: [
          {
            detail: 'unauthorized',
            status: '401',
          },
        ],
      },
      status: 401,
    },
  },
  {
    httpReq: {
      method,
      url,
      data: {
        filter: {
          or: [
            {
              attribute: {
                field: 'id',
                operator: 'eq',
                value: 'test-id-10',
              },
            },
            {
              attribute: {
                field: 'id',
                operator: 'eq',
                value: 'test-id-11',
              },
            },
          ],
        },
      },
      headers,
    },
    httpRes: {
      data: {
        identifiers: [
          {
            cio_id: 'caed0a000102',
            id: 'test-id-11',
            email: null,
          },
        ],
        ids: ['test-id-11'],
        next: '',
      },
      status: 200,
    },
  },
];
