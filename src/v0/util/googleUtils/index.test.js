const { populateConsentFromConfig, finaliseConsent } = require('./index');

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
    const destinationAllowedConsentKeys = ['adUserData', 'adPersonalization'];

    const result = finaliseConsent(eventLevelConsent, destConfig, destinationAllowedConsentKeys);

    expect(result).toEqual({
      adUserData: 'GRANTED',
      adPersonalization: 'DENIED',
    });
  });

  // If destConfig is not provided, it does not return UNSPECIFIED_CONSENT.
  it('should not return UNSPECIFIED_CONSENT when destConfig is not provided but event level consent is provided', () => {
    const eventLevelConsent = {
      adUserData: 'GRANTED',
      adPersonalization: 'DENIED',
    };
    const destinationAllowedConsentKeys = ['adUserData', 'adPersonalization'];

    const result = finaliseConsent(eventLevelConsent, undefined, destinationAllowedConsentKeys);

    // Assert
    expect(result).toEqual({
      adUserData: 'GRANTED',
      adPersonalization: 'DENIED',
    });
  });

  it('should return UNSPECIFIED_CONSENT when both destConfig and event level consent is not provided', () => {
    const destinationAllowedConsentKeys = ['adUserData', 'adPersonalization'];

    const result = finaliseConsent(undefined, undefined, destinationAllowedConsentKeys);

    // Assert
    expect(result).toEqual({
      adUserData: 'UNSPECIFIED',
      adPersonalization: 'UNSPECIFIED',
    });
  });

  it('should return UNKWOWN_CONSENT when destConfig is provided with wrong consent value', () => {
    const destinationAllowedConsentKeys = ['adUserData', 'adPersonalization'];

    const destConfig = {
      userDataConsent: 'UNKNOWN',
      personalizationConsent: 'WRONG CONSENT',
    };

    const result = finaliseConsent(undefined, destConfig, destinationAllowedConsentKeys);

    expect(result).toEqual({
      adUserData: 'UNKNOWN',
      adPersonalization: 'UNKNOWN',
    });
  });

  it('should return UNKWOWN_CONSENT when destConfig is provided with wrong consent value', () => {
    const destinationAllowedConsentKeys = ['newKey1', 'newKey2'];

    const destConfig = {
      userDataConsent: 'UNKNOWN',
      personalizationConsent: 'WRONG CONSENT',
    };

    const result = finaliseConsent(undefined, destConfig, destinationAllowedConsentKeys);

    expect(result).toEqual({
      newKey1: 'UNSPECIFIED',
      newKey2: 'UNSPECIFIED',
    });
  });
});
