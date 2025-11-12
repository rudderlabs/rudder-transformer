// Mock Rudder library codes
export const rudderLibraryMocks: Record<string, any> = {
  'urlParser@v1': {
    code: `// URL Parser library mock
      const URLSearchParams = class {
        constructor(url) {
          this.params = new Map();
          if (url && url.includes('?')) {
            const queryString = url.split('?')[1];
            queryString.split('&').forEach(param => {
              const [key, value] = param.split('=');
              this.params.set(decodeURIComponent(key), decodeURIComponent(value || ''));
            });
          }
        }
        
        get(key) {
          return this.params.get(key);
        }
        
        has(key) {
          return this.params.has(key);
        }
      };
      
      export default { URLSearchParams };
    `,
    name: 'urlParser',
    importName: '@rs/urlParser/v1',
  },

  'crypto@v1': {
    code: `// Crypto library mock
      const crypto = {
        randomUUID: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        }),
        
        createHash: (algorithm) => ({
          update: (data) => ({
            digest: (encoding) => {
              // Simple hash mock
              let hash = 0;
              for (let i = 0; i < data.length; i++) {
                const char = data.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
              }
              return Math.abs(hash).toString(16);
            }
          })
        })
      };
      
      export default crypto;
    `,
    name: 'crypto',
    importName: '@rs/crypto/v1',
  },
};
