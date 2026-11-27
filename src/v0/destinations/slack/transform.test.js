const { ConfigurationError } = require('@rudderstack/integrations-lib');
const { process } = require('./transform');

const track = (config) =>
  process({
    message: { type: 'track', event: 'Signup', userId: 'user-1', properties: {} },
    destination: {
      Config: {
        webhookUrl: 'https://hooks.slack.com/services/default',
        eventChannelSettings: [],
        eventTemplateSettings: [],
        ...config,
      },
    },
  });

const invalidValues = [123, 0, false, {}, []];
const invalidCases = [
  ...invalidValues.flatMap((value) => [
    {
      field: 'eventTemplateSettings.eventTemplate',
      config: { eventTemplateSettings: [{ eventName: 'Signup', eventTemplate: value }] },
    },
    {
      field: 'eventTemplateSettings.eventName',
      config: { eventTemplateSettings: [{ eventName: value, eventTemplate: 'Custom' }] },
    },
    {
      field: 'eventChannelSettings.eventName',
      config: {
        incomingWebhooksType: 'modern',
        eventChannelSettings: [
          { eventName: value, eventChannelWebhook: 'https://hooks.slack.com/services/alerts' },
        ],
      },
    },
    {
      field: 'eventChannelSettings.eventName',
      config: { eventChannelSettings: [{ eventName: value, eventChannel: '#alerts' }] },
    },
    {
      field: 'eventChannelSettings.eventChannel',
      config: { eventChannelSettings: [{ eventName: 'Signup', eventChannel: value }] },
    },
  ]),
];

describe('Slack track mapping config', () => {
  it.each(invalidCases)('rejects non-string $field: $config', ({ field, config }) => {
    expect(() => track(config)).toThrow(new ConfigurationError(`${field} must be a string`));
  });

  it.each([
    {
      config: {
        eventTemplateSettings: [{ eventName: 'Signup', eventTemplate: '  Custom {{event}}  ' }],
      },
      expected: { text: '  Custom Signup  ' },
    },
    {
      config: { eventTemplateSettings: [{ eventName: '  ', eventTemplate: 'Custom' }] },
      expected: { text: 'User user-1 did Signup' },
    },
    {
      config: { eventTemplateSettings: [{ eventName: 'Signup', eventTemplate: '  ' }] },
      expected: { text: 'User user-1 did Signup' },
    },
    {
      config: { eventTemplateSettings: [{ eventName: null, eventTemplate: undefined }] },
      expected: { text: 'User user-1 did Signup' },
    },
    {
      config: { eventChannelSettings: [{ eventName: 'Signup', eventChannel: '#alerts' }] },
      expected: { text: 'User user-1 did Signup', channel: '#alerts' },
    },
    {
      config: { eventChannelSettings: [{ eventName: 'Signup', eventChannel: '  ' }] },
      expected: { text: 'User user-1 did Signup' },
    },
    {
      config: {
        incomingWebhooksType: 'modern',
        eventChannelSettings: [
          { eventName: 'Signup', eventChannelWebhook: 'https://hooks.slack.com/services/alerts' },
        ],
      },
      expected: { text: 'User user-1 did Signup' },
      endpoint: 'https://hooks.slack.com/services/alerts',
    },
  ])('preserves valid and blank mapping behavior: $config', ({ config, expected, endpoint }) => {
    const [response] = track(config);
    expect(response.endpoint).toBe(endpoint || 'https://hooks.slack.com/services/default');
    expect(JSON.parse(response.body.FORM.payload)).toEqual({
      ...expected,
      ...(endpoint
        ? {}
        : { username: 'RudderStack', icon_url: 'https://cdn.rudderlabs.com/rudderstack.png' }),
    });
  });
});
