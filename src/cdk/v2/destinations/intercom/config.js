const BASE_ENDPOINT = 'https://api.intercom.io';
const BASE_EU_ENDPOINT = 'https://api.eu.intercom.io';
const BASE_AU_ENDPOINT = 'https://api.au.intercom.io';

const SEARCH_CONTACT_ENDPOINT = 'contacts/search';
const CREATE_OR_UPDATE_COMPANY_ENDPOINT = 'companies';

const ReservedUserAttributes = [
  'userId',
  'role',
  'email',
  'phone',
  'name',
  'avatar',
  'company',
  'ownerId',
  'lastName',
  'lastname',
  'firstName',
  'firstname',
  'createdAt',
  'timestamp',
  'originalTimestamp',
  'unsubscribedFromEmails',
];

const ReservedCompanyAttributes = [
  'tags',
  'size',
  'plan',
  'name',
  'email',
  'userId',
  'website',
  'industry',
  'segments',
  'userCount',
  'createdAt',
  'sessionCount',
  'monthlySpend',
  'remoteCreatedAt',
];

const MetadataTypes = { richLink: ['url', 'value'], monetaryAmount: ['amount', 'currency'] };

module.exports = {
  BASE_ENDPOINT,
  MetadataTypes,
  BASE_EU_ENDPOINT,
  BASE_AU_ENDPOINT,
  ReservedUserAttributes,
  SEARCH_CONTACT_ENDPOINT,
  ReservedCompanyAttributes,
  CREATE_OR_UPDATE_COMPANY_ENDPOINT,
};
