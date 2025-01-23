import { overrideDestination } from '../../../testUtils';
import { sampleDestination, defaultMockFns, destinationWithSetOnceProperty } from '../common';

export const data = [
  {
    name: 'mp',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, { token: 'test_api_token' }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              name: 'Contact Us',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {},
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                campaign: {
                  name: 'test_name',
                  source: 'rudder',
                  medium: 'test_medium',
                  term: 'test_tem',
                  content: 'test_content',
                  test: 'test',
                  keyword: 'test_keyword',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: 'dd266c67-9199-4a52-ba32-f46ddde67312',
              originalTimestamp: '2020-01-24T06:29:02.358Z',
              page: {
                path: '/destinations/mixpanel',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/mixpanel',
                category: 'destination',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.359Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'page',
              userId: 'hjikl',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"Loaded a Page","properties":{"ip":"0.0.0.0","campaign_id":"test_name","$user_id":"hjikl","$current_url":"https://docs.rudderstack.com/destinations/mixpanel","$screen_dpi":2,"mp_lib":"RudderLabs JavaScript SDK","$app_build_number":"1.0.0","$app_version_string":"1.0.5","$insert_id":"dd266c67-9199-4a52-ba32-f46ddde67312","token":"test_api_token","distinct_id":"hjikl","time":1579847342402,"utm_campaign":"test_name","utm_source":"rudder","utm_medium":"test_medium","utm_term":"test_tem","utm_content":"test_content","utm_test":"test","utm_keyword":"test_keyword","name":"Contact Us","$browser":"Chrome","$browser_version":"79.0.3945.117"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'hjikl',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'mp',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              useUserDefinedPageEventName: true,
              userDefinedPageEventTemplate: 'Viewed a {{ name }} page',
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              name: 'Contact Us',
              category: 'Contact',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {},
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: 'dd266c67-9199-4a52-ba32-f46ddde67312',
              originalTimestamp: '2020-01-24T06:29:02.358Z',
              page: {
                path: '/destinations/mixpanel',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/mixpanel',
                category: 'destination',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.359Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'page',
              userId: 'hjikl',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"Viewed a Contact Us page","properties":{"ip":"0.0.0.0","$user_id":"hjikl","$current_url":"https://docs.rudderstack.com/destinations/mixpanel","$screen_dpi":2,"mp_lib":"RudderLabs JavaScript SDK","$app_build_number":"1.0.0","$app_version_string":"1.0.5","$insert_id":"dd266c67-9199-4a52-ba32-f46ddde67312","token":"test_api_token","distinct_id":"hjikl","time":1579847342402,"name":"Contact Us","category":"Contact","$browser":"Chrome","$browser_version":"79.0.3945.117"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'hjikl',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'mp',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: sampleDestination,
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'mobile',
              name: 'Contact Us',
              properties: { category: 'communication' },
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs Android SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: 'dd266c67-9199-4a52-ba32-f46ddde67312',
              originalTimestamp: '2020-01-24T06:29:02.358Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.359Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'screen',
              userId: 'hjikl',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"Loaded a Screen","properties":{"category":"communication","ip":"0.0.0.0","$user_id":"hjikl","$screen_dpi":2,"mp_lib":"RudderLabs JavaScript SDK","$app_build_number":"1.0.0","$app_version_string":"1.0.5","$insert_id":"dd266c67-9199-4a52-ba32-f46ddde67312","token":"test_api_token","distinct_id":"hjikl","time":1579847342402,"name":"Contact Us"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'hjikl',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'mp',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: sampleDestination,
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'mobile',
              name: 'Contact Us',
              category: 'Contact',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs Android SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: 'dd266c67-9199-4a52-ba32-f46ddde67312',
              originalTimestamp: '2020-01-24T06:29:02.358Z',
              properties: {
                path: '/tests/html/index2.html',
                referrer: '',
                search: '',
                title: '',
                url: 'http://localhost/tests/html/index2.html',
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.359Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'screen',
              userId: 'hjiklmk',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"Loaded a Screen","properties":{"path":"/tests/html/index2.html","referrer":"","search":"","title":"","url":"http://localhost/tests/html/index2.html","ip":"0.0.0.0","$user_id":"hjiklmk","$screen_dpi":2,"mp_lib":"RudderLabs Android SDK","$app_build_number":"1.0.0","$app_version_string":"1.0.5","$insert_id":"dd266c67-9199-4a52-ba32-f46ddde67312","token":"test_api_token","distinct_id":"hjiklmk","time":1579847342402,"name":"Contact Us","category":"Contact"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'hjiklmk',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'mp',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: sampleDestination,
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'mobile',
              name: 'Contact Us',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs Android SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: 'dd266c67-9199-4a52-ba32-f46ddde67312',
              originalTimestamp: '2020-01-24T06:29:02.358Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.359Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'screen',
              userId: 'hjikl',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"Loaded a Screen","properties":{"ip":"0.0.0.0","$user_id":"hjikl","$screen_dpi":2,"mp_lib":"RudderLabs JavaScript SDK","$app_build_number":"1.0.0","$app_version_string":"1.0.5","$insert_id":"dd266c67-9199-4a52-ba32-f46ddde67312","token":"test_api_token","distinct_id":"hjikl","time":1579847342402,"name":"Contact Us"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'hjikl',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, { useNewMapping: true }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstName: 'Mickey',
                  lastName: 'Mouse',
                  createdAt: '2020-01-23T08:54:02.362Z',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              page: {
                path: '/destinations/mixpanel',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/mixpanel',
                category: 'destination',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$created":"2020-01-23T08:54:02.362Z","$email":"mickey@disney.com","$first_name":"Mickey","$last_name":"Mouse","$country_code":"USA","$city":"Disney","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$name":"Mickey Mouse","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","$ip":"0.0.0.0","$time":1579847342402}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              propIncrements: [
                { property: 'counter' },
                { property: 'item_purchased' },
                { property: 'number_of_logins' },
              ],
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstName: 'Mickey',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                campaign: {
                  name: 'test_name',
                  source: 'rudder',
                  medium: 'test_medium',
                  term: 'test_tem',
                  content: 'test_content',
                  test: 'test',
                  keyword: 'test_keyword',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'test revenue MIXPANEL',
              integrations: { All: true },
              messageId: 'a6a0ad5a-bd26-4f19-8f75-38484e580fc7',
              originalTimestamp: '2020-01-24T06:29:02.364Z',
              properties: {
                currency: 'USD',
                revenue: 45.89,
                counter: 1,
                item_purchased: '2',
                number_of_logins: '',
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53710',
              sentAt: '2020-01-24T06:29:02.364Z',
              timestamp: '2020-01-24T11:59:02.403+05:30',
              type: 'track',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$append":{"$transactions":{"$time":"2020-01-24T06:29:02.403Z","$amount":45.89}},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca"}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$add":{"counter":1,"item_purchased":"2"},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca"}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"test revenue MIXPANEL","properties":{"currency":"USD","revenue":45.89,"counter":1,"item_purchased":"2","number_of_logins":"","city":"Disney","country":"USA","email":"mickey@disney.com","firstName":"Mickey","ip":"0.0.0.0","campaign_id":"test_name","$current_url":"https://docs.rudderstack.com/destinations/mixpanel","$screen_dpi":2,"mp_lib":"RudderLabs JavaScript SDK","$app_build_number":"1.0.0","$app_version_string":"1.0.5","$insert_id":"a6a0ad5a-bd26-4f19-8f75-38484e580fc7","token":"test_api_token","distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","time":1579847342403,"utm_campaign":"test_name","utm_source":"rudder","utm_medium":"test_medium","utm_term":"test_tem","utm_content":"test_content","utm_test":"test","utm_keyword":"test_keyword","$browser":"Chrome","$browser_version":"79.0.3945.117"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'mp',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: sampleDestination,
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstname: 'Mickey',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '79313729-7fe5-4204-963a-dc46f4205e4e',
              originalTimestamp: '2020-01-24T06:29:02.366Z',
              previousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53711',
              sentAt: '2020-01-24T06:29:02.366Z',
              timestamp: '2020-01-24T11:59:02.403+05:30',
              type: 'alias',
              userId: '1234abc',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"$create_alias","properties":{"distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","alias":"1234abc","token":"test_api_token"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '1234abc',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'mp',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              propIncrements: [{ property: '' }],
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstName: 'Mickey',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'KM Order Completed',
              integrations: { All: true },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              properties: {
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                coupon: 'hasbros',
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                products: [
                  {
                    category: 'Games',
                    image_url: 'https:///www.example.com/product/path.jpg',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    product_id: '507f1f77bcf86cd799439011',
                    quantity: 1,
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                  },
                  {
                    category: 'Games',
                    name: 'Uno Card Game',
                    price: 3,
                    product_id: '505bd76785ebb509fc183733',
                    quantity: 2,
                    sku: '46493-32',
                  },
                ],
                revenue: 25,
                shipping: 3,
                subtotal: 22.5,
                tax: 2,
                total: 27.5,
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'track',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$append":{"$transactions":{"$time":"2020-01-24T06:29:02.402Z","$amount":25}},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca"}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"KM Order Completed","properties":{"affiliation":"Google Store","checkout_id":"fksdjfsdjfisjf9sdfjsd9f","coupon":"hasbros","currency":"USD","discount":2.5,"order_id":"50314b8e9bcf000000000000","products":[{"category":"Games","image_url":"https:///www.example.com/product/path.jpg","name":"Monopoly: 3rd Edition","price":19,"product_id":"507f1f77bcf86cd799439011","quantity":1,"sku":"45790-32","url":"https://www.example.com/product/path"},{"category":"Games","name":"Uno Card Game","price":3,"product_id":"505bd76785ebb509fc183733","quantity":2,"sku":"46493-32"}],"revenue":25,"shipping":3,"subtotal":22.5,"tax":2,"total":27.5,"city":"Disney","country":"USA","email":"mickey@disney.com","firstName":"Mickey","ip":"0.0.0.0","$current_url":"https://docs.rudderstack.com/destinations/mixpanel","$screen_dpi":2,"mp_lib":"RudderLabs JavaScript SDK","$app_build_number":"1.0.0","$app_version_string":"1.0.5","$insert_id":"aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a","token":"test_api_token","distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","time":1579847342402,"$browser":"Chrome","$browser_version":"79.0.3945.117"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'mp',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: sampleDestination,
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  first_name: 'Mickey',
                  lastName: 'Mouse',
                  name: 'Mickey Mouse',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'KM Order Completed',
              integrations: { All: true },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              properties: {
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                coupon: 'hasbros',
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                revenue: 34,
                key_1: {
                  child_key1: 'child_value1',
                  child_key2: { child_key21: 'child_value21', child_key22: 'child_value22' },
                },
                products: [
                  {
                    category: 'Games',
                    image_url: 'https:///www.example.com/product/path.jpg',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    product_id: '507f1f77bcf86cd799439011',
                    quantity: 1,
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                  },
                  {
                    category: 'Games',
                    name: 'Uno Card Game',
                    price: 3,
                    product_id: '505bd76785ebb509fc183733',
                    quantity: 2,
                    sku: '46493-32',
                  },
                ],
                shipping: 3,
                subtotal: 22.5,
                tax: 2,
                total: 27.5,
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'track',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$append":{"$transactions":{"$time":"2020-01-24T06:29:02.402Z","$amount":34}},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca"}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"KM Order Completed","properties":{"affiliation":"Google Store","checkout_id":"fksdjfsdjfisjf9sdfjsd9f","coupon":"hasbros","currency":"USD","discount":2.5,"order_id":"50314b8e9bcf000000000000","revenue":34,"key_1":{"child_key1":"child_value1","child_key2":{"child_key21":"child_value21","child_key22":"child_value22"}},"products":[{"category":"Games","image_url":"https:///www.example.com/product/path.jpg","name":"Monopoly: 3rd Edition","price":19,"product_id":"507f1f77bcf86cd799439011","quantity":1,"sku":"45790-32","url":"https://www.example.com/product/path"},{"category":"Games","name":"Uno Card Game","price":3,"product_id":"505bd76785ebb509fc183733","quantity":2,"sku":"46493-32"}],"shipping":3,"subtotal":22.5,"tax":2,"total":27.5,"city":"Disney","country":"USA","email":"mickey@disney.com","first_name":"Mickey","lastName":"Mouse","name":"Mickey Mouse","ip":"0.0.0.0","$current_url":"https://docs.rudderstack.com/destinations/mixpanel","$screen_dpi":2,"mp_lib":"RudderLabs JavaScript SDK","$app_build_number":"1.0.0","$app_version_string":"1.0.5","$insert_id":"aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a","token":"test_api_token","distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","time":1579847342402,"$browser":"Chrome","$browser_version":"79.0.3945.117"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'mp',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: sampleDestination,
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstName: 'Mickey',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: ' new Order Completed totally',
              integrations: { All: true },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              properties: {
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                coupon: 'hasbros',
                currency: 'USD',
                discount: 2.5,
                total: 23,
                order_id: '50314b8e9bcf000000000000',
                key_1: {
                  child_key1: 'child_value1',
                  child_key2: { child_key21: 'child_value21', child_key22: 'child_value22' },
                },
                products: [
                  {
                    category: 'Games',
                    image_url: 'https:///www.example.com/product/path.jpg',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    product_id: '507f1f77bcf86cd799439011',
                    quantity: 1,
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                  },
                  {
                    category: 'Games',
                    name: 'Uno Card Game',
                    price: 3,
                    product_id: '505bd76785ebb509fc183733',
                    quantity: 2,
                    sku: '46493-32',
                  },
                ],
                shipping: 3,
                subtotal: 22.5,
                tax: 2,
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'track',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":" new Order Completed totally","properties":{"affiliation":"Google Store","checkout_id":"fksdjfsdjfisjf9sdfjsd9f","coupon":"hasbros","currency":"USD","discount":2.5,"total":23,"order_id":"50314b8e9bcf000000000000","key_1":{"child_key1":"child_value1","child_key2":{"child_key21":"child_value21","child_key22":"child_value22"}},"products":[{"category":"Games","image_url":"https:///www.example.com/product/path.jpg","name":"Monopoly: 3rd Edition","price":19,"product_id":"507f1f77bcf86cd799439011","quantity":1,"sku":"45790-32","url":"https://www.example.com/product/path"},{"category":"Games","name":"Uno Card Game","price":3,"product_id":"505bd76785ebb509fc183733","quantity":2,"sku":"46493-32"}],"shipping":3,"subtotal":22.5,"tax":2,"city":"Disney","country":"USA","email":"mickey@disney.com","firstName":"Mickey","ip":"0.0.0.0","$current_url":"https://docs.rudderstack.com/destinations/mixpanel","$screen_dpi":2,"mp_lib":"RudderLabs JavaScript SDK","$app_build_number":"1.0.0","$app_version_string":"1.0.5","$insert_id":"aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a","token":"test_api_token","distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","time":1579847342402,"$browser":"Chrome","$browser_version":"79.0.3945.117"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'mp',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: sampleDestination,
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstName: 'Mickey',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: ' Order Completed ',
              integrations: { All: true },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              properties: {
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                coupon: 'hasbros',
                currency: 'USD',
                discount: 2.5,
                total: 23,
                order_id: '50314b8e9bcf000000000000',
                key_1: {
                  child_key1: 'child_value1',
                  child_key2: { child_key21: 'child_value21', child_key22: 'child_value22' },
                },
                products: [
                  {
                    category: 'Games',
                    image_url: 'https:///www.example.com/product/path.jpg',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    product_id: '507f1f77bcf86cd799439011',
                    quantity: 1,
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                  },
                  {
                    category: 'Games',
                    name: 'Uno Card Game',
                    price: 3,
                    product_id: '505bd76785ebb509fc183733',
                    quantity: 2,
                    sku: '46493-32',
                  },
                ],
                shipping: 3,
                subtotal: 22.5,
                tax: 2,
                'Billing Amount': '77',
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'track',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":" Order Completed ","properties":{"affiliation":"Google Store","checkout_id":"fksdjfsdjfisjf9sdfjsd9f","coupon":"hasbros","currency":"USD","discount":2.5,"total":23,"order_id":"50314b8e9bcf000000000000","key_1":{"child_key1":"child_value1","child_key2":{"child_key21":"child_value21","child_key22":"child_value22"}},"products":[{"category":"Games","image_url":"https:///www.example.com/product/path.jpg","name":"Monopoly: 3rd Edition","price":19,"product_id":"507f1f77bcf86cd799439011","quantity":1,"sku":"45790-32","url":"https://www.example.com/product/path"},{"category":"Games","name":"Uno Card Game","price":3,"product_id":"505bd76785ebb509fc183733","quantity":2,"sku":"46493-32"}],"shipping":3,"subtotal":22.5,"tax":2,"Billing Amount":"77","city":"Disney","country":"USA","email":"mickey@disney.com","firstName":"Mickey","ip":"0.0.0.0","$current_url":"https://docs.rudderstack.com/destinations/mixpanel","$screen_dpi":2,"mp_lib":"RudderLabs JavaScript SDK","$app_build_number":"1.0.0","$app_version_string":"1.0.5","$insert_id":"aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a","token":"test_api_token","distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","time":1579847342402,"$browser":"Chrome","$browser_version":"79.0.3945.117"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'mp',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: sampleDestination,
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'mobile',
              name: 'Contact Us',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs Android SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: 'dd266c67-9199-4a52-ba32-f46ddde67312',
              originalTimestamp: '2020-01-24T06:29:02.358Z',
              properties: {
                path: '/tests/html/index2.html',
                referrer: '',
                search: '',
                title: '',
                url: 'http://localhost/tests/html/index2.html',
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.359Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'group',
              userId: 'hjikl',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: '`Group Key Settings` is not configured in destination',
            statTags: {
              destType: 'MP',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 13',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: sampleDestination,
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              traits: {
                city: 'Disney',
                country: 'USA',
                email: 'mickey@disney.com',
                firstName: 'Mickey',
              },
              integrations: { All: true },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$email":"mickey@disney.com","$country_code":"USA","$city":"Disney","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$firstName":"Mickey","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","$ip":"0.0.0.0","$time":1579847342402}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 14',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              groupKeySettings: [{ groupKey: 'company' }],
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'mobile',
              name: 'Contact Us',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs Android SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: 'dd266c67-9199-4a52-ba32-f46ddde67312',
              originalTimestamp: '2020-01-24T06:29:02.358Z',
              properties: {
                path: '/tests/html/index2.html',
                referrer: '',
                search: '',
                title: '',
                url: 'http://localhost/tests/html/index2.html',
              },
              traits: { company: 'testComp' },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.359Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'group',
              userId: 'hjikl',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$token":"test_api_token","$distinct_id":"hjikl","$set":{"company":["testComp"]},"$ip":"0.0.0.0"}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'hjikl',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/groups/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$token":"test_api_token","$group_key":"company","$group_id":"testComp","$set":{"company":"testComp"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'hjikl',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 15',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              groupKeySettings: [{ groupKey: 'company' }],
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'mobile',
              name: 'Contact Us',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs Android SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: 'dd266c67-9199-4a52-ba32-f46ddde67312',
              originalTimestamp: '2020-01-24T06:29:02.358Z',
              properties: {
                path: '/tests/html/index2.html',
                referrer: '',
                search: '',
                title: '',
                url: 'http://localhost/tests/html/index2.html',
              },
              traits: { company: ['testComp', 'testComp1'] },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.359Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'group',
              userId: 'hjikl',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$token":"test_api_token","$distinct_id":"hjikl","$set":{"company":["testComp","testComp1"]},"$ip":"0.0.0.0"}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'hjikl',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/groups/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$token":"test_api_token","$group_key":"company","$group_id":"testComp","$set":{"company":["testComp","testComp1"]}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'hjikl',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/groups/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$token":"test_api_token","$group_key":"company","$group_id":"testComp1","$set":{"company":["testComp","testComp1"]}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'hjikl',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 16',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              dataResidency: 'eu',
              groupKeySettings: [{ groupKey: 'company' }],
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'mobile',
              name: 'contact us',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'rudderlabs android sdk',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'rudderlabs javascript sdk', version: '1.0.5' },
                locale: 'en-gb',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {},
                useragent:
                  'mozilla/5.0 (macintosh; intel mac os x 10_15_2) applewebkit/537.36 (khtml, like gecko) chrome/79.0.3945.117 safari/537.36',
              },
              integrations: { all: true },
              messageid: 'dd266c67-9199-4a52-ba32-f46ddde67312',
              originaltimestamp: '2020-01-24t06:29:02.358z',
              traits: { company: 'testComp' },
              properties: {
                path: '/tests/html/index2.html',
                referrer: '',
                search: '',
                title: '',
                url: 'http://localhost/tests/html/index2.html',
              },
              receivedat: '2020-01-24t11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentat: '2020-01-24t06:29:02.359z',
              timestamp: '2020-01-24t11:59:02.402+05:30',
              type: 'group',
              userId: 'hjikl',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api-eu.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$token":"test_api_token","$distinct_id":"hjikl","$set":{"company":["testComp"]},"$ip":"0.0.0.0"}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'hjikl',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api-eu.mixpanel.com/groups/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$token":"test_api_token","$group_key":"company","$group_id":"testComp","$set":{"company":"testComp"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'hjikl',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 17',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              dataResidency: 'eu',
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstname: 'Mickey',
                  lastname: 'Mouse',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'KM Order Completed',
              integrations: { All: true },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              properties: {
                affiliation: 'Google Store',
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                coupon: 'hasbros',
                currency: 'USD',
                discount: 2.5,
                order_id: '50314b8e9bcf000000000000',
                products: [
                  {
                    category: 'Games',
                    image_url: 'https:///www.example.com/product/path.jpg',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    product_id: '507f1f77bcf86cd799439011',
                    quantity: 1,
                    sku: '45790-32',
                    url: 'https://www.example.com/product/path',
                  },
                  {
                    category: 'Games',
                    name: 'Uno Card Game',
                    price: 3,
                    product_id: '505bd76785ebb509fc183733',
                    quantity: 2,
                    sku: '46493-32',
                  },
                ],
                revenue: 25,
                shipping: 3,
                subtotal: 22.5,
                tax: 2,
                total: 27.5,
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'track',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api-eu.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$append":{"$transactions":{"$time":"2020-01-24T06:29:02.402Z","$amount":25}},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca"}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api-eu.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"KM Order Completed","properties":{"affiliation":"Google Store","checkout_id":"fksdjfsdjfisjf9sdfjsd9f","coupon":"hasbros","currency":"USD","discount":2.5,"order_id":"50314b8e9bcf000000000000","products":[{"category":"Games","image_url":"https:///www.example.com/product/path.jpg","name":"Monopoly: 3rd Edition","price":19,"product_id":"507f1f77bcf86cd799439011","quantity":1,"sku":"45790-32","url":"https://www.example.com/product/path"},{"category":"Games","name":"Uno Card Game","price":3,"product_id":"505bd76785ebb509fc183733","quantity":2,"sku":"46493-32"}],"revenue":25,"shipping":3,"subtotal":22.5,"tax":2,"total":27.5,"city":"Disney","country":"USA","email":"mickey@disney.com","firstname":"Mickey","lastname":"Mouse","ip":"0.0.0.0","$current_url":"https://docs.rudderstack.com/destinations/mixpanel","$screen_dpi":2,"mp_lib":"RudderLabs JavaScript SDK","$app_build_number":"1.0.0","$app_version_string":"1.0.5","$insert_id":"aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a","token":"test_api_token","distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","time":1579847342402,"$browser":"Chrome","$browser_version":"79.0.3945.117"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'mp',
    description: 'Test 18',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              dataResidency: 'eu',
            }),
            message: {
              anonymousId: '5094f5704b9cf2b3',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'LeanPlumIntegrationAndroid',
                  namespace: 'com.android.SampleLeanPlum',
                  version: '1.0',
                },
                device: {
                  id: '5094f5704b9cf2b3',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'android',
                  token: 'test_device_token',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '1.0.1-beta.1' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'Android', version: '8.1.0' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
                traits: { anonymousId: '5094f5704b9cf2b3' },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'MainActivity',
              integrations: { All: true },
              messageId: 'id2',
              properties: { name: 'MainActivity', automatic: true },
              originalTimestamp: '2020-03-12T09:05:03.421Z',
              type: 'identify',
              sentAt: '2020-03-12T09:05:13.042Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api-eu.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$carrier":"Android","$manufacturer":"Google","$model":"Android SDK built for x86","$screen_height":1794,"$screen_width":1080,"$wifi":true,"anonymousId":"5094f5704b9cf2b3","$android_devices":["test_device_token"],"$os":"Android","$android_model":"Android SDK built for x86","$android_os_version":"8.1.0","$android_manufacturer":"Google","$android_app_version":"1.0","$android_app_version_code":"1.0","$android_brand":"Google"},"$token":"test_api_token","$distinct_id":"5094f5704b9cf2b3","$time":1584003903421}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '5094f5704b9cf2b3',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 19',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              apiSecret: 'some_api_secret',
              dataResidency: 'eu',
            }),
            message: {
              anonymousId: '5094f5704b9cf2b3',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'LeanPlumIntegrationAndroid',
                  namespace: 'com.android.SampleLeanPlum',
                  version: '1.0',
                },
                device: {
                  id: '5094f5704b9cf2b3',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'ios',
                  token: 'test_device_token',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '1.0.1-beta.1' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'iOS', version: '8.1.0' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
                traits: { anonymousId: '5094f5704b9cf2b3', userId: 'test_user_id' },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'MainActivity',
              integrations: { All: true },
              userId: 'test_user_id',
              messageId: 'id2',
              properties: { name: 'MainActivity', automatic: true },
              originalTimestamp: '2020-03-12T09:05:03.421Z',
              type: 'identify',
              sentAt: '2020-03-12T09:05:13.042Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api-eu.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$carrier":"Android","$manufacturer":"Google","$model":"Android SDK built for x86","$screen_height":1794,"$screen_width":1080,"$wifi":true,"anonymousId":"5094f5704b9cf2b3","userId":"test_user_id","$ios_devices":["test_device_token"],"$os":"iOS","$ios_device_model":"Android SDK built for x86","$ios_version":"8.1.0","$ios_app_release":"1","$ios_app_version":"1.0"},"$token":"test_api_token","$distinct_id":"test_user_id","$time":1584003903421}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'test_user_id',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api-eu.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"$merge","properties":{"$distinct_ids":["test_user_id","5094f5704b9cf2b3"],"token":"test_api_token"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'test_user_id',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 20',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: sampleDestination,
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              name: 'Contact Us',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {},
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: 'dd266c67-9199-4a52-ba32-f46ddde67312',
              originalTimestamp: '2020-01-24T06:29:02.358Z',
              properties: {
                path: '/tests/html/index2.html',
                referrer: '',
                search: '',
                title: '',
                url: 'http://localhost/tests/html/index2.html',
                category: 'communication',
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.359Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'page',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"Loaded a Page","properties":{"path":"/tests/html/index2.html","referrer":"","search":"","title":"","url":"http://localhost/tests/html/index2.html","category":"communication","ip":"0.0.0.0","$current_url":"https://docs.rudderstack.com/destinations/mixpanel","$screen_dpi":2,"mp_lib":"RudderLabs JavaScript SDK","$app_build_number":"1.0.0","$app_version_string":"1.0.5","$insert_id":"dd266c67-9199-4a52-ba32-f46ddde67312","token":"test_api_token","distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","time":1579847342402,"name":"Contact Us","$browser":"Chrome","$browser_version":"79.0.3945.117"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'mp',
    description: 'Test 21',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: sampleDestination,
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  lastname: 'Mickey',
                  firstName: 'Mouse',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '79313729-7fe5-4204-963a-dc46f4205e4e',
              originalTimestamp: '2020-01-24T06:29:02.366Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53711',
              sentAt: '2020-01-24T06:29:02.366Z',
              timestamp: '2020-01-24T11:59:02.403+05:30',
              type: 'alias',
              userId: '1234abc',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"$create_alias","properties":{"distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","alias":"1234abc","token":"test_api_token"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '1234abc',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'mp',
    description: 'Test 22',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              apiSecret: 'some_api_secret',
              dataResidency: 'eu',
            }),
            message: {
              anonymousId: '5094f5704b9cf2b3',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'LeanPlumIntegrationAndroid',
                  namespace: 'com.android.SampleLeanPlum',
                  version: '1.0',
                },
                device: {
                  id: '5094f5704b9cf2b3',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'tvos',
                  token: 'test_device_token',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '1.0.1-beta.1' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
                traits: {
                  anonymousId: '5094f5704b9cf2b3',
                  userId: 'test_user_id',
                  createdat: '2020-01-23T08:54:02.362Z',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'MainActivity',
              integrations: { All: true },
              userId: 'test_user_id',
              messageId: 'id2',
              properties: { name: 'MainActivity', automatic: true },
              originalTimestamp: '2020-03-12T09:05:03.421Z',
              type: 'identify',
              sentAt: '2020-03-12T09:05:13.042Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api-eu.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$carrier":"Android","$manufacturer":"Google","$model":"Android SDK built for x86","$screen_height":1794,"$screen_width":1080,"$wifi":true,"anonymousId":"5094f5704b9cf2b3","userId":"test_user_id","createdat":"2020-01-23T08:54:02.362Z","$ios_devices":["test_device_token"],"$ios_device_model":"Android SDK built for x86","$ios_app_release":"1","$ios_app_version":"1.0"},"$token":"test_api_token","$distinct_id":"test_user_id","$time":1584003903421}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'test_user_id',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api-eu.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"$merge","properties":{"$distinct_ids":["test_user_id","5094f5704b9cf2b3"],"token":"test_api_token"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'test_user_id',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 23',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: sampleDestination,
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  first_name: 'Mickey',
                  last_name: 'Mouse',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'KM Order Completed',
              integrations: { All: true },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$email":"mickey@disney.com","$country_code":"USA","$city":"Disney","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$name":"Mickey Mouse","$firstName":"Mickey","$lastName":"Mouse","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","$ip":"0.0.0.0","$time":1579847342402}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 24',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: sampleDestination,
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  first_name: 'Mickey',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'KM Order Completed',
              integrations: { All: true },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$email":"mickey@disney.com","$country_code":"USA","$city":"Disney","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$firstName":"Mickey","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","$ip":"0.0.0.0","$time":1579847342402}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 25',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: sampleDestination,
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  address: { city: 'Disney', country: 'USA', state: 'US' },
                  email: 'mickey@disney.com',
                  first_name: 'Mickey',
                  last_name: 'Mouse',
                  name: 'Mickey Mouse',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'KM Order Completed',
              integrations: { All: true },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$email":"mickey@disney.com","$name":"Mickey Mouse","$country_code":"USA","$city":"Disney","$region":"US","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$firstName":"Mickey","$lastName":"Mouse","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","$ip":"0.0.0.0","$time":1579847342402}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 26',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: sampleDestination,
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  first_name: 'Mickey',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'KM Order Completed',
              integrations: { All: true },
              traits: {
                city: 'Disney',
                country: 'USA',
                email: 'mickey@disney.com',
                last_name: 'Mouse',
              },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$email":"mickey@disney.com","$country_code":"USA","$city":"Disney","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$name":"Mickey Mouse","$firstName":"Mickey","$lastName":"Mouse","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","$ip":"0.0.0.0","$time":1579847342402}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 27',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              useNewMapping: false,
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  first_name: 'Mickey',
                  last_name: 'Mouse',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'KM Order Completed',
              integrations: { All: true },
              traits: { name: 'Mouse' },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$email":"mickey@disney.com","$name":"Mouse","$country_code":"USA","$city":"Disney","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$firstName":"Mickey","$lastName":"Mouse","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","$ip":"0.0.0.0","$time":1579847342402}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 28',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              useNewMapping: true,
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  first_name: 'Mickey',
                  last_name: 'Mouse',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'KM Order Completed',
              integrations: { All: true },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$email":"mickey@disney.com","$first_name":"Mickey","$last_name":"Mouse","$country_code":"USA","$city":"Disney","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$name":"Mickey Mouse","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","$ip":"0.0.0.0","$time":1579847342402}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 29',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              useNewMapping: true,
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  first_name: 'Mickey',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'KM Order Completed',
              integrations: { All: true },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$email":"mickey@disney.com","$first_name":"Mickey","$country_code":"USA","$city":"Disney","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","$ip":"0.0.0.0","$time":1579847342402}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 30',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              useNewMapping: true,
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  address: { city: 'Disney', country: 'USA', state: 'US' },
                  email: 'mickey@disney.com',
                  first_name: 'Mickey',
                  last_name: 'Mouse',
                  name: 'Mickey Mouse',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'KM Order Completed',
              integrations: { All: true },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$email":"mickey@disney.com","$first_name":"Mickey","$last_name":"Mouse","$name":"Mickey Mouse","$country_code":"USA","$city":"Disney","$region":"US","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","$ip":"0.0.0.0","$time":1579847342402}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 31',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              useNewMapping: true,
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  first_name: 'Mickey',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'KM Order Completed',
              integrations: { All: true },
              traits: {
                city: 'Disney',
                country: 'USA',
                address: '1 Government Dr, St. Louis, MO 63110, United States',
                email: 'mickey@disney.com',
                last_name: 'Mouse',
              },
              messageId: 'aa5f5e44-8756-40ad-ad1e-b0d3b9fa710a',
              originalTimestamp: '2020-01-24T06:29:02.367Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53712',
              sentAt: '2020-01-24T06:29:02.368Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$email":"mickey@disney.com","$first_name":"Mickey","$last_name":"Mouse","$country_code":"USA","$city":"Disney","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$name":"Mickey Mouse","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","$ip":"0.0.0.0","$time":1579847342402}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 32',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              useNewMapping: false,
            }),
            message: {
              type: 'track',
              event: 'FirstTrackCall12',
              sentAt: '2021-09-30T07:15:23.523Z',
              channel: 'web',
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.18',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:7307/Testing/App_for_testingTool/',
                  path: '/Testing/App_for_testingTool/',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/App_for_testingTool/',
                  referrer: 'http://127.0.0.1:7307/Testing/',
                  initial_referrer: 'http://127.0.0.1:7307/Testing/',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '127.0.0.1:7307',
                },
                locale: 'en-US',
                screen: { width: 1440, height: 900, density: 2, innerWidth: 590, innerHeight: 665 },
                traits: {
                  anonymousId: 'ea776ad0-3136-44fb-9216-5b1578609a2b',
                  userId: 'as09sufa09usaf09as0f9uasf',
                  id: 'as09sufa09usaf09as0f9uasf',
                  firstName: 'Bob',
                  lastName: 'Marley',
                  name: 'Bob Marley',
                  age: 43,
                  email: 'bob@marleymail.com',
                  phone: '+447748544123',
                  birthday: '1987-01-01T20:08:59+0000',
                  createdAt: '2022-01-21T14:10:12+0000',
                  address: '51,B.L.T road, Kolkata-700060',
                  description: 'I am great',
                  gender: 'male',
                  title: 'Founder',
                  username: 'bobm',
                  website: 'https://bobm.com',
                  randomProperty: 'randomValue',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.18' },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
              },
              rudderId: '294702c7-8732-4fb3-b39f-f3bdffe1aa88',
              messageId: '0d5c1a4a-27e4-41da-a246-4d01f44e74bd',
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              properties: { foo: 'bar', $deviceId: 'nkasdnkasd' },
              anonymousId: '1dbb5784-b8e2-4074-8644-9920145b7ae5',
              integrations: { All: true },
              originalTimestamp: '2021-09-30T07:15:23.523Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"FirstTrackCall12","properties":{"foo":"bar","$deviceId":"nkasdnkasd","anonymousId":"ea776ad0-3136-44fb-9216-5b1578609a2b","userId":"as09sufa09usaf09as0f9uasf","id":"as09sufa09usaf09as0f9uasf","firstName":"Bob","lastName":"Marley","name":"Bob Marley","age":43,"email":"bob@marleymail.com","phone":"+447748544123","birthday":"1987-01-01T20:08:59+0000","createdAt":"2022-01-21T14:10:12+0000","address":"51,B.L.T road, Kolkata-700060","description":"I am great","gender":"male","title":"Founder","username":"bobm","website":"https://bobm.com","randomProperty":"randomValue","$user_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","$current_url":"http://127.0.0.1:7307/Testing/App_for_testingTool/","$referrer":"http://127.0.0.1:7307/Testing/","$screen_height":900,"$screen_width":1440,"$screen_dpi":2,"mp_lib":"RudderLabs JavaScript SDK","$app_build_number":"1.0.0","$app_version_string":"1.1.18","$insert_id":"0d5c1a4a-27e4-41da-a246-4d01f44e74bd","token":"test_api_token","distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","time":1632986123523,"$browser":"Chrome","$browser_version":"93.0.4577.82"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 33',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              useNewMapping: true,
            }),
            message: {
              type: 'track',
              event: 'FirstTrackCall12',
              sentAt: '2021-09-30T07:15:23.523Z',
              channel: 'web',
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.18',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:7307/Testing/App_for_testingTool/',
                  path: '/Testing/App_for_testingTool/',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/App_for_testingTool/',
                  referrer: 'http://127.0.0.1:7307/Testing/',
                  initial_referrer: 'http://127.0.0.1:7307/Testing/',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '127.0.0.1:7307',
                },
                locale: 'en-US',
                screen: { width: 1440, height: 900, density: 2, innerWidth: 590, innerHeight: 665 },
                traits: {
                  anonymousId: 'ea776ad0-3136-44fb-9216-5b1578609a2b',
                  userId: 'as09sufa09usaf09as0f9uasf',
                  id: 'as09sufa09usaf09as0f9uasf',
                  firstName: 'Bob',
                  lastName: 'Marley',
                  name: 'Bob Marley',
                  age: 43,
                  email: 'bob@marleymail.com',
                  phone: '+447748544123',
                  birthday: '1987-01-01T20:08:59+0000',
                  createdAt: '2022-01-21T14:10:12+0000',
                  address: '51,B.L.T road, Kolkata-700060',
                  description: 'I am great',
                  gender: 'male',
                  title: 'Founder',
                  username: 'bobm',
                  website: 'https://bobm.com',
                  randomProperty: 'randomValue',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.18' },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
              },
              rudderId: '294702c7-8732-4fb3-b39f-f3bdffe1aa88',
              messageId: '0d5c1a4a-27e4-41da-a246-4d01f44e74bd',
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              properties: { foo: 'bar', $deviceId: 'nkasdnkasd' },
              anonymousId: '1dbb5784-b8e2-4074-8644-9920145b7ae5',
              integrations: { All: true },
              originalTimestamp: '2021-09-30T07:15:23.523Z',
              timestamp: '2012-09-30T07:15:23.523Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event timestamp should be within last 5 years',
            statTags: {
              destType: 'MP',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
    mockFns: (_) => {
      jest.spyOn(Date, 'now').mockReturnValueOnce(new Date('2018-12-20T10:26:33.451Z').valueOf());
    },
  },
  {
    name: 'mp',
    description: 'Test 34',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              apiSecret: 'some_api_secret',
              dataResidency: 'eu',
            }),
            message: {
              anonymousId: '5094f5704b9cf2b3',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'LeanPlumIntegrationAndroid',
                  namespace: 'com.android.SampleLeanPlum',
                  version: '1.0',
                },
                device: {
                  id: '5094f5704b9cf2b3',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'ios',
                  token: 'test_device_token',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '1.0.1-beta.1' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'iOS', version: '8.1.0' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
                traits: { anonymousId: '5094f5704b9cf2b3', userId: 'test_user_id' },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'MainActivity',
              integrations: { All: true },
              userId: 'test_user_id',
              messageId: 'id2',
              properties: { name: 'MainActivity', automatic: true },
              originalTimestamp: '2020-03-12T09:05:03.421Z',
              type: 'track',
              sentAt: '2020-03-12T09:05:13.042Z',
              timestamp: '2018-03-12T09:05:03.421Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api-eu.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"MainActivity","properties":{"name":"MainActivity","automatic":true,"anonymousId":"5094f5704b9cf2b3","userId":"test_user_id","$user_id":"test_user_id","$os":"iOS","$screen_height":1794,"$screen_width":1080,"$screen_dpi":420,"$carrier":"Android","$os_version":"8.1.0","$device":"generic_x86","$manufacturer":"Google","$model":"Android SDK built for x86","mp_device_model":"Android SDK built for x86","$wifi":true,"$bluetooth_enabled":false,"mp_lib":"com.rudderstack.android.sdk.core","$app_build_number":"1","$app_version_string":"1.0","$insert_id":"id2","token":"test_api_token","distinct_id":"test_user_id","time":1520845503421}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'test_user_id',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'mp',
    description: 'Test 35',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              apiSecret: 'some_api_secret',
            }),
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstname: 'Mickey',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '79313729-7fe5-4204-963a-dc46f4205e4e',
              originalTimestamp: '2020-01-24T06:29:02.366Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53711',
              sentAt: '2020-01-24T06:29:02.366Z',
              type: 'alias',
              userId: '1234abc',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Either `previousId` or `anonymousId` should be present in alias payload',
            statTags: {
              destType: 'MP',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 36',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              apiSecret: 'some_api_secret',
            }),
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstname: 'Mickey',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '79313729-7fe5-4204-963a-dc46f4205e4e',
              originalTimestamp: '2020-01-24T06:29:02.366Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53711',
              sentAt: '2020-01-24T06:29:02.366Z',
              type: 'test',
              userId: '1234abc',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: "Event type 'test' is not supported",
            statTags: {
              destType: 'MP',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 37',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              useNewMapping: true,
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                active: false,
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstName: 'Mickey',
                  lastName: 'Mouse',
                  createdAt: '2020-01-23T08:54:02.362Z',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              page: {
                path: '/destinations/mixpanel',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/mixpanel',
                category: 'destination',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$created":"2020-01-23T08:54:02.362Z","$email":"mickey@disney.com","$first_name":"Mickey","$last_name":"Mouse","$country_code":"USA","$city":"Disney","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$name":"Mickey Mouse","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","$ip":"0.0.0.0","$time":1579847342402,"$ignore_time":true}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 38',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              useNewMapping: true,
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                active: true,
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstName: 'Mickey',
                  lastName: 'Mouse',
                  createdAt: '2020-01-23T08:54:02.362Z',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              page: {
                path: '/destinations/mixpanel',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/mixpanel',
                category: 'destination',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$created":"2020-01-23T08:54:02.362Z","$email":"mickey@disney.com","$first_name":"Mickey","$last_name":"Mouse","$country_code":"USA","$city":"Disney","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$name":"Mickey Mouse","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"e6ab2c5e-2cda-44a9-a962-e2f67df78bca","$ip":"0.0.0.0","$time":1579847342402}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 39',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              useNewMapping: true,
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                location: { geoSource: 'abc' },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstName: 'Mickey',
                  lastName: 'Mouse',
                  createdAt: '2020-01-23T08:54:02.362Z',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              page: {
                path: '/destinations/mixpanel',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/mixpanel',
                category: 'destination',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: '',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: "$geo_source value must be either null or 'reverse_geocoding' ",
            statTags: {
              destType: 'MP',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 40',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              serviceAccountUserName: 'rudder.d2a3f1.mp-service-account',
              serviceAccountSecret: 'jatpQxcjMh8eetk1xrH3KjQIbzy4iX8b',
              projectId: '123456',
              useNewMapping: true,
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                active: true,
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstName: 'Mickey',
                  lastName: 'Mouse',
                  createdAt: '2020-01-23T08:54:02.362Z',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              page: {
                path: '/destinations/mixpanel',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/mixpanel',
                category: 'destination',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: 'user1234',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$created":"2020-01-23T08:54:02.362Z","$email":"mickey@disney.com","$first_name":"Mickey","$last_name":"Mouse","$country_code":"USA","$city":"Disney","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$name":"Mickey Mouse","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"user1234","$ip":"0.0.0.0","$time":1579847342402}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'user1234',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"$merge","properties":{"$distinct_ids":["user1234","e6ab2c5e-2cda-44a9-a962-e2f67df78bca"],"token":"test_api_token"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'user1234',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'mp',
    description: 'Test 41',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Application Installed',
              sentAt: '2022-09-05T07:46:26.322Z',
              channel: 'mobile',
              context: {
                os: { name: 'Android', version: '12' },
                app: {
                  name: 'Sample Kotlin',
                  build: '4',
                  version: '1.0',
                  namespace: 'com.example.testapp1mg',
                },
                device: {
                  id: '39da706ec83d0e90',
                  name: 'emu64a',
                  type: 'Android',
                  model: 'sdk_gphone64_arm64',
                  manufacturer: 'Google',
                },
                locale: 'en-US',
                screen: { width: 1440, height: 2984, density: 560 },
                traits: { anonymousId: '39da706ec83d0e90' },
                library: { name: 'com.rudderstack.android.sdk.core', version: '1.7.0' },
                network: { wifi: true, carrier: 'T-Mobile', cellular: true, bluetooth: true },
                timezone: 'Asia/Kolkata',
                sessionId: 1662363980,
                userAgent: 'Dalvik/2.1.0 (Linux; U; Android Tiramisu Build/TPP2.220218.008)',
                sessionStart: true,
              },
              rudderId: '3ef1dec3-d729-4830-a394-7b8be6819765',
              messageId: '1662363980287-168cf720-6227-4b56-a98e-c49bdc7279e9',
              properties: { build: 4, version: '1.0' },
              anonymousId: '39da706ec83d0e90',
              integrations: { All: true },
              originalTimestamp: '2022-09-05T07:46:20.290Z',
            },
            destination: overrideDestination(sampleDestination, {
              apiSecret: 'dummyApiKey',
              useNewMapping: true,
            }),
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"Application Installed","properties":{"build":4,"version":"1.0","anonymousId":"39da706ec83d0e90","$os":"Android","$screen_height":2984,"$screen_width":1440,"$screen_dpi":560,"$carrier":"T-Mobile","$os_version":"12","$device":"emu64a","$manufacturer":"Google","$model":"sdk_gphone64_arm64","mp_device_model":"sdk_gphone64_arm64","$wifi":true,"$bluetooth_enabled":true,"mp_lib":"com.rudderstack.android.sdk.core","$app_build_number":"4","$app_version_string":"1.0","$insert_id":"168cf720-6227-4b56-a98e-c49bdc7279e9","$session_id":"1662363980","token":"test_api_token","distinct_id":"39da706ec83d0e90","time":1662363980290}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '39da706ec83d0e90',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 42',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Application Opened',
              sentAt: '2022-09-05T07:46:26.322Z',
              channel: 'mobile',
              context: {
                os: { name: 'Android', version: '12' },
                app: {
                  name: 'Sample Kotlin',
                  build: '4',
                  version: '1.0',
                  namespace: 'com.example.testapp1mg',
                },
                device: {
                  id: '39da706ec83d0e90',
                  name: 'emu64a',
                  type: 'Android',
                  model: 'sdk_gphone64_arm64',
                  manufacturer: 'Google',
                },
                locale: 'en-US',
                screen: { width: 1440, height: 2984, density: 560 },
                traits: { anonymousId: '39da706ec83d0e90' },
                library: { name: 'com.rudderstack.android.sdk.core', version: '1.7.0' },
                network: { wifi: true, carrier: 'T-Mobile', cellular: true, bluetooth: true },
                timezone: 'Asia/Kolkata',
                sessionId: '1662363980',
                userAgent: 'Dalvik/2.1.0 (Linux; U; Android Tiramisu Build/TPP2.220218.008)',
                sessionStart: true,
              },
              rudderId: '3ef1dec3-d729-4830-a394-7b8be6819765',
              messageId: '1662363980287-168cf720-6227-4b56-a98e-c49bdc7279e9',
              properties: { build: 4, version: '1.0' },
              anonymousId: '39da706ec83d0e90',
              integrations: { All: true },
              originalTimestamp: '2022-09-05T07:46:20.290Z',
            },
            destination: overrideDestination(sampleDestination, {
              apiSecret: 'dummyApiKey',
              useNewMapping: true,
            }),
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"Application Opened","properties":{"build":4,"version":"1.0","anonymousId":"39da706ec83d0e90","$os":"Android","$screen_height":2984,"$screen_width":1440,"$screen_dpi":560,"$carrier":"T-Mobile","$os_version":"12","$device":"emu64a","$manufacturer":"Google","$model":"sdk_gphone64_arm64","mp_device_model":"sdk_gphone64_arm64","$wifi":true,"$bluetooth_enabled":true,"mp_lib":"com.rudderstack.android.sdk.core","$app_build_number":"4","$app_version_string":"1.0","$insert_id":"168cf720-6227-4b56-a98e-c49bdc7279e9","$session_id":"1662363980","token":"test_api_token","distinct_id":"39da706ec83d0e90","time":1662363980290}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '39da706ec83d0e90',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 43',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              groupKeySettings: [{ groupKey: 'groupId' }],
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'mobile',
              name: 'Contact Us',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs Android SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: 'dd266c67-9199-4a52-ba32-f46ddde67312',
              originalTimestamp: '2020-01-24T06:29:02.358Z',
              properties: {
                path: '/tests/html/index2.html',
                referrer: '',
                search: '',
                title: '',
                url: 'http://localhost/tests/html/index2.html',
              },
              traits: { company: 'testComp', groupId: 'groupIdInTraits' },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.359Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'group',
              userId: 'hjikl',
              groupId: 'testGroupId',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$token":"test_api_token","$distinct_id":"hjikl","$set":{"groupId":["testGroupId"]},"$ip":"0.0.0.0"}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'hjikl',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/groups/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$token":"test_api_token","$group_key":"groupId","$group_id":"testGroupId","$set":{"company":"testComp","groupId":"groupIdInTraits"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'hjikl',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 44',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description:
              'Track: set device id and user id when simplified id merge api is selected',
            destination: overrideDestination(sampleDestination, {
              token: 'test_api_token',
              identityMergeApi: 'simplified',
            }),
            message: {
              anonymousId: 'anonId01',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'LeanPlumIntegrationAndroid',
                  namespace: 'com.android.SampleLeanPlum',
                  version: '1.0',
                },
                device: {
                  id: '5094f5704b9cf2b3',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'ios',
                  token: 'test_device_token',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '1.0.1-beta.1' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'iOS', version: '8.1.0' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'Product Viewed',
              integrations: { All: true },
              userId: 'userId01',
              messageId: 'id2',
              properties: { name: 'T-Shirt' },
              type: 'track',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"Product Viewed","properties":{"name":"T-Shirt","$user_id":"userId01","$os":"iOS","$screen_height":1794,"$screen_width":1080,"$screen_dpi":420,"$carrier":"Android","$os_version":"8.1.0","$device":"generic_x86","$manufacturer":"Google","$model":"Android SDK built for x86","mp_device_model":"Android SDK built for x86","$wifi":true,"$bluetooth_enabled":false,"mp_lib":"com.rudderstack.android.sdk.core","$app_build_number":"1","$app_version_string":"1.0","$insert_id":"id2","token":"test_api_token","distinct_id":"userId01","time":1579847342402,"$device_id":"anonId01"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'userId01',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'mp',
    description: 'Test 45',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: 'Identify: skip merge event when simplified id merge api is selected',
            destination: overrideDestination(sampleDestination, {
              token: 'test_api_token',
              identityMergeApi: 'simplified',
            }),
            message: {
              anonymousId: 'anonId01',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstName: 'Mickey',
                  lastName: 'Mouse',
                  createdAt: '2020-01-23T08:54:02.362Z',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              page: {
                path: '/destinations/mixpanel',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/mixpanel',
                category: 'destination',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
              userId: 'userId01',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$created":"2020-01-23T08:54:02.362Z","$email":"mickey@disney.com","$country_code":"USA","$city":"Disney","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$name":"Mickey Mouse","$firstName":"Mickey","$lastName":"Mouse","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"userId01","$ip":"0.0.0.0","$time":1579847342402}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'userId01',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 46',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description:
              'Identify: append $device: to deviceId while creating the user when simplified id merge api is selected',
            destination: overrideDestination(sampleDestination, {
              apiKey: 'apiKey123',
              token: 'test_api_token',
              identityMergeApi: 'simplified',
            }),
            message: {
              anonymousId: 'anonId01',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstName: 'Mickey',
                  lastName: 'Mouse',
                  createdAt: '2020-01-23T08:54:02.362Z',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              page: {
                path: '/destinations/mixpanel',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/mixpanel',
                category: 'destination',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              messageId: '2536eda4-d638-4c93-8014-8ffe3f083214',
              originalTimestamp: '2020-01-24T06:29:02.362Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53709',
              sentAt: '2020-01-24T06:29:02.363Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'identify',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$created":"2020-01-23T08:54:02.362Z","$email":"mickey@disney.com","$country_code":"USA","$city":"Disney","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","$name":"Mickey Mouse","$firstName":"Mickey","$lastName":"Mouse","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"test_api_token","$distinct_id":"$device:anonId01","$ip":"0.0.0.0","$time":1579847342402}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anonId01',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 47',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: 'Unsupported alias call when simplified id merge api is selected',
            destination: overrideDestination(sampleDestination, {
              apiKey: 'apiKey123',
              token: 'test_api_token',
              identityMergeApi: 'simplified',
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstname: 'Mickey',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '79313729-7fe5-4204-963a-dc46f4205e4e',
              originalTimestamp: '2020-01-24T06:29:02.366Z',
              previousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53711',
              sentAt: '2020-01-24T06:29:02.366Z',
              timestamp: '2020-01-24T11:59:02.403+05:30',
              type: 'alias',
              userId: '1234abc',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'The use of the alias call in the context of the `Simplified ID merge` feature is not supported anymore.',
            statTags: {
              destType: 'MP',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 48',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description:
              'Track revenue event: set device id and user id when simplified id merge api is selected',
            destination: overrideDestination(sampleDestination, {
              apiKey: 'apiKey123',
              token: 'test_api_token',
              identityMergeApi: 'simplified',
            }),
            message: {
              anonymousId: 'anonId01',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  firstName: 'Mickey',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              event: 'test revenue MIXPANEL',
              integrations: { All: true },
              messageId: 'a6a0ad5a-bd26-4f19-8f75-38484e580fc7',
              originalTimestamp: '2020-01-24T06:29:02.364Z',
              properties: { currency: 'USD', revenue: 18.9 },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53710',
              sentAt: '2020-01-24T06:29:02.364Z',
              timestamp: '2020-01-24T11:59:02.403+05:30',
              type: 'track',
              userId: 'userId01',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$append":{"$transactions":{"$time":"2020-01-24T06:29:02.403Z","$amount":18.9}},"$token":"test_api_token","$distinct_id":"userId01"}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'userId01',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"test revenue MIXPANEL","properties":{"currency":"USD","revenue":18.9,"city":"Disney","country":"USA","email":"mickey@disney.com","firstName":"Mickey","ip":"0.0.0.0","$user_id":"userId01","$current_url":"https://docs.rudderstack.com/destinations/mixpanel","$screen_dpi":2,"mp_lib":"RudderLabs JavaScript SDK","$app_build_number":"1.0.0","$app_version_string":"1.0.5","$insert_id":"a6a0ad5a-bd26-4f19-8f75-38484e580fc7","token":"test_api_token","distinct_id":"userId01","time":1579847342403,"$device_id":"anonId01","$browser":"Chrome","$browser_version":"79.0.3945.117"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'userId01',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'mp',
    description: 'Test 49',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: 'Page with anonymous user when simplified api is selected',
            destination: overrideDestination(sampleDestination, {
              apiKey: 'apiKey123',
              token: 'test_api_token',
              identityMergeApi: 'simplified',
            }),
            message: {
              anonymousId: 'anonId01',
              channel: 'web',
              name: 'Contact Us',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {},
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: 'dd266c67-9199-4a52-ba32-f46ddde67312',
              originalTimestamp: '2020-01-24T06:29:02.358Z',
              page: {
                path: '/destinations/mixpanel',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/mixpanel',
                category: 'destination',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.359Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'page',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"Loaded a Page","properties":{"ip":"0.0.0.0","$current_url":"https://docs.rudderstack.com/destinations/mixpanel","$screen_dpi":2,"mp_lib":"RudderLabs JavaScript SDK","$app_build_number":"1.0.0","$app_version_string":"1.0.5","$insert_id":"dd266c67-9199-4a52-ba32-f46ddde67312","token":"test_api_token","distinct_id":"$device:anonId01","time":1579847342402,"$device_id":"anonId01","name":"Contact Us","$browser":"Chrome","$browser_version":"79.0.3945.117"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anonId01',
            },
            statusCode: 200,
          },
        ],
      },
    },
    mockFns: () => {
      defaultMockFns();
    },
  },
  {
    name: 'mp',
    description: 'Test 50',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: 'Group call with anonymous user when simplified api is selected',
            destination: overrideDestination(sampleDestination, {
              apiKey: 'apiKey123',
              token: 'test_api_token',
              identityMergeApi: 'simplified',
              groupKeySettings: [{ groupKey: 'company' }],
            }),
            message: {
              anonymousId: 'anonId01',
              channel: 'mobile',
              name: 'Contact Us',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs Android SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: 'dd266c67-9199-4a52-ba32-f46ddde67312',
              originalTimestamp: '2020-01-24T06:29:02.358Z',
              properties: {
                path: '/tests/html/index2.html',
                referrer: '',
                search: '',
                title: '',
                url: 'http://localhost/tests/html/index2.html',
              },
              traits: { company: 'testComp' },
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.359Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'group',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$token":"test_api_token","$distinct_id":"$device:anonId01","$set":{"company":["testComp"]},"$ip":"0.0.0.0"}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anonId01',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/groups/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$token":"test_api_token","$group_key":"company","$group_id":"testComp","$set":{"company":"testComp"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'anonId01',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 51',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(sampleDestination, {
              apiKey: 'apiKey123',
              token: 'test_api_token',
              identityMergeApi: 'simplified',
              groupKeySettings: [{ groupKey: 'company' }],
            }),
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'mobile',
              name: 'Contact Us',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs Android SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: 'dd266c67-9199-4a52-ba32-f46ddde67312',
              originalTimestamp: '2020-01-24T06:29:02.358Z',
              properties: {
                path: '/tests/html/index2.html',
                referrer: '',
                search: '',
                title: '',
                url: 'http://localhost/tests/html/index2.html',
              },
              traits: {},
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53708',
              sentAt: '2020-01-24T06:29:02.359Z',
              timestamp: '2020-01-24T11:59:02.402+05:30',
              type: 'group',
              userId: 'hjikl',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'Group Key is not present. Please ensure that the group key is included in the payload as configured in the `Group Key Settings` in destination',
            statTags: {
              destType: 'MP',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 52',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Application Installed',
              sentAt: '2022-09-05T07:46:26.322Z',
              channel: 'mobile',
              timestamp: '',
              context: {
                os: { name: 'Android', version: '12' },
                app: {
                  name: 'Sample Kotlin',
                  build: '4',
                  version: '1.0',
                  namespace: 'com.example.testapp1mg',
                },
                device: {
                  id: '39da706ec83d0e90',
                  name: 'emu64a',
                  type: 'Android',
                  model: 'sdk_gphone64_arm64',
                  manufacturer: 'Google',
                },
                locale: 'en-US',
                screen: { width: 1440, height: 2984, density: 560 },
                traits: { anonymousId: '39da706ec83d0e90' },
                library: { name: 'com.rudderstack.android.sdk.core', version: '1.7.0' },
                network: { wifi: true, carrier: 'T-Mobile', cellular: true, bluetooth: true },
                timezone: 'Asia/Kolkata',
                sessionId: 1662363980,
                userAgent: 'Dalvik/2.1.0 (Linux; U; Android Tiramisu Build/TPP2.220218.008)',
                sessionStart: true,
              },
              rudderId: '3ef1dec3-d729-4830-a394-7b8be6819765',
              messageId: '1662363980287-168cf720-6227-4b56-a98e-c49bdc7279e9',
              properties: { build: 4, version: '1.0', revenue: 12.13 },
              anonymousId: '39da706ec83d0e90',
              integrations: { All: true },
              originalTimestamp: '2022-09-05T07:46:20.290Z',
            },
            destination: overrideDestination(sampleDestination, {
              apiKey: 'dummyApiKey',
              token: 'test_api_token',
              apiSecret: 'dummyApiKey',
              useNewMapping: true,
            }),
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$append":{"$transactions":{"$time":"2022-09-05T07:46:20.290Z","$amount":12.13}},"$token":"test_api_token","$distinct_id":"39da706ec83d0e90"}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '39da706ec83d0e90',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"Application Installed","properties":{"build":4,"version":"1.0","revenue":12.13,"anonymousId":"39da706ec83d0e90","$os":"Android","$screen_height":2984,"$screen_width":1440,"$screen_dpi":560,"$carrier":"T-Mobile","$os_version":"12","$device":"emu64a","$manufacturer":"Google","$model":"sdk_gphone64_arm64","mp_device_model":"sdk_gphone64_arm64","$wifi":true,"$bluetooth_enabled":true,"mp_lib":"com.rudderstack.android.sdk.core","$app_build_number":"4","$app_version_string":"1.0","$insert_id":"168cf720-6227-4b56-a98e-c49bdc7279e9","$session_id":"1662363980","token":"test_api_token","distinct_id":"39da706ec83d0e90","time":1662363980290}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '39da706ec83d0e90',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 53',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Application Installed',
              sentAt: '2022-09-05T07:46:26.322Z',
              channel: 'mobile',
              timestamp: 'safaff',
              context: {
                os: { name: 'Android', version: '12' },
                app: {
                  name: 'Sample Kotlin',
                  build: '4',
                  version: '1.0',
                  namespace: 'com.example.testapp1mg',
                },
                device: {
                  id: '39da706ec83d0e90',
                  name: 'emu64a',
                  type: 'Android',
                  model: 'sdk_gphone64_arm64',
                  manufacturer: 'Google',
                },
                locale: 'en-US',
                screen: { width: 1440, height: 2984, density: 560 },
                traits: { anonymousId: '39da706ec83d0e90' },
                library: { name: 'com.rudderstack.android.sdk.core', version: '1.7.0' },
                network: { wifi: true, carrier: 'T-Mobile', cellular: true, bluetooth: true },
                timezone: 'Asia/Kolkata',
                sessionId: 1662363980,
                userAgent: 'Dalvik/2.1.0 (Linux; U; Android Tiramisu Build/TPP2.220218.008)',
                sessionStart: true,
              },
              rudderId: '3ef1dec3-d729-4830-a394-7b8be6819765',
              messageId: '1662363980287-168cf720-6227-4b56-a98e-c49bdc7279e9',
              properties: { build: 4, version: '1.0', revenue: 23.45 },
              anonymousId: '39da706ec83d0e90',
              integrations: { All: true },
              originalTimestamp: '2022-09-05T07:46:20.290Z',
            },
            destination: overrideDestination(sampleDestination, {
              apiKey: 'dummyApiKey',
              token: 'test_api_token',
              apiSecret: 'dummyApiKey',
              useNewMapping: true,
            }),
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$append":{"$transactions":{"$time":"2022-09-05T07:46:20.290Z","$amount":23.45}},"$token":"test_api_token","$distinct_id":"39da706ec83d0e90"}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '39da706ec83d0e90',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 0 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"Application Installed","properties":{"build":4,"version":"1.0","revenue":23.45,"anonymousId":"39da706ec83d0e90","$os":"Android","$screen_height":2984,"$screen_width":1440,"$screen_dpi":560,"$carrier":"T-Mobile","$os_version":"12","$device":"emu64a","$manufacturer":"Google","$model":"sdk_gphone64_arm64","mp_device_model":"sdk_gphone64_arm64","$wifi":true,"$bluetooth_enabled":true,"mp_lib":"com.rudderstack.android.sdk.core","$app_build_number":"4","$app_version_string":"1.0","$insert_id":"168cf720-6227-4b56-a98e-c49bdc7279e9","$session_id":"1662363980","token":"test_api_token","distinct_id":"39da706ec83d0e90","time":null}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '39da706ec83d0e90',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 54',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: 'Track: with strict mode enabled',
            destination: overrideDestination(sampleDestination, {
              apiKey: 'dummyApiKey',
              token: 'test_api_token',
              apiSecret: 'some_api_secret',
              dataResidency: 'eu',
              strictMode: true,
            }),
            message: {
              anonymousId: '5094f5704b9cf2b3',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'LeanPlumIntegrationAndroid',
                  namespace: 'com.android.SampleLeanPlum',
                  version: '1.0',
                },
                device: {
                  id: '5094f5704b9cf2b3',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'ios',
                  token: 'test_device_token',
                },
                library: { name: 'com.rudderstack.android.sdk.core', version: '1.0.1-beta.1' },
                locale: 'en-US',
                network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
                os: { name: 'iOS', version: '8.1.0' },
                screen: { density: 420, height: 1794, width: 1080 },
                timezone: 'Asia/Kolkata',
                traits: { anonymousId: '5094f5704b9cf2b3', userId: 'test_user_id' },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Android SDK built for x86 Build/OSM1.180201.007)',
              },
              event: 'MainActivity',
              integrations: { All: true },
              userId: 'test_user_id',
              messageId: 'id2',
              properties: { name: 'MainActivity', automatic: true },
              originalTimestamp: '2020-03-12T09:05:03.421Z',
              type: 'identify',
              sentAt: '2020-03-12T09:05:13.042Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api-eu.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$carrier":"Android","$manufacturer":"Google","$model":"Android SDK built for x86","$screen_height":1794,"$screen_width":1080,"$wifi":true,"anonymousId":"5094f5704b9cf2b3","userId":"test_user_id","$ios_devices":["test_device_token"],"$os":"iOS","$ios_device_model":"Android SDK built for x86","$ios_version":"8.1.0","$ios_app_release":"1","$ios_app_version":"1.0"},"$token":"test_api_token","$distinct_id":"test_user_id","$time":1584003903421}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'test_user_id',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api-eu.mixpanel.com/import/',
              headers: {
                Authorization: 'Basic dGVzdF9hcGlfdG9rZW46',
                'Content-Type': 'application/json',
              },
              params: { strict: 1 },
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"event":"$merge","properties":{"$distinct_ids":["test_user_id","5094f5704b9cf2b3"],"token":"test_api_token"}}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'test_user_id',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test 55',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: 'Alias: with same previousId and userId',
            destination: sampleDestination,
            message: {
              anonymousId: 'test_anonymous_id',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
                locale: 'en-GB',
                os: { name: '', version: '' },
                screen: { density: 2 },
                traits: {
                  city: 'Disney',
                  country: 'USA',
                  email: 'mickey@disney.com',
                  lastname: 'Mickey',
                  firstName: 'Mouse',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: { All: true },
              messageId: '79313729-7fe5-4204-963a-dc46f4205e4e',
              originalTimestamp: '2020-01-24T06:29:02.366Z',
              receivedAt: '2020-01-24T11:59:02.403+05:30',
              request_ip: '[::1]:53711',
              sentAt: '2020-01-24T06:29:02.366Z',
              timestamp: '2020-01-24T11:59:02.403+05:30',
              type: 'alias',
              userId: 'test_user_id',
              previousId: 'test_user_id',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'One of `previousId` or `anonymousId` is same as `userId`. Aborting',
            statTags: {
              destType: 'MP',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test Set Once Property',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: 'Alias: with property beyond and within exclusion list',
            destination: destinationWithSetOnceProperty,
            message: {
              anonymousId: 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.5',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  address: {
                    city: 'Disney',
                  },
                  country: 'USA',
                  email: 'TestSanity@disney.com',
                  firstName: 'Mickey test',
                  lastName: 'VarChange',
                  createdAt: '2020-01-23T08:54:02.362Z',
                  nationality: 'USA',
                  random: 'superProp',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              page: {
                path: '/destinations/mixpanel',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/mixpanel',
                category: 'destination',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              request_ip: '[::1]:53709',
              type: 'identify',
              userId: 'Santiy',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set_once":{"$first_name":"Mickey test","$city":"Disney","nationality":"USA"},"$token":"dummyToken","$distinct_id":"Santiy"}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'Santiy',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$created":"2020-01-23T08:54:02.362Z","$email":"TestSanity@disney.com","$country_code":"USA","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","random":"superProp","$lastName":"VarChange","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"dummyToken","$distinct_id":"Santiy","$ip":"0.0.0.0","$time":null}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'Santiy',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'mp',
    description: 'Test Set Once Property with anonymousId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            description: 'Alias: with property beyond and within exclusion list',
            destination: destinationWithSetOnceProperty,
            message: {
              anonymousId: 'dummyAnnonymousId',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.5',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.5',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  address: {
                    city: 'Disney',
                  },
                  country: 'USA',
                  email: 'TestSanity@disney.com',
                  firstName: 'Mickey test',
                  lastName: 'VarChange',
                  createdAt: '2020-01-23T08:54:02.362Z',
                  nationality: 'USA',
                  random: 'superProp',
                },
                page: {
                  path: '/destinations/mixpanel',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/mixpanel',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              page: {
                path: '/destinations/mixpanel',
                referrer: '',
                search: '',
                title: '',
                url: 'https://docs.rudderstack.com/destinations/mixpanel',
                category: 'destination',
                initial_referrer: 'https://docs.rudderstack.com',
                initial_referring_domain: 'docs.rudderstack.com',
              },
              request_ip: '[::1]:53709',
              type: 'identify',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set_once":{"$first_name":"Mickey test","$city":"Disney","nationality":"USA"},"$token":"dummyToken","$distinct_id":"$device:dummyAnnonymousId"}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'dummyAnnonymousId',
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mixpanel.com/engage/',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {
                  batch:
                    '[{"$set":{"$created":"2020-01-23T08:54:02.362Z","$email":"TestSanity@disney.com","$country_code":"USA","$initial_referrer":"https://docs.rudderstack.com","$initial_referring_domain":"docs.rudderstack.com","random":"superProp","$lastName":"VarChange","$browser":"Chrome","$browser_version":"79.0.3945.117"},"$token":"dummyToken","$distinct_id":"$device:dummyAnnonymousId","$ip":"0.0.0.0","$time":null}]',
                },
                XML: {},
                FORM: {},
              },
              files: {},
              userId: 'dummyAnnonymousId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
