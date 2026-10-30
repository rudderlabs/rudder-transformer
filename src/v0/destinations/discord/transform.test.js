const Handlebars = require('handlebars');
const { ConfigurationError } = require('@rudderstack/integrations-lib');
const { getErrorStatusCode } = require('../../util');
const { process } = require('./transform');

describe('internally generated Discord templates', () => {
  afterEach(() => jest.restoreAllMocks());

  it.each([
    ['identify', { type: 'identify', userId: '123', traits: {} }],
    ['track', { type: 'track', event: 'Signed Up', properties: {} }],
  ])('keeps %s fallback rendering failures as 500s', (_type, message) => {
    jest.spyOn(Handlebars, 'compile').mockImplementation(() => {
      throw new Error('Internal Handlebars failure');
    });

    let error;
    try {
      process({ message, destination: { Config: { eventTemplateSettings: [] } } });
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(ConfigurationError);
    expect(error.message).toBe('Internal Handlebars failure');
    expect(getErrorStatusCode(error)).toBe(500);
  });
});
