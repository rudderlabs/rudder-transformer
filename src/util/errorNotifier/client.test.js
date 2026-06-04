const client = require('./client');

describe('errorNotifier client', () => {
  it('strips metadata before delegating to the notifier', () => {
    const notify = jest.fn();
    client.setNotifier({ init: jest.fn(), notify });

    const err = new Error('boom');
    const payload = {
      status: 500,
      response: [{ statusCode: 500, metadata: { secret: { access_token: 'ya29.secret' } } }],
    };

    client.notify(err, 'some context', payload);

    expect(notify).toHaveBeenCalledTimes(1);
    const [, , forwardedMetadata] = notify.mock.calls[0];
    expect(forwardedMetadata).toEqual({ status: 500, response: [{ statusCode: 500 }] });
    expect(JSON.stringify(forwardedMetadata)).not.toContain('access_token');
  });

  it('swallows notifier errors', () => {
    client.setNotifier({
      init: jest.fn(),
      notify: () => {
        throw new Error('notifier failed');
      },
    });

    expect(() => client.notify(new Error('boom'), 'ctx', {})).not.toThrow();
  });
});
