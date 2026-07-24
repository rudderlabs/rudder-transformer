import request from 'supertest';
import { createHttpTerminator } from 'http-terminator';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { applicationRoutes } from '../../routes';
import { errorHandlerMiddleware } from '../../middlewares/errorHandler';
import { UserTransformService } from '../../services/userTransform';

let server: any;
const OLD_ENV = process.env;

beforeAll(async () => {
  process.env = { ...OLD_ENV };
  const app = new Koa();
  app.use(errorHandlerMiddleware());
  app.use(
    bodyParser({
      jsonLimit: '200mb',
    }),
  );
  applicationRoutes(app);
  server = app.listen();
});

afterAll(async () => {
  process.env = OLD_ENV;
  const httpTerminator = createHttpTerminator({
    server,
  });
  await httpTerminator.terminate();
});

afterEach(() => {
  jest.clearAllMocks();
});

const getData = () => [
  {
    message: { type: 'track', event: 'input event' },
    metadata: { jobId: 1 },
    destination: {},
  },
];

const expectResponseValidationError = (response: any, endpoint: string) => {
  expect(response.status).toEqual(500);
  expect(response.body.error).toEqual('Internal Server Error');
  expect(response.body.message).toContain(`Response schema validation failed for ${endpoint}`);
};

describe('User transform controller tests', () => {
  describe('Custom transform tests', () => {
    test('successful custom transform', async () => {
      const transformedEvents = [
        {
          output: { type: 'track', event: 'output event', anonymousId: 'anon-id' },
          metadata: { jobId: 1 },
          statusCode: 200,
        },
      ];
      const transformRoutineSpy = jest
        .spyOn(UserTransformService, 'transformRoutine')
        .mockResolvedValue({
          transformedEvents: transformedEvents as any,
          retryStatus: 200,
        });

      const response = await request(server)
        .post('/customTransform')
        .set('Accept', 'application/json')
        .send(getData());

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(transformedEvents);
      expect(response.header['apiversion']).toEqual('2');
      expect(transformRoutineSpy).toHaveBeenCalledWith(getData(), {}, expect.any(Number));
    });

    test('rejects invalid custom transform response schema', async () => {
      const transformRoutineSpy = jest
        .spyOn(UserTransformService, 'transformRoutine')
        .mockResolvedValue({
          transformedEvents: [
            {
              output: { event: 'missing required type' },
              metadata: { jobId: 1 },
              statusCode: 200,
            },
          ] as any,
          retryStatus: 200,
        });

      const response = await request(server)
        .post('/customTransform')
        .set('Accept', 'application/json')
        .send(getData());

      expectResponseValidationError(response, 'custom transform');
      expect(transformRoutineSpy).toHaveBeenCalledTimes(1);
    });
  });
});
