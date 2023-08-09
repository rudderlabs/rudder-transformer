const { getSourceName } = require('./util');

describe('getSourceName utility test', () => {
  it('send source name from config', () => {
    expect('abc').toEqual(getSourceName({ sourceName: 'abc' }));
  });

  it('send zendesk as the source name from config', () => {
    expect(() => getSourceName({ sourceName: 'Zendesk ' })).toThrow(
      'Invalid source name. The source name `zendesk` is not allowed.',
    );
  });

  it('source name is not configured in config', () => {
    expect('Rudder').toEqual(getSourceName({}));
  });

  it('empty source name is passed in config', () => {
    expect('Rudder').toEqual(getSourceName({ sourceName: '' }));
  });
});
