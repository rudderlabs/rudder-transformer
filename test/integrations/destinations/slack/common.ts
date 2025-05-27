import { generateMetadata, overrideDestination } from '../../testUtils';

/**
 * Common base destination configuration for Slack tests
 */
export const baseDestination = {
  ID: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
  Name: 'test-slack',
  DestinationDefinition: {
    ID: '1ZQUiJVMlmF7lfsdfXg7KXQnlLV',
    Name: 'SLACK',
    DisplayName: 'Slack',
    Config: {
      excludeKeys: [],
      includeKeys: [],
    },
  },
  Enabled: true,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
};

/**
 * Common base destination config for processor tests
 */
export const baseProcessorDestination = {
  ...baseDestination,
  IsProcessorEnabled: true,
  Config: {
    eventChannelSettings: [
      {
        eventChannelWebhook: 'https://hooks.slack.com/services/example/test/demo',
        eventName: 'is',
        eventRegex: true,
      },
    ],
    eventTemplateSettings: [
      {
        eventName: 'is',
        eventRegex: true,
        eventTemplate: '{{name}} performed {{event}} with {{properties.key1}} {{properties.key2}}',
      },
      {
        eventName: '',
        eventRegex: false,
        eventTemplate: '',
      },
    ],
    webhookUrl: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
    whitelistedTraitsSettings: [
      {
        trait: 'hiji',
      },
    ],
  },
};

/**
 * Common base destination config for router tests
 */
export const baseRouterDestination = {
  ...baseDestination,
  IsrouterEnabled: true,
  Config: {
    eventChannelSettings: [
      { eventChannel: '#slack_integration', eventName: 'is', eventRegex: true },
      { eventChannel: '', eventName: '', eventRegex: false },
      { eventChannel: '', eventName: '', eventRegex: false },
    ],
    eventTemplateSettings: [
      {
        eventName: 'is',
        eventRegex: true,
        eventTemplate: '{{name}} performed {{event}} with {{properties.key1}} {{properties.key2}}',
      },
      { eventName: '', eventRegex: false, eventTemplate: '' },
    ],
    webhookUrl: 'https://hooks.slack.com/services/THZM86VSS/BV9HZ2UN6/demo',
    whitelistedTraitsSettings: [{ trait: 'hiji' }, { trait: '' }],
  },
};

/**
 * Generate a common context object for test messages
 */
export const generateCommonContext = (overrides = {}) => ({
  app: {
    build: '1.0.0',
    name: 'RudderLabs JavaScript SDK',
    namespace: 'com.rudderlabs.javascript',
    version: '1.1.1-rc.1',
  },
  library: {
    name: 'RudderLabs JavaScript SDK',
    version: '1.1.1-rc.1',
  },
  locale: 'en-US',
  os: {
    name: '',
    version: '',
  },
  page: {
    path: '/tests/html/script-test.html',
    referrer: 'http://localhost:1111/tests/html/',
    search: '',
    title: '',
    url: 'http://localhost:1111/tests/html/script-test.html',
  },
  screen: {
    density: 1.7999999523162842,
  },
  traits: {
    country: 'India',
    email: 'name@domain.com',
    hiji: 'hulala',
    name: 'my-name',
  },
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
  ...overrides,
});

/**
 * Generate common properties for test messages
 */
export const generateCommonProperties = (overrides = {}) => ({
  path: '/tests/html/script-test.html',
  referrer: 'http://localhost:1111/tests/html/',
  search: '',
  title: '',
  url: 'http://localhost:1111/tests/html/script-test.html',
  ...overrides,
});

/**
 * Generate a common message object for test cases
 */
export const generateCommonMessage = (type, userId, anonymousId, messageId, overrides = {}) => ({
  anonymousId,
  channel: 'web',
  context: generateCommonContext(),
  integrations: {
    All: true,
  },
  messageId,
  originalTimestamp: '2020-03-23T03:46:30.916Z',
  properties: generateCommonProperties(),
  receivedAt: '2020-03-23T09:16:31.041+05:30',
  request_ip: '[::1]:52056',
  sentAt: '2020-03-23T03:46:30.916Z',
  timestamp: '2020-03-23T09:16:31.041+05:30',
  type,
  userId,
  ...overrides,
});

/**
 * Generate common metadata for test cases
 */
export const generateCommonMetadata = (jobId, userId, messageId) => ({
  ...generateMetadata(jobId, userId),
  messageId,
  destinationId: '1ZQVSU9SXNg6KYgZALaqjAO3PIL',
  destinationType: 'SLACK',
  sourceId: '1YhwKyDcKstudlGxkeN5p2wgsrp',
});
