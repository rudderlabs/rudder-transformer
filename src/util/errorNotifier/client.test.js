const client = require('./client');

describe('errorNotifier client', () => {
  it('reduces metadata to the allowlist before delegating to the notifier', () => {
    const notify = jest.fn();
    client.setNotifier({ init: jest.fn(), notify });

    const err = new Error('boom');
    const payload = {
      status: 500,
      response: [
        {
          statusCode: 500,
          metadata: {
            jobId: 1,
            sourceId: 'src',
            destinationId: 'dst',
            workspaceId: 'ws',
            secret: { access_token: 'ya29.secret' },
          },
        },
      ],
    };

    client.notify(err, 'some context', payload);

    expect(notify).toHaveBeenCalledTimes(1);
    const [, , forwardedMetadata] = notify.mock.calls[0];
    expect(forwardedMetadata).toEqual({
      status: 500,
      response: [
        { statusCode: 500, metadata: { sourceId: 'src', destinationId: 'dst', workspaceId: 'ws' } },
      ],
    });
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
