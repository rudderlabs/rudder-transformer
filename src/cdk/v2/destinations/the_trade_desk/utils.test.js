const { AbortedError } = require('@rudderstack/integrations-lib');
const { getSignatureHeader, splitItemsBasedOnMaxSizeInBytes } = require('./utils');

describe('getSignatureHeader', () => {
  it('should calculate the signature header for a valid request and secret key', () => {
    const request = { data: 'example' };
    const secretKey = 'secret';
    const expected = 'rvxETQ7kIU5Cko3GddD2AeFpz8E=';

    const result = getSignatureHeader(request, secretKey);

    expect(result).toBe(expected);
  });

  it('should handle requests with different data types and secret key', () => {
    const request1 = { data: 'example' };
    const secretKey1 = 'secret';
    const expected1 = 'rvxETQ7kIU5Cko3GddD2AeFpz8E=';

    const result1 = getSignatureHeader(request1, secretKey1);

    expect(result1).toBe(expected1);

    const request2 = { data: 123 };
    const secretKey2 = 'secret';
    const expected2 = 'V5RSVwxqHRLkZftZ0+IrZAp4L4s=';

    const result2 = getSignatureHeader(request2, secretKey2);

    expect(result2).toBe(expected2);

    const request3 = { data: true };
    const secretKey3 = 'secret';
    const expected3 = 'oZ28NtyMYDGxRV0E+Tgvz7B1jds=';

    const result3 = getSignatureHeader(request3, secretKey3);

    expect(result3).toBe(expected3);
  });

  it('should throw an AbortedError when secret key is missing', () => {
    const request = { data: 'example' };
    const secretKey = null;

    expect(() => {
      getSignatureHeader(request, secretKey);
    }).toThrow(AbortedError);
  });
});

describe('splitItemsBasedOnMaxSizeInBytes', () => {
  it('should return an array with a single element when the total size of the items is less than or equal to the maximum size', () => {
    const items = [
      { id: 1, name: 'item1' },
      { id: 2, name: 'item2' },
      { id: 3, name: 'item3' },
    ];
    const maxSize = 100;
    const result = splitItemsBasedOnMaxSizeInBytes(items, maxSize);
    expect(result).toEqual([items]);
  });

  it('should split the items into batches of maximum size and return an array of batches', () => {
    // size of this items array is 121 bytes
    const items = [
      { id: 1, name: 'item1' },
      { id: 2, name: 'item2' },
      { id: 3, name: 'item3' },
      { id: 4, name: 'item4' },
      { id: 5, name: 'item5' },
    ];
    const maxSize = 100;
    const result = splitItemsBasedOnMaxSizeInBytes(items, maxSize);
    expect(result).toEqual([
      [
        { id: 1, name: 'item1' },
        { id: 2, name: 'item2' },
        { id: 3, name: 'item3' },
        { id: 4, name: 'item4' },
      ],
      [{ id: 5, name: 'item5' }],
    ]);
  });

  it('should return an empty array when the items array is empty', () => {
    const items = [];
    const maxSize = 100;
    const result = splitItemsBasedOnMaxSizeInBytes(items, maxSize);
    expect(result).toEqual([]);
  });
});
