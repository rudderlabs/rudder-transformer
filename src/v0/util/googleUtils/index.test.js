const { populateConsentFromConfig, populateConsentForGAOC } = require('./index');

describe('unit test for populateConsentFromConfig', () => {
  it('should return an UNSPECIFIED object when no properties are provided', () => {
    const result = populateConsentFromConfig({});
    expect(result).toEqual({
      adPersonalization: 'UNSPECIFIED',
      adUserData: 'UNSPECIFIED',
    });
  });

  it('should set adUserData property of consent object when userDataConsent property is provided and its value is one of the allowed consent statuses', () => {
    const properties = { userDataConsent: 'GRANTED' };
    const result = populateConsentFromConfig(properties);
    expect(result).toEqual({ adUserData: 'GRANTED', adPersonalization: 'UNSPECIFIED' });
  });

  it('should set adPersonalization property of consent object when personalizationConsent property is provided and its value is one of the allowed consent statuses', () => {
    const properties = { personalizationConsent: 'DENIED' };
    const result = populateConsentFromConfig(properties);
    expect(result).toEqual({ adPersonalization: 'DENIED', adUserData: 'UNSPECIFIED' });
  });

  it('should return an UNSPECIFIED object when properties parameter is not provided', () => {
    const result = populateConsentFromConfig();
    expect(result).toEqual({
      adPersonalization: 'UNSPECIFIED',
      adUserData: 'UNSPECIFIED',
    });
  });

  it('should return an UNSPECIFIED object when properties parameter is null', () => {
    const result = populateConsentFromConfig(null);
    expect(result).toEqual({
      adPersonalization: 'UNSPECIFIED',
      adUserData: 'UNSPECIFIED',
    });
  });

  it('should return an UNSPECIFIED object when properties parameter is an UNSPECIFIED object', () => {
    const result = populateConsentFromConfig({});
    expect(result).toEqual({
      adPersonalization: 'UNSPECIFIED',
      adUserData: 'UNSPECIFIED',
    });
  });

  it('should return UNKNOWN when properties parameter contains adUserData and adPersonalization with non-allowed values', () => {
    const result = populateConsentFromConfig({
      userDataConsent: 'RANDOM',
      personalizationConsent: 'RANDOM',
    });
    expect(result).toEqual({
      adPersonalization: 'UNKNOWN',
      adUserData: 'UNKNOWN',
    });
  });
});

describe('populateConsentForGAOC', () => {
  // Returns an object with adUserData and adPersonalization properties set to UNSPECIFIED when no consents are provided
  it('store sales conversion without consent related field in destination config', () => {
    const message = {};
    const conversionType = 'store';

    const result = populateConsentForGAOC(message, conversionType);

    expect(result).toEqual({
      adUserData: 'UNSPECIFIED',
      adPersonalization: 'UNSPECIFIED',
    });
  });

  it('store sales conversions with integrations object but without consent fields in config', () => {
    const message = {
      integrations: {
        google_adwords_offline_conversions: {
          consents: {
            adUserData: 'GRANTED',
            adPersonalization: 'DENIED',
          },
        },
      },
    };
    const conversionType = 'store';

    const result = populateConsentForGAOC(message, conversionType);

    expect(result).toEqual({
      adPersonalization: 'UNSPECIFIED',
      adUserData: 'UNSPECIFIED',
    });
  });

  it('store sales conversions with integrations object along with consent fields in config', () => {
    const message = {
      integrations: {
        google_adwords_offline_conversions: {
          consents: {
            adUserData: 'GRANTED',
            adPersonalization: 'DENIED',
          },
        },
      },
    };
    const conversionType = 'store';

    const destConfig = {
      userDataConsent: 'GRANTED',
      personalizationConsent: 'DENIED',
    };

    const result = populateConsentForGAOC(message, conversionType, destConfig);

    expect(result).toEqual({
      adPersonalization: 'DENIED',
      adUserData: 'GRANTED',
    });
  });

  // Returns an object with adUserData and adPersonalization properties set to the provided consents when they are valid and present in the message properties
  it('click conversion with integration object of allowed types', () => {
    const message = {
      integrations: {
        google_adwords_offline_conversions: {
          consents: {
            adUserData: 'GRANTED',
            adPersonalization: 'DENIED',
          },
        },
      },
    };
    const conversionType = 'click';

    const result = populateConsentForGAOC(message, conversionType);

    expect(result).toEqual({
      adUserData: 'GRANTED',
      adPersonalization: 'DENIED',
    });
  });

  // Returns an object with adUserData and adPersonalization properties set to UNSPECIFIED when the provided consents are not valid or not present in the message properties
  it('click conversion with invalid consent value', () => {
    const message = {
      integrations: {
        google_adwords_offline_conversions: {
          consents: {
            adUserData: 'GRANTED',
            adPersonalization: 'INVALID',
          },
        },
      },
    };
    const conversionType = 'click';

    const result = populateConsentForGAOC(message, conversionType);

    expect(result).toEqual({
      adUserData: 'GRANTED',
      adPersonalization: 'UNSPECIFIED',
    });
  });

  // Returns an empty object when the integration object is not present in the message
  it('call conversion without integrations object consent ', () => {
    const message = {};
    const conversionType = 'call';

    const result = populateConsentForGAOC(message, conversionType);

    expect(result).toEqual({
      adUserData: 'UNSPECIFIED',
      adPersonalization: 'UNSPECIFIED',
    });
  });

  it('click conversion without integrations', () => {
    const message = {
      integrations: {
        google_adwords_offline_conversions: {},
      },
    };
    const conversionType = 'click';

    const destConfig = {
      userDataConsent: 'GRANTED',
      personalizationConsent: 'DENIED',
    };

    const result = populateConsentForGAOC(message, conversionType, destConfig);

    expect(result).toEqual({
      adUserData: 'GRANTED',
      adPersonalization: 'DENIED',
    });
  });

  it('click conversion without integrations and UI config has partial data', () => {
    const message = {
      integrations: {
        google_adwords_offline_conversions: {},
      },
    };
    const conversionType = 'click';

    const destConfig = {
      userDataConsent: 'GRANTED',
    };

    const result = populateConsentForGAOC(message, conversionType, destConfig);

    expect(result).toEqual({
      adUserData: 'GRANTED',
      adPersonalization: 'UNSPECIFIED',
    });
  });

  it('click conversion with partial data present in integrations object', () => {
    const message = {
      integrations: {
        google_adwords_offline_conversions: {
          consents: {
            adUserData: 'GRANTED',
          },
        },
      },
    };

    const destConfig = {
      userDataConsent: 'GRANTED',
      personalizationConsent: 'DENIED',
    };
    const conversionType = 'click';

    const result = populateConsentForGAOC(message, conversionType, destConfig);

    expect(result).toEqual({
      adUserData: 'GRANTED',
      adPersonalization: 'DENIED',
    });
  });
});
