const { staticLookup } = require('./utils');

describe('staticLookup', () => {
  const transformationTags = { tag: 'value' };
  const RECORD_TYPE_A = 4;
  const HOST_NAME = 'example.com';
  const fetchAddressFromHostName = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve the hostname and return the IP address', async () => {
    const mockAddress = '192.168.1.1';
    fetchAddressFromHostName.mockResolvedValueOnce({ address: mockAddress, cacheHit: true });

    const resolve = staticLookup(transformationTags, fetchAddressFromHostName);
    const callback = (args) => {
      expect(fetchAddressFromHostName).toHaveBeenCalledWith(HOST_NAME);
      expect(args).toEqual(null, mockAddress, RECORD_TYPE_A);
    };
    resolve(HOST_NAME, null, callback);
  });

  it('should handle errors from fetchAddressFromHostName', async () => {
    const error = new Error('DNS error');
    error.code = 'ENOTFOUND';
    fetchAddressFromHostName.mockRejectedValueOnce(error);

    const resolve = staticLookup(transformationTags, fetchAddressFromHostName);
    const callback = (args) => {
      expect(fetchAddressFromHostName).toHaveBeenCalledWith(HOST_NAME);
      expect(args).toEqual(
        new Error(`unable to resolve IP address for ${HOST_NAME}`),
        null,
        RECORD_TYPE_A,
      );
    };
    resolve(HOST_NAME, null, callback);
  });

  it('should handle empty address', async () => {
    fetchAddressFromHostName.mockResolvedValueOnce({ address: '', cacheHit: true });

    const resolve = staticLookup(transformationTags, fetchAddressFromHostName);
    const callback = (args) => {
      expect(fetchAddressFromHostName).toHaveBeenCalledWith(HOST_NAME);
      expect(args).toEqual(
        new Error(`resolved empty list of IP address for ${HOST_NAME}`),
        null,
        RECORD_TYPE_A,
      );
    };
    resolve(HOST_NAME, null, callback);
  });

  it('should handle localhost address', async () => {
    const LOCALHOST_OCTET = '127';
    fetchAddressFromHostName.mockResolvedValueOnce({
      address: `${LOCALHOST_OCTET}.0.0.1`,
      cacheHit: true,
    });

    const resolve = staticLookup(transformationTags, fetchAddressFromHostName);
    const callback = (args) => {
      expect(fetchAddressFromHostName).toHaveBeenCalledWith(HOST_NAME);
      expect(args).toEqual(
        new Error(`cannot use ${LOCALHOST_OCTET}.0.0.1 as IP address`),
        null,
        RECORD_TYPE_A,
      );
    };
    resolve(HOST_NAME, null, callback);
  });
});
