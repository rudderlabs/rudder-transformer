import { authHeader1, secret1 } from './maskedSecrets';
export const destination = {
  ID: 'random_id',
  Name: 'clicksend',
  DestinationDefinition: {
    Config: {
      cdkV2Enabled: true,
    },
  },
  Config: {
    clicksendUsername: secret1,
    clicksendPassword: secret1,
    defaultCampaignScheduleUnit: 'day',
    defaultCampaignSchedule: '2',
    defaultSource: 'php',
    defaultSenderId: 'abc@gmail.com',
    defaultSenderPhoneNumber: '+919XXXXXXXX8',
  },
};

export const metadata = {
  destinationId: 'dummyDestId',
};
export const commonProperties = {
  name: 'new campaign',
  body: 'abcd',
  from: 'abc@gmail.com',
  from_email: 'dummy@gmail.com',
  custom_string: 'test string',
};
export const traitsWithIdentifiers = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+9182XXXX068',
  email: 'abc@gmail.com',
  address: { city: 'New York', country: 'USA', pinCode: '123456' },
};
export const traitsWithoutIdenfiers = {
  firstName: 'John',
  lastName: 'Doe',
  address: { city: 'New York', country: 'USA', pinCode: '123456' },
};
export const contextWithoutScheduleAndWithContactId = {
  externalId: [{ type: 'CLICKSEND_CONTACT_LIST_ID', id: '123345' }],
  traitsWithoutIdenfiers,
};
export const commonInput = {
  anonymousId: 'anon_123',
  messageId: 'dummy_msg_id',
  contextWithoutScheduleAndWithContactId,
  channel: 'web',
  integrations: {
    All: true,
  },
  originalTimestamp: '2021-01-25T15:32:56.409Z',
};

export const commonOutput = {
  anonymousId: 'anon_123',
  messageId: 'dummy_msg_id',
  contextWithoutScheduleAndWithContactId,
  channel: 'web',
  originalTimestamp: '2021-01-25T15:32:56.409Z',
};

export const SMS_SEND_ENDPOINT = 'https://rest.clicksend.com/v3/sms/send';
export const SMS_CAMPAIGN_ENDPOINT = 'https://rest.clicksend.com/v3/sms-campaigns/send';
export const COMMON_CONTACT_DOMAIN = 'https://rest.clicksend.com/v3/lists';
export const routerInstrumentationErrorStatTags = {
  destType: 'CLICKSEND',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'router',
  implementation: 'cdkV2',
  module: 'destination',
};
export const commonIdentifyOutput = {
  address_line_1: JSON.stringify({ city: 'New York', country: 'USA', pinCode: '123456' }),
  address_line_2: JSON.stringify({ city: 'New York', country: 'USA', pinCode: '123456' }),
  city: 'New York',
  email: 'abc@gmail.com',
  first_name: 'John',
  last_name: 'Doe',
  phone_number: '+9182XXXX068',
};
export const processInstrumentationErrorStatTags = {
  destType: 'CLICKSEND',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'processor',
  implementation: 'cdkV2',
  module: 'destination',
  destinationId: 'dummyDestId',
};

export const commonHeader = {
  Authorization: authHeader1,
  'Content-Type': 'application/json',
};
