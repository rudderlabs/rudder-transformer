const {
  transformedPayloadData,
  fetchUserData,
  deduceFbcParam,
  getContentType,
  isHtmlFormat,
} = require('./index');
const sha256 = require('sha256');
const { MAPPING_CONFIG, CONFIG_CATEGORIES } = require('../../destinations/facebook_pixel/config');

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

describe('deduceFbcParam', () => {
  // Should return undefined if message.context.page.url is undefined
  it('should return undefined when message.context.page.url is undefined', () => {
    const message = {};
    const result = deduceFbcParam(message);
    expect(result).toBeUndefined();
  });

  // Should return undefined if URL constructor throws an error
  it('should return undefined when URL constructor throws an error', () => {
    const message = {
      context: {
        page: {
          url: 'invalid-url',
        },
      },
    };
    const result = deduceFbcParam(message);
    expect(result).toBeUndefined();
  });

  // Should return undefined if fbclid is undefined
  it('should return undefined when fbclid is undefined', () => {
    const message = {
      context: {
        page: {
          url: 'https://example.com',
        },
      },
    };
    const result = deduceFbcParam(message);
    expect(result).toBeUndefined();
  });

  // Should handle message with empty context object
  it('should handle message with empty context object', () => {
    const message = {
      context: {},
    };
    const result = deduceFbcParam(message);
    expect(result).toBeUndefined();
  });

  // Should handle message with empty page object
  it('should handle message with empty page object', () => {
    const message = {
      context: {
        page: {},
      },
    };
    const result = deduceFbcParam(message);
    expect(result).toBeUndefined();
  });

  // Should handle message with empty url string
  it('should handle message with empty url string', () => {
    const message = {
      context: {
        page: {
          url: '',
        },
      },
    };
    const result = deduceFbcParam(message);
    expect(result).toBeUndefined();
  });

  // Should return fbc parameter when all conditions are met
  it('should return fbc parameter when all conditions are met', () => {
    const message = {
      context: {
        page: {
          url: 'https://example.com?fbclid=123456',
        },
      },
    };
    const result = deduceFbcParam(message);
    expect(result).toEqual(expect.stringContaining('fb.1.'));
  });
});

describe('fetchUserData', () => {
  const message = {
    channel: 'web',
    context: {
      traits: {
        name: 'Rudder Test',
        email: 'abc@gmail.com',
        firstname: 'Rudder',
        lastname: 'Test',
        phone: 9000000000,
        gender: 'female',
      },
      app: {
        build: '1.0.0',
        name: 'RudderLabs JavaScript SDK',
        namespace: 'com.rudderlabs.javascript',
        version: '1.0.0',
      },
      library: {
        name: 'RudderLabs JavaScript SDK',
        version: '1.0.0',
      },
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
      locale: 'en-US',
      ip: '0.0.0.0',
      os: {
        name: '',
        version: '',
      },
      screen: {
        density: 2,
      },
    },
    properties: {
      plan: 'standard plan',
      name: 'rudder test',
    },
    type: 'identify',
    messageId: '84e26acc-56a5-4835-8233-591137fca468',
    originalTimestamp: '2023-10-14T15:46:51.693229+05:30',
    anonymousId: '00000000000000000000000000',
    userId: '123456',
    integrations: {
      All: true,
    },
    sentAt: '2019-10-14T09:03:22.563Z',
  };

  const Config = {
    blacklistPiiProperties: [
      {
        blacklistPiiProperties: '',
        blacklistPiiHash: false,
      },
    ],
    accessToken: '09876',
    pixelId: 'dummyPixelId',
    eventsToEvents: [
      {
        from: '',
        to: '',
      },
    ],
    eventCustomProperties: [
      {
        eventCustomProperties: '',
      },
    ],
    valueFieldIdentifier: '',
    advancedMapping: true,
    whitelistPiiProperties: [
      {
        whitelistPiiProperties: '',
      },
    ],
  };

  // Returns a valid user data object when given valid inputs.
  it('should return a valid user data object when given valid inputs without integrations object', () => {
    const mappingJson = MAPPING_CONFIG[CONFIG_CATEGORIES.USERDATA.name];
    const destinationName = 'fb_pixel';

    const result = fetchUserData(message, Config, mappingJson, destinationName);

    expect(result).toEqual({
      external_id: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
      ph: '593a6d58f34eb5c3de4f47e38d1faaa7d389fafe332a85400b1e54498391c579',
      ge: '252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111',
      ln: '532eaabd9574880dbf76b9b8cc00832c20a6ec113d682299550d7a6e0f345e25',
      fn: '2c2ccf28d806f6f9a34b67aa874d2113b7ac1444f1a4092541b8b75b84771747',
      client_ip_address: '0.0.0.0',
      client_user_agent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
      fbc: undefined,
    });
  });

  it('should return a valid user data object when given valid inputs with integrations object', () => {
    const mappingJson = MAPPING_CONFIG[CONFIG_CATEGORIES.USERDATA.name];
    const destinationName = 'fb_pixel';
    message.integrations.FacebookPixel = { hashed: true };

    const result = fetchUserData(message, Config, mappingJson, destinationName);

    expect(result).toEqual({
      em: 'abc@gmail.com',
      external_id: '123456',
      ph: '9000000000',
      ge: '252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111',
      ln: 'Test',
      fn: 'Rudder',
      client_ip_address: '0.0.0.0',
      client_user_agent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
      fbc: undefined,
    });
  });

  it('should return null when mappingJson is undefined', () => {
    const mappingJson = undefined;
    const destinationName = 'fb_pixel';
    const result = fetchUserData(message, Config, mappingJson, destinationName);

    expect(result).toBeNull();
  });

  it('should return hashed data when destinationName is undefined', () => {
    const mappingJson = MAPPING_CONFIG[CONFIG_CATEGORIES.USERDATA.name];
    const destinationName = undefined;

    const result = fetchUserData(message, Config, mappingJson, destinationName);

    expect(result).toEqual({
      client_ip_address: '0.0.0.0',
      client_user_agent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
      external_id: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
      fbc: undefined,
      fn: '2c2ccf28d806f6f9a34b67aa874d2113b7ac1444f1a4092541b8b75b84771747',
      ge: '252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111',
      ln: '532eaabd9574880dbf76b9b8cc00832c20a6ec113d682299550d7a6e0f345e25',
      ph: '593a6d58f34eb5c3de4f47e38d1faaa7d389fafe332a85400b1e54498391c579',
    });
  });
});

describe('getContentType', () => {
  // Returns default value when no category or categoryToContent is provided
  it('should return default value when no category or categoryToContent is provided', () => {
    const message = {
      properties: {
        produtcs: [
          {
            product_id: '123',
          },
        ],
      },
    };
    const defaultValue = 'product';
    const categoryToContent = [];
    const destinationName = 'fb_pixel';

    const result = getContentType(message, defaultValue, categoryToContent, destinationName);

    expect(result).toBe(defaultValue);
  });

  // Returns default value when categoryToContent is not an array
  it('should return default value when categoryToContent is not an array', () => {
    const message = {
      properties: {
        products: [
          {
            product_id: '123',
          },
        ],
      },
    };
    const defaultValue = 'product';
    const categoryToContent = 'not an array';
    const destinationName = 'fb_pixel';

    const result = getContentType(message, defaultValue, categoryToContent, destinationName);

    expect(result).toBe(defaultValue);
  });

  // Returns categoryToContent value when category is provided and matches with categoryToContent
  it('should return categoryToContent value when category is provided and matches with categoryToContent', () => {
    const message = {
      properties: {
        category: 'clothing',
      },
    };
    const defaultValue = 'product';
    const categoryToContent = [{ from: 'clothing', to: 'garments' }];
    const destinationName = 'fb_pixel';

    const result = getContentType(message, defaultValue, categoryToContent, destinationName);

    expect(result).toBe(categoryToContent[0].to);
  });

  // Returns integrationsObj.contentType when it exists
  it('should return integrationsObj.contentType when it exists', () => {
    const message = {
      properties: {
        products: [
          {
            product_id: '123',
          },
        ],
      },
      integrations: {
        fb_pixel: {
          contentType: 'content_type_value',
        },
      },
    };
    const defaultValue = 'product';
    const categoryToContent = [];
    const destinationName = 'fb_pixel';
    const integrationsObj = {
      contentType: 'content_type_value',
    };

    const result = getContentType(message, defaultValue, categoryToContent, destinationName);

    expect(result).toBe(integrationsObj.contentType);
  });

  // Returns 'product' when category is 'clothing' and categoryToContent is not provided
  it("should return 'product' when category is 'clothing' and categoryToContent is not provided", () => {
    const message = {
      properties: {
        category: 'clothing',
      },
    };
    const defaultValue = 'product';
    const categoryToContent = [];
    const destinationName = 'fb_pixel';

    const result = getContentType(message, defaultValue, categoryToContent, destinationName);

    expect(result).toBe(defaultValue);
  });

  it('should return default value when no product array or categoryToContent is provided', () => {
    const message = {
      properties: {
        revenue: 1234,
      },
    };
    const defaultValue = 'product';
    const categoryToContent = [];
    const destinationName = 'fb_pixel';

    const result = getContentType(message, defaultValue, categoryToContent, destinationName);

    expect(result).toBe(defaultValue);
  });
});

describe('isHtmlFormat', () => {
  it('should return false for Json', () => {
    expect(isHtmlFormat('{"a": 1, "b":2}')).toBe(false);
  });

  it('should return false for empty Json', () => {
    expect(isHtmlFormat('{}')).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isHtmlFormat(undefined)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isHtmlFormat(null)).toBe(false);
  });

  it('should return false for empty array', () => {
    expect(isHtmlFormat([])).toBe(false);
  });

  it('should return true for html doctype', () => {
    expect(
      isHtmlFormat(
        '<!DOCTYPE html><html lang="en"><body><div style="text-align: center; margin-top: 50px;"><h1>Sorry, something went wrong.</h1><p>We\'re working on it and we\'ll get it fixed as soon as we can.</p><p><a href="javascript:history.back()">Go Back</a></p><footer><p>Facebook &copy; 2024 &middot; <a href="https://www.facebook.com/help/">Help Center</a></p></footer></div></body></html>',
      ),
    ).toBe(true);
  });

  it('should return true for html', () => {
    expect(
      isHtmlFormat(
        '<head> <title>Hello, World!</title><link rel="stylesheet" href="styles.css" /></head><body><h1 class="title">Hello World! </h1><p id="currentTime"></p><script src="script.js"></script></body></html>',
      ),
    ).toBe(true);
  });

  it('should return true for html', () => {
    expect(
      isHtmlFormat(
        '<html><body><h1 class="title">Hello World! </h1><p id="currentTime"></p><script src="script.js"></script></body></html>',
      ),
    ).toBe(true);
  });

  it('should return false json type', () => {
    expect(isHtmlFormat('{"<a>": 12, "b": "test, "arr": [1,2]}')).toBe(false);
  });
});
