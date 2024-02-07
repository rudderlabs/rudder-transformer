const { separateReservedAndRestMetadata } = require('./util');

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
