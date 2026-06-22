const { networkHandler } = require('./networkHandler');

const metadata = [{ jobId: 1 }, { jobId: 2 }, { jobId: 3 }];
const invalidEmailResponse = {
  errors: [
    {
      code: 'invalid',
      detail: 'not-an-email is not a valid email address.',
      source: {
        pointer: '/data/attributes/profiles/data/1/attributes/email',
      },
    },
  ],
};

describe('klaviyo_bulk_upload networkHandler', () => {
  const handler = new networkHandler();

  it('returns a successful job state for every metadata entry', () => {
    expect(
      handler.responseHandler({
        destinationResponse: {
          status: 202,
          response: { data: { id: 'bulk-import-job-1' } },
        },
        rudderJobMetadata: metadata,
      }),
    ).toEqual({
      status: 202,
      message: '[klaviyo_bulk_upload Response Handler] - Request Processed Successfully',
      destinationResponse: {
        status: 202,
        response: { data: { id: 'bulk-import-job-1' } },
      },
      response: [
        { statusCode: 200, metadata: { jobId: 1 }, error: 'success' },
        { statusCode: 200, metadata: { jobId: 2 }, error: 'success' },
        { statusCode: 200, metadata: { jobId: 3 }, error: 'success' },
      ],
    });
  });

  it('aborts only the metadata entry mapped to a Klaviyo invalid email pointer', () => {
    expect(
      handler.responseHandler({
        destinationResponse: {
          status: 400,
          response: invalidEmailResponse,
        },
        rudderJobMetadata: metadata,
      }).response,
    ).toEqual([
      {
        statusCode: 500,
        metadata: { jobId: 1, dontBatch: true },
        error: JSON.stringify(invalidEmailResponse),
      },
      {
        statusCode: 400,
        metadata: { jobId: 2 },
        error: 'not-an-email is not a valid email address.',
      },
      {
        statusCode: 500,
        metadata: { jobId: 3, dontBatch: true },
        error: JSON.stringify(invalidEmailResponse),
      },
    ]);
  });

  it('uses the error text as a guard when Klaviyo maps an invalid email to the profile', () => {
    const profileMappedInvalidEmailResponse = {
      errors: [
        {
          code: 'invalid',
          detail: 'Email address is invalid.',
          source: {
            pointer: '/data/attributes/profiles/data/1/attributes',
          },
        },
      ],
    };

    expect(
      handler.responseHandler({
        destinationResponse: {
          status: 400,
          response: profileMappedInvalidEmailResponse,
        },
        rudderJobMetadata: metadata,
      }).response,
    ).toEqual([
      {
        statusCode: 500,
        metadata: { jobId: 1, dontBatch: true },
        error: JSON.stringify(profileMappedInvalidEmailResponse),
      },
      {
        statusCode: 400,
        metadata: { jobId: 2 },
        error: 'Email address is invalid.',
      },
      {
        statusCode: 500,
        metadata: { jobId: 3, dontBatch: true },
        error: JSON.stringify(profileMappedInvalidEmailResponse),
      },
    ]);
  });

  it('retries unmappable 400 batch failures outside the rejected batch', () => {
    const nonEmailResponse = {
      errors: [
        {
          code: 'invalid',
          detail: 'List relationship is invalid.',
          source: {
            pointer: '/data/relationships/lists/data/0/id',
          },
        },
      ],
    };

    expect(
      handler.responseHandler({
        destinationResponse: {
          status: 400,
          response: nonEmailResponse,
        },
        rudderJobMetadata: metadata,
      }).response,
    ).toEqual([
      {
        statusCode: 500,
        metadata: { jobId: 1, dontBatch: true },
        error: JSON.stringify(nonEmailResponse),
      },
      {
        statusCode: 500,
        metadata: { jobId: 2, dontBatch: true },
        error: JSON.stringify(nonEmailResponse),
      },
      {
        statusCode: 500,
        metadata: { jobId: 3, dontBatch: true },
        error: JSON.stringify(nonEmailResponse),
      },
    ]);
  });
});
