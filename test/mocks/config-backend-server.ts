import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { Server } from 'http';
import { AddressInfo } from 'net';

interface TransformationMock {
  codeVersion: string;
  name: string;
  versionId: string;
  code: string;
  language?: string;
  [key: string]: any;
}

interface LibraryMock {
  versionId: string;
  name: string;
  code: string;
  [key: string]: any;
}

interface MockConfigBackendOptions {
  transformationMocks?: Record<string, any>;
  libraryMocks?: Record<string, any>;
  rudderLibraryMocks?: Record<string, any>;
}

class MockConfigBackend {
  private app: Koa;
  private router;
  private server: Server | null;
  private port: number | null;
  private mockExternalApiUrl: string | null;
  private transformationMocks: Record<string, any>;
  private libraryMocks: Record<string, any>;
  private rudderLibraryMocks: Record<string, any>;

  constructor(options: MockConfigBackendOptions = {}) {
    this.app = new Koa();
    this.router = new Router();
    this.server = null;
    this.port = null;
    this.mockExternalApiUrl = null;
    this.transformationMocks = options.transformationMocks || {};
    this.libraryMocks = options.libraryMocks || {};
    this.rudderLibraryMocks = options.rudderLibraryMocks || {};
    this.setupRoutes();
  }

  setMockExternalApiUrl(url: string): void {
    this.mockExternalApiUrl = url;
  }

  private setupRoutes(): void {
    // Middleware for JSON parsing and logging
    this.app.use(bodyParser());
    this.app.use(async (ctx, next) => {
      console.log('[MockConfigBackend] %s %s - Query:', ctx.method, ctx.url, ctx.query);
      await next();
    });

    // Mock transformation endpoint
    this.router.get('/transformation/getByVersionId', async (ctx) => {
      const { versionId } = ctx.query;

      if (!versionId || typeof versionId !== 'string') {
        ctx.status = 400;
        ctx.body = { error: 'versionId is required' };
        return;
      }

      const mockData = this.transformationMocks[versionId] as TransformationMock | undefined;
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
          this.mockExternalApiUrl,
        );
      }

      ctx.body = transformationData;
    });

    // Mock transformation library endpoint
    this.router.get('/transformationLibrary/getByVersionId', async (ctx) => {
      const { versionId } = ctx.query;

      if (!versionId || typeof versionId !== 'string') {
        ctx.status = 400;
        ctx.body = { error: 'versionId is required' };
        return;
      }

      const mockData = this.libraryMocks[versionId] as LibraryMock | undefined;
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
      const mockData = this.rudderLibraryMocks[libraryKey] || this.rudderLibraryMocks[name];

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

  async start(): Promise<number> {
    return new Promise((resolve, reject) => {
      // Let the system assign a free port
      this.server = this.app.listen(0, '127.0.0.1', (err?: Error) => {
        if (err) {
          reject(err);
          return;
        }

        const address = this.server?.address() as AddressInfo;
        this.port = address.port;
        console.log(`[MockConfigBackend] Started on port ${this.port}`);
        resolve(this.port);
      });
    });
  }

  async stop(): Promise<void> {
    if (this.server) {
      return new Promise((resolve) => {
        this.server?.close(() => {
          console.log(`[MockConfigBackend] Stopped`);
          resolve();
        });
      });
    }
  }

  getBaseUrl(): string {
    // Use 127.0.0.1 instead of localhost for Docker compatibility
    return `http://127.0.0.1:${this.port}`;
  }

  // Helper method to add custom mocks during tests
  addTransformationMock(versionId: string, mockData: TransformationMock): void {
    this.transformationMocks[versionId] = mockData;
  }

  addLibraryMock(versionId: string, mockData: LibraryMock): void {
    this.libraryMocks[versionId] = mockData;
  }

  addRudderLibraryMock(name: string, mockData: any): void {
    this.rudderLibraryMocks[name] = mockData;
  }
}

export default MockConfigBackend;
