export const networkCallsData = [
  {
    httpReq: {
      url: 'https://api.profitwell.com/v2/users/pwu_Oea7HXV3bnTP/',
      method: 'GET',
    },
    httpRes: {
      data: [
        {
          user_id: 'pwu_Oea7HXV3bnTP',
          subscription_id: 'pws_FecTCEyo17rV',
          user_alias: 'spiderman_1a',
          subscription_alias: 'spiderman_sub_1a',
          email: 'spiderman@profitwell.com',
          plan_id: 'web_plan',
          plan_interval: 'month',
          plan_currency: 'usd',
          status: 'active',
          value: 5000,
          effective_date: 1514764800,
          meta: {},
        },
      ],
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://api.profitwell.com/v2/users/spiderman_1a/',
      method: 'GET',
    },
    httpRes: {
      data: [
        {
          user_id: 'pwu_Oea7HXV3bnTP',
          subscription_id: 'pws_FecTCEyo17rV',
          user_alias: 'spiderman_1a',
          subscription_alias: 'spiderman_sub_1a',
          email: 'spiderman@profitwell.com',
          plan_id: 'web_plan',
          plan_interval: 'month',
          plan_currency: 'usd',
          status: 'active',
          value: 5000,
          effective_date: 1514764800,
          meta: {},
        },
      ],
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://api.profitwell.com/v2/users/23453/',
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
