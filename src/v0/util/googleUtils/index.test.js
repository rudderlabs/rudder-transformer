const {
  finaliseConsent,
  populateConsentFromConfig,
  finaliseAnalyticsConsents,
} = require('./index');

describe('unit test for populateConsentFromConfig', () => {
  const consentConfigMap = {
    personalizationConsent: 'adPersonalization',
    userDataConsent: 'adUserData',
  };
  it('should return an UNSPECIFIED object when no properties are provided', () => {
    const result = populateConsentFromConfig({}, consentConfigMap);
    expect(result).toEqual({
      adPersonalization: 'UNSPECIFIED',
      adUserData: 'UNSPECIFIED',
    });
  });

  it('should set adUserData property of consent object when userDataConsent property is provided and its value is one of the allowed consent statuses', () => {
    const properties = { userDataConsent: 'GRANTED' };
    const result = populateConsentFromConfig(properties, consentConfigMap);
    expect(result).toEqual({ adUserData: 'GRANTED', adPersonalization: 'UNSPECIFIED' });
  });

  it('should set adPersonalization property of consent object when personalizationConsent property is provided and its value is one of the allowed consent statuses', () => {
    const properties = { personalizationConsent: 'DENIED' };
    const result = populateConsentFromConfig(properties, consentConfigMap);
    expect(result).toEqual({ adPersonalization: 'DENIED', adUserData: 'UNSPECIFIED' });
  });

  it('should return an UNSPECIFIED object when properties parameter is not provided', () => {
    const result = populateConsentFromConfig(undefined, consentConfigMap);
    expect(result).toEqual({
      adPersonalization: 'UNSPECIFIED',
      adUserData: 'UNSPECIFIED',
    });
  });

  it('should return an UNSPECIFIED object when properties parameter is null', () => {
    const result = populateConsentFromConfig(null, consentConfigMap);
    expect(result).toEqual({
      adPersonalization: 'UNSPECIFIED',
      adUserData: 'UNSPECIFIED',
    });
  });

  it('should return an UNSPECIFIED object when properties parameter is an UNSPECIFIED object', () => {
    const result = populateConsentFromConfig({}, consentConfigMap);
    expect(result).toEqual({
      adPersonalization: 'UNSPECIFIED',
      adUserData: 'UNSPECIFIED',
    });
  });

  it('should return UNKNOWN when properties parameter contains adUserData and adPersonalization with non-allowed values', () => {
    const result = populateConsentFromConfig(
      {
        userDataConsent: 'RANDOM',
        personalizationConsent: 'RANDOM',
      },
      consentConfigMap,
    );
    expect(result).toEqual({
      adPersonalization: 'UNKNOWN',
      adUserData: 'UNKNOWN',
    });
  });
});

describe('finaliseConsent', () => {
  // Returns an object containing consent information.
  it('should return an object containing consent information when eventLevelConsent, destConfig, and destinationAllowedConsentKeys are provided', () => {
    const eventLevelConsent = {
      adUserData: 'GRANTED',
      adPersonalization: 'DENIED',
    };
    const destConfig = {
      userDataConsent: 'UNKNOWN',
      personalizationConsent: 'GRANTED',
    };

    const result = finaliseConsent(eventLevelConsent, destConfig);

    expect(result).toEqual({
      adUserData: 'GRANTED',
      adPersonalization: 'DENIED',
    });
  });

  it('should return an object containing consent information from destConfig when evenLevelConsent is empty object', () => {
    const eventLevelConsent = {}; // for store conversion we will use this
    const destConfig = {
      userDataConsent: 'UNKNOWN',
      personalizationConsent: 'GRANTED',
    };

    const result = finaliseConsent(eventLevelConsent, destConfig);

    expect(result).toEqual({
      adUserData: 'UNKNOWN',
      adPersonalization: 'GRANTED',
    });
  });

  // If destConfig is not provided, it does not return UNSPECIFIED_CONSENT.
  it('should not return UNSPECIFIED_CONSENT when destConfig is not provided but event level consent is provided', () => {
    const eventLevelConsent = {
      adUserData: 'GRANTED',
      adPersonalization: 'DENIED',
    };
    const result = finaliseConsent(eventLevelConsent, undefined);

    // Assert
    expect(result).toEqual({
      adUserData: 'GRANTED',
      adPersonalization: 'DENIED',
    });
  });

  it('should return UNSPECIFIED_CONSENT when both destConfig and event level consent is not provided', () => {
    const result = finaliseConsent(undefined, undefined);

    // Assert
    expect(result).toEqual({
      adUserData: 'UNSPECIFIED',
      adPersonalization: 'UNSPECIFIED',
    });
  });

  it('should return UNKWOWN_CONSENT when destConfig is provided with wrong consent value', () => {
    const destConfig = {
      userDataConsent: 'UNKNOWN',
      personalizationConsent: 'WRONG CONSENT',
    };

    const result = finaliseConsent(undefined, destConfig);

    expect(result).toEqual({
      adUserData: 'UNKNOWN',
      adPersonalization: 'UNKNOWN',
    });
  });
});

describe('unit test for finaliseAnalyticsConsents', () => {
  const consentConfigMap = {
    personalizationConsent: 'ad_personalization',
    userDataConsent: 'ad_user_data',
  };
  it('Should return an empty object when no valid consents are provided', () => {
    const result = finaliseAnalyticsConsents(consentConfigMap, {});
    expect(result).toEqual({});
  });

  it('Should set ad_user_data property of consent object when userDataConsent property is provided and its value is one of the allowed consent statuses', () => {
    const properties = { ad_user_data: 'GRANTED' };
    const result = finaliseAnalyticsConsents(consentConfigMap, properties);
    expect(result).toEqual({ ad_user_data: 'GRANTED' });
  });

  it('Should set ad_personalization property of consent object when personalizationConsent property is provided and its value is one of the allowed consent statuses', () => {
    const properties = { ad_personalization: 'DENIED' };
    const result = finaliseAnalyticsConsents(consentConfigMap, properties);
    expect(result).toEqual({ ad_personalization: 'DENIED' });
  });

  it('Should return an empty object when properties parameter is not provided', () => {
    const result = finaliseAnalyticsConsents(consentConfigMap, undefined);
    expect(result).toEqual({});
  });

  it('Should return an empty object when properties parameter is null', () => {
    const result = finaliseAnalyticsConsents(consentConfigMap, null);
    expect(result).toEqual({});
  });

  it('Should return an empty object when properties parameter is an UNSPECIFIED object', () => {
    const result = finaliseAnalyticsConsents(consentConfigMap, {});
    expect(result).toEqual({});
  });

  it('should return empty object when properties parameter contains ad_user_data and ad_personalization with non-allowed values', () => {
    const result = finaliseAnalyticsConsents(consentConfigMap, {
      userDataConsent: 'RANDOM',
      personalizationConsent: 'RANDOM',
    });
    expect(result).toEqual({});
  });
});
