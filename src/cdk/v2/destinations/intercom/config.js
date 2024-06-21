const BASE_ENDPOINT = 'https://api.intercom.io';
const BASE_EU_ENDPOINT = 'https://api.eu.intercom.io';
const BASE_AU_ENDPOINT = 'https://api.au.intercom.io';

const SEARCH_CONTACT_ENDPOINT = 'contacts/search';
const CREATE_OR_UPDATE_COMPANY_ENDPOINT = 'companies';
const TAGS_ENDPOINT = 'tags';

const ReservedAttributes = {
  v1UserAttributes: [
    'userId',
    'email',
    'phone',
    'name',
    'createdAt',
    'firstName',
    'lastName',
    'firstname',
    'lastname',
    'company',
  ],
  v2UserAttributes: [
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
    'lastSeenAt',
    'originalTimestamp',
    'unsubscribedFromEmails',
  ],
  v1CompanyAttributes: [
    'remoteCreatedAt',
    'monthlySpend',
    'industry',
    'website',
    'size',
    'plan',
    'name',
    'userId',
  ],
  v2CompanyAttributes: [
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
  ],
};

const ReservedCompanyProperties = ['id', 'name', 'industry'];

const MetadataTypes = { richLink: ['url', 'value'], monetaryAmount: ['amount', 'currency'] };

module.exports = {
  BASE_ENDPOINT,
  MetadataTypes,
  BASE_EU_ENDPOINT,
  BASE_AU_ENDPOINT,
  ReservedAttributes,
  SEARCH_CONTACT_ENDPOINT,
  ReservedCompanyProperties,
  CREATE_OR_UPDATE_COMPANY_ENDPOINT,
  TAGS_ENDPOINT,
};
