import { context } from '../processor/commonConfig';

export const commonInput = {
  anonymousId: 'anon_123',
  messageId: 'dummy_msg_id',
  context,
  channel: 'web',
  integrations: {
    All: true,
  },
  originalTimestamp: '2021-01-25T15:32:56.409Z',
};

export const commonOutput = {
  anonymousId: 'anon_123',
  messageId: 'dummy_msg_id',
  context,
  channel: 'web',
  originalTimestamp: '2021-01-25T15:32:56.409Z',
};

export const destination = {
  ID: 'random_id',
  Name: 'ninetailed',
  DestinationDefinition: {
    Config: {
      cdkV2Enabled: true,
    },
  },
  Config: {
    organisationId: 'dummyOrganisationId',
    environment: 'main',
  },
};

export const endpoint =
  'https://experience.ninetailed.co/v2/organizations/dummyOrganisationId/environments/main/events';

