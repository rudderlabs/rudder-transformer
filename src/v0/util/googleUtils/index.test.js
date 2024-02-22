const { populateConsentForGoogleDestinations } = require('./index');

describe('populateConsentForGoogleDestinations', () => {

  // Returns an object with ad_user_data and ad_personalization properties set to UNSPECIFIED when no consents are provided
  it('GOOGLE_ADWORDS_OFFLINE_CONVERSIONS : should return an object with ad_user_data and ad_personalization properties set to UNSPECIFIED when no consents are provided', () => {
    const message = {};
    const destName = 'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS';

    const result = populateConsentForGoogleDestinations(message, destName);

    expect(result).toEqual({
      ad_user_data: 'UNSPECIFIED',
      ad_personalization: 'UNSPECIFIED',
    });
  });

  // Returns an empty object when the destination name is not recognized
  it('GOOGLE_ADWORDS_OFFLINE_CONVERSIONS: should return an empty object when the destination name is not recognized', () => {
    const message = {};
    const destName = 'unknown_destination';

    const result = populateConsentForGoogleDestinations(message, destName);

    expect(result).toEqual({});
  });

  // Returns an object with ad_user_data and ad_personalization properties set to the provided consents when they are valid and present in the message properties
  it('GOOGLE_ADWORDS_OFFLINE_CONVERSIONS: should return an object with ad_user_data and ad_personalization properties set to the provided consents when they are valid and present in the message properties', () => {
    const message = {
      integrations: {
        google_adwords_offline_conversions: {
          consents: {
            ad_user_data: 'GRANTED',
            ad_personalization: 'DENIED'
          }
        }
      }
    };
    const destName = 'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS';

    const result = populateConsentForGoogleDestinations(message, destName);

    expect(result).toEqual({
      ad_user_data: 'GRANTED',
      ad_personalization: 'DENIED',
    });
  });

  // Returns an object with ad_user_data and ad_personalization properties set to UNSPECIFIED when the provided consents are not valid or not present in the message properties
  it('GOOGLE_ADWORDS_OFFLINE_CONVERSIONS : should return an object with ad_user_data and ad_personalization properties set to UNSPECIFIED when the provided consents are not valid or not present in the message properties', () => {
    const message = {
      integrations: {
        google_adwords_offline_conversions: {
          consents: {
            ad_user_data: 'GRANTED',
            ad_personalization: 'INVALID'
          }
        }
      }
    };
    const destName = 'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS';

    const result = populateConsentForGoogleDestinations(message, destName);

    expect(result).toEqual({
      ad_user_data: 'GRANTED',
      ad_personalization: 'UNSPECIFIED',
    });
  });

  // Returns an empty object when the integration object is not present in the message
  it('GOOGLE_ADWORDS_OFFLINE_CONVERSIONS : should return an default object when the integration object is not present in the message', () => {
    const message = {};
    const destName = 'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS';

    const result = populateConsentForGoogleDestinations(message, destName);

    expect(result).toEqual({
      ad_user_data: 'UNSPECIFIED',
      ad_personalization: 'UNSPECIFIED',
    });
  });

  // Returns an object with ad_user_data and ad_personalization properties set to UNSPECIFIED when no consents are provided
  it('GOOGLE_ADWORDS_REMARKETING_LISTS: should return an object with ad_user_data and ad_personalization properties set to UNSPECIFIED when no consents are provided', () => {
    const message = {};
    const destName = 'GOOGLE_ADWORDS_REMARKETING_LISTS';

    const result = populateConsentForGoogleDestinations(message, destName);

    expect(result).toEqual({
      adUserData: 'UNSPECIFIED',
      adPersonalization: 'UNSPECIFIED',
    });
  });

  // Returns an object with ad_user_data and ad_personalization properties set to the provided consents when they are valid and present in the message properties
  it('GOOGLE_ADWORDS_REMARKETING_LISTS : should return an object with ad_user_data and ad_personalization properties set to the provided consents when they are valid and present in the message properties', () => {
    const message = {
      integrations: {
        google_adwords_remarketing_lists: {
          consents: {
            adUserData: 'GRANTED',
            adPersonalization: 'DENIED'
          }
        }
      }
    };
    const destName = 'GOOGLE_ADWORDS_REMARKETING_LISTS';

    const result = populateConsentForGoogleDestinations(message, destName);

    expect(result).toEqual({
      adUserData: 'GRANTED',
      adPersonalization: 'DENIED',
    });
  });

  // Returns an object with ad_user_data and ad_personalization properties set to UNSPECIFIED when the provided consents are not valid or not present in the message properties
  it('GOOGLE_ADWORDS_REMARKETING_LISTS : should return an object with ad_user_data and ad_personalization properties set to UNSPECIFIED when the provided consents are not valid or not present in the message properties', () => {
    const message = {
      integrations: {
        google_adwords_remarketing_lists: {
          consents: {
            adUserData: 'GRANTED',
            adPersonalization: 'INVALID'
          }
        }
      }
    };
    const destName = 'GOOGLE_ADWORDS_REMARKETING_LISTS';

    const result = populateConsentForGoogleDestinations(message, destName);

    expect(result).toEqual({
      adUserData: 'GRANTED',
      adPersonalization: 'UNSPECIFIED',
    });
  });

  // Returns an empty object when the integration object is not present in the message
  it('GOOGLE_ADWORDS_REMARKETING_LISTS : should return an default object when the integration object is not present in the message', () => {
    const message = {};
    const destName = 'GOOGLE_ADWORDS_REMARKETING_LISTS';

    const result = populateConsentForGoogleDestinations(message, destName);

    expect(result).toEqual({
      adUserData: 'UNSPECIFIED',
      adPersonalization: 'UNSPECIFIED',
    });
  });
});
