const { InstrumentationError } = require('../../util/errorTypes');
const {
  transformForRecordEvent,
} = require('../../../../src/v0/destinations/marketo_static_list/util');

describe('transformForRecordEvent', () => {
  // Should correctly transform an input with action 'insert'
  test('should correctly transform an input with action "insert"', () => {
    const inputs = [
      {
        message: {
          type: 'record',
          fields: { id: 1 },
          action: 'insert',
          properties: { listData: { add: [], remove: [] } },
        },
        metadata: 'metadata1',
      },
    ];
    const leadIdObj = { insert: [], delete: [] };
    const expectedOutput = [
      {
        message: {
          type: 'record',
          fields: { id: 1 },
          action: 'insert',
          properties: { listData: { add: [{ id: 1 }], remove: [] } },
        },
        metadata: ['metadata1'],
      },
    ];

    const result = transformForRecordEvent(inputs, leadIdObj);

    expect(result).toEqual(expectedOutput);
  });

  // Should correctly transform an input with action 'delete'
  test('should correctly transform an input with action "delete"', () => {
    const inputs = [
      {
        message: {
          type: 'record',
          fields: { id: 1 },
          action: 'delete',
          properties: { listData: { add: [], remove: [] } },
        },
        metadata: 'metadata1',
      },
    ];
    const leadIdObj = { insert: [], delete: [] };
    const expectedOutput = [
      {
        message: {
          type: 'record',
          fields: { id: 1 },
          action: 'delete',
          properties: { listData: { add: [], remove: [{ id: 1 }] } },
        },
        metadata: ['metadata1'],
      },
    ];

    const result = transformForRecordEvent(inputs, leadIdObj);

    expect(result).toEqual(expectedOutput);
  });

  // Should raise an InstrumentationError if action is not valid
  test('should raise an InstrumentationError if action is not valid', () => {
    const inputs = [
      {
        message: {
          fields: { id: 1 },
          action: 'invalid',
          properties: { listData: { add: [], remove: [] } },
        },
        metadata: 'metadata1',
      },
    ];
    const leadIdObj = { insert: [], delete: [] };

    expect(() => {
      transformForRecordEvent(inputs, leadIdObj);
    }).toThrow(InstrumentationError);
  });

  // Should raise an InstrumentationError on input with no fields
  test('should raise an InstrumentationError on input with no fields', () => {
    const inputs = [
      {
        message: {
          action: 'insert',
          properties: { listData: { add: [], remove: [] } },
        },
        metadata: 'metadata1',
      },
    ];
    const leadIdObj = { insert: [], delete: [] };

    expect(() => {
      transformForRecordEvent(inputs, leadIdObj);
    }).toThrow(InstrumentationError);
  });

  // Should correctly transform an input with 2 insert payloads
  test('should correctly transform an input with 2 insert payloads', () => {
    const inputs = [
      {
        message: {
          type: 'record',
          fields: { id: 1 },
          action: 'insert',
          properties: { listData: { add: [], remove: [] } },
        },
        metadata: 'metadata1',
      },
      {
        message: {
          type: 'record',
          fields: { id: 2 },
          action: 'insert',
          properties: { listData: { add: [], remove: [] } },
        },
        metadata: 'metadata2',
      },
    ];
    const leadIdObj = { insert: [], delete: [] };
    const expectedOutput = [
      {
        message: {
          type: 'record',
          fields: { id: 1 },
          action: 'insert',
          properties: { listData: { add: [{ id: 1 }, { id: 2 }], remove: [] } },
        },
        metadata: ['metadata1', 'metadata2'],
      },
    ];

    const result = transformForRecordEvent(inputs, leadIdObj);

    expect(result).toEqual(expectedOutput);
  });

  // Should correctly transform an input with 2 delete payloads
  test('should correctly transform an input with 2 delete payloads', () => {
    const inputs = [
      {
        message: {
          type: 'record',
          fields: { id: 1 },
          action: 'delete',
          properties: { listData: { add: [], remove: [] } },
        },
        metadata: 'metadata1',
      },
      {
        message: {
          type: 'record',
          fields: { id: 2 },
          action: 'delete',
          properties: { listData: { add: [], remove: [] } },
        },
        metadata: 'metadata2',
      },
    ];
    const leadIdObj = { insert: [], delete: [] };
    const expectedOutput = [
      {
        message: {
          type: 'record',
          fields: { id: 1 },
          action: 'delete',
          properties: { listData: { remove: [{ id: 1 }, { id: 2 }], add: [] } },
        },
        metadata: ['metadata1', 'metadata2'],
      },
    ];

    const result = transformForRecordEvent(inputs, leadIdObj);

    expect(result).toEqual(expectedOutput);
  });

  // Should correctly transform an input with 2 insert and 2 delete payloads
  test('should correctly transform an input with 2 insert and 2 delete payloads', () => {
    const inputs = [
      {
        message: {
          type: 'record',
          fields: { id: 1 },
          action: 'delete',
          properties: { listData: { add: [], remove: [] } },
        },
        metadata: 'metadata1',
      },
      {
        message: {
          type: 'record',
          fields: { id: 2 },
          action: 'insert',
          properties: { listData: { add: [], remove: [] } },
        },
        metadata: 'metadata2',
      },
      {
        message: {
          type: 'record',
          fields: { id: 3 },
          action: 'delete',
          properties: { listData: { add: [], remove: [] } },
        },
        metadata: 'metadata3',
      },
      {
        message: {
          type: 'record',
          fields: { id: 4 },
          action: 'insert',
          properties: { listData: { add: [], remove: [] } },
        },
        metadata: 'metadata4',
      },
    ];
    const leadIdObj = { insert: [], delete: [] };
    const expectedOutput = [
      {
        message: {
          type: 'record',
          fields: { id: 1 },
          action: 'delete',
          properties: { listData: { remove: [{ id: 1 }, { id: 3 }], add: [{ id: 2 }, { id: 4 }] } },
        },
        metadata: ['metadata1', 'metadata2', 'metadata3', 'metadata4'],
      },
    ];

    const result = transformForRecordEvent(inputs, leadIdObj);

    expect(result).toEqual(expectedOutput);
  });
});
