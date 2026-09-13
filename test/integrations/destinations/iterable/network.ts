import { defaultApiKey } from '../../common/secrets';

const deleteNwData = [
  {
    httpReq: {
      method: 'delete',
      url: 'https://api.iterable.com/api/users/byUserId/rudder1',
      headers: {
        api_key: defaultApiKey,
      },
    },
    httpRes: {
      data: {
        msg: 'All users associated with rudder1 were successfully deleted',
        code: 'Success',
        params: null,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      method: 'delete',
      url: 'https://api.iterable.com/api/users/byUserId/rudder2',
      headers: {
        api_key: defaultApiKey,
      },
    },
    httpRes: {
      data: {
        msg: 'User does not exist. Email:  UserId: rudder2',
        code: 'BadParams',
        params: null,
      },
      status: 400,
    },
  },
  {
    httpReq: {
      method: 'delete',
      url: 'https://api.iterable.com/api/users/byUserId/rudder3',
      headers: {
        api_key: 'invalidKey',
      },
    },
    httpRes: {
      data: {
        msg: 'Invalid API key',
        code: 'Success',
        params: {
          endpoint: '/api/users/byUserId/rudder3',
        },
      },
      status: 401,
    },
  },
  {
    httpReq: {
      method: 'delete',
      url: 'https://api.iterable.com/api/users/byUserId/rudder4',
      headers: {
        api_key: 'invalidKey',
      },
    },
    httpRes: {
      data: {
        msg: 'Invalid API key',
        code: 'Success',
        params: {
          endpoint: '/api/users/byUserId/rudder4',
        },
      },
      status: 401,
    },
  },
  {
    httpReq: {
      method: 'delete',
      url: 'https://api.iterable.com/api/users/byUserId/rudder5',
      headers: {
        api_key: defaultApiKey,
      },
    },
    httpRes: {
      data: {
        msg: 'All users associated with rudder6 were successfully deleted',
        code: 'Success',
        params: null,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      method: 'delete',
      url: 'https://api.iterable.com/api/users/byUserId/rudder6',
      headers: {
        api_key: defaultApiKey,
      },
    },
    httpRes: {
      data: {
        msg: 'All users associated with rudder6 were successfully deleted',
        code: 'Success',
        params: null,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      method: 'delete',
      url: 'https://api.eu.iterable.com/api/users/byUserId/rudder7',
      headers: {
        api_key: defaultApiKey,
      },
    },
    httpRes: {
      data: {
        msg: 'All users associated with rudder7 were successfully deleted',
        code: 'Success',
        params: null,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      method: 'delete',
      url: 'https://api.iterable.com/api/users/byUserId/rudder8',
      headers: {
        api_key: defaultApiKey,
      },
    },
    httpRes: {
      data: {
        msg: 'userId error:"1fecdc2a-753f-11f0-a449-de2ce5e1501f"',
        code: 'BadParams',
        params: {
          invalidUserIds: ['1fecdc2a-753f-11f0-a449-de2ce5e1501f'],
          failedUpdates: {
            notFoundUserIds: ['1fecdc2a-753f-11f0-a449-de2ce5e1501f'],
          },
        },
      },
      status: 400,
    },
  },
  {
    httpReq: {
      method: 'delete',
      url: 'https://api.iterable.com/api/users/byUserId/rudder9',
      headers: {
        api_key: defaultApiKey,
      },
    },
    httpRes: {
      data: {
        msg: 'userId error:"2fecdc2a-753f-11f0-a449-de2ce5e1501f"',
        code: 'BadParams',
        invalidUserIds: ['2fecdc2a-753f-11f0-a449-de2ce5e1501f'],
        failedUpdates: {
          notFoundUserIds: ['2fecdc2a-753f-11f0-a449-de2ce5e1501f'],
        },
      },
      status: 400,
    },
  },
];
export const networkCallsData = [...deleteNwData];
