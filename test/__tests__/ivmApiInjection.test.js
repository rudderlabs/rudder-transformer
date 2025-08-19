const ivm = require('isolated-vm');
const { 
  createApiInjectors, 
  createBootstrapScript, 
  setupJailWithApis, 
  compileAndRunBootstrap 
} = require('../../src/util/ivmApiInjection');

describe('IVM API Injection Utilities', () => {
  let isolate;
  let context;
  let jail;

  beforeEach(async () => {
    isolate = new ivm.Isolate({ memoryLimit: 128 });
    context = await isolate.createContext();
    jail = context.global;
  });

  afterEach(async () => {
    if (context) {
      context.release();
    }
    if (isolate) {
      await isolate.dispose();
    }
  });

  describe('createApiInjectors', () => {
    test('should create API injectors with all required methods', () => {
      const injectors = createApiInjectors({
        transformationId: 'test-123',
        workspaceId: 'workspace-456',
        credentials: { apiKey: 'test-key' },
        testMode: true,
        logs: []
      });

      expect(injectors).toHaveProperty('injectIvm');
      expect(injectors).toHaveProperty('injectFetch');
      expect(injectors).toHaveProperty('injectFetchV2');
      expect(injectors).toHaveProperty('injectGeolocation');
      expect(injectors).toHaveProperty('injectGetCredential');
      expect(injectors).toHaveProperty('injectExtractStackTrace');
      expect(injectors).toHaveProperty('injectLog');
      expect(injectors).toHaveProperty('injectAllApis');
    });

    test('should inject IVM module', async () => {
      const injectors = createApiInjectors({});
      await injectors.injectIvm(jail);
      
      const ivmExists = await jail.get('_ivm');
      expect(ivmExists).toBeDefined();
    });

    test('should inject credentials API', async () => {
      const credentials = { apiKey: 'test-key', secret: 'test-secret' };
      const injectors = createApiInjectors({
        transformationId: 'test-123',
        workspaceId: 'workspace-456',
        credentials
      });
      
      await injectors.injectGetCredential(jail);
      
      const getCredential = await jail.get('_getCredential');
      expect(getCredential).toBeDefined();
      
      // Test the credential function
      const result = getCredential('apiKey');
      expect(result).toBe('test-key');
    });

    test('should inject all APIs at once', async () => {
      const injectors = createApiInjectors({
        transformationId: 'test-123',
        workspaceId: 'workspace-456',
        credentials: { apiKey: 'test-key' },
        testMode: true,
        logs: []
      });
      
      await injectors.injectAllApis(jail);
      
      // Check that all APIs are injected
      const ivm = await jail.get('_ivm');
      const fetch = await jail.get('_fetch');
      const fetchV2 = await jail.get('_fetchV2');
      const geolocation = await jail.get('_geolocation');
      const getCredential = await jail.get('_getCredential');
      const extractStackTrace = await jail.get('extractStackTrace');
      const log = await jail.get('log');
      
      expect(ivm).toBeDefined();
      expect(fetch).toBeDefined();
      expect(fetchV2).toBeDefined();
      expect(geolocation).toBeDefined();
      expect(getCredential).toBeDefined();
      expect(extractStackTrace).toBeDefined();
      expect(log).toBeDefined(); // Should be defined in test mode
    });
  });

  describe('createBootstrapScript', () => {
    test('should create bootstrap script with default options', () => {
      const script = createBootstrapScript();
      
      expect(script).toContain('let ivm = _ivm');
      expect(script).toContain('delete _ivm');
      expect(script).toContain('global.fetch = function');
      expect(script).toContain('global.fetchV2 = function');
      expect(script).toContain('global.geolocation = function');
      expect(script).toContain('global.getCredential = function');
      expect(script).toContain('function forwardMainPromise');
    });

    test('should create bootstrap script without getCredential', () => {
      const script = createBootstrapScript({ includeGetCredential: false });
      
      expect(script).toContain('global.fetch = function');
      expect(script).not.toContain('global.getCredential = function');
    });

    test('should create bootstrap script without forwardMainPromise', () => {
      const script = createBootstrapScript({ includeForwardMainPromise: false });
      
      expect(script).toContain('global.fetch = function');
      expect(script).not.toContain('function forwardMainPromise');
    });
  });

  describe('setupJailWithApis', () => {
    test('should setup jail with global object and APIs', async () => {
      await setupJailWithApis(jail, {
        transformationId: 'test-123',
        workspaceId: 'workspace-456',
        credentials: { apiKey: 'test-key' },
        testMode: true,
        logs: []
      });
      
      // Check global object
      const global = await jail.get('global');
      expect(global).toBeDefined();
      
      // Check APIs
      const ivm = await jail.get('_ivm');
      const fetch = await jail.get('_fetch');
      expect(ivm).toBeDefined();
      expect(fetch).toBeDefined();
    });
  });

  describe('compileAndRunBootstrap', () => {
    test('should compile and run bootstrap script successfully', async () => {
      // First setup the jail with APIs
      await setupJailWithApis(jail, {
        transformationId: 'test-123',
        workspaceId: 'workspace-456',
        credentials: { apiKey: 'test-key' }
      });
      
      const { bootstrap, bootstrapScriptResult } = await compileAndRunBootstrap(isolate, context, {
        includeGetCredential: true,
        includeForwardMainPromise: true
      });
      
      expect(bootstrap).toBeDefined();
      expect(bootstrapScriptResult).toBeDefined();
      
      // Verify that APIs were cleaned up and wrapped
      const ivmExists = await jail.get('_ivm');
      expect(ivmExists).toBeUndefined(); // Should be deleted by bootstrap
      
      const fetchExists = await jail.get('fetch');
      expect(fetchExists).toBeDefined(); // Should be the wrapped version
    });
  });

  describe('integration with real IVM context', () => {
    test('should work end-to-end like ivmFactory', async () => {
      const logs = [];
      
      // Setup like ivmFactory does
      await setupJailWithApis(jail, {
        transformationId: 'test-transformation',
        workspaceId: 'test-workspace',
        credentials: { apiKey: 'secret-key' },
        testMode: true,
        logs
      });
      
      // Run bootstrap
      const { bootstrap, bootstrapScriptResult } = await compileAndRunBootstrap(isolate, context, {
        includeGetCredential: true,
        includeForwardMainPromise: true
      });
      
      expect(bootstrap).toBeDefined();
      expect(bootstrapScriptResult).toBeDefined();
      
      // Test that user code can access the APIs
      const testScript = await isolate.compileScript(`
        const credential = getCredential('apiKey');
        credential === 'secret-key'
      `);
      
      const result = await testScript.run(context);
      expect(result).toBe(true);
    });
  });

  describe('error handling', () => {
    test('should handle missing credentials gracefully', async () => {
      const injectors = createApiInjectors({
        transformationId: 'test-123',
        workspaceId: 'workspace-456',
        credentials: null // Invalid credentials
      });
      
      await injectors.injectGetCredential(jail);
      
      const getCredential = await jail.get('_getCredential');
      const result = getCredential('apiKey');
      expect(result).toBeUndefined();
    });

    test('should handle invalid key for getCredential', async () => {
      const injectors = createApiInjectors({
        transformationId: 'test-123',
        workspaceId: 'workspace-456',
        credentials: { apiKey: 'test-key' }
      });
      
      await injectors.injectGetCredential(jail);
      
      const getCredential = await jail.get('_getCredential');
      expect(() => getCredential(null)).toThrow('Key should be valid and defined');
      expect(() => getCredential(undefined)).toThrow('Key should be valid and defined');
    });
  });
});
