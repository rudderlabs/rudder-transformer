import { authHeader1, authHeader2, authHeader3 } from './maskedSecrets';

const deleteNwData = [
  {
    httpReq: {
      method: 'post',
      url: 'https://www.googleapis.com/analytics/v3/userDeletion/userDeletionRequests:upsert',
      data: {
        kind: 'analytics#userDeletionRequest',
        id: {
          type: 'USER_ID',
          userId: 'test_user_1',
        },
        webPropertyId: 'UA-123456789-5',
      },
      headers: {
        Authorization: authHeader1,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: {
        kind: 'analytics#userDeletionRequest',
        id: {
          type: 'USER_ID',
          userId: 'test_user_1',
        },
        webPropertyId: 'UA-123456789-5',
        deletionRequestTime: '2022-11-04T10:39:57.933Z',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://www.googleapis.com/analytics/v3/userDeletion/userDeletionRequests:upsert',
      data: {
        kind: 'analytics#userDeletionRequest',
        id: {
          type: 'USER_ID',
          userId: 'test_user_2',
        },
        webPropertyId: 'UA-123456789-5',
      },
      headers: {
        Authorization: authHeader1,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: {
        kind: 'analytics#userDeletionRequest',
        id: {
          type: 'USER_ID',
          userId: 'test_user_2',
        },
        webPropertyId: 'UA-123456789-5',
        deletionRequestTime: '2022-11-04T10:39:57.933Z',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://www.googleapis.com/analytics/v3/userDeletion/userDeletionRequests:upsert',
      data: {
        kind: 'analytics#userDeletionRequest',
        id: {
          type: 'USER_ID',
          userId: 'test_user_3',
        },
        webPropertyId: 'UA-123456789-6',
      },
      headers: {
        Authorization: authHeader2,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: {
        error: {
          code: 401,
          message:
            'Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.',
          status: 'UNAUTHENTICATED',
        },
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://www.googleapis.com/analytics/v3/userDeletion/userDeletionRequests:upsert',
      data: {
        kind: 'analytics#userDeletionRequest',
        id: {
          type: 'USER_ID',
          userId: 'test_user_4',
        },
        webPropertyId: 'UA-123456789-6',
      },
      headers: {
        Authorization: authHeader2,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: {
        error: {
          code: 401,
          message:
            'Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.',
          status: 'UNAUTHENTICATED',
        },
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://www.googleapis.com/analytics/v3/userDeletion/userDeletionRequests:upsert',
      data: {
        kind: 'analytics#userDeletionRequest',
        id: {
          type: 'USER_ID',
          userId: 'test_user_5',
        },
        webPropertyId: 'UA-123456789-7',
      },
      headers: {
        Authorization: authHeader1,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: {
        kind: 'analytics#userDeletionRequest',
        id: {
          type: 'USER_ID',
          userId: 'test_user_5',
        },
        webPropertyId: 'UA-123456789-7',
        deletionRequestTime: '2022-11-04T10:39:57.933Z',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://www.googleapis.com/analytics/v3/userDeletion/userDeletionRequests:upsert',
      data: {
        kind: 'analytics#userDeletionRequest',
        id: {
          type: 'USER_ID',
          userId: 'test_user_6',
        },
        webPropertyId: 'UA-123456789-7',
      },
      headers: {
        Authorization: authHeader1,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: {
        kind: 'analytics#userDeletionRequest',
        id: {
          type: 'USER_ID',
          userId: 'test_user_6',
        },
        webPropertyId: 'UA-123456789-7',
        deletionRequestTime: '2022-11-04T10:39:57.933Z',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://www.googleapis.com/analytics/v3/userDeletion/userDeletionRequests:upsert',
      data: {
        kind: 'analytics#userDeletionRequest',
        id: {
          type: 'USER_ID',
          userId: 'test_user_7',
        },
        webPropertyId: 'UA-123456789-7',
      },
      headers: {
        Authorization: authHeader1,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: {
        error: {
          errors: [
            {
              domain: 'global',
              reason: 'invalidParameter',
              message: '[dummy response] The parameter used to query is not correct',
            },
          ],
          code: 403,
          message: '[dummy response] The parameter used to query is not correct',
        },
      },
      status: 403,
      statusText: 'Bad Request',
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://www.googleapis.com/analytics/v3/userDeletion/userDeletionRequests:upsert',
      data: {
        kind: 'analytics#userDeletionRequest',
        id: {
          type: 'USER_ID',
          userId: 'test_user_8',
        },
        webPropertyId: 'UA-123456789-7',
      },
      headers: {
        Authorization: authHeader1,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: {
        kind: 'analytics#userDeletionRequest',
        id: {
          type: 'USER_ID',
          userId: 'test_user_8',
        },
        webPropertyId: 'UA-123456789-7',
        deletionRequestTime: '2022-11-04T10:39:57.933Z',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://www.googleapis.com/analytics/v3/userDeletion/userDeletionRequests:upsert',
      data: {
        kind: 'analytics#userDeletionRequest',
        id: {
          type: 'USER_ID',
          userId: 'test_user_9',
        },
        webPropertyId: 'UA-123456789-7',
      },
      headers: {
        Authorization: authHeader1,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: {
        kind: 'analytics#userDeletionRequest',
        id: {
          type: 'USER_ID',
          userId: 'test_user_9',
        },
        webPropertyId: 'UA-123456789-7',
        deletionRequestTime: '2022-11-04T10:39:57.933Z',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    httpReq: {
      method: 'post',
      url: 'https://www.googleapis.com/analytics/v3/userDeletion/userDeletionRequests:upsert',
      data: {
        kind: 'analytics#userDeletionRequest',
        id: {
          type: 'USER_ID',
          userId: 'test_user_20',
        },
        webPropertyId: 'UA-123456789-7',
      },
      headers: {
        Authorization: authHeader3,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    httpRes: {
      data: {
        error: {
          errors: [
            {
              reason: 'insufficientPermissions',
            },
          ],
          code: 403,
          message: 'User does not have sufficient permissions',
        },
      },
      status: 200,
      statusText: 'OK',
    },
  },
];
export const networkCallsData = [...deleteNwData];
