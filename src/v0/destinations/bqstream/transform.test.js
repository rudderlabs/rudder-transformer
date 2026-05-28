const { processRouterDest } = require('./transform');

describe('bqstream processRouterDest', () => {
  const destination = {
    Config: {
      projectId: 'gc-project-id',
      datasetId: 'gc_dataset',
      tableId: 'gc_table',
      insertId: 'productId',
    },
    ID: 'destination-id',
    Name: 'bqstream test',
  };

  it('should backward-compatibly batch pass-through events with legacy properties payload', () => {
    const input = [
      {
        message: {
          statusCode: 200,
          datasetId: 'gc_dataset',
          tableId: 'gc_table',
          projectId: 'gc-project-id',
          properties: { productId: 42, productName: 'Product-42' },
        },
        metadata: [{ jobId: 1 }],
        destination,
      },
    ];

    const output = processRouterDest(input);

    expect(output).toEqual([
      {
        batched: true,
        batchedRequest: {
          datasetId: 'gc_dataset',
          tableId: 'gc_table',
          projectId: 'gc-project-id',
          rows: [{ json: { productId: 42, productName: 'Product-42' }, insertId: '42' }],
        },
        metadata: [{ jobId: 1 }],
        destination,
        statusCode: 200,
      },
    ]);
  });

  it('should flatten all pass-through rows into the batch', () => {
    const input = [
      {
        message: {
          statusCode: 200,
          datasetId: 'gc_dataset',
          tableId: 'gc_table',
          projectId: 'gc-project-id',
          rows: [
            { json: { productId: 1, productName: 'P1' }, insertId: '1' },
            { json: { productId: 2, productName: 'P2' }, insertId: '2' },
          ],
        },
        metadata: [{ jobId: 1 }],
        destination,
      },
    ];

    const output = processRouterDest(input);

    expect(output).toEqual([
      {
        batched: true,
        batchedRequest: {
          datasetId: 'gc_dataset',
          tableId: 'gc_table',
          projectId: 'gc-project-id',
          rows: [
            { json: { productId: 1, productName: 'P1' }, insertId: '1' },
            { json: { productId: 2, productName: 'P2' }, insertId: '2' },
          ],
        },
        metadata: [{ jobId: 1 }, { jobId: 1 }],
        destination,
        statusCode: 200,
      },
    ]);
  });

  it('should convert malformed pass-through events to per-event errors', () => {
    const input = [
      {
        message: {
          statusCode: 200,
          datasetId: 'gc_dataset',
          tableId: 'gc_table',
          projectId: 'gc-project-id',
        },
        metadata: [{ jobId: 1 }],
        destination,
      },
      {
        message: {
          statusCode: 200,
          datasetId: 'gc_dataset',
          tableId: 'gc_table',
          projectId: 'gc-project-id',
          properties: { productId: 42, productName: 'Product-42' },
        },
        metadata: [{ jobId: 2 }],
        destination,
      },
    ];

    const output = processRouterDest(input);

    expect(output).toHaveLength(2);
    expect(output[0]).toMatchObject({
      batched: true,
      statusCode: 200,
      batchedRequest: {
        rows: [{ json: { productId: 42, productName: 'Product-42' }, insertId: '42' }],
      },
      metadata: [{ jobId: 2 }],
    });
    expect(output[1]).toMatchObject({
      batched: false,
      statusCode: 400,
      error: 'Invalid payload for the destination',
      metadata: [[{ jobId: 1 }]],
    });
  });
});
