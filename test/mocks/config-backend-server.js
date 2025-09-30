const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const { transformationMocks, libraryMocks, rudderLibraryMocks } = require('./test-data/api-responses');

class MockConfigBackend {
  constructor() {
    this.app = new Koa();
    this.router = new Router();
    this.server = null;
    this.port = null;
    this.mockExternalApiUrl = null;
    this.setupRoutes();
  }

  setMockExternalApiUrl(url) {
    this.mockExternalApiUrl = url;
  }

  setupRoutes() {
    // Middleware for JSON parsing and logging
    this.app.use(bodyParser());
    this.app.use(async (ctx, next) => {
      console.log('[MockConfigBackend] %s %s - Query:', ctx.method, ctx.url, ctx.query);
      await next();
    });

    // Mock transformation endpoint
    this.router.get('/transformation/getByVersionId', async (ctx) => {
      const { versionId } = ctx.query;
      
      if (!versionId) {
        ctx.status = 400;
        ctx.body = { error: 'versionId is required' };
        return;
      }

      const mockData = transformationMocks[versionId];
      if (!mockData) {
        ctx.status = 404;
        ctx.body = { error: `Transformation not found for versionId: ${versionId}` };
        return;
      }

      console.log(`[MockConfigBackend] Returning transformation for versionId: ${versionId}`);
      
      // Replace placeholder URL with actual mock server URL if available
      let transformationData = { ...mockData };
      if (this.mockExternalApiUrl && transformationData.code) {
        transformationData.code = transformationData.code.replace(
          /__MOCK_SERVER_URL__/g,
          this.mockExternalApiUrl
        );
      }
      
      ctx.body = transformationData;
    });

    // Mock transformation library endpoint
    this.router.get('/transformationLibrary/getByVersionId', async (ctx) => {
      const { versionId } = ctx.query;
      
      if (!versionId) {
        ctx.status = 400;
        ctx.body = { error: 'versionId is required' };
        return;
      }

      const mockData = libraryMocks[versionId];
      if (!mockData) {
        ctx.status = 404;
        ctx.body = { error: `Library not found for versionId: ${versionId}` };
        return;
      }

      console.log(`[MockConfigBackend] Returning library for versionId: ${versionId}`);
      ctx.body = mockData;
    });

    // Mock rudder library endpoint
    this.router.get('/rudderstackTransformationLibraries/:name', async (ctx) => {
      const { name } = ctx.params;
      const { version } = ctx.query;
      
      if (!name) {
        ctx.status = 400;
        ctx.body = { error: 'library name is required' };
        return;
      }

      const libraryKey = version ? `${name}@${version}` : name;
      const mockData = rudderLibraryMocks[libraryKey] || rudderLibraryMocks[name];
      
      if (!mockData) {
        const versionSuffix = version ? `@${version}` : '';
        ctx.status = 404;
        ctx.body = { error: `Rudder library not found: ${name}${versionSuffix}` };
        return;
      }

      console.log(`[MockConfigBackend] Returning rudder library: ${libraryKey}`);
      ctx.body = mockData;
    });

    // Health check endpoint
    this.router.get('/health', async (ctx) => {
      ctx.body = { status: 'ok', port: this.port };
    });

    // Apply routes to app
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());

    // Catch-all for unmatched routes
    this.app.use(async (ctx) => {
      console.log(`[MockConfigBackend] Unmatched route: ${ctx.method} ${ctx.originalUrl}`);
      ctx.status = 404;
      ctx.body = { error: 'Route not found' };
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
        console.log(`[MockConfigBackend] Started on port ${this.port}`);
        resolve(this.port);
      });
    });
  }

  async stop() {
    if (this.server) {
      return new Promise((resolve) => {
        this.server.close(() => {
          console.log(`[MockConfigBackend] Stopped`);
          resolve();
        });
      });
    }
  }

  getBaseUrl() {
    // Use 127.0.0.1 instead of localhost for Docker compatibility
    return `http://127.0.0.1:${this.port}`;
  }

  // Helper method to add custom mocks during tests
  addTransformationMock(versionId, mockData) {
    transformationMocks[versionId] = mockData;
  }

  addLibraryMock(versionId, mockData) {
    libraryMocks[versionId] = mockData;
  }

  addRudderLibraryMock(name, mockData) {
    rudderLibraryMocks[name] = mockData;
  }
}

module.exports = MockConfigBackend;
