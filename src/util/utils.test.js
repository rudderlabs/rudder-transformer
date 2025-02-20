const { staticLookup } = require('./utils');

describe('staticLookup', () => {
  const transformationTags = { tag: 'value' };
  const RECORD_TYPE_A = 4;
  const HOST_NAME = 'example.com';
  const fetchAddressFromHostName = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    {
      name: 'should resolve the hostname and return the IP address',
      mockResponse: { address: '192.168.1.1', cacheHit: true },
      expectedArgs: [null, '192.168.1.1', RECORD_TYPE_A],
    },
    {
      name: 'should resolve the hostname and return the IP address with all option',
      options: { all: true },
      mockResponse: { address: '192.168.1.1', cacheHit: true },
      expectedArgs: [null, [{ address: '192.168.1.1', family: RECORD_TYPE_A }]],
    },
    {
      name: 'should handle errors from fetchAddressFromHostName',
      mockResponse: { error: 'DNS error', errorCode: 'ENOTFOUND' },
      expectedArgs: [new Error(`unable to resolve IP address for ${HOST_NAME}`), null],
    },
    {
      name: 'should handle empty address',
      mockResponse: { address: '', cacheHit: true },
      expectedArgs: [new Error(`resolved empty list of IP address for ${HOST_NAME}`), null],
    },
    {
      name: 'should handle localhost address',
      mockResponse: { address: '127.0.0.1', cacheHit: true },
      expectedArgs: [new Error(`cannot use 127.0.0.1 as IP address`), null],
    },
  ];

  testCases.forEach(({ name, options, mockResponse, expectedArgs }) => {
    it(name, async () => {
      if (mockResponse.error) {
        const error = new Error(mockResponse.error);
        error.code = mockResponse.errorCode;
        fetchAddressFromHostName.mockRejectedValueOnce(error);
      } else {
        fetchAddressFromHostName.mockResolvedValueOnce(mockResponse);
      }

      const resolve = staticLookup(transformationTags, fetchAddressFromHostName);
      const callback = (...args) => {
        expect(fetchAddressFromHostName).toHaveBeenCalledWith(HOST_NAME);
        expect(args).toEqual(expectedArgs);
      };

      resolve(HOST_NAME, options, callback);
    });
  });
});
