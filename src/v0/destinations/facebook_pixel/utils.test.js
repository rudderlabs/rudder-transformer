const { transformedPayloadData } = require('../../../../src/v0/destinations/facebook_pixel/utils');
const sha256 = require('sha256');

describe('transformedPayloadData_function', () => {
  // Tests with default values for all parameters
  it('test_default_values', () => {
    const message = {};
    const customData = {};
    const blacklistPiiProperties = undefined;
    const whitelistPiiProperties = undefined;
    const integrationsObj = undefined;

    const result = transformedPayloadData(
      message,
      customData,
      blacklistPiiProperties,
      whitelistPiiProperties,
      integrationsObj,
    );

    expect(result).toEqual({});
  });

  // Tests with customData parameter containing all default pii properties
  it('test_custom_data_default_pii', () => {
    const message = {};
    const customData = {
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
      firstname: 'firstname',
      lastname: 'lastname',
      first_name: 'first_name',
      last_name: 'last_name',
      gender: 'gender',
      city: 'city',
      country: 'country',
      phone: 'phone',
      state: 'state',
      zip: 'zip',
      postalCode: 'postalCode',
      birthday: 'birthday',
    };
    const blacklistPiiProperties = undefined;
    const whitelistPiiProperties = undefined;
    const integrationsObj = undefined;

    const result = transformedPayloadData(
      message,
      customData,
      blacklistPiiProperties,
      whitelistPiiProperties,
      integrationsObj,
    );

    expect(result).toEqual({});
  });

  // Tests with customData parameter containing only whitelisted properties
  it('test_custom_data_whitelisted_properties', () => {
    const message = {};
    const customData = {
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
      firstname: 'firstname',
      lastname: 'lastname',
      first_name: 'first_name',
      last_name: 'last_name',
      gender: 'gender',
      city: 'city',
      country: 'country',
      phone: 'phone',
      state: 'state',
      zip: 'zip',
      postalCode: 'postalCode',
      birthday: 'birthday',
      customProperty1: 'customProperty1',
      customProperty2: 'customProperty2',
    };
    const blacklistPiiProperties = undefined;
    const whitelistPiiProperties = [
      { whitelistPiiProperties: 'customProperty1' },
      { whitelistPiiProperties: 'customProperty2' },
    ];
    const integrationsObj = undefined;

    const result = transformedPayloadData(
      message,
      customData,
      blacklistPiiProperties,
      whitelistPiiProperties,
      integrationsObj,
    );

    expect(result).toEqual({
      customProperty1: 'customProperty1',
      customProperty2: 'customProperty2',
    });
  });

  // Tests with customData parameter containing some blacklisted properties
  it('test_custom_data_blacklisted_properties', () => {
    const message = {
      properties: {
        email: 'email',
        firstName: 'firstName',
      },
    };
    const customData = {
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
      firstname: 'firstname',
      lastname: 'lastname',
      first_name: 'first_name',
      last_name: 'last_name',
      gender: 'gender',
      city: 'city',
      country: 'country',
      phone: 'phone',
      state: 'state',
      zip: 'zip',
      postalCode: 'postalCode',
      birthday: 'birthday',
    };
    const blacklistPiiProperties = [
      { blacklistPiiProperties: 'email', blacklistPiiHash: true },
      { blacklistPiiProperties: 'firstName', blacklistPiiHash: true },
    ];
    const whitelistPiiProperties = undefined;
    const integrationsObj = undefined;

    const result = transformedPayloadData(
      message,
      customData,
      blacklistPiiProperties,
      whitelistPiiProperties,
      integrationsObj,
    );

    expect(result).toEqual({ firstName: sha256('firstName'), email: sha256('email') });
  });

  // Tests with customData parameter containing some hashed blacklisted properties
  it('test_custom_data_hashed_blacklisted_properties', () => {
    const message = {
      properties: {
        email: 'email',
        firstName: 'firstName',
        lastName: 'lastName',
      },
    };
    const customData = {
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
      firstname: 'firstname',
      lastname: 'lastname',
      first_name: 'first_name',
      last_name: 'last_name',
      gender: 'gender',
      city: 'city',
      country: 'country',
      phone: 'phone',
      state: 'state',
      zip: 'zip',
      postalCode: 'postalCode',
      birthday: 'birthday',
    };
    const blacklistPiiProperties = [
      { blacklistPiiProperties: 'email', blacklistPiiHash: true },
      { blacklistPiiProperties: 'firstName', blacklistPiiHash: false },
    ];
    const whitelistPiiProperties = undefined;
    const integrationsObj = { hashed: true };

    const result = transformedPayloadData(
      message,
      customData,
      blacklistPiiProperties,
      whitelistPiiProperties,
      integrationsObj,
    );

    expect(result).toEqual({ email: 'email' });
  });

  it('test_custom_data_non_pii_blacklisted_properties', () => {
    const message = {
      properties: {
        email: 'email',
        nonPiiProp1: 'firstName',
        nonPiiProp2: 'lastName',
      },
    };
    const customData = {
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
      firstname: 'firstname',
      lastname: 'lastname',
      first_name: 'first_name',
      last_name: 'last_name',
      gender: 'gender',
      city: 'city',
      country: 'country',
      phone: 'phone',
      state: 'state',
      zip: 'zip',
      postalCode: 'postalCode',
      birthday: 'birthday',
      nonPiiProp1: 'firstName',
      nonPiiProp2: 'lastName',
    };
    const blacklistPiiProperties = [
      { blacklistPiiProperties: 'nonPiiProp1', blacklistPiiHash: true },
      { blacklistPiiProperties: 'nonPiiProp2', blacklistPiiHash: false },
    ];
    const whitelistPiiProperties = undefined;
    const integrationsObj = undefined;

    const result = transformedPayloadData(
      message,
      customData,
      blacklistPiiProperties,
      whitelistPiiProperties,
      integrationsObj,
    );

    expect(result).toEqual({
      nonPiiProp1: '9cf22fd0154cc2a33179f3f567cb94dc0245e679700eb5b9ca4cd09cfaab8108',
      nonPiiProp2: 'lastName',
    });
  });

  it('test_custom_data_non_pii_blacklisted_hashed_properties', () => {
    const message = {
      properties: {
        email: 'email',
        nonPiiProp1: 'firstName',
        nonPiiProp2: 'lastName',
      },
    };
    const customData = {
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
      firstname: 'firstname',
      lastname: 'lastname',
      first_name: 'first_name',
      last_name: 'last_name',
      gender: 'gender',
      city: 'city',
      country: 'country',
      phone: 'phone',
      state: 'state',
      zip: 'zip',
      postalCode: 'postalCode',
      birthday: 'birthday',
      nonPiiProp1: 'firstName',
      nonPiiProp2: 'lastName',
    };
    const blacklistPiiProperties = [
      { blacklistPiiProperties: 'nonPiiProp1', blacklistPiiHash: true },
      { blacklistPiiProperties: 'nonPiiProp2', blacklistPiiHash: false },
    ];
    const whitelistPiiProperties = undefined;
    const integrationsObj = { hashed: true };

    const result = transformedPayloadData(
      message,
      customData,
      blacklistPiiProperties,
      whitelistPiiProperties,
      integrationsObj,
    );

    expect(result).toEqual({
      nonPiiProp1: 'firstName',
      nonPiiProp2: 'lastName',
    });
  });

  // Tests with empty customData parameter
  it('test_empty_custom_data', () => {
    const message = {};
    const customData = {};
    const blacklistPiiProperties = undefined;
    const whitelistPiiProperties = undefined;
    const integrationsObj = undefined;

    const result = transformedPayloadData(
      message,
      customData,
      blacklistPiiProperties,
      whitelistPiiProperties,
      integrationsObj,
    );

    expect(result).toEqual({});
  });
});
