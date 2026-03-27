const { validateGeolocationIp } = require('../../src/util/geolocation');

describe('validateGeolocationIp', () => {
  describe('valid IPs', () => {
    const validIps = [
      '192.168.1.1',
      '10.0.0.1',
      '127.0.0.1',
      '255.255.255.255',
      '0.0.0.0',
      '01.02.03.04',        // leading zeros — accepted by ipaddr.js
      '192.168.001.001',    // leading zeros
      '::1',                // IPv6 loopback
      '2001:db8::1',        // IPv6
      '::ffff:127.0.0.1',  // IPv4-mapped IPv6
      '2001:0db8:0000:0000:0000:0000:0000:0001', // full IPv6
    ];

    test.each(validIps)('should accept valid IP: %s', (ip) => {
      expect(() => validateGeolocationIp(ip)).not.toThrow();
    });
  });

  describe('missing IP', () => {
    test.each([undefined, null, ''])('should throw for missing IP: %p', (ip) => {
      expect(() => validateGeolocationIp(ip)).toThrow('ip address is required');
    });
  });

  describe('invalid IPs', () => {
    const invalidIps = [
      'not-an-ip',
      'abc.def.ghi.jkl',
      '999.999.999.999',
      'hello world',
    ];

    test.each(invalidIps)('should throw for invalid IP: %s', (ip) => {
      expect(() => validateGeolocationIp(ip)).toThrow('invalid ip address');
    });
  });

  describe('path traversal attempts', () => {
    const traversalAttempts = [
      '../etc/passwd',
      '127.0.0.1/../../../etc/passwd',
      '127.0.0.1/../../',
      '127.0.0.1%2f..%2f..',
      '../../metrics',
      'fe80::1%2f..',
    ];

    test.each(traversalAttempts)('should throw for path traversal: %s', (ip) => {
      expect(() => validateGeolocationIp(ip)).toThrow('invalid ip address');
    });
  });
});
