const klaviyoPostRequestHandler = (url, payload) => {
  switch (url) {
    case 'https://a.klaviyo.com/api/v2/list/XUepkK/subscribe':
      //resolve with status 200
      return { data: payload, status: 200 };
    case 'https://a.klaviyo.com/api/v2/list/XUepkK/members':
      //resolve with status 200
      return { data: payload, status: 200 };
    case 'https://a.klaviyo.com/api/profiles':
      if (payload.data.attributes.email === "test3@rudderstack.com") {
        return {
          status: 409,
          data: {
          }
        };
      }
      return {
        status: 201,
        data: {
          data: {
            id: '01GW3PHVY0MTCDGS0A1612HARX',
            attributes: {}
          },
        }
      };
    default:
      return new Promise((resolve, reject) => {
        if (payload) {
          resolve({ data: payload });
        } else {
          resolve({ error: 'Request failed' });
        }
      });
  }
};

module.exports = {
  klaviyoPostRequestHandler,
};
