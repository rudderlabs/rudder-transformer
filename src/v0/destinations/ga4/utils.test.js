const { validateEventName, prepareUserProperties } = require('./utils');

const userPropertyData = [
  {
    description: "Should validate and prepare user_properties",
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
  describe('Unite test cases for validateEventName', () => {
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
          'Event name should only contain letters, numbers, and underscores and event name must start with a letter',
        );
      }
    });

    it('Should throw an error as event name should only contain letters, numbers, and underscores', () => {
      try {
        const output = validateEventName('Grisly*_Open_General_Setting');
        expect(output).toEqual('');
      } catch (error) {
        expect(error.message).toEqual(
          'Event name should only contain letters, numbers, and underscores and event name must start with a letter',
        );
      }
    });

    it('Should throw an error as event name should only contain letters, numbers, and underscores', () => {
      try {
        const output = validateEventName('Test[]_Rudder$$');
        expect(output).toEqual('');
      } catch (error) {
        expect(error.message).toEqual(
          'Event name should only contain letters, numbers, and underscores and event name must start with a letter',
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

  describe('Unit tests for prepareUserProperties', () => {
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
});
