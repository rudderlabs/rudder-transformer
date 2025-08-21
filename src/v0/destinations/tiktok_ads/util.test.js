const { getContents, hashUserField, getEventSource } = require('./util');

describe('getContents utility test', () => {
  it('product id sent as number', () => {
    const message = {
      properties: {
        products: [
          {
            product_id: 123,
            sku: 'G-32',
            name: 'Monopoly',
            price: 14,
            quantity: 1,
            category: 'Games',
            url: 'https://www.website.com/product/path',
            image_url: 'https://www.website.com/product/path.jpg',
          },
          {
            product_id: 345,
            sku: 'F-32',
            name: 'UNO',
            price: 3.45,
            quantity: 2,
            category: 'Games',
          },
        ],
      },
    };
    const expectedOutput = [
      {
        content_type: 'product',
        content_id: '123',
        content_category: 'Games',
        content_name: 'Monopoly',
        price: 14,
        quantity: 1,
      },
      {
        content_type: 'product',
        content_id: '345',
        content_category: 'Games',
        content_name: 'UNO',
        price: 3.45,
        quantity: 2,
      },
    ];

    expect(expectedOutput).toEqual(getContents(message));
  });

  it('product id sent as string', () => {
    const message = {
      properties: {
        products: [
          {
            product_id: '123',
            sku: 'G-32',
            name: 'Monopoly',
            price: 14,
            quantity: 1,
            category: 'Games',
            url: 'https://www.website.com/product/path',
            image_url: 'https://www.website.com/product/path.jpg',
          },
          {
            product_id: '345',
            sku: 'F-32',
            name: 'UNO',
            price: 3.45,
            quantity: 2,
            category: 'Games',
          },
        ],
      },
    };
    const expectedOutput = [
      {
        content_type: 'product',
        content_id: '123',
        content_category: 'Games',
        content_name: 'Monopoly',
        price: 14,
        quantity: 1,
      },
      {
        content_type: 'product',
        content_id: '345',
        content_category: 'Games',
        content_name: 'UNO',
        price: 3.45,
        quantity: 2,
      },
    ];

    expect(expectedOutput).toEqual(getContents(message));
  });
});

describe('hashUserField utility test', () => {
  it('should return the updated user object with hashed fields', () => {
    const user = {
      external_id: 123,
      email: 'test@example.com',
      phone: '+1234567890',
    };

    const hashedUser = hashUserField(user);

    expect(hashedUser).toEqual({
      external_id: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
      email: '973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b',
      phone: '422ce82c6fc1724ac878042f7d055653ab5e983d186e616826a72d4384b68af8',
    });
  });
  it('should hash external_id, email and phone fields when they are defined and not null or empty', () => {
    const user = {
      external_id: '123',
      email: 'test@example.com',
      phone: '+1234567890',
    };

    const hashedUser = hashUserField(user);

    expect(hashedUser.external_id).toBeDefined();
    expect(hashedUser.email).toBeDefined();
    expect(hashedUser.phone).toBeDefined();
  });

  it('should hash external_id field even if it contains multiple values in form of array', () => {
    const user = {
      external_id: ['123', '456', '789'],
      phone: ['+1234130697', '+e211134234'],
    };

    const hashedUser = hashUserField(user);

    expect(Array.isArray(hashedUser.external_id)).toBe(true);
    expect(hashedUser.external_id.length).toBe(user.external_id.length);
    hashedUser.external_id.forEach((hashedId, index) => {
      expect(hashedId).toBeDefined();
      expect(hashedId).not.toBe(user.external_id[index]);
    });
    hashedUser.phone.forEach((hashedId, index) => {
      expect(hashedId).toBeDefined();
      expect(hashedId).not.toBe(user.phone[index]);
    });
  });

  it('should not hash external_id, email or phone fields when they are undefined, null or empty', () => {
    const user = {
      external_id: undefined,
      email: null,
      phone: '',
    };

    const hashedUser = hashUserField(user);

    expect(hashedUser.external_id).toBeUndefined();
    expect(hashedUser.email).toBeNull();
    expect(hashedUser.phone).toBe('');
  });

  it('should not modify the original user object', () => {
    const user = {
      external_id: '123',
      email: 'test@example.com',
      phone: '1234567890',
    };

    const hashedUser = hashUserField(user);

    expect(hashedUser).not.toBe(user);
  });

  it('should hash idfa and gaid fields if present', () => {
    const user = {
      idfa: 'AEBE52E7-03EE-455A-B3C4-E57283966239',
      gaid: '38400000-8cf0-11bd-b23e-10b96e40000d',
    };
    const hashedUser = hashUserField(user);
    expect(hashedUser.idfa).toBeDefined();
    expect(hashedUser.idfa).not.toBe(user.idfa);
    expect(hashedUser.gaid).toBeDefined();
    expect(hashedUser.gaid).not.toBe(user.gaid);
  });

  it('should hash an array of phone numbers', () => {
    const user = {
      phone: ['+1234567890', '+0987654321'],
    };
    const hashedUser = hashUserField(user);
    expect(Array.isArray(hashedUser.phone)).toBe(true);
    hashedUser.phone.forEach((hashed, idx) => {
      expect(hashed).not.toBe(user.phone[idx]);
    });
  });
});

describe('getEventSource utility test', () => {
  it('should return the event source from the message properties', () => {
    const message = {
      properties: {
        eventSource: 'web',
      },
    };
    expect(getEventSource(message)).toBe('web');
  });
  it('returns channel if eventSource is missing and channel is valid', () => {
    const message = { properties: {}, channel: 'crm' };
    expect(getEventSource(message)).toBe('web');
  });
  it('returns channel if eventSource is invalid and channel is valid', () => {
    const message = { properties: { eventSource: 'invalid' }, channel: 'offline' };
    expect(getEventSource(message)).toBe('web');
  });
  it('returns "web" if both eventSource and channel are missing', () => {
    const message = { properties: {} };
    expect(getEventSource(message)).toBe('web');
  });
  it('returns "web" if both eventSource and channel are invalid', () => {
    const message = { properties: { eventSource: 'foo' }, channel: 'bar' };
    expect(getEventSource(message)).toBe('web');
  });
  it('returns eventSource if both eventSource and channel are valid', () => {
    const message = { properties: { eventSource: 'crm' }, channel: 'app' };
    expect(getEventSource(message)).toBe('crm');
  });
  it('returns "web" if properties is undefined', () => {
    const message = {};
    expect(getEventSource(message)).toBe('web');
  });
  it('should return event_source (snake_case) if present and valid', () => {
    const message = { properties: { event_source: 'app' } };
    expect(getEventSource(message)).toBe('app');
  });
  it('should prefer eventSource over event_source if both are present and valid', () => {
    const message = { properties: { eventSource: 'offline', event_source: 'app' } };
    expect(getEventSource(message)).toBe('offline');
  });
  it('if mobile is present, it should return app', () => {
    const message = { properties: { eventSource: 'mobile', event_source: 'web' } };
    expect(getEventSource(message)).toBe('web');
  });
});
