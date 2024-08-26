const { populateIdentifiers, responseBuilder } = require('./util');
const { API_VERSION } = require('./config');
const accessToken = 'abcd1234';
const developerToken = 'ijkl9101';
const body = {
  operations: [
    {
      create: {
        userIdentifiers: [
          {
            hashedEmail: 'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
          },
          {
            hashedPhoneNumber: '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
          },
          {
            addressInfo: {
              hashedFirstName: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
              hashedLastName: 'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
              countryCode: 'US',
              postalCode: '1245',
            },
          },
        ],
      },
    },
  ],
};
const baseDestination = {
  Config: {
    rudderAccountId: '258Yea7usSKNpbkIaesL9oJ9iYw',
    listId: '7090784486',
    customerId: '7693729833',
    loginCustomerId: '',
    subAccount: false,
    userSchema: ['email', 'phone', 'addressInfo'],
    isHashRequired: true,
    typeOfList: 'General',
  },
};
const consentBlock = {
  adPersonalization: 'UNSPECIFIED',
  adUserData: 'UNSPECIFIED',
};
const message = {
  action: 'insert',
  context: {
    ip: '14.5.67.21',
    library: {
      name: 'http',
    },
  },
  recordId: '2',
  rudderId: '2',
  fields: {
    email: 'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
    phone: '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
    firstName: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    lastName: 'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
    country: 'US',
    postalCode: '1245',
  },
  type: 'record',
};
const expectedResponse = {
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/7693729833/offlineUserDataJobs`,
  headers: {
    Authorization: 'Bearer abcd1234',
    'Content-Type': 'application/json',
    'developer-token': 'ijkl9101',
  },
  params: {
    listId: '7090784486',
    customerId: '7693729833',
    consent: {
      adPersonalization: 'UNSPECIFIED',
      adUserData: 'UNSPECIFIED',
    },
  },
  body: {
    JSON: {
      operations: [
        {
          create: {
            userIdentifiers: [
              {
                hashedEmail: 'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
              },
              {
                hashedPhoneNumber:
                  '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
              },
              {
                addressInfo: {
                  hashedFirstName:
                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                  hashedLastName:
                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                  countryCode: 'US',
                  postalCode: '1245',
                },
              },
            ],
          },
        },
      ],
    },
    JSON_ARRAY: {},
    XML: {},
    FORM: {},
  },
  files: {},
};
const attributeArray = [
  {
    email: 'test@abc.com',
    phone: '@09876543210',
    firstName: 'test',
    lastName: 'rudderlabs',
    country: 'US',
    postalCode: '1245',
  },
];

const hashedArray = [
  {
    hashedEmail: 'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
  },
  {
    hashedPhoneNumber: '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
  },
  {
    addressInfo: {
      hashedFirstName: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      hashedLastName: 'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
      countryCode: 'US',
      postalCode: '1245',
    },
  },
];

describe('GARL utils test', () => {
  describe('responseBuilder function tests', () => {
    it('Should return correct response for given payload', () => {
      const response = responseBuilder(
        accessToken,
        developerToken,
        body,
        baseDestination,
        message,
        consentBlock,
      );
      expect(response).toEqual(expectedResponse);
    });

    it('Should throw error if subaccount is true and loginCustomerId is not defined', () => {
      try {
        const destination2 = Object.create(baseDestination);
        destination2.Config.subAccount = true;
        destination2.Config.loginCustomerId = '';
        const response = responseBuilder(
          accessToken,
          developerToken,
          body,
          destination2,
          message,
          consentBlock,
        );
        expect(response).toEqual();
      } catch (error) {
        expect(error.message).toEqual(`loginCustomerId is required as subAccount is true.`);
      }
    });

    it('Should throw error if operationAudienceId is not defined', () => {
      try {
        const destination1 = Object.create(baseDestination);
        destination1.Config.listId = '';
        const response = responseBuilder(
          accessToken,
          developerToken,
          body,
          destination1,
          message,
          consentBlock,
        );
        expect(response).toEqual();
      } catch (error) {
        expect(error.message).toEqual(`List ID is a mandatory field`);
      }
    });
  });

  describe('populateIdentifiers function tests', () => {
    it('Should hash and return identifiers for a given list of attributes', () => {
      const identifier = populateIdentifiers(attributeArray, baseDestination);
      expect(identifier).toEqual(hashedArray);
    });
  });
});
