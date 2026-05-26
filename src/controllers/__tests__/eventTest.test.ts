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

describe('POST /test-router/:version/:destination/batch', () => {
  const ENDPOINT_V2 = '/test-router/v0/custom_audience/batch';

  it('should return 400 for malformed request payload', async () => {
    const response = await request(server)
      .post(ENDPOINT_V2)
      .send({
        destination: {},
        connection: {},
        stage: { user_transform: false, dest_transform: true, send_to_destination: false },
        libraries: [],
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('events: Required');
  });

  it('should delegate valid payloads to EventTesterService.testEventV2', async () => {
    const testEventV2Spy = jest.spyOn(EventTesterService, 'testEventV2').mockResolvedValue({
      user_transformed_payload: [{ type: 'record' }],
      dest_transformed_payload: [],
      destination_response: [],
      destination_response_status: [],
    });

    const payload = {
      events: [{ type: 'record' }],
      destination: {
        workspaceId: 'ws-1',
        destinationDefinition: {},
      },
      connection: {},
      stage: { user_transform: false, dest_transform: false, send_to_destination: false },
      libraries: [],
    };

    const response = await request(server).post(ENDPOINT_V2).send(payload);

    expect(response.status).toBe(200);
    expect(testEventV2Spy).toHaveBeenCalledWith(payload, 'v0', 'custom_audience');
    expect(response.body).toEqual({
      user_transformed_payload: [{ type: 'record' }],
      dest_transformed_payload: [],
      destination_response: [],
      destination_response_status: [],
    });
  });
});
