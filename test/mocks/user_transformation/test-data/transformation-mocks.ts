// Mock transformation codes for different test scenarios
export const transformationMocks: Record<string, any> = {
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
    imports: [],
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
    imports: [],
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
    imports: ['lodash'],
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
    imports: [],
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
    imports: [],
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
    imports: [],
  },

  // Real external API call transformation (dynamic URL)
  'real-fetch-transform': {
    versionId: 'real-fetch-transform',
    code: `
      export async function transformEvent(event, metadata) {
        try {
          // This URL will be dynamically replaced in tests
          const response = await fetchV2('__MOCK_SERVER_URL__/enrich', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              userId: event.userId,
              eventType: event.type 
            })
          });
          
          event.properties = event.properties || {};
          event.properties.enriched = true;
          event.properties.transformationType = 'real-fetch';
          event.properties.externalData = response.body;
          event.properties.fetchStatus = response.status;
          
          return event;
        } catch (error) {
          event.properties = event.properties || {};
          event.properties.enrichmentError = error.message;
          event.properties.transformationType = 'real-fetch-error';
          return event;
        }
      }
    `,
    name: 'Real Fetch Transform',
    codeVersion: '1',
    language: 'javascript',
    workspaceId: 'test-workspace-1',
    imports: [],
  },

  // User profile enrichment transformation
  'profile-enrichment-transform': {
    versionId: 'profile-enrichment-transform',
    code: `
      export async function transformEvent(event, metadata) {
        try {
          const response = await fetchV2('__MOCK_SERVER_URL__/user-profile?userId=' + event.userId, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          
          if (response.status === 200) {
            event.properties = event.properties || {};
            event.properties.transformationType = 'profile-enrichment';
            event.properties.userProfile = response.body.profile;
            event.properties.enriched = true;
          } else {
            event.properties = event.properties || {};
            event.properties.enrichmentError = 'Profile not found';
            event.properties.transformationType = 'profile-enrichment-error';
          }
          
          return event;
        } catch (error) {
          event.properties = event.properties || {};
          event.properties.enrichmentError = error.message;
          event.properties.transformationType = 'profile-enrichment-error';
          return event;
        }
      }
    `,
    name: 'Profile Enrichment Transform',
    codeVersion: '1',
    language: 'javascript',
    workspaceId: 'test-workspace-1',
    imports: [],
  },

  // Error-prone external API call
  'error-api-transform': {
    versionId: 'error-api-transform',
    code: `
      export async function transformEvent(event, metadata) {
        try {
          const response = await fetchV2('__MOCK_SERVER_URL__/error', {
            method: 'GET'
          });
          
          event.properties = event.properties || {};
          event.properties.transformationType = 'error-api';
          event.properties.apiResponse = response.body;
          event.properties.statusCode = response.status;
          
          return event;
        } catch (error) {
          event.properties = event.properties || {};
          event.properties.enrichmentError = error.message;
          event.properties.transformationType = 'error-api-caught';
          return event;
        }
      }
    `,
    name: 'Error API Transform',
    codeVersion: '1',
    language: 'javascript',
    workspaceId: 'test-workspace-1',
    imports: [],
  },
};
