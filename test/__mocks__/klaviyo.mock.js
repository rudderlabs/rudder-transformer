const klaviyoPostRequestHandler = (url, payload) => {
  switch (url) {
    case 'https://a.klaviyo.com/api/v2/list/XUepkK/subscribe':
      //resolve with status 200
      return { data: payload, status: 200 };
    case 'https://a.klaviyo.com/api/v2/list/XUepkK/members':
      //resolve with status 200
      return { data: payload, status: 200 };
    case 'https://a.klaviyo.com/api/profiles':
      return {
        response: {
          data: {
            errors: [
              {
                id: '930c0a97-f31a-4807-a35c-f6c94a1daa1e',
                status: 409,
                code: 'duplicate_profile',
                title: 'Conflict.',
                detail: 'A profile already exists with one of these identifiers.',
                source: {
                  pointer: '/data/attributes',
                },
                meta: {
                  duplicate_profile_id: '01GW3PHVY0MTCDGS0A1612HARX',
                },
              },
            ],
          },
          status: 409,
        },
        success: false,
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
