/**
 * DM API router request fixtures — mirrors router/record.ts, one-to-one.
 * Uses dm-enabled-workspaceId + secret1 so the feature flag routes through the Data Manager API.
 */
import { Destination, Connection, RouterTransformationRequest } from '../../../../../../src/types';
import { VDM_V2_SCHEMA_VERSION } from '../../../../../../src/v0/util/constant';
import { generateGoogleOAuthMetadata } from '../../../../testUtils';
import { secret4 } from '../../maskedSecrets';

const DM_WORKSPACE_ID = 'dm-enabled-workspaceId';

const generateDMGoogleOAuthMetadata = (jobId: number) => ({
  ...generateGoogleOAuthMetadata(jobId),
  workspaceId: DM_WORKSPACE_ID,
  secret: { access_token: secret4 },
});

export const dmDestination: Destination = {
  Config: {
    rudderAccountId: '258Yea7usSKNpbkIaesL9oJ9iYw',
    audienceId: '7090784486',
    customerId: '7693729833',
    loginCustomerId: '',
    subAccount: false,
    userSchema: ['email', 'phone', 'addressInfo'],
    isHashRequired: true,
    typeOfList: 'General',
  },
  ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
  Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
  Enabled: true,
  WorkspaceID: '1TSN08muJTZwH8iCDmnnRt1pmLd',
  DestinationDefinition: {
    ID: '1aIXqM806xAVm92nx07YwKbRrO9',
    Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
    DisplayName: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
    Config: {},
  },
  Transformations: [],
  IsConnectionEnabled: true,
  IsProcessorEnabled: true,
};

// Destination used for VDMv2 (no explicit schema/typeOfList — comes from connection config)
const dmDestinationNoSchema: Destination = {
  Config: {
    rudderAccountId: '258Yea7usSKNpbkIaesL9oJ9iYw',
    audienceId: '7090784486',
    customerId: '7693729833',
    loginCustomerId: '',
    subAccount: false,
  },
  ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
  Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
  Enabled: true,
  WorkspaceID: '1TSN08muJTZwH8iCDmnnRt1pmLd',
  DestinationDefinition: {
    ID: '1aIXqM806xAVm92nx07YwKbRrO9',
    Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
    DisplayName: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
    Config: {},
  },
  Transformations: [],
  IsConnectionEnabled: true,
  IsProcessorEnabled: true,
};

// Destination with hashing off — for eventStreamRecordHashOffRequest mirror
const dmDestinationHashOff: Destination = {
  ...dmDestination,
  Config: {
    ...dmDestination.Config,
    isHashRequired: false,
  },
};

const dmConnectionGeneral: Connection = {
  sourceId: '2MUWghI7u85n91dd1qzGyswpZan',
  destinationId: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
  enabled: true,
  config: {
    destination: {
      schemaVersion: VDM_V2_SCHEMA_VERSION,
      isHashRequired: true,
      typeOfList: 'General',
      audienceId: '7090784486',
    },
  },
};

const dmConnectionUserId: Connection = {
  sourceId: '2MUWghI7u85n91dd1qzGyswpZan',
  destinationId: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
  enabled: true,
  config: {
    destination: {
      schemaVersion: VDM_V2_SCHEMA_VERSION,
      isHashRequired: true,
      typeOfList: 'userID',
      audienceId: '7090784486',
      personalizationConsent: 'GRANTED',
      userDataConsent: 'GRANTED',
    },
  },
};

const fullFields = {
  email: 'test@abc.com',
  phone: '@09876543210',
  firstName: 'test',
  lastName: 'rudderlabs',
  country: 'US',
  postalCode: '1245',
};

// ── 1. Mirrors eventStreamRecordRouterRequest ─────────────────────────────────
export const dmEventStreamRecordRouterRequest: RouterTransformationRequest = {
  input: [
    {
      destination: dmDestination,
      message: {
        action: 'insert',
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        recordId: '2',
        rudderId: '2',
        fields: { ...fullFields },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(2),
    },
  ],
  destType: 'google_adwords_remarketing_lists',
};

// ── 2. Mirrors rETLRecordRouterRequestVDMv1 ───────────────────────────────────
export const dmRETLRecordRouterRequestVDMv1: RouterTransformationRequest = {
  input: [
    {
      destination: dmDestination,
      message: {
        action: 'insert',
        context: {
          ip: '14.5.67.21',
          library: { name: 'http' },
          vdm: { version: 'v1' },
          mappedToDestination: true,
        },
        recordId: '2',
        rudderId: '2',
        fields: { ...fullFields },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(3),
    },
  ],
  destType: 'google_adwords_remarketing_lists',
};

// ── 3. Mirrors rETLRecordRouterRequest (insert/update/delete/lol/insert) ──────
export const dmRETLRecordRouterRequest: RouterTransformationRequest = {
  input: [
    {
      destination: dmDestination,
      message: {
        action: 'insert',
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        recordId: '2',
        rudderId: '2',
        fields: { ...fullFields },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(2),
    },
    {
      destination: dmDestination,
      message: {
        action: 'update',
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        recordId: '2',
        rudderId: '2',
        fields: { ...fullFields },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(4),
    },
    {
      destination: dmDestination,
      message: {
        action: 'delete',
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        recordId: '2',
        rudderId: '2',
        fields: { ...fullFields },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(1),
    },
    {
      destination: dmDestination,
      message: {
        action: 'lol',
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        recordId: '2',
        rudderId: '2',
        fields: { ...fullFields },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(5),
    },
    {
      destination: dmDestination,
      message: {
        action: 'insert',
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        recordId: '2',
        rudderId: '2',
        fields: { ...fullFields },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(3),
    },
  ],
  destType: 'google_adwords_remarketing_lists',
};

// ── 4. Mirrors rETLRecordRouterRequestVDMv2General ────────────────────────────
export const dmRETLRecordRouterRequestVDMv2General: RouterTransformationRequest = {
  input: [
    {
      destination: dmDestinationNoSchema,
      connection: dmConnectionGeneral,
      message: {
        action: 'insert',
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        recordId: '2',
        rudderId: '2',
        identifiers: { ...fullFields },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(1),
    },
  ],
  destType: 'google_adwords_remarketing_lists',
};

// ── 5. Mirrors rETLRecordRouterRequestVDMv2UserId ─────────────────────────────
export const dmRETLRecordRouterRequestVDMv2UserId: RouterTransformationRequest = {
  input: [
    {
      destination: dmDestinationNoSchema,
      connection: dmConnectionUserId,
      message: {
        action: 'insert',
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        recordId: '2',
        rudderId: '2',
        identifiers: { ...fullFields, thirdPartyUserId: 'useri1234' },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(2),
    },
  ],
  destType: 'google_adwords_remarketing_lists',
};

// ── 6. Mirrors eventStreamRecordPreHashedRequest ──────────────────────────────
export const dmEventStreamRecordPreHashedRequest: RouterTransformationRequest = {
  input: [
    {
      destination: dmDestination,
      message: {
        action: 'insert',
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        recordId: '2',
        rudderId: '2',
        fields: {
          // pre-hashed values: sha256('test@abc.com') and sha256('+@09876543210')
          email: 'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
          phone: '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
          country: 'US',
          postalCode: '1245',
        },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(2),
    },
  ],
  destType: 'google_adwords_remarketing_lists',
};

// ── 7. Mirrors eventStreamRecordHashOffRequest ────────────────────────────────
export const dmEventStreamRecordHashOffRequest: RouterTransformationRequest = {
  input: [
    {
      destination: dmDestinationHashOff,
      message: {
        action: 'insert',
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        recordId: '2',
        rudderId: '2',
        fields: {
          email: 'test@abc.com',
          phone: '@09876543210',
          country: 'US',
          postalCode: '1245',
        },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(2),
    },
  ],
  destType: 'google_adwords_remarketing_lists',
};

// ── 8. Mirrors fieldStrippingRequest ──────────────────────────────────────────
export const dmFieldStrippingRequest: RouterTransformationRequest = {
  input: [
    {
      destination: dmDestination,
      message: {
        action: 'insert',
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        recordId: '10',
        rudderId: '10',
        fields: {
          email: 'invalid-email', // invalid — stripped when flag on
          phone: '09876543210', // valid
          firstName: 'test',
          lastName: 'rudderlabs',
          country: 'US',
          postalCode: '1245',
        },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(10),
    },
  ],
  destType: 'google_adwords_remarketing_lists',
};

// ── 9. Mirrors allFieldsInvalidRequest ────────────────────────────────────────
export const dmAllFieldsInvalidRequest: RouterTransformationRequest = {
  input: [
    {
      destination: dmDestination,
      message: {
        action: 'insert',
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        recordId: '11',
        rudderId: '11',
        fields: {
          email: 'invalid-email', // invalid
          phone: 'abc-def-123', // invalid
        },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(11),
    },
  ],
  destType: 'google_adwords_remarketing_lists',
};

// ── 10. Mirrors rETLRecordRouterRequestForVDMV2Flow ───────────────────────────
// Explicitly lists all 6 events to avoid the mutation side-effect of the original.
// Events: insert(2), update(4), delete(1), lol(5), insert(3) + empty-identifiers insert(6)
const dmVDMv2FlowConnection: Connection = {
  config: {
    destination: {
      schemaVersion: '1.1',
      ...dmDestination.Config,
    },
  },
  sourceId: 'randomSourceId',
  destinationId: 'randomDestinationId',
  enabled: true,
};

export const dmRETLRecordRouterRequestForVDMV2Flow: RouterTransformationRequest = {
  input: [
    {
      destination: dmDestination,
      connection: dmVDMv2FlowConnection,
      message: {
        action: 'insert',
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        recordId: '2',
        rudderId: '2',
        identifiers: { ...fullFields },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(2),
    },
    {
      destination: dmDestination,
      connection: dmVDMv2FlowConnection,
      message: {
        action: 'update',
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        recordId: '2',
        rudderId: '2',
        identifiers: { ...fullFields },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(4),
    },
    {
      destination: dmDestination,
      connection: dmVDMv2FlowConnection,
      message: {
        action: 'delete',
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        recordId: '2',
        rudderId: '2',
        identifiers: { ...fullFields },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(1),
    },
    {
      destination: dmDestination,
      connection: dmVDMv2FlowConnection,
      message: {
        action: 'lol',
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        recordId: '2',
        rudderId: '2',
        identifiers: { ...fullFields },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(5),
    },
    {
      destination: dmDestination,
      connection: dmVDMv2FlowConnection,
      message: {
        action: 'insert',
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        recordId: '2',
        rudderId: '2',
        identifiers: { ...fullFields },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(3),
    },
    {
      destination: dmDestination,
      connection: dmVDMv2FlowConnection,
      message: {
        action: 'insert',
        context: { ip: '14.5.67.21', library: { name: 'http' } },
        recordId: '2',
        rudderId: '2',
        identifiers: { email: '', phone: null },
        type: 'record',
      },
      metadata: generateDMGoogleOAuthMetadata(6),
    },
  ],
  destType: 'google_adwords_remarketing_lists',
};
