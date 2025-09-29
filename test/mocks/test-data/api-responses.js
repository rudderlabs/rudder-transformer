// Mock transformation codes for different test scenarios
const transformationMocks = {
  // Simple JS transformation
  'simple-js-transform': {
    versionId: 'simple-js-transform',
    code: `
      export function transformEvent(event, metadata) {
        event.properties = event.properties || {};
        event.properties.transformed = true;
        event.properties.transformationType = 'simple';
        return event;
      }
    `,
    name: 'Simple Transform',
    codeVersion: '1',
    language: 'javascript',
    workspaceId: 'test-workspace-1',
    imports: []
  },

  // Async JS transformation
  'async-js-transform': {
    versionId: 'async-js-transform',
    code: `
      export async function transformEvent(event, metadata) {
        // Simulate async operation without setTimeout (not available in VM)
        await Promise.resolve();
        
        event.properties = event.properties || {};
        event.properties.transformed = true;
        event.properties.transformationType = 'async';
        event.properties.processedAt = new Date().toISOString();
        return event;
      }
    `,
    name: 'Async Transform',
    codeVersion: '1',
    language: 'javascript',
    workspaceId: 'test-workspace-1',
    imports: []
  },

  // JS transformation with fetch calls
  'fetch-js-transform': {
    versionId: 'fetch-js-transform',
    code: `
      export async function transformEvent(event, metadata) {
        // For e2e testing, simulate external API call result
        // In a real scenario, this would make an actual fetchV2 call
        event.properties = event.properties || {};
        event.properties.enriched = true;
        event.properties.transformationType = 'fetch';
        event.properties.externalData = {
          enriched: true,
          timestamp: '2023-01-01T00:00:00Z',
          source: 'external-api'
        };
        
        return event;
      }
    `,
    name: 'Fetch Transform',
    codeVersion: '1',
    language: 'javascript',
    workspaceId: 'test-workspace-1',
    imports: []
  },

  // JS transformation with lodash library
  'lodash-js-transform': {
    versionId: 'lodash-js-transform',
    code: `
      import _ from 'lodash';
      
      export function transformEvent(event, metadata) {
        event.properties = event.properties || {};
        
        // Use lodash to transform data
        const cleanedProperties = _.omit(event.properties, ['internal', 'debug']);
        const normalizedProperties = _.mapKeys(cleanedProperties, (value, key) => _.camelCase(key));
        
        event.properties = {
          ...normalizedProperties,
          transformed: true,
          transformationType: 'lodash',
          propertyCount: _.size(normalizedProperties)
        };
        
        return event;
      }
    `,
    name: 'Lodash Transform',
    codeVersion: '1',
    language: 'javascript',
    workspaceId: 'test-workspace-1',
    imports: ['lodash']
  },

  // Batch transformation
  'batch-js-transform': {
    versionId: 'batch-js-transform',
    code: `
      export function transformBatch(events, metadata) {
        return events.map((event, index) => {
          event.properties = event.properties || {};
          event.properties.transformed = true;
          event.properties.transformationType = 'batch';
          event.properties.batchIndex = index;
          event.properties.batchSize = events.length;
          return event;
        });
      }
    `,
    name: 'Batch Transform',
    codeVersion: '1',
    language: 'javascript',
    workspaceId: 'test-workspace-1',
    imports: []
  },

  // Error-prone transformation
  'error-js-transform': {
    versionId: 'error-js-transform',
    code: `
      export function transformEvent(event, metadata) {
        // This will throw an error
        throw new Error('Intentional transformation error');
      }
    `,
    name: 'Error Transform',
    codeVersion: '1',
    language: 'javascript',
    workspaceId: 'test-workspace-1',
    imports: []
  },

  // Transformation that returns null (drops event)
  'drop-event-transform': {
    versionId: 'drop-event-transform',
    code: `
      export function transformEvent(event, metadata) {
        // Drop events with specific conditions
        if (event.type === 'test') {
          return null;
        }
        
        event.properties = event.properties || {};
        event.properties.transformed = true;
        return event;
      }
    `,
    name: 'Drop Event Transform',
    codeVersion: '1',
    language: 'javascript',
    workspaceId: 'test-workspace-1',
    imports: []
  }
};

// Mock library codes
const libraryMocks = {
  'lodash-lib-v1': {
    versionId: 'lodash-lib-v1',
    code: `// Lodash library mock - simplified version
      const _ = {
        omit: (obj, keys) => {
          const result = { ...obj };
          keys.forEach(key => delete result[key]);
          return result;
        },
        mapKeys: (obj, iteratee) => {
          const result = {};
          Object.keys(obj).forEach(key => {
            result[iteratee(obj[key], key)] = obj[key];
          });
          return result;
        },
        camelCase: (str) => {
          return str.replace(/[-_\\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
        },
        size: (obj) => {
          return Object.keys(obj || {}).length;
        }
      };
      export default _;
    `,
    name: 'lodash',
    importName: 'lodash'
  },

  'moment-lib-v1': {
    versionId: 'moment-lib-v1',
    code: `// Moment library mock - simplified version
      const moment = {
        now: () => Date.now(),
        format: (date, format) => new Date(date).toISOString(),
        add: (date, amount, unit) => new Date(date.getTime() + amount * 1000),
        subtract: (date, amount, unit) => new Date(date.getTime() - amount * 1000)
      };
      export default moment;
    `,
    name: 'moment',
    importName: 'moment'
  }
};

// Mock Rudder library codes
const rudderLibraryMocks = {
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
    importName: '@rs/urlParser/v1'
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
    importName: '@rs/crypto/v1'
  }
};

// Mock external API responses for fetch calls made by user transformations
const externalApiMocks = {
  'https://api.example.com/enrich': {
    method: 'POST',
    response: {
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: {
        enriched: true,
        timestamp: '2023-01-01T00:00:00Z',
        source: 'external-api'
      }
    }
  },

  'https://api.example.com/user-profile': {
    method: 'GET',
    response: {
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: {
        profile: {
          segment: 'premium',
          preferences: ['email', 'sms'],
          lastSeen: '2023-01-01T00:00:00Z'
        }
      }
    }
  },

  'https://api.example.com/error': {
    method: 'GET',
    response: {
      status: 500,
      headers: { 'content-type': 'application/json' },
      body: { error: 'Internal server error' }
    }
  }
};

module.exports = {
  transformationMocks,
  libraryMocks,
  rudderLibraryMocks,
  externalApiMocks
};
