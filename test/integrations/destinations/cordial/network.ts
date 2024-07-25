import { destination } from './common';
export const networkCallsData = [
  {
    httpReq: {
      url: `${destination.Config.apiBaseUrl}/v2/contacts/email:johndoe@example.com`,
      headers: {
        Authorization: 'Basic dGVzdC1hcGkta2V5Og==',
      },
      method: 'GET',
    },
    httpRes: {
      data: {
        _id: '6690fe3655e334d6270287b5',
        attributes: {
          createdAt: '2024-07-12T09:58:14+0000',
          address: {
            city: 'San Miego',
          },
          first_name: 'John',
          last_name: 'Doe',
          lastUpdateSource: 'api',
          lastModified: '2024-07-12T13:00:49+0000',
          cID: '6690fe3655e334d6270287b5',
        },
        channels: {
          email: {
            address: 'johndoe@example.com',
            subscribeStatus: 'subscribed',
            subscribedAt: '2024-07-12T09:58:14+0000',
          },
        },
      },
      status: 200,
      statusText: 'Ok',
    },
  },
  {
    httpReq: {
      url: `${destination.Config.apiBaseUrl}/v2/contacts/6690fe3655e334d6270287b5`,
      headers: {
        Authorization: 'Basic dGVzdC1hcGkta2V5Og==',
      },
      method: 'GET',
    },
    httpRes: {
      data: {
        _id: '6690fe3655e334d6270287b5',
        attributes: {
          createdAt: '2024-07-12T09:58:14+0000',
          address: {
            city: 'San Miego',
          },
          first_name: 'John',
          last_name: 'Doe',
          lastUpdateSource: 'api',
          lastModified: '2024-07-12T13:00:49+0000',
          cID: '6690fe3655e334d6270287b5',
        },
        channels: {
          email: {
            address: 'johndoe@example.com',
            subscribeStatus: 'subscribed',
            subscribedAt: '2024-07-12T09:58:14+0000',
          },
        },
      },
      status: 200,
      statusText: 'Ok',
    },
  },
];
