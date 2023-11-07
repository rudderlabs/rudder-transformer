import { enhanceRequestOptions } from '../../../../src/adapters/network';
import qs from 'qs';

export const data = [
  {
    name: 'canny',
    description: 'Identify call for creating or updating user',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'FXLkLUEhGJyvmY4',
              },
            },
            message: {
              type: 'identify',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.2.20',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  path: '/Testing/App_for_LaunchDarkly/ourSdk.html',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  referrer: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/',
                  initial_referrer: '$direct',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '',
                },
                locale: 'en-US',
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                  avatar: 'https://i.pravatar.cc/300',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              userId: '',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://canny.io/api/v1/users/create_or_update',
              headers: {
                Authorization: 'Basic FXLkLUEhGJyvmY4',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  customFields: {
                    city: 'Pune',
                    title: 'VP',
                    gender: 'female',
                  },
                  apiKey: 'FXLkLUEhGJyvmY4',
                  userID: 'user123456001',
                  email: 'firstUser@testmail.com',
                  name: 'First User',
                  created: '2022-01-20T13:39:21.032Z',
                  avatarURL: 'https://i.pravatar.cc/300',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'canny',
    description: 'Identify call without sending userId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'FXLkLUEhGJyvmY4',
              },
            },
            message: {
              type: 'identify',
              sentAt: '2022-01-20T13:39:21.033Z',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.2.20',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  path: '/Testing/App_for_LaunchDarkly/ourSdk.html',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  referrer: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/',
                  initial_referrer: '$direct',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '',
                },
                locale: 'en-US',
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Missing required value from "userIdOnly"',
            statTags: {
              destType: 'CANNY',
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
    name: 'canny',
    description: 'Identify call without sending name',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'FXLkLUEhGJyvmY4',
              },
            },
            message: {
              type: 'identify',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.2.20',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  path: '/Testing/App_for_LaunchDarkly/ourSdk.html',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  referrer: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/',
                  initial_referrer: '$direct',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '',
                },
                locale: 'en-US',
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Missing required value from "name"',
            statTags: {
              destType: 'CANNY',
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
    name: 'canny',
    description: 'Sending page call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'FXLkLUEhGJyvmY4',
              },
            },
            message: {
              type: 'page',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.2.20',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  path: '/Testing/App_for_LaunchDarkly/ourSdk.html',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  referrer: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/',
                  initial_referrer: '$direct',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '',
                },
                locale: 'en-US',
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Message type not supported',
            statTags: {
              destType: 'CANNY',
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
    name: 'canny',
    description: 'Sending without API Key',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: '',
              },
            },
            message: {
              type: 'page',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.2.20',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  path: '/Testing/App_for_LaunchDarkly/ourSdk.html',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  referrer: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/',
                  initial_referrer: '$direct',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '',
                },
                locale: 'en-US',
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'API Key is not present. Aborting message.',
            statTags: {
              destType: 'CANNY',
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
    name: 'canny',
    description: 'Sending without message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'api123',
              },
            },
            message: {
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.2.20',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  path: '/Testing/App_for_LaunchDarkly/ourSdk.html',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  referrer: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/',
                  initial_referrer: '$direct',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '',
                },
                locale: 'en-US',
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  email: 'firstUser@testmail.com',
                  title: 'VP',
                  gender: 'female',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Message Type is not present. Aborting message.',
            statTags: {
              destType: 'CANNY',
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
    name: 'canny',
    description: 'specifying multiple events for one event name and vice versa.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'apikey123',
                eventsToEvents: [
                  {
                    from: 'abc',
                    to: 'createVote',
                  },
                  {
                    from: 'abc',
                    to: 'createPost',
                  },
                  {
                    from: 'def',
                    to: 'createPost',
                  },
                ],
              },
            },
            message: {
              postID: 'postid',
              event: 'abc',
              type: 'track',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              properties: {
                postID: 'postid',
                boardID: 'boardid',
                title: 'title',
                details: 'details',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.2.20',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  path: '/Testing/App_for_LaunchDarkly/ourSdk.html',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  referrer: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/',
                  initial_referrer: '$direct',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '',
                },
                locale: 'en-US',
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'test@rudderstack.com',
                  title: 'VP',
                  gender: 'male',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://canny.io/api/v1/votes/create',
              headers: {
                Authorization: 'Basic apikey123',
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  postID: 'postid',
                  apiKey: 'apikey123',
                  voterID: '52d14c90fff7c80abcd12345',
                },
              },
              files: {},
            },
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://canny.io/api/v1/posts/create',
              headers: {
                Authorization: 'Basic apikey123',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  apiKey: 'apikey123',
                  boardID: 'boardid',
                  details: 'details',
                  title: 'title',
                  authorID: '52d14c90fff7c80abcd12345',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'canny',
    description: 'mapping event to createPost',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'apikey123',
                eventsToEvents: [
                  {
                    from: 'abc def',
                    to: 'createPost',
                  },
                ],
              },
            },
            message: {
              boardID: 'postid',
              event: ' abc def ',
              type: 'track',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              properties: {
                boardID: 'boardid',
                title: 'title',
                details: 'details',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.2.20',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  path: '/Testing/App_for_LaunchDarkly/ourSdk.html',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  referrer: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/',
                  initial_referrer: '$direct',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '',
                },
                locale: 'en-US',
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'test@rudderstack.com',
                  title: 'VP',
                  gender: 'male',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
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
              userId: '',
              endpoint: 'https://canny.io/api/v1/posts/create',
              headers: {
                Authorization: 'Basic apikey123',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                FORM: {},
                JSON_ARRAY: {},
                XML: {},
                JSON: {
                  apiKey: 'apikey123',
                  authorID: '52d14c90fff7c80abcd12345',
                  boardID: 'boardid',
                  details: 'details',
                  title: 'title',
                },
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'canny',
    description: 'mapping single event to same event multiple times',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'apikey123',
                eventsToEvents: [
                  {
                    from: 'sample',
                    to: 'createPost',
                  },
                  {
                    from: 'sample',
                    to: 'createPost',
                  },
                  {
                    from: 'sample',
                    to: 'createPost',
                  },
                ],
              },
            },
            message: {
              anonymousId: '1c5e54849f5c711ce38fa60716fbbe44bff478f9ca250897b39cdfc2438cd1bd',
              event: 'sample',
              integrations: { Canny: false },
              context: {
                library: {
                  name: 'unknown',
                  version: 'unknown',
                },
                integration: {
                  name: 'Canny',
                  version: '1.0.0',
                },
                traits: {
                  created: '2022-07-15T11:16:32.648Z',
                  email: 'test@rudderstack.com',
                  isAdmin: true,
                  name: 'Rudder Test',
                  url: 'https://rudder.canny.io/admin/users/dummyUser',
                },
                externalId: [
                  {
                    type: 'cannyUserId',
                    id: '62d1',
                  },
                ],
              },
              timestamp: '2022-07-28T10:52:46.294Z',
              originalTimestamp: '2022-07-28T10:52:46.294Z',
              type: 'track',
              properties: {
                board: {
                  created: '2022-07-25T12:11:19.895Z',
                  id: '62de8',
                  name: 'features',
                  postCount: 13,
                  url: 'https://rudder.canny.io/admin/board/features',
                },
                by: null,
                category: null,
                commentCount: 0,
                created: '2022-07-28T10:52:46.172Z',
                customFields: [{ id: '62e138', name: 'abc', value: '123' }],
                details: 'Array of images',
                eta: null,
                id: '62e26a',
                imageURLs: [
                  'https://canny.io/images/6371453a825c79351c52a6063c3af476.jpg',
                  'https://canny.io/images/47db6ee5035bfb45ea87a74f2eb17928.jpg',
                ],
                objectType: 'post',
                owner: null,
                score: 1,
                status: 'open',
                tags: [],
                title: 'Custom Fields Testing',
                url: 'https://rudder.canny.io/admin/board/features/p/custom-fields-testing',
              },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://canny.io/api/v1/posts/create',
              headers: {
                Authorization: 'Basic apikey123',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                FORM: {},
                JSON_ARRAY: {},
                XML: {},
                JSON: {
                  apiKey: 'apikey123',
                  authorID: '62d1',
                  boardID: '62de8',
                  details: 'Array of images',
                  title: 'Custom Fields Testing',
                  imageURLs: [
                    'https://canny.io/images/6371453a825c79351c52a6063c3af476.jpg',
                    'https://canny.io/images/47db6ee5035bfb45ea87a74f2eb17928.jpg',
                  ],
                  customFields: [{ id: '62e138', name: 'abc', value: '123' }],
                },
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'canny',
    description: 'Event is not found in mapping',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'apikey123',
                eventsToEvents: [
                  {
                    from: 'sample',
                    to: 'createPost',
                  },
                  {
                    from: 'sample2',
                    to: 'createPost',
                  },
                ],
              },
            },
            message: {
              anonymousId: '1c5e54849f5c711ce38fa60716fbbe44bff478f9ca250897b39cdfc2438cd1bd',
              event: 'sample3',
              integrations: { Canny: false },
              context: {
                library: {
                  name: 'unknown',
                  version: 'unknown',
                },
                integration: {
                  name: 'Canny',
                  version: '1.0.0',
                },
                traits: {
                  created: '2022-07-15T11:16:32.648Z',
                  email: 'test@rudderstack.com',
                  isAdmin: true,
                  name: 'Rudder Test',
                  url: 'https://rudder.canny.io/admin/users/dummyUser',
                },
                externalId: [
                  {
                    type: 'cannyUserId',
                    value: '62d1',
                  },
                ],
              },
              timestamp: '2022-07-28T10:52:46.294Z',
              originalTimestamp: '2022-07-28T10:52:46.294Z',
              type: 'track',
              properties: {
                board: {
                  created: '2022-07-25T12:11:19.895Z',
                  id: '62de8',
                  name: 'features',
                  postCount: 13,
                  url: 'https://rudder.canny.io/admin/board/features',
                },
                by: null,
                category: null,
                commentCount: 0,
                created: '2022-07-28T10:52:46.172Z',
                customFields: [{ id: '62e138', name: 'abc', value: '123' }],
                details: 'Array of images',
                eta: null,
                id: '62e26a',
                imageURLs: [
                  'https://canny.io/images/6371453a825c79351c52a6063c3af476.jpg',
                  'https://canny.io/images/47db6ee5035bfb45ea87a74f2eb17928.jpg',
                ],
                objectType: 'post',
                owner: null,
                score: 1,
                status: 'open',
                tags: [],
                title: 'Custom Fields Testing',
                url: 'https://rudder.canny.io/admin/board/features/p/custom-fields-testing',
              },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event name (sample3) is not present in the mapping',
            statTags: {
              destType: 'CANNY',
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
    name: 'canny',
    description: 'Sending without Event Name',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'apikey123',
                eventsToEvents: [
                  {
                    from: 'sample',
                    to: 'createPost',
                  },
                  {
                    from: 'sample',
                    to: 'createPost',
                  },
                  {
                    from: 'sample',
                    to: 'createPost',
                  },
                ],
              },
            },
            message: {
              anonymousId: '1c5e54849f5c711ce38fa60716fbbe44bff478f9ca250897b39cdfc2438cd1bd',
              integrations: { Canny: false },
              context: {
                library: {
                  name: 'unknown',
                  version: 'unknown',
                },
                integration: {
                  name: 'Canny',
                  version: '1.0.0',
                },
                traits: {
                  created: '2022-07-15T11:16:32.648Z',
                  email: 'test@rudderstack.com',
                  isAdmin: true,
                  name: 'Rudder Test',
                  url: 'https://rudder.canny.io/admin/users/dummyUser',
                },
                externalId: [
                  {
                    type: 'cannyUserId',
                    value: '62d1',
                  },
                ],
              },
              timestamp: '2022-07-28T10:52:46.294Z',
              originalTimestamp: '2022-07-28T10:52:46.294Z',
              type: 'track',
              properties: {
                board: {
                  created: '2022-07-25T12:11:19.895Z',
                  id: '62de8',
                  name: 'features',
                  postCount: 13,
                  url: 'https://rudder.canny.io/admin/board/features',
                },
                by: null,
                category: null,
                commentCount: 0,
                created: '2022-07-28T10:52:46.172Z',
                customFields: [{ id: '62e138', name: 'abc', value: '123' }],
                details: 'Array of images',
                eta: null,
                id: '62e26a',
                imageURLs: [
                  'https://canny.io/images/6371453a825c79351c52a6063c3af476.jpg',
                  'https://canny.io/images/47db6ee5035bfb45ea87a74f2eb17928.jpg',
                ],
                objectType: 'post',
                owner: null,
                score: 1,
                status: 'open',
                tags: [],
                title: 'Custom Fields Testing',
                url: 'https://rudder.canny.io/admin/board/features/p/custom-fields-testing',
              },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event name is required',
            statTags: {
              destType: 'CANNY',
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
    name: 'canny',
    description: 'Sending empty mapping',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'apikey123',
                eventsToEvents: [],
              },
            },
            message: {
              anonymousId: '1c5e54849f5c711ce38fa60716fbbe44bff478f9ca250897b39cdfc2438cd1bd',
              event: 'abc',
              integrations: { Canny: false },
              context: {
                library: {
                  name: 'unknown',
                  version: 'unknown',
                },
                integration: {
                  name: 'Canny',
                  version: '1.0.0',
                },
                traits: {
                  created: '2022-07-15T11:16:32.648Z',
                  email: 'test@rudderstack.com',
                  isAdmin: true,
                  name: 'Rudder Test',
                  url: 'https://rudder.canny.io/admin/users/dummyUser',
                },
                externalId: [
                  {
                    type: 'cannyUserId',
                    value: '62d1',
                  },
                ],
              },
              timestamp: '2022-07-28T10:52:46.294Z',
              originalTimestamp: '2022-07-28T10:52:46.294Z',
              type: 'track',
              properties: {
                board: {
                  created: '2022-07-25T12:11:19.895Z',
                  id: '62de8',
                  name: 'features',
                  postCount: 13,
                  url: 'https://rudder.canny.io/admin/board/features',
                },
                by: null,
                category: null,
                commentCount: 0,
                created: '2022-07-28T10:52:46.172Z',
                customFields: [{ id: '62e138', name: 'abc', value: '123' }],
                details: 'Array of images',
                eta: null,
                id: '62e26a',
                imageURLs: [
                  'https://canny.io/images/6371453a825c79351c52a6063c3af476.jpg',
                  'https://canny.io/images/47db6ee5035bfb45ea87a74f2eb17928.jpg',
                ],
                objectType: 'post',
                owner: null,
                score: 1,
                status: 'open',
                tags: [],
                title: 'Custom Fields Testing',
                url: 'https://rudder.canny.io/admin/board/features/p/custom-fields-testing',
              },
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event name (abc) is not present in the mapping',
            statTags: {
              destType: 'CANNY',
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
    name: 'canny',
    description: 'create vote without postId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'apikey123',
                eventsToEvents: [
                  {
                    from: 'abc',
                    to: 'createVote',
                  },
                ],
              },
            },
            message: {
              event: 'abc',
              type: 'track',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              properties: {
                boardID: 'boardid',
                title: 'title',
                details: 'details',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.2.20',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  path: '/Testing/App_for_LaunchDarkly/ourSdk.html',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  referrer: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/',
                  initial_referrer: '$direct',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '',
                },
                locale: 'en-US',
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'test@rudderstack.com',
                  title: 'VP',
                  gender: 'male',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'Missing required value from ["properties.postID","properties.postId","properties.post.id"]',
            statTags: {
              destType: 'CANNY',
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
    name: 'canny',
    description: 'create post without boardId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'apikey123',
                eventsToEvents: [
                  {
                    from: 'abc def',
                    to: 'createPost',
                  },
                ],
              },
            },
            message: {
              boardID: 'postid',
              event: ' abc def ',
              type: 'track',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              properties: {
                title: 'title',
                details: 'details',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.2.20',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  path: '/Testing/App_for_LaunchDarkly/ourSdk.html',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  referrer: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/',
                  initial_referrer: '$direct',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '',
                },
                locale: 'en-US',
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'test@rudderstack.com',
                  title: 'VP',
                  gender: 'male',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'Missing required value from ["properties.boardID","properties.boardId","properties.board.id"]',
            statTags: {
              destType: 'CANNY',
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
    name: 'canny',
    description: 'create post without title',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'apikey123',
                eventsToEvents: [
                  {
                    from: 'abc def',
                    to: 'createPost',
                  },
                ],
              },
            },
            message: {
              boardID: 'postid',
              event: ' abc def ',
              type: 'track',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              properties: {
                boardID: 'boardid',
                details: 'details',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.2.20',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  path: '/Testing/App_for_LaunchDarkly/ourSdk.html',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  referrer: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/',
                  initial_referrer: '$direct',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '',
                },
                locale: 'en-US',
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'test@rudderstack.com',
                  title: 'VP',
                  gender: 'male',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Missing required value from "properties.title"',
            statTags: {
              destType: 'CANNY',
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
    name: 'canny',
    description: 'create post without details',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                apiKey: 'apikey123',
                eventsToEvents: [
                  {
                    from: 'abc def',
                    to: 'createPost',
                  },
                ],
              },
            },
            message: {
              boardID: 'postid',
              event: ' abc def ',
              type: 'track',
              sentAt: '2022-01-20T13:39:21.033Z',
              userId: 'user123456001',
              channel: 'web',
              properties: {
                boardID: 'boardid',
                title: 'title',
              },
              context: {
                os: {
                  name: '',
                  version: '',
                },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.2.20',
                  namespace: 'com.rudderlabs.javascript',
                },
                page: {
                  url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  path: '/Testing/App_for_LaunchDarkly/ourSdk.html',
                  title: 'Document',
                  search: '',
                  tab_url: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/ourSdk.html',
                  referrer: 'http://127.0.0.1:7307/Testing/App_for_LaunchDarkly/',
                  initial_referrer: '$direct',
                  referring_domain: '127.0.0.1:7307',
                  initial_referring_domain: '',
                },
                locale: 'en-US',
                screen: {
                  width: 1440,
                  height: 900,
                  density: 2,
                  innerWidth: 536,
                  innerHeight: 689,
                },
                traits: {
                  city: 'Pune',
                  name: 'First User',
                  email: 'test@rudderstack.com',
                  title: 'VP',
                  gender: 'male',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.2.20',
                },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
              },
              rudderId: '553b5522-c575-40a7-8072-9741c5f9a647',
              messageId: '831f1fa5-de84-4f22-880a-4c3f23fc3f04',
              anonymousId: 'bf412108-0357-4330-b119-7305e767823c',
              integrations: {
                All: true,
              },
              originalTimestamp: '2022-01-20T13:39:21.032Z',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Missing required value from "properties.details"',
            statTags: {
              destType: 'CANNY',
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
];
