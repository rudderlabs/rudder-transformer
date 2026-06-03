/**
 * Shared fixtures for the Braze recommended-ecommerce-events component tests.
 * Used by processor/data.ts (and router/data.ts if needed) for the new
 * `useRecommendedEcommerceEvents` flow. The pre-existing fixtures in those files
 * define their own destination + message blocks inline; this file is the
 * convention going forward (see writing-tests skill).
 */
import { authHeader1, secret1 } from './maskedSecrets';

const ANON_ID = 'e6ab2c5e-2cda-44a9-a962-e2f67df78bca';
const TIMESTAMP = '2026-05-28T11:00:00.000+05:30';

/** Destination with the new flag enabled. */
export const ecommerceDestination = {
  hasDynamicConfig: false,
  Config: {
    restApiKey: secret1,
    prefixProperties: true,
    useNativeSDK: false,
    dataCenter: 'us-01',
    useRecommendedEcommerceEvents: true,
  },
  DestinationDefinition: {
    DisplayName: 'Braze',
    ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
    Name: 'BRAZE',
  },
  Enabled: true,
  ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
  Name: 'Braze',
  WorkspaceID: 'workspace_test_001',
  Transformations: [],
};

/** Anonymous-only web track event with the given event name + properties. */
export const trackMessage = (event: string, properties: Record<string, unknown>) => ({
  anonymousId: ANON_ID,
  channel: 'web',
  context: {
    app: {
      build: '1.0.0',
      name: 'RudderLabs JavaScript SDK',
      namespace: 'com.rudderlabs.javascript',
      version: '1.0.5',
    },
    library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
    locale: 'en-GB',
    os: { name: '', version: '' },
    screen: { density: 2 },
    traits: { email: 'mickey@disney.com', firstname: 'Mickey' },
  },
  event,
  integrations: { All: true },
  messageId: 'msg-ecom-001',
  originalTimestamp: TIMESTAMP,
  receivedAt: TIMESTAMP,
  sentAt: TIMESTAMP,
  timestamp: TIMESTAMP,
  type: 'track',
  userId: '',
  properties,
});

const STANDARD_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: authHeader1,
};

const STANDARD_USER_ALIAS = {
  alias_name: ANON_ID,
  alias_label: 'rudder_id',
};

/** Build the expected `attributes[0]` block for an anonymous web track event. */
const expectedAttributesBlock = {
  email: 'mickey@disney.com',
  firstname: 'Mickey',
  _update_existing_only: false,
  user_alias: STANDARD_USER_ALIAS,
};

/** Build the expected processor-output entry for a recommended ecommerce event. */
export const expectedEcommerceOutput = (eventName: string, eventProperties: unknown) => ({
  statusCode: 200,
  output: {
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint: 'https://rest.iad-01.braze.com/users/track',
    endpointPath: 'users/track',
    headers: STANDARD_HEADERS,
    params: {},
    body: {
      JSON: {
        partner: 'RudderStack',
        attributes: [expectedAttributesBlock],
        events: [
          {
            name: eventName,
            time: TIMESTAMP,
            properties: eventProperties,
            _update_existing_only: false,
            user_alias: STANDARD_USER_ALIAS,
          },
        ],
      },
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    files: {},
    userId: ANON_ID,
  },
});

/** Wrap the destination + message into the processor input body[0] shape. */
export const buildProcessorInput = (message: Record<string, unknown>) => ({
  request: {
    body: [{ destination: ecommerceDestination, message }],
  },
});
