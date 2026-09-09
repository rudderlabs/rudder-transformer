const {
  finaliseConsent,
  populateConsentFromConfig,
  finaliseAnalyticsConsents,
  getAuthErrCategory,
} = require('./index');
const {
  AUTH_STATUS_INACTIVE,
  REFRESH_TOKEN,
} = require('../../../adapters/networkhandler/authConstants');

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

describe('unit test for getAuthErrCategory', () => {
  // Google states the machine-readable cause in details[].errors[].errorCode.authenticationError.
  // error.message is a generic string Google reuses across unrelated 401s (a valid token against a
  // customer it cannot see produces the same "Request is missing required authentication
  // credential" text as a request with no Authorization header at all), so it is never the thing to
  // branch on. Bodies below mirror what Google Ads v23 actually returns.
  const buildGoogleAuthError = (authenticationError) => ({
    error: {
      code: 401,
      message:
        'Request is missing required authentication credential. Expected OAuth 2 access token, login cookie or other valid authentication credential.',
      status: 'UNAUTHENTICATED',
      ...(authenticationError && {
        details: [
          {
            '@type': 'type.googleapis.com/google.ads.googleads.v23.errors.GoogleAdsFailure',
            errors: [{ errorCode: { authenticationError }, message: 'some message' }],
            requestId: 'some-request-id',
          },
        ],
      }),
    },
  });

  it.each([
    // Refreshing cannot fix an identity that is not an Ads user at all, so this must abort rather
    // than drive the refresh loop. Regression guard for INT-7101.
    ['NOT_ADS_USER', AUTH_STATUS_INACTIVE],
    ['CUSTOMER_NOT_FOUND', AUTH_STATUS_INACTIVE],
    ['TWO_STEP_VERIFICATION_NOT_ENROLLED', AUTH_STATUS_INACTIVE],
    // A genuinely expired token is what the refresh path exists for - keep it refreshable.
    ['OAUTH_TOKEN_EXPIRED', REFRESH_TOKEN],
  ])('should map a 401 with authenticationError %s to %s', (authenticationError, expected) => {
    expect(
      getAuthErrCategory({ response: buildGoogleAuthError(authenticationError), status: 401 }),
    ).toEqual(expected);
  });

  it('should map a terminal 401 to AUTH_STATUS_INACTIVE when the response is an array', () => {
    // googleAds:searchStream answers with a top-level array; uploadClickConversions with an object.
    expect(
      getAuthErrCategory({ response: [buildGoogleAuthError('NOT_ADS_USER')], status: 401 }),
    ).toEqual(AUTH_STATUS_INACTIVE);
  });

  it('should map an expired or invalid token 401 to REFRESH_TOKEN', () => {
    // No details[] at all - this is the genuinely refreshable case.
    expect(getAuthErrCategory({ response: buildGoogleAuthError(null), status: 401 })).toEqual(
      REFRESH_TOKEN,
    );
  });

  it('should map a 403 to AUTH_STATUS_INACTIVE', () => {
    expect(getAuthErrCategory({ response: { error: { code: 403 } }, status: 403 })).toEqual(
      AUTH_STATUS_INACTIVE,
    );
  });

  it('should return an empty category for non-auth statuses', () => {
    expect(getAuthErrCategory({ response: { error: { code: 400 } }, status: 400 })).toEqual('');
  });
});
