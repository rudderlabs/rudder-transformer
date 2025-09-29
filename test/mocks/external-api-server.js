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
      console.log(`[MockExternalAPI] ${ctx.method} ${ctx.url} - Body:`, ctx.request.body);
      await next();
    });

    // Dynamic route handler for external API mocks - catch all routes
    this.app.use(async (ctx) => {
      const fullUrl = `${ctx.protocol}://api.example.com${ctx.path}`;
      const mockConfig = externalApiMocks[fullUrl];
      
      if (!mockConfig) {
        console.log(`[MockExternalAPI] No mock found for: ${fullUrl}`);
        ctx.status = 404;
        ctx.body = { error: 'Mock not found' };
        return;
      }

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
    });
  }

  async start() {
    return new Promise((resolve, reject) => {
      // Let the system assign a free port
      this.server = this.app.listen(0, 'localhost', (err) => {
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
    return `http://localhost:${this.port}`;
  }

  // Helper method to add custom API mocks during tests
  addApiMock(url, mockConfig) {
    externalApiMocks[url] = mockConfig;
  }
}

module.exports = MockExternalApiServer;
