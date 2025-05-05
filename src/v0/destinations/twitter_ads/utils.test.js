const { getOAuthFields } = require('./util');

describe('getOAuthFields utility test cases', () => {
  it('should return a valid oAuthObject when all required fields are present', () => {
    const secret = {
      consumerKey: 'testConsumerKey',
      consumerSecret: 'testConsumerSecret',
      accessToken: 'testAccessToken',
      accessTokenSecret: 'testAccessTokenSecret',
    };
    const destinationType = 'TWITTER ADS';

    const expectedOutput = {
      consumerKey: 'testConsumerKey',
      consumerSecret: 'testConsumerSecret',
      accessToken: 'testAccessToken',
      accessTokenSecret: 'testAccessTokenSecret',
    };

    const result = getOAuthFields({ secret }, destinationType);
    expect(result).toEqual(expectedOutput);
  });

  it('should throw an error if the secret object is not provided', () => {
    const destinationType = 'TWITTER ADS';

    expect(() => {
      getOAuthFields({}, destinationType);
    }).toThrow('[TWITTER ADS]:: OAuth - secret not found');
  });

  it('should throw an error if a required field is missing in the secret object', () => {
    const secret = {
      consumerKey: 'testConsumerKey',
      accessToken: 'testAccessToken',
      accessTokenSecret: 'testAccessTokenSecret',
    };
    const destinationType = 'TWITTER ADS';

    expect(() => {
      getOAuthFields({ secret }, destinationType);
    }).toThrow('[TWITTER ADS]:: OAuth - consumerSecret not found');
  });

  it('should handle an empty secret object and throw an appropriate error', () => {
    const secret = {};
    const destinationType = 'TWITTER ADS';

    expect(() => {
      getOAuthFields({ secret }, destinationType);
    }).toThrow('[TWITTER ADS]:: OAuth - consumerKey not found');
  });

  it('should return an oAuthObject even if optional fields are missing', () => {
    const secret = {
      consumerKey: 'testConsumerKey',
      consumerSecret: 'testConsumerSecret',
    };
    const destinationType = 'TWITTER ADS';

    const expectedOutput = {
      consumerKey: 'testConsumerKey',
      consumerSecret: 'testConsumerSecret',
      accessToken: undefined,
      accessTokenSecret: undefined,
    };

    const result = getOAuthFields({ secret }, destinationType);
    expect(result).toEqual(expectedOutput);
  });
});
