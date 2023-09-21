import QueryString from 'qs';
import { enhanceRequestOptions } from '../../../../src/adapters/network';

export const networkCallsData = [
  {
    httpReq: enhanceRequestOptions({
      url: 'https://canny.io/api/v1/users/retrieve',
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      data: QueryString.stringify({ apiKey: 'apikey123', email: 'test@rudderstack.com' }),
    }),
    httpRes: {
      data: {
        avatarURL: 'https://canny.io/images/cddfd145056cd4bc04132ee0e7de04ee.png',
        created: '2022-07-15T11:16:32.648Z',
        email: 'test@rudderstack.com',
        id: '52d14c90fff7c80abcd12345',
        isAdmin: true,
        lastActivity: '2022-07-18T14:24:43.632Z',
        name: 'Rudder Test',
        url: 'https://ruderstack.canny.io/admin/users/dummyUser',
        userID: null,
      },
      status: 200,
    },
  },
];
