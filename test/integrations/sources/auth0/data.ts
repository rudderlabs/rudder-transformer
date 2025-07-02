import utils from '../../../../src/v0/util';

const defaultMockFns = () => {
  jest.spyOn(utils, 'generateUUID').mockReturnValue('97fcd7b2-cc24-47d7-b776-057b7b199513');
};

export const data = [
  {
    name: 'auth0',
    description: 'successful signup',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                log_id: '90020221031055712103169676686005480714681762668315934738',
                data: {
                  date: '2022-10-31T05:57:06.859Z',
                  type: 'ss',
                  description: '',
                  connection: 'Username-Password-Authentication',
                  connection_id: 'con_djwCjiwyID0vZy1S',
                  client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                  client_name: 'All Applications',
                  ip: '35.166.202.113',
                  user_agent: 'unknown',
                  details: {
                    body: {
                      email: 'testRudderlabs+21@gmail.com',
                      tenant: 'dev-cu4jy2zgao6yx15x',
                      password: 'dummyPassword',
                      client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                      connection: 'Username-Password-Authentication',
                    },
                  },
                  user_id: 'auth0|dummyPassword',
                  user_name: 'testRudderlabs+21@gmail.com',
                  strategy: 'auth0',
                  strategy_type: 'database',
                  log_id: '90020221031055712103169676686005480714681762668315934738',
                },
              }),
            },
            source: {},
          },
          {
            request: {
              body: JSON.stringify({
                log_id: '90020221031055712103169676686007898566320991926665347090',
                data: {
                  date: '2022-10-31T05:57:06.874Z',
                  type: 'sapi',
                  description: 'Create a User',
                  client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                  client_name: '',
                  ip: '35.166.202.113',
                  user_agent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
                  details: {
                    request: {
                      ip: '35.166.202.113',
                      auth: {
                        user: {
                          name: 'rudder test',
                          email: 'test@rudderstack.com',
                          user_id: 'auth0|dummyPassword',
                        },
                        strategy: 'jwt',
                        credentials: {
                          jti: '571921bf7833a97efabf08d765a0ec8f',
                          scopes: ['create:actions'],
                        },
                      },
                      body: {
                        email: 'testRudderlabs+21@gmail.com',
                        password: 'dummyPassword',
                        connection: 'Username-Password-Authentication',
                      },
                      path: '/api/v2/users',
                      query: {},
                      method: 'post',
                      channel: 'https://manage.auth0.com/',
                      userAgent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
                    },
                    response: {
                      body: {
                        name: 'testRudderlabs+21@gmail.com',
                        email: 'testRudderlabs+21@gmail.com',
                        picture:
                          'https://s.gravatar.com/avatar/0902f9d02b92aed9f0ac59aaf9475b60?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fbh.png',
                        user_id: 'auth0|dummyPassword',
                        nickname: 'testRudderlabs+21',
                        created_at: '2022-10-31T05:57:06.864Z',
                        identities: [
                          {
                            user_id: 'auth0|dummyPassword',
                            isSocial: false,
                            provider: 'auth0',
                            connection: 'Username-Password-Authentication',
                          },
                        ],
                        updated_at: '2022-10-31T05:57:06.864Z',
                        email_verified: false,
                      },
                      statusCode: 201,
                    },
                  },
                  user_id: 'auth0|dummyPassword',
                  log_id: '90020221031055712103169676686007898566320991926665347090',
                },
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
                  type: 'identify',
                  sentAt: '2022-10-31T05:57:06.859Z',
                  traits: {
                    connection: 'Username-Password-Authentication',
                    connection_id: 'con_djwCjiwyID0vZy1S',
                  },
                  userId: 'auth0|dummyPassword',
                  anonymousId: '97fcd7b2-cc24-47d7-b776-057b7b199513',
                  context: {
                    traits: {
                      userId: 'auth0|dummyPassword',
                      user_name: 'testRudderlabs+21@gmail.com',
                    },
                    library: { name: 'unknown', version: 'unknown' },
                    userAgent: 'unknown',
                    ip: '35.166.202.113',
                    request_ip: '35.166.202.113',
                    integration: { name: 'Auth0' },
                  },
                  properties: {
                    log_id: '90020221031055712103169676686005480714681762668315934738',
                    details: {
                      body: {
                        email: 'testRudderlabs+21@gmail.com',
                        tenant: 'dev-cu4jy2zgao6yx15x',
                        password: 'dummyPassword',
                        client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                        connection: 'Username-Password-Authentication',
                      },
                    },
                    client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                    client_name: 'All Applications',
                    description: '',
                    source_type: 'ss',
                  },
                  integrations: { Auth0: false },
                  originalTimestamp: '2022-10-31T05:57:06.859Z',
                },
              ],
            },
          },
          {
            output: {
              batch: [
                {
                  type: 'track',
                  event: 'Success API Operation',
                  sentAt: '2022-10-31T05:57:06.874Z',
                  userId: 'auth0|dummyPassword',
                  anonymousId: '97fcd7b2-cc24-47d7-b776-057b7b199513',
                  context: {
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { userId: 'auth0|dummyPassword' },
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
                    ip: '35.166.202.113',
                    request_ip: '35.166.202.113',
                    integration: { name: 'Auth0' },
                  },
                  properties: {
                    log_id: '90020221031055712103169676686007898566320991926665347090',
                    details: {
                      request: {
                        ip: '35.166.202.113',
                        auth: {
                          user: {
                            name: 'rudder test',
                            email: 'test@rudderstack.com',
                            user_id: 'auth0|dummyPassword',
                          },
                          strategy: 'jwt',
                          credentials: {
                            jti: '571921bf7833a97efabf08d765a0ec8f',
                            scopes: ['create:actions'],
                          },
                        },
                        body: {
                          email: 'testRudderlabs+21@gmail.com',
                          password: 'dummyPassword',
                          connection: 'Username-Password-Authentication',
                        },
                        path: '/api/v2/users',
                        query: {},
                        method: 'post',
                        channel: 'https://manage.auth0.com/',
                        userAgent:
                          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
                      },
                      response: {
                        body: {
                          name: 'testRudderlabs+21@gmail.com',
                          email: 'testRudderlabs+21@gmail.com',
                          picture:
                            'https://s.gravatar.com/avatar/0902f9d02b92aed9f0ac59aaf9475b60?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fbh.png',
                          user_id: 'auth0|dummyPassword',
                          nickname: 'testRudderlabs+21',
                          created_at: '2022-10-31T05:57:06.864Z',
                          identities: [
                            {
                              user_id: 'auth0|dummyPassword',
                              isSocial: false,
                              provider: 'auth0',
                              connection: 'Username-Password-Authentication',
                            },
                          ],
                          updated_at: '2022-10-31T05:57:06.864Z',
                          email_verified: false,
                        },
                        statusCode: 201,
                      },
                    },
                    client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                    client_name: '',
                    description: 'Create a User',
                    source_type: 'sapi',
                  },
                  integrations: { Auth0: false },
                  originalTimestamp: '2022-10-31T05:57:06.874Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'auth0',
    description: 'add member to an organization',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                log_id: '90020221031061004280169676882609459981150114445973782546',
                data: {
                  date: '2022-10-31T06:09:59.135Z',
                  type: 'sapi',
                  description: 'Add members to an organization',
                  client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                  client_name: '',
                  ip: '35.167.74.121',
                  user_agent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
                  details: {
                    request: {
                      ip: '35.167.74.121',
                      auth: {
                        user: {
                          name: 'rudder test',
                          email: 'test@rudderstack.com',
                          user_id: 'google-oauth2|123456',
                        },
                        strategy: 'jwt',
                        credentials: { jti: '571921bf7833a97efabf08d765a0ec8f' },
                      },
                      body: { members: ['auth0|123456'] },
                      path: '/api/v2/organizations/org_eoe8p2atZ7furBxg/members',
                      query: {},
                      method: 'post',
                      channel: 'https://manage.auth0.com/',
                      userAgent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
                    },
                    response: { body: {}, statusCode: 204 },
                  },
                  user_id: 'google-oauth2|123456',
                  log_id: '90020221031061004280169676882609459981150114445973782546',
                },
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
                  type: 'group',
                  sentAt: '2022-10-31T06:09:59.135Z',
                  userId: 'google-oauth2|123456',
                  anonymousId: '97fcd7b2-cc24-47d7-b776-057b7b199513',
                  context: {
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { userId: 'google-oauth2|123456' },
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
                    ip: '35.167.74.121',
                    request_ip: '35.167.74.121',
                    integration: { name: 'Auth0' },
                  },
                  groupId: 'org_eoe8p2atZ7furBxg',
                  properties: {
                    log_id: '90020221031061004280169676882609459981150114445973782546',
                    details: {
                      request: {
                        ip: '35.167.74.121',
                        auth: {
                          user: {
                            name: 'rudder test',
                            email: 'test@rudderstack.com',
                            user_id: 'google-oauth2|123456',
                          },
                          strategy: 'jwt',
                          credentials: { jti: '571921bf7833a97efabf08d765a0ec8f' },
                        },
                        body: { members: ['auth0|123456'] },
                        path: '/api/v2/organizations/org_eoe8p2atZ7furBxg/members',
                        query: {},
                        method: 'post',
                        channel: 'https://manage.auth0.com/',
                        userAgent:
                          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
                      },
                      response: { body: {}, statusCode: 204 },
                    },
                    client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                    client_name: '',
                    description: 'Add members to an organization',
                    source_type: 'sapi',
                  },
                  integrations: { Auth0: false },
                  originalTimestamp: '2022-10-31T06:09:59.135Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'auth0',
    description: 'update tenant settings',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                log_id: '90020221031061527239169676960191065529099349299958906898',
                data: {
                  date: '2022-10-31T06:15:25.201Z',
                  type: 'sapi',
                  description: 'Update tenant settings',
                  client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                  client_name: '',
                  ip: '35.160.3.103',
                  user_agent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
                  details: {
                    request: {
                      ip: '35.160.3.103',
                      auth: {
                        user: {
                          name: 'rudder test',
                          email: 'test@rudderstack.com',
                          user_id: 'google-oauth2|123456',
                        },
                        strategy: 'jwt',
                        credentials: {
                          jti: '571921bf7833a97efabf08d765a0ec8f',
                          scopes: ['create:actions'],
                        },
                      },
                      body: {
                        picture_url: '',
                        support_url: '',
                        friendly_name: 'mecro-action',
                        support_email: 'support@test.com',
                      },
                      path: '/api/v2/tenants/settings',
                      query: {},
                      method: 'patch',
                      channel: 'https://manage.auth0.com/',
                      userAgent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
                    },
                    response: {
                      body: {
                        flags: {
                          enable_sso: true,
                          universal_login: true,
                          disable_impersonation: true,
                          allow_changing_enable_sso: false,
                          revoke_refresh_token_grant: false,
                          disable_clickjack_protection_headers: false,
                          new_universal_login_experience_enabled: true,
                          enforce_client_authentication_on_passwordless_start: true,
                          cannot_change_enforce_client_authentication_on_passwordless_start: true,
                        },
                        picture_url: '',
                        support_url: '',
                        friendly_name: 'mecro-action',
                        support_email: 'support@test.com',
                        enabled_locales: ['en'],
                        sandbox_version: '16',
                        universal_login: {},
                      },
                      statusCode: 200,
                    },
                  },
                  user_id: 'google-oauth2|123456',
                  log_id: '90020221031061527239169676960191065529099349299958906898',
                },
              }),
            },
            source: {},
          },
          {
            request: {
              body: JSON.stringify({
                log_id: '90020221031061530247169676961198100736838335677367058450',
                data: {
                  date: '2022-10-31T06:15:25.196Z',
                  type: 'gd_tenant_update',
                  description: 'Guardian - Updates tenant settings',
                  ip: '35.160.3.103',
                  details: {
                    request: {
                      ip: '35.160.3.103',
                      auth: {
                        scopes: ['read:authenticators'],
                        subject: 'google-oauth2|123456',
                        strategy: 'jwt_api2_internal_token',
                      },
                      body: {
                        picture_url: '[REDACTED]',
                        friendly_name: '[REDACTED]',
                      },
                      path: '/api/tenants/settings',
                      query: {},
                      method: 'PATCH',
                    },
                    response: {
                      body: {
                        name: 'dev-cu4jy2zgao6yx15x',
                        picture_url: '[REDACTED]',
                        friendly_name: '[REDACTED]',
                        guardian_mfa_page: '[REDACTED]',
                      },
                      statusCode: 200,
                    },
                  },
                  user_id: 'google-oauth2|123456',
                  log_id: '90020221031061530247169676961198100736838335677367058450',
                },
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
                  type: 'track',
                  event: 'Success API Operation',
                  sentAt: '2022-10-31T06:15:25.201Z',
                  userId: 'google-oauth2|123456',
                  anonymousId: '97fcd7b2-cc24-47d7-b776-057b7b199513',
                  context: {
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { userId: 'google-oauth2|123456' },
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
                    ip: '35.160.3.103',
                    request_ip: '35.160.3.103',
                    integration: { name: 'Auth0' },
                  },
                  properties: {
                    log_id: '90020221031061527239169676960191065529099349299958906898',
                    details: {
                      request: {
                        ip: '35.160.3.103',
                        auth: {
                          user: {
                            name: 'rudder test',
                            email: 'test@rudderstack.com',
                            user_id: 'google-oauth2|123456',
                          },
                          strategy: 'jwt',
                          credentials: {
                            jti: '571921bf7833a97efabf08d765a0ec8f',
                            scopes: ['create:actions'],
                          },
                        },
                        body: {
                          picture_url: '',
                          support_url: '',
                          friendly_name: 'mecro-action',
                          support_email: 'support@test.com',
                        },
                        path: '/api/v2/tenants/settings',
                        query: {},
                        method: 'patch',
                        channel: 'https://manage.auth0.com/',
                        userAgent:
                          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
                      },
                      response: {
                        body: {
                          flags: {
                            enable_sso: true,
                            universal_login: true,
                            disable_impersonation: true,
                            allow_changing_enable_sso: false,
                            revoke_refresh_token_grant: false,
                            disable_clickjack_protection_headers: false,
                            new_universal_login_experience_enabled: true,
                            enforce_client_authentication_on_passwordless_start: true,
                            cannot_change_enforce_client_authentication_on_passwordless_start: true,
                          },
                          picture_url: '',
                          support_url: '',
                          friendly_name: 'mecro-action',
                          support_email: 'support@test.com',
                          enabled_locales: ['en'],
                          sandbox_version: '16',
                          universal_login: {},
                        },
                        statusCode: 200,
                      },
                    },
                    client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                    client_name: '',
                    description: 'Update tenant settings',
                    source_type: 'sapi',
                  },
                  integrations: { Auth0: false },
                  originalTimestamp: '2022-10-31T06:15:25.201Z',
                },
              ],
            },
          },
          {
            output: {
              batch: [
                {
                  type: 'track',
                  event: 'Guardian tenant update',
                  sentAt: '2022-10-31T06:15:25.196Z',
                  userId: 'google-oauth2|123456',
                  anonymousId: '97fcd7b2-cc24-47d7-b776-057b7b199513',
                  context: {
                    library: { name: 'unknown', version: 'unknown' },
                    traits: { userId: 'google-oauth2|123456' },
                    ip: '35.160.3.103',
                    request_ip: '35.160.3.103',
                    integration: { name: 'Auth0' },
                  },
                  properties: {
                    log_id: '90020221031061530247169676961198100736838335677367058450',
                    details: {
                      request: {
                        ip: '35.160.3.103',
                        auth: {
                          scopes: ['read:authenticators'],
                          subject: 'google-oauth2|123456',
                          strategy: 'jwt_api2_internal_token',
                        },
                        body: {
                          picture_url: '[REDACTED]',
                          friendly_name: '[REDACTED]',
                        },
                        path: '/api/tenants/settings',
                        query: {},
                        method: 'PATCH',
                      },
                      response: {
                        body: {
                          name: 'dev-cu4jy2zgao6yx15x',
                          picture_url: '[REDACTED]',
                          friendly_name: '[REDACTED]',
                          guardian_mfa_page: '[REDACTED]',
                        },
                        statusCode: 200,
                      },
                    },
                    description: 'Guardian - Updates tenant settings',
                    source_type: 'gd_tenant_update',
                  },
                  integrations: { Auth0: false },
                  originalTimestamp: '2022-10-31T06:15:25.196Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'auth0',
    description: 'missing userId',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                log_id: '90020221031055712103169676686005480714681762668315934738',
                data: {
                  date: '2022-10-31T05:57:06.859Z',
                  type: 'ss',
                  description: '',
                  connection: 'Username-Password-Authentication',
                  connection_id: 'con_djwCjiwyID0vZy1S',
                  client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                  client_name: 'All Applications',
                  ip: '35.166.202.113',
                  user_agent: 'unknown',
                  details: {
                    body: {
                      email: 'testRudderlabs+21@gmail.com',
                      tenant: 'dev-cu4jy2zgao6yx15x',
                      password: 'dummyPassword',
                      client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                      connection: 'Username-Password-Authentication',
                    },
                  },
                  user_id: '',
                  user_name: 'testRudderlabs+21@gmail.com',
                  strategy: 'auth0',
                  strategy_type: 'database',
                  log_id: '90020221031055712103169676686005480714681762668315934738',
                },
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
                  type: 'identify',
                  sentAt: '2022-10-31T05:57:06.859Z',
                  traits: {
                    connection: 'Username-Password-Authentication',
                    connection_id: 'con_djwCjiwyID0vZy1S',
                  },
                  userId: '',
                  anonymousId: '97fcd7b2-cc24-47d7-b776-057b7b199513',
                  context: {
                    traits: {
                      userId: '',
                      user_name: 'testRudderlabs+21@gmail.com',
                    },
                    library: { name: 'unknown', version: 'unknown' },
                    userAgent: 'unknown',
                    ip: '35.166.202.113',
                    request_ip: '35.166.202.113',
                    integration: { name: 'Auth0' },
                  },
                  properties: {
                    log_id: '90020221031055712103169676686005480714681762668315934738',
                    details: {
                      body: {
                        email: 'testRudderlabs+21@gmail.com',
                        tenant: 'dev-cu4jy2zgao6yx15x',
                        password: 'dummyPassword',
                        client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                        connection: 'Username-Password-Authentication',
                      },
                    },
                    client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                    client_name: 'All Applications',
                    description: '',
                    source_type: 'ss',
                  },
                  integrations: { Auth0: false },
                  originalTimestamp: '2022-10-31T05:57:06.859Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'auth0',
    description: 'missing userId for all the requests in a batch',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                log_id: '90020221031055712103169676686005480714681762668315934738',
                data: {
                  date: '2022-10-31T05:57:06.859Z',
                  type: 'ss',
                  description: '',
                  connection: 'Username-Password-Authentication',
                  connection_id: 'con_djwCjiwyID0vZy1S',
                  client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                  client_name: 'All Applications',
                  ip: '35.166.202.113',
                  user_agent: 'unknown',
                  details: {
                    body: {
                      email: 'testRudderlabs+21@gmail.com',
                      tenant: 'dev-cu4jy2zgao6yx15x',
                      password: 'dummyPassword',
                      client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                      connection: 'Username-Password-Authentication',
                    },
                  },
                  user_id: '',
                  user_name: 'testRudderlabs+21@gmail.com',
                  strategy: 'auth0',
                  strategy_type: 'database',
                  log_id: '90020221031055712103169676686005480714681762668315934738',
                },
              }),
            },
            source: {},
          },
          {
            request: {
              body: JSON.stringify({
                log_id: '90020221031055712103169676686007898566320991926665347090',
                data: {
                  date: '2022-10-31T05:57:06.874Z',
                  type: 'sapi',
                  description: 'Create a User',
                  client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                  client_name: '',
                  ip: '35.166.202.113',
                  user_agent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
                  log_id: '90020221031055712103169676686007898566320991926665347090',
                },
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
                  type: 'identify',
                  userId: '',
                  anonymousId: '97fcd7b2-cc24-47d7-b776-057b7b199513',
                  sentAt: '2022-10-31T05:57:06.859Z',
                  traits: {
                    connection: 'Username-Password-Authentication',
                    connection_id: 'con_djwCjiwyID0vZy1S',
                  },
                  context: {
                    traits: {
                      userId: '',
                      user_name: 'testRudderlabs+21@gmail.com',
                    },
                    library: { name: 'unknown', version: 'unknown' },
                    userAgent: 'unknown',
                    ip: '35.166.202.113',
                    request_ip: '35.166.202.113',
                    integration: { name: 'Auth0' },
                  },
                  properties: {
                    log_id: '90020221031055712103169676686005480714681762668315934738',
                    details: {
                      body: {
                        email: 'testRudderlabs+21@gmail.com',
                        tenant: 'dev-cu4jy2zgao6yx15x',
                        password: 'dummyPassword',
                        client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                        connection: 'Username-Password-Authentication',
                      },
                    },
                    client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                    client_name: 'All Applications',
                    description: '',
                    source_type: 'ss',
                  },
                  integrations: { Auth0: false },
                  originalTimestamp: '2022-10-31T05:57:06.859Z',
                },
              ],
            },
          },
          {
            output: {
              batch: [
                {
                  type: 'track',
                  event: 'Success API Operation',
                  sentAt: '2022-10-31T05:57:06.874Z',
                  anonymousId: '97fcd7b2-cc24-47d7-b776-057b7b199513',
                  context: {
                    library: { name: 'unknown', version: 'unknown' },
                    userAgent:
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
                    ip: '35.166.202.113',
                    request_ip: '35.166.202.113',
                    integration: { name: 'Auth0' },
                  },
                  properties: {
                    log_id: '90020221031055712103169676686007898566320991926665347090',
                    client_id: 'vQcJNDTxsM1W72eHFonRJdzyOvawlwIt',
                    client_name: '',
                    description: 'Create a User',
                    source_type: 'sapi',
                  },
                  integrations: { Auth0: false },
                  originalTimestamp: '2022-10-31T05:57:06.874Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'auth0',
    description: 'empty batch',
    module: 'source',
    version: 'v2',
    skipGo: 'Created this case manually',
    input: {
      request: {
        body: [],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: { response: { status: 200, body: [] } },
  },
].map((tc) => ({
  ...tc,
  mockFns: () => {
    defaultMockFns();
  },
}));
