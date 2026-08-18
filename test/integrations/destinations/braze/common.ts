/**
 * Shared fixtures for the Braze recommended-ecommerce-events component tests.
 * Used by processor/data.ts (and router/data.ts if needed) for the new
 * `useEcommerceRecommendedEvents` flow. The pre-existing fixtures in those files
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
    useEcommerceRecommendedEvents: true,
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

/**
 * Shared fixtures for the v1 proxy (dataDelivery) scenarios that exercise the
 * networkHandler's per-item correlation on /users/track. The response bodies
 * live here so the network mock and the expected `error` strings in
 * dataDelivery/business.ts are built from the same object — key order matters,
 * since an uncorrelated job echoes `JSON.stringify(response)` verbatim.
 */

// Verbatim Braze error types. Only a schema rejection (prefixed with the failing
// item's JSON pointer) of a recommended-ecommerce event in `events[]` yields a
// 296; every other correlated failure aborts its job.
export const BRAZE_ECOMMERCE_SCHEMA_ERROR =
  "The property '#/' did not contain a required property of 'product_id'";
export const BRAZE_PURCHASE_ERROR = "'quantity' is not valid";
export const BRAZE_IDENTIFIER_ERROR =
  "'external_id', 'braze_id', 'user_alias', 'email' or 'phone' is required";

// A schema rejection of an ecommerce event alongside an unrelated purchase failure.
export const ecommerceMixedResponse = {
  message: 'success',
  events_processed: 1,
  errors: [
    { type: BRAZE_ECOMMERCE_SCHEMA_ERROR, input_array: 'events', index: 0 },
    { type: BRAZE_PURCHASE_ERROR, input_array: 'purchases', index: 0 },
  ],
};

// The same schema rejection, but the item at events[0] is a legacy custom event.
export const legacyEventSchemaResponse = {
  message: 'success',
  events_processed: 0,
  errors: [{ type: BRAZE_ECOMMERCE_SCHEMA_ERROR, input_array: 'events', index: 0 }],
};

// A non-schema failure on a recommended-ecommerce event.
export const ecommerceNonSchemaResponse = {
  message: 'success',
  events_processed: 0,
  errors: [{ type: BRAZE_IDENTIFIER_ERROR, input_array: 'events', index: 0 }],
};
