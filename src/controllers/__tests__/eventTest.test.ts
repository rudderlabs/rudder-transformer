import http from 'http';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest';
import { createHttpTerminator } from 'http-terminator';
import { applicationRoutes } from '../../routes';
import { EventTesterService } from '../../services/eventTest/eventTester';
import { sandboxedParseTemplate } from '../../v0/destinations/custom_audience/template/templateSandboxClient';

jest.mock('../../v0/destinations/custom_audience/template/templateSandboxClient');
const mockParseTemplate = sandboxedParseTemplate as jest.MockedFunction<
  typeof sandboxedParseTemplate
>;

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

beforeEach(() => {
  mockParseTemplate.mockReset();
});

const ENDPOINT = '/test-router/custom_audience/parse-template';

describe('POST /test-router/custom_audience/parse-template', () => {
  it('should return valid=true with recordFields for a valid template', async () => {
    mockParseTemplate.mockResolvedValue({
      valid: true,
      recordFields: ['email', 'phone_sha256'],
    });

    const response = await request(server)
      .post(ENDPOINT)
      .send({
        requestBody: `{
          "data": $.records.({
            "email": .email,
            "phone": .phone_sha256
          })
        }`,
        workspaceId: 'test-workspace',
      });

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(true);
    expect(response.body.recordFields.sort()).toEqual(['email', 'phone_sha256']);
    expect(mockParseTemplate).toHaveBeenCalledWith(expect.any(String), 'test-workspace');
  });

  it('should return valid=false with errors for an invalid template', async () => {
    mockParseTemplate.mockResolvedValue({
      valid: false,
      errors: ['Expression type "spread_expr" is not supported.'],
    });

    const response = await request(server)
      .post(ENDPOINT)
      .send({ requestBody: '{ ...$.records }', workspaceId: 'test-workspace' });

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(false);
    expect(response.body.errors[0]).toMatch(/spread_expr/);
  });

  const badRequestCases = [
    {
      name: 'missing requestBody',
      body: { workspaceId: 'ws' },
      expectedError: 'requestBody: Required',
    },
    {
      name: 'empty string requestBody',
      body: { requestBody: '', workspaceId: 'ws' },
      expectedError: 'requestBody: requestBody must be a non-empty string',
    },
    {
      name: 'non-string requestBody',
      body: { requestBody: 123, workspaceId: 'ws' },
      expectedError: 'requestBody: Expected string, received number',
    },
    {
      name: 'missing workspaceId',
      body: { requestBody: '{ "a": 1 }' },
      expectedError: 'workspaceId: Required',
    },
    {
      name: 'empty string workspaceId',
      body: { requestBody: '{ "a": 1 }', workspaceId: '' },
      expectedError: 'workspaceId: workspaceId must be a non-empty string',
    },
  ];

  it.each(badRequestCases)('should return 400: $name', async ({ body, expectedError }) => {
    const response = await request(server).post(ENDPOINT).send(body);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(expectedError);
  });
});

describe('POST /test-router/:version/:destination', () => {
  it('returns batched group responses from EventTesterService', async () => {
    const testEventSpy = jest
      .spyOn(EventTesterService, 'testEvent')
      .mockResolvedValue([{ source_event_indexes: [0], group: { stage: {} } }] as never[]);

    const response = await request(server)
      .post('/test-router/v0/custom_audience')
      .send({ events: [{ stage: {}, destination: {}, message: {} }] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ source_event_indexes: [0], group: { stage: {} } }]);
    expect(testEventSpy).toHaveBeenCalledWith(
      [{ stage: {}, destination: {}, message: {} }],
      'v0',
      'custom_audience',
    );
  });
});
