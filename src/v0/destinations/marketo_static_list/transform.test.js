const { processMetadataForRouter } = require('./transform');

describe('transform', () => {
  describe('processMetadataForRouter', () => {
    it('should always return an array of metadata', () => {
      // Test with array metadata
      const outputWithArrayMetadata = {
        metadata: [{ userId: 'user1' }, { userId: 'user2' }],
        destination: { ID: 'dest1' },
      };
      const resultWithArray = processMetadataForRouter(outputWithArrayMetadata);
      expect(Array.isArray(resultWithArray)).toBe(true);
      expect(resultWithArray.length).toBe(2);
      expect(resultWithArray[0].destInfo).toEqual({ authKey: 'dest1' });
      expect(resultWithArray[1].destInfo).toEqual({ authKey: 'dest1' });

      // Test with non-array metadata
      const outputWithSingleMetadata = {
        metadata: { userId: 'user1' },
        destination: { ID: 'dest1' },
      };
      const resultWithSingle = processMetadataForRouter(outputWithSingleMetadata);
      expect(Array.isArray(resultWithSingle)).toBe(true);
      expect(resultWithSingle.length).toBe(1);
      expect(resultWithSingle[0].destInfo).toEqual({ authKey: 'dest1' });
    });
  });
});
