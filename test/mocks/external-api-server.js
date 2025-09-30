const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const { externalApiMocks } = require('./test-data/api-responses');

class MockExternalApiServer {
  constructor() {
    this.app = new Koa();
    this.router = new Router();
    this.server = null;
    this.port = null;
    this.setupRoutes();
  }

  setupRoutes() {
    // Middleware for JSON parsing and logging
    this.app.use(bodyParser());
    this.app.use(async (ctx, next) => {
      console.log('[MockExternalAPI] %s %s - Body:', ctx.method, ctx.url, ctx.request.body);
      await next();
    });

    // Dynamic route handler for external API mocks
    this.app.use(async (ctx) => {
      console.log(`[MockExternalAPI] Request: ${ctx.method} ${ctx.path}`);
      
      // Handle specific endpoints
      if (ctx.path === '/enrich' && ctx.method === 'POST') {
        console.log(`[MockExternalAPI] Handling enrich request with body:`, ctx.request.body);
        ctx.status = 200;
        ctx.set('content-type', 'application/json');
        ctx.body = {
          enriched: true,
          timestamp: new Date().toISOString(),
          source: 'mock-external-api',
          originalData: ctx.request.body
        };
        return;
      }
      
      if (ctx.path.startsWith('/user-profile') && ctx.method === 'GET') {
        const userId = ctx.query.userId;
        console.log(`[MockExternalAPI] Handling user profile request for userId: ${userId}`);
        ctx.status = 200;
        ctx.set('content-type', 'application/json');
        ctx.body = {
          profile: {
            userId: userId,
            segment: 'premium',
            preferences: ['email', 'sms'],
            lastSeen: new Date().toISOString(),
            score: Math.floor(Math.random() * 100)
          }
        };
        return;
      }
      
      if (ctx.path === '/error' && ctx.method === 'GET') {
        console.log(`[MockExternalAPI] Handling error endpoint`);
        ctx.status = 500;
        ctx.set('content-type', 'application/json');
        ctx.body = { 
          error: 'Internal server error',
          message: 'This is a simulated error from the mock API'
        };
        return;
      }
      
      // Fallback to original mock system for backwards compatibility
      const fullUrl = `${ctx.protocol}://api.example.com${ctx.path}`;
      const mockConfig = externalApiMocks[fullUrl];
      
      if (mockConfig) {
        // Check if method matches (if specified in mock)
        if (mockConfig.method && mockConfig.method !== ctx.method) {
          ctx.status = 405;
          ctx.body = { error: 'Method not allowed' };
          return;
        }

        const { response } = mockConfig;
        
        // Set headers
        if (response.headers) {
          Object.entries(response.headers).forEach(([key, value]) => {
            ctx.set(key, value);
          });
        }

        console.log(`[MockExternalAPI] Returning mock response for: ${fullUrl}`);
        ctx.status = response.status;
        ctx.body = response.body;
        return;
      }
      
      // No mock found
      console.log(`[MockExternalAPI] No mock found for: ${ctx.method} ${ctx.path}`);
      ctx.status = 404;
      ctx.body = { error: 'Mock endpoint not found', path: ctx.path, method: ctx.method };
    });
  }

  async start() {
    return new Promise((resolve, reject) => {
      // Let the system assign a free port
      this.server = this.app.listen(0, '127.0.0.1', (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        this.port = this.server.address().port;
        console.log(`[MockExternalAPI] Started on port ${this.port}`);
        resolve(this.port);
      });
    });
  }

  async stop() {
    if (this.server) {
      return new Promise((resolve) => {
        this.server.close(() => {
          console.log(`[MockExternalAPI] Stopped`);
          resolve();
        });
      });
    }
  }

  getBaseUrl() {
    // Use 127.0.0.1 instead of localhost for Docker compatibility
    return `http://127.0.0.1:${this.port}`;
  }

  // Helper method to add custom API mocks during tests
  addApiMock(url, mockConfig) {
    externalApiMocks[url] = mockConfig;
  }
}

module.exports = MockExternalApiServer;
