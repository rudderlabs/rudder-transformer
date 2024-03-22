export const networkCallsData = [
  {
    httpReq: {
      url: 'https://api.sendinblue.com/v3/contacts/gordon_pittman%40example.com',
      method: 'GET',
    },
    httpRes: {
      data: {
        email: 'gordon_pittman@example.com',
        id: 42,
        emailBlacklisted: false,
        smsBlacklisted: false,
        createdAt: '2022-12-04T18:22:48.384+05:30',
        modifiedAt: '2022-12-18T14:06:20.515+05:30',
        attributes: {
          LASTNAME: 'Pittman',
          FIRSTNAME: 'Gordon',
          AGE: 33,
        },
        listIds: [5],
        statistics: {},
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://api.sendinblue.com/v3/contacts/42',
      method: 'GET',
    },
    httpRes: {
      data: {
        email: 'gordon_pittman@example.com',
        id: 42,
        emailBlacklisted: false,
        smsBlacklisted: false,
        createdAt: '2022-12-04T18:22:48.384+05:30',
        modifiedAt: '2022-12-18T14:06:20.515+05:30',
        attributes: {
          LASTNAME: 'Pittman',
          FIRSTNAME: 'Gordon',
          AGE: 33,
        },
        listIds: [5],
        statistics: {},
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://api.sendinblue.com/v3/contacts/john_doe%40example.com',
      method: 'GET',
    },
    httpRes: {
      status: 404,
    },
  },
  {
    httpReq: {
      url: 'https://api.profitwell.com/v2/users/sp_245/',
      method: 'GET',
    },
    httpRes: {
      message: 'Request failed with status code 404',
      status: 404,
      statusText: 'Not Found',
    },
  },
  {
    httpReq: {
      url: 'https://api.profitwell.com/v2/users/1234/',
      method: 'GET',
    },
    httpRes: {
      message: 'Request failed with status code 404',
      status: 404,
      statusText: 'Not Found',
    },
  },
  {
    httpReq: {
      url: 'https://api.profitwell.com/v2/users/samual/',
      method: 'GET',
    },
    httpRes: {
      message: 'Request failed with status code 404',
      status: 404,
      statusText: 'Not Found',
    },
  },
];
