const { validateEventName, prepareUserProperties, removeInvalidParams } = require('./utils');

const userPropertyData = [
  {
    description: 'Should validate and prepare user_properties',
    input: {
      userId: 'user@1',
      group_id: 'group@1',
      anon_id: '78e95d6d-58c0-4237-b99e-2ef510b6d502',
      user_interest: 'Moderate',
      company_interest: '',
      profile: [
        {
          is_6qa: true,
          product: 'rudderstack',
          product_fit: 'Moderate',
          product_stage: 'Purchase',
          intent_score: 89,
          profile_score: 52,
          product_display$name: 'rudderstack',
        },
      ],
      user_company: 'Analytics consulting',
      user_account: '1',
      user_id_mappings: '330098|245252|461224|282599',
      company_naics_6sense: '5173',
      user_state: 'Ohio',
      usr_consent: null,
      firebase_user_id: 'kdgMnP',
      google_user_id: 'G-123456',
      company_domain: 'consulting.net',
      company_region: 'New Zealand',
      user_product_interests: {
        ids: [330098, 245252, 461224, 282599],
        list: [
          {
            id: 330098,
            name: [],
          },
          {
            id: 245252,
            name: {},
          },
          {
            id: 461224,
            name: 'NNNs - Non-Organic Prospects',
          },
          {
            id: 282599,
            name: 'DE Intent Keywords + Strong Mod FIT',
          },
        ],
        names: [
          'Consideration-to-Purchase Accts',
          'Tableau Interest',
          'NNNs - Non-Organic Prospects',
          'DE Intent Keywords + Strong Mod FIT',
        ],
      },
      company_country: {},
      company_industry: 'Business Analytics',
      company_revenue: '$5M - $10M',
      company_annual_revenue: '5568000',
      company_employee_count: '4300',
      company_employee_range: '1,000 - 4,999',
      company_sic_description: '',
      company_country_iso_code: 'NZ',
      company_naics_description: [],
    },
    output: {
      anon_id: { value: '78e95d6d-58c0-4237-b99e-2ef510b6d502' },
      company_annual_revenue: { value: '5568000' },
      company_country_iso_code: { value: 'NZ' },
      company_domain: { value: 'consulting.net' },
      company_employee_count: { value: '4300' },
      company_employee_range: { value: '1,000 - 4,999' },
      company_industry: { value: 'Business Analytics' },
      company_naics_6sense: { value: '5173' },
      company_region: { value: 'New Zealand' },
      company_revenue: { value: '$5M - $10M' },
      group_id: { value: 'group@1' },
      userId: { value: 'user@1' },
      user_account: { value: '1' },
      user_company: { value: 'Analytics consulting' },
      user_id_mappings: { value: '330098|245252|461224|282599' },
      user_interest: { value: 'Moderate' },
      user_state: { value: 'Ohio' },
    },
  },
];

describe('Google Analytics 4 utils test', () => {
  describe('validateEventName function tests', () => {
    it('Should throw an error as event name uses reserved prefixes', () => {
      try {
        const output = validateEventName('_ga_conversion');
        expect(output).toEqual('');
      } catch (error) {
        expect(error.message).toEqual('Reserved custom prefix names are not allowed');
      }
    });

    it('Should throw an error as reserved custom event names are not allowed', () => {
      try {
        const output = validateEventName('app_store_refund');
        expect(output).toEqual('');
      } catch (error) {
        expect(error.message).toEqual('Reserved custom event names are not allowed');
      }
    });

    it('Should throw an error as event name starts with numbers', () => {
      try {
        const output = validateEventName('123 sign_up');
        expect(output).toEqual('');
      } catch (error) {
        expect(error.message).toEqual(
          'Event name must start with a letter and can only contain letters, numbers, and underscores',
        );
      }
    });

    it('Should throw an error as event name should only contain letters, numbers, and underscores', () => {
      try {
        const output = validateEventName('Grisly*_Open_General_Setting');
        expect(output).toEqual('');
      } catch (error) {
        expect(error.message).toEqual(
          'Event name must start with a letter and can only contain letters, numbers, and underscores',
        );
      }
    });

    it('Should throw an error as event name should only contain letters, numbers, and underscores', () => {
      try {
        const output = validateEventName('Test[]_Rudder$$');
        expect(output).toEqual('');
      } catch (error) {
        expect(error.message).toEqual(
          'Event name must start with a letter and can only contain letters, numbers, and underscores',
        );
      }
    });

    it('Should not throw an error as event name is valid', () => {
      try {
        const output = validateEventName('Grisly1234567_Open_General_Setting');
        expect(output).toEqual();
      } catch (error) {
        console.log(error.message);
        expect(error.message).toEqual();
      }
    });

    it('Should not throw an error as event name is valid', () => {
      try {
        const output = validateEventName('login');
        expect(output).toEqual();
      } catch (error) {
        expect(error.message).toEqual();
      }
    });
  });

  describe('prepareUserProperties function tests', () => {
    // Empty message and context returns empty object
    it('should return empty object when message and context are empty', () => {
      // Arrange
      const message = {};
      const context = {};

      // Act
      const result = prepareUserProperties(message, []);

      // Assert
      expect(result).toEqual({});
    });

    // Filters out reserved and PII properties
    it('should filter out reserved and PII properties', () => {
      // Arrange
      const message = {
        context: {
          traits: {
            property3: 'value3',
            property4: 'value4',
            pii_property3: 'pii_value3',
            pii_property4: 'pii_value4',
          },
        },
        properties: {
          user_properties: {
            property1: 'value1',
            property2: 'value2',
            pii_property1: 'pii_value1',
            pii_property2: 'pii_value2',
          },
        },
      };

      const piiPropertiesToIgnore = [
        { piiProperty: 'pii_property1' },
        { piiProperty: 'pii_property2' },
        { piiProperty: 'pii_property3' },
        { piiProperty: 'pii_property4' },
      ];

      // Act
      const result = prepareUserProperties(message, piiPropertiesToIgnore);

      // Assert
      expect(result).toEqual({
        property1: { value: 'value1' },
        property2: { value: 'value2' },
        property3: { value: 'value3' },
        property4: { value: 'value4' },
      });
    });

    // Validates user properties and returns them in expected format
    it('should validate user properties and return them in expected format', () => {
      // Arrange
      const message = {
        context: {
          traits: {
            valid_property3: 'value3',
            _invalid_property3: '12_invalid_value3',
            valid_property4: 'value4',
            invalid_property4: [],
          },
        },
        properties: {
          user_properties: {
            valid_property1: 'value1',
            '12invalid_property1': 'ga_invalid_value1',
            valid_property2: 'value2',
            ga_invalid_property2: 'google_invalid_value2',
          },
        },
      };
      // Act
      const result = prepareUserProperties(message, []);

      // Assert
      expect(result).toEqual({
        valid_property1: { value: 'value1' },
        valid_property2: { value: 'value2' },
        valid_property3: { value: 'value3' },
        valid_property4: { value: 'value4' },
      });
    });

    // Invalid user properties are filtered out

    // User properties with invalid value types are filtered out
    it('should filter out user properties with invalid value types', () => {
      // Arrange
      const message = {
        context: {
          traits: {
            valid_property3: 'value3',
            invalid_property3: { 456: 'value3' },
            valid_property4: 'value4',
            invalid_property4: '01234567890123456789012345678901234567890123456789',
          },
        },
        properties: {
          user_properties: {
            valid_property1: 'value1',
            invalid_property1: [123, 456],
            valid_property2: 'value2',
          },
        },
      };

      // Act
      const result = prepareUserProperties(message, []);

      // Assert
      expect(result).toEqual({
        valid_property1: { value: 'value1' },
        valid_property2: { value: 'value2' },
        valid_property3: { value: 'value3' },
        valid_property4: { value: 'value4' },
      });
    });

    // PII properties are filtered out
    it('should filter out PII properties from user_properties', () => {
      // Arrange
      const message = {
        properties: {
          user_properties: {
            property1: 'value1',
            property2: 'value2',
            pii_property1: 'pii_value1',
            pii_property2: 'pii_value2',
          },
        },
      };
      const piiPropertiesToIgnore = [
        { piiProperty: 'pii_property1' },
        { piiProperty: 'pii_property2' },
      ];

      // Act
      const result = prepareUserProperties(message, piiPropertiesToIgnore);

      // Assert
      expect(result).toEqual({
        property1: { value: 'value1' },
        property2: { value: 'value2' },
      });
    });

    // PII properties are undefined
    it('should return undefined when user_properties is undefined', () => {
      // Arrange
      const message = {
        properties: {
          user_properties: {
            property1: 'value1',
            property2: 'value2',
            pii_property1: 'pii_value1',
            pii_property2: 'pii_value2',
          },
        },
      };
      const piiPropertiesToIgnore = undefined;

      // Act
      const result = prepareUserProperties(message, piiPropertiesToIgnore);

      // Assert
      expect(result).toEqual({
        pii_property1: { value: 'pii_value1' },
        pii_property2: { value: 'pii_value2' },
        property1: { value: 'value1' },
        property2: { value: 'value2' },
      });
    });

    // User properties with valid keys and values are returned in expected format
    it('should return user properties with valid keys and values in expected format', () => {
      // Arrange
      const message = {
        properties: {
          user_properties: {
            property1: 'value1',
            property2: 'value2',
          },
        },
      };

      // Act
      const result = prepareUserProperties(message, []);

      // Assert
      expect(result).toEqual({
        property1: { value: 'value1' },
        property2: { value: 'value2' },
      });
    });

    // User properties with valid keys but invalid values are filtered out
    it('should filter out user properties with invalid values', () => {
      // Arrange
      const message = {
        properties: {
          user_properties: {
            validKey1: 'validValue1',
            validKey2: 'validValue2',
            invalidKey1: '',
            invalidKey2:
              'invalidValueThatIsTooLongInvalidValueThatIsTooLongInvalidValueThatIsTooLongInvalidValueThatIsTooLong',
            validKey4: true,
          },
        },
      };
      const piiPropertiesToIgnore = [];

      // Act
      const result = prepareUserProperties(message, piiPropertiesToIgnore);

      // Assert
      expect(result).toEqual({
        validKey1: { value: 'validValue1' },
        validKey2: { value: 'validValue2' },
        validKey4: { value: true },
      });
    });
    // User properties with keys starting with reserved prefixes are filtered out
    it('should filter out user properties with keys starting with reserved prefixes', () => {
      // Arrange
      const message = {
        properties: {
          user_properties: {
            google_property: 'value1',
            ga_property: 'value2',
            firebase_property: 'value3',
            valid_property: 'value4',
          },
        },
      };
      const piiPropertiesToIgnore = [];

      // Act
      const result = prepareUserProperties(message, piiPropertiesToIgnore);

      // Assert
      expect(result).toEqual({
        valid_property: { value: 'value4' },
      });
    });

    userPropertyData.forEach((dataPoint) => {
      it(`${dataPoint.description}`, () => {
        try {
          const output = prepareUserProperties({ context: { traits: dataPoint.input } });
          expect(output).toEqual(dataPoint.output);
        } catch (error) {
          expect(error.message).toEqual(dataPoint.output.error);
        }
      });
    });
  });

  describe('removeInvalidValues function tests', () => {
    it('Should remove empty values except for "items"', () => {
      const params = {
        name: 'John',
        age: 30,
        email: '',
        city: null,
        items: [],
        address: {},
        phone: '123456789',
      };

      const expected = {
        name: 'John',
        items: [],
        age: 30,
        phone: '123456789',
      };

      const result = removeInvalidParams(params);
      expect(result).toEqual(expected);
    });
  });
});
