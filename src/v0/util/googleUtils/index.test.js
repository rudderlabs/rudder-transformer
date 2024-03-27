const { populateConsentFromConfig, finaliseConsent } = require('./index');

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
  const consentConfigMap = {
    personalizationConsent: 'adPersonalization',
    userDataConsent: 'adUserData',
  };
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

    const result = finaliseConsent(consentConfigMap, eventLevelConsent, destConfig);

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

    const result = finaliseConsent(consentConfigMap, eventLevelConsent, destConfig);

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
    const result = finaliseConsent(consentConfigMap, eventLevelConsent, undefined);

    // Assert
    expect(result).toEqual({
      adUserData: 'GRANTED',
      adPersonalization: 'DENIED',
    });
  });

  it('should return UNSPECIFIED_CONSENT when both destConfig and event level consent is not provided', () => {
    const result = finaliseConsent(consentConfigMap, undefined, undefined);

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

    const result = finaliseConsent(consentConfigMap, undefined, destConfig);

    expect(result).toEqual({
      adUserData: 'UNKNOWN',
      adPersonalization: 'UNKNOWN',
    });
  });

  it('should return UNKWOWN_CONSENT when destConfig is provided with wrong consent value', () => {
    const destConfig = {
      userDataConsent: 'UNKNOWN',
      personalizationConsent: 'WRONG CONSENT',
    };

    const result = finaliseConsent(consentConfigMap, undefined, destConfig);

    expect(result).toEqual({
      adPersonalization: 'UNKNOWN',
      adUserData: 'UNKNOWN',
    });
  });

  it('should return consent block with appropriate fields and values from destConfig', () => {
    const consentConfigMap = {
      personalizationConsent: 'newKey1',
      userDataConsent: 'newKey2',
    };
    const destConfig = {
      userDataConsent: 'GRANTED',
      personalizationConsent: 'GRANTED',
    };

    const result = finaliseConsent(consentConfigMap, undefined, destConfig);

    expect(result).toEqual({
      newKey1: 'GRANTED',
      newKey2: 'GRANTED',
    });
  });

  it('should return consent block with appropriate fields from consentConfigMap and values from eventLevel consent', () => {
    const consentConfigMap = {
      personalizationConsent: 'newKey1',
      userDataConsent: 'newKey2',
    };
    const destConfig = {
      userDataConsent: 'GRANTED',
      personalizationConsent: 'GRANTED',
    };

    const eventLevelConsent = {
      newKey1: 'UNKNOWN',
      newKey2: 'UNSPECIFIED',
    };

    const result = finaliseConsent(consentConfigMap, eventLevelConsent, destConfig);

    expect(result).toEqual({
      newKey1: 'UNKNOWN',
      newKey2: 'UNSPECIFIED',
    });
  });

  it('consentConfig and eventLevelConsent should have parity, also the values should be within allowed values otherwise UNKNOWN is returned ', () => {
    const consentConfigMap = {
      personalizationConsent: 'newKey1',
      userDataConsent: 'newKey2',
    };
    const destConfig = {
      userDataConsent: 'GRANTED',
      personalizationConsent: 'GRANTED',
    };

    const eventLevelConsent = {
      adUserData: 'UNKNOWN',
      adPersonalization: 'UNSPECIFIED',
    };

    const result = finaliseConsent(consentConfigMap, eventLevelConsent, destConfig);

    expect(result).toEqual({
      newKey1: 'GRANTED',
      newKey2: 'GRANTED',
    });
  });

  it('consentConfig and eventLevelConsent should have parity, otherwise it will take values from destConfig ', () => {
    const consentConfigMap = {
      personalizationConsent: 'newKey1',
      userDataConsent: 'newKey2',
    };
    const destConfig = {
      userDataConsent: 'GRANTED',
      personalizationConsent: 'GRANTED',
    };

    const eventLevelConsent = {
      newKey1: 'DENIED',
      newKey2: 'RANDOM',
    };

    const result = finaliseConsent(consentConfigMap, eventLevelConsent, destConfig);

    expect(result).toEqual({
      newKey1: 'DENIED',
      newKey2: 'UNKNOWN',
    });
  });
});
