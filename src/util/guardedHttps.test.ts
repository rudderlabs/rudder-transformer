import { ConfigurationError } from '@rudderstack/integrations-lib';
import { guardedHttpsAgent, isPublicAddress, resolvePublicAddress } from './guardedHttps';

describe('guarded HTTPS connections', () => {
  const addressCases = [
    { address: '8.8.8.8', public: true },
    { address: '2606:4700:4700::1111', public: true },
    { address: '127.0.0.1', public: false },
    { address: '10.0.0.1', public: false },
    { address: '169.254.169.254', public: false },
    { address: '100.64.0.1', public: false },
    { address: '192.0.2.1', public: false },
    { address: '::1', public: false },
    { address: 'fd00::1', public: false },
    { address: '::ffff:127.0.0.1', public: false },
  ];

  it.each(addressCases)(
    'classifies $address as public=$public',
    ({ address, public: expected }) => {
      expect(isPublicAddress(address)).toBe(expected);
    },
  );

  it('rejects mixed public and private DNS answers', async () => {
    await expect(
      resolvePublicAddress('token.example.com', async () => [
        { address: '8.8.8.8', family: 4 },
        { address: '10.0.0.1', family: 4 },
      ]),
    ).rejects.toThrow(ConfigurationError);
  });

  it('pins a validated public address through the connection lookup', async () => {
    const agent = guardedHttpsAgent('https://token.example.com/token', undefined, async () => [
      { address: '8.8.8.8', family: 4 },
      { address: '1.1.1.1', family: 4 },
    ]);
    const lookup = agent.options.lookup as unknown as (
      host: string,
      options: { all: boolean },
      callback: (error: Error | null, address: string, family: number) => void,
    ) => void;
    const selected = await new Promise<{ address: string; family: number }>((resolve, reject) => {
      lookup('token.example.com', { all: false }, (error, address, family) => {
        if (error) reject(error);
        else resolve({ address, family });
      });
    });
    expect(selected).toEqual({ address: '8.8.8.8', family: 4 });
    agent.destroy();
  });

  const invalidUrlCases = [
    {
      target: 'http://token.example.com/token',
      origin: undefined,
      error: 'saved public HTTPS origin',
    },
    { target: 'https://127.0.0.1/token', origin: undefined, error: 'public IP address' },
    {
      target: 'https://api.example.com/send',
      origin: 'https://other.example.com',
      error: 'saved public HTTPS origin',
    },
    {
      target: 'https://user:pass@api.example.com/send',
      origin: undefined,
      error: 'saved public HTTPS origin',
    },
  ];

  it.each(invalidUrlCases)('rejects unsafe target $target', ({ target, origin, error }) => {
    expect(() => guardedHttpsAgent(target, origin)).toThrow(error);
  });
});
