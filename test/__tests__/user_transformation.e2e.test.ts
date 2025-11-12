import request from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { createHttpTerminator, HttpTerminator } from 'http-terminator';
import { Server } from 'http';
import {
  TestEnvironment,
  createTestEvent,
  createTransformationRequest,
  validateTransformationResponse,
  getSuccessfulTransformations,
  getFailedTransformations,
} from '../mocks/user_transformation/utils/test-helpers';

describe('User Transformation E2E Tests', () => {
  let testEnv: TestEnvironment;
  let app: Koa;
  let server: Server;
  let httpTerminator: HttpTerminator;

  beforeAll(async () => {
    // Setup test environment with mock servers FIRST
    testEnv = new TestEnvironment();
    await testEnv.setup();
    const { applicationRoutes } = await import('../../src/routes/index');

    // Create Koa app with routes
    app = new Koa();
    app.use(bodyParser({ jsonLimit: '200mb' }));
    applicationRoutes(app);

    // Start the transformer server
    server = app.listen();
    httpTerminator = createHttpTerminator({ server });

    console.log('E2E Test environment ready');
  }, 30000);

  afterAll(async () => {
    // Cleanup
    if (httpTerminator) {
      await httpTerminator.terminate();
    }
    if (testEnv) {
      await testEnv.teardown();
    }
  }, 10000);

  describe('Basic JS Transformations', () => {
    test('should transform event with simple JS transformation', async () => {
      const testEvent = createTestEvent({
        properties: { originalProp: 'originalValue' },
      });

      const requestBody = createTransformationRequest([testEvent], 'simple-js-transform');

      const response = await request(server).post('/customTransform').send(requestBody).expect(200);

      const transformedEvents = validateTransformationResponse(response.body, 1);
      const successful = getSuccessfulTransformations(transformedEvents);

      expect(successful).toHaveLength(1);
      expect(successful[0].output?.properties?.transformed).toBe(true);
      expect(successful[0].output?.properties?.transformationType).toBe('simple');
      expect(successful[0].output?.properties?.originalProp).toBe('originalValue');
    });

    test('should handle async JS transformation', async () => {
      const testEvent = createTestEvent({
        properties: { asyncTest: true },
      });

      const requestBody = createTransformationRequest([testEvent], 'async-js-transform');

      const response = await request(server).post('/customTransform').send(requestBody).expect(200);

      const transformedEvents = validateTransformationResponse(response.body, 1);
      const successful = getSuccessfulTransformations(transformedEvents);

      expect(successful).toHaveLength(1);
      expect(successful[0].output?.properties?.transformed).toBe(true);
      expect(successful[0].output?.properties?.transformationType).toBe('async');
      expect(successful[0].output?.properties?.processedAt).toBeDefined();
    });

    test('should handle batch transformation', async () => {
      const testEvents = [
        createTestEvent({ properties: { batchItem: 1 } }),
        createTestEvent({ properties: { batchItem: 2 } }),
        createTestEvent({ properties: { batchItem: 3 } }),
      ];

      const requestBody = createTransformationRequest(testEvents, 'batch-js-transform');

      const response = await request(server).post('/customTransform').send(requestBody).expect(200);

      const transformedEvents = validateTransformationResponse(response.body, 3);
      const successful = getSuccessfulTransformations(transformedEvents);

      expect(successful).toHaveLength(3);

      successful.forEach((event, index) => {
        expect(event.output?.properties?.transformed).toBe(true);
        expect(event.output?.properties?.transformationType).toBe('batch');
        expect(event.output?.properties?.batchIndex).toBe(index);
        expect(event.output?.properties?.batchSize).toBe(3);
      });
    });
  });

  describe('JS Transformations with Libraries', () => {
    test('should transform event using lodash library', async () => {
      const testEvent = createTestEvent({
        properties: {
          snake_case_prop: 'value1',
          'kebab-case-prop': 'value2',
          internal: 'should-be-removed',
          debug: 'should-be-removed',
          normal_prop: 'value3',
        },
      });

      const requestBody = createTransformationRequest([testEvent], 'lodash-js-transform', [
        'lodash-lib-v1',
      ]);

      const response = await request(server).post('/customTransform').send(requestBody).expect(200);

      const transformedEvents = validateTransformationResponse(response.body, 1);
      const successful = getSuccessfulTransformations(transformedEvents);

      expect(successful).toHaveLength(1);

      const props = successful[0].output?.properties;
      expect(props?.transformed).toBe(true);
      expect(props?.transformationType).toBe('lodash');
      expect(props?.propertyCount).toBeGreaterThan(0);
      expect(props?.snakeCaseProp).toBe('value1'); // camelCased
      expect(props?.kebabCaseProp).toBe('value2'); // camelCased
      expect(props?.internal).toBeUndefined(); // omitted
      expect(props?.debug).toBeUndefined(); // omitted
    });
  });

  describe('JS Transformations with External API Calls', () => {
    test('should make real external API calls to mock server', async () => {
      const testEvent = createTestEvent({
        message: { userId: 'test-user-456' },
        properties: { needsRealEnrichment: true },
      });

      const requestBody = createTransformationRequest([testEvent], 'real-fetch-transform');

      const response = await request(server).post('/customTransform').send(requestBody).expect(200);

      const transformedEvents = validateTransformationResponse(response.body, 1);
      const successful = getSuccessfulTransformations(transformedEvents);

      expect(successful).toHaveLength(1);

      const props = successful[0].output?.properties;
      expect(props?.enriched).toBe(true);
      expect(props?.transformationType).toBe('real-fetch');
      expect(props?.externalData).toBeDefined();
      expect(props?.externalData?.source).toBe('mock-external-api');
      expect(props?.externalData?.originalData).toBeDefined();
      expect(props?.externalData?.originalData?.userId).toBe('test-user-456');
      expect(props?.fetchStatus).toBe(200);
    });

    test('should handle user profile enrichment from external API', async () => {
      const testEvent = createTestEvent({
        message: { userId: 'profile-user-789' },
        properties: { requestProfile: true },
      });

      const requestBody = createTransformationRequest([testEvent], 'profile-enrichment-transform');

      const response = await request(server).post('/customTransform').send(requestBody).expect(200);

      const transformedEvents = validateTransformationResponse(response.body, 1);
      const successful = getSuccessfulTransformations(transformedEvents);

      expect(successful).toHaveLength(1);

      const props = successful[0].output?.properties;
      expect(props?.enriched).toBe(true);
      expect(props?.transformationType).toBe('profile-enrichment');
      expect(props?.userProfile).toBeDefined();
      expect(props?.userProfile?.userId).toBe('profile-user-789');
      expect(props?.userProfile?.segment).toBe('premium');
      expect(props?.userProfile?.preferences).toEqual(['email', 'sms']);
      expect(props?.userProfile?.score).toBeGreaterThanOrEqual(0);
      expect(props?.userProfile?.score).toBeLessThan(100);
    });

    test('should handle external API errors gracefully', async () => {
      const testEvent = createTestEvent({
        message: { userId: 'error-user-123' },
        properties: { causeError: true },
      });

      const requestBody = createTransformationRequest([testEvent], 'error-api-transform');

      const response = await request(server).post('/customTransform').send(requestBody).expect(200);

      const transformedEvents = validateTransformationResponse(response.body, 1);
      const successful = getSuccessfulTransformations(transformedEvents);

      expect(successful).toHaveLength(1);

      const props = successful[0].output?.properties;
      expect(props?.transformationType).toBe('error-api');
      expect(props?.statusCode).toBe(500);
      expect(props?.apiResponse).toBeDefined();
      expect(props?.apiResponse?.error).toBe('Internal server error');
      expect(props?.apiResponse?.message).toContain('simulated error');
    });
  });

  describe('Error Handling', () => {
    test('should handle transformation errors gracefully', async () => {
      const testEvent = createTestEvent();
      const requestBody = createTransformationRequest([testEvent], 'error-js-transform');

      const response = await request(server).post('/customTransform').send(requestBody).expect(200);

      const transformedEvents = validateTransformationResponse(response.body, 1);
      const failed = getFailedTransformations(transformedEvents);

      expect(failed).toHaveLength(1);
      expect(failed[0].statusCode).toBe(400);
      expect(failed[0].error).toContain('Intentional transformation error');
    });

    test('should handle missing transformation version', async () => {
      const testEvent = createTestEvent();
      const requestBody = createTransformationRequest([testEvent], 'non-existent-transform');

      const response = await request(server).post('/customTransform').send(requestBody).expect(200);

      const transformedEvents = validateTransformationResponse(response.body, 1);
      const failed = getFailedTransformations(transformedEvents);

      expect(failed).toHaveLength(1);
      expect(failed[0].statusCode).toBe(404);
    });

    test('should handle event dropping (null return)', async () => {
      const testEvents = [
        createTestEvent({ message: { type: 'test' } }), // Should be dropped
        createTestEvent({ message: { type: 'track' } }), // Should be kept
      ];

      const requestBody = createTransformationRequest(testEvents, 'drop-event-transform');

      const response = await request(server).post('/customTransform').send(requestBody).expect(200);

      // Should only get one successful response (the non-dropped event)
      const transformedEvents = validateTransformationResponse(response.body);
      const successful = getSuccessfulTransformations(transformedEvents);

      expect(successful).toHaveLength(1);
      expect(successful[0].output?.type).toBe('track');
      expect(successful[0].output?.properties?.transformed).toBe(true);
    });
  });

  describe('Feature Flags', () => {
    test('should handle filter-code feature flag', async () => {
      const testEvents = [
        createTestEvent({ message: { type: 'test' } }), // Will be dropped
        createTestEvent({ message: { type: 'track' } }), // Will be kept
      ];

      const requestBody = createTransformationRequest(testEvents, 'drop-event-transform');

      const response = await request(server)
        .post('/customTransform')
        .set('X-Feature-Filter-Code', 'true')
        .send(requestBody)
        .expect(200);

      const transformedEvents = response.body;

      // With filter-code flag, we should get responses for both events
      // One successful, one with a special status indicating it was dropped
      expect(transformedEvents.length).toBeGreaterThanOrEqual(1);

      const successful = getSuccessfulTransformations(transformedEvents);
      expect(successful).toHaveLength(1);
      expect(successful[0].output?.type).toBe('track');
    });
  });

  describe('Multiple Events and Batching', () => {
    test('should handle multiple events with same transformation', async () => {
      const testEvents = Array.from({ length: 5 }, (_, i) =>
        createTestEvent({
          properties: { eventIndex: i, batch: 'test' },
        }),
      );

      const requestBody = createTransformationRequest(testEvents, 'simple-js-transform');

      const response = await request(server).post('/customTransform').send(requestBody).expect(200);

      const transformedEvents = validateTransformationResponse(response.body, 5);
      const successful = getSuccessfulTransformations(transformedEvents);

      expect(successful).toHaveLength(5);

      successful.forEach((event, index) => {
        expect(event.output?.properties?.transformed).toBe(true);
        expect(event.output?.properties?.transformationType).toBe('simple');
        expect(event.output?.properties?.eventIndex).toBe(index);
      });
    });

    test('should handle mixed success and error scenarios', async () => {
      // Test error transformation first
      const errorEvent = createTestEvent({ properties: { scenario: 'error' } });
      const errorRequestBody = createTransformationRequest([errorEvent], 'error-js-transform');

      const errorResponse = await request(server)
        .post('/customTransform')
        .send(errorRequestBody)
        .expect(200);

      const errorTransformedEvents = validateTransformationResponse(errorResponse.body, 1);
      const failed = getFailedTransformations(errorTransformedEvents);

      expect(failed).toHaveLength(1);
      expect(failed[0].error).toContain('Intentional transformation error');

      // Test success transformation
      const successEvent = createTestEvent({ properties: { scenario: 'success' } });
      const successRequestBody = createTransformationRequest([successEvent], 'simple-js-transform');

      const successResponse = await request(server)
        .post('/customTransform')
        .send(successRequestBody)
        .expect(200);

      const successTransformedEvents = validateTransformationResponse(successResponse.body, 1);
      const successful = getSuccessfulTransformations(successTransformedEvents);

      expect(successful).toHaveLength(1);
      expect(successful[0].output?.properties?.transformed).toBe(true);
    });
  });
});
