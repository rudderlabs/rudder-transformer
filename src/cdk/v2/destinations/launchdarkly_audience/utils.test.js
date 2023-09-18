const { prepareIdentifiersList, batchIdentifiersList } = require('./utils');

jest.mock(`./config`, () => {
  const originalConfig = jest.requireActual(`./config`);
  return {
    ...originalConfig,
    MAX_IDENTIFIERS: 2,
  };
});

describe('Unit test cases for prepareIdentifiersList', () => {
  it('should return an object with empty "add" and "remove" properties when no data is provided', () => {
    const result = prepareIdentifiersList({});
    expect(result).toEqual({ add: [], remove: [] });
  });

  it('should handle null input and return an object with empty "add" and "remove" identifiers list', () => {
    const result = prepareIdentifiersList(null);
    expect(result).toEqual({ add: [], remove: [] });
  });

  it('should handle undefined input and return an object with empty "add" and "remove" identifiers list', () => {
    const result = prepareIdentifiersList(undefined);
    expect(result).toEqual({ add: [], remove: [] });
  });

  it('should handle input with missing "add" or "remove" identifiers list and return an object with empty "add" and "remove" identifiers list', () => {
    const result = prepareIdentifiersList({ add: [], remove: undefined });
    expect(result).toEqual({ add: [], remove: [] });
  });

  it('should handle input with empty "add" or "remove" identifiers list and return an object with empty "add" and "remove" identifiers list', () => {
    const result = prepareIdentifiersList({ add: [], remove: [] });
    expect(result).toEqual({ add: [], remove: [] });
  });

  it('should handle input with non empty "add" or "remove" identifiers list and return an object non empty "add" and "remove" identifiers list', () => {
    const result = prepareIdentifiersList({
      add: [{ identifier: 'test1@email.com' }, { identifier: 'test2@email.com' }],
      remove: [{ identifier: 'test3@email.com' }],
    });
    expect(result).toEqual({
      add: [{ id: 'test1@email.com' }, { id: 'test2@email.com' }],
      remove: [{ id: 'test3@email.com' }],
    });
  });
});

describe('Unit test cases for batchIdentifiersList', () => {
  it('should correctly batch a list containing both "add" and "remove" actions', () => {
    const listData = {
      add: [
        { identifier: 'test1@email.com' },
        { identifier: 'test2@email.com' },
        { identifier: 'test3@email.com' },
      ],
      remove: [{ identifier: 'test4@email.com' }, { identifier: 'test5@email.com' }],
    };

    const expectedOutput = [
      {
        add: [{ id: 'test1@email.com' }, { id: 'test2@email.com' }],
        remove: [],
      },
      {
        add: [{ id: 'test3@email.com' }],
        remove: [{ id: 'test4@email.com' }],
      },
      {
        add: [],
        remove: [{ id: 'test5@email.com' }],
      },
    ];

    expect(batchIdentifiersList(listData)).toEqual(expectedOutput);
  });

  it('should correctly batch a list containing only "add" actions', () => {
    const listData = {
      add: [
        { identifier: 'test1@email.com' },
        { identifier: 'test2@email.com' },
        { identifier: 'test3@email.com' },
      ],
      remove: [],
    };

    const expectedOutput = [
      {
        add: [{ id: 'test1@email.com' }, { id: 'test2@email.com' }],
        remove: [],
      },
      {
        add: [{ id: 'test3@email.com' }],
        remove: [],
      },
    ];

    expect(batchIdentifiersList(listData)).toEqual(expectedOutput);
  });

  it('should correctly batch a list containing only "remove" actions', () => {
    const listData = {
      add: [],
      remove: [
        { identifier: 'test1@email.com' },
        { identifier: 'test2@email.com' },
        { identifier: 'test3@email.com' },
      ],
    };

    const expectedOutput = [
      {
        add: [],
        remove: [{ id: 'test1@email.com' }, { id: 'test2@email.com' }],
      },
      {
        add: [],
        remove: [{ id: 'test3@email.com' }],
      },
    ];

    expect(batchIdentifiersList(listData)).toEqual(expectedOutput);
  });

  it('should return an empty list for empty input list data', () => {
    const listData = {
      add: [{ identifier: '' }],
      remove: [],
    };

    const expectedOutput = [];

    expect(batchIdentifiersList(listData)).toEqual(expectedOutput);
  });
});
