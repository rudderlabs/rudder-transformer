import http from 'http';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest';
import { createHttpTerminator } from 'http-terminator';
import { applicationRoutes } from '../../routes';
import { EventTesterService } from '../../services/eventTest/eventTester';
import { sandboxedParseTemplate } from '../../v0/destinations/custom_audience/template/templateSandboxClient';
import { sandboxedParseHttpTemplates } from '../../v0/destinations/http/templateSandboxClient';

jest.mock('../../v0/destinations/custom_audience/template/templateSandboxClient');
jest.mock('../../v0/destinations/http/templateSandboxClient');
const mockParseTemplate = sandboxedParseTemplate as jest.MockedFunction<
  typeof sandboxedParseTemplate
>;
const mockParseHttpTemplates = sandboxedParseHttpTemplates as jest.MockedFunction<
  typeof sandboxedParseHttpTemplates
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
  mockParseHttpTemplates.mockReset();
});

const ENDPOINT = '/test-router/custom_audience/parse-template';

const makeActions = (requestBody: string) => ({
  insert: {
    requestBody,
  },
});

describe('POST /test-router/custom_audience/parse-template', () => {
  const template = `{
    "data": [$$.records.({
      "email": email,
      "phone": phone_sha256
    })]
  }`;

  it('should return valid=true with recordFields for a valid template', async () => {
    mockParseTemplate.mockResolvedValue({
      valid: true,
      recordFields: ['email', 'phone_sha256'],
    });

    const response = await request(server)
      .post(ENDPOINT)
      .send({
        action: 'insert',
        actions: makeActions(template),
        workspaceId: 'test-workspace',
      });

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(true);
    expect(response.body.recordFields.sort()).toEqual(['email', 'phone_sha256']);
    expect(mockParseTemplate).toHaveBeenCalledWith(template, 'test-workspace');
  });

  it('should return valid=false with errors for an invalid template', async () => {
    mockParseTemplate.mockResolvedValue({
      valid: false,
      errors: ['Expression type "spread_expr" is not supported.'],
    });

    const response = await request(server)
      .post(ENDPOINT)
      .send({
        action: 'insert',
        actions: makeActions('{ ...$.records }'),
        workspaceId: 'test-workspace',
      });

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(false);
    expect(response.body.errors[0]).toMatch(/spread_expr/);
  });

  it('should accept requestBody-only action config for delete action', async () => {
    mockParseTemplate.mockResolvedValue({
      valid: true,
      recordFields: ['email'],
    });

    const response = await request(server)
      .post(ENDPOINT)
      .send({
        action: 'delete',
        actions: {
          delete: {
            requestBody: template,
          },
        },
        workspaceId: 'test-workspace',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      valid: true,
      recordFields: ['email'],
    });
    expect(mockParseTemplate).toHaveBeenCalledWith(template, 'test-workspace');
  });

  it('should resolve useInsertConfig and validate with insert requestBody', async () => {
    mockParseTemplate.mockResolvedValue({
      valid: true,
      recordFields: ['email'],
    });

    const actions = {
      insert: makeActions(template).insert,
      update: {
        useInsertConfig: true,
      },
    };

    const response = await request(server)
      .post(ENDPOINT)
      .send({ action: 'update', actions, workspaceId: 'test-workspace' });

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(true);
    // Should have been called with insert's template, not update's empty one
    expect(mockParseTemplate).toHaveBeenCalledWith(template, 'test-workspace');
  });

  const badRequestCases = [
    {
      name: 'missing action',
      body: { actions: makeActions('x'), workspaceId: 'ws' },
      expectedError: 'action: Required',
    },
    {
      name: 'missing actions',
      body: { action: 'insert', workspaceId: 'ws' },
      expectedError: 'actions: Required',
    },
    {
      name: 'missing workspaceId',
      body: { action: 'insert', actions: makeActions('x') },
      expectedError: 'workspaceId: Required',
    },
    {
      name: 'empty string workspaceId',
      body: { action: 'insert', actions: makeActions('x'), workspaceId: '' },
      expectedError: 'workspaceId: workspaceId must be a non-empty string',
    },
    {
      name: 'invalid action value',
      body: { action: 'upsert', actions: makeActions('x'), workspaceId: 'ws' },
      expectedError:
        "action: Invalid enum value. Expected 'insert' | 'update' | 'delete', received 'upsert'",
    },
    {
      name: 'missing requestBody in action config',
      body: {
        action: 'insert',
        actions: {
          insert: {
            endpoint: '/members',
          },
        },
        workspaceId: 'ws',
      },
      expectedError: 'actions.insert.requestBody: Required',
    },
  ];

  it.each(badRequestCases)('should return 400: $name', async ({ body, expectedError }) => {
    const response = await request(server).post(ENDPOINT).send(body);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(expectedError);
  });
});

describe('POST /test-router/http/parse-template', () => {
  it('returns indexed errors for all four surfaces in one request', async () => {
    mockParseHttpTemplates.mockImplementation(async (templates) =>
      templates.map((template) =>
        template.includes('$map')
          ? { valid: false, errors: ['Function calls are not supported'] }
          : { valid: true, recordFields: [] },
      ),
    );
    const response = await request(server)
      .post('/test-router/http/parse-template')
      .send({
        workspaceId: 'ws',
        requestBodyTemplate: '$map($$.events)',
        headers: [{ from: 'literal' }, { from: '$map($$.message)' }],
        queryParams: [{ from: '$map($$.message)' }],
        pathParams: [{ path: '$map($$.message)' }],
      });
    expect(response.body).toEqual({
      valid: false,
      errors: [
        { field: 'requestBodyTemplate', messages: ['Function calls are not supported'] },
        { field: 'headers', index: 1, messages: ['Function calls are not supported'] },
        { field: 'queryParams', index: 0, messages: ['Function calls are not supported'] },
        { field: 'pathParams', index: 0, messages: ['Function calls are not supported'] },
      ],
      message:
        'requestBodyTemplate: Function calls are not supported, headers[1]: Function calls are not supported, queryParams[0]: Function calls are not supported, pathParams[0]: Function calls are not supported',
    });
    expect(mockParseHttpTemplates).toHaveBeenCalledWith(
      ['$map($$.events)', '"literal"', '$map($$.message)', '$map($$.message)', '$map($$.message)'],
      'ws',
    );
  });

  it('verifies groups in the same call and reports their original indices', async () => {
    mockParseHttpTemplates.mockImplementation(async (templates) =>
      templates.map((template) =>
        template.includes('$map')
          ? { valid: false, errors: ['Invalid function'] }
          : { valid: true, recordFields: [] },
      ),
    );
    const response = await request(server)
      .post('/test-router/http/parse-template')
      .send({
        workspaceId: 'ws',
        requestBodyTemplate: '$$.events',
        eventOverrides: [
          { requestBodyTemplate: '$$.events', pathParams: [{ path: 'valid' }] },
          {
            requestBodyTemplate: '$map($$.events)',
            queryParams: [{ from: 'valid' }, { from: '$map($$.message)' }],
            pathParams: [{ path: '$map($$.message)' }],
          },
        ],
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      valid: false,
      errors: [
        { field: 'requestBodyTemplate', group: 1, messages: ['Invalid function'] },
        { field: 'queryParams', index: 1, group: 1, messages: ['Invalid function'] },
        { field: 'pathParams', index: 0, group: 1, messages: ['Invalid function'] },
      ],
      message:
        'eventOverrides[1].requestBodyTemplate: Invalid function, eventOverrides[1].queryParams[1]: Invalid function, eventOverrides[1].pathParams[0]: Invalid function',
    });
    expect(mockParseHttpTemplates).toHaveBeenCalledTimes(1);
    expect(mockParseHttpTemplates).toHaveBeenCalledWith(
      [
        '$$.events',
        '$$.events',
        '"valid"',
        '$map($$.events)',
        '"valid"',
        '$map($$.message)',
        '$map($$.message)',
      ],
      'ws',
    );
  });

  it('accepts a whole destination config and reports cross-group duplicates and missing mappings', async () => {
    mockParseHttpTemplates.mockImplementation(async (templates) =>
      templates.map(() => ({ valid: true, recordFields: [] })),
    );
    const response = await request(server)
      .post('/test-router/http/parse-template')
      .send({
        workspaceId: 'ws',
        apiUrl: 'https://example.com',
        requestBodyTemplate: '$$.events',
        headers: [{ to: 'X-Id', from: 'id' }],
        pathParams: [{}],
        eventOverrides: [
          { name: 'Orders', events: ['Order Completed', 'Order Completed', 'Lead Submitted'] },
          {
            name: 'Leads',
            events: ['Lead Submitted', 'order completed'],
            queryParams: [{ to: 'source' }],
            maxBatchSize: '50',
          },
        ],
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      valid: false,
      errors: [
        { field: 'pathParams', index: 0, messages: ['is required'] },
        { field: 'queryParams', index: 0, group: 1, messages: ['is required'] },
        {
          field: 'events',
          group: 1,
          messages: ['event "Lead Submitted" is already in eventOverrides[0]'],
        },
      ],
      message:
        'pathParams[0]: is required, eventOverrides[1] "Leads".queryParams[0]: is required, eventOverrides[1] "Leads".events: event "Lead Submitted" is already in eventOverrides[0]',
    });
    expect(mockParseHttpTemplates).toHaveBeenCalledWith(['$$.events', '"id"'], 'ws');
  });

  it('omits message when every template is valid', async () => {
    mockParseHttpTemplates.mockImplementation(async (templates) =>
      templates.map(() => ({ valid: true, recordFields: [] })),
    );
    const response = await request(server)
      .post('/test-router/http/parse-template')
      .send({ workspaceId: 'ws', requestBodyTemplate: '$$.events' });
    expect(response.body).toEqual({ valid: true, errors: [] });
  });

  it.each([
    { eventOverrides: {}, error: 'eventOverrides' },
    {
      eventOverrides: [{ pathParams: [{ path: 5 }] }],
      error: 'eventOverrides.0.pathParams.0.path',
    },
    {
      eventOverrides: [{ queryParams: [{ from: 5 }] }],
      error: 'eventOverrides.0.queryParams.0.from',
    },
    { eventOverrides: Array.from({ length: 21 }, () => ({})), error: 'eventOverrides' },
    {
      eventOverrides: [{ queryParams: Array.from({ length: 101 }, () => ({ from: 'x' })) }],
      error: 'eventOverrides.0.queryParams',
    },
    {
      eventOverrides: [{ pathParams: Array.from({ length: 101 }, () => ({ path: 'x' })) }],
      error: 'eventOverrides.0.pathParams',
    },
    {
      eventOverrides: [{ requestBodyTemplate: 'x'.repeat(10_001) }],
      error: 'eventOverrides.0.requestBodyTemplate',
    },
  ])('rejects malformed eventOverrides %p', async ({ eventOverrides, error }) => {
    const response = await request(server).post('/test-router/http/parse-template').send({
      workspaceId: 'ws',
      requestBodyTemplate: '$$.events',
      eventOverrides,
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toContain(error);
    expect(mockParseHttpTemplates).not.toHaveBeenCalled();
  });

  it('rejects excessive total fields before sandbox parsing', async () => {
    const response = await request(server)
      .post('/test-router/http/parse-template')
      .send({
        workspaceId: 'ws',
        requestBodyTemplate: '$$.events',
        eventOverrides: Array.from({ length: 5 }, () => ({
          pathParams: Array.from({ length: 100 }, () => ({ path: 'x' })),
          requestBodyTemplate: '$$.events',
        })),
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('at most 500 fields');
    expect(mockParseHttpTemplates).not.toHaveBeenCalled();
  });

  it('rejects missing body template', async () => {
    const response = await request(server)
      .post('/test-router/http/parse-template')
      .send({ workspaceId: 'ws' });
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('requestBodyTemplate: Required');
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
      dest_transform_output: [],
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
      dest_transform_output: [],
    });
  });
});
