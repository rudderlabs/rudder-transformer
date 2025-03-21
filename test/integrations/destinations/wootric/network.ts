import {
  secretInvalidToken,
  secretAccountToken,
  secretAccessToken,
  secretRefreshToken,
} from './maskedSecrets';

export const networkCallsData = [
  {
    httpReq: {
      url: 'https://api.wootric.com/v1/end_users/dummyId1?lookup_by_external_id=true',
      method: 'GET',
    },
    httpRes: {
      status: 200,
      data: {
        id: 486438462,
        created_at: '2022-08-10 11:39:50 -0700',
        updated_at: '2022-08-10 11:39:50 -0700',
        email: 'dummyuser1@gmail.com',
        last_surveyed: '2022-01-20 05:39:21 -0800',
        external_created_at: 1611149961,
        last_seen_at: null,
        properties: {
          city: 'Mumbai',
          name: 'Dummy User 1',
          title: 'SDE',
          gender: 'Male',
          company: 'Rudderstack',
        },
        phone_number: '+19123456789',
        external_id: 'dummyId1',
        last_response: null,
        settings: {
          email_nps: true,
          mobile_nps: true,
          web_nps: true,
          force_mobile_survey: null,
          force_web_survey: null,
          surveys_disabled_by_end_user: null,
        },
      },
    },
  },
  {
    httpReq: {
      url: 'https://api.wootric.com/v1/end_users/exclueFunTestId?lookup_by_external_id=true',
      method: 'GET',
    },
    httpRes: {
      status: 200,
      data: {
        id: 486336190,
        created_at: '2022-08-10 07:30:50 -0700',
        updated_at: '2022-08-10 10:12:46 -0700',
        email: 'excludeUser@gmail.com',
        last_surveyed: '2022-01-20 05:39:21 -0800',
        external_created_at: 1579755367,
        last_seen_at: null,
        properties: {
          city: 'Mumbai',
          name: 'exclude test user',
          email: 'excludeUser@gmail.com',
          title: 'AD',
          gender: 'Male',
          company: 'Rockstar',
        },
        phone_number: '+18324671283',
        external_id: 'exclueFunTestId',
        last_response: null,
        settings: {
          email_nps: true,
          mobile_nps: true,
          web_nps: true,
          force_mobile_survey: null,
          force_web_survey: null,
          surveys_disabled_by_end_user: null,
        },
      },
    },
  },
  {
    httpReq: {
      url: 'https://api.wootric.com/v1/end_users/my-external-id-1234?lookup_by_external_id=true',
      method: 'POST',
    },
    httpRes: {
      status: 200,
      data: {
        type: 'error_list',
        errors: [
          {
            status: 'record_not_found',
            message: 'The record could not be found',
            field: null,
          },
        ],
      },
    },
  },
  {
    httpReq: {
      url: 'https://api.wootric.com/v1/end_users/490635419',
      method: 'GET',
    },
    httpRes: {
      data: {
        id: 490635419,
        created_at: '2022-08-20 00:55:26 -0700',
        updated_at: '2022-08-22 11:17:05 -0700',
        email: 'firstuser@gmail.com',
        last_surveyed: '2022-08-01 00:11:44 -0700',
        external_created_at: 1661002761,
        last_seen_at: null,
        properties: {
          Department: 'Marketing',
          product_plan: 'Web',
          'revenue amount': '5000',
        },
        phone_number: '+8859133456781',
        external_id: 'firstUserId123',
        last_response: {
          id: 101013218,
          score: 9,
          text: 'Good !!!',
          survey: {
            channel: 'web',
          },
        },
        settings: {
          email_nps: true,
          mobile_nps: true,
          web_nps: true,
          force_mobile_survey: null,
          force_web_survey: null,
          surveys_disabled_by_end_user: null,
        },
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://api.wootric.com/oauth/token?account_token=${secretAccountToken}`,
      method: 'POST',
    },
    httpRes: {
      data: {
        access_token: secretAccessToken,
        token_type: 'Bearer',
        expires_in: 7200,
        refresh_token: secretRefreshToken,
        scope: 'delete_account admin respond export read survey invalidate_response',
        created_at: 1660292389,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://api.wootric.com/v1/end_users/dummyId2?lookup_by_external_id=true',
      method: 'GET',
    },
    httpRes: {
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://api.wootric.com/v1/end_users/12345',
      method: 'GET',
    },
    httpRes: {
      status: 200,
    },
  },
  {
    httpReq: {
      url: `https://api.wootric.com/oauth/token?account_token=${secretInvalidToken}`,
      method: 'POST',
    },
    httpRes: {
      data: {
        error: 'Not found',
        status: 404,
      },
    },
  },
];
