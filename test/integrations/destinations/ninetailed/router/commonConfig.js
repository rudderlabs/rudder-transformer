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
export const traits = {
    email: 'test@user.com',
    firstname: 'John',
    lastname: 'Doe',
    phone: '+1(123)456-7890',
    gender: 'Male',
    birthday: '1980-01-02',
    city: 'San Francisco',
  };
export const endpoint = 'https://experience.ninetailed.co/v2/organizations/dummyOrganisationId/environments/main/events';
export const properties= {
    title: 'Sample Page',
    url: 'https://example.com/?utm_campaign=example_campaign&utm_content=example_content',
    path: '/',
    hash: '',
    search: '?utm_campaign=example_campaign&utm_content=example_content',
    width: '1920',
    height: '1080',
    query: {
      utm_campaign: 'example_campaign',
      utm_content: 'example_content',
    },
    referrer: '',
  }; 