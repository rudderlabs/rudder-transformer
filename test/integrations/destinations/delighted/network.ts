import { authHeader1 } from './maskedSecrets';

export const networkCallsData = [
  {
    httpReq: {
      url: 'https://api.delighted.com/v1/people.json',
      method: 'GET',
      headers: { Authorization: authHeader1 },
      params: {
        email: 'identified_user@email.com',
      },
    },
    httpRes: {
      data: ['user data'],
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://api.delighted.com/v1/people.json',
      method: 'GET',
      headers: { Authorization: authHeader1 },
      params: {
        email: 'unidentified_user@email.com',
      },
    },
    httpRes: {
      data: [],
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://api.delighted.com/v1/people.json',
      method: 'GET',
      headers: { Authorization: authHeader1 },
      params: {
        email: 'test429@rudderlabs.com',
      },
    },
    httpRes: {
      status: 429,
      data: {},
    },
  },
];
