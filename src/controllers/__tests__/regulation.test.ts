import request from 'supertest';
import { createHttpTerminator } from 'http-terminator';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { applicationRoutes } from '../../routes';
import { ServiceSelector } from '../../helpers/serviceSelector';
import { NativeIntegrationDestinationService } from '../../services/destination/nativeIntegration';

let server: any;
const OLD_ENV = process.env;

beforeAll(async () => {
  process.env = { ...OLD_ENV }; // Make a copy
  const app = new Koa();
  app.use(
    bodyParser({
      jsonLimit: '200mb',
    }),
  );
  applicationRoutes(app);
  server = app.listen();
});

afterAll(async () => {
  process.env = OLD_ENV; // Restore old environment
  const httpTerminator = createHttpTerminator({
    server,
  });
  await httpTerminator.terminate();
});

afterEach(() => {
  jest.clearAllMocks();
});

const getDeletionData = () => {
  return [
    { userAttributes: [{ a: 'b1' }], destType: '__rudder_test__' },
    { userAttributes: [{ a: 'b1' }], destType: '__rudder_test__' },
  ];
};

describe('Regulation controller tests', () => {
  describe('Delete users tests', () => {
    test('successful delete users request', async () => {
      const mockDestinationService = new NativeIntegrationDestinationService();

      const expectedOutput = [{ statusCode: 400 }, { statusCode: 200 }];

      mockDestinationService.processUserDeletion = jest
        .fn()
        .mockImplementation((reqs, destInfo) => {
          expect(reqs).toEqual(getDeletionData());
          expect(destInfo).toEqual({ a: 'test' });

          return expectedOutput;
        });
      const getDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeDestinationService')
        .mockImplementation(() => {
          return mockDestinationService;
        });

      const response = await request(server)
        .post('/deleteUsers')
        .set('Accept', 'application/json')
        .set('x-rudder-dest-info', JSON.stringify({ a: 'test' }))
        .send(getDeletionData());

      expect(response.status).toEqual(400);
      expect(response.body).toEqual(expectedOutput);

      expect(getDestinationServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockDestinationService.processUserDeletion).toHaveBeenCalledTimes(1);
    });

    test('delete users request failure', async () => {
      const mockDestinationService = new NativeIntegrationDestinationService();

      mockDestinationService.processUserDeletion = jest
        .fn()
        .mockImplementation((reqs, destInfo) => {
          expect(reqs).toEqual(getDeletionData());
          expect(destInfo).toEqual({ a: 'test' });

          throw new Error('processUserDeletion error');
        });
      const getDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeDestinationService')
        .mockImplementation(() => {
          return mockDestinationService;
        });

      const response = await request(server)
        .post('/deleteUsers')
        .set('Accept', 'application/json')
        .set('x-rudder-dest-info', JSON.stringify({ a: 'test' }))
        .send(getDeletionData());

      expect(response.status).toEqual(500);
      expect(response.body).toEqual([{ error: {}, statusCode: 500 }]);

      expect(getDestinationServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockDestinationService.processUserDeletion).toHaveBeenCalledTimes(1);
    });
  });
});
