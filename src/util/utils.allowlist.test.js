// ALLOW_IP_RANGES / BLOCK_IP_RANGES are read once at module load, so they must be
// configured BEFORE requiring utils. Loopback is both explicitly blocked and
// explicitly allowed here to prove the allow-list wins over both the configured
// denylist and the always-on core.
process.env.ALLOW_IP_RANGES = '127.0.0.0/8,::1/128';
process.env.BLOCK_IP_RANGES = '127.0.0.0/8';

const { isBlockedIP, ssrfSafeAgentFactory } = require('./utils');

describe('ALLOW_IP_RANGES precedence', () => {
  it('allows an address that is in the always-on core (allow overrides core)', () => {
    expect(isBlockedIP('127.0.0.1')).toBe(false);
  });

  it('allows an address that is also in BLOCK_IP_RANGES (allow overrides block)', () => {
    expect(isBlockedIP('127.0.0.5')).toBe(false);
  });

  it('still blocks core ranges that are not allow-listed', () => {
    expect(isBlockedIP('169.254.169.254')).toBe(true); // cloud metadata
    expect(isBlockedIP('0.0.0.0')).toBe(true);
  });

  it('honours an allow-listed IPv6 address, including bracket-stripping in the factory', () => {
    expect(isBlockedIP('::1')).toBe(false);
    expect(() => ssrfSafeAgentFactory(new URL('http://[::1]/'))).not.toThrow();
  });

  it('still allows public addresses', () => {
    expect(isBlockedIP('8.8.8.8')).toBe(false);
  });
});
