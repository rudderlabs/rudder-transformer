import http from 'http';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest';
import { createHttpTerminator } from 'http-terminator';
import { applicationRoutes } from '../../routes';

let server: http.Server;

beforeAll(() => {
  const app = new Koa();
  app.use(bodyParser({ jsonLimit: '200mb' }));
  applicationRoutes(app);
  server = app.listen();
});

afterAll(async () => {
  const httpTerminator = createHttpTerminator({ server });
  await httpTerminator.terminate();
});

const ENDPOINT = '/test-router/custom_audience/parse-template';

describe('POST /test-router/custom_audience/parse-template', () => {
  it('should return valid=true with recordFields for a valid template', async () => {
    const response = await request(server)
      .post(ENDPOINT)
      .send({
        requestBody: `{
          "data": $.records.({
            "email": .email,
            "phone": .phone_sha256
          })
        }`,
      });

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(true);
    expect('recordFields' in response.body && response.body.recordFields.sort()).toEqual([
      'email',
      'phone_sha256',
    ]);
  });

  it('should return valid=false with errors for an invalid template', async () => {
    const response = await request(server).post(ENDPOINT).send({ requestBody: '{ ...$.records }' });

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(false);
    expect('errors' in response.body && response.body.errors[0]).toMatch(/spread_expr/);
  });

  const badRequestCases = [
    {
      name: 'missing requestBody',
      body: {},
      expectedError: 'requestBody: Required',
    },
    {
      name: 'empty string requestBody',
      body: { requestBody: '' },
      expectedError: 'requestBody: requestBody must be a non-empty string',
    },
    {
      name: 'non-string requestBody',
      body: { requestBody: 123 },
      expectedError: 'requestBody: Expected string, received number',
    },
  ];

  it.each(badRequestCases)('should return 400: $name', async ({ body, expectedError }) => {
    const response = await request(server).post(ENDPOINT).send(body);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(expectedError);
  });
});
