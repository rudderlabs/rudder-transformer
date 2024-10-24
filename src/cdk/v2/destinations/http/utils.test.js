const { validateUrl } = require('./utils');

describe('validateUrl', () => {
  it('should validate a well-formed HTTP URL', () => {
    const url = 'https://example.com';
    expect(() => validateUrl(url)).not.toThrow();
  });

  it('should throw an error for URLs containing ngrok.io', () => {
    const url = 'https://example.ngrok.io';
    expect(() => validateUrl(url)).toThrow('Invalid URL provided');
  });
});
