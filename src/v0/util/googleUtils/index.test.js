const { populateConsentForGoogleDestinations } = require('./index');

describe('unit test for populateConsentForGoogleDestinations', () => {
  // Returns an empty object when no properties are provided.
  it('should return an empty object when no properties are provided', () => {
    const result = populateConsentForGoogleDestinations({});
    expect(result).toEqual({});
  });

  // Sets adUserData property of consent object when userDataConsent property is provided and its value is one of the allowed consent statuses.
  it('should set adUserData property of consent object when userDataConsent property is provided and its value is one of the allowed consent statuses', () => {
    const properties = { userDataConsent: 'GRANTED' };
    const result = populateConsentForGoogleDestinations(properties);
    expect(result).toEqual({ adUserData: 'GRANTED' });
  });

  // Sets adPersonalization property of consent object when personalizationConsent property is provided and its value is one of the allowed consent statuses.
  it('should set adPersonalization property of consent object when personalizationConsent property is provided and its value is one of the allowed consent statuses', () => {
    const properties = { personalizationConsent: 'DENIED' };
    const result = populateConsentForGoogleDestinations(properties);
    expect(result).toEqual({ adPersonalization: 'DENIED' });
  });

  // Returns an empty object when properties parameter is not provided.
  it('should return an empty object when properties parameter is not provided', () => {
    const result = populateConsentForGoogleDestinations();
    expect(result).toEqual({});
  });

  // Returns an empty object when properties parameter is null.
  it('should return an empty object when properties parameter is null', () => {
    const result = populateConsentForGoogleDestinations(null);
    expect(result).toEqual({});
  });

  // Returns an empty object when properties parameter is an empty object.
  it('should return an empty object when properties parameter is an empty object', () => {
    const result = populateConsentForGoogleDestinations({});
    expect(result).toEqual({});
  });

  // Returns an empty object when properties parameter is an empty object.
  it('should return an empty object when properties parameter contains adUserData and adPersonalization with non-allowed values', () => {
    const result = populateConsentForGoogleDestinations({
      adUserData: 'RANDOM',
      personalizationConsent: 'RANDOM',
    });
    expect(result).toEqual({});
  });
});
