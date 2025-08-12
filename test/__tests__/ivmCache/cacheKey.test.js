const {
  generateCacheKey,
  parseCacheKey,
} = require('../../../src/util/ivmCache/cacheKey');

describe('IVM Cache Key Generation', () => {
  describe('generateCacheKey', () => {
    test('should generate deterministic cache keys', () => {
      const transformationId = 'test-transformation-123';
      const code = 'function transformEvent(event) { return event; }';
      const libraryVersionIds = ['lodash-v1', 'moment-v2'];
      const testMode = false;
      const workspaceId = 'workspace-456';

      const key1 = generateCacheKey(transformationId, code, libraryVersionIds, testMode, workspaceId);
      const key2 = generateCacheKey(transformationId, code, libraryVersionIds, testMode, workspaceId);

      expect(key1).toBe(key2);
      expect(typeof key1).toBe('string');
      expect(key1.length).toBeGreaterThan(0);
    });

    test('should generate different keys for different inputs', () => {
      const baseParams = ['trans-1', 'code1', ['lib1'], false, 'ws1'];
      const key1 = generateCacheKey(...baseParams);

      // Different transformation ID
      const key2 = generateCacheKey('trans-2', 'code1', ['lib1'], false, 'ws1');
      expect(key1).not.toBe(key2);

      // Different code
      const key3 = generateCacheKey('trans-1', 'code2', ['lib1'], false, 'ws1');
      expect(key1).not.toBe(key3);

      // Different libraries
      const key4 = generateCacheKey('trans-1', 'code1', ['lib2'], false, 'ws1');
      expect(key1).not.toBe(key4);

      // Different test mode
      const key5 = generateCacheKey('trans-1', 'code1', ['lib1'], true, 'ws1');
      expect(key1).not.toBe(key5);

      // Different workspace
      const key6 = generateCacheKey('trans-1', 'code1', ['lib1'], false, 'ws2');
      expect(key1).not.toBe(key6);
    });

    test('should handle library order independently', () => {
      const params1 = ['trans-1', 'code1', ['lib1', 'lib2'], false, 'ws1'];
      const params2 = ['trans-1', 'code1', ['lib2', 'lib1'], false, 'ws1'];

      const key1 = generateCacheKey(...params1);
      const key2 = generateCacheKey(...params2);

      expect(key1).toBe(key2);
    });

    test('should handle null/undefined libraries', () => {
      const key1 = generateCacheKey('trans-1', 'code1', null, false, 'ws1');
      const key2 = generateCacheKey('trans-1', 'code1', undefined, false, 'ws1');
      const key3 = generateCacheKey('trans-1', 'code1', [], false, 'ws1');

      expect(key1).toBe(key2);
      expect(key2).toBe(key3);
    });

    test('should handle default workspace', () => {
      const key1 = generateCacheKey('trans-1', 'code1', [], false, null);
      const key2 = generateCacheKey('trans-1', 'code1', [], false, undefined);
      const key3 = generateCacheKey('trans-1', 'code1', [], false, 'default');

      expect(key1).toBe(key2);
      expect(key2).toBe(key3);
    });

    test('should normalize boolean testMode', () => {
      const key1 = generateCacheKey('trans-1', 'code1', [], true, 'ws1');
      const key2 = generateCacheKey('trans-1', 'code1', [], 'true', 'ws1');
      const key3 = generateCacheKey('trans-1', 'code1', [], 1, 'ws1');

      expect(key1).toBe(key2);
      expect(key2).toBe(key3);
    });

    test('should generate keys with expected format', () => {
      const key = generateCacheKey('trans-1', 'code1', ['lib1'], false, 'ws1');
      const parts = key.split(':');
      
      expect(parts).toHaveLength(5);
      expect(parts[0]).toBe('ws1'); // workspaceId
      expect(parts[1]).toBe('trans-1'); // transformationId
      expect(parts[2]).toHaveLength(16); // codeHash (16 chars)
      expect(parts[3]).toHaveLength(16); // libsHash (16 chars)
      expect(parts[4]).toBe('false'); // testMode
    });
  });

  describe('parseCacheKey', () => {
    test('should parse valid cache keys', () => {
      const originalKey = generateCacheKey('trans-1', 'code1', ['lib1'], true, 'ws1');
      const parsed = parseCacheKey(originalKey);

      expect(parsed).toEqual({
        workspaceId: 'ws1',
        transformationId: 'trans-1',
        codeHash: expect.stringMatching(/^[a-f0-9]{16}$/),
        libsHash: expect.stringMatching(/^[a-f0-9]{16}$/),
        testMode: true,
      });
    });

    test('should handle false testMode', () => {
      const key = generateCacheKey('trans-1', 'code1', ['lib1'], false, 'ws1');
      const parsed = parseCacheKey(key);

      expect(parsed.testMode).toBe(false);
    });

    test('should throw for invalid cache key format', () => {
      expect(() => parseCacheKey('invalid-key')).toThrow();
      expect(() => parseCacheKey('too:few:parts')).toThrow();
      expect(() => parseCacheKey('too:many:parts:here:now:extra')).toThrow();
      expect(() => parseCacheKey(123)).toThrow();
      expect(() => parseCacheKey(null)).toThrow();
    });

    test('should be reversible with generateCacheKey', () => {
      const params = ['trans-123', 'test code', ['lib1', 'lib2'], true, 'workspace-abc'];
      const key = generateCacheKey(...params);
      const parsed = parseCacheKey(key);

      expect(parsed.workspaceId).toBe('workspace-abc');
      expect(parsed.transformationId).toBe('trans-123');
      expect(parsed.testMode).toBe(true);
    });
  });

  describe('edge cases', () => {
    test('should handle large code strings', () => {
      const largeCode = 'a'.repeat(100000);
      const key = generateCacheKey('trans-1', largeCode, [], false, 'ws1');
      
      expect(typeof key).toBe('string');
      expect(key.length).toBeLessThan(200); // Key should remain short despite large input
    });

    test('should handle many libraries', () => {
      const manyLibs = Array.from({ length: 100 }, (_, i) => `lib-${i}`);
      const key = generateCacheKey('trans-1', 'code', manyLibs, false, 'ws1');
      
      expect(typeof key).toBe('string');
      expect(key.length).toBeLessThan(200);
    });

    test('should handle special characters in inputs', () => {
      const specialCode = `function test() { return "hello\\nworld"; /* comment */ }`;
      const specialTransId = 'trans-with-special-chars_123';
      const specialWorkspace = 'workspace-with_underscores-and-dashes';
      
      const key = generateCacheKey(specialTransId, specialCode, [], false, specialWorkspace);
      expect(typeof key).toBe('string');
      
      const parsed = parseCacheKey(key);
      expect(parsed.transformationId).toBe(specialTransId);
      expect(parsed.workspaceId).toBe(specialWorkspace);
    });

    test('should handle unicode characters', () => {
      const unicodeCode = `function test() { return "测试 🚀"; }`;
      const key = generateCacheKey('trans-1', unicodeCode, [], false, 'ws1');
      
      expect(typeof key).toBe('string');
      const parsed = parseCacheKey(key);
      expect(parsed.transformationId).toBe('trans-1');
    });
  });
});

