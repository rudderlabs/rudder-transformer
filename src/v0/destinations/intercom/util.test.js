const { getLookUpField, getBaseEndpoint, separateReservedAndRestMetadata } = require('./util');
const { BASE_ENDPOINT, BASE_EU_ENDPOINT, BASE_AU_ENDPOINT } = require('./config');

describe('separateReservedAndRestMetadata utility test', () => {
  it('separate reserved and rest metadata', () => {
    const metadata = {
      property1: 1,
      property2: 'test',
      property3: true,
      property4: {
        property1: 1,
        property2: 'test',
        property3: {
          subProp1: {
            a: 'a',
            b: 'b',
          },
          subProp2: ['a', 'b'],
        },
      },
      property5: {},
      property6: [],
      property7: null,
      property8: undefined,
      revenue: {
        amount: 1232,
        currency: 'inr',
        test: 123,
      },
      price: {
        amount: 3000,
        currency: 'USD',
      },
      article: {
        url: 'https://example.org/ab1de.html',
        value: 'the dude abides',
      },
    };
    const expectedReservedMetadata = {
      revenue: {
        amount: 1232,
        currency: 'inr',
        test: 123,
      },
      price: {
        amount: 3000,
        currency: 'USD',
      },
      article: {
        url: 'https://example.org/ab1de.html',
        value: 'the dude abides',
      },
    };
    const expectedRestMetadata = {
      property1: 1,
      property2: 'test',
      property3: true,
      property4: {
        property1: 1,
        property2: 'test',
        property3: {
          subProp1: {
            a: 'a',
            b: 'b',
          },
          subProp2: ['a', 'b'],
        },
      },
      property5: {},
      property6: [],
      property7: null,
      property8: undefined,
    };
    const { reservedMetadata, restMetadata } = separateReservedAndRestMetadata(metadata);

    expect(expectedReservedMetadata).toEqual(reservedMetadata);
    expect(expectedRestMetadata).toEqual(restMetadata);
  });

  it('reserved metadata types not present in input metadata', () => {
    const metadata = {
      property1: 1,
      property2: 'test',
      property3: true,
      property4: {
        property1: 1,
        property2: 'test',
        property3: {
          subProp1: {
            a: 'a',
            b: 'b',
          },
          subProp2: ['a', 'b'],
        },
      },
      property5: {},
      property6: [],
      property7: null,
      property8: undefined,
    };
    const expectedRestMetadata = {
      property1: 1,
      property2: 'test',
      property3: true,
      property4: {
        property1: 1,
        property2: 'test',
        property3: {
          subProp1: {
            a: 'a',
            b: 'b',
          },
          subProp2: ['a', 'b'],
        },
      },
      property5: {},
      property6: [],
      property7: null,
      property8: undefined,
    };
    const { reservedMetadata, restMetadata } = separateReservedAndRestMetadata(metadata);

    expect({}).toEqual(reservedMetadata);
    expect(expectedRestMetadata).toEqual(restMetadata);
  });

  it('metadata input contains only reserved metadata types', () => {
    const metadata = {
      revenue: {
        amount: 1232,
        currency: 'inr',
        test: 123,
      },
      price: {
        amount: 3000,
        currency: 'USD',
      },
      article: {
        url: 'https://example.org/ab1de.html',
        value: 'the dude abides',
      },
    };
    const expectedReservedMetadata = {
      revenue: {
        amount: 1232,
        currency: 'inr',
        test: 123,
      },
      price: {
        amount: 3000,
        currency: 'USD',
      },
      article: {
        url: 'https://example.org/ab1de.html',
        value: 'the dude abides',
      },
    };
    const { reservedMetadata, restMetadata } = separateReservedAndRestMetadata(metadata);

    expect(expectedReservedMetadata).toEqual(reservedMetadata);
    expect({}).toEqual(restMetadata);
  });

  it('empty metadata object', () => {
    const metadata = {};
    const { reservedMetadata, restMetadata } = separateReservedAndRestMetadata(metadata);
    expect({}).toEqual(reservedMetadata);
    expect({}).toEqual(restMetadata);
  });

  it('null/undefined metadata', () => {
    const metadata = null;
    const { reservedMetadata, restMetadata } = separateReservedAndRestMetadata(metadata);
    expect({}).toEqual(reservedMetadata);
    expect({}).toEqual(restMetadata);
  });
});

describe('getBaseEndpoint', () => {
  // Returns BASE_EU_ENDPOINT when apiServer is 'eu'
  it('should return BASE_EU_ENDPOINT when apiServer is "eu"', () => {
    const destination = {
      Config: {
        apiServer: 'eu',
      },
    };
    const result = getBaseEndpoint(destination);
    expect(result).toBe(BASE_EU_ENDPOINT);
  });

  // Returns BASE_AU_ENDPOINT when apiServer is 'au'
  it('should return BASE_AU_ENDPOINT when apiServer is "au"', () => {
    const destination = {
      Config: {
        apiServer: 'au',
      },
    };
    const result = getBaseEndpoint(destination);
    expect(result).toBe(BASE_AU_ENDPOINT);
  });

  // Returns BASE_ENDPOINT when apiServer is standard
  it('should return BASE_ENDPOINT when apiServer is standard', () => {
    const destination = {
      Config: {
        apiServer: 'standard',
      },
    };
    const result = getBaseEndpoint(destination);
    expect(result).toBe(BASE_ENDPOINT);
  });
});

// Generated by CodiumAI

describe('getLookUpField', () => {
  // Returns 'email' by default
  it('should return "email" by default', () => {
    const message = {};
    expect(getLookUpField(message)).toBe('email');
  });

  // Returns 'lookup' field from integrationsObj if defined
  it('should return "lookup" field from integrationsObj if defined', () => {
    const message = {
      integrations: {
        intercom: {
          lookup: 'phone',
        },
      },
    };
    expect(getLookUpField(message)).toBe('phone');
  });
});
