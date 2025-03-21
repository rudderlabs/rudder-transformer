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
];
export const networkCallsData = [...deleteNwData];
