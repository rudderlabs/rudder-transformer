const deleteNwData = [
  {
    httpReq: {
      method: 'delete',
      url: 'https://api.engage.so/v1/users/1',
    },
    httpRes: {
      data: {
        code: 400,
        message: 'Bad Req',
        status: 'Fail first',
      },
      status: 400,
    },
  },
  {
    httpReq: {
      method: 'delete',
      url: 'https://api.engage.so/v1/users/2',
    },
    httpRes: {
      status: 200,
      statusText: 'success',
    },
  },
  {
    httpReq: {
      method: 'delete',
      url: 'https://api.engage.so/v1/users/3',
    },
    httpRes: {
      status: 200,
      statusText: 'success',
    },
  },
  {
    httpReq: {
      method: 'delete',

      url: 'https://api.engage.so/v1/users/4',
    },
    httpRes: {
      status: 200,
      statusText: 'success',
    },
  },
  {
    httpReq: {
      method: 'delete',

      url: 'https://api.engage.so/v1/users/5',
    },
    httpRes: {
      status: 200,
      statusText: 'success',
    },
  },
  {
    httpReq: {
      method: 'delete',

      url: 'https://api.engage.so/v1/users/6',
      'Content-Type': 'application/json',
      Authorization: 'Basic YWJjZDplZmdo',
    },
    httpRes: {
      data: {
        code: 400,
        message: 'Bad Req',
        status: 'fail 6 ',
      },
      status: 400,
    },
  },
  {
    httpReq: {
      method: 'delete',

      url: 'https://api.engage.so/v1/users/7',
      'Content-Type': 'application/json',
      Authorization: 'Basic YWJjZDplZmdo',
    },
    httpRes: {
      status: 200,
      statusText: 'success',
    },
  },
  {
    httpReq: {
      method: 'delete',

      url: 'https://api.engage.so/v1/users/8',
      'Content-Type': 'application/json',
      Authorization: 'Basic YWJjZDplZmdo',
    },
    httpRes: {
      data: {
        code: 400,
        message: 'Bad Req',
        status: 'fail mid case 8',
      },
      status: 400,
    },
  },
  {
    httpReq: {
      method: 'delete',

      url: 'https://api.engage.so/v1/users/9',
      'Content-Type': 'application/json',
      Authorization: 'Basic YWJjZDplZmdo',
    },
    httpRes: {
      status: 200,
      statusText: 'success',
    },
  },
  {
    httpReq: {
      method: 'delete',

      url: 'https://api.engage.so/v1/users/12',
    },
    httpRes: {
      status: 200,
      statusText: 'success',
    },
  },
  {
    httpReq: {
      method: 'delete',

      url: 'https://api.engage.so/v1/users/user_sdk2',
    },
    httpRes: {
      status: 200,
      statusText: 'success',
    },
  },
];
export const networkCallsData = [...deleteNwData];
