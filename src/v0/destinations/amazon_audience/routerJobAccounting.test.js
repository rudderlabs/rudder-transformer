jest.mock('../../../util/errorNotifier', () => ({
  client: {
    notify: jest.fn(),
  },
}));

jest.mock('../../../util/stats', () => ({
  increment: jest.fn(),
}));

const stats = require('../../../util/stats');
const { processRouterDest } = require('./transform');

const destination = {
  ID: 'amazonAud-1234',
  Config: {
    audienceId: 'dummyAudienceId',
    enableHash: false,
  },
};

const buildMetadata = (jobId) => ({
  jobId,
  workspaceId: 'workspace-1',
  destinationId: 'destination-1',
  secret: {
    accessToken: 'access-token',
    clientId: 'client-id',
  },
});

const buildRecordInput = (jobId, messageOverrides = {}) => ({
  destination,
  metadata: buildMetadata(jobId),
  message: {
    type: 'record',
    action: 'insert',
    fields: {
      email: `user-${jobId}@example.com`,
    },
    ...messageOverrides,
  },
});

// Mirrors rudder-server's check: input jobIds are a set; output jobIds are counted
// once per destination job metadata set.
const accounting = (inputs, outputs) => {
  const inSet = new Set(inputs.map((input) => input.metadata.jobId));
  const out = [];
  (outputs ?? []).forEach((output) => {
    const perOutput = new Set();
    (output?.metadata ?? []).forEach((metadata) => perOutput.add(metadata.jobId));
    perOutput.forEach((jobId) => out.push(jobId));
  });

  return {
    in: inSet.size,
    out: out.length,
    dropped: [...inSet].filter((jobId) => !out.includes(jobId)),
    duplicated: out.filter((jobId, index) => out.indexOf(jobId) !== index),
  };
};

describe('amazon_audience router job accounting', () => {
  it('aborts a statusCode-poisoned record without dropping jobs and preserves valid batching', async () => {
    const inputs = [
      buildRecordInput(1, {
        statusCode: 200,
        action: 'add',
        user: {
          email: 'poisoned@example.com',
        },
      }),
      buildRecordInput(2),
    ];

    const outputs = await processRouterDest(inputs, {});

    expect(accounting(inputs, outputs)).toEqual({
      in: 2,
      out: 2,
      dropped: [],
      duplicated: [],
    });
    expect(stats.increment).toHaveBeenCalledWith('amazon_audience_unbatchable_event_count', {
      reason: 'unsupported_action',
    });
    expect(outputs).toEqual([
      expect.objectContaining({
        batched: true,
        statusCode: 200,
        destination,
        metadata: [inputs[1].metadata],
        batchedRequest: expect.objectContaining({
          body: expect.objectContaining({
            JSON: expect.objectContaining({
              associateUsers: expect.objectContaining({
                patches: [
                  expect.objectContaining({
                    op: 'add',
                    value: ['dummyAudienceId'],
                  }),
                ],
              }),
              createUsers: expect.objectContaining({
                records: [
                  expect.objectContaining({
                    hashedRecords: [{ email: 'user-2@example.com' }],
                  }),
                ],
              }),
            }),
          }),
        }),
      }),
      {
        metadata: [inputs[0].metadata],
        batched: false,
        statusCode: 400,
        error: '[AMAZON AUDIENCE]: Event cannot be batched due to unsupported action',
        statTags: {
          errorType: 'aborted',
          errorCategory: 'dataValidation',
        },
        destination,
      },
    ]);
  });

  it('keeps per-event transform errors out of batching and returns them exactly once', async () => {
    const inputs = [
      buildRecordInput(1),
      {
        destination,
        metadata: buildMetadata(2),
        message: {
          type: 'identify',
          context: {},
        },
      },
    ];

    const outputs = await processRouterDest(inputs, {});

    expect(accounting(inputs, outputs)).toEqual({
      in: 2,
      out: 2,
      dropped: [],
      duplicated: [],
    });
    expect(outputs).toEqual([
      expect.objectContaining({
        batched: true,
        statusCode: 200,
        destination,
        metadata: [inputs[0].metadata],
      }),
      {
        metadata: [inputs[1].metadata],
        batched: false,
        statusCode: 400,
        error: '[AMAZON AUDIENCE]: identify is not supported',
        statTags: {
          errorCategory: 'dataValidation',
          errorType: 'instrumentation',
        },
        destination,
      },
    ]);
  });
});
