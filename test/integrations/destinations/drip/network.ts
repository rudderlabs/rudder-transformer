export const networkCallsData = [
  {
    httpReq: {
      url: 'https://api.getdrip.com/v2/1809802/subscribers/identified_user@gmail.com',
      method: 'GET',
    },
    httpRes: {
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://api.getdrip.com/v2/1809802/subscribers/unidentified_user@gmail.com',
      method: 'GET',
    },
    httpRes: {
      status: 400,
    },
  },
  ,
  {
    httpReq: {
      url: 'https://api.getdrip.com/v2/1809802/subscribers',
      method: 'POST',
    },
    httpRes: {
      status: 200,
    },
  },
];
