const {
  deduceSegmentInfo,
  generateBasicAuthHeader,
  handleOperation,
  appendSuccessResponses,
} = require('./utils');

const { ConfigurationError } = require('@rudderstack/integrations-lib');

describe('deduceSegmentInfo', () => {
  // Returns segmentInfo with segmentId and identifierType when mappedToDestination is true
  it('should return segmentInfo with segmentId and identifierType when mappedToDestination is true', () => {
    const inputs = [
      {
        message: {
          context: {
            externalId: [{ type: 'CUSTOMERIO_SEGMENT-123', identifierType: 'email' }],
            mappedToDestination: true,
          },
        },
      },
    ];

    const result = deduceSegmentInfo(inputs);

    expect(result).toEqual({
      segmentId: '123',
      identifierType: 'email',
    });
  });

  // Returns an empty segmentInfo object when mappedToDestination is false
  it('should return empty segmentInfo when mappedToDestination is false', () => {
    const inputs = [{ message: { context: { externalId: [] } } }];
    const result = deduceSegmentInfo(inputs);
    expect(result).toEqual({});
  });

  // Throws ConfigurationError when objectType is null, undefined, or empty
  it('should throw ConfigurationError when objectType is null, undefined, or empty', () => {
    const inputs = [
      {
        message: {
          context: {
            externalId: [{ type: 'CUSTOMERIO_SEGMENT-', id: '12345', identifierType: 'email' }],
            mappedToDestination: true,
          },
        },
      },
    ];

    expect(() => deduceSegmentInfo(inputs)).toThrow(ConfigurationError);
  });
});

describe('generateBasicAuthHeader', () => {
  // Generates a valid Basic Auth header when provided with valid siteId and apiKey
  it('should generate a valid Basic Auth header when provided with valid siteId and apiKey', () => {
    const config = { siteId: 'testSiteId', apiKey: 'testApiKey' };
    const result = generateBasicAuthHeader(config);
    const expectedHeader = 'Basic ' + Buffer.from('testSiteId:testApiKey').toString('base64');
    expect(result).toBe(expectedHeader);
  });

  // Throws ConfigurationAuthError when siteId is missing
  it('should throw ConfigurationAuthError when siteId is missing', () => {
    const config = { apiKey: 'testApiKey' };
    expect(() => generateBasicAuthHeader(config)).toThrow(ConfigurationError);
  });
});

describe('handleOperation', () => {
  // Correctly identifies 'insert' action as upsert
  it('should identify "insert" action as upsert', () => {
    const input = { metadata: { id: 1 } };
    const fields = { id: '123' };
    const action = 'insert';
    const transformedResponseToBeBatched = {
      upsertData: [],
      upsertSuccessMetadata: [],
      deletionData: [],
      deletionSuccessMetadata: [],
    };
    const identifierType = 'id';

    handleOperation(input, fields, action, transformedResponseToBeBatched, identifierType);

    expect(transformedResponseToBeBatched.upsertData).toEqual([['123']]);
    expect(transformedResponseToBeBatched.upsertSuccessMetadata).toEqual([{ id: 1 }]);
  });

  // Handles empty input object gracefully
  it('should handle empty input object gracefully', () => {
    const input = {};
    const fields = { id: '123' };
    const action = 'delete';
    const transformedResponseToBeBatched = {
      upsertData: [],
      upsertSuccessMetadata: [],
      deletionData: [],
      deletionSuccessMetadata: [],
    };
    const identifierType = 'id';

    handleOperation(input, fields, action, transformedResponseToBeBatched, identifierType);

    expect(transformedResponseToBeBatched.deletionData).toEqual([['123']]);
    expect(transformedResponseToBeBatched.deletionSuccessMetadata).toEqual([undefined]);
  });

  // Correctly identifies 'update' action as upsert
  it("should identify 'update' action as upsert", () => {
    const input = { metadata: 'sample metadata' };
    const fields = { id: 123 };
    const action = 'update';
    const transformedResponseToBeBatched = { upsertData: [], upsertSuccessMetadata: [] };
    const identifierType = 'id';

    handleOperation(input, fields, action, transformedResponseToBeBatched, identifierType);

    expect(transformedResponseToBeBatched.upsertData).toContainEqual([fields[identifierType]]);
    expect(transformedResponseToBeBatched.upsertSuccessMetadata).toContain(input.metadata);
  });

  // Correctly identifies other actions as deletion
  it('should identify other actions as deletion', () => {
    const input = { metadata: 'sample metadata' };
    const fields = { id: 123 };
    const action = 'delete';
    const transformedResponseToBeBatched = { deletionData: [], deletionSuccessMetadata: [] };
    const identifierType = 'id';

    handleOperation(input, fields, action, transformedResponseToBeBatched, identifierType);

    expect(transformedResponseToBeBatched.deletionData).toContainEqual([fields[identifierType]]);
    expect(transformedResponseToBeBatched.deletionSuccessMetadata).toContain(input.metadata);
  });

  // Adds identifierType field to upsertData when action is 'insert'
  it('should add identifierType field to upsertData when action is insert', () => {
    const input = { metadata: 'sampleMetadata' };
    const fields = { email: 'test@example.com' };
    const action = 'insert';
    const transformedResponseToBeBatched = { upsertData: [], upsertSuccessMetadata: [] };
    const identifierType = 'email';

    handleOperation(input, fields, action, transformedResponseToBeBatched, identifierType);

    expect(transformedResponseToBeBatched.upsertData).toEqual([['test@example.com']]);
    expect(transformedResponseToBeBatched.upsertSuccessMetadata).toEqual(['sampleMetadata']);
  });

  // Adds identifierType field to upsertData when action is 'update'
  it('should add identifierType field to upsertData when action is update', () => {
    const input = { metadata: 'sampleMetadata' };
    const fields = { email: 'test@example.com' };
    const action = 'update';
    const transformedResponseToBeBatched = { upsertData: [], upsertSuccessMetadata: [] };
    const identifierType = 'email';

    handleOperation(input, fields, action, transformedResponseToBeBatched, identifierType);

    expect(transformedResponseToBeBatched.upsertData).toEqual([['test@example.com']]);
    expect(transformedResponseToBeBatched.upsertSuccessMetadata).toEqual(['sampleMetadata']);
  });
});
