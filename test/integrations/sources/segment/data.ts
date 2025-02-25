import utils from '../../../../src/v0/util';
import { SrcTestCaseData } from '../../testTypes';

const defaultMockFns = () => {
  jest.spyOn(utils, 'generateUUID').mockReturnValue('97fcd7b2-cc24-47d7-b776-057b7b199513');
};

export const data: SrcTestCaseData[] = [
  {
    name: 'segment',
    description: 'test-0',
    module: 'source',
    version: 'v2',
    skipGo: 'NoAnonID error',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                date: '2020-07-10T07:43:07.766Z',
                type: 's',
                connection_id: '',
                client_id: '********************************',
                client_name: 'My App',
                ip: '47.15.6.58',
                user_agent: 'Chrome Mobile 69.0.3497 / Android 0.0.0',
                details: {
                  prompts: [],
                  completedAt: 1594366987765,
                  elapsedTime: null,
                  session_id: '**************_***************',
                },
                hostname: '************.us.auth0.com',
                user_id: 'auth0|************************',
                user_name: 'example@test.com',
                auth0_client: {
                  name: 'Auth0.Android',
                  env: { android: '28' },
                  version: '1.23.0',
                },
                log_id: '********************************************************',
                _id: '********************************************************',
                isMobile: true,
              }),
            },
            source: {},
          },
          {
            request: {
              body: JSON.stringify({
                date: '2020-07-10T07:43:09.620Z',
                type: 'seacft',
                description: '',
                connection_id: '',
                client_id: '********************************',
                client_name: 'My App',
                ip: '47.15.6.58',
                user_agent: 'okhttp 2.7.5 / Other 0.0.0',
                details: { code: '*************Xst' },
                hostname: '************.us.auth0.com',
                user_id: 'auth0|************************',
                user_name: 'example@test.com',
                auth0_client: {
                  name: 'Auth0.Android',
                  env: { android: '28' },
                  version: '1.23.0',
                },
                log_id: '********************************************************',
                _id: '********************************************************',
                isMobile: false,
              }),
            },
            source: {},
          },
          {
            request: {
              body: JSON.stringify({
                date: '2020-07-10T07:43:07.766Z',
                connection_id: '',
                client_id: '********************************',
                client_name: 'My App',
                ip: '47.15.6.58',
                user_agent: 'Chrome Mobile 69.0.3497 / Android 0.0.0',
                details: {
                  prompts: [],
                  completedAt: 1594366987765,
                  elapsedTime: null,
                  session_id: '**************_***************',
                },
                hostname: '************.us.auth0.com',
                user_id: 'auth0|************************',
                user_name: 'example@test.com',
                auth0_client: {
                  name: 'Auth0.Android',
                  env: { android: '28' },
                  version: '1.23.0',
                },
                log_id: '********************************************************',
                _id: '********************************************************',
                isMobile: true,
              }),
            },
            source: {},
          },
          {
            request: {
              body: JSON.stringify({
                type: 's',
                connection_id: '',
                client_id: '********************************',
                client_name: 'My App',
                ip: '47.15.6.58',
                user_agent: 'Chrome Mobile 69.0.3497 / Android 0.0.0',
                details: {
                  prompts: [],
                  completedAt: 1594366987765,
                  elapsedTime: null,
                  session_id: '**************_***************',
                },
                hostname: '************.us.auth0.com',
                user_id: 'auth0|************************',
                user_name: 'example@test.com',
                auth0_client: {
                  name: 'Auth0.Android',
                  env: { android: '28' },
                  version: '1.23.0',
                },
                log_id: '********************************************************',
                _id: '********************************************************',
                isMobile: true,
              }),
            },
            source: {},
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  date: '2020-07-10T07:43:07.766Z',
                  type: 's',
                  connection_id: '',
                  client_id: '********************************',
                  client_name: 'My App',
                  ip: '47.15.6.58',
                  user_agent: 'Chrome Mobile 69.0.3497 / Android 0.0.0',
                  details: {
                    prompts: [],
                    completedAt: 1594366987765,
                    elapsedTime: null,
                    session_id: '**************_***************',
                  },
                  context: {},
                  hostname: '************.us.auth0.com',
                  user_id: 'auth0|************************',
                  user_name: 'example@test.com',
                  auth0_client: {
                    name: 'Auth0.Android',
                    env: { android: '28' },
                    version: '1.23.0',
                  },
                  log_id: '********************************************************',
                  _id: '********************************************************',
                  isMobile: true,
                },
              ],
            },
          },
          {
            output: {
              batch: [
                {
                  date: '2020-07-10T07:43:09.620Z',
                  type: 'seacft',
                  context: {},
                  description: '',
                  connection_id: '',
                  client_id: '********************************',
                  client_name: 'My App',
                  ip: '47.15.6.58',
                  user_agent: 'okhttp 2.7.5 / Other 0.0.0',
                  details: { code: '*************Xst' },
                  hostname: '************.us.auth0.com',
                  user_id: 'auth0|************************',
                  user_name: 'example@test.com',
                  auth0_client: {
                    name: 'Auth0.Android',
                    env: { android: '28' },
                    version: '1.23.0',
                  },
                  log_id: '********************************************************',
                  _id: '********************************************************',
                  isMobile: false,
                },
              ],
            },
          },
          {
            output: {
              batch: [
                {
                  date: '2020-07-10T07:43:07.766Z',
                  connection_id: '',
                  client_id: '********************************',
                  client_name: 'My App',
                  ip: '47.15.6.58',
                  context: {},
                  user_agent: 'Chrome Mobile 69.0.3497 / Android 0.0.0',
                  details: {
                    prompts: [],
                    completedAt: 1594366987765,
                    elapsedTime: null,
                    session_id: '**************_***************',
                  },
                  hostname: '************.us.auth0.com',
                  user_id: 'auth0|************************',
                  user_name: 'example@test.com',
                  auth0_client: {
                    name: 'Auth0.Android',
                    env: { android: '28' },
                    version: '1.23.0',
                  },
                  log_id: '********************************************************',
                  _id: '********************************************************',
                  isMobile: true,
                },
              ],
            },
          },
          {
            output: {
              batch: [
                {
                  type: 's',
                  connection_id: '',
                  client_id: '********************************',
                  client_name: 'My App',
                  ip: '47.15.6.58',
                  context: {},
                  user_agent: 'Chrome Mobile 69.0.3497 / Android 0.0.0',
                  details: {
                    prompts: [],
                    completedAt: 1594366987765,
                    elapsedTime: null,
                    session_id: '**************_***************',
                  },
                  hostname: '************.us.auth0.com',
                  user_id: 'auth0|************************',
                  user_name: 'example@test.com',
                  auth0_client: {
                    name: 'Auth0.Android',
                    env: { android: '28' },
                    version: '1.23.0',
                  },
                  log_id: '********************************************************',
                  _id: '********************************************************',
                  isMobile: true,
                },
              ],
            },
          },
        ],
      },
    },
  },
].map((tc) => ({
  ...tc,
  mockFns(_) {
    defaultMockFns();
  },
}));
