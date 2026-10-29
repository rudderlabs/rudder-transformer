import sha256 from 'sha256';
import {
  ConfigurationError,
  InstrumentationError,
  OAuthSecretError,
} from '@rudderstack/integrations-lib';
import { HashingType } from '../../util/audienceUtils';
import {
  buildRequestHeaders,
  injectCustomMappings,
  lookupActionConfig,
  processFields,
  resolveEndpoint,
  validateRequiredFields,
} from './utils';
import { ACCOUNT_DEFINITION_NAMES } from './constants';
import { clientCredentialsTokenProvider } from './clientCredentials';
import type {
  ActionConfig,
  CustomAudienceAuthMetadata,
  CustomAudienceConnectionDestConfig,
  CustomAudienceDestConfig,
  CustomAudienceDestination,
} from './types';

const baseConnection: CustomAudienceConnectionDestConfig = {
  audienceId: 'aud-42',
  isHashRequired: false,
};

const baseDestConfig: CustomAudienceDestConfig = {
  baseUrl: 'https://api.example.com',
  actions: {
    insert: {
      endpoint: '/audiences/{{connection.audienceId}}/members',
      method: 'POST',
      requestBody: '{ "users": $.records }',
      batchSize: 100,
      fields: [],
    },
  },
};

const destinationMeta = { id: 'dest-1', type: 'CUSTOM_AUDIENCE', workspaceId: 'ws-1' };

describe('lookupActionConfig', () => {
  it('returns the action and config when present', () => {
    const result = lookupActionConfig('insert', baseDestConfig.actions);
    expect(result.action).toBe('insert');
    expect(result.config.endpoint).toBe('/audiences/{{connection.audienceId}}/members');
  });

  it('throws InstrumentationError when action key is missing', () => {
    expect(() => lookupActionConfig('delete', baseDestConfig.actions)).toThrow(
      InstrumentationError,
    );
  });

  const useInsertConfigCases = [
    {
      name: 'resolves to insert action and config when useInsertConfig is true',
      updateConfig: {
        ...baseDestConfig.actions.insert!,
        endpoint: '/update-path',
        useInsertConfig: true,
      },
      expectedAction: 'insert',
      expectedEndpoint: '/audiences/{{connection.audienceId}}/members',
    },
    {
      name: 'keeps update action and config when useInsertConfig is false',
      updateConfig: {
        ...baseDestConfig.actions.insert!,
        endpoint: '/update-path',
        useInsertConfig: false,
      },
      expectedAction: 'update',
      expectedEndpoint: '/update-path',
    },
    {
      name: 'keeps update action and config when useInsertConfig is absent',
      updateConfig: { ...baseDestConfig.actions.insert!, endpoint: '/update-path' },
      expectedAction: 'update',
      expectedEndpoint: '/update-path',
    },
  ];

  it.each(useInsertConfigCases)('$name', ({ updateConfig, expectedAction, expectedEndpoint }) => {
    const config: CustomAudienceDestConfig = {
      ...baseDestConfig,
      actions: { ...baseDestConfig.actions, update: updateConfig },
    };
    const result = lookupActionConfig('update', config.actions);
    expect(result.action).toBe(expectedAction);
    expect(result.config.endpoint).toBe(expectedEndpoint);
  });

  it('throws when useInsertConfig is true but insert config is missing', () => {
    const config: CustomAudienceDestConfig = {
      ...baseDestConfig,
      actions: {
        update: { ...baseDestConfig.actions.insert!, useInsertConfig: true },
      },
    };
    expect(() => lookupActionConfig('update', config.actions)).toThrow(InstrumentationError);
  });
});

describe('resolveEndpoint', () => {
  // audienceId is optional on the connection schema, so an endpoint template
  // referencing it is the only thing that makes it mandatory in practice.
  const connectionWithoutAudienceId: CustomAudienceConnectionDestConfig = {
    isHashRequired: false,
  };

  const cases = [
    {
      name: 'interpolates connection fields and prepends baseUrl',
      endpoint: '/audiences/{{connection.audienceId}}/members',
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
    {
      name: 'leaves template without placeholders unchanged',
      endpoint: '/static/path',
      baseUrl: 'https://api.example.com',
      expected: 'https://api.example.com/static/path',
    },
  ];

  const unresolvedCases = [
    {
      name: 'the connection omits audienceId but the endpoint references it',
      endpoint: '/audiences/{{connection.audienceId}}/members',
      connection: connectionWithoutAudienceId,
      expectedMessage:
        'Endpoint template references {{connection.audienceId}}, but the connection does not set it.',
    },
    {
      name: 'the connection stores audienceId as an empty string',
      endpoint: '/audiences/{{connection.audienceId}}/members',
      connection: { audienceId: '', isHashRequired: false },
      expectedMessage:
        'Endpoint template references {{connection.audienceId}}, but the connection does not set it.',
    },
    {
      name: 'the placeholder references a field that does not exist',
      endpoint: '/audiences/{{connection.nonExistent}}/members',
      connection: baseConnection,
      expectedMessage:
        'Endpoint template references {{connection.nonExistent}}, but the connection does not set it.',
    },
  ];

  it.each(cases)('$name', ({ endpoint, baseUrl, expected }) => {
    expect(resolveEndpoint(endpoint, baseUrl, baseConnection)).toBe(expected);
  });

  it('resolves an endpoint that does not reference audienceId when the connection omits it', () => {
    expect(
      resolveEndpoint('/v1/members', 'https://api.example.com', connectionWithoutAudienceId),
    ).toBe('https://api.example.com/v1/members');
  });

  it.each(unresolvedCases)('throws when $name', ({ endpoint, connection, expectedMessage }) => {
    const resolve = () => resolveEndpoint(endpoint, 'https://api.example.com', connection);
    expect(resolve).toThrow(InstrumentationError);
    expect(resolve).toThrow(expectedMessage);
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

  it('allows mapping targets that are not in configured action fields', () => {
    expect(
      injectCustomMappings({ email: 'a@b.com' }, [{ from: 'some-value', to: 'unknownField' }]),
    ).toEqual({ email: 'a@b.com', unknownField: 'some-value' });
  });
});

describe('validateRequiredFields', () => {
  const actionFields = [
    { name: 'email', hashType: HashingType.SHA256, isRequired: true, isCustom: false },
    { name: 'phone', hashType: HashingType.NONE, isRequired: true, isCustom: false },
    { name: 'listType', hashType: HashingType.NONE, isRequired: false, isCustom: true },
  ];

  it('does not throw when all required fields are present', () => {
    expect(() =>
      validateRequiredFields('insert', { email: 'a@b.com', phone: '+1' }, actionFields),
    ).not.toThrow();
  });

  it('throws InstrumentationError when required fields are missing', () => {
    expect(() => validateRequiredFields('insert', { email: 'a@b.com' }, actionFields)).toThrow(
      'Missing required fields for action "insert": phone',
    );
  });

  it.each([
    { name: 'null', fields: { email: 'a@b.com', phone: null } },
    { name: 'undefined', fields: { email: 'a@b.com', phone: undefined } },
    { name: 'empty string', fields: { email: 'a@b.com', phone: '' } },
    { name: 'false', fields: { email: 'a@b.com', phone: false } },
  ])('allows required field with $name value (key present)', ({ fields }) => {
    expect(() => validateRequiredFields('insert', fields, actionFields)).not.toThrow();
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
      fields: { email: sha256('a@b.com'), phone: '', missing: null },
      isHashRequired: false,
      expected: { email: sha256('a@b.com') },
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
  afterEach(() => jest.restoreAllMocks());

  const buildDestination = (
    configOverrides: Partial<CustomAudienceDestConfig> = {},
    deliveryAccount?: unknown,
  ): CustomAudienceDestination =>
    ({
      ID: 'dest-1',
      WorkspaceID: 'ws-1',
      Config: { ...baseDestConfig, ...configOverrides },
      deliveryAccount: deliveryAccount as CustomAudienceDestination['deliveryAccount'],
    }) as CustomAudienceDestination;

  const successCases: {
    name: string;
    destination: CustomAudienceDestination;
    metadata?: CustomAudienceAuthMetadata;
    expectedHeaders: Record<string, string>;
  }[] = [
    {
      name: 'returns Content-Type only when authentication is not configured',
      destination: buildDestination(),
      expectedHeaders: { 'Content-Type': 'application/json' },
    },
    {
      name: 'merges destination headers',
      destination: buildDestination({ headers: [{ key: 'X-App', value: 'rudder' }] }),
      expectedHeaders: { 'Content-Type': 'application/json', 'X-App': 'rudder' },
    },
    {
      name: 'uses linked Basic auth account',
      destination: buildDestination(
        { authenticationEnabled: true, rudderAccountId: 'account-1' },
        {
          accountDefinitionName: ACCOUNT_DEFINITION_NAMES.BASIC_AUTH,
          options: { basicAuthUserName: 'account-user' },
          secret: { basicAuthPassword: 'account-pass' },
        },
      ),
      expectedHeaders: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from('account-user:account-pass').toString('base64')}`,
      },
    },
    {
      name: 'uses linked Bearer token account',
      destination: buildDestination(
        { authenticationEnabled: true, rudderAccountId: 'account-1' },
        {
          accountDefinitionName: ACCOUNT_DEFINITION_NAMES.BEARER_TOKEN,
          options: {},
          secret: { bearerToken: 'account-token' },
        },
      ),
      expectedHeaders: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer account-token',
      },
    },
    {
      name: 'uses linked API key account',
      destination: buildDestination(
        { authenticationEnabled: true, rudderAccountId: 'account-1' },
        {
          accountDefinitionName: ACCOUNT_DEFINITION_NAMES.API_KEY,
          options: { apiKeyName: 'X-Account-Key' },
          secret: { apiKeyValue: 'account-secret' },
        },
      ),
      expectedHeaders: {
        'Content-Type': 'application/json',
        'X-Account-Key': 'account-secret',
      },
    },
    {
      name: 'uses metadata token for linked OAuth Client Credentials account',
      destination: buildDestination(
        { authenticationEnabled: true, rudderAccountId: 'account-1' },
        {
          accountDefinitionName: ACCOUNT_DEFINITION_NAMES.CLIENT_CREDENTIALS,
          options: {},
          secret: { accessToken: 'stale-account-token' },
        },
      ),
      metadata: {
        secret: { accessToken: 'client-credentials-token' },
      },
      expectedHeaders: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer client-credentials-token',
      },
    },
    {
      name: 'uses metadata token for linked OAuth Auth Code account over stale inline credentials',
      destination: buildDestination(
        {
          rudderAccountId: 'account-1',
          authenticationType: 'bearerToken',
          bearerToken: 'stale-inline-token',
        },
        {
          accountDefinitionName: ACCOUNT_DEFINITION_NAMES.OAUTH_AUTH_CODE,
          options: {},
          secret: {},
        },
      ),
      metadata: { secret: { accessToken: 'auth-code-token' } },
      expectedHeaders: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer auth-code-token',
      },
    },
    {
      name: 'removes every conflicting Authorization spelling before linked auth',
      destination: buildDestination(
        {
          authenticationEnabled: true,
          rudderAccountId: 'account-1',
          headers: [
            { key: 'Authorization', value: 'stale-1' },
            { key: 'authorization', value: 'stale-2' },
            { key: 'aUtHoRiZaTiOn', value: 'stale-3' },
            { key: 'X-App', value: 'keep' },
          ],
        },
        {
          accountDefinitionName: ACCOUNT_DEFINITION_NAMES.OAUTH_AUTH_CODE,
          options: {},
          secret: {},
        },
      ),
      metadata: { secret: { accessToken: 'metadata-token' } },
      expectedHeaders: {
        'Content-Type': 'application/json',
        'X-App': 'keep',
        Authorization: 'Bearer metadata-token',
      },
    },
    {
      name: 'gives linked account precedence over stale inline credentials when toggle is absent',
      destination: buildDestination(
        {
          rudderAccountId: 'account-1',
          authenticationType: 'bearerToken',
          bearerToken: 'stale-inline-token',
        },
        {
          accountDefinitionName: ACCOUNT_DEFINITION_NAMES.BEARER_TOKEN,
          options: {},
          secret: { bearerToken: 'account-token' },
        },
      ),
      expectedHeaders: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer account-token',
      },
    },
    {
      name: 'suppresses all auth when toggle is false',
      destination: buildDestination(
        {
          authenticationEnabled: false,
          rudderAccountId: 'account-1',
          authenticationType: 'bearerToken',
          bearerToken: 'stale-inline-token',
        },
        {
          accountDefinitionName: ACCOUNT_DEFINITION_NAMES.BEARER_TOKEN,
          options: {},
          secret: { bearerToken: 'account-token' },
        },
      ),
      expectedHeaders: { 'Content-Type': 'application/json' },
    },
    {
      name: 'suppresses OAuth auth when toggle is false',
      destination: buildDestination(
        {
          authenticationEnabled: false,
          rudderAccountId: 'account-1',
          authenticationType: 'bearerToken',
          bearerToken: 'stale-inline-token',
        },
        {
          accountDefinitionName: ACCOUNT_DEFINITION_NAMES.OAUTH_AUTH_CODE,
          options: {},
          secret: { accessToken: 'stale-account-token' },
        },
      ),
      metadata: { secret: { accessToken: 'metadata-oauth-token' } },
      expectedHeaders: { 'Content-Type': 'application/json' },
    },
    {
      name: 'ignores stale inline credentials when no account is linked',
      destination: buildDestination({
        authenticationType: 'bearerToken',
        bearerToken: 'stale-inline-token',
      }),
      expectedHeaders: { 'Content-Type': 'application/json' },
    },
  ];

  const failureCases: {
    name: string;
    destination: CustomAudienceDestination;
    errorMessage: string;
  }[] = [
    {
      name: 'toggle true without a linked account ID',
      destination: buildDestination({ authenticationEnabled: true, rudderAccountId: undefined }),
      errorMessage: 'rudderAccountId does not identify a linked delivery account',
    },
    {
      name: 'linked account payload is missing',
      destination: buildDestination({ authenticationEnabled: true, rudderAccountId: 'account-1' }),
      errorMessage: 'deliveryAccount is missing or malformed',
    },
    {
      name: 'account definition name is null',
      destination: buildDestination(
        { authenticationEnabled: true, rudderAccountId: 'account-1' },
        { accountDefinitionName: null, options: {}, secret: {} },
      ),
      errorMessage: 'missing accountDefinitionName',
    },
    {
      name: 'account definition name is unknown',
      destination: buildDestination(
        { authenticationEnabled: true, rudderAccountId: 'account-1' },
        { accountDefinitionName: 'DESTINATION_UNKNOWN', options: {}, secret: {} },
      ),
      errorMessage: 'unknown accountDefinitionName: DESTINATION_UNKNOWN',
    },
    {
      name: 'Basic account username is missing',
      destination: buildDestination(
        { authenticationEnabled: true, rudderAccountId: 'account-1' },
        {
          accountDefinitionName: ACCOUNT_DEFINITION_NAMES.BASIC_AUTH,
          options: {},
          secret: { basicAuthPassword: 'pass' },
        },
      ),
      errorMessage: 'missing: options.basicAuthUserName',
    },
    {
      name: 'Bearer account secret is empty',
      destination: buildDestination(
        { authenticationEnabled: true, rudderAccountId: 'account-1' },
        {
          accountDefinitionName: ACCOUNT_DEFINITION_NAMES.BEARER_TOKEN,
          options: {},
          secret: {},
        },
      ),
      errorMessage: 'missing: secret.bearerToken',
    },
    {
      name: 'API key account option and secret are incomplete',
      destination: buildDestination(
        { authenticationEnabled: true, rudderAccountId: 'account-1' },
        {
          accountDefinitionName: ACCOUNT_DEFINITION_NAMES.API_KEY,
          options: {},
          secret: {},
        },
      ),
      errorMessage: 'missing: options.apiKeyName, secret.apiKeyValue',
    },
    {
      name: 'Client Credentials token URL is missing',
      destination: buildDestination(
        { authenticationEnabled: true, rudderAccountId: 'account-1' },
        {
          id: 'account-1',
          accountDefinitionName: ACCOUNT_DEFINITION_NAMES.CLIENT_CREDENTIALS,
          options: { clientId: 'client-id' },
          secret: { clientSecret: 'private-secret' },
        },
      ),
      errorMessage: 'options.tokenUrl',
    },
    {
      name: 'Client Credentials client secret is missing',
      destination: buildDestination(
        { authenticationEnabled: true, rudderAccountId: 'account-1' },
        {
          id: 'account-1',
          accountDefinitionName: ACCOUNT_DEFINITION_NAMES.CLIENT_CREDENTIALS,
          options: { tokenUrl: 'https://token.example.com', clientId: 'client-id' },
          secret: {},
        },
      ),
      errorMessage: 'secret.clientSecret',
    },
  ];

  const oauthAccountDefinitionNames = [ACCOUNT_DEFINITION_NAMES.OAUTH_AUTH_CODE];
  const oauthMetadataFailureCases: {
    name: string;
    metadata?: CustomAudienceAuthMetadata;
    accountDefinitionName: string;
  }[] = oauthAccountDefinitionNames.flatMap((accountDefinitionName) =>
    [
      { name: 'metadata is absent', metadata: undefined },
      { name: 'metadata secret is absent', metadata: {} },
      { name: 'metadata accessToken is absent', metadata: { secret: {} } },
      { name: 'metadata accessToken is empty', metadata: { secret: { accessToken: '' } } },
    ].map((testCase) => ({ ...testCase, accountDefinitionName })),
  );

  it.each(successCases)('$name', async ({ destination, metadata, expectedHeaders }) => {
    expect(await buildRequestHeaders(destination, metadata)).toEqual(expectedHeaders);
  });

  it('grants a Client Credentials token when metadata has no access token', async () => {
    const grant = jest
      .spyOn(clientCredentialsTokenProvider, 'getToken')
      .mockResolvedValue('granted-token');
    const destination = buildDestination(
      { authenticationEnabled: true, rudderAccountId: 'account-1' },
      {
        id: 'account-1',
        secretVersion: 3,
        accountDefinitionName: ACCOUNT_DEFINITION_NAMES.CLIENT_CREDENTIALS,
        options: { tokenUrl: 'https://token.example.com', clientId: 'client-id' },
        secret: { clientSecret: 'private-secret' },
      },
    );
    expect(await buildRequestHeaders(destination)).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer granted-token',
    });
    expect(grant).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'account-1', secretVersion: 3 }),
      'ws-1',
    );
  });

  it('uses a supplied Client Credentials preview token without a grant', async () => {
    const grant = jest.spyOn(clientCredentialsTokenProvider, 'getToken');
    const destination = buildDestination(
      { authenticationEnabled: true, rudderAccountId: 'account-1' },
      {
        accountDefinitionName: ACCOUNT_DEFINITION_NAMES.CLIENT_CREDENTIALS,
        options: {},
        secret: {},
      },
    );
    expect(await buildRequestHeaders(destination, { secret: { accessToken: '********' } })).toEqual(
      {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ********',
      },
    );
    expect(grant).not.toHaveBeenCalled();
  });

  it.each(failureCases)(
    'throws ConfigurationError when $name',
    async ({ destination, errorMessage }) => {
      await expect(buildRequestHeaders(destination)).rejects.toThrow(ConfigurationError);
      await expect(buildRequestHeaders(destination)).rejects.toThrow(errorMessage);
    },
  );

  it.each(oauthMetadataFailureCases)(
    'throws OAuthSecretError when $name for $accountDefinitionName',
    async ({ metadata, accountDefinitionName }) => {
      const destination = buildDestination(
        {
          authenticationEnabled: true,
          rudderAccountId: 'account-1',
          authenticationType: 'bearerToken',
          bearerToken: 'stale-inline-token',
        },
        {
          accountDefinitionName,
          options: {},
          secret: { accessToken: 'stale-account-token' },
        },
      );
      await expect(buildRequestHeaders(destination, metadata)).rejects.toThrow(OAuthSecretError);
      await expect(buildRequestHeaders(destination, metadata)).rejects.toThrow(
        'Secret or accessToken is not present in the metadata',
      );
    },
  );
});
