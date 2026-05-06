import sha256 from 'sha256';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import { HashingType } from '../../util/audienceUtils';
import {
  buildRequestHeaders,
  evaluateTemplate,
  injectCustomMappings,
  lookupActionConfig,
  processFields,
  resolveEndpoint,
} from './utils';
import { AUTHENTICATION_TYPES } from './constants';
import type {
  ActionConfig,
  CustomAudienceConnectionConfig,
  CustomAudienceDestConfig,
} from './types';

const baseConnection: CustomAudienceConnectionConfig = {
  audienceId: 'aud-42',
  isHashRequired: false,
};

const baseDestConfig: CustomAudienceDestConfig = {
  baseUrl: 'https://api.example.com',
  authenticationType: AUTHENTICATION_TYPES.NO_AUTH,
  actions: {
    insert: {
      endpoint: '/audiences/${$.connection.audienceId}/members',
      method: 'POST',
      requestBody: '{ "users": $.records }',
      batchSize: 100,
      fields: [],
    },
  },
};

const destinationMeta = { id: 'dest-1', type: 'CUSTOM_AUDIENCE', workspaceId: 'ws-1' };

describe('lookupActionConfig', () => {
  it('returns the action config when present', () => {
    const result = lookupActionConfig('insert', baseDestConfig);
    expect(result.endpoint).toBe('/audiences/${$.connection.audienceId}/members');
  });

  it('throws InstrumentationError when action key is missing', () => {
    expect(() => lookupActionConfig('delete', baseDestConfig)).toThrow(InstrumentationError);
  });
});

describe('evaluateTemplate', () => {
  const cases = [
    {
      name: 'object template with path resolution',
      template: '{ "name": $.connection.audienceName }',
      input: { connection: { audienceName: 'My Audience' } },
      expected: { name: 'My Audience' },
    },
    {
      name: 'iteration over records into objects',
      template: '$.records.({ "email": .email })',
      input: { records: [{ email: 'a@b.com' }, { email: 'c@d.com' }] },
      expected: [{ email: 'a@b.com' }, { email: 'c@d.com' }],
    },
    {
      name: 'single-element iteration returns object, not array (JSONata semantics)',
      template: '$.records.({ "email": .email })',
      input: { records: [{ email: 'a@b.com' }] },
      expected: { email: 'a@b.com' },
    },
  ];

  it.each(cases)('evaluates: $name', ({ template, input, expected }) => {
    expect(evaluateTemplate(template, input)).toEqual(expected);
  });

  it('throws InstrumentationError on syntax error', () => {
    expect(() => evaluateTemplate('let x =', {})).toThrow(InstrumentationError);
  });
});

describe('resolveEndpoint', () => {
  const cases = [
    {
      name: 'interpolates connection fields and prepends baseUrl',
      endpoint: '/audiences/${$.connection.audienceId}/members',
      baseUrl: 'https://api.example.com',
      expected: 'https://api.example.com/audiences/aud-42/members',
    },
    {
      name: 'strips trailing slash from baseUrl before joining',
      endpoint: '/v1/users',
      baseUrl: 'https://api.example.com/',
      expected: 'https://api.example.com/v1/users',
    },
    {
      name: 'adds leading slash if path lacks one',
      endpoint: 'v1/users',
      baseUrl: 'https://api.example.com',
      expected: 'https://api.example.com/v1/users',
    },
  ];

  it.each(cases)('$name', ({ endpoint, baseUrl, expected }) => {
    expect(resolveEndpoint(endpoint, baseUrl, baseConnection)).toBe(expected);
  });

  it('throws InstrumentationError when template fails', () => {
    expect(() => resolveEndpoint('${ ', 'https://api.example.com', baseConnection)).toThrow(
      InstrumentationError,
    );
  });
});

describe('injectCustomMappings', () => {
  const cases = [
    {
      name: 'returns fields untouched when no mappings',
      fields: { email: 'a@b.com' },
      mappings: undefined,
      expected: { email: 'a@b.com' },
    },
    {
      name: 'injects literal values onto target field names',
      fields: { email: 'a@b.com' },
      mappings: [{ from: 'fixed-list-id', to: 'listId' }],
      expected: { email: 'a@b.com', listId: 'fixed-list-id' },
    },
    {
      name: 'overwrites existing keys when target collides',
      fields: { listId: 'from-warehouse' },
      mappings: [{ from: 'fixed', to: 'listId' }],
      expected: { listId: 'fixed' },
    },
  ];

  it.each(cases)('$name', ({ fields, mappings, expected }) => {
    expect(injectCustomMappings(fields, mappings)).toEqual(expected);
  });
});

describe('processFields', () => {
  const insertAction: ActionConfig = {
    endpoint: '/x',
    method: 'POST',
    requestBody: '$.records',
    batchSize: 100,
    fields: [
      { name: 'email', hashType: HashingType.SHA256, isRequired: true, isCustom: false },
      { name: 'phone', hashType: HashingType.NONE, isRequired: false, isCustom: false },
    ],
  };

  const cases = [
    {
      name: 'strips empty values, no hashing when isHashRequired=false',
      fields: { email: 'a@b.com', phone: '', missing: null },
      isHashRequired: false,
      expected: { email: 'a@b.com' },
    },
    {
      name: 'hashes hashable fields when isHashRequired=true',
      fields: { email: 'a@b.com', phone: '+1' },
      isHashRequired: true,
      expected: { email: sha256('a@b.com'), phone: '+1' },
    },
  ];

  it.each(cases)('$name', ({ fields, isHashRequired, expected }) => {
    expect(processFields(fields, insertAction, destinationMeta, isHashRequired)).toEqual(expected);
  });

  it('throws InstrumentationError when all fields are stripped', () => {
    expect(() =>
      processFields({ email: null, phone: '' }, insertAction, destinationMeta, false),
    ).toThrow(InstrumentationError);
  });
});

describe('buildRequestHeaders', () => {
  const cases: {
    name: string;
    overrides: Partial<CustomAudienceDestConfig>;
    expectedHeaders: Record<string, string>;
  }[] = [
    {
      name: 'returns Content-Type only for noAuth + no headers',
      overrides: {},
      expectedHeaders: { 'Content-Type': 'application/json' },
    },
    {
      name: 'merges destination headers',
      overrides: { headers: [{ key: 'X-App', value: 'rudder' }] },
      expectedHeaders: { 'Content-Type': 'application/json', 'X-App': 'rudder' },
    },
    {
      name: 'builds Basic auth header with base64-encoded credentials',
      overrides: {
        authenticationType: AUTHENTICATION_TYPES.BASIC_AUTH,
        basicAuthUserName: 'user',
        basicAuthPassword: 'pass',
      },
      expectedHeaders: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from('user:pass').toString('base64')}`,
      },
    },
    {
      name: 'builds Bearer token header',
      overrides: { authenticationType: AUTHENTICATION_TYPES.BEARER_TOKEN, bearerToken: 'abc' },
      expectedHeaders: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer abc',
      },
    },
    {
      name: 'builds API key header with custom name',
      overrides: {
        authenticationType: AUTHENTICATION_TYPES.API_KEY,
        apiKeyName: 'X-API-Key',
        apiKeyValue: 'secret',
      },
      expectedHeaders: {
        'Content-Type': 'application/json',
        'X-API-Key': 'secret',
      },
    },
  ];

  it.each(cases)('$name', ({ overrides, expectedHeaders }) => {
    expect(buildRequestHeaders({ ...baseDestConfig, ...overrides })).toEqual(expectedHeaders);
  });
});
